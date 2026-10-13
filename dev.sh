#!/usr/bin/env bash
# ==========================================================
# TaskFlow: Single command to run both Backend & Frontend
# ==========================================================

export PATH="/opt/homebrew/bin:$PATH"

echo "⚡ Starting TaskFlow FastAPI Backend on http://localhost:8000..."
source backend/venv/bin/activate
python3 -m uvicorn backend.main:app --reload --port 8000 &
BACKEND_PID=$!

echo "⚡ Starting TaskFlow React Vite Frontend on http://localhost:5173..."
cd frontend
npm run dev &
FRONTEND_PID=$!

cleanup() {
    echo ""
    echo "🛑 Shutting down TaskFlow servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

wait
