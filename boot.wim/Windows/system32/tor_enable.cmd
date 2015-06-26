taskkill /f /im polipo.exe
taskkill /f /im tor.exe
tor -service install -f "%systemroot%\system32\drivers\etc\torrc"
tor -service start
reg add "HKEY_LOCAL_MACHINE\software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable  /t REG_DWORD /d 1 /f
move /y "X:\Program Files\K-Meleon\Profiles\profiles.ini" "X:\Program Files\K-Meleon\Profiles\profiles_old.ini"
move /y "X:\Program Files\K-Meleon\Profiles\profiles_tor.ini" "X:\Program Files\K-Meleon\Profiles\profiles.ini"
xcopy /y "X:\Windows\system32\config\systemprofile\AppData\Roaming\Microsoft\Windows\Start Menu\Сеть\Tor\Остановить*.lnk" "X:\Windows\system32\config\systemprofile\Desktop\Tor.lnk"
cmdow /run /hid polipo -c "%systemroot%\system32\drivers\etc\resolv.conf"
