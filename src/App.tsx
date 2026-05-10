import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from './lib/web3';
import { GameCanvas } from './game/GameCanvas';
import { MainMenu } from './components/views/MainMenu';
import { HUD } from './components/views/HUD';
import { GameOver } from './components/views/GameOver';
import { useGameStore } from './store/useGameStore';

const queryClient = new QueryClient();

export default function App() {
  const { gameState } = useGameStore();

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="relative w-full h-[100dvh] bg-black overflow-hidden font-sans">
          {/* Main Game Renderer */}
          <GameCanvas />

          {/* UI Overlays */}
          {gameState === 'menu' && <MainMenu />}
          {gameState === 'playing' && <HUD />}
          {gameState === 'gameover' && <GameOver />}
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

