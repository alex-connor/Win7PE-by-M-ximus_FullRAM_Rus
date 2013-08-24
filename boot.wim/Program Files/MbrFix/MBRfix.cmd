@echo off

::< MBRfix.CMD - GUI INTERFACE TO MBRfix.EXE - by Jacopo Lazzari
::<
::< MBRfix.EXE Copyright 
::< Master Boot Record tool for Windows NT platform
::< Copyright (C) 2007 Systemintegrasjon AS
::<
::< This script makes use of the functions of
::< The Wizard's Apprentice http://wizapp.sourceforge.net/
::< The Wizard's Apprentice may be freely distributed.
::<
::< This script by Jacopo Lazzari (jaclaz@graffiti.net)
::< Note: only mail with word "MBRfix" in the subject will be taken care of 
::x
::x Modified by Jon Fleming to include the Vista option
::<
::< CAREWARE LICENSE
::< This script is released as "CAREWARE", it may be freely distributed, used,
::< modified and whatever, provided that the user, at least once per use,
::< performs ANY of the following
::< 1 - Smiles at somebody/something
::< 2 - Hugs or pats on the shoulder a friend/colleague/pet/furry little
::<     creature from Alpha Centauri
::< 3 - Acts nicely towards a friend/foreigner/alien/any other living being
::< 4 - Kisses his/her girlfriend/wife/boyfriend/husband/any other living being
::<     (de gustibus...)
::< 5 - Feels happy even without apparent reason
::< 6 - Stops whining for an hour, a day, a week, your choice
:: < Important Note: if you don't like this idea, just ignore it 
:: <-- you can have this anyway.
:: < That's one way to distinguish the world of ideas from the rest
:: < of human history: 
:: < you can disregard an idea ...
:: < ...and no one knocks on your door at midnight.
:: < (Unless it's your neighbour in need of a cup of sugar),
:: <  in which case you MAY act NON-nicely
::  < STANDARD DISCLAIMER
::  <
::  < Though every reasonable effort has been made in testing this script, the
::  < Author accepts no liability whatsoever. This script may or may not do 
::  < whatever it is supposed to do, it could even possibly completely destroy
::  < your software, hardware and set your house/office to fire.
::  < No warranty implied, not even that of fitness for any particular purpose
::  < apart taking up a little bit of your hard disk space.
::  <
::  < This script is distributed as "MBRfix.TXT" by renaming it to "MBRfix.CMD",
::  < YOU make it an executable script, thus accepting all of the above.

IF NOT "%1."=="/?." goto :1stcheck

:help
CLS
MORE MBRfix.cmd | Find /V "MORE MBRfix.cmd"| Find "::<" 
PAUSE
CLS
MORE MBRfix.cmd | Find /V "MORE MBRfix.cmd"| Find ":: <" 
PAUSE
CLS
MORE MBRfix.cmd | Find /V "MORE MBRfix.cmd"| Find "::  <" 
PAUSE
goto :exit

:1stcheck

IF %1.==/?. call :help
set NEEDFILES=
if NOT exist Wizapp.exe SET NEEDFILES=Wizapp.exe; 
if NOT exist MBRfix.exe SET NEEDFILES=%NEEDFILES%MBRfix.exe; 
if NOT exist MBRfix.htm SET NEEDFILES=%NEEDFILES%MBRfix.htm; 
if NOT exist EULA.TXT SET NEEDFILES=%NEEDFILES%EULA.TXT;
if NOT defined NEEDFILES GOTO :Letsstart
CLS
::|
::| For this script to run properly, you will need in the same directory
::| of this batch script, the following files:
::|
::| Wizapp.exe:- Wizard's Apprentice v 1.3 or better
::| 
::| http://wizapp.sourceforge.net/
::|
::| MBRfix.bmp (optional) a bitmap to replace Wizapp.exe internal one
::|
::| MBRfix.exe and MBRfix.htm:- Master Boot Record tool
::|
::| http://www.sysint.no/Nedlasting/MbrFix.htm
::| http://www.sysint.no/Nedlasting/MbrFix.zip
::|
::| EULA.TXT (the License Agreement)
::| 
::| The running Operating System must be Windows 2000, XP or 2003
::| This script by Jacopo Lazzari (jaclaz@graffiti.net)
::| Note: only mail with "MBRfix" in the subject will be taken care of
::|
MORE MBRfix.cmd | Find /V "MORE MBRfix.cmd"| Find "::|"
ECHO WARNING AT LEAST ONE NEEDED FILE IS MISSING!
ECHO.
ECHO MISSING FILE(S):
ECHO %NEEDFILES%
Pause
Set NEEDFILES=
goto :EOF


:Letsstart
:: Increase the environment size to make sure
:: all variables fit.
if not "%1"=="EnvSizeIncreased" %COMSPEC% /e:8192 /c %0 EnvSizeIncreased %1 %2 %3 %4 %5 %6 %7 %8 %9
if not "%1"=="EnvSizeIncreased" goto :end
if "%1"=="EnvSizeIncreased" shift
if exist MBRFIX.BMP set wabmp=MBRFIX.BMP
set wabat=%TEMP%\wabat.bat
:: remove any leftovers (just in case)
set waprefix=
set waeol=
set wainput=
set wafile=
set walistsep=
set walabels=
set wasig=
set wasound=
set waico=
set waoutput=
set waoutnum=
:: Initialise the "my" variables this wizard needs.
set mytitle=MBRfix Tool Manager v.0.2 Beta          
:: To look pretty, there must be     ^ seventeenchars ^ between the ^^'s
set mytext=MBRfix Tool Manager for Windows NT Platform
set mytext=%mytext%~Copyright (c) 2007 Systemintegrasjon AS
set mytext=%mytext%~Freeware, delivered AS-IS / Careware (GUI)
set mysig=by jaclaz
set myout=%TEMP%\myout.$$$
set mytemp1=%TEMP%\mytemp0.$$$



:: Start the wizard.



:p
:: We set the page variable to be able to return here
:: after a Cancel request.
set page=:p
set watitle=%mytitle%
set watext=%mytext%~~Please choose drive number which you want to use 
set watext=%watext%~MBRfix on (first drive is number 0)
set watext=%watext%~Make your selection and press the [Next] button
set watext=%watext%~(you can use numerical keypad)
set wafile=
set walistsep=;
set wainput=^&0. Drive 0 (Boot Drive);^&1. Drive 1;^&2. Drive 2;^&3. Drive 3;^&4.View License
set waoutnum=
set waoutput=
set wasig=%mysig%
start /w wizapp NOBACK RB

if errorlevel 2 goto :cancel
:: no Back possible

call %wabat%
set drivenum=%waoutnum%
If NOT DEFINED waoutnum goto :license
If %drivenum%.==4. goto :license

MBRfix.exe /drive %drivenum% readstate > %myout%
SET BYTE=
FOR /F "tokens=*" %%A IN (%myout%) DO SET BYTE=%%A
IF "%BYTE%." == "." GOTO :ERROR2

:p0
set page=:p0
set FROMPAGE=:p
set watitle=%mytitle% Chosen Disk is Drive %drivenum%
set watext=%mytext%~~Please choose action you wish to perform:
set waoutput=
set wafile=
set walistsep=;
set waoutnum=
set wainput=^&0. Display drive information;^&1. Save MBR and partitions to file;^&2. Restore MBR and partitions from file;^&3. Update MBR code to W2K/XP/2003;^&4. Update MBR code to Vista;^&5. Update MBR code to Windows 7;^&6. Delete partitions in MBR;^&7. Read disk signature from MBR;^&8. Write disk signature in MBR;^&9. Generate disk signature in MBR;^&10. Read state from byte 0x1b0 in MBR;^&11. Write state to byte 0x1b0 in MBR
set wasig=%mysig% %page%
start /w wizapp RB
if errorlevel 2 goto :cancel
if errorlevel 1 goto :p
call %wabat%
:: and store it

If NOT DEFINED waoutnum goto :p0

goto %page%.%waoutnum%


:p0.0
set page=:p0.0
set watitle=%mytitle% Drive Info
set watext=%mytext%~~This is the current info on drive %drivenum%
set watext=%watext%~
set NEXTCOMMAND=MBRfix.exe /drive %drivenum% drivesize
%NEXTCOMMAND% > %myout%
set NEXTCOMMAND=MBRfix.exe /drive %drivenum% driveinfo
%NEXTCOMMAND% | FIND /V "Drive" >> %myout%
set NEXTCOMMAND=MBRfix.exe /drive %drivenum% listpartitions
%NEXTCOMMAND% >> %myout%
:: wafile contains the output of the command.
set wafile=%myout%
set wasig=%mysig% %page%
start /w wizapp FINISH FT
if errorlevel 2 goto :cancel
if errorlevel 1 goto :p0
goto :exit


:p0.1
set page=:p0.1
set watitle=%mytitle% Choose a Directory
set watext=%mytext%~~Please choose a Directory where you want to save the MBR from Drive %Drivenum%
set waoutput=
set wafile=
set walistsep=,
set waoutnum=
set wainput=
set wasig=%mysig% %page%
start /w wizapp FB DIR
if errorlevel 2 goto :cancel
if errorlevel 1 goto :p0
call %wabat%
:: and store it
If NOT DEFINED waoutput goto :p0.1
set MBRFILE=%waoutput%

:p0.1.1
set page=:p0.1.1
set watitle=%mytitle% Type a File name
set watext=%mytext%~~Please type a File name where you want to save the MBR from Drive %Drivenum%
set watext=%watext%~in directory %MBRFILE%
set waoutput=
set wafile=
set walistsep=,
set waoutnum=
set wainput=
set wasig=%mysig% %page%
start /w wizapp EB
if errorlevel 2 goto :cancel
if errorlevel 1 goto :p0
call %wabat%
:: and store it
If NOT DEFINED waoutput goto :p0.1.1

set MBRFILE=%MBRFILE%\%waoutput%
if NOT EXIST %MBRFILE% goto :p0.1.2

set watitle=Overwrite warning!
set watext=File %MBRFILE% already exists!
set watext=%watext%~Do you really want to overwrite it?
start /w wizapp MB QUES
if errorlevel 2 goto :p0.2


:p0.1.2
set page=:p0.1.2
set NEXTCOMMAND=MBRfix.exe /drive %drivenum% savembr %MBRFILE%
call :confirm
set watitle=%mytitle% Save MBR and partitions to file
set watext=%mytext%~~MBR and Partitions on drive %drivenum%
set watext=%watext%~Have been saved to file %MBRFILE%
set watext=%watext%~Errors (if any) are shown below:
%NEXTCOMMAND% > %myout%
:: wafile contains the output of the command.
set wafile=%myout%
set wasig=%mysig% %page%
start /w wizapp FINISH FT
if errorlevel 2 goto :cancel
if errorlevel 1 goto :p0
goto :exit

:p0.2
set page=:p0.2
set watitle=%mytitle% Choose a MBR Image file
set watext=%mytext%~~Please choose a MBR Image you want to restore:
set waoutput=
set wafile=
set walistsep=,
set waoutnum=
set wainput=MBRfix Saved MBR (*.mbr),*.mbr, All Files (*.*),*.*
set wasig=%mysig% %page%
start /w wizapp FB FILE
if errorlevel 2 goto :cancel
if errorlevel 1 goto :p0
call %wabat%
:: and store it
If NOT DEFINED waoutput goto :p0.2

:p0.2.0
set MBRFILE="%waoutput%"
set watitle=%mytitle% Confirm
set watext=WARNING, by clicking OK, you will
set watext=%watext% replace MBR on drive %drivenum% with
set watext=%watext% the one in file %MBRFILE%
start /w wizapp MB QUES
if errorlevel 2 goto :p0

:p0.2.1
set page=:p0.2.1
set NEXTCOMMAND=MBRfix.exe /drive %drivenum% restorembr %MBRFILE%
call :confirm
set watitle=%mytitle% Restore MBR and partitions from file
set watext=%mytext%~~MBR and Partitions from file %MBRFILE%
set watext=%watext%~Have been saved on drive %drivenum%
set watext=%watext%~Errors (if any) are shown below:
echo Y | %NEXTCOMMAND% > %myout%
if NOT errorlevel 2 ECHO Y >> %myout%
ECHO Current Partition Table is: >> %myout%
MBRfix.exe /drive %drivenum% listpartitions >> %myout%
:: wafile contains the output of the command.
set wafile=%myout%
set wasig=%mysig% %page%
start /w wizapp FINISH FT
if errorlevel 2 goto :cancel
if errorlevel 1 goto :p0
goto :exit

:p0.3
set MBRFILE="%waoutput%"
set watitle=%mytitle% Confirm
set watext=WARNING, by clicking OK, you will
set watext=%watext% Update MBR code on drive %drivenum% with
set watext=%watext% the W2K/XP/2003 one
start /w wizapp MB QUES
if errorlevel 2 goto :p0



:p0.3.0
set page=:p0.3
set NEXTCOMMAND=MBRfix.exe /drive %drivenum% fixmbr
call :confirm
set watitle=%mytitle% Update MBR code to W2K/XP/2003
set watext=%mytext%~~W2K/XP/2003 MBR Code
set watext=%watext%~Has been saved on drive %drivenum%
set watext=%watext%~Errors (if any) are shown below:
echo Y | %NEXTCOMMAND% > %myout%
if NOT errorlevel 2 ECHO Y >> %myout%
:: wafile contains the output of the command.
set wafile=%myout%
set wasig=%mysig% %page%
start /w wizapp FINISH FT
if errorlevel 2 goto :cancel
if errorlevel 1 goto :p0
goto :exit

:p0.4
set MBRFILE="%waoutput%"
set watitle=%mytitle% Confirm
set watext=WARNING, by clicking OK, you will
set watext=%watext% Update MBR code on drive %drivenum% with
set watext=%watext% the Vista one
start /w wizapp MB QUES
if errorlevel 2 goto :p0

:p0.4.0
set page=:p0.4
set NEXTCOMMAND=MBRfix.exe /drive %drivenum% fixmbr /vista
call :confirm
set watitle=%mytitle% Update MBR code to Vista
set watext=%mytext%~~Vista MBR Code
set watext=%watext%~Has been saved on drive %drivenum%
set watext=%watext%~Errors (if any) are shown below:
echo Y | %NEXTCOMMAND% > %myout%
if NOT errorlevel 2 ECHO Y >> %myout%
:: wafile contains the output of the command.
set wafile=%myout%
set wasig=%mysig% %page%
start /w wizapp FINISH FT
if errorlevel 2 goto :cancel
if errorlevel 1 goto :p0
goto :exit

:p0.5
set MBRFILE="%waoutput%"
set watitle=%mytitle% Confirm
set watext=WARNING, by clicking OK, you will
set watext=%watext% Update MBR code on drive %drivenum% with
set watext=%watext% the Windows 7 one
start /w wizapp MB QUES
if errorlevel 2 goto :p0

:p0.5.0
set page=:p0.5
set NEXTCOMMAND=MBRfix.exe /drive %drivenum% fixmbr /win7
call :confirm
set watitle=%mytitle% Update MBR code to Windows 7
set watext=%mytext%~~Windows 7 MBR Code
set watext=%watext%~Has been saved on drive %drivenum%
set watext=%watext%~Errors (if any) are shown below:
echo Y | %NEXTCOMMAND% > %myout%
if NOT errorlevel 2 ECHO Y >> %myout%
:: wafile contains the output of the command.
set wafile=%myout%
set wasig=%mysig% %page%
start /w wizapp FINISH FT
if errorlevel 2 goto :cancel
if errorlevel 1 goto :p0
goto :exit

:p0.6
set page=:p0.6
set NEXTCOMMAND=MBRfix.exe /drive %drivenum% clean
call :confirm
set watitle=%mytitle% Delete partitions in MBR
set watext=%mytext%~~Partitions on drive %drivenum%
set watext=%watext%~Have been deleted.
set watext=%watext%~Errors (if any) are shown below:
echo Y | %NEXTCOMMAND% > %myout%
if NOT errorlevel 2 ECHO Y >> %myout%
ECHO Current Partition Table is: >> %myout%
MBRfix.exe /drive %drivenum% listpartitions >> %myout%
:: wafile contains the output of the command.
set wafile=%myout%
set wasig=%mysig% %page%
start /w wizapp FINISH FT
if errorlevel 2 goto :cancel
if errorlevel 1 goto :p0
goto :exit

:p0.7
set page=:p0.7
set NEXTCOMMAND=MBRfix.exe /drive %drivenum% readsignature
set watitle=%mytitle% Drive Signature Info
set watext=%mytext%~~This is the current Signature info on drive %drivenum%
set watext=%watext%~
%NEXTCOMMAND% > %myout%
:: wafile contains the output of the command.
set wafile=%myout%
set wasig=%mysig% %page%
start /w wizapp FINISH FT
if errorlevel 2 goto :cancel
if errorlevel 1 goto :p0
goto :exit

:p0.8
set page=:p0.8
MBRfix.exe /drive %drivenum% readsignature > %mytemp1%
FOR /F "tokens=*" %%A IN (%mytemp1%) DO SET BYTE=%%A
set watitle=%mytitle% Type a Signature value
set watext=%mytext%~~Please type a Signature value you want to save 
set watext=%watext%~to the MBR on Drive %drivenum%
set watext=%watext%~Current signature value is %BYTE%
set waoutput=
set wafile=
set walistsep=,
set waoutnum=
set wainput=
set wasig=%mysig% %page%
start /w wizapp EB
if errorlevel 2 goto :cancel
if errorlevel 1 goto :p0
call %wabat%
:: and store it
If NOT DEFINED waoutput goto :p0.8

set watitle=Overwrite warning!
set watext=Signature value is currently %BYTE%!
set watext=%watext%~Do you really want to overwrite it
set watext=%watext%~with value %waoutput%?
start /w wizapp MB QUES
if errorlevel 2 goto :p0.2


:p0.8.0
set page=:p0.8.0
set NEXTCOMMAND=MBRfix.exe /drive %drivenum% writesignature %waoutput%
call :confirm
set watitle=%mytitle% Write Signature
set watext=%mytext%~~Signature on Drive %drivenum%
set watext=%watext%~Have been set to value %waoutput%
set watext=%watext%~Errors (if any) are shown below:
Echo Old Signature value was > %myout%
TYPE %mytemp1% >> %myout%
echo Y | %NEXTCOMMAND% >> %myout%
if NOT errorlevel 2 ECHO Y >> %myout%
MBRfix.exe /drive %drivenum% readsignature > %mytemp1%
FOR /F "tokens=*" %%A IN (%mytemp1%) DO SET BYTE=%%A
ECHO Current Signature value is %BYTE% >> %myout%
:: wafile contains the output of the command.
set wafile=%myout%
set wasig=%mysig% %page%
start /w wizapp FINISH FT
if errorlevel 2 goto :cancel
if errorlevel 1 goto :p0
goto :exit

:p0.9
MBRfix.exe /drive %drivenum% readsignature > %mytemp1%
FOR /F "tokens=*" %%A IN (%mytemp1%) DO SET BYTE=%%A
set watitle=%mytitle% Confirm
set watext=WARNING, by clicking OK, you will
set watext=%watext%~Generate Signature on drive %drivenum%
set watext=%watext%~Current Signature is %BYTE%
start /w wizapp MB QUES
if errorlevel 2 goto :p0

:p0.9.0
set page=:p0.9.0
set NEXTCOMMAND=MBRfix.exe /drive %drivenum% generatesignature
call :confirm
set watitle=%mytitle% Generate disk signature in MBR
set watext=%mytext%~~Signature on drive %drivenum%
set watext=%watext%~Has been generated
set watext=%watext%~Errors (if any) are shown below:
Echo Old Signature was > %myout%
TYPE %mytemp1% >> %myout%
echo Y | %NEXTCOMMAND% >> %myout%
if NOT errorlevel 2 ECHO Y >> %myout%
MBRfix.exe /drive %drivenum% readsignature > %mytemp1%
FOR /F "tokens=*" %%A IN (%mytemp1%) DO SET BYTE=%%A
ECHO Current Signature is %BYTE% >> %myout%
:: wafile contains the output of the command.
set wafile=%myout%
set wasig=%mysig% %page%
start /w wizapp FINISH FT
if errorlevel 2 goto :cancel
if errorlevel 1 goto :p0
goto :exit

:p0.10
set page=:p0.10
set NEXTCOMMAND=MBRfix.exe /drive %drivenum% readstate
set watitle=%mytitle% State from byte 0x1b0
set watext=%mytext%~~This is the current State of byte 0x1b0 on drive %drivenum%
set watext=%watext%~
%NEXTCOMMAND% > %myout%
:: wafile contains the output of the command.
set wafile=%myout%
set wasig=%mysig% %page%
start /w wizapp FINISH FT
if errorlevel 2 goto :cancel
if errorlevel 1 goto :p0
goto :exit

:p0.11
set page=:p0.11
MBRfix.exe /drive %drivenum% readstate > %mytemp1%
FOR /F "tokens=*" %%A IN (%mytemp1%) DO SET BYTE=%%A
set watitle=%mytitle% Type a State Byte value
set watext=%mytext%~~Please type a Byte value you want to save 
set watext=%watext%~to the MBR in location 0x1b0 on Drive %drivenum%
set watext=%watext%~Current Byte value is %BYTE%
set waoutput=
set wafile=
set walistsep=,
set waoutnum=
set wainput=
set wasig=%mysig% %page%
start /w wizapp EB
if errorlevel 2 goto :cancel
if errorlevel 1 goto :p0
call %wabat%
:: and store it
If NOT DEFINED waoutput goto :p0.11

set watitle=Overwrite warning!
set watext=State byte value is currently %BYTE%!
set watext=%watext%~Do you really want to overwrite it
set watext=%watext%~with value %waoutput%?
start /w wizapp MB QUES
if errorlevel 2 goto :p0.2


:p0.11.0
set page=:p0.11.0
set NEXTCOMMAND=MBRfix.exe /drive %drivenum% writestate %waoutput%
call :confirm
set watitle=%mytitle% Set State byte at address 0x1b0
set watext=%mytext%~~State byte at address 0x1b0 on Drive %drivenum%
set watext=%watext%~Have been set to value %waoutput%
set watext=%watext%~Errors (if any) are shown below:
Echo Old Set Byte value was > %myout%
TYPE %mytemp1% >> %myout%
echo Y | %NEXTCOMMAND% >> %myout%
if NOT errorlevel 2 ECHO Y >> %myout%
MBRfix.exe /drive %drivenum% readstate > %mytemp1%
FOR /F "tokens=*" %%A IN (%mytemp1%) DO SET BYTE=%%A
ECHO Current Set Byte value is %BYTE% >> %myout%
:: wafile contains the output of the command.
set wafile=%myout%
set wasig=%mysig% %page%
start /w wizapp FINISH FT
if errorlevel 2 goto :cancel
if errorlevel 1 goto :p0
goto :exit

:confirm
set watitle=Confirm action
set watext=You are about to send this 
set watext=%watext%~(potentially destructive) command:
set watext=%watext%~%NEXTCOMMAND%
set watext=%watext%~Are you sure?
start /w wizapp MB QUES
if errorlevel 2 goto :p0
GOTO :EOF


:error
set watitle=Error occurred!
set watext=Program cannot access drive %drivenum%!
set watext=%watext%~Last issued command is:
set watext=%watext%~%NEXTCOMMAND%
set watext=%watext%~Please select another drive.
start /w wizapp MB EXCL
goto :p

:error2
set watitle=Error occurred!
set watext=Program cannot access drive %drivenum%!
set watext=%watext%~Please select another drive.
start /w wizapp MB EXCL
goto :p

:license
set page=:license
set watitle=%mytitle% Licensing Info
set watext=%mytext%~~This is the current info on Licensing
set watext=%watext%~of MBRFIX.EXE by Kaare Smith and its pseudo-GUI by jaclaz
:: wafile contains the output of the command.
set wafile=EULA.TXT
set wasig=%mysig% %page%
start /w wizapp FINISH FT
if errorlevel 2 goto :cancel
if errorlevel 1 goto :p
goto :exit


:cancel
set watitle=Cancel action
set watext=Do you want to exit this wizard?
start /w wizapp MB QUES
if errorlevel 2 goto %page%
GOTO :exit

:clear
::Let's clear all runtime variables
set NEEDFILES=
set NEXTCOMMAND=
set BYTE=
set DISKNUMBER=
set PAGE=
set FROMPAGE=
set MBRFILE=

::Let's clear all temp files
if exist %wabat% del %wabat% > nul
if exist %myout% del %myout% > nul
if exist %mytemp1% del %mytemp1% > nul

GOTO :EOF

:exit
call :clear
::Let's clear all the wizapp variables
set waprefix=
set watitle=
set watext=
set wainput=
set waeol=
set walistsep=
set wafile=
set wabmp=
set walabels=
set wasig=
set wasound=
set waico=
set wabat=
set waoutput=
set waoutnum=
set page=
set frompage=

::Let's clear the "my" variables
set mytitle=
set mytext=
set mysig=
set myout=
set mytemp1=
set mytemp2=

:end
