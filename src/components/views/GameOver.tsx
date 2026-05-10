import React, { useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import { encodeERC8021Attribution } from '../../lib/erc8021';
import { useSendTransaction, useAccount } from 'wagmi';

export function GameOver() {
  const { score, echoesCollected, resetGame } = useGameStore();
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const { address, isConnected } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();

  const handleRecordRun = async () => {
    if (!isConnected) {
      setTxStatus('Wallet not connected');
      setTimeout(() => setTxStatus(null), 3000);
      return;
    }
    setTxStatus('Requesting Signature...');
    try {
      const txData = encodeERC8021Attribution("691a0491669aee60603bddd1", JSON.stringify({ score, echoesCollected }));
      const hash = await sendTransactionAsync({
        to: "0x0000000000000000000000000000000000000000",
        data: txData,
        value: BigInt(0),
      });
      setTxStatus(`Tx: ${hash.slice(0, 8)}...`);
      setTimeout(() => setTxStatus(null), 5000);
    } catch (e: any) {
      setTxStatus(e.message?.slice(0, 20) || 'Tx Failed');
      setTimeout(() => setTxStatus(null), 3000);
    }
  };

  const handleSayGM = async () => {
    if (!isConnected) {
      setTxStatus('Wallet not connected');
      setTimeout(() => setTxStatus(null), 3000);
      return;
    }
    setTxStatus('Saying GM on Base...');
    try {
      const hash = await sendTransactionAsync({
        to: "0x0000000000000000000000000000000000000000",
        value: BigInt(0),
        data: "0x474d" // 'GM'
      });
      setTxStatus(`GM Tx: ${hash.slice(0, 8)}...`);
      setTimeout(() => setTxStatus(null), 5000);
    } catch (e: any) {
      setTxStatus(e.message?.slice(0, 20) || 'Tx Failed');
      setTimeout(() => setTxStatus(null), 3000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#050505]/90 p-6 backdrop-blur-md font-mono"
    >
      <div className="w-full max-w-lg grid gap-4">
        {/* Header Panel */}
        <div className="bg-[#0a0a0a] border border-[#ffffff1a] rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-[#FF003C] rounded flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(255,0,60,0.5)]">
             <span className="text-black font-black text-3xl">Φ</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter text-[#FF003C] uppercase glitch-effect shadow-[0_0_15px_rgba(255,0,60,0.8)]">
            DETECTED
          </h2>
          <p className="text-[10px] text-[#ffffff66] uppercase mt-2">
            The Algorithm found you. Your path through the feed ends here.
          </p>
        </div>

        {/* Stats Grid Panel */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0a0a0a] border border-[#ffffff1a] rounded-xl p-4 flex flex-col justify-between h-24">
            <span className="text-[10px] text-[#ffffff66] uppercase">DEPTH SCORE</span>
            <div className="text-2xl font-bold text-white text-right">{Math.floor(score)}<span className="text-[#FF003C] text-sm ml-1">m</span></div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#ffffff1a] rounded-xl p-4 flex flex-col justify-between h-24">
            <span className="text-[10px] text-[#ffffff66] uppercase">LOST ECHOES</span>
            <div className="text-2xl font-bold text-[#00FF00] text-right">{echoesCollected}</div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-[#0a0a0a] border border-[#ffffff1a] rounded-xl p-4 flex flex-col gap-3">
          <Button onClick={resetGame} className="w-full h-12 bg-[#BC13FE] text-black font-bold text-xs uppercase hover:bg-white transition-colors border-0">
            Dive Again
          </Button>
          
          <Button variant="phantom" onClick={handleRecordRun} disabled={!!txStatus} className="w-full text-[10px] uppercase border-[#ffffff1a] text-white hover:bg-[#ffffff05]">
            Record Run On-chain
          </Button>

          <Button variant="ghost" className="w-full border border-[#ffffff1a] bg-[#ffffff05] text-[10px] uppercase text-[#ffffffaa] hover:text-white" onClick={handleSayGM} disabled={!!txStatus}>
            Say GM [Base Mainnet]
          </Button>
          
          {txStatus && (
            <div className="flex items-center justify-center p-2 bg-[#ffffff05] border border-[#ffffff0a] rounded mt-2">
              <p className="text-[10px] text-[#00FF00] uppercase animate-pulse">
                {">"} {txStatus}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
