                   +--------------------------------------+
                   |           Partition Saving           |
                   |                                      |
                   |   http://www.partition-saving.com    |
                   | Copyright (c) 1999-2012 D. Guibouret |
                   +--------------------------------------+

                                    Manual

Table of contents
-----------------

  1- License and preface
  2- Introduction
  3- System Requirements
  4- Interface features/functions
     a) Textual windows interface
     b) Command line interface
  5- Using the program
  6- Saving an element
     a) Support choice:
     b) Source element choice:
     c) Part to save:
     d) Swap files directory:
     e) File choice:
     f) File size choice:
     g) Compression choice:
     h) Log file choice:
     i) Saving window:
     j) Options file creation:
     k) Examples:
  7- Restoring an element
     a) Backup file choice:
     b) Log file choice:
     c) Destination element choice:
     d) Restoring window:
     e) Examples:
  8- Copying an element
     a) Support choice:
     b) Source element choice:
     c) Part to save:
     d) Destination element choice:
     e) Copying window:
     f) Examples:
  9- Copying a backup file
 10- Verifying a backup file
 11- Updating Windows 2000/XP/Vista/Seven registry
     a) Support choice where Windows is installed:
     b) Element choice where Windows is installed:
     c) Directory where Windows is installed:
     d) Disk choice where partition to update is:
     e) Partition to update choice:
     f) Drive letter of partition to update:
     g) Confirmation:
     h) Example:
 12- Updating Windows Vista/Seven boot configuration
     a) Bootable support choice:
     b) Bootable element choice:
     c) Disk where partition to update is choice:
     d) Partition to update choice:
     e) Boot entry to update choice:
     f) Confirmation:
 13- Updating BOOTSECT.DOS/BOOTSECT.BAK file
     a) Support choice where BOOTSECT.DOS/BOOTSECT.BAK file is:
     b) Element choice where BOOTSECT.DOS/BOOTSECT.BAK file is:
     c) Confirmation:
 14- Fixing disk physical definition into boot sector
     a) Support choice where fixing boot sector:
     b) Element choice where boot sector is:
     c) Correction of first sector value:
     d) Choice of new physical definition:
     e) Giving manual values:
     f) Confirmation:
 15- Replacing a boot sector or a superblock by its copy
     a) Support choice where copying boot sector/superblock:
     b) Element choice where boot sector/superblock is:
     c) Choice of copy to use:
     d) Exploring partition:
     e) Confirmation:
 16- Simulating an element
     a) Use of driver:
     b) Simulating an element:
     c) Remarks:
 17- Creation of files on NTFS drive
 18- Reset bad sectors in filesystem
     a) Support choice where bad sectors shall be removed:
     b) Element choice where bad sectors shall be removed:
     c) Confirmation:
     d) Execution:
 19- Explore a partition
     a) Choice of support where partition to explore is:
     b) Choice of partition to explore:
     c) Exploration window:
     d) View window:
     e) Edit window:
     f) Copy destination:
     g) Copy execution:
 20- Explore a backup
 21- Create files marking drives to use
 22- Load an options or marker file
 23- Options file contents
 24- Mounting a partition
 25- Notes on what elements can be saved
     a) The complete disk:
     b) The Master Boot Record (MBR):
     c) First sectors of disk:
     d) Partitions table (MBR):
     e) Partitions table (GPT):
     f) Partitions (all sectors):
     g) Partitions (only occupied sectors):
     h) FAT (12, 16 and 32) partitions (DOS/Windows):
     i) Ext2fs/ext3fs/ext4fs partitions (Linux):
     j) NTFS partitions:
     k) Boot sector/superblock:
     l) Floppy disks:
     m) DOS/Windows/Linux devices:
     n) Raw files:
 26- Differences between DOS and Windows versions
     a) All versions of Windows:
     b) Windows before Windows 95:
     c) Windows 95/98/Me:
     d) Windows NT/2000/XP/Vista/...:
     e) Windows 64 bits:
 27- Differences between DOS and Linux versions
     a) All versions of Linux:
     b) Secured versions of Linux:
     c) Linux 64 bits:
 28- Log file
 29- What is not supported
 30- What cannot be tested
 31- Acknowledgements


1- License and preface
----------------------

This program may be copied and freely redistributed. It may not be sold in any
way, either alone or included in another program. All that is in this package
must be kept together in its original form.

This program is offered as-is without any guarantee. No pursuit can be engaged
against its author in case of damages due to this program.

This file is the complete version of manual and has many details. If you begin
to use Partition-Saving, you can read the HOWTO before to see how to use it,
then come back to this file if you need further details.

All remarks are welcome.


2- Introduction
---------------

The goal of this program is to achieve saving, restoring and copying of
elements of storage device. An element can be a whole hard disk, a floppy
disk, the Master Boot Record (first sector of hard disk containing boot code),
the partitions table or a partitions. This permits saving hard disk contents
to restore it later in case of a problem, without losing time reinstalling and
reconfiguring software.
This program allows running the following tasks:

  - saving an element (hard disk, partition, floppy disk, device).
  - restoring an element that was saved before.
  - copying an element.
  - copying a backup file created by this program, modifying its size or
    compression rate.
  - verifying created files.
  - updating partition definition in Windows 2000/XP/Vista/Seven registry.
  - updating BOOTSECT.DOS/BOOTSECT.BAK file.
  - exploring a partition.
  - simulating elements with created files.
  - creating files on a NTFS drive under Windows for use in saving.
  - cancelling bad sectors information of a filesystem.
  - correcting disk physical definition (first sector number of a partition,
    heads and sectors per track numbers) into a FAT and NTFS boot sector.
  - replacing a FAT or NTFS boot sector or ext2/ext3/ext4 superblock by its
    copy in case original one is damaged.

For detailed information about partitioning and this program, please read
additional information.


3- System Requirements
----------------------

Hardware:

  - 386 or better.
  - 4 Mb of memory (could work with less, but data compression might not
    work). Free DOS memory must be at least 300 Kb.

Software:

  - DOS (version >= 3.3) for DOS version.
  - any Windows version less 3.1 versions for Windows version (please read
    chapter 26 to get constraints depending on version).
  - any Linux version having a kernel version >= 2.5.4 and glibc version >=
    2.2 for Linux version (please read chapter 27 to get constraints).

To use DOS version, you need a bootable DOS floppy or CD (or a DOS partition
on your disk). If you do not have one, you can use the boot disk that includes
Partitition Saving (see spartbdk documentation) to create a bootable floppy or
CD. You can also create your own floppy disk (see FAQ question 10).
To use Windows version, you need a second Windows installation or a WinPE or
BartPE CD or use the Windows Vista/Seven repair console because program cannot
save/restore the active system.
To use Linux version, you need a second Linux installation or a liveCD or use
the repair console that is on most installation CD because program cannot
save/restore the active system.
Using this program with an emulator with accessing a not emulated disk is not
recommended (especially if it runs in a multitasking environment).
This program shall be used after a boot of computer without leaving any OS
into some hibernation mode because in this case modification made by this
program can disallow this OS booting back or OS can undo what program does.
You will need also a FAT, NTFS or ext2 partition (or any other filesystem for
which you have a DOS driver that allows access to it) to create backup file
(this is not needed if you merely want to copy a partition, since no file is
created).


4- Interface features/functions
-------------------------------

Two interface types are available:

  - a textual windows interface that presents information in windows that can
    be navigated with the keyboard or mouse.
  - a command-line interface that presents information in a basic way and can
    be used only with the keyboard.

The default interface is the first one. The second one is here to resolve some
incompatibility issues on some computers.
To decide which interface to choose, please read chapter 5.

  a) Textual windows interface

Interface can be used with keyboard or mouse. Keys common to all windows are:

  - Tab, bottom arrow or right arrow to go from one item to another inside a
    window.
  - Shift+Tab, up arrow or left arrow to go from one item to another inside a
    window (in reverse order compared to Tab).
  - Ctrl+Tab to go from one window to another.
  - Alt+Tab to go from one window to another (in reverse order compared to
    Ctrl+Tab).
  - Key assignments are defined to associate moving keys to a combination of
    keys using the Control key:
                          +-------------+-------------+
                          | Moving keys | Combination |
                          +-------------+-------------+
                          | Home        | Ctrl+B      |
                          +-------------+-------------+
                          | End         | Ctrl+E      |
                          +-------------+-------------+
                          | Down        | Ctrl+D      |
                          +-------------+-------------+
                          | Up          | Ctrl+O      |
                          +-------------+-------------+
                          | Right       | Ctrl+K      |
                          +-------------+-------------+
                          | Left        | Ctrl+L      |
                          +-------------+-------------+
                          | Page Down   | Ctrl+N      |
                          +-------------+-------------+
                          | Page Up     | Ctrl+P      |
                          +-------------+-------------+
                          | BackSpace   | Ctrl+H      |
                          +-------------+-------------+
                          | Delete      | Ctrl+J      |
                          +-------------+-------------+
                          | Insert      | Ctrl+Y      |
                          +-------------+-------------+
                          | Return      | Ctrl+M      |
                          +-------------+-------------+
                          | Tab         | Ctrl+F      |
                          +-------------+-------------+
                          | Shift+Tab   | Ctrl+G      |
                          +-------------+-------------+
                          | Alt+Tab     | Ctrl+T      |
                          +-------------+-------------+
                          | Ctrl+Tab    | Ctrl+W      |
                          +-------------+-------------+

If no item seems to be selected, press one of these keys to select first or
last one.
In general, Enter key activates Ok button (if no other button is selected) and
Escape key activates Cancel button.
Various features of windows are presented below:

  - Command buttons: to activate them, you have to press Enter key when they
    are selected, or press Alt+<red letter in button name> (even if button is
    not selected).
    You can also activate them by clicking on them.
    A button is selected if it has a black background and is flanked by ">"
    and "<", otherwise it has a green background.
  - Entry lines: this is an item that permits entering data. Just press a key
    to add the character where the cursor is. Delete and BackSpace keys are
    used to erase characters (respectively, character that cursor is on, and
    character before cursor). Right and left arrows are used to move cursor
    and Home and End keys are used to go to begin or end of string. Holding
    down the shift key while using moving keys will select text that will be
    erased when you will press a key other than the moving one. By pressing
    Ctrl+A you select all the text.
    Finally, Insert key is used to switch from insert mode (default mode:
    cursor is underlined cursor) to replacement mode (cursor is block-cursor)
    and back again.
    With the mouse, you can move the cursor by clicking where you want it to
    be, scroll the text by clicking on arrow on left or on right, select the
    text by keeping button pressed when moving mouse and select all the text
    by double clicking on it.
    An entry line is selected when it has the cursor that appears in it.
  - Listboxes: they are used to choose an item from a list. Up and bottom
    arrows are used to move from one item to another, Page-Up and Page-Down
    keys are used to go to begin and end of list.
    If right column is a different color and contains a # character, it is
    because all elements cannot be seen and the # character is used to locate
    the currently selected item in the list.
    If last line is a different color and contains a # character it is because
    there were some columns that cannot be seen and the # character is used to
    locate columns that are displayed.
    With the mouse, you can select an element. If scroll bar appears on right,
    you can change list position by clicking where you want to be, or by
    clicking arrows on up or bottom. By double clicking on selected element
    you will activate command associated to the list (generally Ok button).
    A selected item has a grey background if its listbox is not selected, and
    has a black background if its listbox is selected.
    In case list allows selecting several items, you can select/unselect items
    either by range with keeping the shift key pressed with a mouse click or
    moving keys or by individual item selection with keeping the ctrl key
    pressed with moving and mouse click or space to select/unselect an item.
    You can use Ctrl+A to select all items.
  - Checkboxes: these items allows activating/deactivating an option. To
    change the state of a checkbox, click on it or press Space key when it is
    selected. A checkbox is activated when an 'X' appears between square
    brackets, it is deactivated otherwise.
    A checkbox is selected when its text is white, is not selected when its
    text is grey.
  - Directory trees: this item allows selecting a directory on a partition. It
    functions similarly to a listbox. The first line ("\") is the root
    directory of the partition, subsequent lines are directories on this
    partition displayed with a tree view in alphabetic order. Directories that
    have "+- " before their name have some sub-directories that can be
    displayed by selecting this directory and pressing '+' key or by clicking
    the "+" before name. Directories that have their sub-directories displayed
    and that have "-- " before their name can be collapsed by selecting this
    directory and pressing '-' key or by clicking the first "-".
    Example: 
    \
    -- displayed sub-directories
    |  |- sub-directory 1
    |  `- sub-directory 2
    |- no sub-directory
    +- sub-directories not displayed
    `- terminal directory

  b) Command line interface
This interface is more basic and can only be used with the keyboard. Pressing
the Escape key at any time stops execution of the program.
Various features are:

  - Lists: a list is displayed with numbers on the left. Enter the item number
    when you are asked to choose. If the list is bigger than screen size, you
    will have to press a key to scroll.
  - Entering information: you must enter the required information (for example
    a filename). Delete key allows removing last character (what you have
    already entered is displayed on next line without the last character and
    you can continue to enter characters). It is not possible to move the
    cursor.
  - Choices: they have the form of a question with possible responses given in
    parentheses (sample: (Y/N)). You must answer by selecting from these
    choices. It is not case-sensitive.


5- Using the program
--------------------

Usage:
savepart.exe [-l en|fr|fr_2] [-cm|-nm|-pm] [-f <options file>] [-fp <partition
marker file>|-fd <device marker file>] [-ff <drive marker file>] [-fnc] [-ncd]
[-ncs] [-nvd|-vd] [-nvf|-vf] [-tds] [-cui|-tui|-tuix|-bui|-buix]
[-beep|-beep=<nb>] [-utf8|-noutf8] [-force] [-term <terminal>]
[-a|-b|-c|-d|-e|-i|-k|-m|-n|-r|-s|-t|-u|-v|-w|-x|-z]
To use the Windows version, spartwin.exe shall be used instead of
savepart.exe.
To launch the Linux version, spartlnx.run shall be used instead of
savepart.exe.
In Windows and Linux versions, same options are available, but some of them
will have no effect (see below).

  -l: this option allows you to select which language to use. You only have to
use this option if the automatically recognised language is not correct. If an
error occurs before this option is analysed, the error message will be written
with the automatically detected language. Recognised languages are:

    * en: English.
    * fr: French.
    * fr_2: French with others code pages.

In DOS, detection of language sets language to French when detecting France,
French Canada, French Guyana, French Antilles or French Polynesia settings,
otherwise it is set to English.
In Windows, detection of language sets language to French when language
settings are French one, otherwise it is set to English.
In Linux, detection of language sets language to French when "LANG" or
"LC_CTYPE" environment variables begin with "fr" (whichever case is used). If
characters are wrongly displayed (either with square or interrogation mark),
you could have to change the terminal settings from UTF-8 to your country code
page (as ISO-8859-1 or ISO-8859-15 for France) and you need to launch program
again.
fr_2 is to be used in case accents are not well displayed. It is not
automatically detected.

  -cm: this option is the default way the mouse is utilised.

  -pm: this option is another way to utilise the mouse that can be used in
case the first one does not work (it is default method when using DOS version
on Windows NT/XP). Using this method may prevent detecting some double clicks.
This option is equivalent to -cm into Windows version. In Linux version,
program does not try to install its own mouse handler but fully relies on
ncurses one.

  -nm: this option disables the mouse. You would have to use it only if mouse
use seems to pose a problem with 2 previous methods.

  -f <options file>: this option allows you to use batch mode. To understand
the contents of this file, please read chapter 23.

  -fp <partition marker file>|-fd <device marker file>: this option allows you
using another way to designate the partition (-fp) or device (-fd) to save or
restore: program searches for marker file you give (by scanning all partitions
or devices) and uses the partition/device on which this file is found. To get
more information on these options, please read chapter 21.

  -ff <drive marker file>: this option allows you using another way to
designate the drive where is backup file: program searches for marker file you
give (by scanning all partitions or devices, then all drives) and uses the
drive on which this file is found with using the name of this file as base for
backup file name. To get more information on this option, please read chapter
21.

  -fnc: this option disables confirm of found partition/drive when using -fp,
-fd and -ff options.

  -ncd: this option disables the check that created/read file is not on
saved/restored element. It is generally recommended only if DOS drive letter
attribution is wrong. This option has no influence in Windows and Linux
versions (this check cannot be disabled).

  -ncs: this option disables the check on free size on drive where backup file
is created. This is a workaround in case the driver report a wrong free size,
but you have to be aware when using this option to not provide a too big
maximum file size else saving will fail.

  -nvd|-vd: this option disables/enables the check that sectors are correctly
written. It is disabled as default. This speeds up restoring, but may prevent
detecting bad sectors on the disk. The check that sectors are correctly
written cannot be enabled in Windows and Linux versions (less for floppy disks
in Windows 9x).

  -nvf|-vf: this option disables/enables the check that files are correctly
written and that sectors are correctly written when using DOS devices access.
It is disabled as default. This speeds up saving (and/or restoring), but
created files or restored devices may be incorrect because the disk where they
are written is damaged. The check that files are correctly written cannot be
enabled in Windows and Linux versions.

  -tds: this option enables check of disk size with relying on partitions
table content (for disk with extended access) or with searching last cylinder
(for disk with standard access). This option is needed only if partitions do
not appear on displaying of what can be saved/restored.

  -cui|-tui|-tuix|-bui|-buix: this option allows you to select the user
interface:

    * -cui: command line interface.
    * -tui: textual window interface.
    * -tuix: same as -tui but with using extended display mode (43 or 50 lines
      instead of 25). In Linux version, the whole terminal size is used.
    * -bui: textual window interface using BIOS calls to write on the screen.
      This ensures better compatibility but goes slower. This option is the
      same than -tui in Windows and Linux versions.
    * -buix: same as -bui but with using extended display mode (43 or 50 lines
      instead of 25). This option is the same than -tuix in Windows and Linux
      versions.

If this option is not given, textual window interface is used. This option has
to be used only if this interface poses a problem (for example nothing appears
when the program begins). In this case, you can first try the -bui option, and
if it still does not work, use the -cui one.

  -beep|-beep=<nb>: some beeps are generated at regular time when performing
backup/restore (see "beep=" option to get more details). Without value, beeps
are generated every 10 seconds, else they are generated every <nb> seconds.

  -utf8|-noutf8: forces use or not use of UTF-8 terminal capability in Linux
version. The default behaviour is to detect it automatically.

  -force: allows testing all filesystem types on a partition even if they are
not compatible with partition type. On restoration forces it even in case
destination does not match constraints stored in backup (in this case, there
is NO GUARANTEE on result). Constraints that are still checked are that type
of support is the same (you cannot restore backup of a disk on a partition),
size of sector is the same and that size of support is at least equal to size
in backup. Constraints that are not checked depend on what is in backup but
can be that physical definition (number of heads, cylinders, first sector) is
the same or support is not bigger than maximum size. That can lead to big
amount of space unused at end or wrong partition definition leading it to be
unreadable or unbootable. Use of some capability of this program can correct
some of these problems (as fixing of physical definition). This option shall
be used only in case of troubles and when you know what you do.

  -term <terminal>: this option is specific to Linux and Windows versions.
In Linux version, if program finds it does not run in a terminal, it launches
itself into a terminal with using the "xterm" command (this mecanisme is
useful if you double click on program from a file explorer). This option
allows setting command to use to create the X terminal in which running
program instead of "xterm" (this command shall allow using "-e" option to run
a program). If <terminal> is equal to "no", program does not try to create a
terminal even if it finds it is not executed into a terminal.
In Windows version, program tries to launch a new console to ensure the mouse
quick edit mode is disabled (thus allowing use of mouse). Using this option
(whatever <terminal> value is) disables this behaviour.

  -a|-b|-c|-d|-e|-i|-k|-m|-n|-r|-s|-t|-u|-v|-w|-x|-z: this option allows
selecting which action to do:

    * -a: fix disk physical definition into boot sector.
    * -b: update BOOTSECT.DOS/BOOTSECT.BAK file.
    * -c: copy an element.
    * -d: copy files created by this program to modify it (compression rate,
      maximum size, extract occupied sectors only, ...).
    * -e: explore a partition.
    * -i: get information from driver.
    * -m: simulate an element with backup files.
    * -n: create files on NTFS partition when you are running from Windows NT,
      2000, XP or following.
    * -r: restore an element.
    * -s: save an element.
    * -t: verify a backup file.
    * -u: update Windows 2000/XP/Vista/Seven registry.
    * -v: explore a backup file.
    * -w: update Windows Vista/Seven boot configuration data.
    * -x: create marker files on partition to save/restore and on partition
      where to create/get backup files.
    * -z: cancelling bad sectors information of a filesystem.

If none of these options are given, the program asks what you want to do. For
information about each action, please read subsequent chapters.

Return code of program can be one of the following:

  - 0 if no error has been detected.
  - 1 if en error has appeared.
  - 2 if user cancels execution.
  - 3 if no error has been detected, but there were some bad sectors or errors
    that do not disallow execution.
  - 255 if some exception has been raised.

Remarks:
--------

  - -f <option file> cannot be used when copying files.
  - exploring a partition can only be used with a textual windows interface
    (it cannot work with -cui option).


6- Saving an element
--------------------

This is the part executed when you use the -s option or select it when the
program asks you.

Execution follows the diagram below (if not in batch mode): 
            Support choice
                  |
                  V
        Source element choice
                  |
                  V
            [Part to save]
                  |
                  V
        [Swap files directory]
                  |<------------------------+---+
                  V                         |   |
             File choice                    |   |
                  |                         |   |
                  V                         |   |
           File size choice                 |   |
                  +-------------------------+   |
                  V                             |
          [Compression choice]                  |
                  |                             |
                  V                             |
           [Log file choice]                    |
                  |                             |
                  V                             |
            Saving window                       |
                  +-----------------------------+
                  V
        Options file creation
                  |
                  V
                 end


  a) Support choice:
You have to choose the disk, floppy drive, DOS/Windows/Linux device or raw
file where the element to be saved is located.
Hard disk access modes are:

  - standard access: with this access mode disk is accessed with its physical
    definition (cylinder, sector, head). With this access mode sector size
    cannot been known (it is assumed to be 512 bytes which is most common
    value) and disk size is at most of 8 Gb.
  - extended access: this is a new access mode, which has become the standard
    one. In this case the hard disk is seen as a unique track (it does not
    care about physical definition). This mode allows use of more than 8 Gb
    hard disk. Nevertheless size reported can be wrong (without any
    consequence). Sector size can be different from 512 bytes (but this value
    is still the most common).

For floppy drive, access is always standard access and for DOS/Windows/Linux
devices it appears as extended for Partition Saving, but as it is the
DOS/Windows/Linux driver that accesses the device, it is this last one that
choose access mode.

  b) Source element choice:
This window allows you to select what part of the disk to save.
Support tells you whether the element is directly related to the disk or to a
partition. In the case of a partition, support is specifies whether it is a
main partition or if it is a partition defined in the extended partition.
Partition number is the number as given under Linux.
Drive name is the DOS drive name that corresponds to the partition (if it is a
DOS partition). This can be wrong because some new partition type can be
defined (for example with Windows95, several new partition types have been
defined for VFAT16 and FAT32 partitions).
In the case of an element related to the disk, element type identifies the
element: it can be the whole disk, the master boot record (first sector of
disk), sectors that are before first partition and partitions table. In the
case of an element related to partition, element type is partition type: this
is used to identify the OS installed on it. As this type is not normalised,
the list is not exhaustive.
Size gives element size. By default, it is expressed in Mb, except in cases
where it is followed by Kb.
Partition name is the label (or volume name). It is given when it can be
found. If, for a DOS drive, there seems to be incoherence between drive letter
and partition name, this last one is certainly correct and drive letter wrong.
For floppy drive, this window does not appear.
For DOS/Windows devices, you can choose the device to save from the list given
you which DOS/Windows understands as having a sector access. For the DOS
version, this will be limited to those having FAT filesystem as it is the only
filesystem known by DOS. For Linux devices, it gives list of block devices
that appear into /etc/fstab, /etc/auto.master, /etc/autofs/auto.master files
and that are not mounted or all detected devices if /dev/fuse file exists.
For raw files, you can choose the name of the file to use as file of support.

Remarks:
--------

  - If you save a main partition of extended type, you will save all
    partitions defined inside this extended partition (all that have "Extended
    n <extended partition chosen>" as support).
  - If you have only one partition with type 42 (dynamic disk) or 8e (Linux
    LVM), disk is used with new dynamic partition scheme that is not supported
    by DOS version of Partition Saving. You can save the content of this disk
    with using Windows device into Windows version (in case of Windows dynamic
    disk).
  - If you have a partition with type 44 (GoBack), it is because you use
    Norton GoBack that has its own partition mechanism. You have to deactivate
    it in order to be able to save a partition.
  - If no partition or only one with ee type (GUID part. table) appears or
    last one is missing, this can mean partitions table seems wrong. You can
    use partinfo tool to check it. If problem is due to a difference in disk
    size depending on used OS, you can use the "-tds" option or use Partition
    Saving version that runs on the OS used to create these partitions (this
    second option being better).

  c) Part to save:
This window only appears if chosen partition is of a type which permits saving
only occupied sectors. In this case, it proposes the following choices:

  - "All sectors": With this choice, all sectors of the partition are saved
    without considering if they are occupied or not. This makes saving need
    more space than in following choices, but allows saving a partition even
    if it is heavily damaged (for example, to save it before trying some
    radical way to repair it). Constraints are that this partition can only be
    restored onto a partition with the same format (hard disk must have the
    same size and physical definition, and partition must have the same size
    and be at the same place).
  - "Occupied sectors": with this choice, only occupied sectors are saved.
    This has the advantage that saving need less space and allows restoring
    this partition onto a different partition (it can be on another disk, at
    another place and have another size), but there are still some size
    constraints. Disadvantages are that it needs more memory and saving can
    fail if your partition is damaged (for example, if important sectors are
    damaged).
  - "Element on itself": this choice appears for FAT, NTFS and ext2
    partitions. It is the same as preceding choice but allows creating a
    backup file on the saved partition (which must NOT be done for the 2
    previous choices). You can choose this option only if you use the internal
    program feature to access FAT, NTFS and ext2 partitions (by using
    partition mounting), not if you have another way to access these
    partitions. If you choose this option, partition is automatically mounted
    to be able to access it if that is not already the case. Constraints are
    that it needs more memory, and you will have to do a scandisk on the
    restored partition (after having restarted your computer) to correct some
    potential errors on the size of created files (those you have used for
    restoration are correct, those on the restored partition are not). For
    FAT16, FAT32, NTFS and ext2 partitions, this check is automatically
    activated the next time you boot. For FAT12 partitions, you have to do the
    check by yourself.
    For FAT and ext2 partition it is better to not overwrite an existing file
    because it can lead to more errors than creating new files. For NTFS
    partition there is no such constraint (moreover there is no choice).
  - "Occupied sectors without swap files": this choice appears only for FAT
    and NTFS partitions. With this choice only occupied sectors are saved and
    the swap files contents are not saved (Windows will reset them at first
    boot after doing restoration). Swap files can be "386spart.par",
    "win386.swp", "vmmhiber.w9x", "pagefile.sys" and "hiberfil.sys" on a FAT
    partition and "pagefile.sys" and "hiberfil.sys" on a NTFS partition. This
    option allows reducing backup file size, but need more memory than saving
    occupied sectors only.
  - "Element on itself without swap files": this choice is a combination of
    the two previous choices.
  - "Boot sector" (FAT/NTFS partition) or "Super bloc" (ext2/ext3/ext4
    partition): this allows saving sectors that describe file system (first
    one for FAT/NTFS partition, the 2048 first bytes for ext2/ext3/ext4
    partition). This option is not very useful unless to prevent against a
    boot virus.

If partition to save is not a partition for which saving only occupied sectors
is available or if you have chosen an element that is related to disk, this
window will not appear and all sectors will be saved.
To have more information on saving only occupied sectors, please read chapter
25.

Remark:
-------

  - a window informing you of searching for last occupied sector is displayed
    between maximum filesize choice and saving window. If you chose one of the
    two options where only occupied sectors are saved, this window might be
    displayed for a long time. If you save all sectors, you will certainly not
    see it because it is displayed too briefly.

  d) Swap files directory:
This window appears only if you chose "Element without swap files" or "Element
on itself without swap files" option in the previous window. It allows telling
the program which directory contains the swap files. In addition to the
directory you choose here, the program also searches for them in the root
directory (you can obviously give the root directory here also). As a general
rule, swap files are either in the root directory or in the Windows directory.
To select the directory you have to go into the tree (with displaying
subdirectories of a directory by pressing the '+' key when it is selected if
necessary) until you reach it, then press Enter or click the Ok button.

  e) File choice:
In this window you can choose the name and location of the file in which to
save partition data. For this purpose you can type into "File" line the name
of the file (with possibly its path) or select one from the files list or
select another directory with drives and directories lists. By default "*.*"
is displayed which means that all files are shown. You can also create some
directory (this shall NOT be done on the saved partition even if you chose to
save it on itself) or mount a partition. Mounting a partition allows you to
access a partition that cannot be used by DOS/Windows, such as an NTFS (for
DOS version) or ext2 partition you want to write a backup file on. For have
more details on mounting a partition, please read chapter 24.
A second window gives you the option to use automatic naming and log file.
With automatic naming, the program will generate a file names automatically
for following files if several files are needed. To accomplish this purpose,
the program uses the first filename and changes (or adds) the two last
characters of file extension (last three if more than 100 files are needed) by
file number (with using 0 for number of first file). For example if your first
file is called "disk_c.par", the second one will be "disk_c.p01", the third
"disk_c.p02", ..., the hundred and first "disk_c.100". Log file will enable
storing error messages in a file (see chapter 28).
A third window gives you the list of drives with free space and the full size
of the partition (without taking into account the fact that only occupied
sectors might be saved and whether compression is used).

Remarks:
--------

  - If a drive does not appear in the drives list, it is because it can't be
    detected.
  - if the selected file already exists, a window is opened to confirm
    selection (if file is read-only, the window will inform you that it cannot
    be removed).
  - if you save a whole disk, a FAT, NTFS or ext2 partition, you should NOT
    create the file on the disk or partition you save unless you chose
    "Element on itself" or "Element on itself without swap files" option in
    the saving window and you try to access it through mount mechanism. If you
    have not chosen this option and try to create a file on the partition to
    be saved, a warning window informs you of this potential problem. It is
    not displayed if you used the "-ncd" option.
  - same remark than previous one for directory creation, but it shall not be
    used on the disk or partition you save even if you choose to save an
    element on itself.
  - when using automatic naming, file existence is not checked except for the
    first file, so files will be removed if they exist (for example, avoid
    calling the first file <name>.<letter>01 because it will be erased when
    creating second one).
  - if you get an error message telling you cannot access a drive because it
    is saved one and you chose to save it on itself, you have to access it
    through mount mechanism (it has been automatically mounted as 0: if you
    did not mount some other drives before).

  f) File size choice:
This window permits you to choose the maximum size you want for the file. If
more space is needed to save the element, a new file will be asked of you when
this one is full. If free space on the drive is less than 10 Mb, asked size is
in kb, else it is in Mb. This maximum size cannot be bigger than drive free
space or 2047 Mb, whichever is smaller. If you used the "-ncs" option, drive
free space is not checked.
If you enter 0, you go back to the file choice window.
To give the size you can either use the line entry or choose a predefined
value into the list.

  g) Compression choice:
If you have enough memory, a window asks which compression level you want to
use to compress data. The level goes from 0 (no compression) to 9 (maximum
compression). Level generally used by the compression routine is level 6. The
higher the compression level, the longer the execution time will be (but only
a small change when expanding).
If you do not have enough memory, a window will inform you of this. In this
case no compression is done (<=> 0 level).
This window will be displayed only for the first file (for subsequent files
the same compression rate is used).
The compression algorithm used is the gzip algorithm.

  h) Log file choice:
This window appears only in case you check option to create log file when the
name of the backup file is requested. You have to give the name of the file
where you want to store all errors message displayed by program. You can refer
to chapter 28 to get more details on log file.

  i) Saving window:
This window shows the backup progress.
The upper progress bar shows progress for element being saved. The lower
progress bar shows progress for file in relation to its maximum size.
Consequently, it is not unusual for this progress to not reach 100% when
saving ends.
Remaining time is an estimate of remaining time. Its accuracy is strongly
influenced by compression, or saving of only occupied sectors.
Errors list is the list of errors detected when reading sectors on the disk.
If you have the same errors when restoring and if, when you use a disk
checking program (like surface checking with scandisk), bad sectors appear,
these errors have no consequence (if there was no data on these sectors before
saving, but that is a rule of the OS).
If the maximum file size you have given is not enough to save the entire
element (progress bar for file reaches 100%), a new file name is asked of you
with a new maximum size (if you use automatic naming, this happens
automatically, with the same maximum size as the first file).
While saving is running, you cannot activate the Ok button (only cancel button
can be activated to stop saving). When saving is finished, the Ok button
becomes active, the cancel button inactive, and line marked "State" changes
from "Running ..." to "Ended.".

  j) Options file creation:
If you do not use batch mode (or if some options have been added to those
given in batch mode), a window will ask you if you want to create an options
file that will allow you to use batch mode for future save/restore of this
partition. If you answer "yes", a window will ask you to give its name. This
file will contain all the options you have used. Another window is displayed
to allow you adding a comment at begin of this file (program automatically
adds ";" before comment).

Remarks:
--------

  - The contents of this file remain valid only as long as you do not change
    the partitioning of your hard disk.
  - The names of files used to save data are absolute path names.
    Consequently, if you move these backup files, you will have to modify this
    options file.
  - You can create this file manually.
  - The DOS naming convention (8.3: 8 characters maximum for file name and 3
    characters maximum for extension) must be used for file names in the
    options file unless using a file through mounting or with Windows or Linux
    versions.

  k) Examples:
Suppose you have 2 hard drives partitioned as described below (next to
partition type are <DOS>|<Linux> drive names):
                Disk 1                                 Disk 2
+------------------------------------+ +-------------------------------------+
| Main partition 1:                  | | Main partition 1:                   |
| DOS FAT 32              (C:|hda1)  | | DOS FAT 32              (D:|hdb1)   |
+------------------------------------+ +-------------------------------------+
| Main partition 2:                  | | Main partition 2:                   |
| DOS extended            (  |hda2)  | | DOS extended            (  |hdb2)   |
| +--------------------------------+ | | +---------------------------------+ |
| | Extended partition 1 of        | | | | Extended partition 1 of         | |
| | main partition 2:              | | | | main partition 2:               | |
| | DOS FAT 32           (E:|hda5) | | | | DOS FAT 32           (G:|hdb5)  | |
| +--------------------------------+ | | +---------------------------------+ |
| | Extended partition 2 of        | | +-------------------------------------+
| | main partition 2:              | | | Main partition 3:                   |
| | DOS VFAT 16          (F:|hda6) | | | Empty                   (  |hdb3)   |
| +--------------------------------+ | +-------------------------------------+
+------------------------------------+ | Main partition 4:                   |
| Main partition 3:                  | | Linux swap              (  |hdb4)   |
| Linux extfs2            (  |hda3)  | +-------------------------------------+
+------------------------------------+
| Main partition 4:                  |
| Empty                   (  |hda4)  |
+------------------------------------+

If you want to save the partition containing the D: drive, you execute
savepart.exe -s, then:

  - choose the second disk,
  - select the first partition,
  - choose to save all sectors or only occupied ones (this second option will
    require less space),
  - choose to compress file or not,
  - choose path and file name to create (taking into account free space on the
    various drives, but preferably a drive on the first disk so the savings
    will go faster, hence on C:, E: or F:), for example c:\disk_d.par.
  - if you want to burn the file on a CD you will have to choose a maximum
    file size of 620 Mb.

From this point, saving proceeds. If 620 Mb is not enough to store all data,
you will have to give a path and file name for a second file, then its maximum
size, etc. Once saving ends, you can decide to create the batch file or not.
If you create a batch file and burn files onto CD, put the batch file with the
first backup file and don't forget to change the path of the backup file in
the batch file.

If you want to save the Linux partition, you must:

  - select the first disk,
  - choose the third partition

and then continue as in previous example (since the Linux partition is on the
first disk, it is better to create the backup file on the second disk).


7- Restoring an element
-----------------------

This is the part that is executed when you use the -r option or select it when
the program asks you.

Execution follows the diagram below (if not in batch mode): 
             Backup file choice
                  |
                  V
             [Log file choice]
                  |
                  V
      Destination element choice
                  |<------------------------------+
                  V                               |
           Restoring window                       |
                  +-----> Backup file choice -----+
                  V
                 end


  a) Backup file choice:
This is the same window as the one used for file choice when saving. The
selected file header is verified and an error is displayed if it is incorrect.
Automatic naming can be selected for subsequent filenames to be generated
automatically (filenames must follow rule described in chapter 6.e). You can
also mount a partition if the backup file is on a partition that
DOS/Windows/Linux is not able to access.

  b) Log file choice:
This window appears only in case you check option to create log file when the
name of the backup file is requested. You have to give the name of the file
where you want to store all errors message displayed by program. You can refer
to chapter 28 to get more details on log file.

  c) Destination element choice:
This window gives a list of elements that are compatible with what is saved in
the file. You must choose one of the elements in this list to do a
restoration.
At the top of the window is a description of the saved element. Below is the
list of compatible elements.
"Dis" column gives disk number on which element is located.
"Support" column gives support type on which element is located.
"Num" column is the partition number as it is known with Linux, if the element
is a partition.
"L." column gives DOS drive letter of the element, if it is a DOS partition.
"Id." column indicates whether an element is identical to the one saved (same
physical definition). If so, an "X" will appear in this column, otherwise it
is empty.
"Size" gives element size. By default, it is expressed in Mb, unless it is
followed by Kb.
Partition name is the label (or volume name). It is given when it can be
found. If for DOS drive, there seems to be incoherence between drive letter
and partition name, this last one is certainly correct and drive letter wrong.
In case support where you want to restore backup does not appear, you can
choose item before last in list to choose this support and see why it is not
compatible.
As last choices, you can create or update a raw file. Creation will create (or
replace if file already exists) a file that contains the whole saved support
content (so will be as big as this support). Update will modify an already
existing file (this one needs to have a coherent size).
For more details on element compatibility, please read chapter 25.
If no compatible element is found, a message tells you this and the program
ends.

!!!!! Warning !!!!!:
--------------------
Restoring erases all data currently present on the chosen element.
Moreover, you must NOT choose the disk (when restoring a whole disk) or the
partition on which the file used for this restoration is located (indeed it
would be erased during restoration and thus would no longer be accessible,
causing an error and stopping the restoration).
A warning window informs you if the selected file is located on the disk or
partition to be restored. This window is only displayed for the first file
(for subsequent files, you must NOT access the disk or partition you are
restoring) and is not displayed if you used the "-ncd" option.

  d) Restoring window:
This window permits you to watch the restoration progress.
The upper progress bar shows file progress.
The lower progress bar progress for the chosen element.
Remaining time is an estimate of remaining time. Its accuracy is strongly
influenced compression, or saving of only occupied sectors.
Errors list contains list of errors that were detected when writing sectors on
disk. If errors are the same as those on saving, there is no consequence (if
they are not the same, or if they are fewer or more, you can have lost data:
run a program like scandisk to try to resolve this problem).
If the element has been saved into several files, you must give them when they
are asked of you.
While restoring is running, you cannot activate Ok button (only cancel button
can be activated to stop restoring). When restoring is finished, Ok button
becomes active, cancel button inactive, and line marked "State" changes from
"Running ..." to "Ended.".

!!!!! Warning !!!!!:
--------------------

  - When choosing subsequent files, you must not access the drive
    corresponding to the disk or partition being restored. Indeed this drive
    is being written and so the file allocation table is wrong (as if you want
    to access a file when a drive is being formatted).
  - Once the element is restored, restart your computer if you have restored a
    DOS partition (or a partition that can be accessed under DOS). This is
    needed for DOS to update information about this partition. This is not
    needed with Windows and Linux versions (they update the information about
    filesystem once the program ends).
  - If you cancel a running restoration, you must reformat the destination
    element (or do a new restoration).
  - If when saving, you had created the backup file on the saved partition,
    after having restarted your computer you have to run scandisk on the
    restored partition to remove errors on the size of the backup file. This
    check is now needed only for FAT12 partitions (for FAT16, FAT32, NTFS and
    ext2 partitions, this check is automatically enabled).
  - If you restore a partition onto a partition other than the one that was
    saved and you have Windows 2000, XP or following, you have to update the
    registry for this partition. For this, please read chapter 11.
  - If the partition you restore is the boot partition that is launched using
    the Windows XP/Vista/Seven multiboot feature and you restore this
    partition onto a partition other than the one that was saved, you have to
    update the BOOTSECT.DOS/BOOTSECT.BAK file for this partition. For this,
    please read chapter 13.
  - If the partition you restore is a system partition that is launched using
    the Windows XP multiboot feature and you restore this partition onto a
    partition other than the one that was saved, you have to update the
    BOOT.INI file. For this, you have to boot with the Windows XP CDROM, use
    console mode and use the bootcfg command. You can also use element
    exploration to edit the file.
  - If the partition you restore is a system partition that is launched using
    the Windows Vista/Seven boot feature and you restore this partition onto a
    partition other than the one that was saved, you have to update the boot
    configuration data file. For this, you have to boot with the Windows Vista
    DVD, use repair mode and use the bootrec /RebuildBcd command if automatic
    repair was not done. You can also use the dedicated option of program. For
    this, please read chapter 12.
  - If the partition you restore is a partition used with Linux and you
    restore this partition onto a partition other than the one that was saved,
    you have to update the /etc/fstab file and the boot loader if it is a
    system partition. For this you have to boot with the Linux CD, use the
    rescue mode and update mount point and boot loader.

  e) Examples:
Consider the same partitioning presented in the above examples for saving
partitions, and now you want to restore the partitions previously saved.
In the case of restoring the D: drive, you execute savepart -r and:

  - choose the file name where D: was saved,
  - choose the partition that you want to restore. If you saved all sectors,
    only partition that contains D: drive will be listed (if the 2 hard-
    drives have the same format and C: and D: drives have the same size, C:
    drive can be also listed).
    If you have saved only occupied sectors, partitions containing C:, D:, E:
    and G: drives might be listed depending on their size (partition
    containing F: drive won't be listed because it doesn't have the same
    filesystem type). In this case, the partition that contains D: drive will
    have an "X" in the "Id." column but others won't (if the 2 hard drives
    have the same format and C: and D: drives have the same size, C: drive can
    also have an "X").
  - once the partition is chosen, restoring begins. If saving was done into
    several files, the second file will be asked for when the first one is
    finished, etc.

Once restoring ends, reboot your computer for DOS to take into account
modifications done onto the D: drive.

If you want to restore the Linux partition, you do the same things as above.
In this case only the third partition of the first disk will be listed as it
is the only Linux partition (the Linux swap partition does not have the same
filesystem).


8- Copying an element
---------------------

This is the part executed when you use the -c option or select it when the
program asks you.

Execution follows the diagram below: 
            Support choice
                  |
                  V
        Source element choice
                  |
                  V
            [Part to save]
                  |
                  V
      Destination element choice
                  |
                  V
            Copying window
                  |
                  V
                 end


  a) Support choice:
Please refer to the same description in the "saving element" chapter (chapter
6.a).

  b) Source element choice:
Please refer to the same description in the "saving element" chapter (chapter
6.b).

  c) Part to save:
Please refer to the same description in the "saving element" chapter (chapter
6.c).

  d) Destination element choice:
Please refer to the same description in the "restoring element" chapter
(chapter 7.c) replacing all references to "file" by "element to copy".

  e) Copying window:
This window permits you to follow copying progress.
Upper progress bar is progress for the element being copied.
Lower progress bar is progress for the destination element.
Remaining time is an estimate of remaining time. Its accuracy is strongly
influenced by whether all sectors or only occupied sectors are copied.
Errors list is the list of errors that were found when reading sectors on the
element to be copied or when writing sectors on the destination element. If
some errors appear, it is advisable to use scandisk or an equivalent program
on the faulty element.
As long as the copy is running, you cannot press Ok button (only cancel button
is active to stop copying). Once copying is finished, Ok button becomes
active, cancel button inactive and line marked "State" changes from "Running
..." to "Ended.".

!!!!! Warning !!!!!:
--------------------

  - Once the element is copied, restart your computer if you have restored a
    DOS partition (or a partition that can be accessed under DOS). This is
    needed for DOS to update information about this partition. This is not
    needed with Windows and Linux versions.
  - If you cancel a running copy, you must reformat the destination element
    (or do a new copy or restoration on it).
  - Please read chapter 7.d remarks to know what shall be performed after copy
    in some cases.

  f) Examples:
Take the same partitioning presented above in the examples of saving a
partition, and now you want to copy the partition containing the D: drive onto
the partition containing the E: drive (assuming that size is compatible).
For that purpose, you run savepart -c and:

  - select the second hard drive,
  - select the first partition,
  - choose to copy only occupied sectors (for the copy to be possible on a
    partition that has a different format from the original),
  - choose the destination partition. The partitions containing C:, E: and G:
    drives will be listed if their size is compatible. Partition containing D:
    drive will not be listed, as it is the partition to be copied. Partition
    containing F: drive will not be listed, since it does not have the same
    filesystem type.

From this point, copying begins. Once this is ended, reboot your computer.


9- Copying a backup file
------------------------

This is the part executed when you use the -d option or select it when the
program asks you.

This part allows you copying files, modifying their compression rate or
maximum size. In case backup files contains all sectors of a disk or a
partition, you can copy only a partition or occupied sectors of the partition
(such as you can restore obtained files on another partition than the source
one).

Execution follows the diagram below: 
                       First file choice
Contains all sectors          |    Contains occupied sectors
           +------------------+------------------+
           V                                     |
   Ask for extraction                            |
           |    No extraction                    |
           +------------------------+            |
Extraction |                        |            |
           V                        |            |
   Source files check               |            |
           |                        |            |
           V                        |            |
  Part to copy choice               |            |
           |                        |            |
           +------------------+-----+------------+
                              |
                              V
                  First destination file choice
                              |
                              V
                            Copy
                              |
                              V
                             End


Program begins with asking you the source filename (please read chapter 7.a).

If file contains a backup of all sectors, program asks if you want to extract
a partition (in case of a disk backup) or occupied sectors (in case of
partition, floppy disk or DOS device backup).

If you choose to extract a part of the file, program asks all backup files to
check them. For the remaining part of execution, all these files shall be
accessible simultaneously. It is better to avoid using this option in case the
saving signalled some bad sectors. Once files are checked, program asks what
you want to copy (this is similar to chapters 6.b to 6.d), then performs copy
with simulating a saving (as into chapters 6.e to 6.h).

In case you do not choose to extract a part of the file, or if you have no
choice, program asks the name and maximum size of the destination file and its
compression rate (please read chapters 6.e, 6.f and 6.g), then copy begins.
The copying window displays progress for the source file with the upper
progress bar and progress for the destination file with the lower progress
bar. If several source or destination files are necessary, they will be asked
of you when they are needed.

Remarks:
--------

  - Only files created by this program can be used with this feature.
  - The program checks that the destination file does not have the same name
    as the source file to avoid the source file being erased before being
    copied. Nevertheless, it cannot check that the destination file erases
    another source file other than the one in use, so be careful not to
    confuse source and destination file.
  - You can use any other compression program to do this, but you will have to
    decompress the files before being able to use them with this program, that
    is not the case for this option.


10- Verifying a backup file
---------------------------

This is the part that is executed when you use the -t option or select it when
the program asks you.

This permits verifying that backup files are valid. This verification consists
of checking file headers, size and checksum of data (once they are expanded if
they were deflated). If a saving was done in several files, you are obliged to
check all files. No data is written on disk or is modified inside the files.

Execution begins with asking source filename (please read chapter 7.a). The
checking window shows in the upper progress bar the state of the check for the
current file. If saving was done in several files, subsequent files will be
asked of you.


11- Updating Windows 2000/XP/Vista/Seven registry
-------------------------------------------------

This is the part that is executed when you use the -u option or select it when
the program asks you.

Windows 2000 and followings store partition position in the registry in order
to preserve association between a partition and its corresponding driver
letter. Partition position is composed of two parts and depends on partitions
table type:

  - for MBR partitions table, it is disk number that is stored into MBR (4
    bytes) and offset of first byte of partition on disk (8 bytes),
  - for GUID partitions table, it is disk GUID (Global Uniq IDentifier) and
    partition GUID that are stored into partitions table (16 bytes each).

So if you copy a partition onto another disk (without copying partitions
table) or if you move the beginning of a partition (for MBR partitions table),
you have to update the information in the registry for each partition that you
moved for Windows to be able to still use the same drive letter. In the case
of restoring a partition which has not been moved, this is not necessary.

Execution is composed of 2 parts: first, to designate where Windows is
installed so that the program can find the registry file; second, to give the
partition to be updated in this registry. If you copy the Windows
2000/XP/Vista/Seven partition, the Windows installation that should be updated
is the one that was the destination of the copy.

It shall be noticed that this option does not allow to create a new drive
letter into registry: you can only assign an already existing drive letter.
This is not a problem as the need for this option is to set the drive letter
of a source partition to the destination partition when restoring/copying to a
destination partition that is not the same than source one.
In case you need to create a new drive letter, you can either use the Windows
disk management tool (if it is not for the system partition) or edit registry
with booting with a WinPE or BartPE CD.

Execution follows the diagram below: 
    Support choice where Windows is installed
                        |
                        V
    Element choice where Windows is installed
                        |
                        V
      Directory where Windows is installed
 +--------------------->|
 |                      V
 |  Disk choice where partition to update is
 |                      |
 |                      V
 |        Partition to update choice
 |                      |
 |                      V
 |    Drive letter of partition to update
 |                      |
 |                      V
 |                Confirmation
 |                      |
 |                      V
 |         Change another drive letter ?
 |                  yes |
 +----------------------+
                        | no
                        V
                       end


  a) Support choice where Windows is installed:
You select the disk or DOS/Windows/Linux devices list where the Windows
installation whose registry should be updated is located.

  b) Element choice where Windows is installed:
You select the partition (if a disk has been chosen in the first window) or
the DOS/Windows/Linux device (if DOS/Windows/Linux devices have been chosen in
the first window) where the Windows installation whose registry should be
updated is located.

  c) Directory where Windows is installed:
You select the Windows installation directory. As a general rule, this
directory is called "WINDOWS", unless you specified another name when
installing it. If you give a wrong directory name, or if the installed Windows
version is not correct, you will get an error message telling you that the
registry file has not been found.

  d) Disk choice where partition to update is:
You choose the disk which has the partition whose registry definition you want
to update.

  e) Partition to update choice:
You choose the partition for which you want to update the definition in the
registry.

  f) Drive letter of partition to update:
This window shows a list of driver letters that can be modified with their
current definition. The first column is the drive letter, the second is the
disk identifier where the corresponding partition is located, and the third
column is the first byte of the partition on the disk. The last column
displays the two previous columns as given by regedit.
You must choose from this list the drive letter you want to be associated with
the partition selected with two previous windows. The program will modify the
corresponding definition for this letter with the values defined at the top of
the window.

  g) Confirmation:
The program asks you to confirmation the registry modification. It gives you
the key name that will be modified, its previous and new values. The value is
composed of 12 hexadecimal digits, the first four being the disk number, last
eight the offset of the partition on the disk (it is the same format as the
last column of previous window).

  h) Example:
                Disk 1                                 Disk 2
+------------------------------------+ +-------------------------------------+
| Main partition 1:                  | | Main partition 1:                   |
| Windows XP (C:)                    | | Windows XP (D:)                     |
+------------------------------------+ +-------------------------------------+
| Main partition 2:                  | | Main partition 2:                   |
| Extended partition                 | | Extended partition                  |
| +--------------------------------+ | | +---------------------------------+ |
| | Extended partition 1           | | | | Extended partition 1            | |
| | of main partition 2:           | | | | of main partition 2:            | |
| | Data (E:)                      | | | | Data (G:)                       | |
| +--------------------------------+ | | +---------------------------------+ |
| | Extended partition 2           | | +-------------------------------------+
| | of main partition 2:           | |
| | Swap file (F:)                 | |
| +--------------------------------+ |
+------------------------------------+
You have copied the Windows XP partition from disk 1 to disk 2. In this case,
drive letter of Windows XP on disk 2 shall be C: for this Windows to be able
to boot. So, you have to modify registry of Windows XP on disk 2 to swap drive
letters.
For this, you have to launch Partition Saving, choose the update registry
option, choose disk 2 and first partition as partition where Windows is
installed. Then you select first partition of first disk and give it the D:
letter. Then you launch Partition Saving again, again select first partition
of second disk as Windows partition, then select first partition of second
disk to give it the C: drive letter. If you copied also the data partition,
you have to perform the same thing for second partitions with drive letters E:
and G:.
Once you have performed this, if you boot with the first disk Windows XP, you
still have the same configuration as above (this one has not been modified).
But if you boot with the Windows XP on second disk, you get (considering you
also swap data partitions drive letters):
                Disk 1                                 Disk 2
+------------------------------------+ +-------------------------------------+
| Main partition 1:                  | | Main partition 1:                   |
| Windows XP (D:)                    | | Windows XP (C:)                     |
+------------------------------------+ +-------------------------------------+
| Main partition 2:                  | | Main partition 2:                   |
| Extended partition                 | | Extended partition                  |
| +--------------------------------+ | | +---------------------------------+ |
| | Extended partition 1           | | | | Extended partition 1            | |
| | of main partition 2:           | | | | of main partition 2:            | |
| | Data (G:)                      | | | | Data (E:)                       | |
| +--------------------------------+ | | +---------------------------------+ |
| | Extended partition 2           | | +-------------------------------------+
| | of main partition 2:           | |
| | Swap file (F:)                 | |
| +--------------------------------+ |
+------------------------------------+
Note: once you done this, it can be a good idea to give partitions a different
name to not mix them.


12- Updating Windows Vista/Seven boot configuration
---------------------------------------------------

This is the part that is executed when you use -w option or select it when the
program asks you.

In order to manage boot, Windows Vista/Seven store into a file which
partitions are bootable and where they are on disk following a way near the
one used to associate a drive letter to a partition. This is similar to the
way BOOT.INI works on Windows XP, but file cannot be edited because it is
binary.
This option allows you modifying information in case you moved a system
partition (either it is copied onto another disk, or its beginning position is
modified on disk) and you have Windows Vista/Seven installed on your computer.

Execution follows the diagram below: 
                  Bootable support choice
                             |
                             V
                  Bootable element choice
                             |
                             V
           Disk where partition to update is choice
                             |
                             V
                Partition to update choice
 +-------------------------->|
 |                           V
 |              Boot entry to update choice
 |                           |
 |                           V
 |                      Confirmation
 |                           |
 |                           V
 |                  Change another entry
 |                       yes |
 +---------------------------+
                             | no
                             V
                            end


  a) Bootable support choice:
This window permits you to choose on which support is file containing boot
configuration data. In most cases this file is on bootable partition of the
computer that is on first disk. This partition is often a small 100 Mb
partition that appears first on disk or the partition where Windows is
installed.
The file containing boot configuration is named "\Boot\BCD", you can check for
this file existence to know which support to choose (note: this file can be
hidden).

  b) Bootable element choice:
This window permits you to select partition on which boot configuration data
are.

  c) Disk where partition to update is choice:
This window permits you to select disk that contains partition that was moved
and that need an update of its boot information.
In most cases, only system partitions (those having a Windows installation as
Windows does not manage others systems) need such an update, those containing
only data do not need it.

  d) Partition to update choice:
This window permits you to select partition that was moved.

  e) Boot entry to update choice:
This window shows a list of boot entries that are defined with their current
configuration. Above list is the description of chosen partition: displayed
values will replace the ones in list for the selected entry.

The mostly encountered entries are the following:

  - Microsoft Windows Vista/Seven (Windows boot loader or any other name you
    chose): the Windows Vista/Seven installation. Normally this entry shall
    reference the partition where you installed Windows Vista/Seven.
  - Windows resume application: load of Windows when it is in hibernation
    mode. Normally this entry shall reference the partition where you
    installed Windows Vista/Seven.
  - Earlier version of Windows: managing another Windows version through
    multi-boot. Normally this entry shall reference the partition where the
    boot of other Windows installation is.
  - Windows boot manager: this is program managing computer boot and potential
    multi-boot configuration. Normally this entry shall reference the bootable
    partition (the one you chose into 12.a and 12.b chapters).
  - Windows memory diagnostic: this is program managing memory test. In most
    cases, this program is installed with boot manager, so this entry shall
    reference the same partition than this one.

As it is described above, several entries can reference the same partition. So
if you moved the corresponding partition, you have to update all these entries
one by one. What is described is a typical installation, you have to look at
current value of entries to know which ones are linked to the same partition.

If an entry appears with all its data to 0, this means there was incoherence
into its data or program gets a problem to read them. You have to be careful
when updating it, it can lead to some others incoherence.

If an entry appears with a name between "{...}", it means program was not able
to find its name and it uses the default one depending on entry type. If name
is "{Unable to get name}", it is that even entry type cannot be found.

If a window is shown before, informing you that all entries were not read,
these entries are not displayed and you cannot update them.

Example:
--------
The screenshot shows the case where Windows Vista was not installed on the
bootable partition (this can be deduced because two identifiers appear). If
you move the Vista partition, you have to update the 2 first entries, and if
you move the bootable partition, you have to update the 3 last entries.
If Windows Vista had been installed on the bootable partition, the 5 entries
would have the same identifier and you would have to update all of them if you
move the partition.

  f) Confirmation:
This window requests you if you confirm the modification of entry you chose.


13- Updating BOOTSECT.DOS/BOOTSECT.BAK file
-------------------------------------------

This is the part that is executed when you use -b option or select it when the
program asks you.

In order to manage multi-boot with another DOS or Windows version, Windows
XP/Vista/Seven saves the boot sector of other Windows versions into
BOOTSECT.DOS or BOOTSECT.BAK file on the same partition and modifies this boot
sector to set a new one (this one asks for the Windows version to run
depending multiboot configuration). If you choose to launch previous Windows
version, it reads the BOOTSECT.DOS/BOOTSECT.BAK content and run it.
Consequently, if you copy to another disk or move the begin of the partition
where the other Windows version is, this file needs to be modified to reflect
that. This option is for that purpose.

Warning: This option only modifies some parameters in
BOOTSECT.DOS/BOOTSECT.BAK to take into account changes that may have been made
in the boot sector; it does not allow creating or completing a
BOOTSECT.DOS/BOOTSECT.BAK file.

Execution allows choosing the partition on which BOOTSECT.DOS/BOOTSECT.BAK
file is located to update it according to the current boot sector of this
element. Execution follows the diagram below: 
Support choice where BOOTSECT.DOS/BOOTSECT.BAK file is
                     |
                     V
Element choice where BOOTSECT.DOS/BOOTSECT.BAK file is
                     |<-------+
                     V        |
                Confirmation  |
                     |        |
                     +--------+
                     |
                     V
                    end


  a) Support choice where BOOTSECT.DOS/BOOTSECT.BAK file is:
You have to choose disk, floppy disk or DOS/Windows/Linux devices list on
which is the BOOTSECT.DOS/BOOTSECT.BAK file to modify.

  b) Element choice where BOOTSECT.DOS/BOOTSECT.BAK file is:
You have to choose the partition (if a disk has been chosen in first window)
or DOS/Windows/Linux device (if DOS/Windows/Linux devices has been chosen in
first window) on which is the BOOTSECT.DOS/BOOTSECT.BAK file to modify.

  c) Confirmation:
The program asks you to confirm the BOOTSECT.DOS/BOOTSECT.BAK file
modification. If you confirm, it will be modified to update some parameters
according to those in the current element boot sector.
This confirmation is requested for each file to update (first BOOTSECT.DOS
then BOOTSECT.BAK). If one of them does not exist or has wrong format, you
will get an information or error message. As these files depends on which
Windows versions are installed, it is not always an error for one of these
files to not exist.
If you want to modify files others than default ones, you can give name of
file to modify by using "file=" option of options file.


14- Fixing disk physical definition into boot sector
----------------------------------------------------

This is the part that is executed when you use -a option or select it when the
program asks you.

This option permits you to change number of heads and number of sectors per
track that are stored into FAT and NTFS boot sector.
This can be needed in case you have a problem as "NTLDR missing" or "IO.SYS
not found" when booting and when you explore this partition you see these
files (if you do not see them, you need to copy them with using SYS program in
DOS/Windows 9x case or with using recovery console for Windows NT/2000/...).
This error can be generated because physical definition of disk into boot
sector is wrong (note: SYS and recovery console allow fixing this error also).

Execution follows the diagram below: 
    Support choice where fixing boot sector
                     |
                     V
      Element choice where boot sector is
                     |
                     V
      [Correction of first sector value]
                     |
                     V
       Choice of new physical definition
                     |  Using predefined value
         +-----------+-------------------------+
         |                                     |
         V                                     |
Giving manual values                           |
         |                                     |
         +-----------+-------------------------+
                     |
                     V
                Confirmation
                     |
                     V
                    end


  a) Support choice where fixing boot sector:
You have to choose disk, floppy disk or DOS/Windows/Linux devices list on
which is the partition or device for which boot sector shall be modified.

  b) Element choice where boot sector is:
You have to choose the partition (if a disk has been chosen in first window)
or DOS/Windows/Linux device (if DOS/Windows/Linux devices has been chosen in
first window) on which is the boot sector to modify.

  c) Correction of first sector value:
This window is displayed only if program finds that first sector value is
wrong in boot sector. This value gives number of sectors on disk that are
before the partition. In case this value is wrong, it can disallow the
partition to boot if it is a bootable one. If it is not a bootable one, this
has no consequence. In case you want to correct this value, you have to
confirm it. The change will be effective only if you do not cancel execution
in following windows.

  d) Choice of new physical definition:
This window displays current values of boot sector and a list of predefined
values. Content of this list depends on the support and the OS (some values
can be missing) and it is normal that these values are different (this is the
reason why fixing them in boot sector is needed).
These values can be:

  - Default numbers: these are values that Partition-Saving uses when it
    restores a backup on a partition different from the source one. For the
    DOS version, it is the standard values, for the Windows and Linux
    versions, it is values defined through partitions table.
  - Standard numbers: for the DOS version, they are numbers that are used when
    accessing disk through standard BIOS access (it is often the values used
    when booting). For the Windows version, they are either the standard BIOS
    numbers, either the default numbers used by Windows (it depends on Windows
    version). For the Linux version, it is values returned by the kernel.
  - Extended numbers: for the DOS version, they are numbers that are used when
    accessing disk through extended BIOS access. For the Windows version, they
    are either the extended BIOS numbers, either the default numbers used by
    Windows (it depends on Windows version). For Linux version, these numbers
    are not provided. These values are often wrong for a boot sector.
  - Numbers from partitions table: they are numbers that can be deduced from
    reading partitions table. These values can often be used for a boot sector
    (because of multiple ways to detect a disk, these values are often used as
    reference values when an OS cannot get the ones from BIOS).

This list ends with an option to enter manual values (see below) and an option
to keep current values (if you want to update first sector value without
changing heads/sectors numbers).

Note: using values different from standard numbers for a disk using standard
access is certainly a bad idea, because only these numbers shall be correct.

  e) Giving manual values:
These windows are displayed in case you choose last option into previous
window. They allow you to enter numbers you want in case no predefined value
seems correct. Giving bad values will in most cases not result in lost of data
(partition will not boot), but it is better to be cautious. Often correct
values are power of 2 (16, 32, 64, ...) or power of 2 less 1 (63, 255, ...).

  f) Confirmation:
The program asks you to confirm the boot sector modification. If you confirm,
boot sector and its copy (if there is one) will be modified.


15- Replacing a boot sector or a superblock by its copy
-------------------------------------------------------

This is the part that is executed when you use -k option or select it when the
program asks you.

This option permits you to replace a boot sector for a FAT/NTFS partition or a
superblock for an ext2/ext3/ext4 partition with its copy. FAT32, NTFS, ext2,
ext3 and ext4 filesystems define a copy of these sectors in order to be able
to repair a partition if origin sector is corrupted. You can try to use this
option if your partition appears suddenly as of "RAW" type instead of "FAT" or
"NTFS" in Windows.

Execution follows the diagram below: 
Support choice where copying boot sector/superblock
                     |
                     V
  Element choice where boot sector/superblock is
                     |
                     V
          Choice of copy to use
                     |
         +-----------+-------------------------+
         |                                     |
         V                                     |
Exploring partition                            |
         |                                     |
         +-----------+-------------------------+
                     |
                     V
                Confirmation
                     |
                     V
                    end


  a) Support choice where copying boot sector/superblock:
You have to choose disk or DOS/Windows/Linux devices list on which is the
partition or DOS/Windows/Linux device for which boot sector or superblock
shall be replaced by its copy.

  b) Element choice where boot sector/superblock is:
You have to choose the partition (if a disk has been chosen in first window)
or DOS/Windows/Linux device (if DOS/Windows/Linux devices has been chosen in
first window) on which is the boot sector or superblock to replace.

  c) Choice of copy to use:
This window gives list of boot sector or superblock copies that seem valid. In
most cases, this list is either empty (no found copy) or has one item only. If
several copies are found, it is better you explore partition (see next window)
for each of them to check which one is the correct one.
When choosing a copy, if it is identical to current sector, program stops its
execution as it does not need to update it. It shall be noticed that it is not
unusual to have a superblock copy different from current one (even if current
one is valid) because this one contains data that are updated with use (as
number of free blocks) and ext2/ext3/ext4 Linux driver does not always
maintain copy up-to-date.

  d) Exploring partition:
This window requests you if you want to explore partition with using the copy
of boot sector/superblock. This permits you to check if its content is valid
with using this copy. Exploring runs as described into chapter 19, partition
being mounted read only. When you exit exploration, you come back to this
execution.
Note: exploring partition being not available with command line interface
("-cui" option), this window does not appear in this case.

  e) Confirmation:
The program asks you to confirm the boot sector/superblock modification. If
you confirm, boot sector/superblock is replaced by its copy.
In ext2/ext3/ext4 case, as superblock copy can be not up-to-date, partition
checking is forced for the next time it will be mounted for the superblock to
be corrected.


16- Simulating an element
-------------------------

This section covers the use of the driver (DRVPART.SYS) and the options "-m"
and "-i" for savepart. The purpose of this driver is primarily to allow access
to a partition contained in a backup file in order to recover some files.
Note:
-----
Because of option to explore a backup (see chapter 20) that has more capacity,
this part is deprecated and will not be maintained in case of major change in
backup file format.

  a) Use of driver:
DRVPART.SYS is a DOS driver that allows simulating that a new drive letter is
present. This drive is simulated with a backup file created previously.
As with all DOS drivers, DRVPART.SYS must be loaded into memory with the help
of CONFIG.SYS. This text file is on the boot disk (either C: or A: depending
on whether you boot from hard disk or floppy disk). For the driver to be
loaded you have to add at the end of this file the line:
DEVICE=<path>\DRVPART.SYS <options>
where <path> is the directory where DRVPART.SYS is located. Once this line has
been added, the next time you boot your computer, you will have a new drive
(the drive letter is defined by DOS and is the next letter following those of
your last drive).
DRVPART.SYS can have 2 parameters:

  - the first gives sector size in bytes. It must be between 512 and 32768 and
    must be a multiple of 512. If this option is not given, a default size of
    512 bytes is used (that is the most common size).
  - the second gives the memory size in Kb that is allocated for running this
    program. This must greater or equal to 1024. If this option is not given,
    a size of 1024 Kb is used. If you want to use this option, you must give
    the sectors size.

Examples:
---------
DEVICE=C:\DRVPART.SYS
Driver is loaded with default values of 512 bytes for sectors size and 1024 Kb
for memory.
DEVICE=C:\DRVPART.SYS 512 4096
Driver is loaded with values of 512 bytes for sectors size and 4096 Kb for
memory.

Memory allocated by the driver is a memory block which allows temporarily
storing sectors requested by others programs. As needed, this size can
dynamically be increased/decreased (but never goes bellow the size defined
when loading). The worst case of memory use is certainly when a program wants
to know free space on the drive (as when you do a "dir").
Memory used by the driver is XMS or EMS memory (depending on what is present).
These are standard memory types (you do not need specific hardware) called XMS
or EMS depending on the way it is managed. XMS memory is managed by HIMEM.SYS
driver (a DEVICE=<location>\HIMEM.SYS line has to be present at the beginning
of the CONFIG.SYS file) and EMS memory is managed by EMM386.EXE driver (or
some other that does the same thing) (a DEVICE=<location>\EMM386.EXE line has
to appear in CONFIG.SYS file just after the one containing HIMEM.SYS). If
neither of these two types of memory is present, driver will not be loaded.
Note that using EMS memory can limit useful memory size to 32 Mb.
Driver can generate following messages when loading:

  - "Driver has been initialised. It simulates drive <letter>:.": The driver
    has been correctly loaded and it simulates a drive having letter <letter>.
  - "Parameter for size of sectors is not correct: it must be between 512 and
    32768 and be a multiple of 512.": You must modify the first parameter in
    the line from CONFIG.SYS file to give a correct value.
  - "Parameter for allocated memory size is not correct: it must be bigger
    than 1024.": you have to modify the second parameter in the loading line
    from CONFIG.SYS file to give a correct value.
  - "Memory cannot be allocated: you need XMS or EMS memory.": The driver did
    not find EMS or XMS memory. You have to add into your CONFIG.SYS file at
    least the line that allows loading XMS memory.

If one of the last three messages is displayed, the driver is not loaded.

  b) Simulating an element:
Once the driver is loaded into memory, "-m" and "-i" options of savepart can
be used (or associated actions appear in lists of actions if you do not
specify an action option).
The first option ("savepart -m") or the choice "Simulate an element" in
actions allows you to give the list of files to use in order to simulate the
element they contain. Execution is done in the same way as when testing a
backup file (chapter 10). Once execution has correctly ended, you will be able
to use the added drive through the driver as if it is the partition that is in
the backup file (If no element is simulated, accessing this drive returns an
error).
The second option ("savepart -i") or the choice "Get information from driver"
in actions allows getting information from driver (drive simulated, sector
size and files used if an element is simulated) and stopping simulating an
element if there is one simulated.
When simulating an element, more EMS/XMS memory can be needed by the driver.
Unfortunately running savepart when only XMS memory is available means that
savepart uses the whole memory and it is not possible to allocate more memory
for the driver. In this case you will certainly get a "You do not have enough
EMS or XMS memory: <n> Kb free memory are needed." error. In this case you
have to use the ALLOCXMS.COM program giving it <n> as a parameter in order for
memory to be allocated before running savepart, then you can run savepart
again (example: ALLOCXMS.COM 1024 will allocate 1024 Kb memory). As this size
depends on the partition simulated, it cannot be be known (and so allocated)
sooner. ALLOCXMS can display following messages:

  - "Memory allocated": memory has been allocated and you can run savepart
    again.
  - "DrvPart driver cannot be found": you have forgotten to load the driver
    into your CONFIG.SYS file (note: in this case, options to manage drive
    simulation are not available into savepart).
  - "DrvPart driver into memory has not the same version as AllocXMS":
    versions of DRVPART.SYS and ALLOCXMS.COM are not the same. You must use
    programs having the same version (it is true also for savepart).
  - "An element is currently simulated": you have to stop simulating the
    element by using "Stop simulating element" button into the window giving
    information on driver into savepart.
  - "XMS memory driver cannot be found": you do not have loaded a XMS driver
    into your CONFIG.SYS file, so you cannot use XMS memory.
  - "Parameter is not correct": given parameter is not correct: it must be a
    positive integer.
  - "Such an amount of memory cannot be allocated": XMS driver does not allow
    allocating such an amount of memory. If this size is not over memory
    available into your computer, using a more recent driver or not using EMS
    memory can solve this problem.

  c) Remarks:

  - This driver allows simulating only FAT elements or elements where all
    sectors were saved. In this last case, the fact that it is a FAT element
    is not checked, but DOS will certainly refuse to access it if that is not
    the case.
  - Files used for simulation must not be compressed.
  - All files used have to be always accessible to avoid an error (example: if
    files are on several CDs, you must have either several CDs readers or copy
    the files on your hard disk for them to be read simultaneously). First
    files will be used more often than last file, so put them on the faster
    support.
  - simulated element is set as read-only. So all attempts to write on them
    will generate an error. If you get an error like "Unable to write on drive
    <letter>" with letter equal to the simulated drive, you have to answer
    "Fail".
  - This driver can be run only in DOS mode. If Windows is started, it frees
    used memory and deactivate itself. Under Windows you will get a new drive,
    but you cannot use it.
  - Using the driver will slow your computer and use memory. So it is better
    to use it only when you need it (so modify your CONFIG.SYS file each time
    or better yet use a special floppy disk).
  - Accessing a simulated drive is a lot slower than accessing other drives.
  - The driver will run correctly only for programs that use peripherals in a
    standard way. Naturally, some specific programs generate errors.
  - If a program terminates in an abnormal way, it can leave the driver in an
    incorrect state (trying to access simulated drive generates an error). In
    this case, you just have to run and quit any program for the simulated
    drive to be accessible again.
  - The driver can increase memory use depending on its need. If a program
    uses all available memory (savepart is one when only XMS memory is
    present), you can get errors when accessing the simulated drive. In this
    case try increasing the permanently used memory size with the second
    parameter on the loading line of DRVPART.SYS in the CONFIG.SYS file.
    Obviously this will take effect only at the next boot of the computer.
  - When using savepart, access to simulated drive is deactivated.
  - If you want to simulate an element other than the one being simulated, you
    don't need to run savepart a first time to stop simulating the element,
    then a second time to simulate a new one. You can directly choose to
    simulate the new one (it will stop simulating the first one). This implies
    that it is not possible to simulate several elements simultaneously (even
    with loading driver several times).
  - You cannot run a program that is on the simulated drive. You have to copy
    it onto another drive first.
  - Driver, savepart and allocxms versions must be the same. This is why they
    all have the same version number. This version number is checked when
    these programs work together and they do not communicate if versions are
    not the same.
  - Because a new drive is created, the letter assigned to your CD reader can
    be changed.
  - DRVPART.SYS is not needed to run savepart. You only need to use it if you
    want to use options to simulate an element.


17- Creation of files on NTFS drive
-----------------------------------

This option appears only when you are running the program under Windows NT and
following. It allows you to create a file on a NTFS partition which can be
used as a backup file by using partition mounting once you are running from
DOS. This is due to fact that the program is not able to create files on a
NTFS partition (only to read/write and resize) when it runs from DOS, so files
you create here serve as a base. This option asks you names of files to be
created until you hit the 'Cancel' button. If you use automatic naming,
instead of asking you several files, it asks number of files you want to
create.

Remarks:
--------

  - You need to create enough files to be able to store saving result. To have
    an idea of how many files are needed, take the partition size (only
    occupied part in case you want to save occupied sectors only), divide it
    by 2 in case you use compression, divide it by maximum size you want files
    to do then round result up and add 2 to it (3 in case you think you will
    create the option file).
  - Created files are only between 4 Kb and 64 Kb, so do not be afraid to
    create too much files.
  - You can use files that were created elsewhere (as long as they do not use
    internal NTFS encrypting and compression feature) without using this
    option. Their content will obviously be erased when performing saving.
  - Remaining free size on drive is given as information. It is wrong in case
    more than 970 Mb is available on drive.

Example:
--------
You want to save a partition with 4 Gb data into 680 Mb files (to be able to
burn them) with using partition. In this case you will have to create: 4*1024
/ 2 / 680 = 3.011 => 6 files.


18- Reset bad sectors in filesystem
-----------------------------------

This is the part that is executed when you use -z option or select it when the
program asks you.

This option allows removing that sectors are marked as wrong on a filesystem.
It does not allow correcting bad sectors, it shall only be used in case you
restore/copy a partition with bad sectors on another hard drive. This is
automatically done by program when restoring but in case where source and
destination disks and partitions are identical: in this case program thinks it
performs restoration on the saved partition and so does not reset bad sectors
information.

So this option shall only be used in one case: the one where you got an "X"
into the "Idem" column on restoring/copying even when disk is not the same as
the source one.

Notes:
------

  - This option is obviously useful only in case you have some bad sectors on
    a partition.
  - In case you restore partition on a disk that still has some bad sectors
    (as when restoring after resizing a partition), you have to perform a
    surface test to update bad sectors list of partition.

Execution follows the diagram below: 
 Support choice where bad sectors shall be removed
                         |
                         V
 Element choice where bad sectors shall be removed
                         |
                         V
                    Confirmation
                         |
                         V
                     Execution
                         |
                         V
                        end


  a) Support choice where bad sectors shall be removed:
You have to choose disk, floppy disk or DOS/Windows/Linux devices list where
filesystem to modify is.

  b) Element choice where bad sectors shall be removed:
You have to choose partition (if a disk was selected into first window) or
DOS/Windows/Linux device (if DOS/Windows/Linux devices list was selected into
first window) on which bad sectors information shall be removed.

  c) Confirmation:
Program asks for you confirmation of filesystem modifications. If you confirm,
all bad sectors will be marked as valid back.

  d) Execution:
Filesystem modification is running. Depending on filesystem type and partition
size this can need more or less time (faster being for ext2 partition and
slower for FAT partitions).


19- Explore a partition
-----------------------

This is the part that is executed when you use -e option or select it when the
program asks you.

This option allows you navigating into a partition to copy or edit some of its
files.
Execution follows the diagram below: 
      Choice of support where partition to explore is
                         |
                         V
           Choice of partition to explore
                         |
                         V
+---------------> Exploration window
|                        |
|     +------------------+----------------------+
|     |                  |                      |
|     V                  V                      V
| View window        Edit window         Copy destination
|     |                  |                      |
|     |                  |                      V
|     |                  |                Copy execution
|     |                  |                      |
+-----+------------------+----------------------+


  a) Choice of support where partition to explore is:
You have to choose disk, floppy disk or DOS/Windows/Linux devices list where
filesystem to explore is.

  b) Choice of partition to explore:
You have to choose partition (if a disk was selected into first window) or
DOS/Windows/Linux device (if DOS/Windows/Linux devices list was selected into
first window) you want to explore.

  c) Exploration window:
This window is the explorer window. It contains following items:

  - on top: current explored directory name.
  - on left: directory tree of the partition. You can click on '+' or '-'
    characters (or hit the '+' or '-' key) that are before a directory name to
    expand or collapse it. In case you double click or hit Enter on a
    directory name, it becomes the current explored directory.
  - on right: content of current explored directory. This is the list of all
    files that are part of this directory. This part contains 4 columns:

    * filename without its extension.
    * file extension.
    * file type or file size in case of standard file. File type can be:

      + <DIR>: directory.
      + <LINK>: symbolic link.
      + <BLOCK>: block device.
      + <CHAR>: character device.
      + <PIPE>: named pipe.
      + <SOCK>: socket.
      + <UNKNOWN>: unknown file type (it shall not appear).

    * file modification date.

    In case you double click (or hit Enter) on a directory, it becomes the
    current explored directory. In case it is on a file, it is edited.
  - on bottom left: buttons that can be used to perform something. Number
    before button name is the corresponding function key that can be used to
    activate it (1: F1, 2: F2, ...). Buttons are:

    * help: it displays some help.
    * sort: it allows selecting which column is used to sort displayed files.
    * select: it allows selecting file with using some matching pattern (as
      "*.exe" to select all files with "exe" extension). Selection can be done
      with ignoring or taking into account case and with keeping current
      selected files to be able to select several files sets.
    * view: it displays selected file into a hexadecimal viewer. Only one file
      shall be selected to enable this action. In case file contains several
      streams, it requests which stream shall be viewed.
    * edit: it edits selected file with a simple editor. In case file contains
      some binary content or is too big to fit in memory, the hexadecimal
      viewer is used instead. Only one file shall be selected to enable this
      action. In case file contains several streams, it requests which stream
      shall be edited.
    * copy: it copies selected files to some other directory. In case only one
      file is selected, it allows renaming it.
    * exit: to exit program.

  - on bottom right: it displays number of selected files and number of files
    into current directory.

  d) View window:
This window is a simple hexadecimal viewer to view file content. Actions that
can be performed in this viewer are:

  - go to a byte offset into file by using F3.
  - search for text into file. Search can be done either in ASCII mode by
    using F4 or in binary mode by using F6. Search can be performed with
    ignoring or taking case into account and with searching from beginning or
    from current cursor position. In case of binary search, text to search
    shall be enterred in hexadecimal form with a list of hexadecimal numbers
    between 0 (0 in hexadecimal) and 255 (ff in hexadecimal) separated by
    spaces (example: 4c 4C 52 12 35 4D) (note: 4c and 4D values are
    equivalent).
    During search, "Searching ..." is displayed at bottom right and it can be
    interrupted at any time with hitting the "Esc." key.
  - search next occurrence of latest searched text from current cursor
    position by using F5. Search does not wrap, so it ends at last occurrence.
  - quit viewer by using F10.

  e) Edit window:
This window is a simple text editor. You can modify a file then save changes
you made. This window is composed of:

  - on top: edited filename with selected stream name between '{' and '}' in
    case you do not edit default stream.
  - on middle: editing window.
  - on bottom left: buttons that can be used to perform some specific actions.
  - on bottom right: there are four indicators and current cursor position.
    Indicators are:

    * if editor is in insert mode (first indicator is set to 'I') or in
      overwrite mode (it is set to 'O').
    * if file has been modified since last save: second '-' is set to 'M'.
    * if some undo action can be performed: third '-' is set to 'U'.
    * if some redo action can be performed: fourth '-' is set to 'R'.


Actions that can be performed in this editor are:

  - edit the text.
  - toggle from insertion mode (underline cursor, default) to overwrite mode
    (block cursor) (and vice-versa) by pressing the Insert key.
  - select some text either with mouse or with pressing Shift key with moving
    keys.
  - copy selected text into clipboard by using Ctrl+C or Ctrl+Insert (last
    copied text remains into clipboard when editing another file).
  - cut selected text into clipboard by using Ctrl+X or Shift+Delete.
  - paste text from clipboard by using Ctrl+V or Shift+Insert.
  - undo last change by using Ctrl+U.
  - redo last change by using Ctrl+R.
  - save the file by using F2. The filename where to perform save will be
    requested each time (so it is a "save as" action). In case file contains
    several streams, it requests stream where file shall be saved.
  - go to a specific line by using F3.
  - search for some text by using F4. Search can be performed with ignoring or
    taking case into account and with searching from beginning or from current
    cursor position.
    During search, "Searching ..." is displayed in place of cursor position
    and it can be interrupted at any time with hitting the "Esc." key.
  - search next occurrence of latest searched text from current cursor
    position by using F5. Search does not wrap, so it ends at last occurrence.
  - exit editor by using F10. In case file has been modified without being
    saved, it requests if you want to save it before.

  f) Copy destination:
This window permits you to choose where to copy selected files. In case you
have selected one file that is not a directory, you can give it another name,
else you can only give the directory where all files will be copied.

  g) Copy execution:
This window shows files being copied and encountered errors.
Above the "->" line is the source file name in relative from source directory
and below this line is the destination file name in relative from destination
directory. In most case these two names are the same unless you copy from a
partition with long filenames to a partition that does not support them (by
using DOS access): program will use short names from corresponding long names,
but it does not ensure that on destination partition this short name
corresponds to the same file as the one from source partition. In this case it
is better to use mounting mechanism to access FAT partition with enabling long
names.
List of errors program gets is below the copied file names.
In case program found you try to copy a file to an existing file it asks if
you want to overwrite it. A second check is done in case file is read-only.
When copy ends, the "Ok" button becomes active and the "->" line is changed
into a message to signal if copy ends or was cancelled before (either because
you cancel it or because of some fatal error).
Notes:
------

  - unless using the Windows version, copying to a NTFS partition does not
    allow creating files, so only already existing files have their content
    modified (all streams are modified if they already exist).
  - copying to an ext2 partition set files permissions to those of source user
    in case copy source is an ext2 partition, else it is destination directory
    permissions (less execution flag for standard files) that are set.
  - when copying a sparse file from a NTFS or ext2/ext3/ext4 partition,
    destination file does not keep the information that file is sparse, so it
    occupies more space than on source partition.
  - when copying files from a NTFS partition, additional streams are copied if
    destination file is on a NTFS partition.
  - when copying files from a NTFS or ext2 partition, extended attributes
    (rights that come in addition to standard ones (EA and ACL)) are not
    copied.


20- Explore a backup
--------------------

This is the part that is executed when you use -v option or select it when the
program asks you.

This option allows you navigating into the content of backup files such as you
can extract some files. It does not allow modifying file content.

Files that can be explored are all those containing either a disk (you have to
select a partition), or the backup of a partition with a FAT12/16/32, NTFS or
ext2/3/4 filesystem. If backup was made in several files, all files shall be
readable at the same time. Files can be compressed or not.

Execution is the same as for chapter 19 but with the a) and b) steps replaced
with ask and check of all backup files (similar to chapter 10).

Notes:
------

  - When exploring compressed files, a lot of memory is used to index them to
    improve access time. More memory you have, better it is. It shall be
    noticed that available memory can be limited in DOS (as no more than 32 Mb
    with some EMM386 versions), so it is better to run this option from
    Windows or Linux.
  - If you get an "Error: could not allocate page table memory" error, it
    means that program tries to use too much memory. You can try increasing
    the free DOS memory size with not loading unneeded drivers, and at least
    resort use the "max_mem_size" option (see chapter 23).


21- Create files marking drive to use
-------------------------------------

This option allows creating marking files that can be used with "-fp", "-fd"
or "-ff" options. These files are some standard empty files or files
containing options (with same format than for options file) that are used by
program to retrieve a partition on backup/restore. This is a workaround to the
fact that drive name can be different depending on used OS (this means that
the C:\ drive within DOS can be different from the C:\ drive within Windows).
You have to provide a unique file name among all partitions (for a given
directory) such as the partition where this file is can be identified.
Running of this option is done in three steps:

  - First window allows giving path and name of file marking partition to
    save/restore. This file can be used with the "-fp" or "-fd" option. If you
    cancel this window, file is not created and you enter the next window.
  - Second window allows giving path and name of file marking partition where
    backup files are. This file shall have a name different from first one,
    even if you plan to save partition on itself. It can be used with the
    "-ff" option. Path and name of this file are used as base for path and
    name of backup files: these files will be created (or read) into the same
    directory with modifying extension by a number (as with using automatic
    naming option) (unless you provide another filename through the "file="
    option of options file).
  - Third window allows giving maximum size each backup file can be. It
    appears only if you provided a filename into previous window.

If program detects that partition where backup files are uses NTFS filesystem,
it automatically creates some empty files (as into chapter 17) for them to be
used. Number of files is computed depending on free size on source partition
and of maximum size you provide with considering compression is used. If it
finds that some files with the same name already exist, it will ask you to
confirm before overwriting them.

Once these files have been created, you can use the program on another OS with
following command line: "savepart -fp <name of first file> -ff <name of second
file>. In both cases, name shall not contain a drive name ("marker.par" and
not "C:\marker.par"). It will scan all partitions to find these two files and
all drives for second file (in case it is on a CD). If it finds only one
occurrence of each file, it asks you to confirm the found place (unless you
used the "-fnc" option) then perform backup or restore depending on what you
request to do. If it does not find one of the files or find one on more than
one partition, it does nothing with asking you to fix this first.

Notes:
------

  - It is better to use a DOS naming (8.3, meaning a name of at most 8
    characters followed by a dot and an extension of at most 3 characters) for
    search through drives to work correctly on DOS.
  - You can enter into one file some options as for an options file (as an
    example, program put maximum size you enter into file marking partition
    where backup files are).
  - If you do not provide some options, following options will be used as
    default: automatic naming, compression with a level of 5, maximum file
    size of 690 Mb, backup of partition without swap files (and on itself if
    both files are on same partition).
  - "-fd" option is similar to "-fp" one (both cannot be used together) but
    does not search partition to save/restore in the same way (it is as if you
    choose a device instead of a disk when being asked for a support). It can
    be used when saving/restoring dynamic disk with Windows and Linux
    versions.
  - If you perform a backup with these files, you can reuse them to perform
    restoration with using same command line. You can also reuse them to
    perform another backup (but backup files will be overwritten).
  - You can provide only one of the two files if you want. Program will ask
    you partition to save/restore or backup file name in the standard way.


Example:
--------
If you want to save your C:\ drive to files on the E:\ drive, you can create a
"backup" directory on both of them (that avoids getting files in root
directory), then launch savepart, choose to create marker files and give for
first file "C:\backup\diskc.par" and for second file "E:\backup\diskc.fil"
(for the maximum size, choose the one you want depending on what you will do
with obtained files). Then you can boot back to DOS (or with a BartPE or Linux
CD) and launch savepart with "savepart -fp backup\diskc.par -ff
backup\diskc.fil". When you choose to "Save an element", program will scan
disks for the given files and if it finds them, it will save the content of
C:\ drive (that can have another name or do not appear in this OS) to
E:\backup\diskc.f00, E:\backup\diskc.f01, ...
If you want to burn obtained files to a CD/DVD, you can copy all obtained
files on root directory of CD with copying also the "diskc.fil" file on first
CD (but on root directory also, not into a "backup" directory). Then with
using this CD, you can launch "savepart -fp backup\diskc.par -ff diskc.fil"
and program will use file on CD. If you had created a "backup" directory on CD
with putting the "diskc.fil" in it, you would have launched "savepart -fp
backup\diskc.par -ff backup\diskc.fil" but in this case program will complain
that if finds two "backup\diskc.fil" markers (one on the E:\ drive, the other
one on the CD).


22- Load an options or marker file
----------------------------------

This option allows you to load an options file if you did not used the "-f"
option on command line or a marking file if you did not used the "-fp", "-fd"
or "-ff" option. Once this option has been used, you come back to the screen
to select what you want to perform.

First window requests you what you want to load depending on which option you
already provided (so if you used the "-f" option or already loaded the options
file, this option will no more appear in list, but options to give marker
files will still appear).
If you choose one of the marker file options, you can enter its name without
its drive name (as "marker.par", not "c:\marker.par"). Program will not search
it at once, but only when it needs it (so do not be surprised if it does not
complain at once if it does not find it).
If you choose option to load options file, you can select it. You can see its
content to check it with the "View file" button. When loading file through
this option, following options are ignored:

  - mouse=
  - user_interface=

as user interface was already initialised.
lang= option is ignored if this one was set from command line.
mount= options can be ignored if you mount some support to load options file
and mount numbering does no more agree (in this case a message is displayed
and files linked to this mount and following ones are ignored).
Less for these options, behaviour is the same as if you used the "-f" option
on command line.


23- Options file contents
-------------------------

The options file allows you to restore (or save again) element you have saved.
When using savepart with the -f <options file name> option, the various
parameters are read from the file instead of being asked of you. Contents of
this file can be partial (not covering all the options, in which case missing
parameters will be asked), but in this case some rules described below must be
followed.
The options file is a text file that allows options to be specified. Each
option must be alone on a line.
If the line begins with ";", its a comment line (it is not analysed).
Option content can be defined with an environment variable. In that case, the
environment variable must be given between % (example: file=%CONF%.PAR, %CONF%
will be replaced by the content of the CONF environment variable). If the
environment variable does not exist, an error will be generated. To be able to
give the % character inside option contents, you have to double it (example:
file=WITH%%.PAR, the file name would be WITH%.PAR).

Options have <option name>=<option value> format. Name and value of each
options are the following:

+-------------------+-----------------------------+--------------------------+
|      Option       |           Values            |      Default value       |
+-------------------+-----------------------------+--------------------------+
| mouse             | yes|no|poll                 | yes                      |
|                   +-----------------------------+--------------------------+
|                   | Choice of the method of using the mouse (same as       |
|                   | -cm|-nm|-pm option on command line).                   |
|                   | Please read command line option description to get     |
|                   | more details.                                          |
+-------------------+-----------------------------+--------------------------+
| check_drive       | yes|no                      | yes                      |
|                   +-----------------------------+--------------------------+
|                   | Verification that created/read file is not on          |
|                   | saved/restored element is disabled when set to "no"    |
|                   | (same as -ncd option on command line).                 |
|                   | Please read command line option description to get     |
|                   | more details.                                          |
+-------------------+-----------------------------+--------------------------+
| verify_free_size  | yes|no                      | yes                      |
|                   +-----------------------------+--------------------------+
|                   | Verification of free remaining size on destination     |
|                   | drive is not done when set to "no" (same as -ncs       |
|                   | option on command line).                               |
|                   | Please read command line option description to get     |
|                   | more details.                                          |
+-------------------+-----------------------------+--------------------------+
| verify_disk_write | yes|no                      | yes                      |
|                   +-----------------------------+--------------------------+
|                   | Verification that sectors are correctly written is     |
|                   | disabled when set to "no" (same as -nvd option on      |
|                   | command line).                                         |
|                   | Please read command line option description to get     |
|                   | more details.                                          |
+-------------------+-----------------------------+--------------------------+
| verify_file_write | yes|no                      | yes                      |
|                   +-----------------------------+--------------------------+
|                   | Verification that files are correctly written is       |
|                   | disabled when set to "no" (same as -nvf option on      |
|                   | command line).                                         |
|                   | Please read command line option description to get     |
|                   | more details.                                          |
+-------------------+-----------------------------+--------------------------+
| test_disk_size    | yes|no|<number>             | no                       |
|                   +-----------------------------+--------------------------+
|                   | This option allows trying to detect disk size if it is |
|                   | set to "yes" (same as -tds option on command line).    |
|                   | Please read command line option description to get     |
|                   | more details.                                          |
|                   | If a number is given, it is number of disk for which   |
|                   | trying to detect disk size. In this case, this option  |
|                   | can be given several times with different numbers.     |
+-------------------+-----------------------------+--------------------------+
| lang              | en|fr|fr_2                  | automatic detection      |
|                   +-----------------------------+--------------------------+
|                   | Language choice (same as -l option on command line).   |
|                   | Please read command line option description to get     |
|                   | more details.                                          |
+-------------------+-----------------------------+--------------------------+
| utf8              | yes|no                      | automatic detection      |
|                   +-----------------------------+--------------------------+
|                   | Forces use or not use of UTF-8 terminal capability in  |
|                   | Linux version.                                         |
+-------------------+-----------------------------+--------------------------+
| user_interface    | console|text|text_bios|     | text                     |
|                   | text_ext|text_bios_ext      |                          |
|                   +-----------------------------+--------------------------+
|                   | User interface choice (same as                         |
|                   | -cui|-tui|-bui|-tuix|-buix option on command line).    |
|                   | Please read command line option description to get     |
|                   | more details.                                          |
+-------------------+-----------------------------+--------------------------+
| disk              | <number>                    | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the disk number to use. This number must be      |
|                   | between zero and the number of disks minus one. When   |
|                   | saving, this option replaces the first window. When    |
|                   | restoring, this option restricts the search of         |
|                   | elements to be restored, to elements of the given disk |
|                   | (otherwise, the element is searched for on all the     |
|                   | disks). When updating Windows 2000/XP/Vista/Seven      |
|                   | registry or updating boot configuration data, this     |
|                   | option replaces the choice of the second disk (the one |
|                   | that contains partition to update). When updating      |
|                   | BOOTSECT.DOS/BOOTSECT.BAK files, this option replaces  |
|                   | the choice of support where these files are.           |
|                   | This option cannot be given if "floppy", "device",     |
|                   | "raw_file" or "new_raw_file" option is given.          |
+-------------------+-----------------------------+--------------------------+
| floppy            | <number>                    | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the floppy drive number to use. This number must |
|                   | be between zero and number of floppy drives minus one. |
|                   | When saving, this option replaces the first window.    |
|                   | When restoring, this option restricts the search of    |
|                   | elements to be restored, to elements of the given      |
|                   | floppy drive (otherwise, the element is searched for   |
|                   | on all floppy drives). When updating                   |
|                   | BOOTSECT.DOS/BOOTSECT.BAK files, this option replaces  |
|                   | the choice of support where these files are.           |
|                   | This option cannot be given if "disk", "device",       |
|                   | "raw_file" or "new_raw_file" option is given.          |
+-------------------+-----------------------------+--------------------------+
| device            | DOS/Windows: A-Z            | asked to user            |
|                   | Linux: <block device>       |                          |
|                   +-----------------------------+--------------------------+
|                   | Gives the DOS/Windows device letter or Linux device    |
|                   | file to use. When saving, this option replaces the     |
|                   | first two windows. When restoring, this option         |
|                   | restricts the search of elements to be restored, to    |
|                   | elements of the given device (otherwise, element is    |
|                   | searched for on all DOS devices). When updating        |
|                   | BOOTSECT.DOS/BOOTSECT.BAK files, this option replaces  |
|                   | the choice of support where these files are.           |
|                   | This option cannot be given if "disk", "floppy",       |
|                   | "raw_file" or "new_raw_file" option is given.          |
+-------------------+-----------------------------+--------------------------+
| raw_file          | <filename>                  | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives name of raw file to use. When saving, this       |
|                   | option replaces the two first windows. When restoring, |
|                   | this option reduces search for items to restore that   |
|                   | correspond to saved one, to given file with expecting  |
|                   | it to already exist for it to be updated. When         |
|                   | updating BOOTSECT.DOS/BOOTSECT.BAK file, this option   |
|                   | replaces search for support where these files are.     |
|                   | This option cannot be given if "disk", "floppy",       |
|                   | "device" or "new_raw_file" option is given.            |
+-------------------+-----------------------------+--------------------------+
| new_raw_file      | <filename>                  | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives name of raw file to use. When saving, this       |
|                   | option replaces the two first windows. When restoring, |
|                   | this option reduces search for items to restore that   |
|                   | correspond to saved one, to given file with creating   |
|                   | or overwriting it. When updating                       |
|                   | BOOTSECT.DOS/BOOTSECT.BAK file, this option replaces   |
|                   | search for support where these files are.              |
|                   | This option cannot be given if "disk", "floppy",       |
|                   | "device" or "raw_file" option is given.                |
+-------------------+-----------------------------+--------------------------+
| main_part         | <number>                    | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the number of the main partition to use. This    |
|                   | number must be between 1 and 4 for MBR partitions      |
|                   | table, 1 and 4294967295 for GUID partitions table. If  |
|                   | the element to save/restore is directly related to a   |
|                   | disk, this option must not be given.                   |
|                   | For this option to be used, "disk" option must be      |
|                   | given.                                                 |
+-------------------+-----------------------------+--------------------------+
| ext_part          | <number>                    | asked to user if         |
|                   |                             | "main_part" is not       |
|                   |                             | given, 0 else            |
|                   +-----------------------------+--------------------------+
|                   | Gives the number of the extended partition to use.     |
|                   | This number must be between 1 and the number of        |
|                   | extended partition corresponding to main partition. It |
|                   | can be used only in case of MBR partitions table.      |
|                   | For this option to be used, "main_part" option must be |
|                   | given. You do not have to give this option if you want |
|                   | to save a main partition.                              |
|                   | The pair of options "main_part" and "ext_part" replace |
|                   | the second window when saving, and the set "disk",     |
|                   | "main_part" and "ext_part" replace the second window   |
|                   | when restoring. When updating Windows                  |
|                   | 2000/XP/Vista/Seven registry or updating boot          |
|                   | configuration data, "main_part" and "ext_part" replace |
|                   | the choice of the second partition (the one to         |
|                   | update). When updating BOOTSECT.DOS/BOOTSECT.BAK       |
|                   | files, these options replace the choice of partition   |
|                   | where these files are.                                 |
+-------------------+-----------------------------+--------------------------+
| only_if_same      | yes|no                      | no                       |
|                   +-----------------------------+--------------------------+
|                   | This option allows considering destination support as  |
|                   | valid only if it is identical with saved support (when |
|                   | choosing destination support it has a "X" into "Idem"  |
|                   | column). This allows avoiding error when using option  |
|                   | file in case something was modified (as some           |
|                   | partitions were added/removed since saving which       |
|                   | modifies partition numbering).                         |
+-------------------+-----------------------------+--------------------------+
| def_level         | <number>                    | asked to user if "file"  |
|                   |                             | not given, 0 else        |
|                   +-----------------------------+--------------------------+
|                   | Gives the compression level to use. This number must   |
|                   | be between 0 and 9. When saving, this option replaces  |
|                   | the third window. When restoring, this option is not   |
|                   | used (hence can be omitted). If this option is not     |
|                   | given and a file name is given (see "file" option      |
|                   | below), compression level used is level 0 (no          |
|                   | compression).                                          |
+-------------------+-----------------------------+--------------------------+
| file              | <file name>                 | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the file to use to save/restore element. This    |
|                   | option can be given several times in case              |
|                   | saving/restoring need several files. In this case,     |
|                   | options must be given in order you want files to be    |
|                   | used.                                                  |
+-------------------+-----------------------------+--------------------------+
| max_size          | <number> [kb|Mb] or max     | asked to user if "file"  |
|                   |                             | not given, 2047 Mo else  |
|                   +-----------------------------+--------------------------+
|                   | Gives the maximum size that a file can be. If kb|Mb is |
|                   | not given, size is in Mb. If size is in kb, it must be |
|                   | between 1 and 9999 kb, if it is in Mb it must be       |
|                   | between 1 and 2047 Mb. If "max" is used as value, the  |
|                   | program will use minimum between drive free space and  |
|                   | 2047 Mb. This option can be given several times if     |
|                   | saving/restoring needs several files. In this case     |
|                   | this option must be given in the same order as file    |
|                   | names are given. If this option is given less time     |
|                   | than number of file names, the last option will be     |
|                   | used for all remaining files. If this option is given  |
|                   | more times than number of file names, remaining        |
|                   | options will not be used. If this option is not given  |
|                   | and some file names are given, maximum size of 2047 Mb |
|                   | is used. When restoring this option is not used (hence |
|                   | can be omitted).                                       |
+-------------------+-----------------------------+--------------------------+
| check_files_exist | yes|no                      | no                       |
|                   +-----------------------------+--------------------------+
|                   | This option allows checking that all files needed to   |
|                   | restore a backup exist. This avoid getting an error in |
|                   | the middle of the process in case a file is missing.   |
|                   | This option cannot work in case files are on some      |
|                   | removable media.                                       |
+-------------------+-----------------------------+--------------------------+
| filesystem        | no|fat12|fat16|fat32|ext2|  | asked to user if several |
|                   | ntfs|MBR|firstsect|         | choices are available    |
|                   | parttable|                  | ("no" else)              |
|                   | fat12mem|fat16mem|fat32mem| |                          |
|                   | ntfsmem|ext2mem|            |                          |
|                   | fat12swap|fat16swap|        |                          |
|                   | fat32swap|ntfsswap|         |                          |
|                   | fat12memswap|fat16memswap|  |                          |
|                   | fat32memswap|ntfsmemswap    |                          |
|                   +-----------------------------+--------------------------+
|                   | Gives the filesystem type to use when saving. If this  |
|                   | parameter is equal to "no", all sectors are saved      |
|                   | without considering filesystem that is on the          |
|                   | partition. If this parameter is equal to one of the    |
|                   | others possibilities, the program checks that          |
|                   | partition to save corresponds to the filesystem of the |
|                   | asked type. If this is the case, only occupied sectors |
|                   | will be saved. Otherwise, an error is displayed.       |
|                   | The options fat12mem, fat16mem, fat32mem, ntfsmem and  |
|                   | ext2mem allow saving only occupied sectors, while      |
|                   | authorising that the backup file created can be on the |
|                   | saved partition.                                       |
|                   | The options fat12swap, fat16swap, fat32swap and        |
|                   | ntfsswap allow saving only occupied sectors without    |
|                   | saving the swap files contents.                        |
|                   | The options fat12memswap, fat16memswap, fat32memswap   |
|                   | and ntfsmemswap put together the features of both      |
|                   | <xxx>mem and <xxx>swap options.                        |
|                   | When restoring, this option is not used (the value     |
|                   | defined inside the backup file is used).               |
+-------------------+-----------------------------+--------------------------+
| swap_dir          | <path name>                 | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | This option allows giving the directory where swap     |
|                   | files are located. It is used only when saving and     |
|                   | when requesting to not save swap files. <path name>    |
|                   | must be the path name from the partition root          |
|                   | directory without a drive letter (example: "\" for     |
|                   | root directory, "\WINDOWS" for WINDOWS directory). As  |
|                   | with the window which requests this information, the   |
|                   | program searches for swap files in the root directory  |
|                   | also.                                                  |
+-------------------+-----------------------------+--------------------------+
| quit              | yes|no|nobadsector          | no                       |
|                   +-----------------------------+--------------------------+
|                   | This options permits to exit program automatically. If |
|                   | it is equal to "yes", program exits at end of          |
|                   | saving/restoring/copying (be aware that in the case of |
|                   | saving, if one of the options used from option file    |
|                   | has been modified, the window asking if you want to    |
|                   | create options file will still appear). It this option |
|                   | is equal to "nobadsector", program will exit only if   |
|                   | no bad sectors have been found (otherwise, user can    |
|                   | read errors list on screen, then click "Ok" button).   |
|                   | If this option is equal to "no" or is not given, user  |
|                   | has to click "Ok" button to exit.                      |
+-------------------+-----------------------------+--------------------------+
| reboot            | yes|no                      | no                       |
|                   +-----------------------------+--------------------------+
|                   | This option allows rebooting computer automatically at |
|                   | end of program execution. It is active only when       |
|                   | saving or restoring a partition (copying does not take |
|                   | an option file and it is not useful to reboot computer |
|                   | in others cases). If the "quit" option is equal to     |
|                   | "no", or "nobadsector" with some errors, or is not     |
|                   | given, program will reboot only after the user has     |
|                   | clicked on the "Ok" button. If the "quit" option is    |
|                   | equal to "yes", or "nobadsector" without any errors,   |
|                   | reboot will be done immediately.                       |
+-------------------+-----------------------------+--------------------------+
| automatic_naming  | yes|no                      | asked to user if "file"  |
|                   |                             | not given, "no" else     |
|                   +-----------------------------+--------------------------+
|                   | This options allows using automatic naming. If no      |
|                   | "file" option is given, this will only cause the       |
|                   | automatic naming checkbox to be checked when asking    |
|                   | for the first file name. If one or more "file" options |
|                   | are given, all these options will be first used and if |
|                   | more files are needed, the program will use the last   |
|                   | file name, changing its extension with the file number |
|                   | following rules described in chapter 6.e (it does not  |
|                   | verify whether the file already exists or not).        |
+-------------------+-----------------------------+--------------------------+
| nb_files          | <number>                    | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | This option allows giving number of files to create    |
|                   | when creating files on an NTFS drive with using        |
|                   | automatic naming. Number must be between 1 and 1000.   |
+-------------------+-----------------------------+--------------------------+
| windows_disk      | <number>                    | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the disk number where Windows is installed. This |
|                   | option is equivalent to the "disk" one but is used in  |
|                   | the case of update of Windows 2000/XP/Vista/Seven      |
|                   | registry to give disk number where Windows is          |
|                   | installed (see chapter 11.a).                          |
+-------------------+-----------------------------+--------------------------+
| window_main_part  | <number>                    | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the main partition number where Windows is       |
|                   | installed. This option is equivalent to the            |
|                   | "main_part" one but is used in the case of update of   |
|                   | Windows 2000/XP/Vista/Seven registry to give main      |
|                   | partition number where Windows is installed (see       |
|                   | chapter 11.b).                                         |
+-------------------+-----------------------------+--------------------------+
| window_ext_part   | <number>                    | asked to user if         |
|                   |                             | "window_main_part" not   |
|                   |                             | given, 0 else            |
|                   +-----------------------------+--------------------------+
|                   | Gives the extended partition number where Windows is   |
|                   | installed. This option is equivalent to the "ext_part" |
|                   | one but is used in the case of update of Windows       |
|                   | 2000/XP/Vista/Seven registry to give extended          |
|                   | partition number where Windows is installed (see       |
|                   | chapter 11.b).                                         |
+-------------------+-----------------------------+--------------------------+
| windows_floppy    | <number>                    | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the floppy drive number where Windows is         |
|                   | installed. This option is equivalent to the "floppy"   |
|                   | one but is used in the case of update of Windows       |
|                   | 2000/XP/Vista/Seven registry to give floppy drive      |
|                   | number where Windows is installed (see chapter 11.a).  |
+-------------------+-----------------------------+--------------------------+
| windows_device    | DOS/Windows: A-Z            | asked to user            |
|                   | Linux: <block device>       |                          |
|                   +-----------------------------+--------------------------+
|                   | Gives the device letter/file where Windows is          |
|                   | installed. This option is equivalent to the "device"   |
|                   | one but is used in the case of update of Windows       |
|                   | 2000/XP/Vista/Seven registry to give device where      |
|                   | Windows is installed (see chapter 11.b).               |
+-------------------+-----------------------------+--------------------------+
| windows_raw_file  | <filename>                  | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the file where Windows is installed. This option |
|                   | is equivalent to the "raw_file" one but is used in the |
|                   | case of update of Windows 2000/XP/Vista/Seven registry |
|                   | to give device where Windows is installed (see chapter |
|                   | 11.b).                                                 |
+-------------------+-----------------------------+--------------------------+
| window_dir        | <string>                    | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the directory where Windows is installed (see    |
|                   | chapter 11.c).                                         |
+-------------------+-----------------------------+--------------------------+
| part_letter       | A-Z                         | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives drive letter that should be modified in the      |
|                   | registry for the chosen partition (see chapter 11.f).  |
+-------------------+-----------------------------+--------------------------+
| boot_disk         | <number>                    | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the disk number where Windows Vista/Seven boot   |
|                   | configuration data are. This option is equivalent to   |
|                   | the "disk" one but is used in the case of update of    |
|                   | Windows Vista/Seven boot configuration data to give    |
|                   | disk number where these data are (see chapter 12.a).   |
+-------------------+-----------------------------+--------------------------+
| boot_main_part    | <number>                    | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the main partition number where Windows          |
|                   | Vista/Seven boot configuration data are. This option   |
|                   | is equivalent to the "main_part" one but is used in    |
|                   | the case of update of Windows Vista/Seven boot         |
|                   | configuration data to give main partition number where |
|                   | these data are (see chapter 12.b).                     |
+-------------------+-----------------------------+--------------------------+
| boot_ext_part     | <number>                    | asked to user if         |
|                   |                             | "boot_main_part" not     |
|                   |                             | given, 0 else            |
|                   +-----------------------------+--------------------------+
|                   | Gives the extended partition number where Windows      |
|                   | Vista/Seven boot configuration data are. This option   |
|                   | is equivalent to the "ext_part" one but is used in the |
|                   | case of update of Windows Vista/Seven boot             |
|                   | configuration data to give extended partition number   |
|                   | where these data are (see chapter 12.b).               |
+-------------------+-----------------------------+--------------------------+
| boot_floppy       | <number>                    | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the floppy drive number where Windows            |
|                   | Vista/Seven boot configuration data are. This option   |
|                   | is equivalent to the "floppy" one but is used in the   |
|                   | case of update of Windows Vista/Seven boot             |
|                   | configuration data to give floppy number where these   |
|                   | data are (see chapter 12.a).                           |
+-------------------+-----------------------------+--------------------------+
| boot_device       | DOS/Windows: A-Z            | asked to user            |
|                   | Linux: <block device>       |                          |
|                   +-----------------------------+--------------------------+
|                   | Gives the device letter/file where Windows Vista/Seven |
|                   | boot configuration data are. This option is equivalent |
|                   | to the "device" one but is used in the case of update  |
|                   | of Windows Vista/Seven boot configuration data to give |
|                   | device letter where these data are (see chapter 12.b). |
+-------------------+-----------------------------+--------------------------+
| boot_raw_file     | <filename>                  | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the file where Windows Vista/Seven boot          |
|                   | configuration data are. This option is equivalent to   |
|                   | the "raw_file" one but is used in the case of update   |
|                   | of Windows Vista/Seven boot configuration data to give |
|                   | device letter where these data are (see chapter 12.b). |
+-------------------+-----------------------------+--------------------------+
| boot_entry        | <string>                    | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the name of boot entry to update when updating   |
|                   | Windows Vista/Seven boot configuration data (see       |
|                   | chapter 12.e).                                         |
+-------------------+-----------------------------+--------------------------+
| source_disk       | <number>                    | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the disk number where element to copy is. This   |
|                   | option is equivalent to the "disk" one but is used in  |
|                   | case of copying an element to give source of copy (see |
|                   | chapter 8.a).                                          |
+-------------------+-----------------------------+--------------------------+
| source_main_part  | <number>                    | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the main partition number to copy. This option   |
|                   | is equivalent to the "main_part" one but is used in    |
|                   | the case of copying an element to give source of copy  |
|                   | (see chapter 8.b).                                     |
+-------------------+-----------------------------+--------------------------+
| source_ext_part   | <number>                    | asked to user if         |
|                   |                             | "source_main_part" not   |
|                   |                             | given, 0 else            |
|                   +-----------------------------+--------------------------+
|                   | Gives the extended partition number to copy. This      |
|                   | option is equivalent to the "ext_part" one but is used |
|                   | in the case of copying an element to give source of    |
|                   | copy (see chapter 8.b).                                |
+-------------------+-----------------------------+--------------------------+
| source_floppy     | <number>                    | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the floppy drive number to copy. This option is  |
|                   | equivalent to the "floppy" one but is used in the case |
|                   | of copying an element to give source of copy (see      |
|                   | chapter 8.a).                                          |
+-------------------+-----------------------------+--------------------------+
| source_device     | DOS/Windows: A-Z            | asked to user            |
|                   | Linux: <block device>       |                          |
|                   +-----------------------------+--------------------------+
|                   | Gives the device letter/file to copy. This option is   |
|                   | equivalent to the "device" one but is used in the case |
|                   | of copying an element to give source of copy (see      |
|                   | chapter 8.b).                                          |
+-------------------+-----------------------------+--------------------------+
| source_raw_file   | <filename>                  | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the raw file to copy. This option is equivalent  |
|                   | to the "raw_file" one but is used in the case of       |
|                   | copying an element to give source of copy (see chapter |
|                   | 8.b).                                                  |
+-------------------+-----------------------------+--------------------------+
| dest_disk         | <number>                    | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the disk number where to copy element. This      |
|                   | option is equivalent to the "disk" one but is used in  |
|                   | case of copying an element to give destination of copy |
|                   | (see chapter 8.d).                                     |
+-------------------+-----------------------------+--------------------------+
| dest_main_part    | <number>                    | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the main partition number that is destination of |
|                   | copy. This option is equivalent to the "main_part" one |
|                   | but is used in the case of copying an element to give  |
|                   | destination of copy (see chapter 8.d).                 |
+-------------------+-----------------------------+--------------------------+
| dest_ext_part     | <number>                    | asked to user if         |
|                   |                             | "dest_main_part" not     |
|                   |                             | given, 0 else            |
|                   +-----------------------------+--------------------------+
|                   | Gives the extended partition number that is            |
|                   | destination of copy. This option is equivalent to the  |
|                   | "ext_part" one but is used in the case of copying an   |
|                   | element to give destination of copy (see chapter 8.d). |
+-------------------+-----------------------------+--------------------------+
| dest_floppy       | <number>                    | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the floppy drive number that is destination of   |
|                   | copy. This option is equivalent to the "floppy" one    |
|                   | but is used in the case of copying an element to give  |
|                   | destination of copy (see chapter 8.d).                 |
+-------------------+-----------------------------+--------------------------+
| dest_device       | DOS/Windows: A-Z            | asked to user            |
|                   | Linux: <block device>       |                          |
|                   +-----------------------------+--------------------------+
|                   | Gives the device letter/file that is destination of    |
|                   | copy. This option is equivalent to the "device" one    |
|                   | but is used in the case of copying an element to give  |
|                   | destination of copy (see chapter 8.d).                 |
+-------------------+-----------------------------+--------------------------+
| dest_raw_file     | <filename>                  | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the raw file that is destination of copy. This   |
|                   | option is equivalent to the "raw_file" one but is used |
|                   | in the case of copying an element to give destination  |
|                   | of copy (see chapter 8.d).                             |
+-------------------+-----------------------------+--------------------------+
| dest_new_raw_file | <filename>                  | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the raw file that is destination of copy. This   |
|                   | option is equivalent to the "new_raw_file" one but is  |
|                   | used in the case of copying an element to give         |
|                   | destination of copy (see chapter 8.d).                 |
+-------------------+-----------------------------+--------------------------+
| mount             | <drive number>:<disk        | asked to user            |
|                   | number>/<main partition     |                          |
|                   | number>,<extended partition |                          |
|                   | number>                     |                          |
|                   | or                          |                          |
|                   | DOS/Windows: <drive         |                          |
|                   | number>:<device letter>     |                          |
|                   | Linux: <drive               |                          |
|                   | number>:<block device>      |                          |
|                   +-----------------------------+--------------------------+
|                   | Allows defining mounting options of a partition or a   |
|                   | device.                                                |
|                   | In first syntax, the first number is the drive number  |
|                   | used to identify mounted partition, it must be between |
|                   | 0 and 2147483647. The second number is the disk number |
|                   | on which partition to mount is, it must be between 0   |
|                   | and number of disks - 1. The third number is the main  |
|                   | partition number of partition to mount, it is between  |
|                   | 1 and 4 for a MBR partitions table and between 1 and   |
|                   | 4294967295 for a GUID partitions table. The last       |
|                   | number must not be given for a main partition (if it   |
|                   | is omitted, the colon before must be also) and is the  |
|                   | extended partition number where the main partition is  |
|                   | a logical partition, it must be between 1 and 255.     |
|                   | In second syntax, disk and partitions numbers are      |
|                   | replaced with the drive letter/device file of the      |
|                   | device to mount.                                       |
|                   | The drive number must be unique and a partition can    |
|                   | only be mounted with one number. When a mount is       |
|                   | defined, the "file" option can use this number to      |
|                   | define a file name.                                    |
|                   | Example:                                               |
|                   | mount=0:0/1 mounts as 0: the first main partition of   |
|                   | the first disk,                                        |
|                   | mount=10:3/2,2 mounts as 10: the second extended       |
|                   | partition in the second main partition of the forth    |
|                   | disk,                                                  |
|                   | file=0:\DISK_C.PAR (or FILE=//O/DISK_C.PAR for Linux   |
|                   | version) defines a file that is on the partition       |
|                   | mounted by the first mount.                            |
+-------------------+-----------------------------+--------------------------+
| gmt               | <hours>h<minutes>           | automatic detection      |
|                   +-----------------------------+--------------------------+
|                   | This option permits setting difference between your    |
|                   | hour and GMT hour (example: 1h00 in France in winter). |
|                   | It is used when writing file to NTFS partition because |
|                   | this one stores file modification time in GMT time.    |
|                   | This option is not mandatory, it only avoids having    |
|                   | some file modification time in future or past.         |
|                   | Automatic detection cannot be performed in DOS         |
|                   | version, in this case 0 is used.                       |
+-------------------+-----------------------------+--------------------------+
| ask_first_media   | yes|no                      | yes                      |
|                   +-----------------------------+--------------------------+
|                   | When saving to a removable media, program asks for     |
|                   | next support for each file even first one. With        |
|                   | setting this option to "no", program will create the   |
|                   | first file on current media without requesting         |
|                   | anything.                                              |
+-------------------+-----------------------------+--------------------------+
| max_mem_size      | <number> [kb|Mb]            | available memory         |
|                   +-----------------------------+--------------------------+
|                   | This options allows reducing memory usage by program.  |
|                   | It shall be used only when getting the "Error: could   |
|                   | not allocate page table memory" error (mostly when     |
|                   | exploring compressed backup). This limit is not        |
|                   | absolute (program will use more memory than that in    |
|                   | case of need), but allows reducing biggest buffers     |
|                   | size. If you do not get the error, you do not need to  |
|                   | use it, if you get the error, try with giving half the |
|                   | memory you have (reduce it or try to free some DOS     |
|                   | memory if it is not enough).                           |
+-------------------+-----------------------------+--------------------------+
| empty_files       | yes|no                      | no                       |
|                   +-----------------------------+--------------------------+
|                   | When saving, this option allows program to empty the   |
|                   | files it does not use in case "file" or "nb_files"     |
|                   | (with automatic naming) are given. It does not request |
|                   | any confirmation before doing that and stop when all   |
|                   | files are treated or at first error. This option       |
|                   | allows knowing which files are used by saving and      |
|                   | which are not.                                         |
+-------------------+-----------------------------+--------------------------+
| heads_sectors     | standard|extended|          | asked to user unless     |
|                   | parttable|<heads            | "fix_first_sector" is    |
|                   | number>/<sectors number>    | used                     |
|                   +-----------------------------+--------------------------+
|                   | When fixing physical definition of a disk on a boot    |
|                   | sector, this option permits to choose which values to  |
|                   | use. Three first options (standard|extended|parttable) |
|                   | are to use predefined values, the last option is to    |
|                   | give your own values (the number of heads and the      |
|                   | number of sectors per track). In case this option is   |
|                   | not used and fix_first_sector option is used, program  |
|                   | updates first sector value only.                       |
|                   | In Windows and Linux versions, this option allows      |
|                   | forcing number of heads and sectors per cylinder for a |
|                   | disk in case these definitions cannot be obtained with |
|                   | reading partitions table (for this numbers shall be    |
|                   | given, not predefined values).                         |
|                   | This option allows also forcing the definition when    |
|                   | using a raw file.                                      |
+-------------------+-----------------------------+--------------------------+
| fix_first_sector  | yes|no|<first sector        | asked to user unless     |
|                   | number>                     | "heads_sectors" is used  |
|                   +-----------------------------+--------------------------+
|                   | When fixing physical definition of a disk on a boot    |
|                   | sector, setting this option to yes or a value permits  |
|                   | to correct the first sector value if it is wrong. When |
|                   | it is set to yes, first sector value is deduced from   |
|                   | partition's first sector else the given value is used. |
|                   | In case this option is not used and heads_sectors      |
|                   | option is used, program updates heads/sectors numbers  |
|                   | only.                                                  |
|                   | This option allows also forcing the definition when    |
|                   | using a raw file that is considered as a device raw    |
|                   | file.                                                  |
+-------------------+-----------------------------+--------------------------+
| stdaccess         | <number>                    | detection of type of     |
|                   |                             | access                   |
|                   +-----------------------------+--------------------------+
|                   | This option allows forcing use of standard access for  |
|                   | disks that support both access modes (disks of less    |
|                   | than 8 Gb). The <number> allows giving disk number for |
|                   | which access mode shall be forced (see "disk" option). |
|                   | This option can be given several times with different  |
|                   | disk numbers.                                          |
|                   | This option shall be carefully used and only in case   |
|                   | of a disk found as using extended access but that does |
|                   | not support it (case of very old disks). Before using  |
|                   | this option, it is better to check disks with          |
|                   | partinfo.exe with and without "-s" option, then to try |
|                   | exploring a partition to check what program sees.      |
|                   | This situation is in most cases bad. It shows that     |
|                   | disk is badly recognised and that can lead to some     |
|                   | loss of data, overlapping partitions, ... (moreover in |
|                   | case of using disk with several OS). It can            |
|                   | potentially be corrected with changing disk parameters |
|                   | into BIOS, but this can lead to the loss of all data   |
|                   | of this disk (it is better after such a change to      |
|                   | destroy all partitions and create them again to be     |
|                   | sure they are correctly defined).                      |
+-------------------+-----------------------------+--------------------------+
| beep              | yes|no|<number>             | no                       |
|                   +-----------------------------+--------------------------+
|                   | This option allows emitting two close beeps at regular |
|                   | time (10 or <number> seconds) during saving/restoring  |
|                   | when it is set to "yes" or "<number>" (same as using   |
|                   | the -beep option on command line). If your attention   |
|                   | is requested a single beep is emitted (as when option  |
|                   | is set to "no"). When saving/restoring ends 3 beeps    |
|                   | (or 4 in case of problem) are emitted (warning: you    |
|                   | still need to end program if you did not used the      |
|                   | "quit=" option for it to flush data on disk).          |
+-------------------+-----------------------------+--------------------------+
| log_file          | <file name>                 | asked to user            |
|                   +-----------------------------+--------------------------+
|                   | Gives the name of file to use to store error messages. |
|                   | In case this option is not given, it is requested to   |
|                   | user when it checks the corresponding option on backup |
|                   | file name request. You can read chapter 28 to get more |
|                   | details on this log file.                              |
+-------------------+--------------------------------------------------------+

Remarks:
--------

  - When using batch mode, no confirmation is asked when a file must be
    erased, when element is restored, when registry or
    BOOTSECT.DOS/BOOTSECT.BAK file is modified.
  - If you do not give enough file names (for example, you give only one file
    name when restoring, and two files were created when saving), or a file is
    wrong (for example, the files are given in the wrong order or a file name
    is bad), missing or incorrect file names will be asked, as in normal mode.
  - If an option is not valid, the program ends. To verify your option file
    you can use savepart with "-t" option.
  - When restoring, if several files are needed and are stored on removable
    media (and the program is able to detect this), the program asks to change
    media instead of displaying an error and asking for next filename.

Examples:
---------

With taking the partitioning presented in the example of saving a partition,
and with assuming the backup of all sectors of the partition corresponding to
D: drive, the obtained batch file will look like (assuming that two backup
files are needed):
;-------------------------------
; Parameters for D: drive

; On the first disk
disk=0

; Main partition 1
main_part=1

; No compression
; (remark: in this case this option can be omitted)
def_level=0

; Files:
file=c:\driv_d_1.par
file=c:\driv_d_2.par

; Same size for all files
; (remark: in this case the second line can be omitted)
max_size=620
max_size=620

; All sectors are saved
filesystem=no

; End of file
;-------------------------------
If you name this file drive_d.cfg, you will have to enter "savepart -s -f
drive_d.cfg" to save the partition or "savepart -r -f drive_d.cfg" to restore
it. Your are not obliged to give the -s/-r flag in which case you will be
asked what you want to do, and then the option file will be taken into
account.

The file below will permit you to save/restore the Linux partition (all
sectors of this partition):
;-----------------------------------
; Parameters for Linux partition

; On the first disk
disk=0

; Main partition number 3:
main_part=3

; Standard compression:
def_level=6

; File:
file=c:\linux.par
max_size=2047

; All sectors are saved
filesystem=no

; End of file
;-------------------------------
If you change filesystem parameter from "no" to "ext2" in above file, only
occupied sectors of partition will be saved.

If you have two disks where the first one has a partition format that is not
recognised by savepart, you can use the following file to force the program to
only use the second hard drive:
;-------------------------------
; Partition format of the first disk not recognised
; => force using only the second one

disk=1

; End of file
;-------------------------------

To modify the registry automatically, you have to give all the options which
define the element to be modified and the element where Windows is installed.
As an example:
;-----------------------------------
; Modification of registry for logical partition on second disk while
; Windows is installed on the first partition of first disk.

; Parameters for Windows installation
windows_disk=0
windows_main_part=1
windows_dir=windows

; Parameters for partition definition to be modified in the registry
disk=1
main_part=2
ext_part=1
part_letter=G

; End of file
;-----------------------------------


24- Mounting a partition
------------------------

Mounting a partition allows accessing partitions that cannot be used from OS.
Instead of using a drive letter or mount point as for OS, mounted partitions
get a drive number that can be used in the same way. As an example, to access
DISK_C.PAR file that is on first mounted partition (that has the 0 number),
you have to use "0:\DISK_C.PAR" (mount number followed with ":") for DOS and
Windows versions or //0/DISK_C.PAR (two "/" followed by mount number) for
Linux one.
Mounting process is similar to saving partition choice process: you have to
first choose the disk where partition to mount is, then partition itself. Once
this is done, and if filesystem on this partition is recognised, this
partition gets a drive number that is unique. If you try to mount a partition
several times, you always will get the number it was mounted under at first
time.
Recognised filesystem are NTFS, FAT and ext2/3/4 filesystems. Mounting a NTFS
partition allows modifying its files, but does not allow creating or erasing
files. Mounting a FAT or ext2/3/4 partition allows creating files on them (not
for ext2/3/4 partitions using binary tree sorted directories). Mounting a
damaged partition allows accessing it in read-only mode. On ext2/3/4
partitions, symbolic links are displayed as files, but cannot be read or
followed.
When you mount a partition to modify its files, you must let the program end
by itself for it to be able to synchronise the filesystem with modifications
you perform. For example, do not reboot immediately when saving has ended, but
click on 'Ok' button, create (or not) the configuration file and wait for the
program to end.

Notes:
------

  - Mounting a partition that is available to DOS by another way is not
    advised unless you reboot computer after program exiting, especially if
    you wrote something on it (this can lead to some errors or data lost
    because DOS is no more coherent with disk content).
  - The more partitions you mount the more memory you need. So if you have
    barely enough available memory, try to avoid mounting partitions
    unnecessarily.
  - When restoring with an options file, this file must be on a drive that was
    accessible by OS because when it is read, no mounting has been done.
  - For files used on mounted partition, the option to disable write checking
    is not "-nvf" but "-nvd" because writing is performed via the program
    internal mechanism and not by using OS.
  - On ext2/ext3/ext4 partitions, created files take ownership and rights of
    directory where they are created. On ext3 and ext4 partitions, journal is
    not updated.


25- Notes on what elements can be saved
---------------------------------------

This chapter describes some points specific to each type of element that can
be saved. It describes in particular restrictions that are checked by program
when restoring an element.

  a) The complete disk:
This is about saving/restoring the whole disk without taking into account its
organisation.

When saving you should not create the backup file on one of the partition of
the disk, else you are likely to have incoherence when restoring.

When restoring you should not use files that are on this disk as it is
entirely rewritten and so files would be erased before they were completely
read (so restoring will end with an error and files will be lost). Restoring
is possible only on a disk with a compatible physical definition. For that, it
must have the same access type, the same number of heads, of sector per track
and have sectors that have the same size. It must equally have the same number
or more cylinders (so the disk will have the same size or be bigger). If it
has more cylinders, the last cylinders will be not allocated (consequently
left empty) and you will have to create a new partition or increase the last
one to use them when having MBR partitions table or increase the partitions
table when having a GPT one (an easy way to fix the GPT partitions table is to
restore the partitions table after having restored disk).

When using the "-tds" option, the disk size can be increased depending on size
found through partitions table or in case of hidden cylinders. In case
partitions table is of GPT type and appears smaller than disk size, disk size
is lowered to match this size, such as disk appears to have same size
whichever OS is used (a GUID partitions table is expected to occupy whole
disk).

If disk size seems to be incorrect (for example it is displayed as 8 Gb when
the disk is 20 Gb), you should not save this disk because the backup will not
be complete (in this example, the last 12 Gb will not be saved). This comes
from a bad detection of the disk (for example in the way it is accessed). The
use of a disk manager program may solve this problem.

  b) The Master Boot Record (MBR):
This sector is the first one on the disk. It contains:

  - boot code used when computer is started.
  - main partitions declaration.

When saving it, this sector is fully saved, but when restoring only the part
corresponding to the boot code is restored. The part corresponding to the
partitions table is not modified else you would loose all partitions of disk.

When restoring, the only constraint on destination disk is that it must have
the same sector size.

It can be useful to save the Master Boot Record to restore it on another disk
or in case of a boot virus. This is the same as doing "fdisk /mbr" if you have
a boot sector written by Windows 9x/Me. This also allows you to restore a boot
loader in case you install an operating system that modifies the boot sector
without notice.

Boot code is restored as-is, so if it contains some code specific to the disk
format, this format is not updated even if this sector is restored on another
disk.

You cannot save the MBR if it is not considered valid (in which case this
choice will not be displayed).

  c) First sectors of disk:
These are the sectors that are before the first partition when using MBR
partitions table (there is no such definition for GUID partitions table). This
includes Master Boot Record, which is restored as described above (only boot
code is restored).

When restoring, the destination disk must have the same sector size and have a
valid partitions table. If the number of sectors before the first partition is
not the same between the saved and restored disks, only the common part (the
minimum number of sectors) will be restored.

You may need to save all sectors before first partition rather than just the
MBR in the situation where you have a boot loader that uses these sectors to
store its program. If this is restored onto a disk other than the original one
or on a disk with different partitions, restored sectors will not be modified
to take into account this new definition.

You will not see this option if MBR or partitions table is not valid.

  d) Partitions table (MBR):
These sectors describe the partitions table when it uses MBR formalism (4 main
partitions and extended partitions). They include MBR and all sectors that
describe extended partitions.

When saving, the sectors are fully saved but, when restoring, only the part
corresponding to the partitions table and disk identifier are restored (so
boot code is not modified). Constraints on the destination disk are the same
as when saving/restoring whole disk.

When restoring partitions table, you will lose the whole contents of the disk,
not because it is overwritten (only sectors of the partitions table are
written), but because the way it is organised is modified. It is recommended
that the backup file is not on the destination disk because there is a risk
that it can be erased (it is a low risk because the file should be too big to
be stored in memory and one of the sectors of the partitions table would be
where the file is stored).

In case you restore the partitions table to a new disk (not the source one),
it is better to avoid keeping both source and new disks in the same computer
as they will have the same identifier (Windows will map drive letter to one of
these disks, but perhaps not the one you want) or you have to modify the disk
identifier of one of the two disks before starting Windows.

  e) Partitions table (GPT):
These sectors describe the partitions table when it uses the GPT (GUID
Partitions Table) formalism (new representation that should be used with more
than 2 Tb disks). They include MBR (with the guard MBR partitions table) and
all sectors that describe partitions and the copy of these sectors.

When saving, the sectors are fully saved and when restoring they are fully
written. On contrary to MBR partitions table, restoration can be done on a
disk that does not have the same physical definition (it should have the same
sectors size and be at least of the same size).

When restoring partitions table, you will lose the whole contents of the disk,
not because it is overwritten (only sectors of the partitions table are
written), but because the way it is organised is modified. It is recommended
that the backup file is not on the destination disk because there is a risk
that it can be erased (it is a low risk because the file should be too big to
be stored in memory and one of the sectors of the partitions table would be
where the file is stored).

In case you restore the partitions table to a new disk (not the source one),
it is better to avoid keeping both source and new disks in the same computer
as they will have the same identifier (and their partitions also), so that
could break EFI disk recognition or you have to modify the disk and partitions
identifiers of one of the two disks.

  f) Partitions (all sectors):
In this case all sectors of a partition are saved without taking into account
if they are occupied or not.

When saving be aware to not create backup file on saved partition (for same
reasons as when saving whole disk). This is equally true when saving only
occupied sectors except when choosing to save a partition on itself.

When restoring you should not use backup files that are on the restored
partition (for same reasons as when restoring whole disk). This is equally
true when restoring only occupied sectors. Restoring will be available only on
a partition that is on a disk that has the same constraints as when restoring
whole disk. Moreover partition must be on the same place on disk (it must
begin and end at the same place as the saved one). Finally, partition type has
to be compatible with type of saved partition. For this, here is the array
giving compatibility between partition types:
                +---------+--------+------------------------+
                |  Type   | Number |      Designation       |
                +---------+--------+------------------------+
                |         | 0x01   | DOS FAT-12             |
                |         +--------+------------------------+
                | FAT 12  | 0x11   | DOS FAT-12 hidden      |
                |         +--------+------------------------+
                |         | 0xc1   | DR-DOS FAT-12          |
                +---------+--------+------------------------+
                |         | 0x04   | DOS FAT-16 < 32Mo      |
                |         +--------+------------------------+
                |         | 0x06   | DOS FAT-16 >= 32Mo     |
                |         +--------+------------------------+
                |         | 0x14   | FAT-16 < 32Mo hidden   |
                | FAT 16  +--------+------------------------+
                |         | 0x16   | DOS FAT-16 hidden      |
                |         +--------+------------------------+
                |         | 0xc4   | DR-DOS FAT-16          |
                |         +--------+------------------------+
                |         | 0xc6   | DR-DOS,NT              |
                +---------+--------+------------------------+
                |         | 0x0e   | Win95 VFAT-16          |
                | VFAT 16 +--------+------------------------+
                |         | 0x1e   | Win95 VFAT-16 hidden   |
                +---------+--------+------------------------+
                |         | 0x0b   | Win95 FAT-32 (b)       |
                |         +--------+------------------------+
                |         | 0x0c   | Win95 FAT-32 (c)       |
                | FAT 32  +--------+------------------------+
                |         | 0x1b   | Win95 FAT-32 hidden(b) |
                |         +--------+------------------------+
                |         | 0x1c   | Win95 FAT-32 hidden(c) |
                +---------+--------+------------------------+
                |         | 0x07   | QNX,OS/2,NT,Unix       |
                |  NTFS   +--------+------------------------+
                |         | 0x17   | OS/2,NT hidden         |
                +---------+--------+------------------------+
                |  ext2   | 0x83   | Linux ext2fs/xiafs     |
                +---------+--------+------------------------+
So if you save a partition of type Win95 FAT32 (b), you can restore it on a
Win95 FAT32 (c) partition (theoretically, difference between the 2 is hard
disk access (CHS or extended), but Windows seems not to check partition type
and check access type when booting). Please note that partition type is not
modified in the partitions table (so if you restore a Win95 FAT32 (b)
partition on a Win95 FAT32 (c) partition, this last one will still be a Win95
FAT32 (c) partition in the partitions table).

Saving all sectors of a partition can be useful in the case of a partition for
which saving only occupied sectors is not available or in the case where the
filesystem is too much damaged for saving only occupied sectors to work or if
you do not have enough memory.

  g) Partitions (only occupied sectors):
This part describes how saving only occupied sectors works for partitions that
are known by this program. The following will describe some specific things
for each partition type (FAT, ext2fs, NTFS).

When saving/restoring occupied sectors of a partition, it is necessary to know
how data are stored on it to know if a sector is occupied or not. For this
reason, this option is not available for all filesystem, but only for those
where I found documentation and that I have, to perform tests. For those
filesystems, some checks are done to verify that it will be correctly
recognised (if it is not, the window asking you if you want to save only
occupied sectors will not be displayed).

Saving/restoring of occupied sectors allows saving space (backup file is
smaller), to save time (less data are read) and to do restore on a partition
with a different size or that is on a hard disk different from those where was
source partition or at a different place. Further constraints are that disk
must have the same sector size as the original one and partition types must be
compatible. The partition also needs to respect some minimal and maximal sizes
(they are described below for each filesystem type). Remarks on where
created/read file are located are the same as for a partition where all
sectors are saved.

Saving/restoring of occupied sectors keeps data sectors structure as it was
defined when saving. If the partition is restored on a partition with a size
different from original one, filesystem sectors can be modified to take into
account this size change.

Example:
--------
With a FAT partition, suppose there was the following structure (each letter
is a sector with its content, number of sectors given is not representative of
a true FAT structure):

  RRRRRRFFFF    R: reserved sectors (boot sector and others)
  FFFFDDDD..    F: FAT sectors (sectors that allow to know if clusters,
  DDDDDDDD..       that are groups of sectors, are occupied)
  ........DD    D: data sectors
  DDDDDDDDDD    .: empty sectors
  DD....DDDD

This partition is 60 sectors long. If you want to restore it on a partition
that has 120 sectors, you will get following result:

  RRRRRRFFFF
  FFFFFFFFFF
  FFDDDD..DD
  DDDDDD....
  ......DDDD
  DDDDDDDDDD
  ....DDDD..
  ..........
  ..........
  ..........
  ..........
  ..........

The number of reserved sectors has not been modified, the number of FAT
sectors has grown because there was more accessible data sectors. The number
of data sectors has grown, but their organisation has not been modified (only
empty sectors have been added at end).
In this example, it is not possible to restore this partition on a smaller
partition because the last sector of partition is occupied. To avoid this
problem you have to use a defragmenter before saving in order to get following
structure:

  RRRRRRFFFF
  FFFFDDDDDD
  DDDDDDDDDD
  DDDDDDDDDD
  DDDD......
  ..........

In this case, the partition can be restored on a partition with 44 sectors
(certainly less, as number of data sectors is reduced and so number of FAT
sector will be reduced, and a partition with 42 sectors can certainly be
used).

To know minimum and maximum partition size you can use when restoring a
partition where only occupied sectors were saved, you can:

  - either create the batch file, in which case these sizes are written at
    beginning of the file into description.
  - or run savepart -r with choosing the backup file. When the window where
    you have to choose the partition to restore is displayed, it will contain
    a line with minimum and maximum sizes allowed for partition. Then you can
    cancel restoring to avoid doing it uselessly.

  h) FAT (12, 16 and 32) partitions (DOS/Windows):
All FAT12 and FAT16 partitions are recognised. FAT32 partitions are recognised
only for version 0 of this filesystem (I did not know other version). FAT
partitions group data sectors into groups called clusters. When restoring this
type of partition, cluster size is not modified and FAT type is not modified.
Because of FAT structure, partitions of this type have to respect some size
constraints that are summarised into following table:
  +---------+-------+--------+---------+--------+--------+-------+---------+
  |Clusters |  512  |1 Kbytes|2 Kbytes |4 Kbytes|8 Kbytes|  16   |32 Kbytes|
  |  size   | bytes |        |         |        |        |Kbytes |         |
  +---------+---+---+---+----+----+----+---+----+---+----+---+---+----+----+
  |Partition|Min|Max|Min|Max |Min |Max |Min|Max |Min|Max |Min|Max|Min |Max |
  |  size   |   |   |   |    |    |    |   |    |   |    |   |   |    |    |
  +---------+---+---+---+----+----+----+---+----+---+----+---+---+----+----+
  |  FAT12  |  2|  2|  4|4 Mb|8 Kb|8 Mb| 16|  16| 32|  32| 64| 64| 128| 128|
  |         | Kb| Mb| Kb|    |    |    | Kb|  Mb| Kb|  Mb| Kb| Mb|  Kb|  Mb|
  +---------+---+---+---+----+----+----+---+----+---+----+---+---+----+----+
  |  FAT16  |  2| 32|  4|  64|8 Mb| 128| 16| 256| 32| 512| 64|  1| 128|2 Gb|
  |         | Mb| Mb| Mb|  Mb|    |  Mb| Mb|  Mb| Mb|  Mb| Mb| Gb|  Mb|    |
  +---------+---+---+---+----+----+----+---+----+---+----+---+---+----+----+
  |  FAT32  | 32|128| 64| 256| 128| 512|256|1 Tb|512|2 Tb|  1|  4|2 Tb|8 Tb|
  |         | Mb| Mb| Mb|  Mb|  Mb|  Mb| Mb|    | Mb|    | Tb| Tb|    |    |
  +---------+---+---+---+----+----+----+---+----+---+----+---+---+----+----+
So with this table, you see it is not possible to define a FAT16 partition
with less than 16 Mb and more than 256 Mb if its cluster size is 4 Kb. When
restoring, only partitions that respect these constraints are listed as
compatible partitions.

Remarks:
--------

  - As has been said before, to restore a partition on a smaller partition,
    the last sectors of partition must not be occupied. For this purpose you
    have to use a defragmenter in full defragmentation mode. You have to check
    that the defragmenter put all files at the beginning of the partition
    (some files are sometimes left at the end, for example the image.idx file
    created by Norton Image. It can be erased before doing save (be sure to
    remove its system and hidden attributes), then created again once the
    saving is done).
  - If you restore the partition containing C: drive on a different partition,
    it may be necessary to make the partition active if it is not already to
    set it bootable (with FDISK, choose "Activate partition" option). You may
    also have to update the MBR (either with copying original MBR or with
    using "fdisk /mbr"). If this partition is the bootable partition and is
    used with Windows 2000/XP/Vista/Seven multiboot, you have also to update
    the BOOTSECT.DOS/BOOTSECT.BAK file. It may also be necessary to use a
    bootable floppy disk with SYS.COM on it, to install system files on the
    partition (by running "sys c:" from floppy disk).
  - If you restore a partition on a different partition, references in the
    Windows registry that point to the saved partition will be wrong. In case
    of Windows 2000/XP/Vista/Seven, you can update registry with keeping the
    same drive letter. For others Windows version, this cannot be done.
  - If bad sectors are found under FAT (or boot sector copy for FAT32) when
    saving, their content is replaced by the content of their copy in the
    backup file to avoid problems when restoring this partition if it is done
    on one that doesn't have these bad sectors.

  i) Ext2fs/ext3fs/ext4fs partitions (Linux):
Ext2fs/ext3fs/ext4fs partitions that are recognised are 0 and 1 version.
Similar to FAT filesystem, ext2 filesystem groups data sectors into groups
called blocks. As for FAT, block size cannot be modified when restoring a
partition. To switch this blocks size, you will have some size constraints.
These size constraints are for a different reason than for FAT partition. They
define only a maximum partition size switch that size of the saved partition
(there was no minimum size).
         +------------------------+----------+----------+----------+
         |       Block size       | 1 Kbytes | 2 Kbytes | 4 Kbytes |
         +------------------------+----------+----------+----------+
         |                        |   256 Mb |     2 Gb |    16 Gb |
         |                        +----------+----------+----------+
         |                        |   512 Mb |     4 Gb |    32 Gb |
         |                        +----------+----------+----------+
         |                        |     1 Gb |     8 Gb |    64 Gb |
         |                        +----------+----------+----------+
         |                        |     2 Gb |    16 Gb |   128 Gb |
         |                        +----------+----------+----------+
         | Maximum partition size |     4 Gb |    32 Gb |   256 Gb |
         |                        +----------+----------+----------+
         |                        |     8 Gb |    64 Gb |   512 Gb |
         |                        +----------+----------+----------+
         |                        |    16 Gb |   128 Gb |     1 Tb |
         |                        +----------+----------+----------+
         |                        |    32 Gb |   256 Gb |     2 Tb |
         |                        +----------+----------+----------+
         |                        |    64 Gb |   512 Gb |     4 Tb |
         +------------------------+----------+----------+----------+
Note: depending on optionnal filesystem feature, this maximum size can be
greater than the one given here.

For example, if you have a 3 Gb partition with 2 Kb blocks, you would not be
permitted to restore it on a partition that has more than 4 Gb (but you can
restore it on a partition having a size between 0 and 4 Gb, lower limit will
be determined by the number of the last used block).

Remarks:
--------

  - I did never try a Linux defragmenter and I am not sure it will do a full
    defragmentation. Because of the way files are managed, it is highly
    probable that only files will be defragmented (they are moved so that all
    their data is stored on adjacent sectors, but are not put at the beginning
    of the partition). Hence it is very difficult to get a Linux partition
    with their last sectors unoccupied (so it will be difficult to restore a
    Linux partition on a smaller partition).
  - If you restore the root partition ("/") on a different partition (or if
    you have compiled a new kernel between saving and restoring), you will
    need a rescue disk to install your boot loader. Once the rescue disk has
    booted, create /mnt/disk directory if it does not exist, mount the
    partition with "mount -t ext2 /dev/<partition> /mnt/disk", then change
    your boot loader file (e.g. /mnt/disk/etc/lilo.conf) and install it back
    with "chroot /mnt/disk <boot loader command>" (<boot load command> = lilo
    for example).
  - If you restore a partition onto a different one, don't forget to modify
    your /etc/fstab file (the file that gives partitions with their mount
    directory) to take into account this change.
  - Ext3fs/ext4fs partitions are recognised as ext2fs partitions if journal is
    on the same partition. If journal is on a self contained partition, base
    partition can be saved as an ext2fs one, partition containing journal must
    be saved with all sectors (it is not important as journal partition is not
    very big and is swiftly full). Moreover in this last case, you must
    maintain coherency between the two partitions.

  j) NTFS partitions:
NTFS partitions are recognised for versions 1.1, 1.2, 2, 3.0 and 3.1 (this
number is not NT version but filesystem version (1.1, 1.2, 2 <=> NT, 3.0 <=>
Windows 2000, 3.1 <=> Windows XP)). As Microsoft did never release a NTFS
specification, this filesystem is not fully known and there still were some
unknown parts. Nevertheless, parts concerning sector use is known and so can
be used. But there was some feature of NTFS that I did not cover (it is the
case of partitions that have heavily fragmented filesystem).
Unlike FAT and ext2 partitions, there was no size constraint: only size limit
is linked to last allocated sector for lower limit and for upper limit to
limit of filesystem or too much fragmentation. So it is not possible to give a
size constraint as in others cases.

Remarks:
--------

  - As for Linux, NTFS defragmenter certainly does not group occupied sectors
    at the beginning of the partition. So it can be difficult to restore/copy
    a partition on a smaller one.
  - In some cases, the program may report that it cannot restore the partition
    onto another one because of a size problem. In this case, you have to try
    to restore it on a smaller partition (if it can be done) or bigger. This
    case will be unusual, involving some full or heavily fragmented
    partitions.
  - Saving/restoring a NTFS partition needs more memory than for others cases.
    If you have the "not enough memory" error and if you have more than 32 Mb
    memory and use EMM386, you can get more memory by disabling EMM386 (it
    limits memory size to 32 Mb). To perform this, you have to add a "rem " at
    the beginning of the line concerning EMM386 in C:\CONFIG.SYS file (or
    A:\CONFIG.SYS file if you use a floppy disk to boot), then restart your
    computer. Once saving/restoring is done, you can remove the "rem " so that
    EMM386 will be activated again at next boot.
  - If you restore a partition on a different partition, references in the
    registry that point to the saved partition will be wrong. In the case of
    Windows 2000/XP/Vista/Seven, you can update the registry while keeping the
    same drive letter. For others Windows version, this cannot be done.
  - If you save your system partition, then restore it onto another partition,
    you have to update the registry. You may also need to update your boot for
    this new location to be taken into account (the BOOT.INI file or boot
    configuration data). You can either use Partition-Saving with choosing to
    explore the partition and edit BOOT.INI file (XP) or to update boot
    configuration data (Vista/Seven), or boot with your Windows CDROM (or the
    6 floppy disks which are downloadable on the Microsoft website for XP) and
    choose the repair option. If CD does not perform an automatic repair,
    tools to use are fixmbr, fixboot and bootcfg for XP and bootrec with
    /fixmbr, /fixboot and /RebuildBcd option for Vista/Seven. The first one is
    to update the first sector of the disk (in case this one was never used as
    a system disk), the second one is to update the boot sector of the
    partition (this is theoretically not needed), the last one is to configure
    your boot options (BOOT.INI file). You can type "help <command>" for XP or
    "<command> /?" for Vista/Seven to get more information on these commands.
    But despite all this, because of protection mechanism that are set and due
    to a lack of knowledge about this system, it may not work (but only in the
    case of a restoring onto another disk, in the case of restoring on a
    previous version, there should be no problem). A last option that can be
    tried in this case is to download the "sysprep" utility on Microsoft
    website and use it before doing the save.

  k) Boot sector/superblock:
This option appears only for partitions, floppy disks and devices for which
filesystem is recognised. It allows saving first sector for the FAT and NTFS
filesystems and the first 2048 bytes for the ext2, ext3 and ext4 filesystems
(this is 4 sectors in most cases). In ext2/ext3/ext4 case it means there is
more sectors than superblock are saved as there is also sectors before it.
When restoring, only partitions having the same physical definition are given
(boot sector having information on its localisation). It shall be noticed that
the boot sector/superblock copy (if it exists) is not updated on restoration.

  l) Floppy disks:
360 Kb, 720 Kb, 1.2 Mb, 1.44 Mb and 2.88 Mb floppy disks can be saved. But
only floppy disks that are correctly formatted and have 512 bytes sectors can
be saved.
Floppy disk size cannot be known (knowing its type 5"1/4 or 3"1/2 is possible,
but for a given type, size cannot be known). So the program searches the last
sector of the disk to get its size. If this last sector is damaged, the
program will be wrong and the whole floppy disk will not be saved/ restored.
In this case it is better to save using DOS devices. To find out which size
the program has found, you can use the window asking you if you want to save
all sectors or occupied ones only (if it is displayed) or remaining size when
window asking you backup filename is displayed.
If you save all sectors, the same remarks as for saving a whole partition
would apply, if you save only occupied sectors, refer to previous chapters
referring to the filesystem.
If you restore a floppy disk for which you have saved only occupied sectors,
onto a floppy disk with a different size, it will work. But this floppy disk
will no longer have a standard format so it can cause mistakes with some
programs.
After you have restored a floppy disk, you have to eject it then reinsert it
so DOS can take changes into account. Otherwise, you can get incoherence on
the disk.

  m) DOS/Windows/Linux devices:
This method allows you to save all devices that OS accesses using sector
notation and that have a filesystem known by OS (only FAT for DOS and FAT/NTFS
for Windows NT/2000/...). For example, it is not the case for CD or network
mapped drive, but it is the case for large removable disks like Zip. In Linux
version, it relies on /etc/fstab file content to get a list of devices to use
(with using only block devices declared in this file).
This obviously allows accessing partitions of hard disks or floppy disks, but
for both cases it is better to use direct access as described in previous
chapters. The only case where this is not true is in the case where the floppy
disk size is incorrectly recognised.
Device to save/restore must be correctly formatted for it to be correctly
recognised.
Same remarks as for saving floppy disks would apply in this case.

  n) Raw files:
A raw file is a standard file that contains byte by byte image of a support
(as obtained through "dd" program). Constraint of this file is that it shall
have a size multiple of 512 bytes.
Program considers two kinds of raw file:

  - disk raw file when its content could be partitionned,
  - device raw file when it contains only one partition.

A raw file is considered as a disk raw file when its size is not one of a
floppy and its boot sector contains the MBR mark without being a valid NTFS or
FAT boot sector. In all other cases, it is considered as a device raw file.
A raw file has no associated physical definition (there is no header to
describe it), so program tries to deduce it from its content (from boot sector
if it is a FAT or NTFS support), else it choose a default one. That means that
a raw file will certainly not be considered as equivalent to the support it
was generated from if this physical definition cannot be deduced. You can use
the "heads_sectors" and "fix_first_sector" options in options file to force
this physical definition.
A raw file is considered as a support, not as a backup file. That means that
if you want to restore it directly on a support or if you want to create one
from a support without using a backup file, you will have to choose option to
"Copy an element". If you choose to "Save an element", you will create a
Partition-Saving backup file from this raw file. If you choose to "Restore an
element" and choose a raw file as destination, you will get a byte by byte
copy of the original support (so as big as it was).


26- Differences between DOS and Windows versions
------------------------------------------------

Because of differences between DOS and Windows, the two Partition Saving
versions are not exactly the same. Major differences are given here with
taking DOS version as reference.

  a) All versions of Windows:
Windows does not allow protecting a drive that is in use to avoid that several
programs access it simultaneously. So these drives cannot be saved or restored
from Windows. The most notable case is the system partition or partition with
the swap file. If you want to save these partitions with the Windows version,
you have to do it either from a second Windows installation, or from a WinPE
or BartPE CD, or from Windows Vista/Seven recovery console.
If drive letter assignment on each partition seems wrong, do not use the
program because it means it cannot disallow other programs to access the
partition when saving/restoring (so data will be corrupted).
The whole disk, the partitions table and main partitions of extended type (the
main ones, not logical inside them) can be saved/restored only from Windows XP
version (previous versions cannot force OS to read partitions table again once
this one has been modified).
Following options and corresponding ones into options file have described
behaviour:

  - -bui: becomes "-tui".
  - -buix: becomes "-tuix".
  - -pm: becomes "-cm".
  - -ncd: drive assignment is always done (so option is ignored).
  - -nvd: checking disk write is always disabled less for floppy drives in
    Windows 95/98/Me (it is as if option is always used).
  - -nvf: checking file write is always disabled (it is as if option is always
    used).

Files created from Windows version can be used with DOS version (and
vice-versa less in cases described into this chapter). But program can
consider restoration destination is different from what was saved because
physical definitions can be different (this can be a problem when saving all
sectors as it needs to have the same physical definition). It shall be noticed
also that in case of saving a NTFS device from Windows, this one can be
restored in DOS, but device will become unavailable from DOS. Moreover
restoring a NTFS device on a FAT device (or vice-versa) does there is an
incoherence between partition type set into partitions table and filesystem
(it is better either to avoid this type of handling or to fix the partition
type into partitions table with program like XFDISK).

Note:
-----
In case mouse seems to not work, it is because console is configured to use
quick edit mode. You have to click on the window icon on top left, choose
"Properties", "Edit options" tab and uncheck "Quick edit mode" (note: as it is
translation from French version, menu and options name are certainly not
exactly these ones but something similar).

  b) Windows before Windows 95:
I do not think the Windows version can be executed on these Windows versions.
But if it works, it is better you do not use it and you use the DOS version in
DOS mode.

  c) Windows 95/98/Me:
These versions of Windows do not allow direct access to disk. So you can only
save floppy disk or devices. So it is better to use the DOS version in DOS
mode.

  d) Windows NT/2000/XP/Vista/...:
These versions of Windows allow accessing NTFS drives, so it is not needed to
create backup files on NTFS partition before as it is the case for DOS
version. But, in case you save a NTFS partition on itself, you will still need
to create these files because they will be used with the mount mechanism
instead of with Windows.
Partitions on Windows dynamic disks can be saved/restored with using Windows
device access.
In these versions, you can need to have administrative rights to be able to
perform backup.

  e) Windows 64 bits:
I cannot test program with a 64 bits Windows, so I cannot say if it works or
not. So be very cautious with these versions: check that drive assignment is
correctly done to partitions, try with using the option to explore a partition
before performing a backup to check that program is able to correctly access
disk.


27- Differences between DOS and Linux versions
----------------------------------------------

Because of differences between DOS and Linux, the two Partition Saving
versions are not exactly the same. Major differences are given here with
taking DOS version as reference.

  a) All versions of Linux:
Linux does not allow protecting a drive that is in use to avoid that several
programs access it simultaneously. So these drives cannot be saved or restored
from Linux. The most notable case is the system partition. If you want to save
this partition with the Linux version, you have to do it either from a second
Linux installation, or from a live CD, or recovery console that is available
on most installation CD.
Partitions on Linux dynamic disks can be saved/restored with using Linux
device access.
You need to have root privileges to be able to have direct access to devices,
so you have to launch program either with using root account or with using the
"sudo" command. To check or explore backup files, this is not needed (any user
can use these options).
Disk detection is done by searching some specific files into the "/dev"
directory with using a predefined order. Because of this, disk numbering can
be different from the one used into DOS (disk number 0 in DOS can have another
number than 0 in Linux). Disk physical definition (number of heads, sectors
per cylinders, ...) relies on partitions table definition as BIOS definitions
are not available. If partitions table does not exist or is not valid, values
given through "heads_sectors=" option of options file are used, else it is
values returned by kernel or some default ones if these ones are invalid.

Device naming is different from DOS/Windows one: it is based on name of device
file (as /dev/hda1). Program uses the "/etc/fstab" file to get a list of
devices where to search. So in case a device does not appear into list you can
add an entry into this file to force its detection (note that device file
shall be a block device file).
As for device name, mount point name is not the same: it does not use a
"<mount number>:" notation but "//<mount number>" one to know a mount shall be
used instead of some local file.
Following options and corresponding ones into options file have described
behaviour:

  - -bui: becomes "-tui".
  - -buix: becomes "-tuix".
  - -tuix: size is set to terminal size (if this one is bigger than 80*25)
    instead au 80*50.
  - -ncd: device name assignment is always done (so option is ignored).
  - -nvd: checking disk write is always disabled (it is as if option is always
    used).
  - -nvf: checking file write is always disabled (it is as if option is always
    used).

Files created from Linux version can be used with DOS version (and vice-versa
less in cases described into this chapter). But program can consider
restoration destination is different from what was saved because physical
definitions can be different (this can be a problem when saving all sectors as
it needs to have the same physical definition). It shall be noticed also that
in case of saving a not FAT device from Linux, this one can be restored in
DOS, but device will become unavailable from DOS. Moreover restoring a not FAT
device on a FAT device (or vice-versa) does there is an incoherence between
partition type set into partitions table and filesystem (it is better either
to avoid this type of handling or to fix the partition type into partitions
table with program like fdisk).
On contrary to backup files, options file created from Linux cannot be used
from DOS (and vice-versa) because of file and devices naming differences. If
you modify it to always use some file from current directory, you still shall
take attention on disk numbering that can be different.

  b) Secured versions of Linux:
On some very conservative Linux versions (known as SELinux), program can fail
to launch because it is compressed. In this case you have to go to the UPX
website (http://upx.sourceforge.net) to use this program to inflate binary
(upx -d spartlnx.run -ospartlnx_unc.run) then launch obtained file.

  c) Linux 64 bits:
I cannot test program with a 64 bits Linux, so I cannot say if it works or
not. So be very cautious with these versions: try with using the option to
explore a partition before performing a backup to check that program is able
to correctly access disk.


28- Log file
------------

This file is created in case you request it either through dedicated option in
options file or through checking corresponding option when the backup file is
requested. This file will store all error messages displayed by program during
its execution (there is no additional message less starting and ending
messages).
The file begins with a "Start of execution on <date> at <time>." and ends with
a "End of execution on <date> at <time>." if there was no error, "End of
execution with error on <date> at <time>." if there was an error that prevents
complete execution, "End of execution with warning on <date> at <time>." if
there were errors that do not prevent complete execution (as bad sectors) or
"Execution canceled by user on <date> at <time>." if user canceled execution.
In case you do not get the end message, it means program ends abruptly, so
with some error that could have been not logged (as if there is not enough
memory).
There is no real need to use this log file in most cases. You should be aware
that in case you have a damaged disk, it will store a lot of messages and so
become very big (so it is better to create it on a drive where there is a lot
of available space).


29- What is not supported
-------------------------

The following situations are not supported for this program:

  - partitions for OSes that do not follow partition format as it is described
    (MBR or GPT).
  - disk manager programs (not to be confused with boot manager programs that
    are supported). These programs allow access to disks of more than 8 Gb
    with standard mode (if you use one, you will probably know it). If only
    one partition is detected when you know that there were several, there is
    a good chance that such a program is present.
    Francisco Miranda has reported to me that he has successfully run
    Partition Saving with Samsung disk manager. Thanks to him for having tried
    it and for returning this information back to me. Nevertheless this is
    only valid for this disk manager, consequently I prefer to let stand this
    warning for others disk manager.
  - extended partition with OS2 cannot be all detected: into extended
    partition chain, generally only two partitions per node are defined (the
    two others contain invalid information), but OS2 seems to use all four
    partitions.
  - partitions managed with LVM/LDM (Logical Volume/Disk Management, also
    known as dynamic disk). Windows version allows accessing Windows LVM and
    Linux version allows accessing Linux LDM (and so allows saving/restoring
    them) through devices access.


30- What cannot be tested
-------------------------

The following situations cannot be tested:

  - disk with a sector size other than 512 bytes.
  - partitions for OSes other than DOS, Windows (9x, XP) and Linux.
  - creating backup file on partition which is saved, unless using dedicated
    option.

If someone uses this program with one of above situations, I will be pleased
to know the results and any problems encountered. For people wishing to make
these tests, I want to say:

  - savepart.exe -s only reads the disk physically (writing is done in a file
    with standard DOS features) unless mounting some partition.
  - savepart.exe when used with "-t" option does not write anything on the
    disk.


31- Acknowledgements
--------------------

  - my father for having asked me for this program (without whom it would
    never have been written), for having read this document (the French
    version, any mistakes in this one is due to my poor English) and being the
    first to test this program.

  - DJ Delorie for the DJGPP environment (http://www.delorie.com/djgpp). This
    includes equally everyone who has helped him create that environment.

  - Jean-Loup Gailly and Mark Adler for the zlib compression library
    (http://www.zlib.net).

  - Ralf Brown for all the documentation that he has gathered on interruptions
    (http://www.pobox.com/~ralf).

  - Simon P. Bullen for fortify (a library to permit checking memory
    allocation).

  - Chris Lattner for his Website "The Operating System Resource Center" where
    you can find a lot of information on hardware and software
    (http://www.nondot.org/sabre/os/articles).

  - R‚gis Duchesne and Richard Russon (and everyone that helped them) for all
    the documents they gathered regarding NTFS
    (http://linux-ntfs.sourceforge.net).

  - Markus Oberhumer and Laszlo Molnar for the executable packer UPX
    (http://upx.sourceforge.net), and Serge Delbono for having pointed out it
    to me.

  - All people that have participated into development of MinGW
    (http://www.mingw.org).

  - Brett Stevenson and Richard Ross-Langley for the correction of the English
    version of the FAQ and the web site homepage.

  - Ralph Ball for the correction of the English version of the manual. I have
    got several offers for this (thanks to those having done this offer), but
    Ralph is the one that had courage to end it !

  - B.D. for having searched and given the format of registry files (I cannot
    find the whole name of the author).

  - Will Rickards for pointing to me that when restoring a partition on a new
    disk, bad sectors information can be resetted.

  - Giorgos Kostopoulos for pointing to me problems that can occur in case one
    of used OS is set into hibernation mode and its filesystem is modified.

  - Bob Supansic for the correction of the English version of the HOWTO and to
    have given me some advice on its presentation.

  - Fred Lumsden for the correction of the English version of the additional
    information.

  - bug finders for reporting them to me and helping me to resolve them:

    * Charles M. Tilden (problem on bad detection of hard drive).
    * Daniel Lagunes (bug on reading partitions table for standard access disk
      with at least two logical partitions).
    * Thibaud Fontanet (failure of detection for some hard disks in V2.21 and
      hang up of computer when rebooting, the first problem had been reported
      by Juergen and Ray Schmitz)(for V2.22 bad attribution of DOS drive
      letter when there was several main DOS partitions on the same disk).
    * Ray Schmitz (problem about accessing the wrong disk in the case of a
      drive before it is not detected as a hard disk).
    * Volker Beck (the forgetting of code to allow saving NTFS partition with
      batch mode).
    * Frode Ingebretsen (screen problems with some computers (incompatible
      BIOS ?)).
    * Brian Bell (the inability to restore FAT partitions that have bad
      sectors when saving).
    * Menno Schoone (the unnecessary asking for option file creation when
      saving with an option file using the automatic_naming option).
    * Patrick Barny (the first who has helped me with very fragmented NTFS
      partition, followed by Peter Newman and Kamil Wicher).
    * S‚bastien Willemijns, Gershwin Luhur and popfulmail (the unnecessary
      asking for option files creation when saving with an option file in
      which given file names were not full pathname). S‚bastien Willemijns
      gives me also some points of amelioration of the interface and finds
      problem when creating file in Windows XP with the V3.70 DOS version.
    * Ian Stuart Turnbull (some NTFS files cannot be found in case partition
      goes in a lot of stress and files get allocated into a part that I
      considered as reserved for filesystem files). He has also confirmed me
      that the Windows 2000 registry update works, as I cannot test it.
    * Jorge Cesario (a regression in V3.00 and V3.01 versions that does that
      removable media were no more detected and so files name were asked
      instead of requesting for media change).
    * Wu Chaowei (bad setting to occupied of clusters that are after MFT0 when
      restoring a NTFS partition to a different one but with a similar size).
    * Thijs van der Kraan (missing setting of one modification date when
      modifying a file on a NTFS partition). He also gives me the idea of the
      "empty_files" option into the configuration file.
    * Dirk F. Kapelle (workaround of a problem in DOS network redirector that
      removes the distant directory in case this one is empty). He gives me
      also some points of amelioration of the interface.
    * Patrick Cadro (impossibility to access partition with number between 10
      and 19 when saving first partition with Linux version).
    * Gerrit van der Linde (wrong free memory size in case of having more than
      4 Gb of memory with Linux version).

  - All the people who have sent me emails of encouragement, comments, and
    suggestions for improvements.


Hoping this program will be useful,

D. Guibouret <damien.guibouret@partition-saving.com>

------
All trademarks and registered trademarks are property of their respective
holders.
