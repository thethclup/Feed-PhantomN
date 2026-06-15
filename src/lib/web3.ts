import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, coinbaseWallet } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'Feed Phantom',
    })
  ],
});

