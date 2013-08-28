#include <File.au3>
#include <Array.au3>

dim $i,$auto[1],$e[1],$key[1],$file[1],$run[1]

$key = _ReadIni('X:\Windows\Autorun\Autoruns\settings.ini', "registry")
$file = _ReadIni('X:\Windows\Autorun\Autoruns\settings.ini',"directory")
$run = _ReadIni('X:\Windows\Autorun\Autoruns\settings.ini',"startup")
$auto = _RegAutorun($key)
$e = _DirAutorun($file)
_ArrayConcatenate($auto,$e)
_ArrayConcatenate($auto,$run)
for $i = 0 to UBound($auto)-1
   if FileExists($auto[$i]) then
   if StringInStr($auto[$i],".exe") then 
	  Run($auto[$i])
   Else
	  ShellExecute($auto[$i])
   EndIf
EndIf
Next

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