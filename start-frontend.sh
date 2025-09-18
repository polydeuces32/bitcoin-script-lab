#!/bin/bash

# Bitcoin Script Learning Lab - Frontend Startup Script

echo "🚀 Starting Bitcoin Script Learning Lab Frontend..."
echo ""

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    echo "Please install Node.js first: https://nodejs.org/"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "frontend/server.js" ]; then
    echo "❌ Please run this script from the btc-script-lab root directory"
    exit 1
fi

# Start the frontend server
echo "📁 Starting frontend server..."
cd frontend

# Check if package.json exists, if not create it
if [ ! -f "package.json" ]; then
    echo "📦 Creating package.json..."
    cat > package.json << EOF
{
  "name": "bitcoin-script-lab-frontend",
  "version": "1.0.0",
  "description": "Frontend for Bitcoin Script Learning Lab",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "keywords": ["bitcoin", "script", "frontend", "learning", "education"],
  "author": "Bitcoin Script Lab",
  "license": "MIT",
  "engines": {
    "node": ">=14.0.0"
  }
}
EOF
fi

echo "🌐 Frontend server starting..."
echo "📚 Open your browser to: http://localhost:3000"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

# Start the server
node server.js
