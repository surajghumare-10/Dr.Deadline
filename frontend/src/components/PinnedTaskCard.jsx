import React, { useState, useRef } from 'react';
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
  const cardRef = useRef(null);
  const [isCrumpling, setIsCrumpling] = useState(false);
  const [crumpleTransform, setCrumpleTransform] = useState({ x: 0, y: 0 });

  const pinColor = PIN_COLORS[index % PIN_COLORS.length];
  const defaultRotation = CARD_ROTATIONS[index % CARD_ROTATIONS.length];

  // 1. TACTILE TEAR DONE ACTION
  const handleToggle = (e) => {
    e.stopPropagation();
    playRipSound();

    if (!task.is_done) {
      try {
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#ffffff']
        });
      } catch (err) {}
    }

    onToggleDone(task.id, !task.is_done);
  };

  // 2. REALISTIC CRUMPLE & FLY-TO-DUSTBIN ACTION
  const handleDelete = (e) => {
    e.stopPropagation();
    playCrumpleSound();

    if (cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      const binEl = document.getElementById('dorm-dustbin');

      let targetDeltaX = 250;
      let targetDeltaY = 350;

      if (binEl) {
        const binRect = binEl.getBoundingClientRect();
        targetDeltaX = (binRect.left + binRect.width / 2) - (cardRect.left + cardRect.width / 2);
        targetDeltaY = (binRect.top + binRect.height / 2) - (cardRect.top + cardRect.height / 2);
      }

      setCrumpleTransform({ x: targetDeltaX, y: targetDeltaY });
      setIsCrumpling(true);

      // Complete deletion when paper ball lands inside bin
      setTimeout(() => {
        onDelete(task.id);
      }, 700);
    } else {
      onDelete(task.id);
    }
  };

  // Remaining time clock display
  const renderRemainingTime = () => {
    if (!task.due_date) return null;
    const isUrgent = (task.priority || '').toLowerCase() === 'high';
    return (
      <div className={`mt-2 rounded-lg p-1.5 flex items-center justify-between font-mono text-[10px] border ${
        isUrgent 
          ? 'bg-rose-500/15 border-rose-400/50 text-rose-800' 
          : 'bg-amber-100/80 border-amber-300/60 text-amber-900'
      }`}>
        <span className="flex items-center gap-1 font-bold">
          <span className={isUrgent ? 'animate-pulse' : ''}>⏳</span>
          {task.due_date}
        </span>
        <span className="opacity-75 font-semibold">
          {task.priority || 'Medium'}
        </span>
      </div>
    );
  };

  return (
    <div
      ref={cardRef}
      style={isCrumpling ? {
        '--target-x': `${crumpleTransform.x}px`,
        '--target-y': `${crumpleTransform.y}px`,
        transform: `translate(${crumpleTransform.x}px, ${crumpleTransform.y}px) scale(0.12) rotate(720deg)`,
        transition: 'transform 0.68s cubic-bezier(0.55, 0.055, 0.675, 0.19), opacity 0.68s ease-in',
        opacity: 0,
        zIndex: 50,
        borderRadius: '50%'
      } : {}}
      className={`relative group transition-all duration-300 ${defaultRotation} ${
        isCrumpling ? 'crumpled-paper-ball pointer-events-none' : ''
      }`}
    >
      {/* =========================================================================
          STATE A: TASK IS DONE -> PHYSICALLY TORN IN TWO PIECES!
          ========================================================================= */}
      {task.is_done ? (
        <div className="relative">
          {/* 3D Pushpin firmly holding the top torn half */}
          <div className={`pushpin-3d ${pinColor}`}></div>

          {/* TOP TORN HALF */}
          <div className="bg-[#fff9c4] text-neutral-900 rounded-t-2xl p-4 pb-6 shadow-md border-t-4 border-emerald-500 torn-edge-bottom relative">
            {/* Top Washi Tape Badges */}
            <div className="flex items-center justify-between gap-1 text-[10px] font-bold mb-2 pt-0.5">
              <span className="px-2 py-0.5 rounded washi-tape text-neutral-800 font-mono tracking-wider">
                {task.category || 'Academic'}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono font-bold tracking-tight shadow-sm">
                ✂️ CLEARED
              </span>
            </div>

            {/* Task Title (Ripped through) */}
            <h4 className="font-bold text-xs sm:text-sm text-neutral-500 line-through leading-snug">
              {task.title}
            </h4>

            {/* Realistic Ink Stamp Slammed across the rip */}
            <div className="absolute -bottom-4 right-6 z-20 animate-stamp-slam pointer-events-none">
              <div className="border-3 border-emerald-600 bg-emerald-50/95 text-emerald-800 font-mono font-black text-xs uppercase px-2.5 py-1 rounded shadow-lg tracking-wider transform -rotate-12">
                💯 TORN & CLEARED
              </div>
            </div>
          </div>

          {/* VISIBLE RIPPED PAPER GAP (Showing the Corkboard underneath) */}
          <div className="h-3.5"></div>

          {/* BOTTOM TORN HALF (Dropped down and tilted crookedly) */}
          <div className="bg-[#fff9c4] text-neutral-900 rounded-b-2xl p-4 pt-4 shadow-lg border-b-2 border-emerald-500/40 torn-edge-top animate-tear-drop opacity-95">
            {/* Due date */}
            {renderRemainingTime()}

            {/* Group Role if present */}
            {task.group_name && (
              <div className="mt-2 text-[10px] bg-neutral-900/5 px-2 py-1 rounded-md flex items-center justify-between font-mono text-neutral-600">
                <span className="font-bold">👥 {task.group_name}</span>
                {task.assigned_role && (
                  <span className="text-indigo-700 font-semibold">
                    Role: {task.assigned_role}
                  </span>
                )}
              </div>
            )}

            {/* Bottom Controls */}
            <div className="mt-3 pt-2 border-t border-black/10 flex items-center justify-between text-xs">
              <button
                onClick={handleToggle}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-all cursor-pointer shadow-sm"
                title="Tape back together and reopen"
              >
                🔄 Tape Back (Untear)
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
        </div>
      ) : (
        /* =========================================================================
           STATE B: TASK IS OPEN -> CLEAN PINNED STUDY NOTE
           ========================================================================= */
        <div className={`bg-[#fef9c3] text-neutral-900 rounded-2xl p-4 shadow-xl border-t-4 hover:scale-[1.02] hover:rotate-0 transition-all ${
          task.priority === 'High' ? 'border-rose-500' : 'border-amber-400'
        }`}>
          {/* 3D Pushpin */}
          <div className={`pushpin-3d ${pinColor}`}></div>

          {/* Top Tape Badges */}
          <div className="flex items-center justify-between gap-1 text-[10px] font-bold mb-2 pt-0.5">
            <span className="px-2 py-0.5 rounded washi-tape text-neutral-800 font-mono tracking-wider">
              {task.category || 'Academic'}
            </span>

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
          <div className="py-1">
            <h4 className="font-bold text-xs sm:text-sm text-neutral-900 leading-snug">
              {task.title}
            </h4>
          </div>

          {/* Due Date & Countdown */}
          {renderRemainingTime()}

          {/* Group & Role Tag */}
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

          {/* Footer Actions */}
          <div className="mt-3 pt-2 border-t border-black/10 flex items-center justify-between text-xs">
            <button
              onClick={handleToggle}
              className="px-3 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title="Physically tear paper in half to complete!"
            >
              ✂️ Tear Done
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
      )}
    </div>
  );
}
