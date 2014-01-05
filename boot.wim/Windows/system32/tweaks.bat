reg import "x:\windows\system32\explorer.reg" 
imdisk -a -s 20%% -m B: -p "/fs:fat32 /q /y"
mkdir b:\temp
IF not EXIST b:\temp imdisk -D -m B:
IF EXIST b:\temp regedit /s "x:\windows\system32\temp.reg"
if EXIST b:\ set RamDrv=b: && mklink /j "b:\" "b:\peprograms"
regsvr32 /i /s "x:\Windows\system32\npswf32.dll"





