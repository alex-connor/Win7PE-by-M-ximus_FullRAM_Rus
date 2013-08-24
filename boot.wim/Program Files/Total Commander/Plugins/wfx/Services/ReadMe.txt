This software are provided "as-is". No warranty provided.

You use this program at your own risk. The author will not response for data lost, damages, etc.
due the use or misusing this software.


This plugin is freeware.


Services - plugin for Total Commander 5.5 and newer.

General features:
  - List of services registered in the system.
  - Enchanced control state of service function.
  - Deleting of services from the system.
  - Editing of the serivces properties.

Additional:
  -	Since version 2.4 the new feature is added. This feature allows running Windows NT™ applications as services. 
	The benefits include:
		- allow apps to survive logoff/logon sequences, hence saving the overhead of 
		  re-starting them for each new user
		- allow server apps to come-up and service requests even when no user is logged-on
		- allow apps to run and perform a task in a specific logon account, different 
		  from the currently logged-on user 
	Note: app2srv.exe file must be located in the same folder as the plugin file (Services.wfx)
	
Keys:
     Del    - delete the remote machine from the list.
     F7     - create the new remote connection.
     F5     - start the service (can be changed in settings).
     F6     - stop the service.
     F8     - restart the service.
     
Works only under NT/W2K/XP.


Versions history:
---------------------
v 2.4	- 08.03.2004
  -	Minor bugs fixed.
  -	Fixed Windows NT™ incompatibility.
	
v 2.4b2	- 23.01.2004
  -	Minor bugs fixed (thanks to Konstantin Sokolovskiy for beta-testing).
  -	Added new possibility to run any application as service. 
  -	Added "Restart" button.
  -	Added redefineable hotkeys for start, stop and restart the services.
  -	Added possibility to customize how service name is displayed in the TC files panel.
			
v 2.4b1	- Internal
  - Added saving list of remote computers in configuration file
  - Added the settings page
  - Added editing main properties (display name, path, description) of the service.
  - Fixed incorrect displaying 32-bit icons under NT/W2K
  - Fixed incorrect file path detection of some services (except the Firebird server services which point politically incorrect data :))
		
v 2.3	- 27.11.2003
  - Known bugs fixed
  - The list of the remote machines now is displayed in the TC panel
  - Added displaying of process of changing services state.
  
v 2.2.1 - 21.11.2003
  - Known bugs fixed
  - Added viewing of main services properties via TC Lister.
  
v 2.2   - 20.11.2003
  - Changed service properties GUI (max approximate with system service manager)
  - Added more powerful services properties such as logon account and dependencies.
    
v 2.1   - 11.11.2003
  - Fixed bug with TC version detection.
  - Services management code was fully refactored.
    
v 2.0   - 10.09.2003
  - Added remote services database access.

v 1.2   - 10.03.2003
  - Some bugs fixed.
  - Added displaying size and date/time information.
  - Support of icons displaying method introduced in TC 5.51.

v 1.1   - 15.11.2002
  - Fixed NT 4.0 incompatibility.
  - Added deleting of services.

v 1.0   - 10.11.2002
  - Initial version
    
Author:
  Serge Kandakov aka KaSA
  web:	 www.rammus.ru
  email: KaSA2000@yandex.ru
