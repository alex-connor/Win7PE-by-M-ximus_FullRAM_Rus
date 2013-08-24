var dTGadget = function() {
  this.NumberInit = 0;
	this.Tips;
  this.drives = new Array();  
	this.currentViewType = 1;    
	this.currentDrive = 0;         
	this.SavecurrentDrive = 0;         
	this.defaultDrive = 0;         
	this.drivesHeights = new Array(4); 
	this.drivesHeights[0] = 154;     
	this.drivesHeights[1] = 225;     
	this.drivesHeights[2] = 296;     
	this.drivesHeights[3] = 367;     
	this.drivesHeights[4] = 169;     
	this.RSSCounter = 0;  
    this.ComGadget = 0;
    this.ComRSS = 0;
    this.GadgetID = 0;  
    this.DaemonDir = "";
    this.DaemonName = "DTLite.exe"; 
	this.messageTitle = '';
	this.messageText = '';
	this.BtOk = "Ok";
	this.BtCancel = "Cancel";
	this.messageType = 'warning';
	this.gadgetActionList;
  this.loaderStep = 0;
  this.dtLoaderTimeout = 0;
  this.num = 0;
  this.errMessage = false;
  this.errorMessageTitle;
  this.errorMessageText;
}
dTGadget.prototype.SaveCurrentNumber = function() {    
  this.SavecurrentDrive = this.currentDrive;
}
dTGadget.prototype.RestoreCurrentNumber = function() {    
  this.currentDrive = this.SavecurrentDrive;
  this.setDriveButtonActivity();
}
dTGadget.prototype.addElement = function(obj) {    
	this.drives[this.drives.length] = obj;
}
dTGadget.prototype.createVirtualDriveCode = function(num) { 
	var divDriveConteiner = document.createElement('div');
	divDriveConteiner.id = 'drive'+num;
	divDriveConteiner.attachEvent('ondragenter', function(){ return function(){  Gadget.OnDragEnter(); }}());
	divDriveConteiner.attachEvent('ondragover', function(){ return function(){  Gadget.OnDragOver(); }}());
	divDriveConteiner.attachEvent('ondrop', function(inum){ return function(){  Gadget.fileDragDropped(inum); }}(num));

	
	var ul = document.createElement('ul');
	ul.style.height = '40px';
	
	
	var liLeft = document.createElement('li');
	liLeft.className = 'left_controls font_size0';
	var divMount = document.createElement('div');
	divMount.attachEvent('onmouseover', function(el, cName){ return function(){ addClass(el, cName); }}(divMount, 'hover'));
	divMount.attachEvent('onmouseout', function(el, cName){ return function(){ removeClass(el, cName); }}(divMount, 'hover'));
	divMount.onclick = function(n){ return function(){ Gadget.ClickMountOneDrive(num);/*Gadget.remountDrive(n, n+1, 'Some CD', '', 'img/unreal.png')*/ }}(num);
	var divUnmount = document.createElement('div');
	if(this.drives[num].disabled==true) { divUnmount.className = 'disable';}
	else {
	divUnmount.attachEvent('onmouseover', function(el, cName){ return function(){ addClass(el, cName); }}(divUnmount, 'hover'));
	divUnmount.attachEvent('onmouseout', function(el, cName){ return function(){ removeClass(el, cName); }}(divUnmount, 'hover'));
	divUnmount.onclick = function(n){ return function(){ Gadget.ClickUnMountOneDrive(num);/*Gadget.remountDrive(n, n+1, 'Some CD', '', 'img/unreal.png')*/ }}(num);
	}
	divUnmount.id = 'unmount'+num;
	var imgMount = document.createElement('img');
	imgMount.setAttribute('title', Gadget.Tips.MANAGER_MSG_MOUNT_IMAGE);
	imgMount.setAttribute('src','img/1.gif');
	imgMount.className = 'mount pointer borderNone';
	var imgUnmount = document.createElement('img');
	imgUnmount.setAttribute('src','img/1.gif');
	imgUnmount.className = 'unmount pointer borderNone';
	imgUnmount.setAttribute('title',Gadget.Tips.MANAGER_MSG_UNMOUNT_IMAGE);
	divMount.appendChild(imgMount)
	liLeft.appendChild(divMount);
	divUnmount.appendChild(imgUnmount)
	liLeft.appendChild(divUnmount);
	
	
	var liShortcut = document.createElement('li');
	liShortcut.attachEvent('onmouseover', function(el, cName){ return function(){ addClass(el, cName); }}(liShortcut, 'hover'));
	liShortcut.attachEvent('onmouseout', function(el, cName){ return function(){ removeClass(el, cName); }}(liShortcut, 'hover'));
	liShortcut.ondblclick = function(cDName, disabled, n){ return function(){if(disabled){
				Gadget.ClickMountOneDrive(n);
		} else {
		System.Shell.execute(cDName+"\\");}
		}}(RemoveS(this.drives[num].name), this.drives[num].disabled, num);
		liShortcut.onclick = function(cDName, disabled, n){ return function(){if(disabled){
			Gadget.ClickMountOneDrive(n);
		} else {
  		Gadget.ClickOnMountedDriver(cDName); }
		}}(RemoveS(this.drives[num].name), this.drives[num].disabled, num);
	divShortcut = document.createElement('div');
	divShortcut.className = 'drive_icon pointer';
	var imgShortcut = document.createElement('img');
	imgShortcut.id = 'drive_icon'+num;
	imgShortcut.setAttribute('src', this.drives[num].shortcut);
	imgShortcut.setAttribute('title', this.drives[num].tooltip);
	imgShortcut.setAttribute('width', 32);
	imgShortcut.setAttribute('height', 32);
	divShortcut.appendChild(imgShortcut);
	liShortcut.appendChild(divShortcut);
	
	var liRight = document.createElement('li');
	liRight.className = 'right_controls font_size0';
	var divProp = document.createElement('div');
	divProp.attachEvent('onmouseover', function(el, cName){ return function(){ addClass(el, cName); }}(divProp, 'hover'));
	divProp.attachEvent('onmouseout', function(el, cName){ return function(){ removeClass(el, cName); }}(divProp, 'hover'));
	divProp.onclick = function(n){ return function(){ Gadget.CallPropDriver(num);}}(num);
	var divDel = document.createElement('div');
	divDel.attachEvent('onmouseover', function(el, cName){ return function(){ addClass(el, cName); }}(divDel, 'hover'));
	divDel.attachEvent('onmouseout', function(el, cName){ return function(){ removeClass(el, cName); }}(divDel, 'hover'));
	divDel.onclick = function(n){ return function(){ Gadget.CallDelDriver(num);}}(num);
	var imgProp = document.createElement('img');
	imgProp.setAttribute('src','img/1.gif');
	imgProp.className = 'properties pointer borderNone';
	imgProp.setAttribute('title',Gadget.Tips.MANAGE_DIALOG_PROPERTIES);
	var imgDel = document.createElement('img');
	imgDel.setAttribute('src','img/1.gif');
	imgDel.className = 'delete pointer borderNone';
	imgDel.setAttribute('title',Gadget.Tips.IDS_REMOVE_DRIVE);
	divProp.appendChild(imgProp);
	liRight.appendChild(divProp);
	divDel.appendChild(imgDel);
	liRight.appendChild(divDel);
	ul.appendChild(liLeft);
	ul.appendChild(liShortcut);
	ul.appendChild(liRight);
	
	
	var divTxt = document.createElement('div');
	divTxt.className = "cdPath";
	divTxt.id = "cd_path"+num;
	divTxt.setAttribute('title',this.drives[num].tooltip);
	var spanCDName = document.createElement('span');
	spanCDName.className = "cdName";
	spanCDName.id = 'cd_name'+num;
	spanCDName.innerHTML = this.drives[num].name+"&nbsp;";
	var spanCDTitle = document.createElement('span');
	spanCDTitle.className = "cdTitle";
	spanCDTitle.id = 'cd_title'+num;
	spanCDTitle.innerHTML = this.drives[num].title;
	divTxt.appendChild(spanCDName);
	divTxt.appendChild(spanCDTitle);
	divDriveConteiner.appendChild(ul);
	divDriveConteiner.appendChild(divTxt);
	var obj = d('content1');
	while( obj.className != 'lines' && obj != null)
	{
		for(var i=0; i < obj.childNodes.length; i++){
			if(obj.childNodes[i].tagName == 'DIV') {
				obj = obj.childNodes[i];
				break;
			}
		}
	}
	if(num>0) {
		var separator = document.createElement('div');
		separator.className = 'separator';
		separator.id = 'separator'+num;
		obj.appendChild(separator);
	}
	obj.appendChild(divDriveConteiner);
	this.num = num;
}
dTGadget.prototype.refreshVirtualDriveCode = function(num)
{
	d('drive_icon'+num).setAttribute('src',this.drives[num].shortcut);
	d('cd_name'+num).innerHTML = this.drives[num].name+"&nbsp;";
	d('cd_title'+num).innerHTML = this.drives[num].title;
	d('cd_path'+num).setAttribute('title',this.drives[num].tooltip);
	d('drive_icon'+num).setAttribute('title',this.drives[num].tooltip);
	this.num = num;
}
dTGadget.prototype.regroupVirtualDrives = function() { 
	var newDrives = Array();
	var regroupNum = -1;
	for(var i=0; i<this.drives.length; i++) {
		if(this.drives[i]!=null) {
			if(i!= newDrives.length){
				removeElement('drive'+i);
				removeElement('separator'+i);
				newDrives[newDrives.length] = this.drives[i];
			} else
				newDrives[newDrives.length] = this.drives[i];
		} else {
			regroupNum = i;
		}
	}
	this.drives = newDrives;
	for(j = regroupNum; j<this.drives.length; j++)
		this.createVirtualDriveCode(j);
}
dTGadget.prototype.removeVirtualDrive = function(num) { 
	if(num >= 0 && num < Gadget.getVirtualDriveCount()) {
	if(num <= this.currentDrive) {
		if(num == this.currentDrive) {
			this.currentDrive = this.defaultDrive >= this.drives.length ? 0 : this.defaultDrive;
		} else {
			this.currentDrive !=0 ? this.currentDrive-- : this.currentDriv=0;
		}
	}
	removeElement('drive'+num);
	removeElement('separator'+num);
	this.drives[num] = null;
	this.regroupVirtualDrives();
	if(this.drives.length<1) 
	{
	   addClass(d('content1'),'noVirtualDrives');
	} else 
	{
	    this.chengeContentView(this.drives.length-1);
	}
	this.setDriveButtonActivity();
	if(this.drives.length < 4) {
		removeClass(d('mainControls'),'fullDrives');
		disableAddDrive = false;
	}
}
this.num = num;
}
dTGadget.prototype.displayVDiscs = function() 
{
	if(this.currentViewType == 2) {
		for(var i=0;i<this.drives.length;i++) {
			if(i!=this.currentDrive) 
				d('drive'+i).style.display = "none";
			else
				d('drive'+i).style.display = "block";
		}
	} else {
		for(var j=0;j<this.drives.length;j++) {
			d('drive'+j).style.display = "block";
		}
	}
	d('driveNum').innerHTML = (this.currentDrive+1) + '/'+this.drives.length;
}
dTGadget.prototype.chengeContentView = function(num){ 
	if(this.currentViewType == 2) {
		if(this.drives.length >1) {
			addClass(d('content1'), 'view2');
			num=4;
		}else {
			removeClass(d('content1'), 'view2');
		}
	}
	this.displayVDiscs();
	document.body.style.height = this.drivesHeights[num]+"px";
	d("mainBG").style.height = this.drivesHeights[num]+"px";
	d("mainBG").removeAttribute("src");
	d("mainBG").setAttribute('src',"skins/"+this.currentSkin+"/drives"+num+".png");
	//d("mainBG").src = "skins/"+this.currentSkin+"/drives"+num+".png";
	if(this.drives.length>1) d('change_view').style.display = 'block';
	else d('change_view').style.display = 'none';
	var content_height = (this.drivesHeights[num]-65) + "px";
	d('content2').style.height = content_height;
	d('content3').style.height = content_height;
	this.num = num;
}
dTGadget.prototype.addVirtualDrive = function( cdName, cdTitle, cdPath, shortcut, tooltip, disabled) { 
	if( this.drives.length <= 3 )
	{
		var drive = new virtualDrive( cdName, cdTitle, cdPath, shortcut, tooltip, disabled );
		var num = this.drives.length;
		this.addElement(drive);
		var cont = d('content1');
		if(hasClass(cont,'noVirtualDrives'))removeClass(cont,'noVirtualDrives');
		if(hasClass(cont,'loadingDrives'))removeClass(cont,'loadingDrives');
		this.currentDrive = num;
		this.createVirtualDriveCode(num);
		this.chengeContentView(num);
		this.setDriveButtonActivity();
		if(this.drives.length>3) {
			d('add_drive_selected').style.display = 'none';
			addClass(d('mainControls'),'fullDrives');
			disableAddDrive = true;
		}
	}
}
dTGadget.prototype.chengeViewType = function(){ 
	if(this.currentViewType == 1&&this.drives.length>1) {
		this.currentViewType = 2;
		addClass(d('content1'), 'view2');
		this.chengeContentView (this.drives.length-1);
		//System.Gadget.Settings.write("contentWiew", 1);
	}
	else {
		this.currentViewType = 1;
		removeClass(d('content1'), 'view2');
		this.chengeContentView (((this.drives.length-1) == -1 ? 0 : this.drives.length-1 ));
		//System.Gadget.Settings.write("contentWiew", -1);
	}
	gSettings.contentWiew = this.currentViewType;
	System.Gadget.Settings.write("contentWiew",gSettings.contentWiew);
	gSettings.saveSkinJSON();
}
dTGadget.prototype.chengeViewTypeOn = function(wType){
	this.currentViewType = wType;
	if(wType == 2&&this.drives.length>1) {
		addClass(d('content1'), 'view2');
		this.chengeContentView (this.drives.length-1);
		//System.Gadget.Settings.write("contentWiew", 1);
	}
	else {
		removeClass(d('content1'), 'view2');
		this.chengeContentView (((this.drives.length-1) == -1 ? 0 : this.drives.length-1 ));
		//System.Gadget.Settings.write("contentWiew", -1);
	}
}
/*dTGadget.prototype.chengeViewTypeOnload = function(type){ 
	if(type == 1) {
		this.currentViewType = 2;
		addClass(d('content1'), 'view2');
		this.chengeContentView (this.drives.length-1);
	}
	else if(type == -1) {
		this.currentViewType = 1;
		removeClass(d('content1'), 'view2');
		this.chengeContentView (((this.drives.length-1) == -1 ? 0 : this.drives.length-1 ));
	}
}*/
dTGadget.prototype.setDriveButtonActivity = function (){ 
	if(this.currentDrive > 0) {
		d('up_not_active').style.display = "none";
		d('up_active').style.display = "block";
	}
	if(this.currentDrive == 0) {
		d('up_not_active').style.display = "block";
		d('up_active').style.display = "none";
	}
	if(this.currentDrive < this.drives.length-1) {
		d('down_not_active').style.display = "none";
		d('down_active').style.display = "block";
	}
	if(this.currentDrive >= this.drives.length-1) {
		d('down_not_active').style.display = "block";
		d('down_active').style.display = "none";
	}
}
dTGadget.prototype.moveDriveUp = function (){
	if(this.currentDrive > 0) {
		this.currentDrive--;
		this.displayVDiscs();
		this.setDriveButtonActivity();
	}
}
dTGadget.prototype.moveDriveDown = function (){
	if(this.currentDrive < this.drives.length-1) {
		this.currentDrive++;
		this.displayVDiscs();
		this.setDriveButtonActivity();
	}
}
dTGadget.prototype.remountDrive = function (num, cdName, cdTitle, cdPath, shortcut, tooltip, disabled){
	this.drives[num].name = cdName;
	this.drives[num].title = cdTitle;
	this.drives[num].path = cdPath;
	this.drives[num].shortcut = shortcut;
	this.drives[num].tooltip = tooltip;
	this.drives[num].disabled = disabled;
	this.refreshVirtualDriveCode(num);
	removeClass(d('unmount'+num),'disable');
	this.num = num;
}
dTGadget.prototype.unmountDrive = function (num){
	this.drives[num].title = Gadget.Tips.IDS_DRIVE_EMPTY;
	this.drives[num].path = '';
	this.drives[num].tooltip = '';
	this.drives[num].disabled = true;
	this.drives[num].shortcut = 'skins/'+this.currentSkin+'/unmounted.png';
	this.refreshVirtualDriveCode(num);
	addClass(d('unmount'+num),'disable');
	this.num = num;
}
dTGadget.prototype.unmountAll = function (){
      Gadget.ComGadget.UnMountALL();
}
dTGadget.prototype.createMessageControls = function (arr){
	d('message_controls').innerHTML = "";
	var ul = document.createElement('ul');
	for(var i in arr)
	{
		var li = document.createElement('li');
		li.attachEvent('onmouseover', function(el, cName){ return function(){ addClass(el, cName); }}(li, 'hover'));
		li.attachEvent('onmouseout', function(el, cName){ return function(){ removeClass(el, cName); }}(li, 'hover'));
		var divControlConteiner = document.createElement('div');
		var divControlLeft = document.createElement('div');
		divControlLeft.className = "messageButLeft pointer";
		switch (arr[i].type){
			case 'closeMessage' :
				divControlLeft.onclick = function(){ return function(){ Gadget.hideMessage(); }}();
			break;
			case 'delDrive' :
				divControlLeft.onclick = function(n){ return function(){Gadget.hideMessage(); Gadget.removeVirtualDrive(n); }}(arr[i].num);
			break;
			case 'unmountDrive' :
				divControlLeft.onclick = function(n){ return function(){Gadget.hideMessage(); Gadget.unmountDrive(n); }}(arr[i].num);
			break;
			case 'mountDrive' :
				divControlLeft.onclick = function(n){ return function(){Gadget.hideMessage(); Gadget.ClickMountOneDrive(n);  }}(arr[i].num);
			break;
			case 'closeGadget' :
				divControlLeft.onclick = function(){ return function(){System.Gadget.close();}}();
			break;
			case 'unmountAll' :
				divControlLeft.onclick = function(){ return function(){Gadget.hideMessage(); Gadget.unmountAll(); }}();
			break;
		}
		var divControlMiddle = document.createElement('div');
		divControlMiddle.className = "messageButMiddle";
		divControlMiddle.innerHTML = arr[i].text;
		var divControlRight = document.createElement('div');
		divControlRight.className = "messageButRight";
		divControlRight.appendChild(divControlMiddle);
		divControlLeft.appendChild(divControlRight);
		divControlConteiner.appendChild(divControlLeft);
		li.appendChild(divControlConteiner);
		ul.appendChild(li);
	}
	d('message_controls').appendChild(ul);
}
dTGadget.prototype.setMessageTitle  = function (title){
	this.messageTitle = title;
}
dTGadget.prototype.setMessageText  = function (txt){
	this.messageText = txt;
	}
dTGadget.prototype.showMessage = function (type, title, text, buttCancel, BtOk, BtCancel){
	System.Gadget.Flyout.file = "message.html";
	if(title)
		this.messageTitle = title;
	if(text)
		this.messageText = text;
	if(type)
		this.messageType = type;
  if(BtOk) 
  	this.BtOk        = BtOk;
  if(BtCancel) 
  	this.BtCancel = BtCancel;
         
	System.Gadget.Settings.writeString("messageTitle", this.messageTitle);
	System.Gadget.Settings.writeString("messageText", this.messageText);
	System.Gadget.Settings.writeString("messageType", this.messageType);
	System.Gadget.Settings.writeString("BtOk", this.BtOk);
	System.Gadget.Settings.writeString("BtCancel", this.BtCancel);
	if(buttCancel){
		this.messageType = buttCancel;
		System.Gadget.Settings.writeString("messageButtonCancel", this.messageButCencel);
	}
	this.flyOut = 'message';
	System.Gadget.Flyout.show = true;
}
dTGadget.prototype.hideErrorMessage = function (){
	this.errMessage.style.display = 'none';
}
dTGadget.prototype.showErrorMessage = function (){
	this.errMessage.style.display = 'block';
}
dTGadget.prototype.createErrorMessage  = function () {
	if(this.errMessage == false) {
		this.errMessage = d('error_message');
		var errorImage = document.createElement('img');
		errorImage.className = "errorImg";
		errorImage.setAttribute('src', 'img/1.gif');
		this.errorMessageTitle = document.createElement('div');
		this.errorMessageTitle.className = 'errorMessageTitle';
		this.errorMessageTitle.id = 'error_message_title';
		this.errorMessageText = document.createElement('div');
		this.errorMessageText.className = 'errorMessageText';
		this.errorMessageText.id = 'error_message_text';
		this.errMessage.appendChild(errorImage);
		this.errMessage.appendChild(this.errorMessageTitle);
		this.errMessage.appendChild(this.errorMessageText);
		this.errMessage.onclick = function(g){ return function(){ Gadget.showMessage();}}(Gadget);
	}
}
dTGadget.prototype.setErrorMessageText = function (text, title){
	this.errorMessageText.innerHTML = text;
	if(title)
		this.errorMessageTitle.innerHTML = title;
}
dTGadget.prototype.getCurrentHeight = function ()
{
	var hDT = 0;
	if(this.drives.length>0)
		hDT = this.currentViewType == 1 ? ((this.drivesHeights[(this.drives.length-1)]/2)) : ((this.drivesHeights[4]/2));
	else
		hDT = this.drivesHeights[0]/2;
	return hDT;
}
dTGadget.prototype.loaderStart = function ( ) {
  if(Gadget.dtLoaderTimeout == 0)
  {
    addClass(d('mainControls'), 'disable_all_controls');
	//d('alert_div').innerHTML = d('controls1').className; 
    var i = this.drives.length - 1;
    if( i < 0) i = 0;
    var top_ = (this.currentViewType == 1 ? (this.drivesHeights[i]/2) : (this.drivesHeights[4]/2) ) - 40;
    d('dt_loader').style.top = top_ + 'px';
	d('load_txt_conteiner').style.top = top_+12+ 'px';
	blockContent(false, false, true);
	d('dt_loader').style.display = 'block';
	dTLoader();
  }
}

dTGadget.prototype.dtLoaderStop = function () {
	unBlockContent();
	removeClass(d('mainControls'), 'disable_all_controls');
	//d('alert_div').innerHTML = d('controls1').className; 
	d('dt_loader').style.display = 'none';
	clearTimeout(Gadget.dtLoaderTimeout);
	Gadget.dtLoaderTimeout = 0;
}
dTGadget.prototype.setLoaderText = function (txt) {
	d('loader_text').innerHTML = txt;
}
dTGadget.prototype.enableNewRss = function () {
	addClass(d('tab3'), 'newRSS');
}
dTGadget.prototype.disableNewRss = function () {
	removeClass(d('tab3'), 'newRSS');
}
dTGadget.prototype.showLoaderText = function () {
	d('load_txt_conteiner').style.display = 'block';
}
dTGadget.prototype.hideLoaderText = function () {
	d('load_txt_conteiner').style.display = 'none';
}

dTGadget.prototype.refreshGBackground = function(currentSkin){
	this.currentSkin = currentSkin;
	this.chengeContentView(this.num);
}
dTGadget.prototype.changeTabsTip = function(tab1Tip, tab1Tip, tab3Tip) {
	d('tab1').setAttribute ('title', tab1Tip);
	d('tab1').setAttribute ('alt', tab1Tip);
	d('tab2').setAttribute ('title', tab2Tip);
	d('tab2').setAttribute ('alt', tab2Tip);
	d('tab3').setAttribute ('title', tab3Tip);
	d('tab3').setAttribute ('alt', tab3Tip);
}
dTGadget.prototype.saveSettingsTabsText = function(t){
	System.Gadget.Settings.writeString("settingsTabs", JSON.encode(t));
}
dTGadget.prototype.parseToHTML = function(text){
	text = text.replace(/\[URL]/g, "<a href =\"#\">");
	text = text.replace(/\[url]/g, "<a href =\"#\">");
	text = text.replace(/\[URL=/g, "<a href =");
	text = text.replace(/\[url=/g, "<a href =");
	text = text.replace(/\[\/url]/g, '</a>');
	text = text.replace(/\[\/URL\]/g, '</a>');
	text = text.replace(/\]/g, '>');
	
	return text;
}
Gadget = new dTGadget();
var Debug = 0;
refreshGadgetSkin = function(g) {return function() {
	if(gSettings.settingsExist==true) {
		changeSkin(gSettings.currentSkin, System.Gadget.document);
		g.refreshGBackground(gSettings.currentSkin);
	}
}}(Gadget);


