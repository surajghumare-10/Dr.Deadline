# 📌 TaskFlow — Dorm Study Pinboard Edition

> A tactile, student-focused task manager built with **React (Vite)**, **Python (FastAPI)**, and **Supabase (PostgreSQL)**.

---

## 🌟 What Makes TaskFlow Truly Unique?

Unlike standard, generic AI-generated task lists, **TaskFlow** is designed around the tactile reality of **student dorm life, exam crunch, and campus deadlines**:

- 📌 **Dorm Study Pinboard**: Tasks are rendered as realistic study index cards pinned to a bulletin corkboard with 3D colorful pushpins.
- ✂️ **Torn Paper Completion**: Marking a task as done triggers a realistic **paper-ripping sound and jagged torn-edge stamp** (`[ TORN & CLEARED ✂️ ]`).
- 🗑️ **Crumple & Dustbin Deletion**: Deleting a task animates the note **crumpling into a 3D paper ball, flying across the desk, and slamming into the corner dustbin** with sound and dustbin bounce physics!
- 🦉 **Dr. Deadline (The Unhinged Mascot)**: An animated campus proctor character pops up from the screen carrying urgent reminder dockets with hilarious student punishments *(e.g. "Finish this in 2 hours or I will secretly eat all your midnight Maggi noodles and enroll you in 8:00 AM Sunday Calculus! 🍜")*.
- ⏳ **Remaining Time Countdown Clock**: Real-time remaining deadline counter (e.g. `⏳ 02h 45m left`) with pulsing urgency indicators for High priority tasks.
- 👥 **Group Project Squad & Roles**: Assign team roles to tasks (*Backend Wizard*, *UI Architect*, *Report Lead*, *Snack Master*) and toggle between Solo and Group boards.
- 🏷️ **Category Separation**: Filter tasks by **📝 Academics**, **💻 Coding**, **🍕 Dorm Life**, and **🎮 Chill**.
- 🏆 **Gamified Student Badges**: Unlock trophies like **☕ Caffeine Overlord**, **⚡ All-Nighter Survivor**, and **💯 Dean's List**.
- 🪵 **Desk Theme Switcher**: Toggle between **Classic Corkboard 📌**, **Dark Walnut Desk 🪵**, and **Lofi Midnight Study Desk 🌙**.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Canvas Confetti, Web Audio API Synthesizers.
- **Backend**: Python 3.9+, FastAPI, Uvicorn, Pydantic, Python-dotenv.
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS) policies.
- **Local Fallback**: Automatic SQLite and LocalStorage fallback so the app works seamlessly even before database credentials are inserted.

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js** (v18+) and **npm**
- **Python** (v3.9+) and **pip**

---

### 2. Backend Setup (FastAPI & Supabase)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure Environment Variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and insert your Supabase project keys:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-supabase-anon-or-service-role-key
   PORT=8000
   ```

5. Setup the Database Table (Supabase):
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard) -> **SQL Editor**.
   - Copy and paste the contents of `backend/schema.sql` and click **Run**.

6. Start the FastAPI backend server:
   ```bash
   ./start.sh
   # Or manually:
   python3 -m uvicorn main:app --reload --port 8000
   ```
   *FastAPI documentation will be live at: [http://localhost:8000/docs](http://localhost:8000/docs)*

---

### 3. Frontend Setup (React + Vite)

1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your web browser!

---

### ⚡ Run Both Simultaneously (One Command)

From the project root directory, simply run:
```bash
./dev.sh
```
This automatically boots both the FastAPI backend on port 8000 and the React Vite frontend on port 5173!

---

## 🔒 Environment Variables Reference

| Variable | Description | Required | Example |
|---|---|---|---|
| `SUPABASE_URL` | Your Supabase Project URL | Yes (for Postgres persistence) | `https://xyzcompany.supabase.co` |
| `SUPABASE_KEY` | Supabase Anon / Service Role API Key | Yes (for Postgres persistence) | `eyJhbGciOiJIUzI1NiIsIn...` |
| `PORT` | FastAPI server port | Optional (Default: 8000) | `8000` |
| `VITE_API_URL` | Custom backend URL for Vite frontend | Optional (Default: `http://localhost:8000/api`) | `http://localhost:8000/api` |

> [!IMPORTANT]
> Never commit `.env` to git! The `.gitignore` file is pre-configured to keep your credentials safe.

---

## 📡 API Endpoints

- `GET /api/tasks` — List tasks (optional query filters: `status`, `category`, `group_name`)
- `POST /api/tasks` — Create new task (`title`, `priority`, `due_date`, `category`, `group_name`, `assigned_role`)
- `PATCH /api/tasks/{task_id}` — Update task (e.g. toggle `is_done`)
- `DELETE /api/tasks/{task_id}` — Delete task
- `GET /api/health` — Check server status & Supabase database connectivity

---

## 📁 Repository Structure

```
.
├── backend/
│   ├── main.py              # FastAPI app with Supabase CRUD endpoints
│   ├── requirements.txt     # Python dependencies
│   ├── schema.sql           # Supabase PostgreSQL table & RLS script
│   ├── start.sh             # Backend startup script
│   ├── .env.example         # Environment variables template
│   └── tasks_local.db       # Local SQLite fallback
├── frontend/
│   ├── src/
│   │   ├── components/      # Pinboard, PinnedTaskCard, MascotPopup, Dustbin, etc.
│   │   ├── services/api.js  # API client with auto-sync LocalStorage fallback
│   │   ├── utils/           # Web Audio API synthesizers (rip, crumple, alarm)
│   │   ├── App.jsx          # Main Pinboard layout & state management
│   │   └── index.css        # Corkboard & Wood textures, 3D pushpins
│   ├── package.json
│   └── vite.config.js
├── dev.sh                   # Concurrent dev startup script
├── .gitignore               # Strict gitignore protecting .env and dependencies
└── README.md
```
