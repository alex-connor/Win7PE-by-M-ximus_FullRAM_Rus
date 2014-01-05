
function uacontrolMisc(){}

uacontrolMisc.dump = function(aMessage){
	var consoleService = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
	consoleService.logStringMessage("UAControl: " + aMessage);
};

