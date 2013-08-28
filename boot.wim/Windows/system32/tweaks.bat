imdisk -a -s 20%% -m B: -p "/fs:fat32 /q /y"
mkdir "b:\temp"
if EXIST "b:\temp" regedit /s "%systemroot%\system32\temp.reg"
regedit /s Y:\sources\reg\sys.reg
regsvr32 /i /s Query.dll
regsvr32 /i /s "%systemdrive%\Program Files\HashTab\HashTab32.dll"
regsvr32 /i /s "%systemdrive%\Program Files\ExtremeCopy\XCShellExt.dll"
regsvr32 /i /s ieproxy.dll
regsvr32 /i /s "%systemdrive%\Program Files\XNView\XnViewShellExt.dll"
pnputil -i -a "%systemdrive%\Program Files\ImageX\wimfltr.inf"
"%systemdrive%\Program Files\SpecChar\SpecChar.exe"
"%systemdrive%\Program Files\Yandex\Punto Switcher\punto.exe"
"%systemdrive%\Program Files\DesktopOK\DesktopOK.exe"
"%systemdrive%\Program Files\Everything\Everything.exe" -startup
cd /d "B:\Programs\"
"%systemdrive%\Program Files\7-Zip\7z.exe" x "y:\programs\autoit3.7z"
regsvr32 /i /s "B:\Programs\AutoIt3\autoit3.reg"