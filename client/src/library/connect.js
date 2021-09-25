import * as config from "./config.json";

import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from "@taquito/taquito";

export const setup = async () => {
  const Tezos = new TezosToolkit(config.rpc);
  return Tezos;
};

export const connectWalletBeacon = async () => {
  const options = {
    name: config.name,
    iconUrl: 'https://tezostaquito.io/img/favicon.png',
    preferredNetwork: config.network,
  }
  const wallet = new BeaconWallet(options);
  // wallet.disconnect();
  await wallet.requestPermissions({
    network: {
      type: config.network,
    },
  });
  return wallet;
};