@echo off
title Servidor Local - Luméri Perfumes
cd /d "%~dp0"
echo ===================================================
echo     Iniciando Servidor Local - Luméri Perfumes
echo ===================================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
