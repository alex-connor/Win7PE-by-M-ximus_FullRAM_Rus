#cs ----------------------------------------------------------------------------
	
	AutoIt Version: 3.2.4.9
	Author:         Björn Kaiser <kaiser.bjoern@gmx.net>
	
	Script Function:
	wimgapi.dll wrapper
	
#ce ----------------------------------------------------------------------------

; function list
;===============================================================================
; 	_WIM_ApplyImage
;	_WIM_CaptureImage
; 	_WIM_CloseHandle
; 	_WIM_CreateFile
; 	_WIM_GetImageInformation
;	_WIM_LoadImage
;	_WIM_SetImageInformation
;	_WIM_SetTemporaryPath
;	_WIM_Shutdown
;	_WIM_Startup

#comments-start
	User Calltips:
	_WIM_CreateFile($sPath,[$dWIM_DesiredAccess],[$dWIM_CreationDisposition],[$dWIM_FlagsAndAttributes],[$dWIM_CompressionType],[$lWIM_CreationResult])
	_WIM_CaptureImage($hWIM,$sPath,[$dWIM_CaptureFlags])
	_WIM_ApplyImage($hImage,$sPath,[$dWIM_ApplyFlags])
	_WIM_LoadImage($hWIM,$dWIM_ImageIndex)
	_WIM_SetTemporaryPath($hWIM,$sPath)
	_WIM_CloseHandle($hObject)
	_WIM_StartUp()
	_WIM_Shutdown()
#comments-end

#include-once

#region ### START $wim_... constants ###
Global Const $wim_debug = 1
Global Const $wim_dll = @ProgramFilesDir & "\Windows AIK\Tools\x86\wimgapi.dll"
Global Const $wim_generic_read = 0x80000000
Global Const $wim_generic_write = 0x40000000
Global Const $wim_create_new = 0x00000001
Global Const $wim_create_always = 0x00000002
Global Const $wim_open_existing = 0x00000003
Global Const $wim_open_always = 0x00000004
Global Const $wim_compress_none = 0x00000000
Global Const $wim_compress_xpress = 0x00000001
Global Const $wim_compress_lzx = 0x00000002
Global Const $wim_created_new = 0x00000000
Global Const $wim_opened_existing = 0x00000001
Global Const $wim_flag_reserved = 0x00000001
Global Const $wim_flag_verify = 0x00000002
Global Const $wim_flag_index = 0x00000004
Global Const $wim_flag_no_apply = 0x00000008
Global Const $wim_flag_no_diracl = 0x00000010
Global Const $wim_flag_no_fileacl = 0x00000020
Global Const $wim_flag_share_write = 0x00000040
Global Const $wim_flag_fileinfo = 0x00000080
;~ Ursprünglich Integer Wert
Global Const $wim_flag_no_rp_fix = 0x00000064
;~ Aufgefüllte Werte
Global Const $wim_reference_append = 0x10000000
Global Const $wim_reference_replace = 0x20000000
;~ --
Global Const $wim_export_allow_duplicates = 0x00000001
Global Const $wim_export_only_resources = 0x00000002
Global Const $wim_export_only_metadata = 0x00000004
Global Const $invalid_callback_value = 0xFFFFFFFF
Global Const $wim_copy_file_retry = 0x1000000
Global Const $wim_msg_success = 0x00000000
Global Const $wim_msg_done = 0xFFFFFFF0
Global Const $wim_msg_skip_error = 0xFFFFFFFE
Global Const $wim_msg_abort_image = 0xFFFFFFFF
Global Const $wim_attribute_normal = 0x00000000
Global Const $wim_attribute_resource_only = 0x00000001
Global Const $wim_attribute_metadata_only = 0x00000002
Global Const $wim_attribute_verify_data = 0x00000004
Global Const $wim_attribute_rp_fix = 0x00000008
Global Const $wim_attribute_spanned = 0x00000010
Global Const $wim_attribute_readonly = 0x00000020
#endregion ### END $wim_... constants ###

Global $g_wimgapi = _WIM_Startup()


;===============================================================================
;
; Function Name:	_WIM_CreateFile
; Parameter(s):		$sPath - Path to the file to read/create
;					$iWIM_DesiredAccess - Optional, specify read/write/query access
;					default: $wim_generic_read
;					$iWIM_CreationDisposition - Optional, specifies how existing files are handled
;					default: $wim_open_always
;					$iWIM_FlagsAndAttributes - Optional, specifies actions to be taken for the file
;					default: $wim_flag_share_write
;					$iWIM_CompressionType - Optional, specifies the compression level for a newly created file
;					default: $wim_compress_xpress
;					$iWIM_CreationResult - Optional, pointer to a variable that receives the creation result
;					default: NULL
; Description:      Makes a new image file or opens an existing image file.
; Requirement:		None
; Return Value(s):  If the function succeeds, the return value is an open handle
;					to the specified image file. If the function fails, the
;					return value is NULL.
;
; @error Value(s):	1 - Error in DLLCall
;
; User CallTip:		_WIM_CreateFile($sPath,[$dWIM_DesiredAccess],[$dWIM_CreationDisposition],[$dWIM_FlagsAndAttributes],[$dWIM_CompressionType],[$lWIM_CreationResult])
; Author(s):
;
;===============================================================================
Func _WIM_CreateFile(Const $sPath, Const $WIM_DesiredAccess = 0x80000000, Const $WIM_CreationDisposition = 0x00000004, _
		$WIM_FlagsAndAttributes = 0x00000040, $WIM_CompressionType = 0x00000001, $WIM_CreationResult = "NULL")
	
	Local $hWIM, $create
	$create = DllCall($g_wimgapi, "int", "WIMCreateFile", "wstr", $sPath, "int", $WIM_DesiredAccess, _
			"int", $WIM_CreationDisposition, "int", $WIM_FlagsAndAttributes, "int", $WIM_CompressionType, "int", $WIM_CreationResult)
	If @error Then
		If $wim_debug Then ConsoleWriteError("_WIM_CreateFile error: " & @error & @CRLF)
		SetError(1)
	EndIf
	If $wim_debug Then
		ConsoleWrite("_WIM_CreateFile rc: " & $create[0] & @CRLF & _
				"UBound $create: " & UBound($create) & @CRLF)
	EndIf
	$hWIM = $create[0]
	Return $hWIM
EndFunc   ;==>_WIM_CreateFile


;===============================================================================
;
; Function Name:	_WIM_CaptureImage
; Parameter(s):		$hWIM - Handle as returned by _WIM_CreateFile
;					$sPath - Path to capture
; Description:      Captures an image from a directory path and stores it in an
;					image file.
; Requirement:		None
; Return Value(s):  If the function succeeds, then the return value is a handle
;					to an object representing the volume image. If the function
;					fails, then the return value is NULL.
; @error Value(s):	1 - Error in DLLCall
;
; User CallTip:		_WIM_CaptureImage($hWIM,$sPath,[$dWIM_CaptureFlags])
; Author(s):
;
;===============================================================================
Func _WIM_CaptureImage(Const $hWIM, Const $sPath, Const $WIM_CaptureFlags = 0x00000002)
	Local $capture
	$capture = DllCall($g_wimgapi, "int", "WIMCaptureImage", "ptr", $hWIM, "wstr", $sPath, "int", $WIM_CaptureFlags)
	If @error Then
		If $wim_debug Then ConsoleWriteError("_WIM_CaptureImage error: " & @error & @CRLF)
		SetError(1)
	EndIf
	If $wim_debug Then ConsoleWrite("_WIM_CaptureImage rc: " & $capture[0] & @CRLF)
	Return $capture[0]
EndFunc   ;==>_WIM_CaptureImage


;===============================================================================
;
; Function Name:	_WIM_ApplyImage
; Parameter(s):		$hImage - Handle as returned by _WIM_CreateFile or _WIM_CaptureImage
;					$sPath - Path to apply the image to
; Requirement:		None
; Return Value(s):  If the function succeeds, then the return value is nonzero.
;					If the function fails, then the return value is zero.
; Description:		Applies an image to a directory path from a Windows image
;					(.wim) file.
; @error Value(s):	1 - Error in DLLCall
;
; User CallTip:		_WIM_ApplyImage($hImage,$sPath,[$dWIM_ApplyFlags])
; Author(s):
;
;===============================================================================
Func _WIM_ApplyImage(Const $hImage, Const $sPath, Const $WIM_ApplyFlags = 0x00000004)
	Local $apply
	$apply = DllCall($g_wimgapi, "int", "WIMApplyImage", "ptr", $hImage, "wstr", $sPath, "int", $wim_flag_index)
	If @error Then
		If $wim_debug Then ConsoleWriteError("_WIM_ApplyImage error: " & @error & @CRLF)
		SetError(1)
	EndIf
	If $wim_debug Then ConsoleWrite("_WIM_ApplyImage rc: " & $apply[0] & @CRLF)
	Return $apply[0]
EndFunc   ;==>_WIM_ApplyImage


;===============================================================================
;
; Function Name:	_WIM_LoadImage
; Parameter(s):		$hWIM - Handle as returned by _WIM_CreateFile
;					$dImageIndex - Index of the image to load
; Requirement:		None
; Return Value(s):  If the function succeeds, then the return value is a handle to
;					an object representing the volume image. If the function fails,
;					then the return value is NULL.
; Description:		Loads a volume image from a Windows image (.wim) file
; @error Value(s):	1 - Error in DLLCall
;
; User CallTip:		_WIM_LoadImage($hWIM,$dWIM_ImageIndex)
; Author(s):
;
;===============================================================================
Func _WIM_LoadImage(Const $hWIM, Const $WIM_ImageIndex)
	Local $load
	$load = DllCall($g_wimgapi, "int", "WIMLoadImage", "ptr", $hWIM, "int", $WIM_ImageIndex)
	If @error Then
		If $wim_debug Then ConsoleWriteError("_WIM_LoadImage error: " & @error & @CRLF)
		SetError(1)
	EndIf
		If $wim_debug Then ConsoleWrite("_WIM_LoadImage rc: " & $load[0] & @CRLF)
	Return $load[0]
EndFunc   ;==>_WIM_LoadImage


;===============================================================================
;
; Function Name:	_WIM_SetTemporaryPath
; Parameter(s):		$hWIM - Handle as returned by _WIM_CreateFile
;					$sPath - The path where temporary image (.wim) files are to be stored during capture or application.
; Requirement:		None
; Return Value(s):  Returns nonzero if successful or NULL otherwise.
; Description:		Sets the location where temporary imaging files are to be stored.
; @error Value(s):	1 - Error in DLLCall
;
; User CallTip:		_WIM_SetTemporaryPath($hWIM,$sPath)
; Author(s):
;
;===============================================================================
Func _WIM_SetTemporaryPath(Const $hWIM, Const $sPath)
	Local $load
	$load = DllCall($g_wimgapi, "int", "WIMSetTemporaryPath", "ptr", $hWIM, "wstr", $sPath)
	If @error Then
		If $wim_debug Then ConsoleWriteError("_WIM_SetTemporaryPath error: " & @error & @CRLF)
		SetError(1)
	EndIf
	If $wim_debug Then ConsoleWrite("_WIM_SetTemporaryPath rc: " & $load[0] & @CRLF)
	Return $load[0]
EndFunc   ;==>_WIM_SetTemporaryPath


;===============================================================================
;
; Function Name:	_WIM_CloseHandle
; Parameter(s):		$hObject - Handle of a image-based object
; Requirement:		None
; Return Value(s):  If the function succeeds, the return value is nonzero.
;					If the function fails, the return value is zero.
; Description:		Closes an open Windows Imaging (.wim) file or image handle.
; @error Value(s):	1 - Error in DLLCall
;
; User CallTip:		_WIM_CloseHandle($hObject)
; Author(s):
;
;===============================================================================
Func _WIM_CloseHandle($hObject)
	Local $close
	$close = DllCall($g_wimgapi, "int", "WIMCloseHandle", "ptr", $hObject)
	If @error Then
		If $wim_debug Then ConsoleWriteError("_WIM_CloseHandle error: " & @error & @CRLF)
		SetError(1)
	EndIf
	If $wim_debug Then ConsoleWrite("_WIM_CloseHandle rc: " & $close[0] & @CRLF)
	Return $close[0]
EndFunc   ;==>_WIM_CloseHandle

;===============================================================================
;
; Function Name:	_WIM_RegisterMessageCallback
; Parameter(s):		$hWIM -
;					$
; Requirement:		None
; Return Value(s):  If the function succeeds, the return value is nonzero.
;					If the function fails, the return value is zero.
; Description:		Registers a function to be called with imaging-specific data.
; @error Value(s):	1 - Error in DLLCall
;
; User CallTip:		_WIM_RegisterMessageCallback($hWIM,$pWIM_MessageProc)
; Author(s):
;
;===============================================================================
Func _WIM_RegisterMessageCallback($hWIM, $WIM_MessageProc)
	Local $register
	$register = DllCall($g_wimgapi, "int", "WIMRegisterMessageCallback", "ptr", $hWIM, "ptr", $WIM_MessageProc, "int", "NULL")
	If @error Then
		If $wim_debug Then ConsoleWriteError("_WIM_RegisterMessageCallback error: " & @error & @CRLF)
		SetError(1)
	EndIf
	If $wim_debug Then ConsoleWrite("_WIM_RegisterMessageCallback rc: " & $register[0] & @CRLF)
	Return $register[0]
EndFunc   ;==>_WIM_RegisterMessageCallback


;===============================================================================
;
; Function Name:	_WIM_UnregisterMessageCallback
; Parameter(s):		$hObject - Handle of a image-based object
; Requirement:		None
; Return Value(s):  If the function succeeds, the return value is nonzero.
;					If the function fails, the return value is zero.
; Description:		Registers a function to be called with imaging-specific data.
; @error Value(s):	1 - Error in DLLCall
;
; User CallTip:		_WIM_UnregisterMessageCallback($hWIM,$pWIM_MessageProc)
; Author(s):
;
;===============================================================================
Func _WIM_UnregisterMessageCallback($hWIM, $WIM_MessageProc)
	Local $unregister
	$unregister = DllCall($g_wimgapi, "int", "WIMUnregisterMessageCallback", "ptr", $hWIM, "ptr", $WIM_MessageProc)
	If @error Then
		If $wim_debug Then ConsoleWriteError("_WIM_UnregisterMessageCallback error: " & @error & @CRLF)
		SetError(1)
	EndIf
	If $wim_debug Then ConsoleWrite("_WIM_UnregisterMessageCallback rc: " & $unregister[0] & @CRLF)
	Return $unregister[0]
EndFunc   ;==>_WIM_UnregisterMessageCallback


;===============================================================================
;
; Function Name:	_WIM_GetImageInformation
; Description:		Returns information about an image within the .wim
;					(Windows image) file.
; Return Value:
;					!!! NOT WORKING  ATM !!!
;===============================================================================
Func _WIM_GetImageInformation($wim_handle)
	Local $struct, $size, $rc_getinfo, $a_return[4], $xml
	$struct = DllStructCreate("ptr")
	$size = DllStructCreate("int structsize")
;~ 	DllStructSetData($size,1,DllStructGetSize($struct))
	$rc_getinfo = DllCall($g_wimgapi, "int", "WIMGetImageInformation", "ptr", $wim_handle, "ptr", DllStructGetPtr($struct), "ptr", DllStructGetPtr($size))
	If @error Then
		ConsoleWriteError("_WIM_GetImageInformation error: " & @error & @CRLF & "_WIM_GetImageInformation rc: " & $rc_getinfo & @CRLF)
		Return 0
	EndIf
	$xml = DllStructCreate("char [" & DllStructGetData($size, 1) & "]", DllStructGetData($struct, 1))
	$a_return[0] = DllStructGetData($struct, 1)
	$a_return[1] = DllStructGetData($size, 1)
	$a_return[2] = $rc_getinfo
	$a_return[3] = DllStructGetData($xml, 1)
	Return $a_return
EndFunc   ;==>_WIM_GetImageInformation


;===============================================================================
;
; Function Name:	_WIM_SetImageInformation
; Description:		Stores information about an image in the Windows image
;					(.wim) file.
; Return Value:
;					!!! NOT WORKING  ATM !!!
;===============================================================================
Func _WIM_SetImageInformation($wim_handle, $xml_pointer, $xml_size)
	Local $rc_setinfo, $a_return[4], $xml
	$rc_setinfo = DllCall($g_wimgapi, "int", "WIMSetImageInformation", "ptr", $wim_handle, "ptr", $xml_pointer, "ptr", $xml_size)
	If @error Then
		ConsoleWriteError("_WIM_GetImageInformation error: " & @error & @CRLF & "_WIM_SetImageInformation rc: " & $rc_setinfo & @CRLF)
		Return 0
	EndIf
	$a_return[0] = $rc_setinfo
	Return $a_return
EndFunc   ;==>_WIM_SetImageInformation


;===============================================================================
;
; Function Name:	_WIM_Startup
; Description:		Load wimgapi.dll
; Return Value:
;
;===============================================================================
Func _WIM_Startup()
	Local $wimgapi
	$wimgapi = DllOpen($wim_dll)
	If @error Then
		If $wim_debug Then ConsoleWriteError("_WIM_Startup error: " & @error & @CRLF)
		SetError(1)
	EndIf
	If $wim_debug Then ConsoleWrite("_WIM_Startup rc: " & $wimgapi & @CRLF)
	Return $wimgapi
EndFunc   ;==>_WIM_Startup


;===============================================================================
;
; Function Name:	_WIM_Shutdown
; Description:		Unload wimgapi.dll
; Return Value:
;
;===============================================================================
Func _WIM_Shutdown()
	Local $rc_close
	$rc_close = DllClose($g_wimgapi)
	If @error Then
		If $wim_debug Then ConsoleWriteError("_WIM_Shutdown error: " & @error & @CRLF)
		SetError(1)
	EndIf
	If $wim_debug Then ConsoleWrite("_WIM_Shutdown rc: " & $rc_close & @CRLF)
	Return $rc_close
EndFunc   ;==>_WIM_Shutdown