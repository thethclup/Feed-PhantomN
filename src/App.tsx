import React, { useEffect, useState } from 'react';
import {
  WagmiProvider,
  useAccount,
  useChainId,
  useSendCalls,
  useSendTransaction,
  useSwitchChain,
  useWaitForCallsStatus,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BASE_MAINNET_CHAIN_ID, BASESCAN_URL, wagmiConfig } from './lib/web3';
import { GameCanvas } from './game/GameCanvas';
import { MainMenu } from './components/views/MainMenu';
import { HUD } from './components/views/HUD';
import { GameOver } from './components/views/GameOver';
import { useGameStore } from './store/useGameStore';
import { Sun } from 'lucide-react';
import { useWalletCapabilities } from './hooks/useWalletCapabilities';
import { concat } from 'viem';
import { ERC8021_DATA_SUFFIX, FEED_PHANTOM_TARGET_ADDRESS } from './lib/erc8021';

const queryClient = new QueryClient();

function AppContent() {
  const { gameState } = useGameStore();
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { supportsBatching } = useWalletCapabilities(BASE_MAINNET_CHAIN_ID);

  const { sendTransactionAsync, isPending: isSendingTx } = useSendTransaction();
  const { sendCallsAsync, isPending: isSendingCalls } = useSendCalls();

  const [gmStatus, setGmStatus] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [callsId, setCallsId] = useState<string | undefined>(undefined);
  const [confirmedHash, setConfirmedHash] = useState<`0x${string}` | undefined>(undefined);

  const { isLoading: isConfirmingTx, isSuccess: isTxConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: BASE_MAINNET_CHAIN_ID,
  });

  const {
    data: callsStatus,
    isLoading: isConfirmingCalls,
    isSuccess: isCallsConfirmed,
  } = useWaitForCallsStatus({
    id: callsId,
  });

  useEffect(() => {
    if (isTxConfirmed && txHash) {
      setConfirmedHash(txHash);
      setTxHash(undefined);
      setGmStatus('GM Confirmed!');
      const timer = setTimeout(() => {
        setGmStatus(null);
        setConfirmedHash(undefined);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isTxConfirmed, txHash]);

  useEffect(() => {
    if (isCallsConfirmed) {
      const receiptHash = callsStatus?.receipts?.[0]?.transactionHash;
      if (receiptHash) setConfirmedHash(receiptHash);
      setCallsId(undefined);
      setGmStatus('GM Confirmed!');
      const timer = setTimeout(() => {
        setGmStatus(null);
        setConfirmedHash(undefined);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isCallsConfirmed, callsStatus]);

  const isWrongNetwork = isConnected && chainId !== BASE_MAINNET_CHAIN_ID;
  const isBusy = isSendingTx || isSendingCalls || isConfirmingTx || isConfirmingCalls;

  const sendGMTransaction = async () => {
    if (!isConnected) return;
    if (isWrongNetwork) {
      switchChain({ chainId: BASE_MAINNET_CHAIN_ID });
      return;
    }

    setConfirmedHash(undefined);
    setTxHash(undefined);
    setCallsId(undefined);
    setGmStatus('Confirm in Wallet...');

    try {
      const txDataBase = '0x474d' as const; // 'GM' in hex

      if (supportsBatching) {
        const result = await sendCallsAsync({
          calls: [
            {
              to: FEED_PHANTOM_TARGET_ADDRESS,
              data: txDataBase,
              value: BigInt(0),
            },
          ],
          chainId: BASE_MAINNET_CHAIN_ID,
          capabilities: {
            dataSuffix: {
              value: ERC8021_DATA_SUFFIX,
              optional: true,
            },
          },
        });
        setCallsId(result.id);
        setGmStatus('Confirming (~200ms)...');
      } else {
        const dataWithSuffix = concat([txDataBase, ERC8021_DATA_SUFFIX]);
        const hash = await sendTransactionAsync({
          to: FEED_PHANTOM_TARGET_ADDRESS,
          value: BigInt(0),
          data: dataWithSuffix,
          chainId: BASE_MAINNET_CHAIN_ID,
        });
        setTxHash(hash);
        setGmStatus('Confirming (~200ms)...');
      }
    } catch (e: any) {
      console.error(e);
      setGmStatus(e?.shortMessage || 'Tx Failed');
      setTimeout(() => setGmStatus(null), 3500);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden font-sans">
      {/* Main Game Renderer */}
      <GameCanvas />

      {/* UI Overlays */}
      {gameState === 'menu' && <MainMenu />}
      {gameState === 'playing' && <HUD />}
      {gameState === 'gameover' && <GameOver />}

      {/* Persistent GM Button overlay -> only if connected */}
      {isConnected && (
        <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2">
          <button
            onClick={sendGMTransaction}
            disabled={isBusy || isSwitching}
            className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 disabled:opacity-60 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
          >
            <Sun size={14} />
            {isWrongNetwork
              ? isSwitching
                ? 'Switching...'
                : 'Switch to Base'
              : isBusy
              ? gmStatus || 'Confirming...'
              : 'Say GM'}
          </button>

          {gmStatus && (
            <div className="px-2.5 py-1.5 rounded bg-[#0a0a0a]/90 border border-[#ffffff1a] font-mono text-[10px] text-[#00FF00] flex flex-col items-end gap-0.5">
              <span>{gmStatus}</span>
              {confirmedHash && (
                <a
                  href={`${BASESCAN_URL}/tx/${confirmedHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[9px] text-[#E8A020] underline"
                >
                  Basescan
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

