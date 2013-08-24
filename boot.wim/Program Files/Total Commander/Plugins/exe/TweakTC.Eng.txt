
===========================================================
Tweak Total Commander
    Version: 6.0.3 sr3
    Status: DonationWare (see About window for details)
    Platform: Windows 95(+IE4)/98/ME/NT4(+IE4/2000/XP/2003
===========================================================

New in version 6.0.3:
  - Some options are removed. Now one can set them
    directly inside Total Commander 6.x;
  - New TC 6.0 - 6.03a options are added;   
  - Support for environment variables in /L= and /R=;
  - Tolltips with ini-file information;
  - Preview for libraries with custom drive buttons' bitmaps;  
  - Added 'Apply' button.
  
  Compatibility with ря 6.50 / ря 6.51:
  - SortUpper;
  - InplaceRenamePath

  SR1:
  - Fixed: error "...Decrypt.dll not found...";
  - Balloon-styled tooltips by default are turned off
    on XP systems (some problems with this style).
    You may turn it on by adding the following line 
    BalloonStyleTT=1
    in TweakTC.ini.    

  SR2:
  - Now icons in icons' preview window are grouped
    in pairs (32x32 & corresponding 16x16);
  - Fixed: incorrect handling for %commander_path% 
    when TweakTC is not launched from Total Commander;
  - Now "Apply" button has standard behavior.
  - Now one can see preview for standard drive buttons'
    bitmaps even when totalcmd.exe is packed;   
  - Now preview for "HOTLIST1" and "HISTORYLIST1" bitmaps
    are removed. The reason: they are not used by TC by now.

  SR3:
  - added option to specify the placement for TC 
    registration key file (wincmd.key or tcmdkey.zip);
  - added import/export for firewall/proxy settings;
  - now if you launch TweakTC from Total Commander, TTC
    reads TC command line and gets ini-files placements 
    exactly from there (of course if they are present); 
  - reading/writing speed for ini-files in NT/XP now is 
    vastly faster because of whole ini-sections' handling;
  - listbox which allows you to define any drive as CDROM
    now includes full list of drive letters (workaround
    for removable CD/DVD ROM);
  - fixed some variances between a few control's captions
    and their real functionality;
  - tooltips for all drive selection lists now show
    strings with already selected drives' letters;
  - added Up/Down buttons for all numeric fields.

==============

  (c) 2002-2006 Alexander Asyabrik aka Shura
  All rights reserved.

=================================================================

  Home page:  http://www.totalcmd.net/plugring/tweaktc.html

=================================================================

Welcome to Tweak Total Commander


****************************************************************
*             You must read this file before you start         *
*                   Tweak Total Commander                      *
****************************************************************

The contents:
~~~~~~~~~~~~

   1. Purpose of the program
   2. Installation
   3. System requirements
   4. Use of the TweakTC
   5. Uninstallation


1. Purpose of the program Tweak Total Commander (TweakTC)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    TweakTC  is  designed  for  advanced  configuration  of Total
Commander  (65  options)  without  manual  editing  its INI files
(usually  wincmd.ini  and wcx_ftp.ini). If one use TC of versions
earlier  than  6.03, some  options will not work, but it will not
harm  the  work  of  your  TC.  TweakTC  by  the  same  way as TC
determines  where  INI  files  are  located,  i.e.  if  you  have
displaced  them in relation to their typical location (in Windows
folder) when installing TC or later, this will be detected.
    The   TweakTC   author  is  not  an  expert  on  TC  settings
adjustment. If you need more information on options, you can find
it  on  site  www.ghisler.com  or  send  your emails to Christian
Ghisler <support@ghisler.com>.
    

2. Installation
~~~~~~~~~~~~~~~~

To install the TweakTC program on your computer:

  a) Unzip files
  b) Copy them in a place at your option 
  c) Make a shortcut to TweakTC.exe

3. System requirements
~~~~~~~~~~~~~~~~~~~~~~~

    OS: Windows 95(+IE4)/98/ME/NT4(+IE4)/2000/XP/2003
    Minimum  hardware:  Intel  486 100 MHz 16 MB 256 colors video
(very slow :( but it really works).
    For  work  you  will  need  the msvbvm50.dll file, which is a
standard  file  of  the  complete  MS-WINDOWS  98  set and higher
(Windows  2003  is an exception). If this file cannot be found in
the  system  folders,  copy  it  from  other computer or from the
distribution kit Windows98, ME.
    There can be an error such as "Unknown..." at startup on some
very  old  systems.  It is also possible if some system libraries
are  absent in your operational system. To solve this problem you
must have one of the following files: VBRUN5*.exe or VBRUN6*.exe.
You  can find them on the Internet or in your CD collection. Then
start  them  on  your  computer (by the way, msvbvm50.dll is also
included in VBRUN5*.exe). It should be enough.

4. Working in TweakTC
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    We hope the program study will not bother you :).
 
    If  you  specify  names  of  INI  files  at TC startup in its
command  line,  you can simply transfer these parameters into the
TweakTC  command  line,  for example having specified them in the
properties of the shortcut to TweakTC.exe.
    Exit with 'Cancel' will not make any changes to INI files. To
save  changes  made  in  the  TweakTC  quit  from  the program by
pressing  'OK' or just use 'Apply' button. If you want changes to
take  effect  after  all, you must reload TC (my utility ReloadTC
highly recommended for this pupose).
    At  export/import  of  FTP-connections conterminous on names,
they  will  not be rewritten, but will be renamed. The duplicated
links will be ignored.
    If  you  have  found out that the TweakTC does not effect the
work  of TC, please verify that the paths to INI files determined
by  the  program  ('ini'  button) conform to the paths used by TC
(see information in the dialog box 'About Total Commander').

    NOTE:  Input of default value for any option will remove this
parameter from INI file.

    ATTENTION:  If  your  computer  uses non-standard screen font
sizes and thus the program inscriptions are distorted, please try
hot  key  'Ctrl+F'. Select an appropriate font size from the list
appeared.

5. Uninstallation
~~~~~~~~~~~~~~~~~~~

    To  remove  the  program  from your computer, just remove the
TweakTC.exe  file,  its  shortcut  created  by yourself and other
files  copied  from  the distribution kit during the installation
process.
    The program does not make any changes to the Windows registry
while running on your computer.


*******************************************************************
*******************************************************************
