program SpecChar;

uses
  Windows, Messages, BaseUtils;

var
  Sequences: array[Byte] of WideString;

function CreateCharMenu: HMENU;
var
  F: file;
  UnicodeSign: WideChar;
  Chars: array[0..1023] of WideChar;
  I, Count, SeqCount, StopPos, SkipBack: Integer;
  Sequence, NewCol: Boolean;
  S: WideString;
  ErrorStr: string;

  procedure AppendItem(ID: Cardinal; const Text: WideString);
  begin
    AppendMenuW(Result, Ord(NewCol) * MF_MENUBARBREAK, ID, PWideChar(Text));
    NewCol := False;
  end;

begin
  AssignFile(F, 'Chars.ini');
  FileMode := 0;
{$I-}
  Reset(F, 2);
  if IOResult = 0 then
  begin
    BlockRead(F, UnicodeSign, 1);
    if (IOResult = 0) or (UnicodeSign = #$FEFF) then
    begin
      BlockRead(F, Chars, Length(Chars), Count);
      if Count = 0 then
        ErrorStr := 'is empty';
    end
    else
      ErrorStr := 'is not Unicode';
    CloseFile(F);
  end
  else
    ErrorStr := 'miss';
{$I+}
  Result := CreatePopupMenu;
  Sequence := False;
  SeqCount := 0;
  NewCol := False;
  StopPos := -1; // due to blind compiler
  if ErrorStr = '' then
    for I := 0 to Count - 1 do
      if Sequence then
        if (Chars[I] = '}') and ((I = Count - 1) or (Chars[I + 1] <> '}')) then
        begin
          Sequence := False;
          if SeqCount < Length(Sequences) then
          begin
            if StopPos >= 0 then
              SkipBack := Length(S) - StopPos
            else
              SkipBack := 0;
            Sequences[SeqCount] := S;
            AppendItem($10000 or SeqCount or SkipBack shl 8, S);
            Inc(SeqCount);
          end;
        end
        else
          if (Chars[I] = '^') and (StopPos = -1) then
            StopPos := Length(S)
          else
            S := S + Chars[I]
      else                        
        case Chars[I] of
          '{':
            begin
              Sequence := True;
              StopPos := -1;
              S := '';
            end;
          '|': AppendMenuW(Result, MF_SEPARATOR, 0, nil);
          #10, #13: NewCol := True;
        else
          AppendItem(Ord(Chars[I]), Chars[I]);
        end
  else
    AppendItem(0, 'Special characters ini-file ' + ErrorStr);
end;

var
  ForeWnd: HWND;
  MenuDisplay: Boolean;

function WindowProc(Wnd: HWND; Msg: Cardinal; WParam, LParam: Longint): Longint;
  stdcall;
var
  S: WideString;
  I: Integer;
  Menu: HMENU;
  P: TPoint;
begin
  Result := 0;
  case Msg of
    WM_COMMAND:
      if WParam > 0 then
      begin
        if WParam < $10000 then
          SetClipboard(CF_UNICODETEXT, WParam, 4)
        else
        begin
          S := Sequences[WParam and $FF];
          SetClipboard(CF_UNICODETEXT, PWideChar(S)^, (Length(S) + 1) * 2);
        end;
        SetForegroundWindow(ForeWnd);
        keybd_event(VK_CONTROL, 0, 0, 0);
        SimulateKeystroke(Ord('V'));
        keybd_event(VK_CONTROL, 0, KEYEVENTF_KEYUP, 0);
        if WParam >= $10000 then
          for I := 1 to WParam shr 8 and $FF do
            SimulateKeystroke(VK_LEFT);
      end;
    WM_HOTKEY:
      if MenuDisplay then
        EndMenu
      else
      begin
        Menu := CreateCharMenu;
        GetCursorPos(P);
        ForeWnd := GetForegroundWindow;
        SetForegroundWindow(Wnd);
        MenuDisplay := True;
        try
          TrackPopupMenu(Menu, TPM_CENTERALIGN, P.X, P.Y, 0, Wnd, nil);
        finally
          MenuDisplay := False;
          SetForegroundWindow(ForeWnd);
        end;
        DestroyMenu(Menu);
      end;
  else
    Result := DefWindowProc(Wnd, Msg, WParam, LParam);
  end;
end;

var
  Mutex: THandle;
  Cls: WNDCLASS = (lpfnWndProc: @WindowProc; lpszClassName: 'AppWin');
  Wnd: HWND;
  Msg: TMsg;
begin
  Mutex := CreateMutex(nil, True, 'SpecChar_Running');
  if WaitForSingleObject(Mutex, 0) = WAIT_OBJECT_0 then
  begin
    Cls.hInstance := HInstance;
    Windows.RegisterClass(Cls);
    Wnd := CreateWindow(Cls.lpszClassName, '', WS_POPUP, 0, 0, 0, 0, 0, 0,
      HInstance, nil);
    RegisterHotKey(Wnd, 0, MOD_WIN, Ord('C'));
    while GetMessage(Msg, 0, 0, 0) do
      DispatchMessage(Msg);
    UnregisterHotKey(Wnd, 0);
    DestroyWindow(Wnd);
  end;
  CloseHandle(Mutex);
end.
