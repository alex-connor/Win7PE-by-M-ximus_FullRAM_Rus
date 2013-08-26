unit BaseUtils;

interface

uses
  Windows;

function TextInClipboard: string;
procedure SetClipboard(Format: Cardinal; const Buffer; Size: Integer);

procedure SimulateKeystroke(VK: Byte);
procedure TurnOffFeedbackCursor;

type
  TKbLEDIndex = (kbledScroll, kbledNum, kbledCaps);

procedure ToggleKbLED(LEDIndex: TKbLEDIndex);

implementation

function TextInClipboard: string;
var
  Data: THandle;
begin
  OpenClipboard(0);
  Data := GetClipboardData(CF_TEXT);
  try
    if Data <> 0 then
      Result := PChar(GlobalLock(Data))
    else
      Result := '';
  finally
    if Data <> 0 then
      GlobalUnlock(Data);
    CloseClipboard;
  end;
end;

procedure SetClipboard(Format: Cardinal; const Buffer; Size: Integer);
var
  Data: THandle;
  DataPtr: Pointer;
begin
  OpenClipboard(0);
  EmptyClipboard;
  OpenClipboard(0);
  try
    Data := GlobalAlloc(GMEM_MOVEABLE + GMEM_DDESHARE, Size);
    try
      DataPtr := GlobalLock(Data);
      try
        Move(Buffer, DataPtr^, Size);
        SetClipboardData(Format, Data);
      finally
        GlobalUnlock(Data);
      end;
    except
      GlobalFree(Data);
      raise;
    end;
  finally
    CloseClipboard;
  end;
end;

procedure SimulateKeystroke(VK: Byte);
begin
  keybd_event(VK, 0, 0, 0);
  keybd_event(VK, 0, KEYEVENTF_KEYUP, 0);
end;

procedure TurnOffFeedbackCursor;
var
  Msg: TMsg;
begin
  if PostThreadMessage(GetCurrentThreadId, 0, 0, 0) then
    GetMessage(Msg, 0, 0, 0);
end;

procedure ToggleKbLED(LEDIndex: TKbLEDIndex);

  procedure SimulateLockKeyEvent(UpFlag: Cardinal = 0);
  const
    VKCodes: array[TKbLEDIndex] of Byte = (VK_SCROLL, VK_NUMLOCK, VK_CAPITAL);
    ScanCodes: array[TKbLEDIndex] of Byte = ($46, $45, $3A);
    ExKeyFlags: array[TKbLEDIndex] of Cardinal = (0, KEYEVENTF_EXTENDEDKEY, 0);
  begin
    keybd_event(VKCodes[LEDIndex], ScanCodes[LEDIndex], ExKeyFlags[LEDIndex] or
      UpFlag, 0);
  end;

begin
  SimulateLockKeyEvent;
  SimulateLockKeyEvent(KEYEVENTF_KEYUP);
end;

(* HW routine that works only for DIN keyboards
const
  IOCTL_KEYBOARD_SET_INDICATORS   = $B0008;
  IOCTL_KEYBOARD_QUERY_INDICATORS = $B0040;
type
  TKeyboardIndicatorParameters = record
    UnitId: Word;
    LedFlags: Word;
  end;
var
  kip: TKeyboardIndicatorParameters;
  Dummy: Cardinal;
  h: THandle;
begin
  DefineDosDevice(DDD_RAW_TARGET_PATH, 'Keybd', '\Device\KeyboardClass0');
  h := CreateFile('\\.\Keyboard', 0, FILE_SHARE_READ or FILE_SHARE_WRITE, nil,
    OPEN_EXISTING, 0, 0);
  DefineDosDevice(DDD_REMOVE_DEFINITION, 'Keybd', nil);
  DeviceIoControl(h, IOCTL_KEYBOARD_SET_INDICATORS, @kip, SizeOf(kip), nil, 0,
    Dummy, nil);
  CloseHandle(h);
*)

end.
