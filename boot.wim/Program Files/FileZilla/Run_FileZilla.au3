#NoTrayIcon

$AppData = RegRead("HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders","AppData")

If ((Not FileExists($AppData & "\FileZilla\filezilla.xml")) And FileExists(@ScriptDir & "\settings\filezilla.xml")) Then
  FileCopy(@ScriptDir & "\settings\filezilla.xml",$AppData & "\FileZilla\",9)
  FileSetAttrib($AppData & "\FileZilla\filezilla.xml", "-R")
EndIf

If ((Not FileExists($AppData & "\FileZilla\sitemanager.xml")) And FileExists(@ScriptDir & "\settings\sitemanager.xml")) Then
  FileCopy(@ScriptDir & "\settings\sitemanager.xml",$AppData & "\FileZilla\",9)
  FileSetAttrib($AppData & "\FileZilla\sitemanager.xml", "-R")
EndIf

Run(@ScriptDir & '\filezilla.exe')

