Start /wait regedit /s clid.reg
devcon.exe install "x:\windows\inf\disk.inf"
DrvLoad.exe "x:\windows\inf\hal.inf"
DrvLoad.exe "x:\windows\inf\acpi.inf"
DrvLoad.exe "x:\windows\inf\usb.inf"
DrvLoad.exe "x:\windows\inf\usbstor.inf"
DrvLoad.exe "x:\windows\inf\disk.inf"
DrvLoad.exe "x:\windows\inf\volume.inf"
