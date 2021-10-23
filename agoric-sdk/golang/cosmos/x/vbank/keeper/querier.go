package keeper

import (
	abci "github.com/tendermint/tendermint/abci/types"

	"github.com/Agoric/agoric-sdk/golang/cosmos/x/vbank/types"
	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

func NewQuerier(k Keeper, legacyQuerierCdc *codec.LegacyAmino) sdk.Querier {
	return func(ctx sdk.Context, path []string, req abci.RequestQuery) ([]byte, error) {
		switch path[0] {
		case types.QueryParams:
			return queryParams(ctx, path[1:], req, k, legacyQuerierCdc)

		case types.QueryState:
			return queryState(ctx, path[1:], req, k, legacyQuerierCdc)

		default:
			return nil, sdkerrors.Wrapf(sdkerrors.ErrUnknownRequest, "unknown query path: %s", path[0])
		}
	}
}

func queryParams(ctx sdk.Context, _ []string, _ abci.RequestQuery, k Keeper, legacyQuerierCdc *codec.LegacyAmino) ([]byte, error) {
	params := k.GetParams(ctx)

	res, err := codec.MarshalJSONIndent(legacyQuerierCdc, params)
	if err != nil {
		return nil, sdkerrors.Wrap(sdkerrors.ErrJSONMarshal, err.Error())
	}

	return res, nil
}

func queryState(ctx sdk.Context, _ []string, _ abci.RequestQuery, k Keeper, legacyQuerierCdc *codec.LegacyAmino) ([]byte, error) {
	state := k.GetState(ctx)

	res, err := codec.MarshalJSONIndent(legacyQuerierCdc, state)
	if err != nil {
		return nil, sdkerrors.Wrap(sdkerrors.ErrJSONMarshal, err.Error())
	}

	return res, nil
}
