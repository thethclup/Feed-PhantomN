import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/useGameStore';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import {
  encodeERC8021Attribution,
  ERC8021_DATA_SUFFIX,
  FEED_PHANTOM_APP_ID,
  FEED_PHANTOM_TARGET_ADDRESS,
} from '../../lib/erc8021';
import {
  useAccount,
  useChainId,
  useSendCalls,
  useSendTransaction,
  useSwitchChain,
  useWaitForCallsStatus,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { useWalletCapabilities } from '../../hooks/useWalletCapabilities';
import { concat } from 'viem';
import { BASE_MAINNET_CHAIN_ID, BASESCAN_URL } from '../../lib/web3';

export function GameOver() {
  const { score, echoesCollected, resetGame } = useGameStore();
  const [txStatus, setTxStatus] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const [callsId, setCallsId] = useState<string | undefined>(undefined);
  const [confirmedHash, setConfirmedHash] = useState<`0x${string}` | undefined>(undefined);

  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { supportsBatching } = useWalletCapabilities(BASE_MAINNET_CHAIN_ID);
  const { sendTransactionAsync, isPending: isSendingTx } = useSendTransaction();
  const { sendCallsAsync, isPending: isSendingCalls } = useSendCalls();

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
      setTxStatus('Confirmed on Base (200ms block)');
      setTxHash(undefined);
    }
  }, [isTxConfirmed, txHash]);

  useEffect(() => {
    if (isCallsConfirmed) {
      const receiptHash = callsStatus?.receipts?.[0]?.transactionHash;
      if (receiptHash) setConfirmedHash(receiptHash);
      setTxStatus('Confirmed on Base (200ms block)');
      setCallsId(undefined);
    }
  }, [isCallsConfirmed, callsStatus]);

  const isBusy = isSendingTx || isSendingCalls || isConfirmingTx || isConfirmingCalls;
  const isWrongNetwork = isConnected && chainId !== BASE_MAINNET_CHAIN_ID;

  const submitBaseAction = async (rawData: `0x${string}`, label: string) => {
    if (!isConnected) {
      setTxStatus('Wallet not connected');
      setTimeout(() => setTxStatus(null), 3000);
      return;
    }

    setConfirmedHash(undefined);
    setTxHash(undefined);
    setCallsId(undefined);
    setTxStatus(`Confirm ${label} in Wallet...`);

    try {
      if (supportsBatching) {
        const result = await sendCallsAsync({
          calls: [{ to: FEED_PHANTOM_TARGET_ADDRESS, data: rawData, value: BigInt(0) }],
          chainId: BASE_MAINNET_CHAIN_ID,
          capabilities: {
            dataSuffix: {
              value: ERC8021_DATA_SUFFIX,
              optional: true,
            },
          },
        });
        setCallsId(result.id);
        setTxStatus('Confirming in 200ms canonical block...');
      } else {
        const dataWithSuffix = concat([rawData, ERC8021_DATA_SUFFIX]);
        const hash = await sendTransactionAsync({
          to: FEED_PHANTOM_TARGET_ADDRESS,
          data: dataWithSuffix,
          value: BigInt(0),
          chainId: BASE_MAINNET_CHAIN_ID,
        });
        setTxHash(hash);
        setTxStatus('Confirming in 200ms canonical block...');
      }
    } catch (e: any) {
      setTxStatus(e?.shortMessage || e?.message?.slice(0, 32) || 'Tx Failed');
      setTimeout(() => setTxStatus(null), 4000);
    }
  };

  const handleRecordRun = () => {
    const txData = encodeERC8021Attribution(
      FEED_PHANTOM_APP_ID,
      JSON.stringify({ score: Math.floor(score), echoesCollected })
    );
    return submitBaseAction(txData, 'Run');
  };

  const handleSayGM = () => {
    return submitBaseAction('0x474d', 'GM');
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
            <div className="text-2xl font-bold text-white text-right">
              {Math.floor(score)}
              <span className="text-[#FF003C] text-sm ml-1">m</span>
            </div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#ffffff1a] rounded-xl p-4 flex flex-col justify-between h-24">
            <span className="text-[10px] text-[#ffffff66] uppercase">LOST ECHOES</span>
            <div className="text-2xl font-bold text-[#00FF00] text-right">{echoesCollected}</div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-[#0a0a0a] border border-[#ffffff1a] rounded-xl p-4 flex flex-col gap-3">
          <Button
            onClick={resetGame}
            className="w-full h-12 bg-[#BC13FE] text-black font-bold text-xs uppercase hover:bg-white transition-colors border-0"
          >
            Dive Again
          </Button>

          {isWrongNetwork ? (
            <Button
              variant="phantom"
              onClick={() => switchChain({ chainId: BASE_MAINNET_CHAIN_ID })}
              disabled={isSwitching}
              className="w-full text-[10px] uppercase border-[#FF003C]/50 text-[#FF003C] hover:bg-[#FF003C]/10"
            >
              {isSwitching ? 'Switching to Base...' : 'Switch to Base Mainnet'}
            </Button>
          ) : (
            <>
              <Button
                variant="phantom"
                onClick={handleRecordRun}
                disabled={isBusy}
                className="w-full text-[10px] uppercase border-[#ffffff1a] text-white hover:bg-[#ffffff05]"
              >
                {isBusy ? 'Processing...' : 'Record Run On-chain'}
              </Button>

              <Button
                variant="ghost"
                className="w-full border border-[#ffffff1a] bg-[#ffffff05] text-[10px] uppercase text-[#ffffffaa] hover:text-white"
                onClick={handleSayGM}
                disabled={isBusy}
              >
                Say GM [Base Mainnet · Denim]
              </Button>
            </>
          )}

          {txStatus && (
            <div className="flex flex-col items-center justify-center gap-1 p-2 bg-[#ffffff05] border border-[#ffffff0a] rounded mt-1">
              <p className="text-[10px] text-[#00FF00] uppercase animate-pulse">
                {'>'} {txStatus}
              </p>
              {confirmedHash && (
                <a
                  href={`${BASESCAN_URL}/tx/${confirmedHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[9px] text-[#BC13FE] underline uppercase"
                >
                  View on Basescan ({confirmedHash.slice(0, 8)}...)
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

