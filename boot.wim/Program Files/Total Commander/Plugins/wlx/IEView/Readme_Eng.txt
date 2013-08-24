IEView 1.94a lister-plugin
for Total Commander 5.x-new for Win32
Freeware
-------------------------------------


   Description
   -----------

IE-based file viewer plugin for Total Commander

This plugin shuld be used only if the computer is powerful enough, otherwise delays may be
pretty significant. The plugin uses MS WebBrowser control to view files, so it automatically
supports all formats which IE supports. This includes, of course, native to IE file types like
HTML/XML, many MS Office file types if you have the MS Office installed, PDF through AcrobatReader/IE
integration, all the formats Quick View Plus supports if you have the QVP installed, and so on.
Even more, if you enable this plugin to open directories, then in QuickView mode
select a directory, the second panel magically becomes fully functional Windows Explorer 8-)

WARNING: Since HTML and MS Office files can contain macros or scripts, measures must be taken
to prevent possible script/macro viruses from working. By default, scripting is disabled in the IEView.ini file.
If you enable scripting, then make sure a good antivirus program is installed on your system, or DO NOT use
IEView for viewing files of unknown origin that can contain malicious scripts or macros.


   Installation
   ------------

Copy ieview.wlx and ieview.ini files into your Total Commander plugins directory,
and add the following line to [ListerPlugins] section in the wincmd.ini file:

0=C:\wincmd\plugins\ieview.wlx

(Be sure to substitute actual path to the ieview.wlx file!). Restart the Total Commander.


   Controls
   --------

  Keys of management most IEView (tune in/are defined in sections [IEViewHotkeys] ieview.ini):
Back - back on page/upwards on directory (in HTML or directory).
(keys: Z or Backspace or Alt+Left)
Forward - onward on page/downwards on the last directory (in HTML or directory).
(keys: X or Alt+Right)
GetFocus - save class current window in ieview.ini -> [FocusLog]. Can be useful if you use ActiveX Control for viewing the certain format, and do not know what the window of the document is identified, for installing the correct interception of the focus.
(keys: Alt+L)

  The Standard keys Lister (work in IEView):
(if in sections [Hotkeys] ieview.ini, option TranslateHotkeys=1)
N - a following file
P - a previous file
Ctrl+A - select all
Ctrl+C or Ctrl+Insert - copy chosenned text
Ctrl+P - a print
Tab - go, in mode QuickView mode, on file panel
Ctrl+Q - close, in mode QuickView mode, QuickView panel, and move to file panel
Esc - close window IEView
The Modes of the image of the file:
1 - Text only
2 - Binary
3 - Hex
4 - IEView (by default)
5 - HTML text (strip tags)
6 - Unicode
7 - UTF-8

  The Individual keys of some programs:
(work in IEView through programs used for work with file):

  Internet Explorer:
  (ôàéëû .htm;.html;.shtml;.plg;.mht;.xml;.xsl;.php;.php2;.php3)
Home - in beginning
End - in end
PgUp - upwards through visible region
PgDown - downwards through visible region
Up - upwards
Down - downwards
Scroll mouse - a vertical rolling of the page
Ctrl+Scroll mouse - change size a font
Left key mouse - open specified document on reference
Shift+F10 or Key menu or Ruling key mouse - open contextual menu
Ctrl+F - Search for text...

  Explorer:
  (directory)
Home - in beginning
End - in end
PgUp - upwards through group
PgDown - downwards through group
Up - upwards
Down - downwards
Scroll mouse - a vertical rolling
Enter or Left key mouse - open specified file or directory
Alt+Enter - "Characteristic" specified file or directory...
Shift+F10 or Key menu or Ruling key mouse - open contextual menu

  Microsoft Word
  (files .doc;.dot;.wbk;.wps)
Ctrl+Home - in beginning
Ctrl+End - in end
PgUp - upwards through visible region
PgDown - downwards through visible region
Up - upwards
Down - downwards
Shift+F10 or Key menu or Ruling key mouse - open contextual menu

  Microsoft Excel
  (files .xls)
Ctrl+Home - in beginning
Ctrl+End - in end
PgUp - upwards through visible region
PgDown - downwards through visible region
Up - upwards
Down - downwards
Shift+F10 or Key menu or Ruling key mouse - open contextual menu

  Acrobat Reader:
  (files .pdf)
Home - in beginning
End - in end
PgUp - upwards through visible region
PgDown - downwards through visible region
Up - upwards
Down - downwards
Right - open necessary page of the document
Left - open previous page of the document
Left key+mouse - move on page and document
Scroll mouse - a vertical scrolling
Shift+F10 or Key menu or Ruling key mouse - open contextual menu
Shift+Right - to the right (horizontal scrolling)
Shift+Left - to the left (horizontal scrolling)
Shift+Ctrl+N - Move to page...
Shift+Ctrl+H - start/stop automatic scrolling
Ctrl+L - hide/show all elements to navigations (all panels)
Ctrl+F - open left, lateral panel of the tasks, as "Search for text"
F4 - show/hide left, lateral panel of the tasks
F6 - show/hide shift to the right, lateral panel to navigations
F1 - a Reference Acrobat Reader...
Ctrl+M - Change the scale...
Ctrl+0 - show whole current page of the document
Ctrl+1 - a real size of the page of the document
Ctrl+2 - fill page on width window
Ctrl+Num+ - enlarge scale
Ctrl+Num- - reduce scale
Ctrl+D - a Characteristic of the document...
Ctrl+K - an Adjustment Acrobat Reader...
Ctrl+P - a Print the document...
Shift+Ctrl+S - Save the copy of the document...
Shift+Ctrl+A - remove highlighting
(Some of the keys, possible, will not work in old version Acrobat Reader. For instance 4.0, and more early.)

  DjVu Browser Plugin
  (files .djvu;.djv)
Home - in beginning
End - in end
PgUp - upwards through visible regionõ
PgDown - downwards through visible region
Up - upwards on page
Down - down page
Right - to the right on page
Left - to the left on page
Space - open necessary page of the document
BackSpace - open previous page of the document
Left key+mouse - move on page only
Num+ - enlarge scale
Num- - reduce scale
Keep Ctrl - show magnifying glass
Ctrl+1 - show magnifying glass constantly
Ctrl+Ëåâàÿ key mouse - switch off magnifying glass (not to show)
Shift+F10 or Key menu or Ruling key mouse - open contextual menu

  (In IEView also work the individual keys of control of the other programs, used IEView (through ActiveX) for work with file.


   Known problems and Limitations
   ------------------------------
- May be pretty slow on slow machines, or when there is not enough memory
- When viewing some files with Ctrl+Q, focus may "flee" from the panel. To fix the problem, set appropriate values in the [BlockFocus] section.
- Though in some cases it is possible to edit the file being viewed, changes are not saved.
  In general, there might be some strange behavior if, for example, a Word file is viewed
  and the user opens another instance of the MS Word. But nothing serious, though.


   History
   -------
Beta 1 (unknown)
  The most first version IEView ("Y. Gershanov").
Beta 2 (1.12.2002)
- extensions are now case-insensitive
- added protection against wrong file formats (like text files with .doc or .pdf extension)
- displaying of directories is now optional
Beta 3 (3.12.2002)
- Extensions for directories are not checked now.
- Fixed many issues mostly related to focus and hotkey handling.
- Esc handling is fixed
- Print, ProvFile, NextFile, Search hotkeys work now
- Search (Ctrl-F) is now operational in the IE window as well
- INI file: replaced ShowUpDir with IgnoreDirs (may be useful for future pugins that work with directories)
Beta 4 (17.12.2002)
- Fixed crash on exit under Win98/ME
- Fixed some resource-related problems
- Added control over what HTML elements IEView loads and displays
- Added optional blocking of display of the .. directory
1.0 (22.08.2004)
  Last, final version ("Y. Gershanov").
(Author has stopped the most further work.)

   New history
   -----------
1.1 (31.08.2004 )
  First version new IEView ("Rk" under editing "Konstantin")
(Thank you "Rk" and "Konstantin" for continuation of the work.)
- corrected focus Acrobat Reader (not for all version completely correct).
- not it is necessary to clique mouse for interception of the focus web-files (not always works). (Ctrl+Q - press Tab, F3 - automatically.)
1.2 (3.09.2004)
- Is Corrected mistake of the interception of the focus.
(Mistake is Added. When viewing directory (QuickView mode), cursor disappears from file panel.)
1.3 (9.09.2004)
- Is Corrected error. When viewing directory (QuickView mode), cursor does not disappear from file panel.
1.4 (15.09.2004)
- Is Corrected interception of the focus in Word,Excel.
- Is Corrected loss of the focus in Word Splash.
- Is Added interception of the focus when viewing directory (QuickView mode).
- In ieview.ini is added adjusting the focus: Key FocusByWindowClass, Key UseMiddleWhenFocusByPoint, Section [WindowClasses].
1.5 (18.09.2004)
- Is Corrected loss of the focus when viewing directory and PDF. (The Incorrect interception of the focus Acrobat Reader 6.0 until it is corrected.)
- Now on directory and HTML possible to move by means of Backspace, Z (back), X (onward).
- Is Added determination of the file on type, rather then only on extension (only HTML). (In section [Signatures] ieview.ini is added key %=... He is used if filename does not correspond to the extensions in sections [Extentions]. For instance "index.xml.ru" or "index.php@id=dif&page=8".)
1.6 (19.09.2004)
- Is Corrected focus when change the mode of the showing the file (if press '1 when viewing PDF).
- Is Corrected focus in file, opened on [Signatures] %=... (determination file on type)
- In ieview.ini is added key CaseInsensitiveSignatures and key ListerTitle (Style of IEView WindowText).
1.7 (22.09.2004)
- bug with ListerTitle=1 fixed. (Note.: Works only with html files, since there is no concept 'Title' for arbitrary document.)
- Hotkey added: Ctrl+L.
- Section added [BlockFocus].
1.8 (24.09.2004)
- some more bugfixes connected with focus.
- [Hotkeys] section renamed to [TranslationHotkeys].
- Section added: [IEViewHotkeys].
1.9 (2.10.2004)
- ListerTitle is string with specifiers %TITLE, %DRIVE, %DIR, %NAME, %EXT.
- Focus processing method changed.
- Values in [BlockFocus] section are set as "group=0/1", instead of "ext=count".
- Added CHM files support.
1.91 (10.10.2004)
- CHM support extended
- Key added: [options] Silent
- Fixed: Excel didn't finish correctly when viewing xls files
- Fixed: Many IE windows opened, when viewing html file
- Quick View title changes, when navigating html file or folder
1.91a (13.10.2004)
- some bugfixes
- Hotkeys added: Stop, Refresh
1.92 (29.11.2004)
- Searching with F3/F7 in HTML files
- [Signatures]->"%" key replaced with [DefaultSignatures] section and [options]->"CheckDefaultSignatures" key
- bugfixes
1.93 (10.02.2005)
- StatusBar
- "RemoveImages", "CmdFind" hotkeys
- bugfixes
1.94 (18.06.2005)
- Keys removed: NoFocusChange, BlockParentDir
- Keys added: [Extensions]->WordToHTML, [Extensions]->WordToMHT, [options]->StatusBarInQuickView,
  [options]->SavePositionOnExit, [options]->AllowPopups.
- Hotkey added: SavePosition
- Word files are opened read-only
- bugfixes
1.94a (14.07.2005)
- bugfixes
- FocusByWindowClass and UseMiddleWhenFocusByPoint keys moved to the [Debug] section

   chmlib v0.3 by Jed Wing is used to decompress CHM files. 


   Author extended ReadMe and file ieview_rus.ini
   ----------------------------------------------
   "AnexeR"

   Author
   ------
   "Yuri Gershanov"

   New author
   ----------
   "Rk" (first versions with "Konstantin Vlasov")
