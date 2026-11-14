import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { baseAccount, injected } from 'wagmi/connectors';

export const BASE_MAINNET_CHAIN_ID = base.id;
export const DENIM_BLOCK_TIME_MS = 200;
export const BASESCAN_URL = 'https://basescan.org';

const BASE_MAINNET_RPC_URL =
  import.meta.env.VITE_BASE_MAINNET_RPC_URL || 'https://mainnet.base.org';

export const wagmiConfig = createConfig({
  chains: [base],
  pollingInterval: {
    [base.id]: DENIM_BLOCK_TIME_MS,
  },
  transports: {
    [base.id]: http(BASE_MAINNET_RPC_URL),
  },
  connectors: [
    injected(),
    baseAccount({
      appName: 'Feed Phantom',
    }),
  ],
});

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}
