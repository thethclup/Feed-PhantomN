import React from 'react';
import { WagmiProvider, useAccount, useSendTransaction } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from './lib/web3';
import { GameCanvas } from './game/GameCanvas';
import { MainMenu } from './components/views/MainMenu';
import { HUD } from './components/views/HUD';
import { GameOver } from './components/views/GameOver';
import { useGameStore } from './store/useGameStore';
import { Sun } from 'lucide-react';

const queryClient = new QueryClient();

function AppContent() {
  const { gameState } = useGameStore();
  const { isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();

  const sendGMTransaction = async () => {
    try {
      if (!isConnected) return;
      await sendTransactionAsync({
        to: "0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7",
        value: BigInt(0),
        data: "0x474d" // 'GM' in hex
      });
      alert('GM Transaction Successful!');
    } catch (e) {
      console.error(e);
      alert('Tx Failed');
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
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={sendGMTransaction}
            className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
          >
            <Sun size={14} />
            Say GM
          </button>
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

