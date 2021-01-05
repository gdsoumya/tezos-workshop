const config = require("./config.json");
const { InMemorySigner } = require("@taquito/signer");
const { TezosToolkit } = require("@taquito/taquito");
const { ParameterSchema } = require("@taquito/michelson-encoder");

const Tezos = new TezosToolkit(config.rpc);
Tezos.setProvider({
  signer: new InMemorySigner(config.privateKey),
});

// get all entrypoints and their parameters (in order)
const getEntrypoints = (entry) => {
  const schema = {};
  Object.keys(entry.entrypoints).forEach((name) => {
    schema[name] = new ParameterSchema(entry.entrypoints[name]).ExtractSchema();
  });
  return JSON.stringify(schema, null, 2);
};

// deploy proxy contract
const deploy = () => {
  Tezos.contract
    .originate({
      code: config.contract,
      init: config.storage,
    })
    .then((originationOp) => {
      console.log(
        `Waiting for confirmation of origination for proxy contract: ${originationOp.contractAddress}...`
      );
      return originationOp.contract();
    })
    .then((contract) => {
      console.log(`Contract Originated | Address : ${contract.address}`);
      console.log("Entrypoints:\n", getEntrypoints(contract.entrypoints));
    })
    .catch((error) => console.log(`Error: ${JSON.stringify(error, null, 2)}`));
};

deploy();
