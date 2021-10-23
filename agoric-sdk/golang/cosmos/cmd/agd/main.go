package main

import (
	"os"
	"os/exec"
	"syscall"

	"github.com/tendermint/tendermint/libs/log"

	gaia "github.com/Agoric/agoric-sdk/golang/cosmos/app"
	"github.com/Agoric/agoric-sdk/golang/cosmos/daemon"
	daemoncmd "github.com/Agoric/agoric-sdk/golang/cosmos/daemon/cmd"
)

func main() {
	// We need to delegate to our default app for running the actual chain.
	daemoncmd.OnStartHook = func(logger log.Logger) {
		logger.Info("Start chain delegating to ag-chain-cosmos executable")

		binary, lookErr := exec.LookPath("ag-chain-cosmos")
		if lookErr != nil {
			panic(lookErr)
		}

		args := []string{"ag-chain-cosmos", "--home", gaia.DefaultNodeHome}
		args = append(args, os.Args[1:]...)

		execErr := syscall.Exec(binary, args, os.Environ())
		if execErr != nil {
			panic(execErr)
		}
	}

	daemon.RunWithController(nil)
}
