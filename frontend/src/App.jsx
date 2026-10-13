import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import PinnedTaskCard from './components/PinnedTaskCard';
import AddTaskBar from './components/AddTaskBar';
import MascotPopup from './components/MascotPopup';
import Dustbin from './components/Dustbin';
import StudentStatsBar from './components/StudentStatsBar';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all'); // all, open, done
  const [categoryFilter, setCategoryFilter] = useState('all'); // all, Academic, Coding, Dorm, Fun
  const [groupMode, setGroupMode] = useState(false); // false: solo, true: group
  const [theme, setTheme] = useState('corkboard'); // corkboard, wood, lofi
  const [isDustbinShaking, setIsDustbinShaking] = useState(false);
  const [apiHealth, setApiHealth] = useState({ supabase_connected: false });
  const [loading, setLoading] = useState(true);

  // Load health & initial tasks
  useEffect(() => {
    loadHealth();
    loadTasks();
  }, [statusFilter, categoryFilter]);

  const loadHealth = async () => {
    const health = await api.checkHealth();
    setApiHealth(health);
  };

  const loadTasks = async () => {
    setLoading(true);
    const res = await api.getTasks({
      status: statusFilter,
      category: categoryFilter,
    });
    setTasks(res.data || []);
    setLoading(false);
  };

  const handleAddTask = async (newTaskData) => {
    const created = await api.createTask(newTaskData);
    setTasks(prev => [created, ...prev]);
  };

  const handleToggleDone = async (id, newIsDone) => {
    const updated = await api.updateTask(id, { is_done: newIsDone });
    setTasks(prev => prev.map(t => t.id === id ? { ...t, is_done: newIsDone } : t));
  };

  const handleDeleteTask = async (id) => {
    setIsDustbinShaking(true);
    setTimeout(() => setIsDustbinShaking(false), 600);

    await api.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Filter tasks for group mode if enabled
  const displayedTasks = tasks.filter(t => {
    if (groupMode) return Boolean(t.group_name);
    return true;
  });

  const pendingTasks = tasks.filter(t => !t.is_done);

  // Get background class for the board
  const getThemeClass = () => {
    if (theme === 'wood') return 'bg-dark-wood border-[#4a2e1b]';
    if (theme === 'lofi') return 'bg-lofi-midnight border-indigo-950';
    return 'bg-corkboard border-[#7a481c]';
  };

  return (
    <div className="min-h-screen p-3 sm:p-6 flex flex-col font-sans">
      
      {/* Top Navigation & Student Header */}
      <header className="max-w-6xl w-full mx-auto mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-2xl shadow-lg border border-amber-300">
            📌
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              TASKFLOW <span className="text-amber-400 font-handwritten text-2xl">Dorm Pinboard</span>
            </h1>
            <p className="text-xs text-neutral-400 font-mono">
              CAMPUS ROOM 304 • ROLL #CS-2026
            </p>
          </div>
        </div>

        {/* Status Filters: All, Open, Done (Assignment Requirement) */}
        <div className="flex items-center gap-1.5 bg-neutral-900/90 p-1.5 rounded-2xl border border-neutral-800 text-xs font-bold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === 'all' ? 'bg-amber-500 text-neutral-950 font-black shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setStatusFilter('open')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === 'open' ? 'bg-amber-500 text-neutral-950 font-black shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Pending ({tasks.filter(t => !t.is_done).length})
          </button>
          <button
            onClick={() => setStatusFilter('done')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === 'done' ? 'bg-emerald-500 text-neutral-950 font-black shadow' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Cleared ({tasks.filter(t => t.is_done).length})
          </button>
        </div>
      </header>

      {/* Main Study Deck Area */}
      <main className="max-w-6xl w-full mx-auto flex-1 flex flex-col">
        
        {/* Student Stats & Trophy Bar */}
        <StudentStatsBar 
          tasks={tasks}
          currentTheme={theme}
          onThemeChange={setTheme}
          apiHealth={apiHealth}
        />

        {/* Category Tabs & Mode Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs font-bold">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-neutral-500 text-[10px] font-mono mr-1 hidden sm:inline">CATEGORY:</span>
            {['all', 'Academic', 'Coding', 'Dorm', 'Fun'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl border transition-all ${
                  categoryFilter === cat
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                    : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:bg-neutral-800'
                }`}
              >
                {cat === 'all' ? '📚 All' : cat === 'Academic' ? '📝 Academics' : cat === 'Coding' ? '💻 Coding' : cat === 'Dorm' ? '🍕 Dorm Life' : '🎮 Chill'}
              </button>
            ))}
          </div>

          {/* Group Project Mode Switch */}
          <div className="flex items-center gap-1 bg-neutral-900/80 p-1 rounded-xl border border-neutral-800 text-[11px]">
            <button
              onClick={() => setGroupMode(false)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                !groupMode ? 'bg-amber-400 text-neutral-950 shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              👤 Solo Desk
            </button>
            <button
              onClick={() => setGroupMode(true)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                groupMode ? 'bg-indigo-600 text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              👥 Group Squad (Roles)
            </button>
          </div>
        </div>

        {/* Add Task Input Bar */}
        <AddTaskBar onAddTask={handleAddTask} />

        {/* THE BULLETIN CORKBOARD */}
        <div className={`rounded-3xl p-5 sm:p-8 border-4 shadow-2xl relative flex-1 min-h-[480px] transition-all duration-300 ${getThemeClass()}`}>
          
          {/* Wooden Board Header Label */}
          <div className="flex items-center justify-between pb-3 border-b border-black/20 mb-6">
            <div className="bg-[#fff9c4] text-neutral-950 px-3.5 py-1 rounded-md shadow-md border border-yellow-300 font-handwritten text-base font-bold transform -rotate-1 flex items-center gap-2">
              <span>📌 {groupMode ? 'GROUP COLLABORATION BOARD' : 'MID-TERM SURVIVAL PINBOARD'}</span>
              <span className="text-[10px] font-mono bg-rose-600 text-white px-1.5 py-0.2 rounded font-sans">
                {pendingTasks.length} PENDING
              </span>
            </div>

            <div className="text-[11px] font-mono font-bold text-neutral-900/80 bg-white/40 backdrop-blur px-2.5 py-1 rounded-lg border border-black/10">
              💡 Tip: Click "Tear Done" to rip, or "🗑️" to crumple into dustbin!
            </div>
          </div>

          {/* Empty State */}
          {displayedTasks.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur mx-auto flex items-center justify-center text-3xl shadow-inner mb-3">
                📭
              </div>
              <h3 className="text-base font-bold text-neutral-900">Your pinboard is completely clear!</h3>
              <p className="text-xs text-neutral-800 mt-1 font-medium">
                Pin a new study task or homework assignment above.
              </p>
            </div>
          )}

          {/* Grid of Pinned Tasks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedTasks.map((task, index) => (
              <PinnedTaskCard
                key={task.id}
                task={task}
                index={index}
                onToggleDone={handleToggleDone}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>

        </div>

      </main>

      {/* Floating Interactive Elements */}
      <MascotPopup 
        pendingTasks={pendingTasks} 
        onCompleteTask={(id) => handleToggleDone(id, true)} 
      />

      <Dustbin isShaking={isDustbinShaking} />

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto mt-6 pt-3 border-t border-neutral-800 text-center text-xs text-neutral-500 font-mono">
        TaskFlow Full-Stack Assignment • Built with React, Vite, FastAPI & Supabase Postgres
      </footer>

    </div>
  );
}
