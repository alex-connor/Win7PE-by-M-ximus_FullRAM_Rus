
const
	CI = Components.interfaces,
	CC = Components.classes,
	CR = Components.results;

const
	MY_CLASS_ID = Components.ID("{0F572A2F-AF08-41CC-AFDF-DE4EC88EE596}"),
	MY_CONTRACT_ID = "@qz.tsugumi.org/uacontrol;1",
	MY_OBSERVER_NAME = "UAControl Observer";


function uaModule() { }

uaModule.prototype = {
	classID:		MY_CLASS_ID,
	contractID:	MY_CONTRACT_ID,
	classDescription: "User-Agent Control",

	bEnabled: true,
	aUAActions: {},

	dump : function(aMessage){
		var consoleService =
			CC["@mozilla.org/consoleservice;1"].getService(CI.nsIConsoleService);
		consoleService.logStringMessage("UAControl: " + aMessage);
	},

	// Implement nsISupports
	QueryInterface: function(iid)
	{
		if (
			!iid.equals(CI.nsISupports) &&
			!iid.equals(CI.nsIObserver) &&
			!iid.equals(CI.nsISupportsWeakReference)
		)
			throw CR.NS_ERROR_NO_INTERFACE;
		
		return this;
  },
	
	adjustUA: function(oChannel, sSite)
	{
		try {
			var sUA;
			var uaAction = this.aUAActions[sSite];
			if (uaAction == undefined){
				return false;
			}

			if (uaAction.str.charAt(0) == '@') {
				// special actions
				if(uaAction.str == '@NORMAL'){
					// act as if we weren't here
					return true;
				}else{
					this.dump("adjustUA: unknown UAAction: " + uaAction.str);
					return false;
				}
			} else {
				sUA = uaAction.str;
			}

			oChannel.setRequestHeader("User-Agent", sUA, false);

			return true;
		} catch (ex) {
			this.dump("adjustUA: " + ex);
		}
		return false;
	},

	onModifyRequest: function(oHttpChannel)
	{
		try {
			if (!this.bEnabled)
				return;
			
			oHttpChannel.QueryInterface(CI.nsIChannel);

			// handle wildcarding
			// try matching "www.foo.example.com", "foo.example.com", "example.com", ...
			for (var s = oHttpChannel.URI.host; s != ""; s = s.replace(/^.*?(\.|$)/, ""))
			{
				if (this.adjustUA(oHttpChannel, s))
					return;
			}
			// didn't find any matches, fall back on configured default action
			this.adjustUA(oHttpChannel, '@DEFAULT');
		} catch (ex) {
			this.dump("onModifyRequest: " + ex);
		}
	},

	getActionsFromBranch: function(oPrefBranch)
	{
		function myDecodeURI(sEncodedURI)
		{
			if (sEncodedURI.charAt(0) == '@')
				return sEncodedURI;
			try {
				return decodeURI(sEncodedURI);
			} catch (ex) {
				return sEncodedURI;
			}
		}

		var sActions = oPrefBranch.getCharPref('actions');
		
		var aUAActions = {};
		aUAActions['@DEFAULT'] = { str: '@NORMAL' };	// in case it is not in the pref
		
		var aActions = sActions.split(' ');
		for (var i in aActions) {
			var aKV = aActions[i].match(/(.*?)=(.*)/);
			if (aKV != null)
				aUAActions[aKV[1]] = { str: myDecodeURI(aKV[2]) };
		}
		
		return aUAActions;
	},

	onChangeEnabled: function(oPrefBranch)
	{
		try {
			this.bEnabled = oPrefBranch.getBoolPref('enabled');
		} catch (ex) {
			this.dump("onChangeEnabled: " + ex);
		}
	},
	
	onChangeActions: function(oPrefBranch)
	{
		try {
			this.aUAActions = this.getActionsFromBranch(oPrefBranch);
		} catch (ex) {
			this.dump("onChangeActions: " + ex);
		}
	},


	// Implement nsIObserver
	observe: function(aSubject, aTopic, aData)
	{
//		this.dump("observe: " + aTopic);
		try {
			switch (aTopic)
			{
				case 'http-on-modify-request':
					var httpChannel = aSubject.QueryInterface(CI.nsIHttpChannel);
					this.onModifyRequest(httpChannel);
				break;
				
				case 'nsPref:changed':
					var pref = aSubject.QueryInterface(CI.nsIPrefBranch);
					switch (aData)
					{
						case 'enabled':
							this.onChangeEnabled(pref);
							break;
						case 'actions':
							this.onChangeActions(pref);
							break;
						default:
							this.dump("observe: unknown pref changing: " + aData);
							break;
					}
				break;

				case "profile-after-change":
					var obs =
						CC["@mozilla.org/observer-service;1"].getService(CI.nsIObserverService);
					obs.addObserver(this, "http-on-modify-request", false);
			
					var prefService =
						CC["@mozilla.org/preferences-service;1"].getService(CI.nsIPrefService);
					this.prefBranch = prefService.getBranch("uacontrol.");
					this.prefBranch.QueryInterface(CI.nsIPrefBranchInternal);
					this.prefBranch.addObserver("enabled", this, false);
					this.prefBranch.addObserver("actions", this, false);
					try {
						this.aUAActions = this.getActionsFromBranch(this.prefBranch);
					} catch (ex) {
						this.dump("init: " + ex);
					}
				break;
					
				default:
					this.dump("observe: unknown topic: " + aTopic);
				break;
			}
		} catch (ex) {
			this.dump("observe: " + ex);
		}
	}
};




var objects = [uaModule];

function FactoryHolder(aObj) {
	this.CID        = aObj.prototype.classID;
	this.contractID = aObj.prototype.contractID;
	this.className  = aObj.prototype.classDescription;
	this.factory = {
		createInstance: function(aOuter, aIID) {
			if(aOuter)
				throw CR.NS_ERROR_NO_AGGREGATION;
			return (new this.constructor).QueryInterface(aIID);
		}
	};
	this.factory.constructor = aObj;
}

var gModule = {
	registerSelf: function (aCompMgr, aFileSpec, aLocation, aType) {
		aCompMgr.QueryInterface(CI.nsIComponentRegistrar);
		for (var key in this._objects) {
			var obj = this._objects[key];
			aCompMgr.registerFactoryLocation(obj.CID, obj.className,
				obj.contractID, aFileSpec, aLocation, aType);
		}

		var catman = CC["@mozilla.org/categorymanager;1"].getService(CI.nsICategoryManager);
		catman.addCategoryEntry("profile-after-change", MY_OBSERVER_NAME,
			MY_CONTRACT_ID, true, true);
	},

	unregisterSelf: function(aCompMgr, aFileSpec, aLocation) {
		var catman = CC["@mozilla.org/categorymanager;1"].getService(CI.nsICategoryManager);
		catman.deleteCategoryEntry("profile-after-change", MY_OBSERVER_NAME, true);
		
		aCompMgr.QueryInterface(CI.nsIComponentRegistrar);
		for (var key in this._objects) {
			var obj = this._objects[key];
			aCompMgr.unregisterFactoryLocation(obj.CID, aFileSpec);
		}
	},

	getClassObject: function(aCompMgr, aCID, aIID) {
		if (!aIID.equals(CI.nsIFactory)) throw CR.NS_ERROR_NOT_IMPLEMENTED;
		
		for (var key in this._objects) {
			if (aCID.equals(this._objects[key].CID))
			return this._objects[key].factory;
		}

		throw CR.NS_ERROR_NO_INTERFACE;
	},

	canUnload: function(aCompMgr) {
		return true;
	},

	_objects: {} //FactoryHolder
};

function NSGetModule(compMgr, fileSpec)
{
	for(var i in objects)
		gModule._objects[i] = new FactoryHolder(objects[i]);
	return gModule;
}

Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

if (XPCOMUtils.generateNSGetFactory)
	var NSGetFactory = XPCOMUtils.generateNSGetFactory(objects);

// EOF
