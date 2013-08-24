disableAddDrive = false;
function d(id)
{
	return document.getElementById(id);
}
function removeElement(id){ 
	obj = d(id);
	if(obj)
		obj.parentNode.removeChild(obj);
}
function removeElementByObj(obj){ 
	if(obj)
		obj.parentNode.removeChild(obj);
}
function addClass(element, value) {
	if (element!=null && !element.className) {
		element.className = value;
	} else if (element!=null){
		var newClassName = element.className;
		newClassName += " ";
		newClassName += value;
		element.className = newClassName;
	}
}
function hasClass (element, value) {
	if (typeof element == 'undefined' || element==null ) { return false; }
	if(element.className) {
		str = element.className.split( " " );
		for( i = 0; i < str.length; i++ ){
			if(str[i]==value) return true;
		}
	}
	return false;
}
function hasId (element, value) {
	if (typeof element == 'undefined' || element==null ) { return false; }
	if(str[i]==value) return true;
	return false;
}
function removeClass(element, value) {
	if (element.className) {
		var newClassName = "";
		str = element.className.split( " " );
		for( i = 0; i < str.length; i++ ){
			if( str[i] != value && str[i]!="" ) newClassName += ( i==0 ? "" : " " ) + str[i];
		}
		element.className = newClassName;
	}
	return 0;
}
function addClassSimple(element, value) {
	if(element != null) {
    element.className = value;
  }
}
function removeClassSimple(element) {
	
	if(element != null) {
    element.className = '';
  }
}
function bindAddClass()
{
	addClass (this, 'hover')
}
function chengeTab(num)
{
	removeClassSimple(d('tabArea'));
	removeClassSimple(d('content'));
	if(hasClass(d('mainControls'), 'fullDrives')) {
	removeClassSimple(d('mainControls'));
		addClassSimple(d('mainControls'), 'ctrl'+num+' fullDrives');
	} else {
		addClassSimple(d('mainControls'), 'ctrl'+num);
	}
	addClassSimple(d('tabArea'), 'tab'+num);
	addClassSimple(d('content'), 'cont'+num);
	addClass(d('tab'+num), 'selected');
	for (var i=1; i<=3; i++){
		if(i!=num){
			if(hasClass(d('tab'+i), 'newRSS'))
				d('tab'+i).className = 'newRSS';
			else
			removeClassSimple(d('tab'+i));
		}
	}
}

flyoutFileName = '';
function blockContent (remove_on_click, loader, opacity)
{
	var imgBlockContent = document.createElement('img');
	imgBlockContent.setAttribute('src','img/1.gif');
	imgBlockContent.className = "positionAbsolute blockStandart";
	var mainConteiner = d('mainDTGadjet');
	imgBlockContent.style.width = (mainConteiner.offsetWidth - 8) + "px";
	//d('alert_div').innerHTML = imgBlockContent.style.height;
	imgBlockContent.style.height = mainConteiner.offsetHeight + "px";
	imgBlockContent.id = "block_content";
	if(opacity) {
		var opacityBlockContent = document.createElement('img');
		opacityBlockContent.setAttribute('src','img/1.gif');
		opacityBlockContent.className = "positionAbsolute opacity_80 blockLoader";
		opacityBlockContent.style.width = (mainConteiner.offsetWidth-11) +"px";
		opacityBlockContent.style.height = (mainConteiner.offsetHeight - 57) + "px";
		opacityBlockContent.id = "block_content_opacity";
		mainConteiner.appendChild(opacityBlockContent);
	}
	if(remove_on_click)
		imgBlockContent.attachEvent('onclick', function(){ return function(){removeElement('block_content'); bodyHideFlyout();}}());
	mainConteiner.appendChild(imgBlockContent);
	if(loader)
	{
		imgLoader = document.createElement('img');
		mainConteiner.offsetHeight
	}
}
function unBlockContent ()
{
	removeElement('block_content');
	removeElement('block_content_opacity');
}
function unBlockContentOnHide()
{
	unBlockContent();
	d(flyoutFileName+'_selected').style.display = 'none';
	if( disableAddDrive == true && flyoutFileName=='add_drive') {}
	else
		d(flyoutFileName).style.display = 'block';
}
function showFlyout()
{
	System.Gadget.Flyout.show = true;
}
function hideFlyout()
{
	System.Gadget.Flyout.show = false;
}
function bodyHideFlyout()
{
	if(System.Gadget.Flyout.show == true)
	{
		hideFlyout();
		d(flyoutFileName+'_selected').style.display = 'none';
		d(flyoutFileName).style.display = 'block';
	}
}
function flyoutShowHide(fileName)
{
	if(System.Gadget.Flyout.show == true) {
		hideFlyout();
		d(flyoutFileName+'_selected').style.display = 'none';
		if( disableAddDrive == true && flyoutFileName=='add_drive')
			d(flyoutFileName).style.display = 'none';
		else
			d(flyoutFileName).style.display = 'block';
		System.Gadget.Flyout.file = fileName+".html";
	} else {
		System.Gadget.Flyout.file = fileName+".html";
		flyoutFileName = fileName;
		showFlyout();
		blockContent(true);
		d(fileName).style.display = 'none';
		d(fileName+'_selected').style.display = 'block';
	}
}
function returnGadgetOnHide(){
	System.Gadget.Flyout.onHide = unBlockContentOnHide;
}
function RemoveS(str)
{
    if(str.length > 2)  {  
        return str.substr(1, str.length-2);
    } 
    return "";
}

function dTLoader()
{
  
	d('dt_loader').style.backgroundPosition = "-"+Gadget.loaderStep+"px 0";
	if (Gadget.loaderStep == 715)
		Gadget.loaderStep=0;
	else
		Gadget.loaderStep += 65;
  clearTimeout(Gadget.dtLoaderTimeout);
	Gadget.dtLoaderTimeout = setTimeout("dTLoader()",60);
}
function changeSkin (name, obj) {
	var i, a, main;
	for(i=0; (a = obj.getElementsByTagName("link")[i]); i++) {
		if(a.id == 'current_skin') {
		   a.setAttribute('href','/skins/'+name+'/style.css');
		 }
	   }
	//document.writeln('<link rel="stylesheet" type="text/css" href="skins/'+this.currentSkin+'/style.css" id="current_skin">');
}
function dTLoaderRSS()
{
	d('dt_loader').style.backgroundPosition = "-"+RSS.loaderStep+"px 0";
	if (RSS.loaderStep == 715)
		RSS.loaderStep=0;
	else
		RSS.loaderStep += 65;
  clearTimeout(RSS.dtLoaderTimeout);
	RSS.dtLoaderTimeout = setTimeout("dTLoaderRSS()",60);
}
function changeSkin (name, obj) {
	var i, a, main;
	removeElement('current_skin');
	var new_styles = obj.createElement('link');
	new_styles.setAttribute('type','text/css');
	new_styles.setAttribute('rel','stylesheet');
	new_styles.setAttribute('id','current_skin');
	new_styles.setAttribute('href','/skins/'+name+'/style.css');
	obj.getElementsByTagName('head')[0].appendChild(new_styles);
}
function changeMessageSkin (name, obj) {
	var i, a, main;
	for(i=0; (a = obj.getElementsByTagName("link")[i]); i++) {
		if(a.id == 'current_skin') {
		   a.setAttribute('href','skins/'+name+'/message.css');
		 }
		 if(a.id == 'rss_css') {
			a.setAttribute('href','skins/'+name+'/rss.css');
		 }
	   }
	//document.writeln('<link rel="stylesheet" type="text/css" href="skins/'+this.currentSkin+'/style.css" id="current_skin">');
}
function getGadgetSettings () {
}
function refreshGadgetSkin() {
	if(gSettings.settingsExist==true) {
		changeSkin(gSettings.currentSkin, System.Gadget.document);
		Gadget.refreshGBackground(gSettings.currentSkin);
	}
}
function settingsClosing(event)
{
	if (event.closeAction == event.Action.commit)
	{
		dSlots.getActions();
		gSettings.saveSettings();
	}
}
function getElementByIdInObj(id, Obj) {
	if(hasId(Obj, id))
	{
		return Obj;
	}
	var retVal = false;
	if ( Obj.hasChildNodes() ) {
		for (var i = 0; i < Obj.childNodes.length; i++ ) {
			if ( Obj.childNodes[ i ].hasChildNodes() || retVal != false) {
				retVal = getElementByClassNameInObj( Obj.childNodes [ i ], className );
			}
		}
	}
	return retVal;
}
function getElementByClassNameInObj(className, Obj) {
	if(hasClass(Obj, className))
	{
		return Obj;
	}
	var retVal = false;
	if ( Obj.hasChildNodes() ) {
		for (var i = 0; i < Obj.childNodes.length; i++ ) {
			if ( Obj.childNodes[ i ].hasChildNodes() || retVal != false) {
				retVal = getElementByClassNameInObj( Obj.childNodes [ i ], className );
			}
		}
	}
	return retVal;
}
function changeSettinsTab(id) {
	for(var i=0; i<tabs.length; i++) {
		if(tabs[i]['status']=='selected') {
			tabs[i]['status'] = '';
			removeClass(document.getElementById(tabs[i]['id']), 'selected');
			document.getElementById(tabs[i]['id']+'_content').style.display = 'none';
		}
		if(tabs[i]['id']==id)
			tabs[i]['status'] = 'selected';
	}
	document.getElementById(id+'_content').style.display = 'block';
	addClass(document.getElementById(id), 'selected');
}
function changeSettingsTabsText () {
	for(var i = 0; i<gSettings.settingsTabs.length; i++) {
		d('tab'+i+'text').innerHTML = gSettings.settingsTabs[i];
	}
}
System.Gadget.onSettingsClosing = settingsClosing;
messageOnShow = function(){return function(){}}()
