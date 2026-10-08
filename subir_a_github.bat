@echo off
REM Doble clic para subir ObraGest a GitHub
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0subir_a_github.ps1" %*
pause
