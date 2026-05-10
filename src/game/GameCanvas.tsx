import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'post' | 'echo' | 'scan';
  speed: number;
  active: boolean;
}

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { gameState, updateScore, updateDepth, addEcho, setStealthMeter, setGameState, stealthMeter } = useGameStore();
  
  const gameRef = useRef({
    player: { x: window.innerWidth / 2, y: 0, size: 24, isStealth: false },
    entities: [] as Entity[],
    lastTime: 0,
    spawnTimer: 0,
    speedMult: 1,
  });

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
        gameRef.current.player.y = canvasRef.current.height - 120;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Controls
  useEffect(() => {
    let touchStartX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const screenWidth = window.innerWidth;
      
      // Right side screen tap/hold for Stealth
      if (touch.clientX > screenWidth / 2) {
        if (useGameStore.getState().stealthMeter > 0) {
           gameRef.current.player.isStealth = true;
        }
      } else {
        // Left side drag setup
        touchStartX = touch.clientX;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      const screenWidth = window.innerWidth;
      
      if (touch.clientX <= screenWidth / 2) {
        const delta = touch.clientX - touchStartX;
        gameRef.current.player.x += delta * 1.5; // Sensitivity
        touchStartX = touch.clientX;
        
        // Clamp
        if (canvasRef.current) {
           gameRef.current.player.x = Math.max(20, Math.min(canvasRef.current.width - 20, gameRef.current.player.x));
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      // Disable stealth regardless of where finger lifted to be safe
      gameRef.current.player.isStealth = false;
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener('touchstart', handleTouchStart, { passive: false });
      el.addEventListener('touchmove', handleTouchMove, { passive: false });
      el.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    return () => {
      if (el) {
        el.removeEventListener('touchstart', handleTouchStart);
        el.removeEventListener('touchmove', handleTouchMove);
        el.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, []);

  // Main Loop
  useEffect(() => {
    let animationId: number;
    const ctx = canvasRef.current?.getContext('2d');

    const loop = (time: number) => {
      animationId = requestAnimationFrame(loop);
      if (!ctx || !canvasRef.current) return;
      
      const dt = time - gameRef.current.lastTime;
      gameRef.current.lastTime = time;

      const { width, height } = canvasRef.current;
      
      // Update logic if playing
      if (useGameStore.getState().gameState === 'playing') {
        const state = gameRef.current;
        const speed = 250 * state.speedMult * (dt / 1000);
        
        // Increase difficulty depth & score slowly
        updateDepth(1);
        updateScore(0.5);
        state.speedMult += 0.0001; // accelerate

        // Handle Stealth Meter Drain/Refill
        if (state.player.isStealth) {
          setStealthMeter((prev) => prev - (30 * (dt / 1000))); // Drain 30% per sec
          if (useGameStore.getState().stealthMeter <= 0) {
            state.player.isStealth = false;
          }
        } else {
          setStealthMeter((prev) => prev + (15 * (dt / 1000))); // Refill 15% per sec
        }

        // Spawn Entities
        state.spawnTimer -= dt;
        if (state.spawnTimer <= 0) {
          state.spawnTimer = 800 - Math.min(500, state.speedMult * 100);
          
          const roll = Math.random();
          if (roll < 0.2) {
             // Echo
             state.entities.push({
               x: 20 + Math.random() * (width - 40),
               y: -50, width: 20, height: 20, type: 'echo', speed: speed * 1.2, active: true
             });
          } else if (roll < 0.4) {
             // Scan Zone
             state.entities.push({
               x: 0, y: -100, width: width, height: 60, type: 'scan', speed: speed * 1.5, active: true
             });
          } else {
             // Post/Obstacle
             const w = 80 + Math.random() * 100;
             state.entities.push({
               x: Math.random() * (width - w),
               y: -100, width: w, height: 30, type: 'post', speed: speed, active: true
             });
          }
        }

        // Collision & Movement
        const pSize = state.player.size;
        state.entities.forEach(ent => {
          ent.y += ent.speed;
          
          // Collision Check
          if (ent.active && 
              Math.abs(state.player.x - (ent.x + ent.width/2)) < pSize + ent.width/2 &&
              Math.abs(state.player.y - (ent.y + ent.height/2)) < pSize + ent.height/2) {
            
            if (ent.type === 'echo') {
              ent.active = false;
              addEcho();
            } else if (ent.type === 'scan') {
              if (!state.player.isStealth) {
                setGameState('gameover');
              }
            } else if (ent.type === 'post') {
              if (!state.player.isStealth) { // Can phase through posts if stealth
                setGameState('gameover');
              }
            }
          }
        });

        state.entities = state.entities.filter(e => e.y < height + 100 && e.active);
      }

      // DRAW
      ctx.fillStyle = '#050508'; // Dark bg
      ctx.fillRect(0, 0, width, height);

      // Draw Grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
      ctx.lineWidth = 1;
      const offset = (time / 20) % 40;
      for (let y = offset; y < height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Draw Entities
      gameRef.current.entities.forEach(ent => {
        if (!ent.active) return;
        if (ent.type === 'echo') {
          ctx.fillStyle = '#00f0ff';
          ctx.beginPath();
          ctx.arc(ent.x + 10, ent.y + 10, 8, 0, Math.PI * 2);
          ctx.fill();
        } else if (ent.type === 'scan') {
          ctx.fillStyle = 'rgba(255, 42, 42, 0.4)'; // Red scanner
          ctx.fillRect(ent.x, ent.y, ent.width, ent.height);
          ctx.strokeStyle = '#ff2a2a';
          ctx.strokeRect(ent.x, ent.y, ent.width, ent.height);
        } else if (ent.type === 'post') {
          ctx.fillStyle = '#1a1a24';
          ctx.strokeStyle = '#b026ff';
          ctx.fillRect(ent.x, ent.y, ent.width, ent.height);
          ctx.strokeRect(ent.x, ent.y, ent.width, ent.height);
        }
      });

      // Draw Player
      if (useGameStore.getState().gameState === 'playing' || useGameStore.getState().gameState === 'menu') {
        const { x, y, size, isStealth } = gameRef.current.player;
        ctx.fillStyle = isStealth ? 'rgba(0, 240, 255, 0.3)' : '#00f0ff';
        ctx.shadowBlur = isStealth ? 5 : 20;
        ctx.shadowColor = '#00f0ff';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
    };

    animationId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden w-full h-full bg-black">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute inset-0 pointer-events-none scanline" />
    </div>
  );
}
