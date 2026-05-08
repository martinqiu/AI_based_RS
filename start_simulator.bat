@echo off
setlocal

cd /d "%~dp0"

echo Starting AI-Based Recommender System Simulator...
echo.
echo Local URL: http://127.0.0.1:8000
echo Press Ctrl+C in this window to stop the simulator.
echo.

start "" "http://127.0.0.1:8000"
python -m http.server 8000 --bind 127.0.0.1

endlocal
