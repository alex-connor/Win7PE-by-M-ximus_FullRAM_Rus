#include <Constants.au3>
#NoTrayIcon
global $ram
$ram=TotalRam()
$file=FileExists("X:\Program Files\MemClean\MemClean.exe")
Switch $ram 
case 0 To 768
AdlibRegister("Process",7000)
AdlibRegister("Cache",45000)

case 768 To 2048
AdlibRegister("Process",10000)
AdlibRegister("Cache",60000)

case 2048 To 1048576
exit

EndSwitch

While 1
   sleep(200)
WEnd

func Process()
   If $file and not(ProcessExists("MemClean.exe")) then
   ShellExecute("X:\Program Files\MemClean\MemClean.exe","process")
   EndIf
EndFunc

func Cache()
   If $file and not(ProcessExists("MemClean.exe")) then
   ShellExecute("X:\Program Files\MemClean\MemClean.exe","cache")
   EndIf
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