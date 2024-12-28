#!/bin/bash

# Function to check if node_modules exists and install dependencies if necessary
install_dependencies() {
  if [ ! -d "node_modules" ]; then
    echo "Dependencies not found. Installing..."
    npm install
  else
    echo "Dependencies already installed. Skipping..."
  fi
}

# Function to check if nodemon is installed and install it if necessary
check_nodemon() {
  if ! command -v nodemon &> /dev/null
  then
    echo "nodemon not found. Installing nodemon globally..."
    npm install --save-dev nodemon
  else
    echo "nodemon is already installed. Skipping installation..."
  fi
}

# Navigate to the backend directory and install dependencies if needed
echo "Checking dependencies for Express backend..."
cd backend
install_dependencies
check_nodemon
# Use nodemon for automatic restarts during development
npx nodemon app.js &
BACKEND_PID=$!

# Navigate to the frontend directory and install dependencies if needed
echo "Checking dependencies for Next.js frontend..."
cd ../frontend
install_dependencies
npm run dev &
FRONTEND_PID=$!

# Wait for user to press Ctrl+C
echo "Servers are running. Press Ctrl+C to stop both."
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
