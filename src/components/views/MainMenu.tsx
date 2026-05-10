import React from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function MainMenu() {
  const { setGameState } = useGameStore();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050505]/80 backdrop-blur-md p-6 font-mono"
    >
      <div className="w-full max-w-lg grid gap-4">
        {/* Header Title Panel */}
        <div className="bg-[#0a0a0a] border border-[#ffffff1a] rounded-xl p-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-[#FF003C] rounded flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,0,60,0.5)]">
            <span className="text-black font-black text-4xl">Φ</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-[#FF003C] uppercase glitch-effect mb-2">
            FEED PHANTOM
          </h1>
          <p className="text-[10px] text-[#ffffff66] uppercase tracking-[0.2em]">
            v1.0.4 // Base Mainnet Active
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Action Panel */}
          <div className="bg-[#0a0a0a] border border-[#ffffff1a] rounded-xl p-4 flex flex-col gap-3 justify-center">
            <Button onClick={() => setGameState('playing')} className="w-full h-12 bg-[#BC13FE] text-black font-bold text-[10px] uppercase rounded hover:bg-white transition-colors border-none tracking-widest shadow-[0_0_15px_rgba(188,19,254,0.3)]">
              Initiate Run
            </Button>
            
            <Button 
              variant="phantom" 
              onClick={() => isConnected ? disconnect() : connect({ connector: connectors[0] })} 
              className="w-full text-[10px] uppercase tracking-widest bg-transparent border-[#ffffff1a] text-[#00FF00] hover:bg-[#ffffff05]"
            >
              {isConnected ? `Wallet: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
            </Button>
          </div>

          {/* Info Panel / Instructions */}
          <div className="bg-[#0a0a0a] border border-[#ffffff1a] rounded-xl p-4 flex flex-col justify-center">
            <h3 className="text-[10px] uppercase font-bold text-[#ffffff44] mb-3 border-b border-[#ffffff1a] pb-2">
              System Instructions
            </h3>
            <div className="text-[9px] text-[#ffffff88] uppercase tracking-wider space-y-2">
              <div className="flex justify-between items-center bg-[#ffffff05] p-2 rounded">
                <span>Left Side Screen</span>
                <span className="text-[#00FF00]">Drag to Move</span>
              </div>
              <div className="flex justify-between items-center bg-[#ffffff05] p-2 rounded">
                <span>Right Side Screen</span>
                <span className="text-[#BC13FE]">Phantom Shift</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info panel */}
        <div className="flex justify-between items-center text-[8px] text-[#ffffff44] uppercase tracking-widest mt-2 px-2">
          <span>App ID: 691a0491...</span>
          <span className="flex-1 text-center text-[#ff003c] animate-pulse">Waiting for Ghost...</span>
          <span>● ERC-8021 Node</span>
        </div>
      </div>
    </motion.div>
  );
}
