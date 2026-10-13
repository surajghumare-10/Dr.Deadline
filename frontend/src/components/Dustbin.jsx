import React, { useState, useEffect } from 'react';

export default function Dustbin({ isShaking }) {
  const [showTrashEffect, setShowTrashEffect] = useState(false);

  useEffect(() => {
    if (isShaking) {
      setShowTrashEffect(true);
      const timer = setTimeout(() => setShowTrashEffect(false), 900);
      return () => clearTimeout(timer);
    }
  }, [isShaking]);

  return (
    <div 
      id="dorm-dustbin"
      className={`fixed bottom-5 right-5 z-40 bg-neutral-900/95 text-neutral-100 p-3 sm:p-4 rounded-2xl border-3 shadow-2xl flex flex-col items-center justify-center transition-all cursor-pointer backdrop-blur-md group ${
        isShaking 
          ? 'animate-shake border-amber-400 bg-neutral-800 scale-125 shadow-amber-500/30' 
          : 'border-neutral-700 hover:border-amber-400 hover:scale-105'
      }`}
      title="Crumpled paper trash bin"
    >
      <div className="relative">
        <span className={`text-2xl sm:text-3xl block transition-transform ${isShaking ? 'rotate-12 scale-110' : 'group-hover:rotate-12'}`}>
          🗑️
        </span>
        
        {/* Poof effect on trash impact */}
        {showTrashEffect && (
          <div className="absolute -top-6 -left-3 whitespace-nowrap bg-amber-400 text-neutral-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg border border-black animate-bounce font-mono">
            CRUMPLED! 💥
          </div>
        )}
      </div>

      <span className="text-[9px] font-mono font-black mt-1 text-neutral-400 group-hover:text-amber-300">
        DUSTBIN
      </span>
    </div>
  );
}
