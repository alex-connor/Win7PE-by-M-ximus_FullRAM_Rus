#include <Constants.au3>
#include <File.au3>
#include <Array.au3>

local $caps = DllCall("user32.dll","long","GetKeyState","long",0x14); if Capslock pressed, then program exits

if $caps[0]="0" then

dim $i,$auto[1],$e[1],$key[1],$file[1],$run[1],$m[3],$ram,$hdd,$pagefile,$n,$g

if (UBound($Cmdline)-1)>0 then
if $CmdLine[1]="/first" then
$first = _ReadIni('X:\Windows\Autorun\Autoruns\settings.ini',"first")
for $i = 0 to UBound($first)-1
   if FileExists($first[$i]) then
		 ShellExecuteWait($first[$i])
   EndIf
Next
endif
endif
$key = _ReadIni('X:\Windows\Autorun\Autoruns\settings.ini', "registry")
$file = _ReadIni('X:\Windows\Autorun\Autoruns\settings.ini',"directory")
$run = _ReadIni('X:\Windows\Autorun\Autoruns\settings.ini',"startup")
$run512=_ReadIni('X:\Windows\Autorun\Autoruns\settings.ini',"less512Mb")
$explorer=_ReadIni('X:\Windows\Autorun\Autoruns\settings.ini',"explorer")
$auto = _RegAutorun($key)
$e = _DirAutorun($file)
_ArrayConcatenate($auto,$e)
_ArrayConcatenate($auto,$run)
$ram=TotalRAM()
if $ram <= 512 Then
$hdd=DriveGetDrive( "FIXED" )
   if $hdd[0] > 0 then
	  for $n = 1 to $hdd[0]
		 $pagefile =_FileSearch($hdd[$n], "pagefile.sys")
		 if $pagefile[1] <> '' then 
			$pagefile[1]=$hdd[$n] & '\' & $pagefile[1]
			exitloop
		 EndIf
	  Next
	  if FileExists($pagefile[1]) then 
		 SetPageFile($pagefile[1])
	  EndIf
   EndIf
   if ($hdd[0] = 0) or not (FileExists($pagefile[1])) then
	  $g= MsgBox(49, "Ошибка!", "Количества оперативной памяти не достаточно для работы системы. Большинство компонентов не будет работать без файла подкачки.  Поиск файлов подкачки на дисках для автоматического запуска не дал результатов.  Желаете установить файл подкачки самостоятельно?  В противном случае запуск системы будет затруднителен.",30)
	  Switch  $g
   Case 1
	  if FileExists("x:\windows\system32\SetPageFile.exe") then
		 RunWait("x:\windows\system32\SetPageFile.exe")
	  EndIf
	  If not (FileExists("x:\windows\system32\SetPageFile.exe")) or UBound(RegRead("HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management","PagingFiles")) < 15 then
		 MsgBox(48,"Ошибка!", " Система продолжит работать без файла подкачки,  но её стабильная работа не гарантируется!", 5)
		 $auto=$run512
	  EndIf
	  Case -1, 2
		 $auto=$run512
	  EndSwitch
   EndIf
EndIf
for $i = 0 to UBound($auto)-1
   if FileExists($auto[$i]) then
		 ShellExecute($auto[$i],'')
   EndIf
Next


Local $begin = TimerInit()
while 1
if ($ram > 512) and (TimerDiff($begin)<=60000) then
   if ProcessExists("explorer.exe")  Then
	  sleep(5000)
	  for $i = 0 to UBound($explorer)-1
		 if FileExists($explorer[$i]) then
			ShellExecute($explorer[$i],'')
		 EndIf
	  Next
	  ExitLoop
	  Exit
   EndIf
   sleep(1000)
Else
   ExitLoop
   Exit
   EndIf
WEND

endif

Func _DirAutorun($filedir)
   local $i,$autofile[1],$f,$reg[1]
   
   for $f = 0 to UBound($filedir)-1
if FileExists($filedir[$f]) then 
   $reg = _FileListToArray($filedir[$f], '*', 1 )
   if @error <> 0 then exitloop
   for $i = 1 to $reg[0]
   if not StringInStr($reg[$i],'.ini') then
	  If $autofile[0]='' then 
		 $autofile[0]=$filedir[$f] & '\' & $reg[$i]
	  Else
		 _ArrayAdd($autofile,$filedir[$f] & '\' & $reg[$i])
	  EndIf
   EndIf
Next
EndIf
Next
return $autofile
EndFunc

Func _RegAutorun($regkey)
   local $autoreg[1],$i,$reg[1]
for $f = 0 to UBound($regkey)-1
for $i = 1 to 100
   $reg = RegEnumVal($regkey[$f],$i)
   if @error <> 0 then 
	  exitloop
   EndIf
   if not StringInStr(RegRead($regkey[$f],$reg),'.ini') then
	  If $autoreg[0]='' then 
		 $autoreg[0]=RegRead($regkey[$f],$reg)
	  Else
		 _ArrayAdd($autoreg,RegRead($regkey[$f],$reg))
	  EndIf
   EndIf
Next
Next
   return $autoreg
EndFunc


func _ReadIni($inipath,$section)
local $key[1]
Local $keys = IniRead($inipath, $section,0,1)
If @error Then
    MsgBox(4096, "", "Ошибка чтения ini файла.")
Else
    For $i = 1 To $keys
        if $key[0]='' then 
		   $key[0]=IniRead($inipath, $section,$i,'error')
		else 
		   _ArrayAdd($key,IniRead($inipath, $section,$i,'error'))
		EndIf
    Next
 EndIf
 return $key
 EndFunc
 
 Func _PathSplitByRegExp($sPath)
    If StringStripWS($sPath, 8) = '' Then
        Return SetError(1, 0, 0)
    EndIf
   
    $sPath = StringReplace($sPath, '/', '\')
   
    Local $aRet = StringRegExp($sPath, '^(?i)([a-z]:|\\\\(?:\?\\)?[a-z0-9_.$]+\\[a-z0-9_.]+\$?)?(\\(?:[^\\/:*?"<>|\r\n]+\\)*)?([^\\/:*?"<>|\r\n.]*)\.?((?:[^.\\/:*?"<>|\r\n]+)?)$', 2)
   
    Switch @error
        Case 1
            Return SetError(2, 0, 0) ;Array is invalid. No matches.
        Case 2
            Return SetError(3, @extended, 0) ;Bad pattern, array is invalid. @Extended = offset of error in pattern.
    EndSwitch
   
    Return $aRet
 EndFunc
 
 Func TotalRAM()
	dim $totalram,$lines
$totalram=Run('memory.exe', @ScriptDir, @SW_HIDE, $STDERR_CHILD + $STDOUT_CHILD)
    While 1
    $lines &= StdoutRead($totalram,false,False)
    If @error Then ExitLoop
	Wend
    Return Int($lines)
 EndFunc
 
 Func SetPageFile($filename)
	If FileExists($filename) then 
	   $filesize=((FileGetSize($filename))/1024)/1024
	   if $filesize < 1024 Then
		  $filesize=1024
		  EndIf
	  if FileExists("x:\windows\system32\setpagefile.exe") then
		 runwait("x:\windows\system32\setpagefile.exe " & $filename & " " & $filesize)
	  Else
		 $par="c:\pagefile.sys " & $filesize & " " & $filesize
		 $keyname="HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management"
		 $valuename="PagingFiles"
		 RegDelete($keyname, $valuename)
		 RegWrite($keyname, $valuename, "REG_MULTI_SZ", $par) 
	  EndIf
   EndIf
EndFunc
 
 Func _FileSearch($sPath, $sFileMask)
    Local $iPID, $sStdOutRead, $aRet

    $iPID = Run(@ComSpec & ' /C Dir "' & $sPath & '\' & $sFileMask & '" /B /A RASH', @SystemDir, @SW_HIDE, 6)

    While 1
        $sStdOutRead &= StdoutRead($iPID)
        If @error <> 0 Then ExitLoop
    WEnd
    $aRet = StringSplit(StringStripCR(StringStripWS($sStdOutRead, 3)), @LF)
    Return SetError(@error, 0, $aRet)
EndFunc