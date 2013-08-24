Non-Stop Copy v1.04
© Dmitry Sergeev, 2006 mailto:dmitrys@nm.ru
Official site of the development engineer: http://dmitrys.nm.ru



SYSTEM DEMANDS

The operating system - a Windows 95/98/ME/NT4/2K/XP/2K3 and is higher.
(the Detailed information on operating systems - in section 
"COMPATIBILITY".)



THE AGREEMENT

The program "Non-Stop Copy" is absolutely free-of-charge and free for 
Usages. You can freely pass round it, and also include 
In composition of any free-of-charge distribution kits and carrying agents, at observance 
The following conditions:
1) All files of the original distribution kit are switched on in your distribution kit;
2) All files of the original distribution kit are not changed by image;
3) All files of the original distribution kit are installed in one 
The directory.
You can receive the original distribution kit on an official site 
The development engineer which address is indicated in the beginning of the given file.



ASSIGNMENT

The program allows to copy the affected files from any carrying agents, 
And the information from not readable sectors is substituted by zero octads. 
Also tries to read the information from badly readable sectors in 
Some tryings.

The program does not use any low level methods of reading 
The information, and due to this it will be correct to work on any types 
Carrying agents and on any file systems supported operational 
The system.



USAGE OF THE PROGRAM

To copy the file, press the button "Choose a file". The program 
Will ask you to specify in the beginning the initial (copied) file, and then a name and 
Location of the target file (where to copy). After that, for 
Start of the process of copying, press "Start".

To continue a copying file, not up to the end copied another 
The program, press the button "Choose a file" and specify in the beginning initial 
(Copied) file, then specify not up to the end the copied file in 
Quality of the target file. If all of you have correctly made, a card{map} 
Should show, that the part of the file is already successfully copied. For start 
The process press "Start".

You as can copy in one target file from different initial 
Files, for example when you have some equal copies of the file. 
For this purpose in the beginning start copying one of these files and 
Wait, when the program will copy all that is possible and will stop 
Copying. Then press "Choose a file" and in the capacity of initial 
Specify the following copy of the file. Then start copying. If the ambassador 
It bad sections will still stay, and you have still copies of the file, 
You can specify again the following source file, etc.

In a time of the process of copying there are disposable two buttons: "Stop" 
And "Cancel".
The button "Stop" completely shuts down the process of copying, thus 
All data on a state of the process at the moment of break (see are saved. 
Below). The target file after a shut-down has the same size, as 
Source file. It contains everything, that has had time to be copied, and parts 
The file which to be copied had not time or which to copy not 
Was possible, substituted by zero octads.
The button "Cancellation" completely cancels the process of copying, and all, that 
It has had time to be copied, is deleted. In general, this button is stipulated on 
That case if it is necessary for you to stop fast the process and thus 
Its result of you any more does not interest. For example, pressing of the button "Stop" in 
The beginning of copying of rather big file can result to 
To some delay of a shut-down, because of "overwriting" not copyed 
parts of the file in zero octads. The button "Cancel" in this case 
Will stop the process at once.

All copyings given about the process - some information about initial 
The file and a map of bad sectors - are saved in the NSC-file. This file 
It is stored in the directory of the target file under a name which is gained from 
Name of the target file addition of ".nsc extension.
If copying is completely completed and did not remain bad sectors, 
The NSC-file is not saved or deleted, if it has been saved earlier. In 
The process of copying the NSC-file is automatically saved with 
Periodicity which is defined{determined} by an option "NSC-file autosave period".


It is not necessary to delete the NSC-file as due to it you will know, that 
The appropriate file in this directory is copied not up to the end. Besides 
You can always continue copying of this file.

If you want to look the information on any file, which 
Copied with the help "Non-Stop Copy", press the button "Display 
information" also select or the copied file on which want 
To see the information, or the appropriate NSC-file.
The NSC-file is saved with attribute "hidden", therefore, to see 
It, you should switch on in adjustments of an explorer mapping hidden 
Files.



THE DESCRIPTION OF THE PROCESS OF COPYING

The process of a copying file is divided into 4 stages: fast copying, 
Detailing, exact detailing, copying of bad sectors. The purpose 
This sharing - for as it is possible to copy a smaller time as it is possible 
More than good sectors, and at each stage to gain more and more 
Detailed picture of bad sectors.

Fast copying. The file is copied by rather big blocks. A size 
This block "Buffer of fast copying" is defined{determined} by an option; if 
Option "Auto" the buffer is equal 1mb at copying with fast is switched on 
Carrying agents (a CD, HDD), and 64kb at copying from slow carrying agents 
(FDD). If inside such block there is a bad sector, all block 
Will be considered "bad". In result fast skip is attained 
Groups of bad sectors rather approximate picture also is gained 
Bad sections of the file.

Detailing. Each bad section is copied on sectors up to first 
Bad sector, at first moving from the beginning of a bad section, then from 
The end of a bad section in the opposite direction. In result at small 
Expenses of a time more exact picture of localization of groups is gained 
Bad sectors.

Exact detailing. The program tries to copy each sector in 
All bad sections. On the termination{ending} of this stage it is gained real 
Picture of bad sectors.

Copying of bad sectors. The program tries to copy everyone 
The bad sector, thus does{makes} successively some tryings of reading. 
The quantity{amount} of tryings is defined{determined} by an option " Tryings to copy bad 
Sector ". On it ability of the program to copy sets up 
The information from badly readable sectors, as in some cases 
(for example, the old or badly written CD-R the disk) is probability, 
That the sector all the same will be read.

Such sharing on stages always allows you during copying 
To decide: to wait further or to stop on achieved. If you 
Consider, that copied it is enough, is simpl press the button "Stop". 
Later you can continue copying, if result of you all the same 
Will not arrange.

The program can be customized so that the last stage 
Repeated until all file will not be successfully copied. 
Therefore the program also is named - Non-Stop Copy. This behaviour it is possible 
To achieve with the help of an option "Max. cycles of 'bad copying'", 
Which defines{determines}, how many time will be repeated the last stage.

During copying the program tries to inspect a time, 
Which will be spent for this or that reading. A size of these 
Time intervals it is installed by options in section "Timeouts
Data readings". Unfortunately, whether it operates whether or not, precisely to tell 
Difficultly - for whom as. The program fairly tries to cancel the operation 
Readings after the fluxion of the indicated time, and the rest depends from 
The drivers placed{installed} in an operating system, and from the drive.



OPTIONS

"Fast copy buffer size" - sizes up the block at fast 
copying. At powered option "Auto" this value is selected 
automatically depending on type of the carrying agent on which it is located 
source file: 1mb at copying from fast carrying agents (a CD, HDD) and 
64kb at copying from slow carrying agents (FDD).

"Attempts to read a bad sector" - defines{determines} quantity{amount} of tryings 
to copy bad sector at a stage "Copying of bad sectors".

"Bad sector copying cycle repeated" - defines{determines}, how many time 
The stage "Copying of bad sectors", under condition of presence will be repeated 
Bad sectors. If this value is equal 0, quantity{amount} of repetitions not 
It is limited - tryings proceed until absolutely all not 
It will be read.

"Data read timeout values (milliseconds)" - values in this section define{determine} section 
For each stage, through how many milliseconds the operation will be cancelled 
Readings, and the read - out section of the file is marked as bad. Do not entrain 
Excessive decrease of these values as the program can begin 
To mark really read sections of the file as bad. 

"NSC-file autosave period" - defines{determines} in milliseconds, as 
Frequently during copying the NSC-file will be automatically saved.

"Period of the media readiness check" - defines{determines} in milliseconds, 
As the program will frequently interrogate the carrying agent on availability, in a case 
Extracts of the carrying agent in a time of the process of copying.

Section "File map colors settings" allows you to change color 
Appropriate unit on a map.



THE COMMAND LINE

With the program it is possible to work through the command line.

Usage:
  nscopy.exe [SourceFile] [TargetFile] [/e] [/p] [/w] [/c] [/u]
Or
  nscopy.exe [<the File or the NSC-file>/i]

Where:
  SourceFile - a name of the initial (copied) file
  TargetFile - a name of the target file (where to copy)
  The file or the NSC-file - a name of the copied file on which it is necessary 
To display the information, or the name of the NSC-file is direct
/e - to leave from the program after completion of copying
/p - to switch off a computer after completion of copying
/w - to not start copying at once
/c - to show the dialogue of choice of the file
/i - to display the information on the copied file
/u - to not produce any messages demanding response of the user



COMPATIBILITY

Complete functionality is provided on bar of Windows NT 
(NT4/2K/XP/2k3/...)

Under a Windows 9x (95/98/ME) the program has one limitation - not 
work timeouts data readings. Though loss is not great - they and so 
seldom work.;)



IN ADDITION

Read "howto.txt file, in it you can find some useful 
information. For example, how to copy with help NSCopy the whole directories.

Specially for "geniuses" who were opened recently for themselves by editors 
Binary files. In case of change of copyrights (a line of a copyright 
in the bottom of the main window), correctness of operation of the program can is strong 
to suffer. It as though a small hint.
If so it would be desirable advertising, nothing prevents{mixs} you to make an installer, 
which will advertise everything and somehow.



KNOWN PROBLEMS

- Does not work TAB and ENTER in the main window - it is simplis while it not 
Has made.
- In a Windows 9x, at extract of the disk in a time of the process of copying, 
Jumps out the dark blue screen with the request to insert the disk. I while am at a loss, 
How to solve this problem. If who has ideas - write to me, 
Please. SetErrorMode () if that, here does not help.



THAT IN THE FUTURE

Very approximate schedule, by way of sequence of implementation:

- Support Unicode
- Copying the directories
- Possibility of creation of patches - files

If one of these possibilities really was necessary for you - write to me 
About it. Probably, it will add me stimulus, and in the following version you 
Will see that wanted. 

As sentences on localization of the program on others are accepted 
Languages.



GRATITUDE

First of all, I want to express huge gratitude to Alexey 
(w4mn@yandex.ru), for the invaluable help in correction of documentation, 
The interface, and, the most important, for qualitative English localization 
The interface.
PropheT'Ò (vidimong2002@ukr.net) - for the Ukrainian localization.
To my brother, Sergeevu Vitaly (vetal@gorodok.net) - for creation of a site, 
The help in testing and in general for all.:)
To Ushatkinu Leonid (theleo2k3@list.ru) - for the help in testing.

And as to everyone who wrote, for your responses and sentences.



HISTORY OF VERSIONS (THAT NEW)

1.04 (27/02/2006)
   Continuation of copying not only from the same stage, but also with the same 
Positions in the file on which have stopped.
   The key/u is added.
   At extract of the carrying agent during copying does not appear 
System dialogues. Now the program itself expects availability of anyone 
The carrying agent, including network. In result now it is possible 
To use the program for safety copying files on the network.
   In a window title and in a task bar it is represented{is mapped into} "is ready", when 
The process of copying is stopped.
   If the file is completely successfully copied, to the target file 
Date of modification and attributes of a source file are exposed.
   The necessary option "Timeout cancellations of the process is removed{cleaned} to nobody 
Copyings".
   Adjustments of colors of a card{map} of the file are added.
   The Russian interface is corrected and is made qualitative English 
Localization (thank Alexey)
   The Ukrainian localization (thank PropheT'Ò) is added
   Till now did not drive with the command line. Now she{it} completely 
It is altered - should work always.


1.03 (24/03/2005)
   Support of a Windows 9x is added.
   Possibility of copying of files by a size more 4GB is added.
   Error messages became much more exact and detailed
   Conversion of short names of files in long is added.
   The dialogue of choice of the file is corrected and there was more friendly: 
Suggests to save the file under the name and in the same directory, where 
The previous file was copied.
   The button of cancellation of the process of copying is added.
   Now by default the last stage repeats only once, and 
That sometimes people did not guess, that it is necessary to press "Stop" and waited on 
Some hours.
   But quantity{amount} of tryings of reading of bad sector by default 
It enlarged up to five.
   The scroll box of copying is reorganized, it became more reliable and more floppy.
   Now record in the target file without the cache is made only at 
Fast copying, at other stages the cache switches on is slightly 
Has sped up the process.
   Infofile's format has varied, in view of support of files> 4GB.
   The error in machining the command line is corrected.
   Mapping an initial state of the window is corrected, now "Start 
Minimized" will work.
   Incorrect release of memory of the buffer of copying is corrected
   The potential error in fast copying (very much is corrected 
It is improbable, but could appear as completion of the first stage 
Earlier, than on a map have reached the end of the file plus offset real 
Positions of bad blocks, in common - distortion of a map).
   Upgrade of a map is slightly optimized.
   Copying empty files is corrected - now it works.:)
   Now does not remain the file completely hammered in the nulls, if at all 
It was possible to copy nothing.
   The incorrect behavior of the program is corrected at the buffer exceeding 
Size of the free actual storage.
   Still all cosmetic and fine corrections.


1.02 (17/12/2004)
The first public version. Up to it the program has passed a lot an alpha 
Versions, it was typed stability.
