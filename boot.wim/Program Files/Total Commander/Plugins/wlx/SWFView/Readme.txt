SWFView v 1.3.3

Lister plugin for Total Commander 5.51 or later for view Flash SWF files.


*** Features ***

- real crop (window background) color setting for Show All, No Scale and Fit Big Only modes;
- can start in Show All, No Border, Exact Fit, No Scale or Fit Big Only modes;
- full screen view;
- only one Flash FSCommand processed - "quit".


*** Keyboard shortcuts ***

F - change fit mode;
Space - hide/show play controls and status bar;
Enter - play/pause;
Alt+Enter/Middle mouse click - full screen on/off;
L - Loop off/on;
G - Go to frame dialog;
Ctrl+Left/Ctrl+Right step frame back/forward;
PgUp/PgDown & Ctrl+Up/Ctrl+Down skip 50 & 20 frames;
ScrollLock - enable/disable mode "I Want Play with Flash!";
Q - change movie quality.


*** Installing ***

 * TC 5.51 * 

1. Unpack files from archive to the your plugins folder;
2. Select in TC menu Configuration - Options;
3. Open "Edit/View" page;
4. Press button "Configure internal viewer";
5. Press button "LS-Plugins";
6. Press button "Add" and select SWFView.wlx;
7. Press "OK".

 * TC 6.5 or later *

This version of TC has "auto install plugin" feature. Just enter to archive with plugin and TC ask you about plugin installing. 


*** License agrement ***

  This software provided "AS-IS" without warranty of any kind for non-commercial use only.


*** Changes history ***

Ver 1.0:
 * initial release.

Ver 1.1:
 * some bugs fixed;
 + new bugs added;
 * DetectString changed to 'MULTIMEDIA & ext="SWF"';
 + put Flash.ocx to the plugin directory and if Flash not installed on your computer plugin try install it;
 + L button off/on loop;
 + option "Don't crop" for view all [objects] (non Stage) in Show All and No Scale modes;
 + option "I Want Play with Flash!" trap all keys excluding Escape (click on Flash first).

Ver 1.2:
 * new bugs fixed;
 + newest bugs added;
 + compatible with SA Lister;
 * scripts not allowed by default and always disabled in QView (for processing "quit" command you need enable scripts first);
 + option "Allow Flash Script Access" enable/disable Flash scripts;
 + option "Track Frames Manually" for view current frame when slider is moved (right click in this case reset track bar position).

Ver 1.2.1:
 * newest bugs fixed;
 + "Go to Frame" dialog (G button);
 * some internal changes.

Ver 1.2.2:
 + new view mode "Fit Big Only";
 + click on slider changes current movie position as video players do;
 + Ctrl+Left/Ctrl+Right step frame back/forward;
 + PgUp/PgDown & Ctrl+Up/Ctrl+Down skip 50 & 20 frames;
 * some internal changes and bug fixes.

Ver 1.2.2.2:
 * fix loop mode change by pressing "F" button;
 * load settings only when first start of plugin;
 * some internal changes.

Ver 1.3:
 + play Flash projector (EXE) files;
 * DetectString changed to 'MULTIMEDIA & ext="SWF" | ext="EXE"';
 + can run in fullscreen mode;
 + change view mode when go to fullscreen;
 + ScrollLock key - enable/disable mode "I Want Play with Flash!";
 * some internal changes and bug fixes.

Ver 1.3.1:
 + "Set Window Size To Movie Size" option;
 * some internal changes and bug fixes.

Ver 1.3.2:
 * DetectString changed to 'MULTIMEDIA & ext="SWF" | (force & ext="EXE")';
 + Medium quality;
 + button Q changes quality;
 + Copy Frame to Clipboard menu item;
 * some internal changes and bug fixes.


Ver 1.3.3:
 * some fixes in "Set Window Size To Movie Size" option;
 - removed support of SA Lister, write InitOLE=1 to plugin ini file to enable SA Lister support back;
 + removed flickering in Quick view mode when cursor goes to next file (TC 7 and up);
 * some internal changes and bug fixes.


---
Suggestions, Wishes and bug reports are welcome!
ProgMan13, (ProgMan13@mail.ru)