package keeper

import (
	"math"

	"github.com/Agoric/agoric-sdk/golang/cosmos/x/lien/types"

	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
	vestexported "github.com/cosmos/cosmos-sdk/x/auth/vesting/exported"
	stakingTypes "github.com/cosmos/cosmos-sdk/x/staking/types"
)

type Keeper interface {
	GetAccountWrapper() types.AccountWrapper
	GetLien(ctx sdk.Context, addr sdk.AccAddress) types.Lien
	SetLien(ctx sdk.Context, addr sdk.AccAddress, lien types.Lien)
	IterateLiens(ctx sdk.Context, cb func(addr sdk.AccAddress, lien types.Lien) bool)
	GetAccountState(ctx sdk.Context, addr sdk.AccAddress) AccountState
	BondDenom(ctx sdk.Context) string
	GetDelegatorDelegations(ctx sdk.Context, delegator sdk.AccAddress, maxRetrieve uint16) []stakingTypes.Delegation
	GetValidator(ctx sdk.Context, valAddr sdk.ValAddress) (stakingTypes.Validator, bool)
}

// keeperImpl implements the lien keeper.
// The accountKeeper field must be the same one that the bankKeeper and
// stakingKeeper use.
type keeperImpl struct {
	key sdk.StoreKey
	cdc codec.Codec

	accountKeeper *types.WrappedAccountKeeper
	bankKeeper    types.BankKeeper
	stakingKeeper types.StakingKeeper

	callToController func(ctx sdk.Context, str string) (string, error)
}

// NewKeeper returns a new Keeper.
// The ak must be the same accout keeper that the bk and sk use.
func NewKeeper(key sdk.StoreKey, cdc codec.Codec, ak *types.WrappedAccountKeeper, bk types.BankKeeper, sk types.StakingKeeper,
	callToController func(ctx sdk.Context, str string) (string, error)) Keeper {
	return keeperImpl{
		key:              key,
		cdc:              cdc,
		accountKeeper:    ak,
		bankKeeper:       bk,
		stakingKeeper:    sk,
		callToController: callToController,
	}
}

// GetAccountWrapper returns an AccountWrapper that wrap/unwrap accounts
// with lienAccount specifying this keeper.
func (lk keeperImpl) GetAccountWrapper() types.AccountWrapper {
	return NewAccountWrapper(lk)
}

// GetLien returns the lien stored for an account.
// Defaults to a lien of zero.
func (lk keeperImpl) GetLien(ctx sdk.Context, addr sdk.AccAddress) types.Lien {
	store := ctx.KVStore(lk.key)
	bz := store.Get(types.LienByAddressKey(addr))
	if bz == nil {
		return types.Lien{}
	}
	var lien types.Lien
	lk.cdc.MustUnmarshal(bz, &lien)
	return lien
}

// SetLien sets the lien stored for an account.
// Deletes the entry if the new lien is zero.
func (lk keeperImpl) SetLien(ctx sdk.Context, addr sdk.AccAddress, lien types.Lien) {
	store := ctx.KVStore(lk.key)
	key := types.LienByAddressKey(addr)
	if lien.Coins.IsZero() {
		store.Delete(key)
		return
	}
	bz := lk.cdc.MustMarshal(&lien)
	store.Set(key, bz)
}

// IterateLiens calls cb() on all nonzero liens in the store.
// Stops early if cb() returns true.
func (lk keeperImpl) IterateLiens(ctx sdk.Context, cb func(addr sdk.AccAddress, lien types.Lien) bool) {
	store := ctx.KVStore(lk.key)
	iterator := store.Iterator(nil, nil)
	defer iterator.Close()
	for ; iterator.Valid(); iterator.Next() {
		addr := types.LienByAddressDecodeKey(iterator.Key())
		var lien types.Lien
		lk.cdc.MustUnmarshal(iterator.Value(), &lien)
		if cb(addr, lien) {
			break
		}
	}
}

// AccountState represents the abstract state of an account.
// See ../spec/01_concepts.md for details.
type AccountState struct {
	Total     sdk.Coins `json:"total"`
	Bonded    sdk.Coins `json:"bonded"`
	Unbonding sdk.Coins `json:"unbonding"`
	Locked    sdk.Coins `json:"locked"`
	Liened    sdk.Coins `json:"liened"`
}

// IsEqual returns whether two AccountStates are equal.
// (Coins don't play nicely with equality (==) or reflect.DeepEqual().)
func (s AccountState) IsEqual(other AccountState) bool {
	return s.Total.IsEqual(other.Total) &&
		s.Bonded.IsEqual(other.Bonded) &&
		s.Unbonding.IsEqual(other.Unbonding) &&
		s.Locked.IsEqual(other.Locked) &&
		s.Liened.IsEqual(other.Liened)
}

// GetAccountState retrieves the AccountState for addr.
func (lk keeperImpl) GetAccountState(ctx sdk.Context, addr sdk.AccAddress) AccountState {
	bonded := lk.getBonded(ctx, addr)
	unbonding := lk.getUnbonding(ctx, addr)
	locked := lk.getLocked(ctx, addr)
	liened := lk.GetLien(ctx, addr).Coins
	total := lk.bankKeeper.GetAllBalances(ctx, addr).Add(bonded...).Add(unbonding...)
	return AccountState{
		Total:     total,
		Bonded:    bonded,
		Unbonding: unbonding,
		Locked:    locked,
		Liened:    liened,
	}
}

// getBonded returns the bonded tokens delegated by addr.
func (lk keeperImpl) getBonded(ctx sdk.Context, addr sdk.AccAddress) sdk.Coins {
	bonded := sdk.NewCoins()
	delegations := lk.stakingKeeper.GetDelegatorDelegations(ctx, addr, math.MaxUint16)
	for _, d := range delegations {
		validatorAddr, err := sdk.ValAddressFromBech32(d.ValidatorAddress)
		if err != nil {
			panic(err)
		}
		validator, found := lk.stakingKeeper.GetValidator(ctx, validatorAddr)
		if !found {
			panic("validator not found")
		}
		shares := d.GetShares()
		tokens := validator.TokensFromShares(shares)
		bonded = bonded.Add(sdk.NewCoin(lk.stakingKeeper.BondDenom(ctx), tokens.RoundInt())) // XXX rounding?
	}
	return bonded
}

// getUnbonding returns the unbonding tokens delegated by addr.
func (lk keeperImpl) getUnbonding(ctx sdk.Context, addr sdk.AccAddress) sdk.Coins {
	unbonding := sdk.NewCoins()
	unbondings := lk.stakingKeeper.GetUnbondingDelegations(ctx, addr, math.MaxUint16)
	for _, u := range unbondings {
		amt := sdk.NewInt(0)
		for _, e := range u.Entries {
			amt = amt.Add(e.Balance)
		}
		unbonding = unbonding.Add(sdk.NewCoin(lk.stakingKeeper.BondDenom(ctx), amt))
	}
	return unbonding
}

// getLocked returns the number of locked tokens in account addr.
// This reflects the VestingCoins in the underlying VestingAccount,
// if any, not the LienAccount wrapping it.
func (lk keeperImpl) getLocked(ctx sdk.Context, addr sdk.AccAddress) sdk.Coins {
	account := lk.accountKeeper.GetAccount(ctx, addr)
	if account == nil {
		return sdk.NewCoins()
	}
	if lienAccount, ok := account.(LienAccount); ok {
		return lienAccount.omniVestingAccount.GetVestingCoins(ctx.BlockTime())
	}
	if vestingAccount, ok := account.(vestexported.VestingAccount); ok {
		return vestingAccount.GetVestingCoins(ctx.BlockTime())
	}
	return sdk.NewCoins()
}

// The following methods simply proxy the eponymous staking keeper queries.

// BondDenom returns the denom used for staking.
func (lk keeperImpl) BondDenom(ctx sdk.Context) string {
	return lk.stakingKeeper.BondDenom(ctx)
}

// GetDelegatorDelegations returns the delegator's delegations.
// Returns up to the specified number of delegations.
func (lk keeperImpl) GetDelegatorDelegations(ctx sdk.Context, delegator sdk.AccAddress, maxRetrieve uint16) []stakingTypes.Delegation {
	return lk.stakingKeeper.GetDelegatorDelegations(ctx, delegator, maxRetrieve)
}

// GetValidator returns the named validator, if found.
func (lk keeperImpl) GetValidator(ctx sdk.Context, valAddr sdk.ValAddress) (stakingTypes.Validator, bool) {
	return lk.stakingKeeper.GetValidator(ctx, valAddr)
}
