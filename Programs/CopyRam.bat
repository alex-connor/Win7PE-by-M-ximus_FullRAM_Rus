@echo off
Color 1e
Cls
Echo Copying files ... 
md "b:\$Wim$"
copy /y "%~dp0*.wim" "b:\$Wim$"
if not %ErrorLevel%==0 Goto _Err
sh.exe pause
Cls
Echo UnMount wim files ...
Call "%Temp%\UnMount.cmd"|find "[" 
Del "%Temp%\UnMount.cmd"
Echo. 2>"%Temp%\UnMountB.cmd"
cd /d "b:\$Wim$"
Cls
Echo Mounting wim files ... 
For %%i in (*.wim) Do call :_Mount "%%~dpnxi"
Echo rd /s /q "b:\$Wim$">>"%Temp%\UnMountB.cmd"
sh.exe start
GoTo :Eof

:_Mount
md "b:\%~n1"
imagex.exe /mount "%~1" 1 "b:\%~n1\%~n1"|find /i "b:\" 
Echo imagex /unmount "b:\%~n1\%~n1">>"%Temp%\UnMountB.cmd"
Echo rd /s /q "b:\%~n1">>"%Temp%\UnMountB.cmd"
GoTo :Eof

:_Err
rd /s /q "b:\$Wim$"
Color 4f
Echo Copying error !
pause>nul
