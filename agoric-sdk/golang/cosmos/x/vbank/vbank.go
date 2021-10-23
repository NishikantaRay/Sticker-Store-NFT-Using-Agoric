package vbank

import (
	"encoding/json"
	"fmt"
	"sort"

	"github.com/Agoric/agoric-sdk/golang/cosmos/vm"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

type portHandler struct {
	am     AppModule
	keeper Keeper
}

type portMessage struct { // comes from swingset's vat-bank
	Type      string `json:"type"` // VBANK_*
	Address   string `json:"address"`
	Recipient string `json:"recipient"`
	Sender    string `json:"sender"`
	Denom     string `json:"denom"`
	Amount    string `json:"amount"`
}

func NewPortHandler(am AppModule, keeper Keeper) portHandler {
	return portHandler{
		am:     am,
		keeper: keeper,
	}
}

type vbankSingleBalanceUpdate struct {
	Address string `json:"address"`
	Denom   string `json:"denom"`
	Amount  string `json:"amount"`
}

// Make vbankManyBalanceUpdates sortable
type vbankManyBalanceUpdates []vbankSingleBalanceUpdate

var _ sort.Interface = vbankManyBalanceUpdates{}

func (vbu vbankManyBalanceUpdates) Len() int {
	return len(vbu)
}

func (vbu vbankManyBalanceUpdates) Less(i int, j int) bool {
	if vbu[i].Address < vbu[j].Address {
		return true
	} else if vbu[i].Address > vbu[j].Address {
		return false
	}
	if vbu[i].Denom < vbu[j].Denom {
		return true
	} else if vbu[i].Denom > vbu[j].Denom {
		return false
	}
	return vbu[i].Amount < vbu[j].Amount
}

func (vbu vbankManyBalanceUpdates) Swap(i int, j int) {
	vbu[i], vbu[j] = vbu[j], vbu[i]
}

type vbankBalanceUpdate struct {
	Nonce   uint64                  `json:"nonce"`
	Type    string                  `json:"type"`
	Updated vbankManyBalanceUpdates `json:"updated"`
}

func marshalBalanceUpdate(ctx sdk.Context, keeper Keeper, addressToBalance map[string]sdk.Coins) ([]byte, error) {
	nentries := len(addressToBalance)
	if nentries == 0 {
		return nil, nil
	}

	nonce := keeper.GetNextSequence(ctx)
	event := vbankBalanceUpdate{
		Type:    "VBANK_BALANCE_UPDATE",
		Nonce:   nonce,
		Updated: make([]vbankSingleBalanceUpdate, 0, nentries),
	}

	// Note that Golang randomises the order of iteration, so we have to sort
	// below to be deterministic.
	for address, coins := range addressToBalance {
		for _, coin := range coins {
			update := vbankSingleBalanceUpdate{
				Address: address,
				Denom:   coin.Denom,
				Amount:  coin.Amount.String(),
			}
			event.Updated = append(event.Updated, update)
		}
	}

	// Ensure we have a deterministic order of updates.
	sort.Sort(event.Updated)
	return json.Marshal(&event)
}

// rewardRate calculates the rate for dispensing the pool of coins over
// the specified number of blocks. Fractions are rounded up. In other
// words, it returns the smallest Coins such that pool is exhausted
// after #blocks withdrawals.
func rewardRate(pool sdk.Coins, blocks int64) sdk.Coins {
	coins := make([]sdk.Coin, 0)
	if blocks > 0 {
		for _, coin := range pool {
			if coin.IsZero() {
				continue
			}
			// divide by blocks, rounding fractions up
			// (coin.Amount - 1)/blocks + 1
			rate := coin.Amount.SubRaw(1).QuoRaw(blocks).AddRaw(1)
			coins = append(coins, sdk.NewCoin(coin.GetDenom(), rate))
		}
	}
	return sdk.NewCoins(coins...)
}

func (ch portHandler) Receive(ctx *vm.ControllerContext, str string) (ret string, err error) {
	// fmt.Println("vbank.go downcall", str)
	keeper := ch.keeper

	var msg portMessage
	err = json.Unmarshal([]byte(str), &msg)
	if err != nil {
		return ret, err
	}

	switch msg.Type {
	case "VBANK_GET_BALANCE":
		addr, err := sdk.AccAddressFromBech32(msg.Address)
		if err != nil {
			return "", fmt.Errorf("cannot convert %s to address: %w", msg.Address, err)
		}
		coin := keeper.GetBalance(ctx.Context, addr, msg.Denom)
		packet := coin.Amount.String()
		if err == nil {
			bytes, err := json.Marshal(&packet)
			if err == nil {
				ret = string(bytes)
			}
		}

	case "VBANK_GRAB":
		addr, err := sdk.AccAddressFromBech32(msg.Sender)
		if err != nil {
			return "", fmt.Errorf("cannot convert %s to address: %w", msg.Sender, err)
		}
		value, ok := sdk.NewIntFromString(msg.Amount)
		if !ok {
			return "", fmt.Errorf("cannot convert %s to int", msg.Amount)
		}
		coins := sdk.NewCoins(sdk.NewCoin(msg.Denom, value))
		if err := keeper.GrabCoins(ctx.Context, addr, coins); err != nil {
			return "", fmt.Errorf("cannot grab %s coins: %w", coins.Sort().String(), err)
		}
		addressToBalances := make(map[string]sdk.Coins, 1)
		addressToBalances[msg.Sender] = sdk.NewCoins(keeper.GetBalance(ctx.Context, addr, msg.Denom))
		bz, err := marshalBalanceUpdate(ctx.Context, keeper, addressToBalances)
		if err != nil {
			return "", err
		}
		if bz == nil {
			ret = "true"
		} else {
			ret = string(bz)
		}

	case "VBANK_GIVE":
		addr, err := sdk.AccAddressFromBech32(msg.Recipient)
		if err != nil {
			return "", fmt.Errorf("cannot convert %s to address: %w", msg.Recipient, err)
		}
		value, ok := sdk.NewIntFromString(msg.Amount)
		if !ok {
			return "", fmt.Errorf("cannot convert %s to int", msg.Amount)
		}
		coins := sdk.NewCoins(sdk.NewCoin(msg.Denom, value))
		if err := keeper.SendCoins(ctx.Context, addr, coins); err != nil {
			return "", fmt.Errorf("cannot give %s coins: %w", coins.Sort().String(), err)
		}
		addressToBalances := make(map[string]sdk.Coins, 1)
		addressToBalances[msg.Recipient] = sdk.NewCoins(keeper.GetBalance(ctx.Context, addr, msg.Denom))
		bz, err := marshalBalanceUpdate(ctx.Context, keeper, addressToBalances)
		if err != nil {
			return "", err
		}
		if bz == nil {
			ret = "true"
		} else {
			ret = string(bz)
		}

	case "VBANK_GIVE_TO_FEE_COLLECTOR":
		value, ok := sdk.NewIntFromString(msg.Amount)
		if !ok {
			return "", fmt.Errorf("cannot convert %s to int", msg.Amount)
		}
		coins := sdk.NewCoins(sdk.NewCoin(msg.Denom, value))
		if err := keeper.StoreFeeCoins(ctx.Context, coins); err != nil {
			return "", fmt.Errorf("cannot store fee %s coins: %w", coins.Sort().String(), err)
		}
		if err != nil {
			return "", err
		}
		params := keeper.GetParams(ctx.Context)
		blocks := params.FeeEpochDurationBlocks
		if blocks < 1 {
			blocks = 1
		}
		state := keeper.GetState(ctx.Context)
		state.RewardPool = state.RewardPool.Add(coins...)
		state.RewardRate = rewardRate(state.RewardPool, blocks)
		keeper.SetState(ctx.Context, state)
		// We don't supply the module balance, since the controller shouldn't know.
		ret = "true"

	default:
		err = fmt.Errorf("unrecognized type %s", msg.Type)
	}

	// fmt.Println("vbank.go downcall reply", ret, err)
	return
}

func (am AppModule) CallToController(ctx sdk.Context, send string) (string, error) {
	// fmt.Println("vbank.go upcall", send)
	reply, err := am.keeper.CallToController(ctx, send)
	// fmt.Println("vbank.go upcall reply", reply, err)
	return reply, err
}
