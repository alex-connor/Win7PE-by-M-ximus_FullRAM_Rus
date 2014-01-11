cls
cd /d "%~dp0"
For %%i in (*.wim) Do call :_Mount "%%~dpnxi"
If exist "%~dp0ShCache.idx_" copy /y "%~dp0ShCache.idx_" "b:\ShCache.idx"
GoTo _3

:_Mount
Set /a Count=0
:_1
if EXIST "b:\%~n1\%~n1" GoTo _3
md "b:\%~n1\%~n1"
imagex.exe /mount "%~1" 1 "b:\%~n1\%~n1"
if %errorlevel% LEQ 0 GoTo _2
Set /a Count+=1
GoTo _1

:_2
echo imagex /unmount "b:\%~n1\%~n1" >>"%Temp%\UnMount.cmd"
Echo rd /s /q "b:\%~n1" >>"%Temp%\UnMount.cmd"
:_3
del /s /f /q "X:\windows\system32\config\systemprofile\Desktop\*(*)*"
echo rd /s /q "X:\Windows\system32\config\systemprofile\AppData\Roaming\Microsoft\Windows\Start Menu\Программы (Ext)" >>"%Temp%\UnMount.cmd"
Echo del /s /q "%Temp%\UnMount.cmd" >>"%Temp%\UnMount.cmd"
GoTo :Eof
