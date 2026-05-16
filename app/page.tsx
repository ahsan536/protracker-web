'use client';
import { usePomodoro } from '@protracker/shared';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Home() {
  const pomo = usePomodoro();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-mono font-bold text-blue-400 mb-8">
          {formatTime(pomo.remaining)}
        </h1>
        <p className="text-xl text-gray-400 mb-6">
          {pomo.mode === 'work' ? '🍅 Focus Time' : '☕ Break Time'}
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={pomo.toggle} className="px-6 py-3 bg-blue-500 text-white rounded-lg">
            {pomo.running ? 'Pause' : 'Start'}
          </button>
          <button onClick={pomo.reset} className="px-6 py-3 bg-gray-700 text-white rounded-lg">
            Reset
          </button>
        </div>
        <p className="text-gray-500 mt-8">Sessions: {pomo.sessionsDone} | XP: {pomo.totalXP}</p>
      </div>
    </div>
  );
}