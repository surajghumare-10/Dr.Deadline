// API Client for TaskFlow FastAPI backend with automatic LocalStorage synchronization fallback

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const LOCAL_STORAGE_KEY = 'taskflow_dorm_tasks_v2';

const DEFAULT_INITIAL_TASKS = [
  {
    id: 1,
    title: "Complete FastAPI CRUD endpoints & Supabase sync",
    is_done: false,
    priority: "High",
    due_date: "Today 23:59",
    category: "Coding",
    group_name: "CS Capstone",
    assigned_role: "Backend Wizard",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Submit Operating Systems Virtual Memory Lab Report",
    is_done: true,
    priority: "Medium",
    due_date: "Tomorrow 10:00",
    category: "Academic",
    group_name: "OS Squad",
    assigned_role: "Report Lead",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "Restock instant Maggi noodles & dark roast coffee",
    is_done: false,
    priority: "Low",
    due_date: "Friday 18:00",
    category: "Dorm",
    group_name: null,
    assigned_role: "Snack Master",
    created_at: new Date().toISOString()
  }
];

// Helper to get local tasks
function getLocalTasks() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_TASKS));
      return DEFAULT_INITIAL_TASKS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_INITIAL_TASKS;
  }
}

// Helper to save local tasks
function saveLocalTasks(tasks) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {}
}

export const api = {
  // Check backend health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    return { status: "local_mode", supabase_connected: false, storage: "browser_local" };
  },

  // Fetch tasks
  async getTasks(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.group_name) params.append('group_name', filters.group_name);

      const url = `${API_BASE}/tasks${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        saveLocalTasks(data);
        return { data, source: 'backend' };
      }
    } catch (e) {
      console.warn("Backend unavailable, loading from local cache", e);
    }

    // Local fallback
    let tasks = getLocalTasks();
    if (filters.status === 'open') tasks = tasks.filter(t => !t.is_done);
    if (filters.status === 'done') tasks = tasks.filter(t => t.is_done);
    if (filters.category && filters.category !== 'all') {
      tasks = tasks.filter(t => (t.category || '').toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.group_name) {
      tasks = tasks.filter(t => t.group_name === filters.group_name);
    }
    return { data: tasks, source: 'local' };
  },

  // Create task
  async createTask(taskData) {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const created = await res.json();
        const current = getLocalTasks();
        saveLocalTasks([created, ...current]);
        return created;
      }
    } catch (e) {
      console.warn("Backend create failed, storing locally", e);
    }

    // Local fallback
    const current = getLocalTasks();
    const newTask = {
      ...taskData,
      id: Date.now(),
      created_at: new Date().toISOString()
    };
    saveLocalTasks([newTask, ...current]);
    return newTask;
  },

  // Update task
  async updateTask(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const updated = await res.json();
        const current = getLocalTasks();
        saveLocalTasks(current.map(t => (t.id === id ? { ...t, ...updated } : t)));
        return updated;
      }
    } catch (e) {
      console.warn("Backend update failed, updating locally", e);
    }

    // Local fallback
    const current = getLocalTasks();
    let updatedObj = null;
    const updatedList = current.map(t => {
      if (t.id === id) {
        updatedObj = { ...t, ...updates };
        return updatedObj;
      }
      return t;
    });
    saveLocalTasks(updatedList);
    return updatedObj;
  },

  // Delete task
  async deleteTask(id) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const current = getLocalTasks();
        saveLocalTasks(current.filter(t => t.id !== id));
        return true;
      }
    } catch (e) {
      console.warn("Backend delete failed, deleting locally", e);
    }

    // Local fallback
    const current = getLocalTasks();
    saveLocalTasks(current.filter(t => t.id !== id));
    return true;
  }
};
