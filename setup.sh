#!/bin/bash

echo "========================================="
echo "🚀 MeetUS Full-Stack Setup"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Setup Backend
echo "📦 Setting up Backend..."
cd server || exit 1

if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file (using defaults)"
fi

npm install
echo "✅ Backend dependencies installed"

cd ..

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd client || exit 1

npm install
echo "✅ Frontend dependencies installed"

cd ..

echo ""
echo "========================================="
echo "✅ Setup Complete!"
echo "========================================="
echo ""
echo "🚀 To start the application:"
echo ""
echo "   Terminal 1 - Backend:"
echo "   cd server && npm run dev"
echo ""
echo "   Terminal 2 - Frontend:"
echo "   cd client && npm run dev"
echo ""
echo "   Then open: http://localhost:5173"
echo ""
echo "========================================="
