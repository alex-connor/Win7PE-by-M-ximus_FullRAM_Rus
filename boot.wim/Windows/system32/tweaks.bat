imdisk -a -s 20%% -m B: -p "/fs:fat32 /q /y"
mkdir "b:\temp"
regedit /s Y:\sources\reg\sys.reg
regedit /s Y:\sources\reg\sys1.reg
regsvr32 /i /s Query.dll
regsvr32 /i /s "%systemdrive%\Program Files\HashTab\HashTab32.dll"
regsvr32 /i /s "%systemdrive%\Program Files\ExtremeCopy\XCShellExt.dll"
regsvr32 /i /s ieproxy.dll
regsvr32 /i /s "%systemdrive%\Program Files\XNView\XnViewShellExt.dll"
pnputil -i -a "%systemdrive%\Program Files\ImageX\wimfltr.inf"
if not EXIST "B:\Programs\" mkdir "B:\Programs\"
if EXIST "b:\temp" regedit /s "%systemroot%\system32\temp.reg" 