regedit /s Y:\sources\reg\sys.reg
regsvr32 /s Query.dll
regsvr32 /s "X:\Program Files\HashTab\HashTab32.dll"
regsvr32 /s "X:\Program Files\ExtremeCopy\XCShellExt.dll"
regsvr32 /s ieproxy.dll
regsvr32 /s "X:\Program Files\ImageX\gimagex_com.dll"
regsvr32 /s "X:\Program Files\XNView\XnViewShellExt.dll"
pnputil -i -a "X:\Program Files\ImageX\wimfltr.inf"
imdisk -a -s 20%% -m B: -p "/fs:fat32 /q /y"
mkdir "b:\temp"
reg delete HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon /v "Shell"
reg add HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon /v "Shell" /d "explorer.exe" /t REG_SZ
