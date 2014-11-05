
var uaEditManager = {
	
	getString: function(sStringName)
	{
		return document.getElementById('uacontrol-strings').getString(sStringName);
	},
	
	onLoad: function()
	{
		try {
			var fldSite			= document.getElementById("fldSite");
			var fldActionGroup	= document.getElementById("fldActionGroup");
			var fldActionNormal	= document.getElementById("fldActionNormal");
			var fldActionBlock	= document.getElementById("fldActionBlock");
			var fldActionCustom	= document.getElementById("fldActionCustom");
			var fldAction		= document.getElementById("fldAction");

			var site	= window.arguments[0].site;
			var action	= window.arguments[0].action;

			if (site == '@DEFAULT') {
				fldSite.value = this.getString("SiteDefault");
				fldSite.style.fontWeight = "bold";
				fldSite.disabled = true;
			} else {
				fldSite.value = site;
			}

			switch (action.str)
			{
				case '@NORMAL':
					fldActionGroup.selectedItem = fldActionNormal;
					fldAction.value = "";
					fldAction.disabled = true;
					break;
				case '':
					fldActionGroup.selectedItem = fldActionBlock;
					fldAction.value = "";
					fldAction.disabled = true;
					break;
				default:
					fldActionGroup.selectedItem = fldActionCustom;
					fldAction.value = action.str;
					fldAction.disabled = false;
					break;
			}
			
		} catch (ex) {
			uacontrolMisc.dump("onLoad: " + ex);
		}
	},
	
	onOK: function()
	{
		try {
			var fldSite			= document.getElementById("fldSite");
			var fldActionGroup	= document.getElementById("fldActionGroup");
			var fldActionNormal	= document.getElementById("fldActionNormal");
			var fldActionBlock	= document.getElementById("fldActionBlock");
			var fldActionCustom	= document.getElementById("fldActionCustom");
			var fldAction		= document.getElementById("fldAction");

			var site;
			var action = {};
			
			if (fldSite.disabled){
				site = '@DEFAULT';
			}else {
				if (fldSite.value == "") {
					window.alert(this.getString("SiteNotFilledInAlert"));
					return false;
				}
				try {
					var svcIO = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
					site = svcIO.newURI(fldSite.value, null, null).host;
				} catch (ex) {
					site = fldSite.value;
				}
				if (site.search(/[ =]/) != -1) {
					window.alert(this.getString("SiteInvalidCharactersAlert"));
					return false;
				}
			}
			
			switch (fldActionGroup.selectedItem)
			{
				case fldActionNormal:
					action.str = '@NORMAL';
					break;
				case fldActionBlock:
					action.str = '';
					break;
				case fldActionCustom:
					action.str = fldAction.value;
					break;
				default:
					window.alert("Unable to determine selected action.");
					return false;
			}
			
			window.arguments[0].site = site;
			window.arguments[0].action = action;
			window.arguments[0].ret = true;
			return true;
		} catch (ex) {
			uacontrolMisc.dump("onOK: " + ex);
		}
		return false;
	},
	
	onActionChange: function(aEvent)
	{
		var fldAction		= document.getElementById("fldAction");
		fldAction.disabled = !(aEvent.target.id == "fldActionCustom");
	}
};

