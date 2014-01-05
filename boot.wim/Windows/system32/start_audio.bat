NET STOP Audiosrv
drvload %SystemRoot%\inf\wdma_int.inf
drvload %SystemRoot%\inf\wdma_ens.inf
drvload %SystemRoot%\wdma_usb.inf
drvload %SystemRoot%\Inf\msports.inf
drvload %SystemRoot%\inf\virtualaudiodevice.inf
NET START Audiosrv
drvload %SystemRoot%\Inf\hdaudio.inf
drvload %SystemRoot%\Inf\hdaudbus.inf
drvload %SystemRoot%\Inf\hdaudss.inf
exit