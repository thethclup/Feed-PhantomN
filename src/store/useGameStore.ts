import { create } from 'zustand';

export type GameState = 'menu' | 'playing' | 'gameover' | 'archive';

interface GameStore {
  gameState: GameState;
  score: number;
  depth: number;
  stealthMeter: number; // 0 to 100
  echoesCollected: number;
  
  // Actions
  setGameState: (state: GameState) => void;
  updateScore: (points: number) => void;
  updateDepth: (dp: number) => void;
  setStealthMeter: (val: number | ((prev: number) => number)) => void;
  addEcho: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'menu',
  score: 0,
  depth: 0,
  stealthMeter: 100, // Starts full
  echoesCollected: 0,
  
  setGameState: (state) => set({ gameState: state }),
  updateScore: (points) => set((s) => ({ score: s.score + points })),
  updateDepth: (dp) => set((s) => ({ depth: s.depth + dp })),
  setStealthMeter: (val) => set((s) => {
    const nextVal = typeof val === 'function' ? val(s.stealthMeter) : val;
    return { stealthMeter: Math.max(0, Math.min(100, nextVal)) };
  }),
  addEcho: () => set((s) => ({ echoesCollected: s.echoesCollected + 1, score: s.score + 50 })),
  resetGame: () => set({
    gameState: 'playing',
    score: 0,
    depth: 0,
    stealthMeter: 100,
    echoesCollected: 0
  })
}));
