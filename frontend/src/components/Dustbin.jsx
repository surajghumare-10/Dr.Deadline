import React, { useState, useEffect } from 'react';

export default function Dustbin({ isShaking }) {
  return (
    <div 
      className={`fixed bottom-5 right-5 z-40 bg-neutral-900/90 text-neutral-100 p-3 sm:p-3.5 rounded-2xl border-2 border-neutral-700 shadow-2xl flex flex-col items-center justify-center transition-all cursor-pointer backdrop-blur-md group hover:border-amber-400 ${
        isShaking ? 'animate-shake border-amber-400 scale-110' : 'hover:scale-105'
      }`}
      title="Crumpled paper trash bin"
    >
      <div className="relative">
        <span className="text-2xl sm:text-3xl block group-hover:rotate-12 transition-transform">🗑️</span>
        {isShaking && (
          <span className="absolute -top-1 -right-1 text-xs">💥</span>
        )}
      </div>
      <span className="text-[9px] font-mono font-bold mt-0.5 text-neutral-400 group-hover:text-amber-300">
        DUSTBIN
      </span>
    </div>
  );
}
