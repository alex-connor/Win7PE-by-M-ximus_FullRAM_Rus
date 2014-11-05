/* ***** BEGIN LICENSE BLOCK *****
 *   Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 * 
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Tab Popup.
 *
 * The Initial Developer of the Original Code is
 * Adarsh TP.
 * Portions created by the Initial Developer are Copyright (C) 2008
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 * 
 * ***** END LICENSE BLOCK ***** */
var tabpopup = {
  ScrollingPreview: 0,
  SizePreview: 2,
  PreviewPercent: 40,
  PreviewPixel: 200,
  PreviewDelay: 200,
  PreviewColor: '#afd6ea',
  DelayPreview: false,
  charCount: 55,
  _branch: null,
  onLoad: function() {
	var container = gBrowser.tabContainer;
    container.addEventListener("mousemove", this.mouseMove, false);
    container.addEventListener("mouseout", this.hidePreview, false);
    container.addEventListener("mousedown", this.hidePreview, false);
    window.addEventListener("unload", this.onUnload, false);
	var def = document.getAnonymousElementByAttribute(getBrowser(), 'class', 'tabbrowser-strip');
    if(def)
      def.tooltip = "";
    // check our prefs, and register observers
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefService);
	this._branch = prefs.getBranch("extensions.tabpopup.");
	this._branch.QueryInterface(Components.interfaces.nsIPrefBranch2);

    if (this._branch.getPrefType("tabpopup.SizePreview") == this._branch.PREF_INT)
      tabpopup.SizePreview = this.getIntPref(this._branch, "tabpopup.SizePreview");
    
    if (this._branch.getPrefType("tabpopup.PreviewPercent") == this._branch.PREF_INT)
      tabpopup.PreviewPercent = this.getIntPref(this._branch, "tabpopup.PreviewPercent");
    
    if (this._branch.getPrefType("tabpopup.PreviewPixel") == this._branch.PREF_INT)
      tabpopup.PreviewPixel = this.getIntPref(this._branch, "tabpopup.PreviewPixel");
    
    if (this._branch.getPrefType("tabpopup.DelayPreview") == this._branch.PREF_BOOL)
      tabpopup.DelayPreview = this.getBoolPref(this._branch, "tabpopup.DelayPreview");
    
    if (this._branch.getPrefType("tabpopup.PreviewDelay") == this._branch.PREF_INT)
      tabpopup.PreviewDelay = this.getIntPref(this._branch, "tabpopup.PreviewDelay");

    if (this._branch.getPrefType("tabpopup.PreviewColor") == this._branch.PREF_STRING)
      tabpopup.PreviewColor = this.getCharPref(this._branch, "tabpopup.PreviewColor");

	this._branch.addObserver("tabpopup.SizePreview", tabpopup, false);
    this._branch.addObserver("tabpopup.PreviewPercent", tabpopup, false);
    this._branch.addObserver("tabpopup.PreviewPixel", tabpopup, false);
    this._branch.addObserver("tabpopup.DelayPreview", tabpopup, false);
    this._branch.addObserver("tabpopup.PreviewDelay", tabpopup, false);
    this._branch.addObserver("tabpopup.PreviewColor", tabpopup, false);
  },
  onUnload: function() {
    this.currentTab = null;
    var b = getBrowser();
    b.tabContainer.removeEventListener("mousemove", this.mouseMove, false);
    b.tabContainer.removeEventListener("mouseout", this.hidePreview, false);
    b.tabContainer.removeEventListener("mousedown", this.hidePreview, false);
    
    // remove pref observers
	if (!this._branch) return;
    this._branch.removeObserver("tabpopup.SizePreview", tabpopup, false);
    this._branch.removeObserver("tabpopup.PreviewPercent", tabpopup, false);
    this._branch.removeObserver("tabpopup.PreviewPixel", tabpopup, false);
    this._branch.removeObserver("tabpopup.PreviewDelay", tabpopup, false);
	this._branch.removeObserver("tabpopup.PreviewColor", tabpopup, false);
  },
   // pref branch observers
  observe: function(subject, topic, data) {
	if(topic != "nsPref:changed") return;

    if(data == "tabpopup.SizePreview") {
      tabpopup.SizePreview = this.getIntPref(this._branch, "tabpopup.SizePreview");
    }
    if(data == "tabpopup.PreviewPercent") {
      tabpopup.PreviewPercent = this.getIntPref(this._branch, "tabpopup.PreviewPercent");
    }
    if(data == "tabpopup.PreviewPixel") {
      tabpopup.PreviewPixel = this.getIntPref(this._branch, "tabpopup.PreviewPixel");
    }
    if(data == "tabpopup.DelayPreview") {
      tabpopup.DelayPreview = this.getBoolPref(this._branch, "tabpopup.DelayPreview");
    }
    if(data == "tabpopup.PreviewDelay") {
      tabpopup.PreviewDelay = this.getIntPref(this._branch, "tabpopup.PreviewDelay");
    }
    if(data == "tabpopup.PreviewColor") {
      tabpopup.PreviewColor = this.getCharPref(this._branch, "tabpopup.PreviewColor");
    }
  },
  getBoolPref : function(pb, p)
  {
    try {
      return pb.getBoolPref(p);
    }
    catch(ex) { dump(ex + "\n"); }
    return false;
  },

  getIntPref : function(pb, p)
  {
    try {
      return pb.getIntPref(p);
    }
    catch(ex) { dump(ex + "\n"); }
    return false;
  },

  getCharPref : function(pb, p)
  {
    try {
      return pb.getCharPref(p);
    }
    catch(ex) { dump(ex + "\n"); }
    return false;
  },
  mouseMove: function(e) {
        if(e.target instanceof XULElement && e.target.localName == "tab") {
          var b = getBrowser();
          var tp = document.getElementById("tabpreview");
          if(e.target != tabpopup.currentTab) {
            tabpopup.currentTab = e.target;
            // don't show preview for the current tab
            if(tabpopup.currentTab == b.selectedTab) {
              tp.hidePopup();
            }
            else {
              // if user has set preference to delay preview display
              if (tabpopup.DelayPreview) {
                if (tabpopup.PreviewTimeout)
                  clearTimeout(tabpopup.PreviewTimeout);
                tabpopup.PreviewTimeout = setTimeout(tabpopup.showPreview, tabpopup.PreviewDelay);
              }
              else
                tabpopup.showPreview();
            }
          }
        }
        else {
          // not over a tab
          tabpopup.currentTab = null;
          document.getElementById("tabpreview").hidePopup();
        }
  },
  showPreview: function(e) {
		var b = getBrowser();
		var tp = document.getElementById("tabpreview");
		var win = b.getBrowserForTab(tabpopup.currentTab).contentWindow;
		var size = tabpopup.getPreviewSize(tabpopup.currentTab, win);
		// draw preview
		tabpopup.updatePreview(win, size);
		var xPos = tabpopup.currentTab.boxObject.screenX;
		var yPos = tabpopup.currentTab.boxObject.screenY;
		tp.showPopup(tabpopup.currentTab, xPos, yPos, "tooltip");
  },
  hidePreview: function(e) {
    //if there's a timer set to show the preview, clear the timer
    if (tabpopup.PreviewTimeout)
      clearTimeout(tabpopup.PreviewTimeout);
      
    tabpopup.currentTab = null;
    document.getElementById("tabpreview").hidePopup();
  },

  updatePreview: function(win, size) {
    var w = win.innerWidth;
    var h = win.innerHeight;
    var canvas = document.getElementById("tabpreviewcanvas");
    var canvasW = size.w;
    var canvasH = size.h - 5;
    
    // set the preview initially for top left
    var xScroll = 0;
    var yScroll = 0;
    var fudge = 0;
    
    // if user has set preference for scrolled preview, get the scrolled position
    if (tabpopup.ScrollingPreview == 1) {
      xScroll = win.scrollX;
      yScroll = win.scrollY;
    }
    else {
      fudge = win.scrollMaxY;
    }
    
    canvas.style.width = canvasW+"px";
    canvas.style.height = canvasH+"px";
    canvas.width = canvasW;
    canvas.height = canvasH;
    try {
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvasW, canvasH);
      ctx.save();
	  ctx.scale(canvasW/w, canvasH/h);
	  ctx.drawWindow(win, xScroll, yScroll, w, h+fudge, "rgb(255,255,255)");
      ctx.restore();
	  var MiniwindowTitle = document.getElementById("MiniTitle");
      var MiniUrlData = document.getElementById("MiniUrlData");
      var innerPopWindow = document.getElementById("innerPopWindow");
	  var bgColorVal = tabpopup.getPreviewColor(tabpopup.currentTab, win);

	  MiniwindowTitle.style.backgroundColor=bgColorVal;
	  MiniUrlData.style.backgroundColor=bgColorVal;
	  innerPopWindow.style.border = "thin solid "+bgColorVal;

	  var miniTitle = win.document.title;
	  var miniLocation = win.location;
	  miniLocation = miniLocation.toString()
	  if(miniTitle.length > tabpopup.charCount){
		  miniTitle = miniTitle.substr(0,tabpopup.charCount);
		  miniTitle += '...';
	  }
	  if(miniLocation.length > tabpopup.charCount){
		  miniLocation = miniLocation.substr(0,tabpopup.charCount);
		  miniLocation += '...';
	  }
	  MiniwindowTitle.value = miniTitle;
	  MiniUrlData.value = miniLocation;
    }
    catch(e) { dump('Error: ' + e.message + '\n'); }
  },
  getPreviewColor: function(tab, win) {
	if(tabpopup.PreviewColor)
		return tabpopup.PreviewColor;
	return '#afd6ea';
  },
  getPreviewSize: function(tab, win) {
    var scale, useHeight;
    var useWidth = 0;
    
    if(tabpopup.SizePreview == 1) {
      // for some reason boxObject.width doesn't agree with
      // the real width.  get the computed style value instead.
      useWidth = document.defaultView.getComputedStyle(tab, "width")
        .width.replace(/px$/, '');
    }
    // if user has set preference for preview size to percent of browser
    else if(tabpopup.SizePreview == 2) {
      useWidth  = Math.floor(window.innerWidth * tabpopup.PreviewPercent/100);
    }
    // if user has set preference for preview size exact pixel
    else if(tabpopup.SizePreview == 3) {
      useWidth  = tabpopup.PreviewPixel;
    }
    // for some reason, the popup won't get bigger than 440px wide
    useWidth  = Math.min(useWidth, 440);
    
    scale = win.innerHeight / win.innerWidth;
    useHeight = useWidth * scale;
    return { w: useWidth, h: useHeight };
  }
};
window.addEventListener("load", function(e) { tabpopup.onLoad(e); }, false);