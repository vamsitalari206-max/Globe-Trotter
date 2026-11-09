@echo off
title GLOBETROTTER Launcher
echo ======================================================
echo           GLOBETROTTER - EXPLORE BEYOND BOUNDARIES
echo ======================================================
echo Starting Backend API and Frontend Vite Web Servers...
echo.

cd /d "%~dp0"

start cmd /k "title Globetrotter Backend && cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start cmd /k "title Globetrotter Frontend && cd frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo Opening Globetrotter in your default browser...
start http://localhost:5173/
echo.
echo Application is running!
echo Frontend: http://localhost:5173/
echo Backend:  http://localhost:5000/
echo ======================================================
pause
