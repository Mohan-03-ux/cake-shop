@echo off
title BakedWithLove - Cake Shop
color 0A
echo ================================================
echo   BakedWithLove Cake Shop - Starting Server...
echo ================================================
echo.
echo Installing dependencies (first time only)...
pip install flask werkzeug
echo.
echo Starting the application...
echo.
echo Open your browser and go to: http://127.0.0.1:8080
echo Admin Panel: http://127.0.0.1:8080/admin
echo.
echo Press Ctrl+C to stop the server.
echo ================================================
python app.py
pause
