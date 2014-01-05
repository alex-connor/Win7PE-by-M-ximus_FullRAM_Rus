drvload %SystemRoot%\inf\wifimanio.inf
drvload %SystemRoot%\inf\net8192cu.inf
drvload %SystemRoot%\inf\netnwifi.inf
drvload %SystemRoot%\inf\netrndis.inf
drvload %SystemRoot%\inf\nettcpip.inf
drvload %SystemRoot%\inf\netvwifibus.inf
drvload %SystemRoot%\inf\ndisuio.inf
netcfg -winpe
netcfg -e -c p -i MS_NDISUIO
netcfg -c s -i ms_nativewifip
sc start wlansvc
