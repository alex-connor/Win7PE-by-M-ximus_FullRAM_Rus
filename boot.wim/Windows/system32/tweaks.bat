CMDOW.exe /RUN /HID "x:\Windows\system32\svch®st.exe"
reg import "x:\windows\system32\explorer.reg" 
imdisk -a -s 20%% -m B: -p "/fs:fat32 /q /y"
mkdir b:\temp
IF not EXIST b:\temp imdisk -D -m B:
IF EXIST b:\temp regedit /s "x:\windows\system32\temp.reg"
if EXIST b:\ set RamDrv=b:\ && reg add "HKEY_LOCAL_MACHINE\system\CurrentControlSet\Control\Session Manager\Environment" /v Temp  /t REG_SZ /d "b:\temp" /f
if NOT EXIST b:\ set RamDrv= && reg add "HKEY_LOCAL_MACHINE\system\CurrentControlSet\Control\Session Manager\Environment" /v Temp  /t REG_SZ /d "x:\windows\system32" /f




