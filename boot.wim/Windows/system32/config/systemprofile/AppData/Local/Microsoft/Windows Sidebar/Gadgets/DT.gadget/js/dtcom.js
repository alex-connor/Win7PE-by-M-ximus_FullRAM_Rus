/* System.Debug.outputString(1); */
function initError(FlyoutTitle, FlyoutText, GadgetText )
{
	System.Gadget.settingsUI = "";
	Gadget.dtLoaderStop();
	var dtG = document.getElementById('mainDTGadjet');
	addClass(dtG, 'initError');
	dtG.style.height = "100%";
	Gadget.setMessageTitle(FlyoutTitle);
	Gadget.setMessageText(Gadget.parseToHTML(FlyoutText));
	Gadget.createErrorMessage();
	Gadget.setErrorMessageText(Gadget.parseToHTML(GadgetText));
	Gadget.showErrorMessage();
}
function out(text)
{
  document.body.innerText = text ;
}
dTGadget.prototype.onShowSettings = function()
{
  var JSONDrivesText = Gadget.ComGadget.JSONDrives();
  if( JSONDrivesText != "")
  {
    var driveSlots = Array();
			
	  JSONDrivesText = eval( "(" + JSONDrivesText + ")" );
		for(var i = 0; i<JSONDrivesText.length; i++) {
		  driveSlots[i] = {'dI':JSONDrivesText[i]['ID'], 'dIc' : JSONDrivesText[i]['Image'], 'dN':JSONDrivesText[i]['cdName'],
                       'dL':JSONDrivesText[i]['cdTitle'] , 'dP':JSONDrivesText[i]['cdPath'], 'dS':JSONDrivesText[i]['cdNotMounted'],
                       'iS':JSONDrivesText[i]['iS'], 'o':''};
    }
		gSettings.drives = driveSlots;
		driveSlots = JSON.encode(driveSlots);
		gSettings.drivesJSON = driveSlots;
    gSettings.saveSettings();
  }
}
dTGadget.prototype.settingsClosed = function(event)
{
	if (event.closeAction == event.Action.commit)
	{
		gSettings.loadSettings();
		gSettings.saveSkinJSON();
		refreshGadgetSkin();
    var OptonsData="";
    for(var i = 0; i < gSettings.actionList.length; i++) {
      if(i) OptonsData += ";";
      OptonsData += gSettings.actionList[i];
    }
    Gadget.ComGadget.OptionsClosed(OptonsData);
	}
}
dTGadget.prototype.SetTip = function(name, tip)
{
  var elem = d(name);
  if(typeof elem != 'undefined' && elem !=null )
  {
    elem.title = tip;
  }
}
dTGadget.prototype.LoadInit = function()
{
    if(Gadget.NumberInit == 1000) return;
    if(Gadget.NumberInit>120) {
      initError(Gadget.Tips.IDS_GADGET_FULL_TITLE, Gadget.Tips.IDS_GADGET_FULL_TEXT, Gadget.Tips.IDS_GADGET_WIN_TEXT);
      return;
    }
    try
    {
        Gadget.Tips =  new Object;
        Gadget.Tips.IDS_GADGET_FULL_TITLE = "Gadget initialization error";
        Gadget.Tips.STRING_REBOOT_PLEASE = "Please reboot your computer.";
        Gadget.Tips.IDS_GADGET_FULL_TEXT= "<BR>Unable to initialize DAEMON Tools library.<BR>Please install or reinstall DAEMON Tools software.<BR><BR>[URL=\"http://www.daemon-tools.cc/downloads\"]Download DAEMON Tools[/URL]";
        Gadget.Tips.IDS_GADGET_WIN_TEXT= "Gadget initialization error<BR>[URL]More info[/URL]";
        Gadget.ComGadget = new ActiveXObject("DTGadget.GadgetControl");
        var RetInit = Gadget.ComGadget.Init(Gadget);
        Gadget.ComRSS = new ActiveXObject("DTGadget.RSS");
        if( RetInit == "Close")   {
          setTimeout("System.Gadget.close();", 50);
        } else if(RetInit == "NeedRebootFlag")
        {
          Gadget.showLoaderText();
          Gadget.setLoaderText( Gadget.Tips.STRING_REBOOT_PLEASE);
          return;
        } else if( RetInit != "")
        {
          Gadget.Tips = eval( "(" + Gadget.ComGadget.GetTips()+ ")" );
          var RetObject = eval( "(" + RetInit + ")" );
          Gadget.DaemonDir = Gadget.ComGadget.GetDaemonDir();
          Gadget.IntervalID = setInterval ( "Gadget.Refresh();", 1000 );
          Gadget.UseTips();
				  gSettings.gadgetType = Gadget.ComGadget.GetProgType();
	        System.Gadget.Settings.write("gadgetType", gSettings.gadgetType);
          if(gSettings.gadgetType == 'pro' || gSettings.gadgetType == 'net') {
            for(var i = 0; i < gSettings.skins.length; i++)
            {
               gSettings.skins[i]["skinScreen"] = gSettings.skins[i]["skinScreen"].replace(new RegExp("previews.jpg",'g'), "previews_pro.jpg");
            }
          }
          gSettings.saveSkin();
/*
          if(!RetObject.AsusSkin) {
    	      for(var i = 0; i<gSettings.skins.length; i++){
              if(gSettings.skins[i].skinName == 'Asus')
              {
                gSettings.skins.splice(i,1);
              }
            }
          }
*/
          gSettings.saveSkin();
				
				  if(gSettings.settingsExist == false) {
				  	gSettings.loadSkinJSON(RetObject.AsusSkin);
				  	gSettings.settingsExist = true;
			  	}
				removeClass(document.body, 'notInit')
        } else {
          Gadget.NumberInit++;
          return;
        }
    }
    catch (e)
    {
          System.Debug.outputString(e.description);
          Gadget.NumberInit++;
          return;
    }
    Gadget.InitSkins();
Gadget.NumberInit = 1000;
}
dTGadget.prototype.InitSkins = function()
{
    if(gSettings.gadgetType == 'lite') {
					removeElement('dt_pro_li');
					removeElement('dt_pro_disable');
					removeElement('img_editor_li');
					removeElement('img_editor_disable');
					d('lite_help').style.display = 'block';
					d('pro_help').style.display = 'none';
				} else if(gSettings.gadgetType == 'pro'){
					addClass(document.body, 'dtProGadget');
					document.getElementById('dt_pro_li').style.display = 'block';
					document.getElementById('img_editor_li').style.display = 'block';
					removeElement('mount_n_drive_li');
					removeElement('mount_n_drive_disable');
					removeElement('make_img_li');
					removeElement('make_img_disable');
					d('dt_home').setAttribute('src', 'img/dt_icon_pro.png');
					d('lite_help').style.display = 'none';
					d('pro_help').style.display = 'block';
				} else if(gSettings.gadgetType == 'net'){
					addClass(document.body, 'dtProGadget');
					document.getElementById('dt_net_li').style.display = 'block';
					document.getElementById('img_editor_li').style.display = 'block';
					removeElement('dt_pro_li');
					removeElement('mount_n_drive_li');
					removeElement('mount_n_drive_disable');
					removeElement('make_img_li');
					removeElement('make_img_disable');
					d('dt_home').setAttribute('src', 'img/dt_icon_pro.png');
					d('lite_help').style.display = 'none';
					d('pro_help').style.display = 'block';
				}
    refreshGadgetSkin();
    }
dTGadget.prototype.OnLoad = function()
{
try{
  var fso = new ActiveXObject("Scripting.FileSystemObject");
  var folder = fso.GetFolder(System.Gadget.path + "/skins");
  var subFlds = new Enumerator(folder.SubFolders);
          gSettings.skins = new Array();
  for (; !subFlds.atEnd(); subFlds.moveNext()) {
/*
    if(gSettings.gadgetType == 'pro' || gSettings.gadgetType == 'net') {
      PreviewName = "/previews_pro.jpg";
    }
    */
    gSettings.skins[gSettings.skins.length] = {'skinName':subFlds.item().Name,  'skinScreen':"skins/" + subFlds.item().Name + "/previews.jpg" , 'selected':false};
  }
  gSettings.skins.sort(function(a, b){
  var nameA=a.skinName.toLowerCase(), nameB=b.skinName.toLowerCase()
  if (nameA < nameB)
   return -1
  if (nameA > nameB)
   return 1
  return 0
 });
  if(gSettings.skins.length > 0)  gSettings.skins[0]["selected"] = true;
          gSettings.saveSkin();
      Gadget.LoadInitID = setInterval ( "Gadget.LoadInit();", 1000 );
}
 catch (e)
    {
          System.Debug.outputString(e);
          return;
    }
}
dTGadget.prototype.Refresh = function()
{
    var devices;
	
    if(Gadget.RSSCounter % 10 == 0) {
      if(Gadget.ComRSS.GetInfoGadget()) {
        Gadget.enableNewRss();
      } else {
        Gadget.disableNewRss();
      }
    }
    Gadget.RSSCounter++;
    var txt = Gadget.ComGadget.GetInfo(Gadget);
	
    if(txt == "ChangeLanguage")
    {
      Gadget.ChangeLanguage();
      return;
    }
    if(txt == "NotInit")
    {
        clearInterval(Gadget.IntervalID);
        return;
    }
    if(txt == "NeedRebootFlag")
    {
      Gadget.showLoaderText();
      Gadget.setLoaderText( Gadget.Tips.STRING_REBOOT_PLEASE);
      return;
    }
    if(txt == "Remove")
    {
        System.Gadget.close();
        var oShell = new ActiveXObject("WScript.Shell");
        oShell.AppActivate("DAEMON Tools");
        oShell.SendKeys("+{F10}C");
        return;
    }
    if(txt.length)
    {
          	Gadget.SaveCurrentNumber();
        Gadget.dtLoaderStop();
		Gadget.hideLoaderText();
        var Num = Gadget.getVirtualDriveCount();
        if(Num > 0)
        {
            for(var i = 0; i < Num; i++)
            {
                Gadget.removeVirtualDrive(0);
            }
        }
        devices = eval( "(" + txt + ")" );
        if(devices.length > 0 )
        {
            var NeedRestoreCurrentNumber = true;
            for(var i=0; i<devices.length; i++)
            {
              if(devices[i].iS != -1) {
                var disable = devices[i].cdNotMounted == "1" ? true : false;
                var FirstWord = "";
                if(devices[i].cdName != ":") {
                  FirstWord = "(" + devices[i].cdName + ")";
                }
                devices[i].Image = devices[i].Image.replace(new RegExp("CURR_SKIN",'g'), "skins/" + gSettings.currentSkin);
                Gadget.addVirtualDrive(FirstWord, devices[i].cdTitle, "", devices[i].Image, devices[i].cdTip, disable);
              }
            }
            if(NeedRestoreCurrentNumber) {
          	  Gadget.RestoreCurrentNumber();
            }
        } else
        {
            var cont = document.getElementById('content1');
			removeClass(cont,'loadingDrives');
			addClass(cont,'noVirtualDrives');
        }
        System.Gadget.Flyout.show = false;
		if(gSettings.contentWiew!=-1) {
			Gadget.chengeViewTypeOn(gSettings.contentWiew);
		}
		if (navigator.userAgent.indexOf("windows NT 6.0") -1) {
			var timeout = setTimeout(function(){return function(){Gadget.chengeViewType(); Gadget.chengeViewType();clearTimeout(timeout);}}(timeout), 50);
		}
		
		
    }
}
dTGadget.prototype.getVirtualDriveCount = function ()
{
  return this.drives.length
}
dTGadget.prototype.ClickAddDriver = function()
{
  Gadget.loaderStart();
  Gadget.ComGadget.AddDriver();
}
dTGadget.prototype.ClickMountNDrive = function()
{
    Gadget.ComGadget.MountNDrive();
}
dTGadget.prototype.ClickMountOneDrive = function(num)
{
  Gadget.loaderStart();
    Gadget.ComGadget.MountOneDrive(num);
}
dTGadget.prototype.ClickOnMountedDriver= function(num)
{
    Gadget.ComGadget.ClickOnMountedDriver(num);
}
dTGadget.prototype.ClickUnMountOneDrive = function(num)
{
  Gadget.loaderStart();
    Gadget.ComGadget.UnMountDriver(num);
}
dTGadget.prototype.ClickUnMountALL = function(num)
{
  var AskUnmountAll = 1;
 try {
var wshShell = new ActiveXObject("WScript.Shell");
  AskUnmountAll = wshShell.RegRead("HKCU\\Software\\DT Soft\\DAEMON Tools Pro\\GuiNamespace\\AskUnmountAll");
 } catch (e)
    {
    }
  if(AskUnmountAll) {
	System.Gadget.Flyout.onShow = function(G){
		return function(){
			var cancelButt = System.Gadget.Flyout.document.getElementById('ok_butt');
			cancelButt.onclick = function(g){
				return function(){
					System.Gadget.Flyout.onHide=function(){
						g.loaderStart();
						g.ComGadget.UnMountALL();
						System.Gadget.Flyout.onHide = unBlockContentOnHide;
					}
					System.Gadget.Flyout.show = false;
				}
			}(G)
		}
	}(Gadget);
          var Caption = 'DAEMON Tools Lite';
          if(gSettings.gadgetType == 'pro') {
            Caption = 'DAEMON Tools Pro';
          } else if (gSettings.gadgetType == 'net') {
            Caption = 'DAEMON Tools Net';
          }
	  Gadget.showMessage('warning', Caption, Gadget.Tips.STRING_CONFIRM_UNMOUNT_ALL, true, Gadget.Tips.STR_5001_NO, Gadget.Tips.STR_5000_YES);
  } else {
						Gadget.loaderStart();
						Gadget.ComGadget.UnMountALL();
						System.Gadget.Flyout.onHide = unBlockContentOnHide;
  }
}
dTGadget.prototype.CallPropDriver = function(num)
{
  Gadget.loaderStart();
      Gadget.ComGadget.PropDriver(num);
}
dTGadget.prototype.CallDelDriver = function(num)
{
  Gadget.loaderStart();
    Gadget.ComGadget.DelDriver(num);
}
dTGadget.prototype.CallMakeImage = function()
{
    Gadget.ComGadget.CreateImage();
}
dTGadget.prototype.ClickRunDTNet = function()
{
    Gadget.ComGadget.ClickRunDTNet();
}
dTGadget.prototype.ClickRunDTPro = function()
{
    Gadget.ComGadget.ClickRunDTPro();
}
dTGadget.prototype.ClickRunDTProImage= function()
{
    Gadget.ComGadget.ClickRunDTProImage();
}
dTGadget.prototype.OnDragOver = function()
{
  var Count = 0;
  for (var i=0; System.Shell.itemFromFileDrop(event.dataTransfer, i) != null; i++)
  {
    Count++;
  }
  if(Count == 1)  event.returnValue = false;
}
dTGadget.prototype.OnDragEnter = function()
{
 var Count = 0;
  for (var i=0; System.Shell.itemFromFileDrop(event.dataTransfer, i) != null; i++)
  {
    Count++;
  }
  if(Count == 1)  event.returnValue = false;
}
dTGadget.prototype.fileDragDropped = function(num)
{
    var  sFile;
    for (var i=0; System.Shell.itemFromFileDrop(event.dataTransfer, i) != null; i++)
    {
        sFile = System.Shell.itemFromFileDrop(event.dataTransfer, i).path;
        Gadget.ComGadget.MountDrag(num, sFile);
    }
}
dTGadget.prototype.ChangeLanguage = function(num)
{
   Gadget.Tips = eval( "(" + Gadget.ComGadget.GetTips()+ ")" );
   Gadget.UseTips();
}
dTGadget.prototype.UseTips = function()
{
          Gadget.SetTip("tab2", Gadget.Tips.MANAGER_MSG_HELP);
          Gadget.SetTip("tab3", Gadget.Tips.IDS_WEB_NEWS);
          Gadget.SetTip("change_view", Gadget.Tips.IDS_CHANGE_VIEW);
          Gadget.SetTip("mount_n_drive", Gadget.Tips.MANAGE_DIALOG_MANAGE);
          Gadget.SetTip("dt_pro", Gadget.Tips.IDS_START_MANAGEMENT);
          Gadget.SetTip("dt_net", Gadget.Tips.IDS_START_MANAGEMENT_NET);
          Gadget.SetTip("make_img", Gadget.Tips.IDS_GRAB_DISK_DIALOG);
          Gadget.SetTip("img_editor", Gadget.Tips.IDS_IMAGE_EDITOR);
          Gadget.SetTip("add_drive", Gadget.Tips.IDS_ADD_VIRTUAL_DRIVE);
          Gadget.SetTip("unmount_all", Gadget.Tips.MANAGER_MSG_UNMOUNT_ALL);
          Gadget.SetTip("up_active",    Gadget.Tips.MANAGER_MSG_LOOKUP_PREV);
          Gadget.SetTip("down_active",  Gadget.Tips.MANAGER_MSG_LOOKUP_NEXT);
         	d("ID_Home_text").innerText = Gadget.Tips.IDS_HELP_HOMEPAGE;
					d("ID_Feedback_text").innerText = Gadget.Tips.MANAGER_MSG_SEND_FEEDBACK;
					d("ID_lite_help_text").innerText = Gadget.Tips.MANAGER_MSG_HELP;
      		System.Gadget.Settings.writeString("OptionsEmptyText", Gadget.Tips.STRING_DRIVE_EMPTY );
   				var settingsTabs = new Array(Gadget.Tips.IDS_GADGET_SETTINGS_TAB_SKIN, Gadget.Tips.IDS_GADGET_SETTINGS_TAB_SLOTS);
		  		Gadget.saveSettingsTabsText(settingsTabs);
}
System.Gadget.onSettingsClosed = Gadget.settingsClosed;
System.Gadget.onShowSettings = Gadget.onShowSettings;
