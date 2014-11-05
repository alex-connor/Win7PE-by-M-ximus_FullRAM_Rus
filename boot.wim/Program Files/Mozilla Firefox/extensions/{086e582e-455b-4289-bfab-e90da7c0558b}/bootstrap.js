const Ci = Components.interfaces;
var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);

function onDocumentCreated(aSubject, aTopic, aData)
{
	aSubject = aSubject.defaultView; if (aSubject)
	var aChannel = aSubject.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation).QueryInterface(Ci.nsIDocShell).currentDocumentChannel;
	if (aChannel instanceof Ci.nsIHttpChannel)
	{
		var navigator = aSubject.navigator;
		try { var userAgent = aChannel.getRequestHeader("User-Agent"); } catch (e) {}
		if (navigator.userAgent != userAgent) Object.defineProperty(XPCNativeWrapper.unwrap(navigator), "userAgent", {value : userAgent, enumerable : true});
	}
}

function startup(data, aReason) { observerService.addObserver(onDocumentCreated, "document-element-inserted", false); }
function shutdown(data, aReason) { observerService.removeObserver(onDocumentCreated, "document-element-inserted"); }
function install(data, aReason) {}
function uninstall(data, aReason) {}
