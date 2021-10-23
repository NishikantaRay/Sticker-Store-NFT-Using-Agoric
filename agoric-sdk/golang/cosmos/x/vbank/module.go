package vbank

import (
	"context"
	"encoding/json"
	stdlog "log"
	"strings"

	"github.com/gorilla/mux"
	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"github.com/spf13/cobra"

	"github.com/Agoric/agoric-sdk/golang/cosmos/x/vbank/client/cli"
	"github.com/Agoric/agoric-sdk/golang/cosmos/x/vbank/keeper"
	"github.com/Agoric/agoric-sdk/golang/cosmos/x/vbank/types"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/codec"
	cdctypes "github.com/cosmos/cosmos-sdk/codec/types"
	"github.com/cosmos/cosmos-sdk/types/module"

	sdk "github.com/cosmos/cosmos-sdk/types"
	abci "github.com/tendermint/tendermint/abci/types"
)

// type check to ensure the interface is properly implemented
var (
	_ module.AppModule      = AppModule{}
	_ module.AppModuleBasic = AppModuleBasic{}
)

// minCoins returns the minimum of each denomination.
// The input coins should be sorted.
func minCoins(a, b sdk.Coins) sdk.Coins {
	min := make([]sdk.Coin, 0)
	for indexA, indexB := 0, 0; indexA < len(a) && indexB < len(b); {
		coinA, coinB := a[indexA], b[indexB]
		switch strings.Compare(coinA.Denom, coinB.Denom) {
		case -1: // A < B
			indexA++
		case 0: // A == B
			minCoin := coinA
			if coinB.IsLT(minCoin) {
				minCoin = coinB
			}
			if !minCoin.IsZero() {
				min = append(min, minCoin)
			}
			indexA++
			indexB++
		case 1: // A > B
			indexB++
		}
	}
	return sdk.NewCoins(min...)
}

// app module Basics object
type AppModuleBasic struct {
	cdc codec.Codec
}

func (AppModuleBasic) Name() string {
	return ModuleName
}

func (AppModuleBasic) RegisterLegacyAminoCodec(cdc *codec.LegacyAmino) {
	RegisterCodec(cdc)
}

// RegisterInterfaces registers the module's interface types
func (b AppModuleBasic) RegisterInterfaces(registry cdctypes.InterfaceRegistry) {
	types.RegisterInterfaces(registry)
}

// DefaultGenesis returns default genesis state as raw bytes for the deployment
func (AppModuleBasic) DefaultGenesis(cdc codec.JSONCodec) json.RawMessage {
	return cdc.MustMarshalJSON(DefaultGenesisState())
}

// Validation check of the Genesis
func (AppModuleBasic) ValidateGenesis(cdc codec.JSONCodec, config client.TxEncodingConfig, bz json.RawMessage) error {
	var data types.GenesisState
	if err := cdc.UnmarshalJSON(bz, &data); err != nil {
		return err
	}
	return ValidateGenesis(&data)
}

// Register rest routes
func (AppModuleBasic) RegisterRESTRoutes(clientCtx client.Context, rtr *mux.Router) {
}

func (AppModuleBasic) RegisterGRPCGatewayRoutes(clientCtx client.Context, mux *runtime.ServeMux) {
	types.RegisterQueryHandlerClient(context.Background(), mux, types.NewQueryClient(clientCtx))
}

// GetTxCmd implements AppModuleBasic interface
func (AppModuleBasic) GetTxCmd() *cobra.Command {
	return nil
}

// GetQueryCmd implements AppModuleBasic interface
func (AppModuleBasic) GetQueryCmd() *cobra.Command {
	return cli.GetQueryCmd()
}

type AppModule struct {
	AppModuleBasic
	keeper Keeper
}

// NewAppModule creates a new AppModule Object
func NewAppModule(k Keeper) AppModule {
	am := AppModule{
		AppModuleBasic: AppModuleBasic{},
		keeper:         k,
	}
	return am
}

func (AppModule) Name() string {
	return ModuleName
}

func (AppModule) ConsensusVersion() uint64 { return 1 }

// BeginBlock implements the AppModule interface
func (am AppModule) BeginBlock(ctx sdk.Context, req abci.RequestBeginBlock) {
}

// EndBlock implements the AppModule interface
func (am AppModule) EndBlock(ctx sdk.Context, req abci.RequestEndBlock) []abci.ValidatorUpdate {
	events := ctx.EventManager().GetABCIEventHistory()
	addressToBalance := make(map[string]sdk.Coins, len(events)*2)

	ensureBalanceIsPresent := func(address string) error {
		if _, ok := addressToBalance[address]; ok {
			return nil
		}
		account, err := sdk.AccAddressFromBech32(address)
		if err != nil {
			return err
		}
		coins := am.keeper.GetAllBalances(ctx, account)
		addressToBalance[address] = coins
		return nil
	}

	/* Scan for all the events matching (taken from cosmos-sdk/x/bank/spec/04_events.md):

	### MsgSend

	| Type     | Attribute Key | Attribute Value    |
	| -------- | ------------- | ------------------ |
	| transfer | recipient     | {recipientAddress} |
	| transfer | sender        | {senderAddress}    |
	| transfer | amount        | {amount}           |
	| message  | module        | bank               |
	| message  | action        | send               |
	| message  | sender        | {senderAddress}    |

	### MsgMultiSend

	| Type     | Attribute Key | Attribute Value    |
	| -------- | ------------- | ------------------ |
	| transfer | recipient     | {recipientAddress} |
	| transfer | sender        | {senderAddress}    |
	| transfer | amount        | {amount}           |
	| message  | module        | bank               |
	| message  | action        | multisend          |
	| message  | sender        | {senderAddress}    |
	*/
	for _, event := range events {
		switch event.Type {
		case "transfer":
			for _, attr := range event.GetAttributes() {
				switch string(attr.GetKey()) {
				case "recipient", "sender":
					address := string(attr.GetValue())
					if err := ensureBalanceIsPresent(address); err != nil {
						stdlog.Println("Cannot ensure vbank balance for", address, err)
					}
				}
			}
		}
	}

	// Dump all the addressToBalances entries to SwingSet.
	bz, err := marshalBalanceUpdate(ctx, am.keeper, addressToBalance)
	if err != nil {
		panic(err)
	}
	if bz != nil {
		_, err := am.CallToController(ctx, string(bz))
		if err != nil {
			panic(err)
		}
	}

	// Distribute rewards.
	state := am.keeper.GetState(ctx)
	xfer := minCoins(state.RewardRate, state.RewardPool)
	if !xfer.IsZero() {
		am.keeper.SendCoinsToFeeCollector(ctx, xfer)
		state.RewardPool = state.RewardPool.Sub(xfer)
		am.keeper.SetState(ctx, state)
	}

	return []abci.ValidatorUpdate{}
}

// RegisterInvariants implements the AppModule interface
func (AppModule) RegisterInvariants(ir sdk.InvariantRegistry) {
	// TODO
}

// Route implements the AppModule interface
func (am AppModule) Route() sdk.Route {
	return sdk.NewRoute(RouterKey, NewHandler(am.keeper))
}

// QuerierRoute implements the AppModule interface
func (AppModule) QuerierRoute() string {
	return ModuleName
}

// LegacyQuerierHandler implements the AppModule interface
func (am AppModule) LegacyQuerierHandler(legacyQuerierCdc *codec.LegacyAmino) sdk.Querier {
	return keeper.NewQuerier(am.keeper, legacyQuerierCdc)
}

// RegisterServices registers module services.
func (am AppModule) RegisterServices(cfg module.Configurator) {
	tx := &types.UnimplementedMsgServer{}
	types.RegisterMsgServer(cfg.MsgServer(), tx)
	types.RegisterQueryServer(cfg.QueryServer(), am.keeper)
}

// InitGenesis performs genesis initialization for the ibc-transfer module. It returns
// no validator updates.
func (am AppModule) InitGenesis(ctx sdk.Context, cdc codec.JSONCodec, data json.RawMessage) []abci.ValidatorUpdate {
	var genesisState types.GenesisState
	cdc.MustUnmarshalJSON(data, &genesisState)
	return InitGenesis(ctx, am.keeper, &genesisState)
}

// ExportGenesis returns the exported genesis state as raw bytes for the ibc-transfer
// module.
func (am AppModule) ExportGenesis(ctx sdk.Context, cdc codec.JSONCodec) json.RawMessage {
	gs := ExportGenesis(ctx, am.keeper)
	return cdc.MustMarshalJSON(gs)
}
