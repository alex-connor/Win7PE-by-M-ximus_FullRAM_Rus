Multimedia Player and Id3tag Viewer Ver 2.46
============================================

This is an extention of my precedent MP3 player lister plugin 
for Total Commander (version 5.50 and above only)

This viewer is always able to display Id3tag v1 and v2 while playing MP3 file
but also can play all media file "Windows Media Player" may recognize
(i.e. : MP3pro file,  M3U playlist, all directshow codec, ...)
You must before add the extension in the "mmedia.ini" file.

Since version 2.10, you have now the choice between MCI, MediaPlayer 6.4+, and WMP 7+ as player.
Since version 2.43, OGG Vorbis comments are shown
(Recommended directshow filter for Ogg Vorbis file : http://tobias.everwicked.com/)

Installation
-------------
1 - copy "mmedia.ini" and mmedia.wlx in your plugin directory
 ( if "mmedia.ini" isn't found in the plugin directory, it will be created
   in the windows path)

2 - optional 
  verify that "msflxgrd.ocx' is present in your system path 
  if not, 
     download it here (http://www.martin2k.co.uk/vb6/ocxs/msflxgrd.zip)
     install it : copy it to your system directory 
     register it : not neccessary since MMedia ver.2.42

3 - add these two lines to your wincmd.ini (in 5.50 and above)
....or use the Lister plugin interface (in 5.51)

[ListerPlugins]
0=C:\wincmd\plugin\mmedia.wlx
     (Change path to your real one )

4 - only for TC 5.5/5.51 users : disable multimedia (avi, wav,...) in lister configuration

5 - eventually, you can add or remove extensions in "mmedia.ini"
two lines are provided
    MMext are files without Id3tag
    MP3EXT are files with Id3tag

Use
-----
'SPACE key' can play or pause
'S' stop playing
'M' mute sound
'X' switch to fullscreen ('ESC' to exit fullscreen)
'Z' switch between 50, 100, 200% video size
AltGr+'Z' switch between fit/100% video size
Ctrl+'N' / Ctrl+'P' : for playlist file (M3U), jump to next/previous file
'N'/'P' : according to lister's shortkey, jump to next/previous file

'F' key can fit the player in the lister's windows or return to previous state
if playing audio file, Visualization is shown (the last you choose in WMP).
if playing video file, you can double click on movie to play it fullscreen

Ctrl+'E' allow edit ID3tag
to edit ID3TagV1, you can now edit the ID3tag while playing song but when saving
tags, the song restart to beginning

to use alternate interface mode
start the lister in QuickView mode and change the interface, it will be saved only for the QV mode

Status and Encoding flags
-------------------------
Status:
   T - Tag preservation
   F - File preservation
   R - Read only

Encoding :
   U - Unicode encoding

   C - Compression
   E - Encryption
   G - Grouping identity

Description of "mmedia.ini"
---------------------------
[ext]
MMEXT : extension for file without description, suitable for all multimedia files
MP3EXT : extension for file with reading of id3V1tag or M3U description

[Options]
autostart = 1           : 1 = play automatically files (0 don't)
infopresencewmp = 1     : 1 = warn lack of WMP presence (0 don't)
RememberAP=0            : 1 = remember the last active page
interface = 3           : 0 none, 1 MCI, 2 MP 6.4+, 3 WMP 7+
    none is same as old id3only option ( dont load WMP )
Alternate = 3           : id to interface but for QuickView mode
autosave = 1            : autosaving size and position of mmedia lister  (0 don't)
autoclose = 0           : autoclose at end of playing
flxocx = 0              : 1 = enable tab view of ID3v2 frame 
fit = 0                 : 1 = start video fit in window (0 = 100%)
Rect=EA0200001401000081040000050300008E  : size and position of mmedia lister (remove line to reinit)

Warning : some extensions cannot be read when you choose MCI as player (you have to remove then)
        in particular M3U from MP3EXT line


Some code come from :
--------------------
Roman Nurik       : MP3Info library
Giancarlo Iovino  : HyperLink static control
Michael Smith <msmith@xiph.org> : OggVorbis file info 
Christian Ghisler : listplug.zip,lister plugin interface 

Remark :
--------
 there is a bug in Total Commander 5.50/5.51 when you load 
 some files with a multimedia extension. For the first file, 
 the multimedia plugin work but for the next files 
 the default lister of total commander will be used.
 
 You got the same with quick view (CTRL+Q) when you
 jump from one file to another.

 This is corrected in Total Commander 6.0

History :
-------
2.46 - 28.10.2005
   - Updated : speed even more launching of most MP3 file
   - Updated : extensions and comment in mmedia.ini
   - Added : option to start video at 100% or fit to window
   - Added : key "Z" to switch size (dont work in WMP)
   - Added : key "AltGr+Z" to switch fit/100% video size
   - Added : pressing "left WIN"+F3 key in TC launch MMedia in lister without player
   - Added : "CTRL + E" key to switch Edit state in ID3tagV1 tab
   - Added : Volume is saved in MCI player
   - Added : Determine Guess Encoder (Beta 85%)
   - Added : display First Frame position
   - Added : determine ABR/VBR/CBR LAME encoding
   - Added : correct bad Xing header
   - Added : Read/decode Xing Tag
   - Added : Read/decode VBRI Tag
   - Added : Read/decode Lame Tag
   - Fixed : MP3pro bitrate with some encoder
   - Fixed : adding id3v1 tag to a file crash plugin
   - Fixed : prevent to run plugin if interface=0 (none) and file in MMEXT list

2.45 - 31.08.2005
   - Updated : speed up launching of most MP3 file
   - Added : remove Extended Information field from M3U playlist
   - Added : compatible with PLS playlist
   - Added : support 'w' key to switch WordWrapping on/off
   - Added : hide ID3V2 tab if don't exist
   - Added : font in "playlist tab" follow now user's choice
   - Added : determine CBR/VBR encoding
   - Added : determine VBR bitrate more accuratly
   - Added : automatic plugin installation (TC 6.5 and above)
   - Fixed : msflxgrd.ocx not downloaded when pressing button in "Option" tab
   - Fixed : handle mp3pro files uncorrectly
   - Fixed : extra line when WMP vizualisation is hiden
   - Fixed : Get empty window with all missing files in playlist 
   - Fixed : restart playing when clicking on same song
   - Fixed : "Ctrl + N/P" doesn't work
   - Fixed : Get Focus when jumping to next song in playlist
   - Fixed : Unicode encoding status false

2.44 - 19.01.2004
   - Added : delay-loaded ogg.dll and vorbis.dll
   - Added : save now track value even if ID3tag is v1.0
   - Added : saving a track value will update ID3tag to v1.1 if not
   - Fixed : can't save ID3tag
   - Fixed : Path and filename disappeared, in 'file information'
   - Fixed : doesn't take any input in QuickView mode
   - Fixed : Freeze TC with movie when WMP9 interface is chosen
   - Fixed : crash when autoclosing

2.43 - 15.01.2004
   - Added : preliminary code to support ogg vorbis comment
   - Added : volume level saved between sessions (exept MCIplayer)
   - Added : Split Option/Info page
   - Added : Show Edit state in ID3tagV1 page
   - Added : Registry entries are now automatically make up when missing
   - Fixed : 'ESC' and other shortkey works now even when player has focus
   - Fixed : SetVolume with MCIplayer works now
   - Fixed : reset and hide track value when missing in ID3TagV2
   - Fixed : Check RE and related messages are definitively removed
   - Fixed : Update ID3Tag V1 values when playing m3u list
   - Fixed : Update ID3Tag V2 Frames when playing m3u list
   - Fixed : no longer gain focus when jumping to next song

2.42 - 06.01.2004
   - Added : Frame tab disabled if "msflxgrd.ocx" is not installed
   - Added : automatically register msflxgrd.ocx
   - Added : option to disable Frame tab
   - Added : add direct link to download msflxgrd.ocx
   - Added : track # in ID3V2
   - Added : add shortcut 'x' to switch to fullscreen
   - Added : read directly DVD files ( "vob, ifo" added in mmedia.ini)
   - Fixed : correct keystroke behaviour
   - Fixed : incorrect CRC status
   - Fixed : crash when recall QuickView
   - Fixed : some typo errors

2.41 - 01.12.2003
   - Added : prevent to run plugin in QV mode if alternate=0 and file in MMEXT list
   - Added : show information from MediaPlayer while playing movie 
(press "f" to see it in "file information" tab)
   - Fixed : hang with movie when WMP9 interface is chosen

2.40 - 26.11.2003
   - Added : (need to be tested) jump automatically to the next file when many files were selected (TC 6.0+ only)
   - Added : you can now choose separately your interface in QuickView mode and in lister mode
   - Added : allow user to resize column in frame tab
   - Added : add shortkey 'M' to mute 
   - Change detectstring according to final version of TC 6.0
   - Fixed : move and resize some elements to better fit in small display
   - Fixed : crash when changing volume with MediaPlayer 6.4+
   - Fixed : change tab order in ID3tagV1
   - Fixed : sometimes genre was not saved in ID3TagV1

2.30 - 23.09.2003
   - Added : compatibility with TC 6.0
   - Added : can now edit and save ID3V1 while playing file
   - Added : Hide directory in playlist tab
   - Added : Hide "playlist" tab, when file was not a "M3U" playlist
   - Fixed : file from different directory in playlist are now correctly played
   - Fixed : if file doesn't exist, jump to the next in playlist
   - Fixed : Read now only ANSI char in playlist (used to be compatible with makebat.wcx)
   - Fixed : Update selection in playlist tab
   - Fixed : Sometimes 'ESC' key doesn't work
   - Fixed : don't autosave when iconized or maximized
   - Fixed : (NT4/Win95) "File Properties" and "Image Header" tabs doesn't show scroll bar correctly
   - Added : links to HTML homepage and e-mail, send comments to the author ;)

2.20- 27.06.2003
    - playing M3U list work now with standard MCIplayer
    - add playlist tab (for m3u files)
    - show playlist count
    - show idtag of selected file in m3u playlist
    - switch between song in M3U playlist with CTRL-N & CTRL-P keys
      even without player
    - use stacked tabs to prevent a resize bug
    - need less memory
    - fix a bug with fontsize
    - fix a bug with Richedit library
    - fix multiple instance started (error message related to "richedit" library)

2.10- 12.05.2003
    - show m3u list of files
    - allow to change volume with '+' and '-' keys
    - give the choice of Media Player (see 'options' tab)
        (be care of unsupported format)
    - add an option to close automatically at end of playing
    - show size of file
    - fix a bug with QuickView

2.00- 30.04.2003
    - new interface from fileinfo
    - show version of id3tag v1 and v2
    - can edit id3tagv1
    - read id3tagv2 (until ver 2.3) and frame header
    - fix a bug when multiple instance
    - fix MP3 information with some MP3 files
    - add shortcut keys to play/pause/stop reading media file
    - list files in M3U playlist

1.66- 16.03.2003
    - "mmedia.ini" : look at the same directory that the plugin then the windows directory
    
1.65- 11.03.2003
    - considerably reduce size of plugin
    - correct a bug for files without extension 
    - read CDA files (CD audio)
    - add option to autosave windows position and size (see "mmedia.ini")
    - test if called for QuickView or for external lister to apply autosave
    - player size follow Lister's windows changes of size 

1.60- 04.03.2003
    - add option to autostart on/off (see "mmedia.ini")
    - add option to start MCI only (see "mmedia.ini", be careful that extentions was supported by MCI)
    - add option to disable infobox when WMP8 or WMP9 is not installed (see "mmedia.ini")
    - add option to view only Id3V1tag (see "mmedia.ini")
    - support "fit image to window" (reduce with 'f' key)
    - now support uppercase extension
    - correct default list of extension in "mmedia.ini"
    - read M3U files

1.50- 02.03.2003
    - use WMPlayer 9.0 extension
    - change name to mmedia.wlx

1.0 - 24.02.2003
    - Initial public release

License Agreement
--------------------------------------------------------
This plugin is free software and provided "as is" without warranty of any kind, including, but not limited to, the implied warranties of merchant ability and fitness for a particular purpose. Should the program prove defective, you assume the cost of all necessary servicing, repair or correction.
This program can be freely copied/distributed without breaking distributive package integrity.

-----------------------------------------------------
Send comments to the author :
François GANNIER  ( fgannier@physio-a.univ-tours.fr )