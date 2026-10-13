import React from 'react';

export default function StudentStatsBar({ 
  tasks, 
  currentTheme, 
  onThemeChange, 
  apiHealth 
}) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.is_done).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Gamification badges based on progress
  const hasCaffeineBadge = completed >= 1;
  const hasAllNighterBadge = tasks.some(t => t.is_done && t.priority === 'High');
  const hasDeansListBadge = percentage >= 75 && total >= 3;

  return (
    <div className="bg-neutral-900/80 backdrop-blur-md text-neutral-100 border border-neutral-800 rounded-2xl p-3 sm:p-4 mb-4 shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
      
      {/* Left: Progress & Velocity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-base font-black">
            🎓
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs">ACADEMIC RECORD</span>
              <span className="bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                {percentage}% SUBMITTED
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
              {completed} of {total} obligations cleared
            </p>
          </div>
        </div>

        {/* Small Progress Bar */}
        <div className="hidden sm:block w-28 bg-neutral-800 h-2 rounded-full overflow-hidden border border-neutral-700">
          <div 
            className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Center: Unlocked Badges */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] font-mono text-neutral-500 mr-1 hidden md:inline">TROPHIES:</span>
        <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold transition-all ${
          hasCaffeineBadge 
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm' 
            : 'bg-neutral-800/40 text-neutral-600 border-neutral-800'
        }`} title={hasCaffeineBadge ? "Unlocked: Slayed 1+ task!" : "Locked: Finish 1 task"}>
          ☕ Caffeine Overlord
        </span>

        <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold transition-all ${
          hasAllNighterBadge 
            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm' 
            : 'bg-neutral-800/40 text-neutral-600 border-neutral-800'
        }`} title={hasAllNighterBadge ? "Unlocked: Conquered High priority deadline!" : "Locked: Finish a High priority task"}>
          ⚡ All-Nighter Survivor
        </span>

        <span className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold transition-all ${
          hasDeansListBadge 
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm' 
            : 'bg-neutral-800/40 text-neutral-600 border-neutral-800'
        }`} title={hasDeansListBadge ? "Unlocked: 75%+ completion rate!" : "Locked: Reach 75% completion"}>
          💯 Dean's List
        </span>
      </div>

      {/* Right: Desk Background Switcher & Backend Health */}
      <div className="flex items-center gap-2">
        {/* Background Theme Selector */}
        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-[11px]">
          <button
            onClick={() => onThemeChange('corkboard')}
            className={`px-2 py-1 rounded-lg font-bold transition-all ${
              currentTheme === 'corkboard' ? 'bg-amber-600 text-white shadow' : 'text-neutral-400 hover:text-white'
            }`}
            title="Classic Corkboard"
          >
            📌 Cork
          </button>
          <button
            onClick={() => onThemeChange('wood')}
            className={`px-2 py-1 rounded-lg font-bold transition-all ${
              currentTheme === 'wood' ? 'bg-amber-900 text-amber-100 shadow' : 'text-neutral-400 hover:text-white'
            }`}
            title="Dark Walnut Desk"
          >
            🪵 Desk
          </button>
          <button
            onClick={() => onThemeChange('lofi')}
            className={`px-2 py-1 rounded-lg font-bold transition-all ${
              currentTheme === 'lofi' ? 'bg-indigo-600 text-white shadow' : 'text-neutral-400 hover:text-white'
            }`}
            title="Lofi Midnight Desk"
          >
            🌙 Lofi
          </button>
        </div>

        {/* Database Status indicator */}
        <div className="font-mono text-[10px] flex items-center gap-1.5 px-2 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300">
          <span className={`w-2 h-2 rounded-full ${apiHealth.supabase_connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          <span>{apiHealth.supabase_connected ? 'SUPABASE POSTGRES' : 'LOCAL CACHE'}</span>
        </div>
      </div>

    </div>
  );
}
