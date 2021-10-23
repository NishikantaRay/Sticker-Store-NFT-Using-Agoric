package vibc

import (
	"encoding/json"
	"fmt"

	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

// NewHandler returns a handler for "vibc" type messages.
func NewHandler(keeper Keeper) sdk.Handler {
	return func(ctx sdk.Context, msg sdk.Msg) (*sdk.Result, error) {
		switch msg := msg.(type) {
		case *MsgSendPacket:
			return handleMsgSendPacket(ctx, keeper, msg)

		default:
			errMsg := fmt.Sprintf("Unrecognized vibc Msg type: %T", msg)
			return nil, sdkerrors.Wrap(sdkerrors.ErrUnknownRequest, errMsg)
		}
	}
}

type sendPacketAction struct {
	*MsgSendPacket
	Type        string `json:"type"`  // IBC_EVENT
	Event       string `json:"event"` // sendPacket
	BlockHeight int64  `json:"blockHeight"`
	BlockTime   int64  `json:"blockTime"`
}

func handleMsgSendPacket(ctx sdk.Context, keeper Keeper, msg *MsgSendPacket) (*sdk.Result, error) {
	onePass := sdk.NewInt64Coin("sendpacketpass", 1)
	balance := keeper.GetBalance(ctx, msg.Sender, onePass.Denom)
	if balance.IsLT(onePass) {
		return nil, sdkerrors.Wrap(
			sdkerrors.ErrInsufficientFee,
			fmt.Sprintf("sender %s needs at least %s", msg.Sender, onePass.String()),
		)
	}

	action := &sendPacketAction{
		MsgSendPacket: msg,
		Type:          "IBC_EVENT",
		Event:         "sendPacket",
		BlockHeight:   ctx.BlockHeight(),
		BlockTime:     ctx.BlockTime().Unix(),
	}
	// fmt.Fprintf(os.Stderr, "Context is %+v\n", ctx)
	b, err := json.Marshal(action)
	if err != nil {
		return nil, sdkerrors.Wrap(sdkerrors.ErrJSONMarshal, err.Error())
	}

	_, err = keeper.CallToController(ctx, string(b))
	// fmt.Fprintln(os.Stderr, "Returned from SwingSet", out, err)
	if err != nil {
		return nil, err
	}
	return &sdk.Result{
		Events: ctx.EventManager().Events().ToABCIEvents(),
	}, nil
}
