#cs
    Func DisplayChangeDPI($dpi)
    {
    DEVMODE DevM;
    long ret;
    
    EnumDisplaySettings(NULL,0,&DevM);
    
    DevM.dmFields = DM_LOGPIXELS;
    DevM.dmLogPixels = dpi;
    
    ret = ChangeDisplaySettings(&DevM, CDS_TEST);
    
    switch(ret)
    {
    case DISP_CHANGE_RESTART:
    return 2;
    case DISP_CHANGE_SUCCESSFUL:
    ChangeDisplaySettings(&DevM, CDS_UPDATEREGISTRY);
    SendMessage(HWND_BROADCAST, WM_DISPLAYCHANGE, (WPARAM)DevM.dmBitsPerPel, (LPARAM)(DevM.dmPelsHeight * 2 ^ 16 + DevM.dmPelsWidth));
    return 1;
    default:
    return 0;
    }
    }
#ce

Opt("MustDeclareVars", 1)

Func DisplayEnumRes($index, ByRef $width, ByRef $height, ByRef $bpp, ByRef $freq)
    Local $DEVMODE = DllStructCreate("byte[32];int[10];byte[32];int[6]")
    
    Local $b = DllCall("user32.dll", "int", "EnumDisplaySettings", "ptr", 0, "long", $index, "ptr", DllStructGetPtr($DEVMODE))
    
    If @error Then
        $b = 0
    Else
        $b = $b[0]
    EndIf
    
    If $b <> 0 Then
        $width = DllStructGetData($DEVMODE, 4, 2)
        $height = DllStructGetData($DEVMODE, 4, 3)
        $bpp = DllStructGetData($DEVMODE, 4, 1)
        $freq = DllStructGetData($DEVMODE, 4, 5)
    EndIf
    
    $DEVMODE = 0
    
    Return $b
EndFunc  ;==>DisplayEnumRes

Func DisplayChangeRes($width, $height, $bpp, $freq)
    Local Const $DM_PELSWIDTH = 0x00080000
    Local Const $DM_PELSHEIGHT = 0x00100000
    Local Const $DM_BITSPERPEL = 0x00040000
    Local Const $DM_DISPLAYFREQUENCY = 0x00400000
    Local Const $CDS_TEST = 0x00000002
    Local Const $CDS_UPDATEREGISTRY = 0x00000001
    Local Const $DISP_CHANGE_RESTART = 1
    Local Const $DISP_CHANGE_SUCCESSFUL = 0
    Local Const $HWND_BROADCAST = 0xffff
    Local Const $WM_DISPLAYCHANGE = 0x007E
    
    Local $DEVMODE = DllStructCreate("byte[32];int[10];byte[32];int[6]")
    
    Local $b = DllCall("user32.dll", "int", "EnumDisplaySettings", "ptr", 0, "long", 0, "ptr", DllStructGetPtr($DEVMODE))
    If @error Then
        $b = 0
    Else
        $b = $b[0]
    EndIf
    If $b <> 0 Then
        DllStructSetData($DEVMODE, 2, BitOR($DM_PELSWIDTH, $DM_PELSHEIGHT, $DM_BITSPERPEL, $DM_DISPLAYFREQUENCY), 5)
        DllStructSetData($DEVMODE, 4, $width, 2)
        DllStructSetData($DEVMODE, 4, $height, 3)
        DllStructSetData($DEVMODE, 4, $bpp, 1)
        DllStructSetData($DEVMODE, 4, $freq, 5)
        
        $b = DllCall("user32.dll", "int", "ChangeDisplaySettings", "ptr", DllStructGetPtr($DEVMODE), "int", $CDS_TEST)
        
        If @error Then
            $b = -1
        Else
            $b = $b[0]
        EndIf
        
        Select
            Case $b = $DISP_CHANGE_RESTART
                $DEVMODE = 0
                Return 2
            Case $b = $DISP_CHANGE_SUCCESSFUL
                DllCall("user32.dll", "int", "ChangeDisplaySettings", "ptr", DllStructGetPtr($DEVMODE), "int", $CDS_UPDATEREGISTRY)
                DllCall("user32.dll", "int", "SendMessage", "hwnd", $HWND_BROADCAST, "int", $WM_DISPLAYCHANGE, _
                        "int", $bpp, "int", $height * 2 ^ 16 + $width)
                $DEVMODE = 0
                Return 1
            Case Else
                $DEVMODE = 0
                Return $b
        EndSelect
    EndIf
EndFunc  ;==>DisplayChangeRes