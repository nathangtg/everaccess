#!/bin/bash
set -e

echo "Seeding database..."
python seed.py

echo "Starting server..."
exec uvicorn src.main:app --host 0.0.0.0 --port 8000
