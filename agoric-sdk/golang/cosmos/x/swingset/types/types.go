package types

import (
	"encoding/json"
	"errors"

	sdk "github.com/cosmos/cosmos-sdk/types"
)

const EmptyMailboxValue = `"{\"outbox\":[], \"ack\":0}"`

func NewEgress(nickname string, peer sdk.AccAddress, powerFlags []string) *Egress {
	return &Egress{
		Nickname:   nickname,
		Peer:       peer,
		PowerFlags: powerFlags,
	}
}

func NewStorage() *Storage {
	return &Storage{}
}

// Returns a new Mailbox with an empty mailbox
func NewMailbox() *Storage {
	return &Storage{
		Value: EmptyMailboxValue,
	}
}

func NewKeys() *Keys {
	return &Keys{}
}

// FIXME: Should have @agoric/nat
func Nat(num float64) (uint64, error) {
	nat := uint64(num)
	if float64(nat) != num {
		return 0, errors.New("Not a precise integer")
	}

	if nat < 0 {
		return 0, errors.New("Not a natural")
	}
	return nat, nil
}

type Messages struct {
	Nums     []uint64
	Messages []string
	Ack      uint64
}

func UnmarshalMessagesJSON(jsonString string) (*Messages, error) {
	// [message[], ack]
	// message [num, body]
	packet := make([]interface{}, 2)
	err := json.Unmarshal([]byte(jsonString), &packet)
	if err != nil {
		return nil, err
	}

	ret := &Messages{}

	ackFloat, ok := packet[1].(float64)
	if !ok {
		return nil, errors.New("Ack is not an integer")
	}
	ret.Ack, err = Nat(ackFloat)
	if err != nil {
		return nil, err
	}

	msgs, ok := packet[0].([]interface{})
	if !ok {
		return nil, errors.New("Messages is not an array")
	}

	ret.Messages = make([]string, len(msgs))
	ret.Nums = make([]uint64, len(msgs))
	for i, nummsgi := range msgs {
		nummsg, ok := nummsgi.([]interface{})
		if !ok || len(nummsg) != 2 {
			return nil, errors.New("Message is not a pair")
		}
		numFloat, ok := nummsg[0].(float64)
		if !ok {
			return nil, errors.New("Message Num is not an integer")
		}
		ret.Nums[i], err = Nat(numFloat)
		msg, ok := nummsg[1].(string)
		if !ok {
			return nil, errors.New("Message is not a string")
		}
		ret.Messages[i] = msg
	}

	return ret, nil
}
