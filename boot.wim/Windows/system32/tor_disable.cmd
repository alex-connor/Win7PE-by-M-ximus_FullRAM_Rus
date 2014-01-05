tor -service stop
sc delete tor
reg add "HKEY_LOCAL_MACHINE\software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable  /t REG_DWORD /d 0 /f
move /y "%userprofile%\AppData\Roaming\Mozilla\Firefox\Profiles\bmmf16lz.default\foxyproxy.xml" "%userprofile%\AppData\Roaming\Mozilla\Firefox\Profiles\bmmf16lz.default\tor.xml"
move /y "%userprofile%\AppData\Roaming\Mozilla\Firefox\Profiles\bmmf16lz.default\foxyproxy.old.xml" "%userprofile%\AppData\Roaming\Mozilla\Firefox\Profiles\bmmf16lz.default\foxyproxy.xml"
del /f "X:\Windows\system32\config\systemprofile\Desktop\Остановить*"
xcopy /y "X:\Windows\system32\config\systemprofile\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Сеть\Tor\Запустить*" "X:\Windows\system32\config\systemprofile\Desktop\"
