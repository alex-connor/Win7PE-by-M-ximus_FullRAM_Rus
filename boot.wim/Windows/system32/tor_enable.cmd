taskkill /f /im polipo.exe
taskkill /f /im tor.exe
tor -service install -f "%systemroot%\system32\drivers\etc\torrc"
tor -service start
reg add "HKEY_LOCAL_MACHINE\software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable  /t REG_DWORD /d 1 /f
move /y "%userprofile%\AppData\Roaming\Mozilla\Firefox\Profiles\bmmf16lz.default\foxyproxy.xml" "%userprofile%\AppData\Roaming\Mozilla\Firefox\Profiles\bmmf16lz.default\foxyproxy.old.xml"
move /y "%userprofile%\AppData\Roaming\Mozilla\Firefox\Profiles\bmmf16lz.default\tor.xml" "%userprofile%\AppData\Roaming\Mozilla\Firefox\Profiles\bmmf16lz.default\foxyproxy.xml"
del /f "X:\Windows\system32\config\systemprofile\Desktop\Запустить*"
xcopy /y "X:\Windows\system32\config\systemprofile\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Сеть\Tor\Остановить*" "X:\Windows\system32\config\systemprofile\Desktop\"
start /b polipo -c "%systemroot%\system32\drivers\etc\resolv.conf"
