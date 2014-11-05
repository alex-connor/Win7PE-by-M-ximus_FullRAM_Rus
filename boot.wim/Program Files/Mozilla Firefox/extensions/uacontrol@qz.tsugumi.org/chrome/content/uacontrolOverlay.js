
var uaOverlayManager = {

	getString: function(sStringName)
	{
		return document.getElementById('uacontrol-strings').getString(sStringName);
	},
	
	isOurURL: function(sURL)
	{
		var svcIO = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
		try {
			var uri = svcIO.newURI(sURL, null, null);
		} catch (ex) {
			return false;
		}
		return (uri.schemeIs('http') || uri.schemeIs('https'));
	},

	getLinkURL: function(contextMenu)
	{
		return(
			typeof(contextMenu.linkURL) == 'function' ?
				contextMenu.linkURL() : contextMenu.linkURL
		);
	},
	
	openOptions: function(sSite)
	{
		var winOptions = openDialog('chrome://uacontrol/content/uacontrolOptions.xul', 
					'UAControlOptions', 
					'centerscreen,chrome,resizable,dialog=no',
					(sSite !== undefined) ? { contextSite: sSite } : undefined);
		try {
			winOptions.focus();
		} catch (ex) { }
	},
	
	openOptionsURL: function(sURL)
	{
		var svcIO = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
		this.openOptions(svcIO.newURI(sURL, null, null).host);
	},

	toolsOptions: function()
	{
		this.openOptions();
	},
	
	contextOptions: function()
	{
		var sSite;
		try {
			sSite = window._content.document.location.hostname;
		} catch (ex) { }
		this.openOptions(sSite);
	},

	contextOptionsLink: function()
	{
		this.openOptionsURL(this.getLinkURL(gContextMenu));
	},
	
	contextOptionsImage: function()
	{
		this.openOptionsURL(gContextMenu.imageURL);
	},
	
	onLoad: function()
	{
		window.getBrowser().addProgressListener(this, 
			Components.interfaces.nsIWebProgress.NOTIFY_LOCATION |
			Components.interfaces.nsIWebProgress.NOTIFY_STATUS);
		document.getElementById("contentAreaContextMenu").addEventListener("popupshowing", this, false);

		this.prefBranch = uaPrefs.getPrefBranch();
		this.prefBranch.QueryInterface(Components.interfaces.nsIPrefBranchInternal);
		
		for (var sPref in 
				{
					enabled: 0,
					statusbar: 0,
					contextMenu: 0
				}
			)
		{
			this.prefBranch.addObserver(sPref, this, true);
			this.observe(this.prefBranch, 'nsPref:changed', sPref);
		}
	},

	onPopupShowing: function(e)
	{
		var bShow = this.bShowContextMenu && 
					!gContextMenu.isTextSelected && !gContextMenu.onLink && !gContextMenu.onImage && !gContextMenu.onTextInput &&
					this.isOurURL(gContextMenu.target.ownerDocument.location.href);		// gContextMenu.docURL
		var bShowLink = this.bShowContextMenu && 
					gContextMenu.onLink && 
					this.isOurURL(this.getLinkURL(gContextMenu));
		var bShowImage = this.bShowContextMenu && 
					gContextMenu.onImage &&
					this.isOurURL(gContextMenu.imageURL);
		gContextMenu.showItem('uacontrol_sep', bShow || bShowLink || bShowImage);
		gContextMenu.showItem('uacontrol_options', bShow);
		gContextMenu.showItem('uacontrol_options_link', bShowLink);
		gContextMenu.showItem('uacontrol_options_image', bShowImage);
	},

	// Implement nsIEventListener
	handleEvent: function(evt)
	{
		try {
			switch (evt.type)
			{
				case 'load':
					// workaround https://bugzilla.mozilla.org/show_bug.cgi?id=174320
					setTimeout(function(myThis) {
						window.removeEventListener("load", myThis, false);
					}, 0, this);
//					window.removeEvenetListener("load", this, false);
					return this.onLoad(evt);
				case 'popupshowing':
					return this.onPopupShowing(evt);
				default:
					uacontrolMisc.dump("handleEvent: unknown event: " + evt.type);
			}
		} catch (ex) {
			uacontrolMisc.dump("handleEvent: " + ex);
		}
		return undefined;
	},
	
	onChangeEnabled: function(oPrefBranch)
	{
		try {
			this.bEnabled = oPrefBranch.getBoolPref('enabled');
			this.updateStatusbar();
		} catch (ex) {
			uacontrolMisc.dump("onChangeEnabled: " + ex);
		}
	},
	
	onChangeStatusbar: function(oPrefBranch)
	{
		try {
			this.showStatusbar = oPrefBranch.getBoolPref("statusbar");
			this.updateStatusbar();
		} catch (ex) {
			uacontrolMisc.dump("onChangeStatusbar: " + ex);
		}
	},
	
	onChangeContextMenu: function(oPrefBranch)
	{
		try {
			this.bShowContextMenu = oPrefBranch.getBoolPref('contextMenu');
		} catch (ex) {
			uacontrolMisc.dump("onChangeContextMenu: " + ex);
		}
	},
	
	// Implement nsIObserver
	observe: function(aSubject, aTopic, aData)
	{
		try {
			switch (aTopic)
			{
				case 'nsPref:changed':
					aSubject.QueryInterface(Components.interfaces.nsIPrefBranch);
					switch (aData)
					{
						case 'enabled':
							this.onChangeEnabled(aSubject);
							break;
						case 'statusbar':
							this.onChangeStatusbar(aSubject);
							break;
						case 'contextMenu':
							this.onChangeContextMenu(aSubject);
							break;
						default:
							uacontrolMisc.dump("observe: unknown pref changing: " + aData);
							break;
					}
					break;

				default:
					uacontrolMisc.dump("observe: unknown topic: " + aTopic);
					break;
			}
		} catch (ex) {
			uacontrolMisc.dump("observe: " + ex);
		}
	},

	updateStatusbar: function()
	{
		try {
			var sb = document.getElementById("uacontrol-status");
			if (!this.showStatusbar) {
				sb.setAttribute("collapsed", true);
				return;
			}

			var sbIcon = document.getElementById("uacontrol-status-icon");
			sbIcon.src = this.bEnabled ? 
				"chrome://uacontrol/skin/icon_enabled.png" :
				"chrome://uacontrol/skin/icon_disabled.png";
			sb.removeAttribute("collapsed");
		} catch (ex) {
			uacontrolMisc.dump("updateStatusbar: " + ex);
		}
	},
	
	updateOnNextStatusChange: false,
	
	// Implement nsIWebProgressListener
	onLocationChange: function(aWebProgress, aRequest, aLocation)
	{
		this.updateStatusbar();
		this.updateOnNextStatusChange = true;
	},
	onProgressChange: function(webProgress, request, curSelfProgress, maxSelfProgress, curTotalProgress, maxTotalProgress) {},
	onSecurityChange: function(webProgress, request, state) {},
	onStateChange: function(webProgress, request, stateFlags, status) {},
	onStatusChange: function(webProgress, request, status, message)
	{
		if (this.updateOnNextStatusChange)
		{
			this.updateStatusbar();
			this.updateOnNextStatusChange = false;
		}
	},
	// end Implement nsIWebProgressListener

	// see http://forums.mozillazine.org/viewtopic.php?t=49716
	onLinkIconAvailable: function(a) {},

	// Implement nsISupports
	QueryInterface: function(aIID)
	{
		if (aIID.equals(Components.interfaces.nsIObserver) ||
			aIID.equals(Components.interfaces.nsIWebProgressListener) ||
//			aIID.equals(Components.interfaces.nsIEventListener) ||
			aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
			aIID.equals(Components.interfaces.nsISupports))
		{
			return this;
		}
		throw Components.results.NS_ERROR_NO_INTERFACE;
	}
};

window.addEventListener("load", uaOverlayManager, false);

