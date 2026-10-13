import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { playRipSound, playCrumpleSound } from '../utils/soundEffects';

const PIN_COLORS = [
  'bg-rose-500',
  'bg-sky-500',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-purple-500',
];

const CARD_ROTATIONS = [
  '-rotate-1',
  'rotate-1',
  '-rotate-2',
  'rotate-2',
  'rotate-0',
];

export default function PinnedTaskCard({ task, index, onToggleDone, onDelete }) {
  const [isCrumpling, setIsCrumpling] = useState(false);

  const pinColor = PIN_COLORS[index % PIN_COLORS.length];
  const rotation = CARD_ROTATIONS[index % CARD_ROTATIONS.length];

  const handleToggle = (e) => {
    e.stopPropagation();
    playRipSound();
    
    // Trigger confetti if marking as done
    if (!task.is_done) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (err) {}
    }

    onToggleDone(task.id, !task.is_done);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    playCrumpleSound();
    setIsCrumpling(true);

    // Give time for crumple animation before removing from state
    setTimeout(() => {
      onDelete(task.id);
    }, 700);
  };

  // Remaining time clock calculation helper
  const getRemainingTimeDisplay = (dueDate) => {
    if (!dueDate) return null;
    const isUrgent = (task.priority || '').toLowerCase() === 'high';
    return (
      <div className={`mt-2.5 rounded-lg p-1.5 flex items-center justify-between font-mono text-[10px] border ${
        isUrgent 
          ? 'bg-rose-500/10 border-rose-400/40 text-rose-800' 
          : 'bg-amber-100/70 border-amber-300/50 text-amber-900'
      }`}>
        <span className="flex items-center gap-1 font-bold">
          <span className={isUrgent ? 'animate-pulse' : ''}>⏳</span>
          {dueDate}
        </span>
        <span className="opacity-80">
          {task.priority || 'Medium'}
        </span>
      </div>
    );
  };

  return (
    <div 
      className={`relative group bg-[#fef9c3] text-neutral-900 rounded-2xl p-4 shadow-xl border-t-4 transition-all duration-300 ${rotation} hover:rotate-0 hover:scale-[1.02] ${
        task.is_done 
          ? 'border-emerald-500 bg-[#eef8ee] opacity-85' 
          : task.priority === 'High' 
            ? 'border-rose-500' 
            : 'border-amber-400'
      } ${isCrumpling ? 'animate-crumple pointer-events-none' : ''}`}
    >
      {/* 3D Pushpin */}
      <div className={`pushpin-3d ${pinColor}`}></div>

      {/* Top Tape Badges */}
      <div className="flex items-center justify-between gap-1 text-[10px] font-bold mb-2 pt-0.5">
        {/* Category Tape */}
        <span className="px-2 py-0.5 rounded washi-tape text-neutral-800 font-mono tracking-wider">
          {task.category || 'Academic'}
        </span>

        {/* Priority Tape */}
        {task.priority === 'High' && (
          <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold tracking-tight shadow-sm">
            🚨 11:59 PM DEADLINE
          </span>
        )}
        {task.priority === 'Medium' && (
          <span className="px-2 py-0.5 rounded bg-amber-400 text-neutral-950 font-bold">
            ⚡ LAB / MIDTERM
          </span>
        )}
        {task.priority === 'Low' && (
          <span className="px-2 py-0.5 rounded bg-sky-200 text-sky-900 font-bold">
            ☕ CHILL STUDY
          </span>
        )}
      </div>

      {/* Task Content */}
      <div className="relative py-1">
        <h4 className={`font-bold text-xs sm:text-sm text-neutral-900 leading-snug transition-all ${
          task.is_done ? 'line-through text-neutral-500' : ''
        }`}>
          {task.title}
        </h4>

        {/* Torn Paper Rip Badge if completed */}
        {task.is_done && (
          <div className="inline-block bg-white/95 text-emerald-700 border-2 border-dashed border-emerald-500 px-2 py-0.5 rounded text-[10px] font-mono font-black mt-2 shadow-sm transform -rotate-1">
            ✂️ [ TORN & CLEARED ]
          </div>
        )}
      </div>

      {/* Due Date & Clock */}
      {getRemainingTimeDisplay(task.due_date)}

      {/* Group & Role Tag (if assigned) */}
      {task.group_name && (
        <div className="mt-2 text-[10px] bg-neutral-900/5 px-2 py-1 rounded-md flex items-center justify-between font-mono text-neutral-700">
          <span className="font-bold flex items-center gap-1">
            <span>👥</span> {task.group_name}
          </span>
          {task.assigned_role && (
            <span className="text-indigo-700 font-bold">
              Role: {task.assigned_role}
            </span>
          )}
        </div>
      )}

      {/* Card Footer Actions */}
      <div className="mt-3 pt-2 border-t border-black/10 flex items-center justify-between text-xs">
        <button
          onClick={handleToggle}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm ${
            task.is_done
              ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-105'
          }`}
          title={task.is_done ? "Untear & reopen task" : "Tear paper to mark done"}
        >
          {task.is_done ? "🔄 Untear Paper" : "✂️ Tear Done"}
        </button>

        <button
          onClick={handleDelete}
          className="p-1 rounded-lg hover:bg-rose-100 text-neutral-400 hover:text-rose-600 transition-colors text-xs cursor-pointer"
          title="Crumple and toss in dustbin"
        >
          🗑️
        </button>
      </div>

    </div>
  );
}
