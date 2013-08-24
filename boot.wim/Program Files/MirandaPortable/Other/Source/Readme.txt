Miranda IM Portable Launcher
============================
Copyright 2004-2008 John T. Haller

Website: http://PortableApps.com/MirandaPortable

This software is OSI Certified Open Source Software.
OSI Certified is a certification mark of the Open Source Initiative.

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.


ABOUT MIRANDA PORTABLE
======================
The Miranda Portable Launcher allows you to run Miranda from a removable drive whose letter changes as you move it to another computer.  It allows you to split the program directory from your profiles directory without hand editing any files.  The program can be entirely self-contained on the drive and then used on any Windows computer.


LICENSE
=======
This code is released under the GPL.  The full code is included with this package as MirandaPortable.nsi.


INSTALLATION / DIRECTORY STRUCTURE
==================================
By default, the program expects one of 4 directory structures:

-\ <--- Directory with MirandaPortable.exe
	+\App\
		+\miranda\
	+\Data\
		+\profiles\

OR

-\ <--- Directory with MirandaPortable.exe
	+\PortableMiranda\
		+\App\
			+\miranda\
		+\Data\
			+\profiles\

It can be used in other directory configurations by including the MirandaPortable.ini file in the same directory as MirandaPortable.exe and configuring it as details in the INI file section below.  The INI file may also be placed in a subdirectory of the directory containing MirandaPortable.exe called MirandaPortable or 2 directories deep in PortableApps\MirandaPortable or Data\MirandaPortable.  All paths in the INI should remain relative to the EXE and not the INI.


MirandaPortable.INI CONFIGURATION
=================================
The Miranda Portable Launcher will look for an ini file called MirandaPortable.ini (read the previous section for details on placement).  If you are happy with the default options, it is not necessary, though.  The INI file is formatted as follows:

[MirandaPortable]
MirandaDirectory=App\miranda
ProfilesDirectory=Data\profiles
MirandaExecutable=miranda32.exe
AdditionalParameters=
RunLocally=false
DisableSplashScreen=false

The MirandaDirectory and SettingsDirectory entries should be set to the *relative* path to the appropriate directories from the current directory.  All must be a subdirectory (or multiple subdirectories) of the directory containing PortableMiranda.exe.  The default entries for these are described in the installation section above.

The MirandaExecutable entry allows you to set the Miranda Portable Launcher to use an alternate EXE call to launch Miranda.  This is helpful if you are using a machine that is set to deny miranda32.exe from running.  You'll need to rename the miranda32.exe file and then enter the name you gave it on the mirandaexecutable= line of the INI.

The AdditionalParameters entry allows you to pass additional commandline parameter entries to miranda32.exe.  Whatever you enter here will be appended to the call to miranda32.exe.

The RunLocally entry allows you to have the launcher copy Miranda and your profile to the local PC and run it from there.  This is useful for running from a CD or other read-only medium.  It will be deleted when you close Miranda (of course, it is possible to undelete files within Windows, so your personal data may be at slight risk in this scenario).


PROGRAM HISTORY / ABOUT THE AUTHORS
===================================
This launcher is loosely based on the Firefox Portable launcher and contains some ideas suggested by mai9 and tracon from the mozillaZine forums.