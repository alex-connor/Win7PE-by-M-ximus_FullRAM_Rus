MultiArc plugin for Total Commander v1.4

MultiArc allows to view, extract and modify contents of archives that are
currently unsupported by Total Commander (eg. JAR, IMP). MultiArc translates
the commands from Total Commander into corresponding external archiver calls.

You can easily add support for your favorite archiver by editing multiarc.ini.

Some ideas were "stolen" from the file manager FAR by Eugene Roshal.
Thank you Eugene, you wrote a GREAT program, but I prefer GUI applications
in a GUI environment. 8-)


History:
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * = bugfix
 + = added
 - = removed
 ! = important
 ? = unsolved
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

29/07/2007 ver 1.4.1.7
* Fixed stack owerflow when calling GUI settings

26/07/2007, v1.4.1.5
 + IDPos now supports HEX values (e.g. 0x12345) in addition to decimal values.
 + Added support for environment variable %COMMANDER_INI%.
 * Fixed bug when importing Addon via GUI. The Message "Do you want to import addon
   for type(s): [ s ]?" should report the name of the section in Addon for [ s ].
 * Increased limit of import line from 4096 to 65536 bytes.

15/05/2006, v1.3 beta
 * Fixed a bug trying to enter into a zero length archive.
 * It wasn't always possible to enter into archives with SFX-header compressed by EXE-Packer.
 * Addons containing more than one section weren't imported completely.
 * IDPos wasn't always saved correctly.
 * If the same addon was imported twice the string 'Format(n)' appeared two times.
 ! Changed resources ID 1002, 1003, 1004 and 1005. Translators please update your translation.

22/03/2006, v1.2
 + Added size calculation of SFX-headers. If the Flag "SkipSfxHeader" is set, MultiArc
   will seek for the ID after the SFX-header of SFX-archives.
 + Added support for Windows XP Themes (Visual Styles).
 + Added language support in visual configuration.
 * Editing multiarc.ini was not possible if parameter "Editor" in wincmd.ini
   was set in environment variable (Editor was not started).

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Refer to Onlinehelp for detailed information about installing and configuring MultiArc.

© 2005-2007 Vladimir Serdyuk, http://wxc.sourceforge.net, vserd@users.sourceforge.net
© 2000-2003 Siarzhuk Zharski, http://www.zharik.host.sk, imker@gmx.li
