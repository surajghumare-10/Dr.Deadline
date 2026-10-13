#!/usr/bin/env bash
# Script to start FastAPI backend server

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

if [ -d "venv" ]; then
    source venv/bin/activate
fi

echo "⚡ Starting TaskFlow FastAPI server on http://localhost:8000 ..."
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
