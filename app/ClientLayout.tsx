'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900 text-white">
      {/* Mobile hamburger button */}
      <button
        className="md:hidden absolute top-4 left-4 z-50 p-2 bg-gray-800 rounded-md text-white"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      </button>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 w-64 h-full bg-gray-800 border-r border-gray-700 transition-transform duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 text-2xl font-bold text-blue-400 border-b border-gray-700">
          ProTracker
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/pomodoro" className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
            🍅 Pomodoro
          </Link>
          <Link href="/" className="block px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
            🏠 Home
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10 w-full h-full">
        {children}
      </main>
    </div>
  );
}
