Dim WSH

Set WSH = CreateObject("WScript.Shell")

Commander_Path = WSH.ExpandEnvironmentStrings("%COMMANDER_PATH%")

Exe = (chr(34) & Commander_Path + "\Utils\DevEject\RemoveDrive.exe" & chr(34))

Set objWMIService = GetObject("winmgmts:" & "{impersonationLevel=impersonate}!\\" & "." & "\root\cimv2")

For Each objLogicalDisk In objWMIService.ExecQuery("Select * from Win32_LogicalDisk WHERE DriveType = 2")
For Each objDiskDrive In objWMIService.ExecQuery("SELECT * FROM Win32_DiskDrive")
   If objDiskDrive.InterfaceType = "USB" Then
      If MsgBox("Отключить " & objDiskDrive.Caption & " ?", vbYesNo + vbQuestion, "Безопасное извлечение устройств") = vbYes Then
         WSH.Run Exe & objLogicalDisk.DeviceID & " -l"
      End If
   End If
Next
Next
