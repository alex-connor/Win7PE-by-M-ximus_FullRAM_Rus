NSCopy - wcx plugin for Total Commander

Copy unreadable files from any media, using program Non-Stop Copy.
Unreadable positions fills zeros (#0).

Program Non-Stop Copy copying files 3 times faster than Total Commander.


Auto installation: (TC v6.5 or up)

1. Press Enter on archive NSCopy.rar
2. Follow installation instructions


Manual installation:

1. Unpack archive NSCopy.rar to any directory
2. In Total Commander select "Configuration|Options..."
3. Open the "Packer" page
4. Select "Configure packer extensions..."
5. Type in any unused extension (e.g. "NSCopy")
6. Select "New", browse to the folder where you extracted
   GraphicsConverter.rar to and choose <NSCopy.wcx>.
7. Press "OK"


Program Non-Stop Copy (nscopy.exe) must placed in plugin's folder. If you download lite plugin's version, download this program on dmitrys.nm.ru


Conversion with the plugin:

The Plugin behaves like an archive type, just like any other archiver in Total Commander.

1. Mark the image files or folders you want to convert as usually with Total Commander.
2. Select menu "Files|Pack...", shortcut (Alt+F5)
3. Select packer "NSCopy"
4. Press "OK" to start the conversion process


Hints:

Necessarily before record of a compact disc compute and write on it the checksum of all files.
Then you precisely will sure, that files will readed 100% correctly.
1. If there are folders, press Ctr+B, to see all files.
   Unfortunately, Total Commander cannot count checksum for files in subfolders.
2. Select all files.
3. Select menu "Files | Create CRC Checksums (SFV Format).."
4. If you have a few large files, for example avi files, you can check option "Create separate SFV files for each file"
5. Press OK to start creating checksums.


If there is a place on the disk, add on it ECC file. It is the file with the information for restoring from program ICEECC. Leave this file on the hard disk, and then write a little ECC files on the other disk. It is additional possibility to restore files from corrupt CD/DVDs.


History:

01.03.2008
NSCopy 2.2
! Admission of existing files
! Save file creation date and time
+ English about dialog
+ Little fixed readme_eng.txt

03.11.2007
NSCopy 2.1
! Code retyped - Total Commander sometimes will crashed by unknow bug
! Non-Stop Copy will runned in mode of last run. Now will run always minimized
! Check exist of nscopy.exe
! ini file not used

10.10.2007
NSCopy 2.0
! NSCopy workong in background, Total Commander don't buzz, showing percents, possible to interrupt copying
! Creating empty folders
! English language

25.07.2007
NSCopy 1.1
+ Creation directories with attributes at their copying. Non-Stop Copy does not create them automatically
+ Discard of attribute "Read-only" for the directories and files at copying from optical carriers (CD/DVD)
+ Copying zero size files

23.07.2007
NSCopy 1.0
+ First release

 
Special thanks to Dmitry Sergeev for so excellent program Non-Stop Copy, always rescue when copying files.

Also I advise to try fs plugin BadCopy from Hramov Eugeny: hram-tc.narod.ru

© 2007 Serga Plotnikov aka Motorocker
Mail: zoth@bk.ru
Web : www.motorocker.ru
ICQ : 235846782