:::::: audio_fix.cmd ::::::
 
TITLE audio_fix.cmd - PE3 fix
@ECHO OFF
CLS
 
SETLOCAL ENABLEEXTENSIONS
SETLOCAL ENABLEDELAYEDEXPANSION
 
PnPutil.exe -i -a X:\Windows\inf\hdaudio.inf
 
SET speak_guid=
 
FOR /F "tokens=1-9 delims=\" %%G IN ('reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render') DO (
  SET temp_guid=%%O
  IF "!temp_guid!" NEQ "" (
    FOR /F "tokens=1,2,* delims= " %%A IN ('reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render\!temp_guid!\Properties') DO (
      SET p_3=%%C
      IF "!p_3!"=="Speakers" (
        SET speak_guid=!temp_guid!
        ECHO.
        ECHO speak_guid = !speak_guid!    Device = !p_3!
      )
        IF "!p_3!"=="Digital Audio (S/PDIF)" (
        SET spdif_guid=!temp_guid!
        ECHO.
        ECHO spdif_guid = !spdif_guid!    Device = !p_3!
        reg delete HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render\!temp_guid! /f
      )
    )
  )
)
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
SET speak_guid=
FOR /F "tokens=1-9 delims=\" %%G IN ('reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render') DO (
  SET temp_guid=%%O
  IF "!temp_guid!" NEQ "" (
    FOR /F "tokens=1,2,* delims= " %%A IN ('reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render\!temp_guid!\Properties') DO (
      SET p_3=%%C
      IF "!p_3!"=="Speakers" (
        SET speak_guid=!temp_guid!
        ECHO.
        ECHO speak_guid = !speak_guid!    Device = !p_3!
      )
        IF "!p_3!"=="Digital Audio (S/PDIF)" (
        SET spdif_guid=!temp_guid!
        ECHO.
        ECHO spdif_guid = !spdif_guid!    Device = !p_3!
        reg delete HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\MMDevices\Audio\Render\!temp_guid! /f
      )
    )
  )
)
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
EXIT 