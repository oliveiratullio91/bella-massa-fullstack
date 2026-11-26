@echo off
setlocal
cd /d "%~dp0"
set "PIZZARIA_NODE=node"
where node >nul 2>nul
if errorlevel 1 (
    set "PIZZARIA_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
    if not exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" (
        echo Node.js nao foi encontrado. Consulte as instrucoes do README.md.
        pause
        exit /b 1
    )
)
if not exist "node_modules\vite\bin\vite.js" (
    echo Dependencias ausentes. Execute npm ci nesta pasta antes de iniciar.
    pause
    exit /b 1
)
echo Bella Massa - Gestao da pizzaria
echo Acesse http://127.0.0.1:5173/ e mantenha esta janela aberta.
echo Para encerrar, pressione Ctrl+C.
"%PIZZARIA_NODE%" "node_modules\vite\bin\vite.js" --host 127.0.0.1 --port 5173 --strictPort
pause
