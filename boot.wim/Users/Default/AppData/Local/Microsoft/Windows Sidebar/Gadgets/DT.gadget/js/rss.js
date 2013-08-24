var dtRSS = function(id) {
	this.rssId = id;
	this.rssContent;
	this.messages = Array();
	this.lastTitle = "";
  this.LoaderText = "Loading...";
  this.messageTitle = 'Delete items';
  this.messageText = 'Are you shure you want to delete all items?';
	this.LocaleStrongs;
  this.ComRSS = null;
}
dtRSS.prototype.OnRefresh = function() 
{
     dtRSS.ComRSS.Refresh(); 

}


dtRSS.prototype.OnAutoUpdate = function(obj)
{
	if(obj.checked == true)
	{
     dtRSS.ComRSS.SetAutoUpdate(1);
	} else {
     dtRSS.ComRSS.SetAutoUpdate(0);
  }

}

dtRSS.prototype.OnLoad = function() 
{ 
    try 
    {
        dtRSS.ComRSS = new ActiveXObject("DTGadget.RSS");
        RSS.IntervalID = setInterval ( "RSS.Refresh();", 1000 );   
        
        var OpenRet = dtRSS.ComRSS.Open(); 
        RSS.LoadMessages();
        RSS.createRSSList();
        if(OpenRet) {
          RSS.loaderStart();
        }
        if(dtRSS.ComRSS.GetAutoState())  {
          d("rss_auto_update").checked = true; 
        } else {
          d("rss_auto_update").checked = false; 
        }
            var JSONTexts = dtRSS.ComRSS.GetTextStrings();
            if( JSONTexts != "") 
            {
              RSS.LocaleStrongs = eval( "(" + JSONTexts + ")" );
              d("rss_refresh").title = RSS.LocaleStrongs.IDS_RSS_TIP_UPDATE; 
              d("read_all").title =    RSS.LocaleStrongs.IDS_RSS_TIP_READ_ALL; 
              d("unread_all").title =  RSS.LocaleStrongs.IDS_RSS_TIP_UNREAD_ALL; 
              d("del_all").title =     RSS.LocaleStrongs.IDS_RSS_TIP_DELETE_ALL; 
              d("label_auto_update").innerHTML =  RSS.LocaleStrongs.IDS_RSS_AUTO_UPDATE; 
              this.LoaderText =        RSS.LocaleStrongs.IDS_RSS_LOADING;
            }

    }
    catch (e)
    { 
     		initError('Error', 'Gadget initialisation error');
    }
}

dtRSS.prototype.Refresh = function() 
{
    var devices;

    var txt = dtRSS.ComRSS.GetInfo(RSS); 

    if(txt == "Refresh") 
    {
        RSS.dtLoaderStop();
        RSS.LoadMessages();
        RSS.createRSSList();
    }
}

dtRSS.prototype.LoadMessages = function() 
{
        this.messages = Array();
        var NumberRss = dtRSS.ComRSS.GetRssNumber();
        if(NumberRss) {
          for(var i = 0; i < NumberRss; i++) {
            var item = eval(dtRSS.ComRSS.GetRssItem(i));
            this.messages.push(item[0]);
          }
        }
        RSS.changeTitle(dtRSS.ComRSS.GetCaption());
}

dtRSS.prototype.addElement = function(obj) 
{
	this.messages[this.skins.length] = obj;
}
dtRSS.prototype.init = function() 
{
	this.rssContent = document.getElementById(this.rssId);
}
dtRSS.prototype.setStatus = function (stat) {
	for(var i = 0; i<this.messages.length; i++) {
			this.setItemStatus(stat, i);
	}
}
dtRSS.prototype.setItemStatus = function (stat, num) {
			if(stat == 'read') {
				this.messages[num]['objIcon'].setAttribute('src', 'img/'+stat+'.png');
				addClass(this.messages[num]['objItem'], 'readMess');
				this.messages[num]['status'] == stat;
			} else if(stat == 'unread') {
				this.messages[num]['objIcon'].setAttribute('src', 'img/'+stat+'.png');
				removeClass(this.messages[num]['objItem'], 'readMess');
				this.messages[num]['status'] == stat;
	}
}
dtRSS.prototype.delAll = function() 
{
  dtRSS.ComRSS.DellAll();
	this.messages = Array();
	this.rssContent.innerHTML = '';
}
dtRSS.prototype.createRSSList = function() 
{
	this.rssContent.innerHTML = '';
	for(var i = 0; i < this.messages.length; i++) {
		var rssElement = document.createElement('div');
		rssElement.className = 'rssElement pointer';
		rssElement.attachEvent('onmouseover', function(el, cName){ return function(){ addClass(el, cName);}}(rssElement, 'rssHover'));
		rssElement.attachEvent('onmouseout', function(el, cName){ return function(){ removeClass(el, cName);}}(rssElement, 'rssHover'));
		var rssIcon = document.createElement('img');
		rssIcon.className = 'rssIcon';
		rssIcon.setAttribute('align', 'absmiddle');
		if(this.messages[i]['status'] == 'read') {
			rssIcon.setAttribute('src', 'img/read.png');
			addClass(rssElement, 'readMess');
		} else {
			rssIcon.setAttribute('src', 'img/unread.png');
		}
		var rssTXT = document.createElement('span');
		rssTXT.className = 'rssTXT';
		rssTXT.innerHTML = this.messages[i]['text'];
		rssElement.appendChild(rssIcon);
		rssElement.appendChild(rssTXT);
		this.rssContent.appendChild(rssElement);
		this.messages[i]['objIcon'] = rssIcon;
		this.messages[i]['objItem'] = rssElement;
		rssElement.onclick = function(url, t, txt, n){ return function(){ System.Shell.execute(url);/* window.open(url);*/ t.setItemStatus('read', n); dtRSS.ComRSS.MarkAsRead(txt); }}(this.messages[i]['url'], this, this.messages[i]['text'], i);

	}
}
dtRSS.prototype.setControls = function() {
	var unreadAll = document.getElementById('read_all');
	var readAll = document.getElementById('unread_all');
	var delAll = document.getElementById('del_all');
	readAll.onclick = function(t){ return function(){t.setStatus('unread');  dtRSS.ComRSS.MarkAsUnReadALL (); }}(this);
	unreadAll.onclick = function(t){ return function(){t.setStatus('read'); dtRSS.ComRSS.MarkAsReadAll ();}}(this);
	delAll.onclick = function(t){ return function(){if(t.messages.length>0) t.showMessage(RSS.LocaleStrongs.IDS_RSS_DELETE_ALL_TITLE, RSS.LocaleStrongs.IDS_RSS_DELETE_ALL_CONFIRMATION);}}(this);
}
dtRSS.prototype.setMessageTitle = function(title) {
	this.messageTitle = title;
}
dtRSS.prototype.setMessageText = function(text) {
	this.messageText = text;
}
dtRSS.prototype.showMessage = function(title, text) {
	if(title)
		this.messageTitle = title;
	if(text)
		this.messageText = text;
	document.getElementById('small_title_text').innerHTML = this.messageTitle;
	document.getElementById('small_message_content').innerHTML = this.messageText;
	document.getElementById('message_wnd').style.display = 'block';
}
dtRSS.prototype.changeTitle = function (title) {
	this.lastTitle = d('rss_wnd_title').innerHTML;
	d('rss_wnd_title').innerHTML = title;
}

dtRSS.prototype.loaderStart = function ( ) {
	this.lastTitle = d('rss_wnd_title').innerHTML;
d('rss_wnd_title').innerHTML = this.LoaderText;
}

dtRSS.prototype.dtLoaderStop = function () {
d('rss_wnd_title').innerHTML = this.lastTitle;
}
RSS = new dtRSS('rss_content');

