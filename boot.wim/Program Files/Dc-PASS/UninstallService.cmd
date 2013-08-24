@echo off
color 74
if exist %CD%\cmd.exe goto _Remove
InstallService.cmd
exit
:_Remove
DEL %CD%\CMD.EXE
instsrv PassRecovery REMOVE
echo.
echo                        Press Any Key To Continue
pause >nul