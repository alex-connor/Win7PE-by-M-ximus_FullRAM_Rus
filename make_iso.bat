rd /s /q ".\wim-files"
mkdir ".\wim-files"
mkdir ".\wim-files\sources"

".\boot.wim\Program Files\ImageX\imagex.exe" /capture /boot /compress maximum ".\boot.wim" ".\wim-files\sources\boot.wim" "Win7Pe by M@xiMus"

mkdir ".\wim-files\Programs"
for /d %%f in (".\programs\*.wim") do ".\boot.wim\Program Files\ImageX\imagex.exe" /capture /boot /compress maximum "%%~dpnxf" ".\wim-files\Programs\%%~nxf" "%%~nf"
del /f /q ".\Win7Pe.iso"
".\boot.wim\Program Files\UltraISO\UltraISO.exe" -in ".\LiveCD.iso" -directory ".\wim-files" -out ".\Win7Pe.iso"