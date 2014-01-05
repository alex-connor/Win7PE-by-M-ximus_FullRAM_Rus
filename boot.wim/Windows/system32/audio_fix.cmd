:: ==========================================================================================================================
:: ====================================== audio_fix.cmd =====================================================================
:: ==========================================================================================================================
TITLE audio_fix.cmd - PE3 fix
@ECHO OFF
CLS

SETLOCAL ENABLEEXTENSIONS
SETLOCAL ENABLEDELAYEDEXPANSION

drvload.exe X:\Windows\inf\hdaudio.inf
drvload.exe X:\Windows\inf\virtualaudiodevice.inf
drvload.exe X:\Windows\inf\wdma_int.inf
drvload.exe X:\Windows\inf\wdma_ens.inf
drvload.exe X:\Windows\inf\wdma_usb.inf
drvload.exe X:\Windows\inf\wdmaudio.inf
:: PnPutil.exe -i -a X:\Windows\inf\ksfilter.inf
:: PnPutil.exe -i -a X:\Windows\inf\wdmaudio.inf
:: PnPutil.exe -i -a X:\Windows\inf\hdaudss.inf
::PnPutil.exe -i -a X:\Windows\inf\hdaudio.inf

:: SET speak_guid=

:: FOR /F "tokens=1-9 delims=\" %%G IN ('reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render') DO (
::   SET temp_guid=%%O
::   IF "!temp_guid!" NEQ "" (
::     FOR /F "tokens=1,2,* delims= " %%A IN ('reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render\!temp_guid!\Properties') DO (
::       SET p_3=%%C
::       IF "!p_3!"=="Speakers" (
::         SET speak_guid=!temp_guid!
::         ECHO.
::         ECHO speak_guid = !speak_guid!    Device = !p_3!
::       )
::         IF "!p_3!"=="Digital Audio (S/PDIF)" (
::         SET spdif_guid=!temp_guid!
::         ECHO.
::         ECHO spdif_guid = !spdif_guid!    Device = !p_3!
::         reg delete HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render\!temp_guid! /f
::       )
::     )
::   )
:: )

ECHO.

:: IF NOT "!speak_guid!"=="" (
::   FOR /F "tokens=1,2,* delims= " %%A IN ('reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render\!speak_guid!\Properties') DO (
::     SET p_1=%%A
::     SET p_3=%%C
::    IF "!p_1!"=="{b3f8fa53-0004-438e-9003-51a46e139bfc},2" (
::       FOR /F "tokens=1,2,3,* delims=&" %%G IN ("!p_3!") DO (
::         SET devid=%%H%%I
::         ECHO DevID = !devid!
::       )
::     )
::   )
::   IF "!devid!"=="VEN_10ECDEV_0883" goto :_addgroup1
::   IF "!devid!"=="VEN_10ECDEV_0888" goto :_addgroup1
::   IF "!devid!"=="VEN_11D4DEV_1882" goto :_addgroup2
::   goto :_addgroup3
::  )

:: :_addgroup1
:: reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render\!speak_guid!\Properties /v "{f19f064d-082c-4e27-bc73-6882a1bb8e4c},0" /t REG_BINARY /d "4100207401000000feff020044ac000010b102000400100016001000030000000100000000001000800000aa00389b71" /f
:: reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render\!speak_guid!\Properties /v "{e4870e26-3cc5-4cd2-ba46-ca0a9a70ed04},0" /t REG_BINARY /d "4100207401000000feff020044ac0000206205000800200016002000030000000300000000001000800000aa00389b71" /f
:: reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render\!speak_guid!\Properties /v "{e4870e26-3cc5-4cd2-ba46-ca0a9a70ed04},1" /t REG_BINARY /d "4100000001000000d38c010000000000" /f
:: goto :_startaudsrv

:: :_addgroup2
:: reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render\!speak_guid!\Properties /v "{f19f064d-082c-4e27-bc73-6882a1bb8e4c},0" /t REG_BINARY /d "41001c7401000000feff020044ac000010b102000400100016001000030000000100000000001000800000aa00389b71" /f
:: reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render\!speak_guid!\Properties /v "{e4870e26-3cc5-4cd2-ba46-ca0a9a70ed04},0" /t REG_BINARY /d "41001c7401000000feff020044ac0000206205000800200016002000030000000300000000001000800000aa00389b71" /f
:: reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render\!speak_guid!\Properties /v "{e4870e26-3cc5-4cd2-ba46-ca0a9a70ed04},1" /t REG_BINARY /d "4100000001000000d38c010000000000" /f
:: goto :_startaudsrv

:: :_addgroup3
:: reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render\!speak_guid!\Properties /v "{f19f064d-082c-4e27-bc73-6882a1bb8e4c},0" /t REG_BINARY /d "4100ee7428000000feff020044ac000010b102000400100016001000030000000100000000001000800000aa00389b71" /f
:: reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render\!speak_guid!\Properties /v "{e4870e26-3cc5-4cd2-ba46-ca0a9a70ed04},0" /t REG_BINARY /d "4100ee7428000000feff020044ac0000206205000800200016002000030000000300000000001000800000aa00389b71" /f
:: reg add HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render\!speak_guid!\Properties /v "{e4870e26-3cc5-4cd2-ba46-ca0a9a70ed04},1" /t REG_BINARY /d "4100630008000000a086010000000000" /f

:: :_startaudsrv
ECHO.
NET STOP Audiosrv
NET START Audiosrv

:: pause

EXIT

