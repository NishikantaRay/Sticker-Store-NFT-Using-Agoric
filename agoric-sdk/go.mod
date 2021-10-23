module github.com/Agoric/agoric-sdk

go 1.15

require (
	github.com/armon/go-metrics v0.3.9
	github.com/cosmos/cosmos-sdk v0.44.0
	github.com/cosmos/ibc-go v1.1.0
	github.com/gogo/protobuf v1.3.3
	github.com/golang/protobuf v1.5.2
	github.com/gorilla/mux v1.8.0
	github.com/grpc-ecosystem/grpc-gateway v1.16.0
	github.com/rakyll/statik v0.1.7
	github.com/spf13/cast v1.3.1
	github.com/spf13/cobra v1.2.1
	github.com/tendermint/tendermint v0.34.13
	github.com/tendermint/tm-db v0.6.4
	google.golang.org/genproto v0.0.0-20210602131652-f16073e35f0c
	google.golang.org/grpc v1.40.0
	gopkg.in/yaml.v2 v2.4.0
)

// Silence a warning on MacOS
replace github.com/keybase/go-keychain => github.com/99designs/go-keychain v0.0.0-20191008050251-8e49817e8af4

replace github.com/99designs/keyring => github.com/cosmos/keyring v1.1.7-0.20210622111912-ef00f8ac3d76

replace github.com/gogo/protobuf => github.com/regen-network/protobuf v1.3.3-alpha.regen.1

replace google.golang.org/grpc => google.golang.org/grpc v1.33.2

// At least until post-v0.34.13 is released with
// https://github.com/tendermint/tendermint/issue/6899 resolved.
replace github.com/tendermint/tendermint => github.com/agoric-labs/tendermint v0.34.13-alpha.agoric.7

// We need a fork of cosmos-sdk until all of the differences are merged.
replace github.com/cosmos/cosmos-sdk => github.com/agoric-labs/cosmos-sdk v0.44.2-alpha.agoric.1

// For testing against a local cosmos-sdk or tendermint
// replace github.com/cosmos/cosmos-sdk => ../forks/cosmos-sdk

// replace github.com/tendermint/tendermint => ../forks/tendermint
