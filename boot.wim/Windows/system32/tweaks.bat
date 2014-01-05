reg import "x:\windows\system32\explorer.reg" 
imdisk -a -s 20%% -m B: -p "/fs:fat32 /q /y"
mkdir "b:\temp"
sc create AoE binPath= "x:\windows\system32\drivers\aoe32.sys" type= kernel start= boot group= "SCSI Class"
sc create HTTPDisk binPath= "x:\windows\system32\drivers\wvhttp32.sys" type= kernel start= boot group= "SCSI Class"
if not EXIST "B:\Programs\" mkdir "B:\Programs\"
if EXIST "b:\temp" regedit /s "%systemroot%\system32\temp.reg" 
if not EXIST "b:\temp" imdisk -D -m B:



