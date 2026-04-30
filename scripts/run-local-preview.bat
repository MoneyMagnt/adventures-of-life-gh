@echo off
setlocal
cd /d "%~dp0.."
node scripts\local-preview-server.js 3001 >> preview-server.log 2>> preview-server.err
