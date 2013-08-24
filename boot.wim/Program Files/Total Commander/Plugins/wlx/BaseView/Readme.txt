BaseView 1.2 Freeware (Formerly DBF View)
----------------------
Lister plugin for Total Commander

Allows to view and edit dBase and FoxPro files (*.dbf)

Main features:
--------------
- View/edit of table data
- No need in additional libraries/packages (like BDE, ODBC, ADO)
- ANSI and OEM charsets support
- View/edit of MEMO-fields
- View/recovery of deleted rows
- Search by selected field or by all fields
- Flexible record filtering
- Table structure information
- File compacting (requires exclusive access)

Known issues:
-------------
- BLOB-fields (except MEMO) are not supported
- Indexes are not supported (also CDX!)

Minimal requirements:
---------------------
Total Commander 5.51

Installation
------------
1. ATTENTION! You have to uninstall all earlier plugin versions before installation!
2. Unpack BaseView.wlx into plugin folder(i.e. c:\wincmd\plugins).
3. In Total Commander menu choose Configuration -> Options.
4. In tab View/Edit press button "Configure internal viewer" then button "LS-Plugins".
6. Press button "Add", choose BaseView.wlx and press "OK".
7. Enjoy! ;-)

License (everybody has, why i shouldn't? ;-) )
----------------------------------------------
This plugin is free software and provided "as is" without any warranty of
merchantability or fitness for a particular purpose.
This program can be freely copied/distributed without breaking
distributive package integrity.
In no event shall the author be liable for any consequences arising
out of or in connection with the using this software. Nevertheless,
the author will try to respond to any report about such consequences. :-)

Acknowledgment
--------------
The Author wish to acknowledge following companies and persons:

Christian Ghisler for "Plugin writer's guide" and source code sample
Pascal Ganaye and Micha Nelissen for TDbf Component
Vadim Bida for English translation and beta testing.
Dariusz J. Kawecki for Polish language file and testing.
Thomas Kellerer for German language file.

The Author wish to acknowledge also all beta testers for their patience and feedbacks

"To Do" List
------------
- Add printing
- Add index support

Language support
----------------
You can switch user interface language using language files
    BSV_<language>.lng,
where <language> - language name.
Language file contains lines in the following format:
    <Object number>=<Text>
Lines not matching the format (for example, comments) are ignored.

You can create your own language file and send it to Author.
These files will be added to the next releases.

Author! :-)
-----------
Novostavsky Roman aka StayAtHome
Web:    www.stayathome.nm.ru
E-Mail: stayathome@nm.ru




Changes history
---------------

v.1.2 21.12.2003
 [-] Fixed bug with opening files with "read only" attribute.
 [-] Fields with field length more then 255 now shown correct.
 [+] Added partial support for Visual FoxPro files
     (CDX indexes are not supported!)
 [-] Fixed bug in compacting tables with MEMO-fields.
 [+] Improved options dialog.
 [+] Added export in plain text format.
 [+] While export in HTML format deleted records are shown in red color.
 [+] Increased export speed and added export progress indicator.
 [+] Added support for Lister's hotkeys "N" and "P".
 [+] Added ability to save table info into file (Ctrl+S)
 [-] In the "Table Info" window records number now includes deleted records.
 [+] Table format is show in the "Table Info" window.
 [*] While cell editing hotkeys are disabled.
 [-] Arrows keys in the Quick View are enabled.
 [-] Item "Compact Table" was enabled in the "Read-only" mode.
 [+] Click on Filter button while Shift is pressed cancels current filter.
 [+] Click on Find button while Shift is pressed invokes Find window.
 [+] Added "Search by all fields" option (disabled by default).
 [+] Added hotkeys in tooltips

v.1.1 06.07.2003
  [+] User interface language can be changed. Custom language files are also supported.
  [-] Fixed resource leaking bug related to Filter dialog.
  [+] Data export in HTML and CSV format using current filter.
  [-] Fixed bug in control drawing under Windows XP.
  [+] Fields length, fields type, records number, header size and record length
      are shown now in "Table information" window.
  [+] Added hotkeys:
      Ins - insert record,
      F2 - edit record,
      Ctrl+Del - delete record,
      Shift+Del - recover deleted record,
      Ctrl+D - show deleted records.
  [*] Some changes of appearance.

v.1.0 14.05.2003
  [*] Plugin was renamed from DbfView to BaseView.
  [-] Fixed bug when in quick view mode (Ctrl+Q) cursor remained on view panel
      and column width was miscalculated.
  [*] Some icons and titles are changed.
  [-] Fixed button state on lower panel.
  [-] Fixed resource leaking bugs.
  [-] No more error message in "Quick View" mode inside of archive.
  [+] Deleted rows are shown in red.
  [+] Added table information view (Ctrl+I).
  [+] Added partially support for FoxPro tables(not all formats)
  [*] Search by F7, F5 keys.
  [-] Temporary files are deleted now.
  [+] Added row filtering.
  [+] Added recovery function for deleted rows.

v.0.9  beta - 3.03.2003
  [!] First release.

Legend:
  [+] - Added
  [*] - Changed
  [-] - Fixed
