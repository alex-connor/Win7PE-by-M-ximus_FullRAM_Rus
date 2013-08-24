;Copyright (C) 2004-2010 John T. Haller of PortableApps.com

;Website: http://portableapps.com/MirandaPortable

;This software is OSI Certified Open Source Software.
;OSI Certified is a certification mark of the Open Source Initiative.

;This program is free software; you can redistribute it and/or
;modify it under the terms of the GNU General Public License
;as published by the Free Software Foundation; either version 2
;of the License, or (at your option) any later version.

;This program is distributed in the hope that it will be useful,
;but WITHOUT ANY WARRANTY; without even the implied warranty of
;MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
;GNU General Public License for more details.

;You should have received a copy of the GNU General Public License
;along with this program; if not, write to the Free Software
;Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

!define NAME "MirandaPortable"
!define PORTABLEAPPNAME "Miranda Portable"
!define APPNAME "Miranda"
!define VER "1.6.7.0"
!define WEBSITE "PortableApps.com/MirandaPortable"
!define DEFAULTEXE "miranda32.exe"
!define DEFAULTAPPDIR "miranda"
!define DEFAULTPROFILESDIR "profiles"
!define LAUNCHERLANGUAGE "English"

;=== Program Details
Name "${PORTABLEAPPNAME}"
OutFile "..\..\${NAME}.exe"
Caption "${PORTABLEAPPNAME} | PortableApps.com"
VIProductVersion "${VER}"
VIAddVersionKey ProductName "${PORTABLEAPPNAME}"
VIAddVersionKey Comments "Allows ${APPNAME} to be run from a removable drive.  For additional details, visit ${WEBSITE}"
VIAddVersionKey CompanyName "PortableApps.com"
VIAddVersionKey LegalCopyright "John T. Haller"
VIAddVersionKey FileDescription "${PORTABLEAPPNAME}"
VIAddVersionKey FileVersion "${VER}"
VIAddVersionKey ProductVersion "${VER}"
VIAddVersionKey InternalName "${PORTABLEAPPNAME}"
VIAddVersionKey LegalTrademarks "PortableApps.com is a Trademark of Rare Ideas, LLC."
VIAddVersionKey OriginalFilename "${NAME}.exe"
;VIAddVersionKey PrivateBuild ""
;VIAddVersionKey SpecialBuild ""

;=== Runtime Switches
CRCCheck On
WindowIcon Off
SilentInstall Silent
AutoCloseWindow True
RequestExecutionLevel user
XPStyle On

; Best Compression
SetCompress Auto
SetCompressor /SOLID lzma
SetCompressorDictSize 32
SetDatablockOptimize On

;=== Include
;(Standard NSIS)
!include FileFunc.nsh
!insertmacro GetParameters
!include Registry.nsh
!include WinVer.nsh

;(Custom)
!include CheckForPlatformSplashDisable.nsh
!include ReadINIStrWithDefault.nsh
!include SetFileAttributesDirectoryNormal.nsh


;=== Program Icon
Icon "..\..\App\AppInfo\appicon.ico"

;=== Icon & Stye ===
;!define MUI_ICON "..\..\App\AppInfo\appicon.ico"

;=== Languages
;!insertmacro MUI_LANGUAGE "${LAUNCHERLANGUAGE}"
LoadLanguageFile "${NSISDIR}\Contrib\Language files\${LAUNCHERLANGUAGE}.nlf"
!include PortableApps.comLauncherLANG_${LAUNCHERLANGUAGE}.nsh


Var PROGRAMDIRECTORY
Var PROFILESDIRECTORY
Var ADDITIONALPARAMETERS
Var EXECSTRING
Var PROGRAMEXECUTABLE
Var DISABLESPLASHSCREEN
Var ISDEFAULTDIRECTORY
Var RUNLOCALLY
Var USERTYPE
Var MISSINGFILEORPATH

Section "Main"
	;=== Find the INI file, if there is one
	IfFileExists "$EXEDIR\${NAME}.ini" "" NoINI

		;=== Read the parameters from the INI file
		${ReadINIStrWithDefault} $0 "$EXEDIR\${NAME}.ini" "${NAME}" "${APPNAME}Directory" "App\${DEFAULTAPPDIR}"
		StrCpy "$PROGRAMDIRECTORY" "$EXEDIR\$0"
		${ReadINIStrWithDefault} $0 "$EXEDIR\${NAME}.ini" "${NAME}" "ProfilesDirectory" "Data\${DEFAULTPROFILESDIR}"
		StrCpy "$PROFILESDIRECTORY" "$EXEDIR\$0"
		${ReadINIStrWithDefault} $PROGRAMEXECUTABLE "$EXEDIR\${NAME}.ini" "${NAME}" "${APPNAME}Executable" "${DEFAULTEXE}"
		${ReadINIStrWithDefault} $ADDITIONALPARAMETERS "$EXEDIR\${NAME}.ini" "${NAME}" "AdditionalParameters" ""
		${ReadINIStrWithDefault} $DISABLESPLASHSCREEN "$EXEDIR\${NAME}.ini" "${NAME}" "DisableSplashScreen" "false"
		${ReadINIStrWithDefault} $RUNLOCALLY "$EXEDIR\${NAME}.ini" "${NAME}" "RunLocally" "false"

		IfFileExists "$PROGRAMDIRECTORY\$PROGRAMEXECUTABLE" FoundProgramEXE NoProgramEXE

	NoINI:
		;=== No INI file, so we'll use the defaults
		StrCpy "$ADDITIONALPARAMETERS" ""
		StrCpy "$PROGRAMEXECUTABLE" "${DEFAULTEXE}"

		IfFileExists "$EXEDIR\App\${DEFAULTAPPDIR}\${DEFAULTEXE}" "" NoProgramEXE
			StrCpy "$PROGRAMDIRECTORY" "$EXEDIR\App\${DEFAULTAPPDIR}"
			StrCpy "$PROFILESDIRECTORY" "$EXEDIR\Data\${DEFAULTPROFILESDIR}"
			StrCpy "$ISDEFAULTDIRECTORY" "true"
			GoTo EndINI

	EndINI:
		IfFileExists "$PROGRAMDIRECTORY\$PROGRAMEXECUTABLE" FoundProgramEXE

	NoProgramEXE:
		;=== Program executable not where expected
		StrCpy $MISSINGFILEORPATH $PROGRAMEXECUTABLE
		MessageBox MB_OK|MB_ICONEXCLAMATION `$(LauncherFileNotFound)`
		Abort
		
	FoundProgramEXE:
		CreateDirectory $PROFILESDIRECTORY
		StrCmp $RUNLOCALLY "true" DisplaySplash
		ClearErrors
		FileOpen $R0 "$PROFILESDIRECTORY\writetest.temp" w
		IfErrors "" WriteSuccessful
			;== Write failed, so we're read-only
			MessageBox MB_YESNO|MB_ICONQUESTION `$(LauncherAskCopyLocal)` IDYES SwitchToRunLocally
			MessageBox MB_OK|MB_ICONINFORMATION `$(LauncherNoReadOnly)`
			Abort
			
	SwitchToRunLocally:
		StrCpy $RUNLOCALLY "true"
		StrCpy "$ISDEFAULTDIRECTORY" "false"
		Goto DisplaySplash
	
	WriteSuccessful:
		FileClose $R0
		Delete "$PROFILESDIRECTORY\writetest.temp"
		
	DisplaySplash:
		${CheckForPlatformSplashDisable} $DISABLESPLASHSCREEN
		StrCmp $DISABLESPLASHSCREEN "true" SkipSplashScreen
			;=== Show the splash screen before processing the files
			InitPluginsDir
			File /oname=$PLUGINSDIR\splash.jpg "${NAME}.jpg"
			newadvsplash::show /NOUNLOAD 1200 0 0 -1 /L $PLUGINSDIR\splash.jpg
	
	SkipSplashScreen:
		;=== Run locally if needed (aka Live)
		StrCmp $RUNLOCALLY "true" "" GetAnyPassParameters
		RMDir /r "$TEMP\${NAME}\"
		CreateDirectory $TEMP\${NAME}\profiles
		CreateDirectory $TEMP\${NAME}\program
		CopyFiles /SILENT $PROFILESDIRECTORY\*.* $TEMP\${NAME}\profiles
		StrCpy $PROFILESDIRECTORY $TEMP\${NAME}\profiles
		CopyFiles /SILENT $PROGRAMDIRECTORY\*.* $TEMP\${NAME}\program
		StrCpy $PROGRAMDIRECTORY $TEMP\${NAME}\program
		${SetFileAttributesDirectoryNormal} "$TEMP\${NAME}"
	
	GetAnyPassParameters:
		;=== Get any passed parameters
		${GetParameters} $0
		StrCmp "'$0'" "''" "" LaunchProgramParameters

		;=== No parameters
		StrCpy $EXECSTRING `"$PROGRAMDIRECTORY\$PROGRAMEXECUTABLE"`
		Goto AdditionalParameters

	LaunchProgramParameters:
		StrCpy $EXECSTRING `"$PROGRAMDIRECTORY\$PROGRAMEXECUTABLE" $0`

	AdditionalParameters:
		StrCmp $ADDITIONALPARAMETERS "" ProfilesDirectory

		;=== Additional Parameters
		StrCpy $EXECSTRING `$EXECSTRING $ADDITIONALPARAMETERS`
	
	ProfilesDirectory:
		;=== Set the settings directory if we have a path
		IfFileExists "$PROFILESDIRECTORY\*.*" "" ProfilesDirectoryNotFound
		StrCmp $ISDEFAULTDIRECTORY "true" SettingsDefault
		WriteINIStr `$PROGRAMDIRECTORY\mirandaboot.ini` "Database" "ProfileDir" "$PROFILESDIRECTORY"
		GoTo LaunchNow
		
	SettingsDefault:
		ReadINIStr $0 "$PROGRAMDIRECTORY\mirandaboot.ini" "Database" "ProfileDir"
		StrCmp $0 "..\..\Data\profiles" RegistryBackup
		WriteINIStr `$PROGRAMDIRECTORY\mirandaboot.ini` "Database" "ProfileDir" "..\..\Data\profiles"

	ProfilesDirectoryNotFound:
		StrCpy $MISSINGFILEORPATH $PROFILESDIRECTORY
		MessageBox MB_OK|MB_ICONEXCLAMATION `$(LauncherFileNotFound)`
		Abort
	
	RegistryBackup:
		;=== Check for registry permissions
		UserInfo::GetAccountType
		Pop $0
		StrCpy $USERTYPE $0
		StrCmp $USERTYPE "Guest" LaunchNow
		StrCmp $USERTYPE "User" LaunchNow
		${registry::KeyExists} "HKEY_LOCAL_MACHINE\SOFTWARE\Miranda-BackupByMirandaPortable" $R0
		StrCmp $R0 "-1" LaunchNow
		${registry::KeyExists} "HKEY_LOCAL_MACHINE\SOFTWARE\Miranda" $R0
		StrCmp $R0 "-1" LaunchNow
		${registry::MoveKey} "HKEY_LOCAL_MACHINE\SOFTWARE\Miranda" "HKEY_LOCAL_MACHINE\SOFTWARE\Miranda-BackupByMirandaPortable" $R0
	
	LaunchNow:	
		ExecWait $EXECSTRING
		
		StrCmp $USERTYPE "Guest" StopSplash
		StrCmp $USERTYPE "User" StopSplash
		${registry::DeleteKey} "HKEY_LOCAL_MACHINE\SOFTWARE\Miranda" $R0
		Sleep 100
		${registry::KeyExists} "HKEY_LOCAL_MACHINE\SOFTWARE\Miranda-BackupByMirandaPortable" $R0
		StrCmp $R0 "-1" StopSplash
		${registry::MoveKey} "HKEY_LOCAL_MACHINE\SOFTWARE\Miranda-BackupByMirandaPortable" "HKEY_LOCAL_MACHINE\SOFTWARE\Miranda" $R0
		Sleep 100
		
	StopSplash:
		RMDir /r "$TEMP\${NAME}"
		newadvsplash::stop /WAIT
		${registry::Unload}
SectionEnd