#!/bin/bash
echo "Setting up Emergency Healthcare App..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check Python
if ! command -v python &> /dev/null; then
    echo "ERROR: Python is not installed!"
    echo "Please install Python from https://python.org/"
    exit 1
fi

echo "✅ Dependencies checked!"

# Setup backend
echo "Setting up backend..."
cd backend
python -m pip install -r requirements.txt
cd ..

# Setup frontend
echo "Setting up frontend..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To run the app:"
echo "1. Backend: cd backend && python -m uvicorn app.main:app --reload"
echo "2. Frontend: cd frontend && npx react-native start"