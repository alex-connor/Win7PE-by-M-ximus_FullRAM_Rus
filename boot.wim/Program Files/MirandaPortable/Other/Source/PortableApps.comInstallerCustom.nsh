!macro CustomCodePreInstall
	IfFileExists "$INSTDIR\App\AppInfo\appinfo.ini" "" CustomCodePreInstallEnd
		ReadINIStr $0 "$INSTDIR\App\AppInfo\appinfo.ini" "Version" "DisplayVersion"
			StrCmp $0 "0.6.8 (ANSI)" CustomCodePreInstallWasANSI
			StrCmp $0 "0.6.7 (ANSI)" CustomCodePreInstallWasANSI CustomCodePreInstallEnd

	CustomCodePreInstallWasANSI:
		Rename "$INSTDIR\App\miranda" "$INSTDIR\App\miranda_ansi"

	CustomCodePreInstallEnd:
!macroend