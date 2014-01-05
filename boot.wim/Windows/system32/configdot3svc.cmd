netcfg -e -c p -i MS_NDISUIO
netcfg -e -c p -i MS_NDISWAN
netcfg -e -c s -i MS_RASMAN
netcfg -e -c p -i MS_PPPOE
netcfg -c s -i ms_vwifi
netcfg -c s -i ms_nativewifip
netcfg -c s -i MS_Server
sc start Wlansvc
exit
