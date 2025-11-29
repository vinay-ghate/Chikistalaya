@echo off
echo Starting Chikistalaya...
start "Chikistalaya Backend" cmd /k "cd backend && npm run dev"
start "Chikistalaya Frontend" cmd /k "cd chikistalaya-frontend && npm run dev"
echo Application started.
