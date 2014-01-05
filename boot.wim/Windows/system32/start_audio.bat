NET STOP Audiosrv
drvload %SystemRoot%\Inf\msports.inf
drvload %SystemRoot%\Inf\hdaudio.inf
drvload %SystemRoot%\Inf\hdaudbus.inf
drvload %SystemRoot%\inf\virtualaudiodevice.inf
drvload %SystemRoot%\inf\wdma_int.inf
drvload %SystemRoot%\inf\wdma_ens.inf
drvload %SystemRoot%\wdma_usb.inf
NET START Audiosrv
exit