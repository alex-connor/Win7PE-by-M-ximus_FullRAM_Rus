Things you have to know about this portable version:

- The configuration is fully portable.
The settings files are "exported" from the portable version directory to the system, and "imported" to the portable version folder when the app is closed MANUALLY by user. So this program doesn't let any tracks on your system. In this archive you will also find an easy guide to import your existing OD settings.

- The "Load ObjectDock at startup" option works.
If the "Load ObjectDock at startup" feature is ticked in the ObjectDock Properties menu, it creates a shortcut with the current application path as target to load at next bootup. But the shortcut's target is the ObjectDock.exe located in the "\Portable.ObjectDock.v1.9.x\App folder", not the portable launcher. So my script will just correct it when you will close the app.
This option is deactivated by default. But just right-click on the bar background and choose Dock Settings, activate Load ObjectDock at startup, manually close the program then restart your PC to see the result. Enjoy!

- Condition to keep configuration changes beetween your uses.
It's not a problem to close your Windows session or shutdown your PC directly without quitting manually if the application is already configured according to your preferences. But always remember that you have to close the app manually for the changes in configuration to be saved (as the configuration backup starts when the application is closing). Stopping the program manually means a right-click to the bar background or the systray icon and choose Quit.