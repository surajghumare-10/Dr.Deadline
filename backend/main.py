import os
import sqlite3
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "").strip()

# Initialize Supabase client if keys are provided
supabase_client = None
if SUPABASE_URL and SUPABASE_KEY and "your-project" not in SUPABASE_URL:
    try:
        from supabase import create_client, Client
        supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Connected to Supabase Postgres database successfully!")
    except Exception as e:
        print(f"Warning: Failed to initialize Supabase client ({e}). Falling back to local storage.")
        supabase_client = None

# Fallback SQLite DB for local dev before Supabase credentials are inserted
DB_PATH = os.path.join(os.path.dirname(__file__), "tasks_local.db")

def init_sqlite_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            is_done BOOLEAN DEFAULT 0,
            priority TEXT DEFAULT 'Medium',
            due_date TEXT,
            category TEXT DEFAULT 'Academic',
            group_name TEXT,
            assigned_role TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("SELECT COUNT(*) FROM tasks")
    if cursor.fetchone()[0] == 0:
        cursor.execute("""
            INSERT INTO tasks (title, is_done, priority, due_date, category, group_name, assigned_role)
            VALUES 
                ('Complete FastAPI CRUD endpoints & Supabase sync', 0, 'High', 'Today 23:59', 'Coding', 'CS Project', 'Backend Wizard'),
                ('Submit Operating Systems Virtual Memory Lab Report', 0, 'Medium', 'Tomorrow 10:00', 'Academic', 'OS Lab', 'Report Lead'),
                ('Restock instant Maggi noodles & dark roast coffee', 1, 'Low', 'Friday 18:00', 'Dorm', NULL, 'Snack Master')
        """)
    conn.commit()
    conn.close()

init_sqlite_db()

# Models
class TaskCreate(BaseModel):
    title: str
    is_done: Optional[bool] = False
    priority: Optional[str] = "Medium"
    due_date: Optional[str] = None
    category: Optional[str] = "Academic"
    group_name: Optional[str] = None
    assigned_role: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    is_done: Optional[bool] = None
    priority: Optional[str] = None
    due_date: Optional[str] = None
    category: Optional[str] = None
    group_name: Optional[str] = None
    assigned_role: Optional[str] = None

app = FastAPI(
    title="TaskFlow API",
    description="Backend API for TaskFlow Student Dorm Pinboard with Supabase Postgres",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "app": "TaskFlow Dorm Pinboard API",
        "status": "online",
        "supabase_connected": bool(supabase_client),
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "supabase_connected": bool(supabase_client),
        "storage": "supabase_postgres" if supabase_client else "local_sqlite_fallback"
    }

@app.get("/api/tasks")
def get_tasks(
    status: Optional[str] = Query(None, description="all, open, or done"),
    category: Optional[str] = Query(None, description="Academic, Coding, Dorm, Fun"),
    group_name: Optional[str] = Query(None, description="Filter by group name")
):
    if supabase_client:
        try:
            query = supabase_client.table("tasks").select("*")
            if status == "open":
                query = query.eq("is_done", False)
            elif status == "done":
                query = query.eq("is_done", True)
            if category and category.lower() != "all":
                query = query.ilike("category", f"%{category}%")
            if group_name:
                query = query.eq("group_name", group_name)
            
            res = query.order("id", desc=True).execute()
            return res.data
        except Exception as e:
            print(f"Supabase query failed: {e}. Falling back to SQLite.")

    # SQLite fallback
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    sql = "SELECT * FROM tasks WHERE 1=1"
    params = []

    if status == "open":
        sql += " AND is_done = 0"
    elif status == "done":
        sql += " AND is_done = 1"
    if category and category.lower() != "all":
        sql += " AND LOWER(category) = LOWER(?)"
        params.append(category)
    if group_name:
        sql += " AND group_name = ?"
        params.append(group_name)

    sql += " ORDER BY id DESC"
    cursor.execute(sql, params)
    rows = cursor.fetchall()
    tasks = [dict(row) for row in rows]
    # Convert is_done integer to boolean
    for t in tasks:
        t["is_done"] = bool(t["is_done"])
    conn.close()
    return tasks

@app.post("/api/tasks", status_code=201)
def create_task(task: TaskCreate):
    if not task.title or not task.title.strip():
        raise HTTPException(status_code=400, detail="Task title is required")

    payload = {
        "title": task.title.strip(),
        "is_done": bool(task.is_done),
        "priority": task.priority or "Medium",
        "due_date": task.due_date,
        "category": task.category or "Academic",
        "group_name": task.group_name,
        "assigned_role": task.assigned_role,
    }

    if supabase_client:
        try:
            res = supabase_client.table("tasks").insert(payload).execute()
            if res.data:
                return res.data[0]
        except Exception as e:
            print(f"Supabase insert failed: {e}. Falling back to SQLite.")

    # SQLite fallback
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO tasks (title, is_done, priority, due_date, category, group_name, assigned_role)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        payload["title"],
        1 if payload["is_done"] else 0,
        payload["priority"],
        payload["due_date"],
        payload["category"],
        payload["group_name"],
        payload["assigned_role"]
    ))
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()

    payload["id"] = new_id
    return payload

@app.patch("/api/tasks/{task_id}")
def update_task(task_id: int, updates: TaskUpdate):
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided for update")

    if supabase_client:
        try:
            res = supabase_client.table("tasks").update(update_data).eq("id", task_id).execute()
            if res.data:
                return res.data[0]
            raise HTTPException(status_code=404, detail="Task not found")
        except HTTPException:
            raise
        except Exception as e:
            print(f"Supabase update failed: {e}. Falling back to SQLite.")

    # SQLite fallback
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    set_clauses = []
    params = []
    for k, v in update_data.items():
        if k == "is_done":
            set_clauses.append("is_done = ?")
            params.append(1 if v else 0)
        else:
            set_clauses.append(f"{k} = ?")
            params.append(v)
    params.append(task_id)

    query = f"UPDATE tasks SET {', '.join(set_clauses)} WHERE id = ?"
    cursor.execute(query, params)
    conn.commit()

    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")

    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    updated_row = dict(cursor.fetchone())
    updated_row["is_done"] = bool(updated_row["is_done"])
    conn.close()
    return updated_row

@app.delete("/api/tasks/{task_id}")
def delete_task(task_id: int):
    if supabase_client:
        try:
            res = supabase_client.table("tasks").delete().eq("id", task_id).execute()
            return {"message": "Task shredded and deleted", "id": task_id}
        except Exception as e:
            print(f"Supabase delete failed: {e}. Falling back to SQLite.")

    # SQLite fallback
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")
    conn.close()
    return {"message": "Task crumpled and deleted", "id": task_id}
