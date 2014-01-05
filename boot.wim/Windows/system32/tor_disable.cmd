tor -service stop
sc delete tor
reg add "HKEY_LOCAL_MACHINE\software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable  /t REG_DWORD /d 0 /f
move /y "%userprofile%\AppData\Roaming\Mozilla\Firefox\Profiles\bmmf16lz.default\foxyproxy.xml" "%userprofile%\AppData\Roaming\Mozilla\Firefox\Profiles\bmmf16lz.default\foxyproxy.xmlfoxyproxy.xml_tor"
move /y "%userprofile%\AppData\Roaming\Mozilla\Firefox\Profiles\bmmf16lz.default\foxyproxy.old.xml" "%userprofile%\AppData\Roaming\Mozilla\Firefox\Profiles\bmmf16lz.default\foxyproxy.xml"
move /y "%userprofile%\AppData\Roaming\Mozilla\Firefox\Profiles\bmmf16lz.default\prefs.js" "%userprofile%\AppData\Roaming\Mozilla\Firefox\Profiles\bmmf16lz.default\prefs.js_tor"
move /y "%userprofile%\AppData\Roaming\Mozilla\Firefox\Profiles\bmmf16lz.default\prefs.old.js" "%userprofile%\AppData\Roaming\Mozilla\Firefox\Profiles\bmmf16lz.default\prefs.js"
xcopy /y "X:\Windows\system32\config\systemprofile\AppData\Roaming\Microsoft\Windows\Start Menu\Сеть\Tor\Запустить*.lnk" "X:\Windows\system32\config\systemprofile\Desktop\Tor.lnk"
taskkill /f /im polipo.exe
taskkill /f /im tor.exe
