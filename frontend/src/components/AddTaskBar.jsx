import React, { useState } from 'react';
import { playPinSound } from '../utils/soundEffects';

export default function AddTaskBar({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('Today 23:59');
  const [category, setCategory] = useState('Academic');
  const [groupName, setGroupName] = useState('');
  const [assignedRole, setAssignedRole] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    playPinSound();

    onAddTask({
      title: title.trim(),
      priority,
      due_date: dueDate.trim() || 'Today 23:59',
      category,
      group_name: groupName.trim() || null,
      assigned_role: assignedRole.trim() || null,
      is_done: false
    });

    setTitle('');
    setShowOptions(false);
  };

  return (
    <div className="bg-[#fffde7] text-neutral-900 rounded-2xl p-3 sm:p-4 shadow-xl border-3 border-yellow-300 relative max-w-2xl mx-auto mb-6">
      {/* 3D Pushpin on top */}
      <div className="pushpin-3d bg-purple-600"></div>

      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <span className="text-amber-800 text-xs font-mono font-bold pl-1 hidden sm:inline">
            📌 PIN NEW:
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Type task title (e.g. 'Complete CS Lab 4 & Supabase CRUD')..."
            className="flex-1 bg-transparent text-xs sm:text-sm font-semibold text-neutral-900 placeholder-neutral-500 outline-none px-1"
          />
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="text-[11px] font-bold px-2 py-1.5 rounded-lg border border-amber-300 hover:bg-amber-200/60 text-amber-900 transition-colors"
            title="Configure priority, due date & group role"
          >
            ⚙️ {showOptions ? 'Hide' : 'Details'}
          </button>
          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs px-3 sm:px-4 py-2 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            📌 Pin Task
          </button>
        </div>

        {/* Detailed Options Drawer */}
        {showOptions && (
          <div className="mt-3 pt-3 border-t border-amber-300/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {/* Priority */}
            <div>
              <label className="block text-[10px] font-bold text-neutral-600 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-lg p-1.5 font-semibold text-xs outline-none"
              >
                <option value="High">🚨 High (Code Red)</option>
                <option value="Medium">⚡ Medium (Mid-term)</option>
                <option value="Low">☕ Low (Chill)</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[10px] font-bold text-neutral-600 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border border-amber-300 rounded-lg p-1.5 font-semibold text-xs outline-none"
              >
                <option value="Academic">📝 Academic</option>
                <option value="Coding">💻 Coding</option>
                <option value="Dorm">🍕 Dorm Life</option>
                <option value="Fun">🎮 Fun & Chill</option>
              </select>
            </div>

            {/* Due Date Shortcut */}
            <div>
              <label className="block text-[10px] font-bold text-neutral-600 mb-1">Due Time</label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g. Tonight 23:59"
                className="w-full bg-white border border-amber-300 rounded-lg p-1.5 font-mono text-xs outline-none"
              />
            </div>

            {/* Group Role */}
            <div>
              <label className="block text-[10px] font-bold text-neutral-600 mb-1">Group Role (Opt)</label>
              <input
                type="text"
                value={assignedRole}
                onChange={(e) => {
                  setAssignedRole(e.target.value);
                  if (e.target.value && !groupName) setGroupName('Group Project');
                }}
                placeholder="e.g. Backend Wizard"
                className="w-full bg-white border border-amber-300 rounded-lg p-1.5 text-xs outline-none"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
