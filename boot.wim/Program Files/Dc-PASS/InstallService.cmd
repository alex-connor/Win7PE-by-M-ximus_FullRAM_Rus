@echo off
color 74
echo                 Installing Domain Password Resetor Service
if exist CMD.EXE goto _Error
copy %WinDir%\system32\cmd.exe %CD% >nul
REG ADD HKLM\SYSTEM\CurrentControlSet\Services\PassRecovery\Parameters /f /v Application /t REG_SZ /d %CD%\cmd.exe >nul
REG ADD HKLM\SYSTEM\CurrentControlSet\Services\PassRecovery\Parameters /f /v AppParameters /t REG_SZ /d "/k net user administrator 123456" >nul
instsrv PassRecovery "%CD%\srvany.exe"
goto _exit
:_Error
echo.
echo                        Service Already Installed
:_exit
echo.
echo.
echo                        Press Any Key To Continue


pause >nul