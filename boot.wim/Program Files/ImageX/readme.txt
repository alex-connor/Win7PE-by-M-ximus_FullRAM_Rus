ImageX GUI v2 - BETA
====================
Written by Jonathan Bennett
jonben@microsoft.com

See the End User License Agreement file (eula.rtf) for license details and disclaimers.

This tool is not supported by Microsoft Product Support Services. 

For suggestions and bug reports please email the address above.


Introduction
============
A graphical version of the imagex tool included with the Windows Automated
Installation kit (WAIK).

This version was programmed for use with the WAIK 1.0 (Windows Vista RTM).

Other features to be added as soon as my fingers allow - send suggestions :)


Installation
============
Requires the wimgapi.dll to be present. For simple installation just copy
gimagex.exe into the same folder as imagex.exe in the WAIK.

For the mount/unmount operations to work the wimfltr.sys driver (also from
the WAIK/imagex folder) must be installed.


History
=======
2nd Dec 2007 - v2.0.4 BETA
	- Improved mount/unmount interface.
	
2nd Dec 2007 - v2.0.3 BETA
	- Improved image selection interface.

1st Dec 2007 - v2.0.2 BETA
	- Added Delete tab.
	- Added Export tab.
	- Some internal improvements to XML handling.

20th Nov 2007 - v2.0.1 BETA
	- EULA obtained for distribution

16th Oct 2007 - v2.0.0 BETA
	- Added Change tab
	- Added Mount tab
	- Fixed bug with Capture+verify (wasn't verifying).
	- Check option added to Apply.
	- Automatic temp folder chosen during capture now consistent with imagex.exe

15th Oct 2007 - v2 ALPHA
	- Added /check options.
	- Supports a wimscript.ini config file for exclusions.
	- Allows manual setting of the temporary directory for capture.

12th Oct 2007 - v2 ALPHA
	- Initial native C++ Version using the WIM API directly.


2006 - GImageX v1 (AutoIt wrapper)
