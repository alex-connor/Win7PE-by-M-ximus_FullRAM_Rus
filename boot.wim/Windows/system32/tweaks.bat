regedit /s Y:\sources\reg\sys.reg
regedit /s Y:\sources\reg\software.reg
"X:\Program Files\7-Zip\7z.exe" -o "y:\sources\programs.wim" "x:\program files"
regsvr32 /s Query.dll
regsvr32 /s "X:\Program Files\HashTab\HashTab32.dll"
exit