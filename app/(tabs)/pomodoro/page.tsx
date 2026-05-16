'use client';

import { useEffect, useRef } from 'react';
import { usePomodoro, POMODORO_WORK, POMODORO_BREAK } from '@protracker/shared';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function PomodoroPage() {
  const pomo = usePomodoro();
  const prevRemainingRef = useRef(pomo.remaining);

  // Sound alert on complete
  useEffect(() => {
    if (prevRemainingRef.current === 1 && pomo.remaining === 0) {
      // Play a beep sound using Web Audio API
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          
          gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
          
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
        }
      } catch (e) {
        console.error('Audio play failed', e);
      }
    }
    prevRemainingRef.current = pomo.remaining;
  }, [pomo.remaining]);

  const maxTime = pomo.mode === 'work' ? POMODORO_WORK : POMODORO_BREAK;
  const progress = ((maxTime - pomo.remaining) / maxTime) * 100;

  // SVG Ring calculation
  const radius = 140;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4 w-full">
      <div className="text-center w-full max-w-md">
        
        <div className="flex justify-center mb-8 gap-4">
          <button 
            onClick={() => pomo.setMode('work')} 
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${pomo.mode === 'work' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            Focus
          </button>
          <button 
            onClick={() => pomo.setMode('break')} 
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${pomo.mode === 'break' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
          >
            Break
          </button>
        </div>

        <div className="relative flex items-center justify-center mx-auto w-64 h-64 sm:w-80 sm:h-80 mb-10">
          <svg
            className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-xl"
            viewBox={`0 0 ${radius * 2} ${radius * 2}`}
          >
            <circle
              stroke="#1f2937"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              stroke={pomo.mode === 'work' ? '#3b82f6' : '#22c55e'}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s linear' }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
          <div className="absolute flex flex-col items-center z-10">
            <h1 className="text-5xl sm:text-7xl font-mono font-bold text-white mb-2 tracking-tighter">
              {formatTime(pomo.remaining)}
            </h1>
            <p className={`text-lg sm:text-xl font-medium tracking-wide ${pomo.mode === 'work' ? 'text-blue-400' : 'text-green-400'}`}>
              {pomo.mode === 'work' ? '🍅 Focus Time' : '☕ Break Time'}
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center mb-10">
          <button 
            onClick={pomo.toggle} 
            className={`px-10 py-4 rounded-2xl font-bold text-xl transition-all active:scale-95 shadow-lg ${pomo.running ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' : 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20'}`}
          >
            {pomo.running ? 'Pause' : 'Start'}
          </button>
          <button 
            onClick={pomo.reset} 
            className="px-10 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-2xl font-bold text-xl transition-all active:scale-95 shadow-lg"
          >
            Reset
          </button>
        </div>
        
        <div className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700/50">
          <div className="flex justify-around items-center">
            <div className="text-center">
              <p className="text-gray-400 text-sm uppercase tracking-widest mb-1 font-semibold">Sessions</p>
              <p className="text-4xl font-bold text-white">{pomo.sessionsDone}</p>
            </div>
            <div className="w-px h-16 bg-gray-700/50"></div>
            <div className="text-center">
              <p className="text-gray-400 text-sm uppercase tracking-widest mb-1 font-semibold">Total XP</p>
              <p className="text-4xl font-bold text-yellow-400">{pomo.totalXP}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}