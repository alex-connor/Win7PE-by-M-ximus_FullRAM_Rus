rd /s /q ".\wim-files"
mkdir ".\wim-files"
mkdir ".\wim-files\sources"
mkdir ".\wim-files\Programs"

".\boot.wim\Program Files\ImageX\imagex.exe" /capture /boot /compress maximum ".\boot.wim" ".\wim-files\sources\boot.wim" "Win7Pe by M@xiMus"


cd ".\Programs"
for /d %%f in (*) do move /y "%%~dpnxf" "%%~dpnf"
for %%f in (*.shl) do move /y "%%~dpnxf" "%%~dpnf.shl_"
".\ShCache.exe"
for /d %%f in (*) do move /y "%%~dpnxf" "%%~dpnxf.wim"
del /f /y ".\ShCache.idx_"
move /y ".\ShCache.idx" ".\ShCache.idx_"
for %%f in (*.shl_) do move /y "%%~dpnxf" "%%~dpnf.shl"
cd ".."

for /d %%f in (".\programs\*.wim") do ".\boot.wim\Program Files\ImageX\imagex.exe" /capture /boot /compress maximum "%%~dpnxf" ".\wim-files\Programs\%%~nxf" "%%~nf"
copy /y ".\Programs\ShCache.i*" ".\wim-files\Programs"

del /f /q ".\Win7Pe.iso"

".\boot.wim\Program Files\UltraISO\UltraISO.exe" -in ".\LiveCD.iso" -directory ".\wim-files" -out ".\Win7Pe.iso"