rem @echo off
setlocal

start cmd.exe

rem
rem It seems redirections like 2>nul don't work correctly, so avoid them in this script
rem

set SystemDrive=%1
set SystemRoot=%2

if "%SystemDrive%"=="" (
    echo System drive was not specified.
    goto :eof
)

if "%SystemRoot%"=="" (
    echo Windows directory was not specified.
    goto :eof
)

:DoInstall
%SystemRoot%\system32\secinit.exe
%SystemRoot%\system32\cm.exe /install /target:%SystemDrive%\ /bootdrive:%SystemDrive% /mode:online /logging:%SystemRoot%\cmiv2.log /filerepository:%SystemDrive%\build\filerepository


if errorlevel 1 (
echo Error in running cm.exe
echo More error information may be available in 
echo %systemroot%\cmiv2.log file
pause
goto :DoInstall
)

%SystemRoot%\system32\secinit.exe -f

popd
