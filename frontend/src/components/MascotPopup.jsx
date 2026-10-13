import React, { useState, useEffect } from 'react';
import { playMascotAlarm } from '../utils/soundEffects';

const PUNISHMENTS = [
  "Finish this right now or I will secretly eat all your midnight Maggi noodles! 🍜😾",
  "Procrastination detected! If this isn't done in 30 mins, I am enrolling you in 8:00 AM Sunday Calculus! 📚⚡",
  "Academic Emergency! Turn this in or I'm taking custody of the dorm AUX cord and blasting elevator music! 🎶🙉",
  "Hey! Your GPA is crying! Mark this done or I will change the room Wi-Fi password to 'studynow123'! 🔌😈",
  "Do this now or I will tell your group project teammates that you volunteered to write the entire 50-page report alone! 📄😱",
  "If you close this window without finishing, I will set your morning alarm to an angry air horn! 🎺⏰"
];

export default function MascotPopup({ pendingTasks, onCompleteTask }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [punishment, setPunishment] = useState("");
  const [punishmentLevel, setPunishmentLevel] = useState(1);
  const [snoozeCount, setSnoozeCount] = useState(0);

  // Trigger mascot periodically or when there are high priority tasks
  useEffect(() => {
    // Initial surprise pop up after 15 seconds if there are open tasks
    const timer = setTimeout(() => {
      triggerMascot();
    }, 12000);

    return () => clearTimeout(timer);
  }, [pendingTasks]);

  const triggerMascot = (forcedTask = null) => {
    const task = forcedTask || (pendingTasks && pendingTasks.length > 0 
      ? pendingTasks.find(t => t.priority === 'High') || pendingTasks[0]
      : null);

    if (!task) return;

    setCurrentTask(task);
    const randomPunishment = PUNISHMENTS[Math.floor(Math.random() * PUNISHMENTS.length)];
    setPunishment(randomPunishment);
    setIsOpen(true);
    playMascotAlarm();
  };

  // Expose trigger to parent window if desired
  useEffect(() => {
    window.__triggerDrDeadline = triggerMascot;
  }, [pendingTasks]);

  const handleSnooze = () => {
    setIsOpen(false);
    setSnoozeCount(prev => prev + 1);
    setPunishmentLevel(prev => prev + 1);

    // Re-emerges in 20 seconds with extra anger
    setTimeout(() => {
      triggerMascot();
    }, 20000);
  };

  const handleImOnIt = () => {
    if (currentTask && onCompleteTask) {
      onCompleteTask(currentTask.id);
    }
    setIsOpen(false);
  };

  if (!isOpen || !currentTask) {
    return (
      <button 
        onClick={() => triggerMascot()}
        className="fixed bottom-4 left-4 z-40 bg-neutral-900/90 text-amber-400 border border-amber-500/30 px-3 py-2 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur"
        title="Summon Proctor Mascot"
      >
        <span className="text-xl animate-bounce">🦉</span>
        <span className="hidden sm:inline">Dr. Deadline</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 left-5 z-50 max-w-sm w-[90vw] sm:w-[380px] animate-mascot">
      <div className="bg-neutral-950 text-neutral-100 rounded-3xl p-4 sm:p-5 shadow-2xl border-3 border-rose-500/90 relative overflow-hidden backdrop-blur-xl">
        
        {/* Glow Accent */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-rose-600/30 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-800 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-widest text-rose-400 font-mono">
              ⚠️ PROCTOR ALERT #{snoozeCount + 1}
            </span>
            <span className="bg-rose-500 text-neutral-950 text-[10px] font-black px-1.5 py-0.2 rounded uppercase">
              RAGE LVL {punishmentLevel}
            </span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-neutral-500 hover:text-white text-xs font-bold p-1 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Mascot & Dialogue */}
        <div className="flex items-start gap-3.5">
          {/* Animated 3D Avatar */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-rose-600 to-indigo-600 flex items-center justify-center text-3xl shadow-lg border-2 border-rose-400 animate-bounce">
              🦉
            </div>
            <div className="absolute -bottom-1 -right-1 bg-rose-600 text-[10px] font-black text-white px-1 rounded-full border border-white">
              !
            </div>
          </div>

          <div className="flex-1">
            <h4 className="font-extrabold text-xs text-amber-300 tracking-tight">
              DR. DEADLINE (DORM MONITOR)
            </h4>
            
            <p className="text-[11px] font-medium text-neutral-300 mt-1 leading-snug">
              Hey student! Your task <span className="text-white font-bold underline decoration-amber-400">"{currentTask.title}"</span> is still waiting!
            </p>

            <div className="mt-2 p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-[11px] font-bold leading-tight">
              💢 <strong>PUNISHMENT:</strong> {punishment}
            </div>
          </div>
        </div>

        {/* Interactive Action Buttons */}
        <div className="mt-3.5 pt-2 border-t border-neutral-800/80 flex items-center justify-end gap-2 text-xs">
          <button
            onClick={handleSnooze}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 font-bold text-[11px] transition-all cursor-pointer"
          >
            ⏰ Snooze (I Dare You)
          </button>
          <button
            onClick={handleImOnIt}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-[11px] shadow-lg shadow-emerald-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            ✂️ Slay & Tear Done!
          </button>
        </div>

      </div>
    </div>
  );
}
