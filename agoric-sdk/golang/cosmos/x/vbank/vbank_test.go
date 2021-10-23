package vbank

import (
	"encoding/json"
	"fmt"
	"reflect"
	"testing"

	"github.com/Agoric/agoric-sdk/golang/cosmos/app/params"
	"github.com/Agoric/agoric-sdk/golang/cosmos/vm"
	"github.com/Agoric/agoric-sdk/golang/cosmos/x/vbank/types"
	"github.com/cosmos/cosmos-sdk/store"
	storetypes "github.com/cosmos/cosmos-sdk/store/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	paramskeeper "github.com/cosmos/cosmos-sdk/x/params/keeper"
	paramstypes "github.com/cosmos/cosmos-sdk/x/params/types"
	abci "github.com/tendermint/tendermint/abci/types"
	"github.com/tendermint/tendermint/crypto/secp256k1"
	"github.com/tendermint/tendermint/libs/log"
	tmproto "github.com/tendermint/tendermint/proto/tendermint/types"
	dbm "github.com/tendermint/tm-db"
)

var (
	vbankStoreKey = storetypes.NewKVStoreKey(StoreKey)
	priv1         = secp256k1.GenPrivKey()
	priv2         = secp256k1.GenPrivKey()
	priv3         = secp256k1.GenPrivKey()
	priv4         = secp256k1.GenPrivKey()
	addr1         = sdk.AccAddress(priv1.PubKey().Address()).String()
	addr2         = sdk.AccAddress(priv2.PubKey().Address()).String()
	addr3         = sdk.AccAddress(priv3.PubKey().Address()).String()
	addr4         = sdk.AccAddress(priv4.PubKey().Address()).String()
)

// Normalized balance updates for order-insensitive comparisons.
// Balance updates are represented as a map-of-maps (all strings):
// Address -> Denomination -> Amount.
type balances map[string]map[string]string

type accountOption func(map[string]string)

func coin(denom, amount string) accountOption {
	return func(acct map[string]string) {
		acct[denom] = amount
	}
}

type balancesOption func(map[string]map[string]string)

func account(addr string, opts ...accountOption) balancesOption {
	return func(bal map[string]map[string]string) {
		acct := bal[addr]
		if acct == nil {
			acct = make(map[string]string)
			bal[addr] = acct
		}
		for _, opt := range opts {
			opt(acct)
		}
	}
}

func newBalances(opts ...balancesOption) balances {
	bal := make(map[string]map[string]string)
	for _, opt := range opts {
		opt(bal)
	}
	return bal
}

func validateBalanceUpdate(vbu vbankBalanceUpdate) error {
	if vbu.Type != "VBANK_BALANCE_UPDATE" {
		return fmt.Errorf("bad balance update type: %s", vbu.Type)
	}
	for i, u := range vbu.Updated {
		if i > 0 && vbu.Updated.Less(i, i-1) {
			return fmt.Errorf("unordered balance update %v is before %v", vbu.Updated[i-1], u)
		}
	}
	return nil
}

// decodeBalances unmarshals a JSON-encoded vbankBalanceUpdate into normalized balances.
// A nil input returns a nil balances.
func decodeBalances(encoded []byte) (balances, uint64, error) {
	if encoded == nil {
		return nil, 0, nil
	}
	balanceUpdate := vbankBalanceUpdate{}
	err := json.Unmarshal(encoded, &balanceUpdate)
	if err != nil {
		return nil, 0, err
	}
	err = validateBalanceUpdate(balanceUpdate)
	if err != nil {
		return nil, 0, err
	}
	b := newBalances()
	fmt.Printf("updated balances %v\n", balanceUpdate.Updated)
	for _, u := range balanceUpdate.Updated {
		account(u.Address, coin(u.Denom, u.Amount))(b)
	}
	return b, balanceUpdate.Nonce, nil
}

func Test_marshalBalanceUpdate(t *testing.T) {
	bank := &mockBank{balance: map[string]sdk.Coin{
		addr1: sdk.NewInt64Coin("moola", 392),
	}}
	keeper, ctx := makeTestKit(bank)

	tests := []struct {
		name             string
		addressToBalance map[string]sdk.Coins
		want             balances
		wantErr          bool
	}{
		{
			name:             "empty",
			addressToBalance: map[string]sdk.Coins{},
			want:             nil,
		},
		{
			name: "simple",
			addressToBalance: map[string]sdk.Coins{
				addr1: {sdk.NewInt64Coin("foocoin", 123)},
			},
			want: newBalances(account(addr1, coin("foocoin", "123"))),
		},
		{
			name: "multi-denom",
			addressToBalance: map[string]sdk.Coins{
				addr1: {
					sdk.NewInt64Coin("foocoin", 123),
					sdk.NewInt64Coin("barcoin", 456),
				},
			},
			want: newBalances(
				account(addr1,
					coin("foocoin", "123"),
					coin("barcoin", "456"))),
		},
		{
			name: "multi-acct",
			addressToBalance: map[string]sdk.Coins{
				addr1: {sdk.NewInt64Coin("foocoin", 123)},
				addr2: {sdk.NewInt64Coin("barcoin", 456)},
			},
			want: newBalances(
				account(addr1, coin("foocoin", "123")),
				account(addr2, coin("barcoin", "456")),
			),
		},
	}
	for i, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			encoded, err := marshalBalanceUpdate(ctx, keeper, tt.addressToBalance)
			if (err != nil) != tt.wantErr {
				t.Errorf("marshalBalanceUpdate() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			got, gotNonce, err := decodeBalances(encoded)
			if err != nil {
				t.Fatalf("decode balance error = %v", err)
			}
			nonce := uint64(i)
			if gotNonce != nonce {
				t.Errorf("invalid nonce = %+v, want %+v", gotNonce, nonce)
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("marshalBalanceUpdate() = %+v, want %+v", got, tt.want)
			}
		})
	}
}

type mockBank struct {
	// Record of all calls to the bank.
	calls []string
	// Value to return from GetAllBalances().
	allBalances map[string]sdk.Coins
	// Value to return from GetBalance().
	balance map[string]sdk.Coin
}

var _ types.BankKeeper = (*mockBank)(nil)

func (b *mockBank) record(s string) {
	b.calls = append(b.calls, s)
}

func (b *mockBank) BurnCoins(ctx sdk.Context, moduleName string, amt sdk.Coins) error {
	b.record(fmt.Sprintf("BurnCoins %s %v", moduleName, amt))
	return nil
}

func (b *mockBank) GetAllBalances(ctx sdk.Context, addr sdk.AccAddress) sdk.Coins {
	b.record(fmt.Sprintf("GetAllBalances %s", addr))
	return b.allBalances[addr.String()]
}

func (b *mockBank) GetBalance(ctx sdk.Context, addr sdk.AccAddress, denom string) sdk.Coin {
	b.record(fmt.Sprintf("GetBalance %s %s", addr, denom))
	return b.balance[addr.String()]
}

func (b *mockBank) MintCoins(ctx sdk.Context, moduleName string, amt sdk.Coins) error {
	b.record(fmt.Sprintf("MintCoins %s %s", moduleName, amt))
	return nil
}

func (b *mockBank) SendCoinsFromAccountToModule(ctx sdk.Context, senderAddr sdk.AccAddress, recipientModule string, amt sdk.Coins) error {
	b.record(fmt.Sprintf("SendCoinsFromAccountToModule %s %s %s", senderAddr, recipientModule, amt))
	return nil
}

func (b *mockBank) SendCoinsFromModuleToAccount(ctx sdk.Context, senderModule string, recipientAddr sdk.AccAddress, amt sdk.Coins) error {
	b.record(fmt.Sprintf("SendCoinsFromModuleToAccount %s %s %s", senderModule, recipientAddr, amt))
	return nil
}

func (b *mockBank) SendCoinsFromModuleToModule(ctx sdk.Context, senderModule, recipientModule string, amt sdk.Coins) error {
	b.record(fmt.Sprintf("SendCoinsFromModuleToModule %s %s %s", senderModule, recipientModule, amt))
	return nil
}

// makeTestKit creates a minimal Keeper and Context for use in testing.
func makeTestKit(bank types.BankKeeper) (Keeper, sdk.Context) {
	encodingConfig := params.MakeEncodingConfig()
	cdc := encodingConfig.Marshaller
	callToController := func(ctx sdk.Context, str string) (string, error) {
		return "", nil
	}

	paramsTStoreKey := sdk.NewTransientStoreKey(paramstypes.TStoreKey)
	paramsStoreKey := sdk.NewKVStoreKey(paramstypes.StoreKey)
	pk := paramskeeper.NewKeeper(cdc, encodingConfig.Amino, paramsStoreKey, paramsTStoreKey)

	subspace := pk.Subspace(types.ModuleName)
	keeper := NewKeeper(cdc, vbankStoreKey, subspace, bank, "feeCollectorName", callToController)

	db := dbm.NewMemDB()
	ms := store.NewCommitMultiStore(db)
	ms.MountStoreWithDB(vbankStoreKey, sdk.StoreTypeIAVL, db)
	ms.MountStoreWithDB(paramsStoreKey, sdk.StoreTypeIAVL, db)
	ms.MountStoreWithDB(paramsTStoreKey, sdk.StoreTypeTransient, db)
	ms.LoadLatestVersion()
	ctx := sdk.NewContext(ms, tmproto.Header{}, false, log.NewNopLogger())

	keeper.SetParams(ctx, types.DefaultParams())
	keeper.SetState(ctx, types.State{})
	return keeper, ctx
}

func Test_Receive_GetBalance(t *testing.T) {
	bank := &mockBank{balance: map[string]sdk.Coin{
		addr1: sdk.NewInt64Coin("quatloos", 123),
	}}
	keeper, ctx := makeTestKit(bank)
	ch := NewPortHandler(AppModule{}, keeper)
	ctlCtx := &vm.ControllerContext{Context: ctx}

	ret, err := ch.Receive(ctlCtx, `{
		"type": "VBANK_GET_BALANCE",
		"address": "`+addr1+`",
		"denom": "quatloos"
		}`)
	if err != nil {
		t.Fatalf("got error = %v", err)
	}
	want := `"123"`
	if ret != want {
		t.Errorf("got %v, want %s", ret, want)
	}
	wantCalls := []string{
		"GetBalance " + addr1 + " quatloos",
	}
	if !reflect.DeepEqual(bank.calls, wantCalls) {
		t.Errorf("got calls %v, want {%s}", bank.calls, wantCalls)
	}
}

func Test_Receive_Give(t *testing.T) {
	bank := &mockBank{balance: map[string]sdk.Coin{
		addr1: sdk.NewInt64Coin("urun", 1000),
	}}
	keeper, ctx := makeTestKit(bank)
	ch := NewPortHandler(AppModule{}, keeper)
	ctlCtx := &vm.ControllerContext{Context: ctx}

	ret, err := ch.Receive(ctlCtx, `{
		"type": "VBANK_GIVE",
		"recipient": "`+addr1+`",
		"amount": "1000",
		"denom": "urun"
		}`)
	if err != nil {
		t.Fatalf("got error = %v", err)
	}
	want := newBalances(account(addr1, coin("urun", "1000")))
	got, gotNonce, err := decodeBalances([]byte(ret))
	if err != nil {
		t.Fatalf("decode balances error = %v", err)
	}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("got %+v, want %+v", got, want)
	}
	nonce := uint64(1)
	if gotNonce != nonce {
		t.Errorf("got nonce %+v, want %+v", gotNonce, nonce)
	}
	wantCalls := []string{
		"MintCoins vbank 1000urun",
		"SendCoinsFromModuleToAccount vbank " + addr1 + " 1000urun",
		"GetBalance " + addr1 + " urun",
	}
	if !reflect.DeepEqual(bank.calls, wantCalls) {
		t.Errorf("got calls %v, want {%s}", bank.calls, wantCalls)
	}
}

func Test_Receive_GiveToFeeCollector(t *testing.T) {
	bank := &mockBank{}
	keeper, ctx := makeTestKit(bank)
	ch := NewPortHandler(AppModule{}, keeper)
	ctlCtx := &vm.ControllerContext{Context: ctx}

	tests := []struct {
		name          string
		duration      int64
		rewardPool    sdk.Coins
		feeAmount     string
		feeDenom      string
		wantMintCoins string
		wantRate      sdk.Coins
	}{
		{
			name:          "durationUnconfigured",
			duration:      0,
			rewardPool:    sdk.NewCoins(),
			feeAmount:     "1000",
			feeDenom:      "urun",
			wantMintCoins: "1000urun",
			wantRate:      sdk.NewCoins(sdk.NewInt64Coin("urun", 1000)),
		},
		{
			name:          "one",
			duration:      1,
			rewardPool:    sdk.NewCoins(),
			feeAmount:     "1000",
			feeDenom:      "urun",
			wantMintCoins: "1000urun",
			wantRate:      sdk.NewCoins(sdk.NewInt64Coin("urun", 1000)),
		},
		{
			name:          "ten",
			duration:      10,
			rewardPool:    sdk.NewCoins(),
			feeAmount:     "91",
			feeDenom:      "urun",
			wantMintCoins: "91urun",
			wantRate:      sdk.NewCoins(sdk.NewInt64Coin("urun", 10)),
		},
		{
			name:          "pool",
			duration:      100,
			rewardPool:    sdk.NewCoins(sdk.NewInt64Coin("urun", 1000)),
			feeAmount:     "2000",
			feeDenom:      "urun",
			wantMintCoins: "2000urun",
			wantRate:      sdk.NewCoins(sdk.NewInt64Coin("urun", 30)),
		},
		{
			name:          "mixedDenom",
			duration:      100,
			rewardPool:    sdk.NewCoins(sdk.NewInt64Coin("stickers", 1)),
			feeAmount:     "99",
			feeDenom:      "urun",
			wantMintCoins: "99urun",
			wantRate: sdk.NewCoins(
				sdk.NewInt64Coin("urun", 1),
				sdk.NewInt64Coin("stickers", 1),
			),
		},
		{
			name:          "big",
			duration:      1000 * 1000,
			rewardPool:    sdk.NewCoins(),
			feeAmount:     "123456789123456789123456789",
			feeDenom:      "yoctoquatloos",
			wantMintCoins: "123456789123456789123456789yoctoquatloos",
			wantRate: sdk.NewCoins(
				sdk.NewCoin("yoctoquatloos", sdk.NewInt(123456789123456789).MulRaw(1000).AddRaw(124)),
			),
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			bank.calls = []string{}
			keeper.SetParams(ctx, types.Params{FeeEpochDurationBlocks: tt.duration})
			keeper.SetState(ctx, types.State{RewardPool: tt.rewardPool})

			ret, err := ch.Receive(ctlCtx,
				`{"type": "VBANK_GIVE_TO_FEE_COLLECTOR", "amount": "`+tt.feeAmount+`", "denom": "`+tt.feeDenom+`"}`)
			if err != nil {
				t.Fatalf("got error = %v", err)
			}
			if ret != `true` {
				t.Errorf("got %v, want \"true\"", ret)
			}
			wantCalls := []string{
				"MintCoins vbank " + tt.wantMintCoins,
			}
			if !reflect.DeepEqual(bank.calls, wantCalls) {
				t.Errorf("got calls %v, want %v", bank.calls, wantCalls)
			}
			state := keeper.GetState(ctx)
			if !state.RewardRate.IsEqual(tt.wantRate) {
				t.Errorf("got rate %v, want %v", state.RewardRate, tt.wantRate)
			}
		})
	}
}

func Test_Receive_Grab(t *testing.T) {
	bank := &mockBank{balance: map[string]sdk.Coin{
		addr1: sdk.NewInt64Coin("ubld", 1000),
	}}
	keeper, ctx := makeTestKit(bank)
	ch := NewPortHandler(AppModule{}, keeper)
	ctlCtx := &vm.ControllerContext{Context: ctx}

	ret, err := ch.Receive(ctlCtx, `{
		"type": "VBANK_GRAB",
		"sender": "`+addr1+`",
		"amount": "500",
		"denom": "ubld"
		}`)
	if err != nil {
		t.Fatalf("got error = %v", err)
	}
	want := newBalances(account(addr1, coin("ubld", "1000")))
	got, gotNonce, err := decodeBalances([]byte(ret))
	if err != nil {
		t.Fatalf("decode balances error = %v", err)
	}
	if !reflect.DeepEqual(got, want) {
		t.Errorf("got %+v, want %+v", got, want)
	}
	nonce := uint64(1)
	if gotNonce != nonce {
		t.Errorf("invalid nonce = %+v, want %+v", gotNonce, nonce)
	}
	wantCalls := []string{
		"SendCoinsFromAccountToModule " + addr1 + " vbank 500ubld",
		"BurnCoins vbank 500ubld",
		"GetBalance " + addr1 + " ubld",
	}
	if !reflect.DeepEqual(bank.calls, wantCalls) {
		t.Errorf("got calls %v, want {%s}", bank.calls, wantCalls)
	}
}

func Test_EndBlock_Events(t *testing.T) {
	bank := &mockBank{allBalances: map[string]sdk.Coins{
		addr1: {sdk.NewInt64Coin("ubld", 1000)},
		addr2: {
			sdk.NewInt64Coin("urun", 4000),
			sdk.NewInt64Coin("arcadeTokens", 7),
		},
	}}
	keeper, ctx := makeTestKit(bank)
	msgsSent := []string{}
	keeper.CallToController = func(ctx sdk.Context, str string) (string, error) {
		msgsSent = append(msgsSent, str)
		return "", nil
	}
	am := NewAppModule(keeper)

	events := []abci.Event{
		{
			Type: "transfer",
			Attributes: []abci.EventAttribute{
				{Key: []byte("recipient"), Value: []byte(addr1)},
				{Key: []byte("sender"), Value: []byte(addr2)},
				{Key: []byte("amount"), Value: []byte("quite a lot")},
				{Key: []byte("other"), Value: []byte(addr3)},
			},
		},
		{
			Type: "not a transfer",
			Attributes: []abci.EventAttribute{
				{Key: []byte("sender"), Value: []byte(addr4)},
			},
		},
	}
	em := sdk.NewEventManagerWithHistory(events)
	ctx = ctx.WithEventManager(em)

	updates := am.EndBlock(ctx, abci.RequestEndBlock{})
	if len(updates) != 0 {
		t.Errorf("EndBlock() got %+v, want empty", updates)
	}

	wantCalls := []string{
		"GetAllBalances " + addr1,
		"GetAllBalances " + addr2,
	}
	// TODO: make comparison order-insensitive
	if !reflect.DeepEqual(bank.calls, wantCalls) {
		t.Errorf("got calls %v, want {%s}", bank.calls, wantCalls)
	}

	wantMsg := newBalances(
		account(addr1, coin("ubld", "1000")),
		account(addr2, coin("urun", "4000"), coin("arcadeTokens", "7")),
	)
	if len(msgsSent) != 1 {
		t.Errorf("got msgs = %v, want one message", msgsSent)
	}
	gotMsg, gotNonce, err := decodeBalances([]byte(msgsSent[0]))
	if err != nil {
		t.Fatalf("decode balances error = %v", err)
	}

	nonce := uint64(1)
	if gotNonce != nonce {
		t.Errorf("invalid nonce = %+v, want %+v", gotNonce, nonce)
	}

	if !reflect.DeepEqual(gotMsg, wantMsg) {
		t.Errorf("got sent message %v, want %v", gotMsg, wantMsg)
	}
}

func Test_EndBlock_Rewards(t *testing.T) {
	bank := &mockBank{
		allBalances: map[string]sdk.Coins{
			ModuleName: {
				sdk.NewInt64Coin("urun", 1000),
				sdk.NewInt64Coin("stickers", 10),
				sdk.NewInt64Coin("puppies", 0),
			},
		},
	}
	keeper, ctx := makeTestKit(bank)
	msgsSent := []string{}
	keeper.CallToController = func(ctx sdk.Context, str string) (string, error) {
		msgsSent = append(msgsSent, str)
		return "", nil
	}
	am := NewAppModule(keeper)

	tests := []struct {
		name     string
		pool     sdk.Coins
		rate     sdk.Coins
		wantPool sdk.Coins
		wantXfer string
	}{
		{
			name:     "noNothing",
			pool:     sdk.NewCoins(),
			rate:     sdk.NewCoins(),
			wantPool: sdk.NewCoins(),
			wantXfer: "",
		},
		{
			name:     "noRate",
			pool:     sdk.NewCoins(sdk.NewInt64Coin("urun", 20)),
			rate:     sdk.NewCoins(),
			wantPool: sdk.NewCoins(sdk.NewInt64Coin("urun", 20)),
			wantXfer: "",
		},
		{
			name:     "noPool",
			pool:     sdk.NewCoins(),
			rate:     sdk.NewCoins(sdk.NewInt64Coin("urun", 5)),
			wantPool: sdk.NewCoins(),
			wantXfer: "",
		},
		{
			name:     "everything",
			pool:     sdk.NewCoins(sdk.NewInt64Coin("urun", 12)),
			rate:     sdk.NewCoins(sdk.NewInt64Coin("urun", 12)),
			wantPool: sdk.NewCoins(),
			wantXfer: "12urun",
		},
		{
			name:     "easy",
			pool:     sdk.NewCoins(sdk.NewInt64Coin("urun", 4580)),
			rate:     sdk.NewCoins(sdk.NewInt64Coin("urun", 25)),
			wantPool: sdk.NewCoins(sdk.NewInt64Coin("urun", 4555)),
			wantXfer: "25urun",
		},
		{
			name: "hard",
			pool: sdk.NewCoins(
				sdk.NewInt64Coin("urun", 1000),
				sdk.NewInt64Coin("stickers", 10),
				sdk.NewInt64Coin("puppies", 1),
			),
			rate: sdk.NewCoins(
				sdk.NewInt64Coin("urun", 100),
				sdk.NewInt64Coin("stickers", 20),
				sdk.NewInt64Coin("arcadeTokens", 3),
			),
			wantPool: sdk.NewCoins(
				sdk.NewInt64Coin("urun", 900),
				sdk.NewInt64Coin("puppies", 1),
			),
			wantXfer: "10stickers,100urun",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			msgsSent = []string{}
			bank.calls = []string{}
			state := types.State{
				RewardPool: tt.pool,
				RewardRate: tt.rate,
			}
			keeper.SetState(ctx, state)

			updates := am.EndBlock(ctx, abci.RequestEndBlock{})
			if len(updates) != 0 {
				t.Errorf("EndBlock() got %+v, want empty", updates)
			}

			if len(msgsSent) != 0 {
				t.Errorf("got messages sent = %v, want empty", msgsSent)
			}

			state = keeper.GetState(ctx)
			if !state.RewardPool.IsEqual(tt.wantPool) {
				t.Errorf("got pool %v, want %v", state.RewardPool, tt.wantPool)
			}

			if tt.wantXfer == "" {
				if len(bank.calls) > 0 {
					t.Errorf("got calls %v, want none", bank.calls)
				}
			} else {
				wantCalls := []string{
					"SendCoinsFromModuleToModule vbank feeCollectorName " + tt.wantXfer,
				}
				if !reflect.DeepEqual(bank.calls, wantCalls) {
					t.Errorf("got calls %v, want %v", bank.calls, wantCalls)
				}
			}
		})
	}
}
