rmdir /s /q "X:\Windows\Security\"
rmdir /s /q "X:\Windows\ServiceProfiles\"
del /f /a:h "X:\$WIMDESC"
rmdir /s /q "X:\Windows\system32\Logfiles\"
rmdir /s /q "X:\Windows\system32\Microsoft\"
imdisk -a -s 20%% -m B: -p "/fs:fat32 /q /y"
mkdir "b:\temp"
regsvr32 /i /s Query.dll
regsvr32 /i /s "%SystemRoot%\System32\netshell.dll"
regsvr32 /i /s "%SystemRoot%\System32\networkexplorer.dll"
regsvr32 /i /s "%systemdrive%\Program Files\HashTab\HashTab32.dll"
regsvr32 /i /s "%systemdrive%\Program Files\ExtremeCopy\XCShellExt.dll"
regsvr32 /i /s ieproxy.dll
regsvr32 /i /s "%systemdrive%\Program Files\XNView\XnViewShellExt.dll"
regsvr32 /i /s "X:\Program Files\DJVU\WinDjViewRU.dll"
sc create AoE binPath= "x:\windows\system32\drivers\aoe32.sys" type= kernel start= boot group= "SCSI Class"
sc create HTTPDisk binPath= "x:\windows\system32\drivers\wvhttp32.sys" type= kernel start= boot group= "SCSI Class"
sc create AppleHFS binPath= "x:\windows\system32\drivers\AppleHFS.sys" type= filesys start= auto group= "File System"
sc create AppleMnt binPath= "x:\windows\system32\drivers\AppleMNT.sys" type= filesys start= auto group= "File System"
sc create Rfsd binPath= "x:\windows\system32\drivers\RFSD.sys" type= filesys start= auto group= "File System"
reg import "x:\windows\system32\services.reg"
sc start WinVBlock
sc start AoE
sc start HTTPDisk
sc start AppleHFS
sc start Rfsd
sc start Ext2Fsd
sc start ext4fs
sc start xfs
sc start Audiosrv
for %%i in (x:\windows\system32\*.ax;x:\windows\system32\*.acm) do regsvr32 /i /s "%%~dpnxi"
if not EXIST "B:\Programs\" mkdir "B:\Programs\"
if EXIST "b:\temp" regedit /s "%systemroot%\system32\temp.reg" 
