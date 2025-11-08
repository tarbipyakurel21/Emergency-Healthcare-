#!/bin/bash
echo "Setting up Emergency Healthcare System..."

# Create necessary directories
mkdir -p logs
mkdir -p data

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend && npm install && cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..." 
cd responder-web && npm install && cd ..

echo "Setup completed successfully!"
