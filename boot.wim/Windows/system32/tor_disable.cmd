tor -service stop
sc delete tor
reg add "HKEY_LOCAL_MACHINE\software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable  /t REG_DWORD /d 0 /f
move /y "X:\Program Files\K-Meleon\Profiles\profiles.ini" "X:\Program Files\K-Meleon\Profiles\profiles_tor.ini"
move /y "X:\Program Files\K-Meleon\Profiles\profiles_old.ini" "X:\Program Files\K-Meleon\Profiles\profiles.ini"
xcopy /y "X:\Windows\system32\config\systemprofile\AppData\Roaming\Microsoft\Windows\Start Menu\Сеть\Tor\Запустить*.lnk" "X:\Windows\system32\config\systemprofile\Desktop\Tor.lnk"
taskkill /f /im polipo.exe
taskkill /f /im tor.exe
