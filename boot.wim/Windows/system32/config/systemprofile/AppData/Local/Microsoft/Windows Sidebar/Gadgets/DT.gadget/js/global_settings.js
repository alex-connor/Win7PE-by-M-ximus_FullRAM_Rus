var globalSettings = function() {
	this.gadgetType = 'pro';
	this.currentSkin = 'skin1';
	this.currentSkinNumber = 0;
	this.settingsExist = false;
	this.contentWiew = -1;
	this.drivesJSON = -1;
	this.drives = -1;
	this.drivesNum = -1;
	this.actionList = -1;
	this.pageName = -1;
	this.currentSkinSpecial = -1;
	this.currentSkinNumberSpecial = -1;
	this.contentWiewSpecial = -1;
	this.messageTitle = 'Message';
	this.messageText = '';
	this.BtOk = "Ok";
	this.BtCancel = "Cancel";
	this.messageType = 'info';
	this.messageButtonCancel = 'false';
	this.settingsTabs = false;
  this.skins = new Array();
}
globalSettings.prototype.saveSettings = function() {
	System.Gadget.Settings.write("SettingsExist", true);
	System.Gadget.Settings.writeString("gadgetType",this.gadgetType);
	this.saveSkin();
	this.saveActionList();
	this.saveDrivesByOneJSON();
	if(this.pageName=='gadget')
		this.saveSkinJSON();
}
globalSettings.prototype.loadSettings = function() {

	this.gadgetType = System.Gadget.Settings.readString("gadgetType");
	
	if(System.Gadget.Settings.read("SettingsExist"))
		this.settingsExist = System.Gadget.Settings.read("SettingsExist");
	if(this.settingsExist==true) {
		gSettings.loadSkin();
	}
	if(gSettings.pageName!='rss' && gSettings.pageName!='message') {
	this.loadContentWiew();
		this.loadDrivesByOneJSON();
		this.loadActionList();
	}

	if(this.pageName == 'message') {
		this.messageTitle = System.Gadget.Settings.readString("messageTitle");
		this.messageText = System.Gadget.Settings.readString("messageText");
		this.messageType = System.Gadget.Settings.readString("messageType");
		this.BtOk        = System.Gadget.Settings.readString("BtOk");
		this.BtCancel    = System.Gadget.Settings.readString("BtCancel");
		if(System.Gadget.Settings.readString("messageType"))
			this.messageButtonCancel = System.Gadget.Settings.readString("messageType");
	}
	if(this.pageName == 'settings') {
		if(System.Gadget.Settings.readString("settingsTabs")) {
			this.settingsTabs = JSON.decode(System.Gadget.Settings.readString("settingsTabs"));
    }
  }

  return;
        
}
globalSettings.prototype.saveActionList = function() {
	if(this.pageName == 'settings') {
		dSlots.getActions();
		System.Gadget.Settings.writeString("actionList", JSON.encode(this.actionList));
	}
}
globalSettings.prototype.loadActionList = function() {
	if(this.pageName == 'gadget' && System.Gadget.Settings.readString("actionList")) {
		this.actionList = JSON.decode(System.Gadget.Settings.readString("actionList"));
		
	}
}
globalSettings.prototype.saveDrivesByOneJSON = function() {
	this.drivesNum = this.drives.length;
	System.Gadget.Settings.write("drivesNum",this.drivesNum);
	for(var i = 0; i < this.drivesNum; i++) {
		this.drives[i]['o'] = '';
		System.Gadget.Settings.writeString("drive"+i, JSON.encode(this.drives[i]));
	}
}
globalSettings.prototype.loadDrivesByOneJSON = function() {
	this.drivesNum = parseInt(System.Gadget.Settings.read("drivesNum"));
	this.drives = Array();
	for(var i = 0; i < this.drivesNum; i++) {
		/*
		var tmp = JSON.decode(System.Gadget.Settings.readString("drive"+i));;
		this.drives[i] = {'dI':tmp['dI'], 'dN':tmp['dN'], 'dL':tmp['dL'] , 'dP':tmp['dP'], 'dIc':tmp['dIc'], 'dS':tmp['dS'], 'iS':tmp['iS'], 'o':''};
		*/
		this.drives[i] = JSON.decode(System.Gadget.Settings.readString("drive"+i));
	}
}
globalSettings.prototype.saveSkinJSON = function() 
{
	var settings;
		System.Gadget.Settings.writeString("currentSkin",this.currentSkin);
		System.Gadget.Settings.write("currentSkinNumber",this.currentSkinNumber);
	settings = {'currentSkin':this.currentSkin, 'currentSkinNumber' : this.currentSkinNumber, 'contentWiew':this.contentWiew};
	var s = JSON.encode(settings);
	if(Gadget.ComGadget != null && Gadget.ComGadget) Gadget.ComGadget.SaveToReg(s);
}
globalSettings.prototype.loadSkinJSON = function(IsAsus) 
{
  var Loaded = false;
	if(Gadget.ComGadget != null && Gadget.ComGadget)
  {
    if(Gadget.ComGadget.LoadFromReg().length > 0) {
		var settings = JSON.decode(Gadget.ComGadget.LoadFromReg());
    if(settings != undefined) {
      Loaded = true;
  		this.currentSkin = settings['currentSkin'];
  		this.currentSkinNumber = settings['currentSkinNumber'];
  		this.contentWiew = settings['contentWiew'];
      var found = false;
    	for(var i = 0; i<this.skins.length; i++){
        if(this.skins[i].skinName == this.currentSkin)
        {
          found = true;
          break;
        }
      }
      if(!found) {
	      this.currentSkin = 'skin1';
     	  this.currentSkinNumber = 0;
    	  this.contentWiew = 1;
      }
    }
	} 
  }
  if(Loaded!=true){
	  if(IsAsus) {
	    this.currentSkin = 'skin1';
     	this.currentSkinNumber = 0;
    	this.contentWiew = 1;
    	for(var i = 0; i<this.skins.length; i++){
        if(this.skins[i].skinName == 'Asus')
        {
	        this.currentSkin = 'Asus';
     	    this.currentSkinNumber = i;
    	    this.contentWiew = 1;
          break;
        }
      }
    } else if(this.gadgetType == 'lite') {
	  this.currentSkin = 'skin1';
  	this.currentSkinNumber = 0;
  	this.contentWiew = 1;
	} else if(this.gadgetType == 'pro'||this.gadgetType == 'net') {
		this.currentSkin = 'skin1';
  		this.currentSkinNumber = 0;
  		this.contentWiew = 1;
	}
  }
}
globalSettings.prototype.saveSkin = function() {
	if(this.currentSkin!=false) {
		System.Gadget.Settings.writeString("currentSkin",this.currentSkin);
		System.Gadget.Settings.write("currentSkinNumber",this.currentSkinNumber);
   	var s = JSON.encode(this.skins);
		System.Gadget.Settings.write("skins",s);
	}
}
globalSettings.prototype.loadSkin = function() {
	this.currentSkin = System.Gadget.Settings.readString("currentSkin");
	this.currentSkinNumber = parseInt(System.Gadget.Settings.read("currentSkinNumber"));
	var s = System.Gadget.Settings.read("skins");
  if(s.length != 0) {
     try
    {
    var s = JSON.decode(s);
    this.skins = s;
  }
    catch (e)
    {
    }
  }
}
globalSettings.prototype.loadContentWiew = function() {
	if(System.Gadget.Settings.read("contentWiew"))
		this.contentWiew = parseInt(System.Gadget.Settings.read("contentWiew"));
}
gSettings = new globalSettings();
