import React from 'react';
import { useGameStore } from '../../store/useGameStore';

export function HUD() {
  const { score, echoesCollected, stealthMeter } = useGameStore();

  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none p-4 flex flex-col justify-between font-mono">
      {/* Top Bar - Bento Cards */}
      <div className="flex justify-between items-start gap-4">
        {/* Left Side: Score & Echoes */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur border border-[#ffffff1a] rounded-lg p-3 flex flex-col gap-2 min-w-[120px]">
          <div className="flex justify-between items-center">
            <span className="text-[9px] uppercase text-[#ffffff66]">Depth</span>
            <span className="text-white font-bold">{Math.floor(score)}<span className="text-[#FF003C] text-[10px] ml-1">m</span></span>
          </div>
          <div className="h-px bg-[#ffffff0a] w-full" />
          <div className="flex justify-between items-center">
            <span className="text-[9px] uppercase text-[#ffffff66]">Echoes</span>
            <span className="text-[#00FF00] font-bold">{echoesCollected}</span>
          </div>
        </div>
        
        {/* Right Side: Active Status */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur border border-[#ffffff1a] rounded-lg p-2 px-3 flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-[#BC13FE] animate-pulse"></div>
           <span className="text-[9px] uppercase text-white">Live Scroll</span>
        </div>
      </div>

      {/* Bottom Bar: Stealth Meter Bento style */}
      <div className="w-full max-w-sm mx-auto bg-[#0a0a0a]/80 backdrop-blur border border-[#ffffff1a] rounded-lg p-3 flex flex-col gap-1 mb-4">
        <div className="flex justify-between items-end mb-1">
          <span className="text-[10px] uppercase text-[#ffffff66]">Visibility Meter</span>
          <span className="text-[10px] uppercase text-white">{Math.floor(stealthMeter)}%</span>
        </div>
        <div className="w-full h-2 bg-[#1a1a1a] border border-[#ffffff22] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#00FF00] to-[#BC13FE] transition-all duration-75 ease-linear shadow-[0_0_10px_rgba(0,240,255,0.5)]"
            style={{ width: `${stealthMeter}%` }}
          />
        </div>
      </div>
    </div>
  );
}
