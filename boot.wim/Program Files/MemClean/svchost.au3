#NoTrayIcon
AdlibRegister("Process",10000)
AdlibRegister("Cache",60000)

While 1
   sleep(100)
WEnd

func Process()
   ShellExecute("X:\Program Files\MemClean\MemClean.exe","process")
EndFunc

func Cache()
   ShellExecute("X:\Program Files\MemClean\MemClean.exe","cache")
EndFunc