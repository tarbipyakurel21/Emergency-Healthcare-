@echo off
echo Setting up Emergency Healthcare System...

:: Create necessary directories
if not exist logs mkdir logs
if not exist data mkdir data

:: Install backend dependencies
echo Installing backend dependencies...
cd backend
npm install
cd ..

:: Install frontend dependencies  
echo Installing frontend dependencies...
cd responder-web
npm install
cd ..

echo Setup completed successfully!
pause
