netcfg -e -c p -i MS_NDISUIO
netcfg -c s -i ms_nativewifip
netcfg -c s -i MS_Server
sc start Wlansvc
exit
