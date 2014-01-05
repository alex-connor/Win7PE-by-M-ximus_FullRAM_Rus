
EmptyCacheButton = {
	
	init : function() {
		if (this.prefManager.getBoolPref(this.prefPrefix + 'firstRun') === true) {
			this.firstRun();
			this.prefManager.setBoolPref(this.prefPrefix + 'firstRun', false);
		}
	},
	
	firstRun : function() {
		toolbarButton = 'emptycachebutton-button';
		navBar = document.getElementById('nav-bar');
		currentSet = navBar.getAttribute('currentset');
		if (!currentSet) {
			currentSet = navBar.currentSet;
		}
		curSet = currentSet.split(',');
		if (curSet.indexOf(toolbarButton) == -1) {
			set = curSet.concat(toolbarButton);
			navBar.setAttribute("currentset", set.join(','));
			navBar.currentSet = set.join(',');
			document.persist(navBar.id, 'currentset');
			try {
				BrowserToolboxCustomizeDone(true);
			} catch (e) {}
		}
	},
	
	run : function(e) {
	
		var a = e.target.getAttribute('value');
		if (a == '') a = 'default';
		
		if (a == 'options') {
			window.openDialog('chrome://emptycachebutton/content/options.xul', null, null);
			return null;
		}
		
		if ( a == 'disk' || a == 'all' || (a == 'default' && this.prefManager.getBoolPref(this.prefPrefix + 'removeDiskCache') === true) ) {
			this.cacheService.evictEntries(Components.interfaces.nsICache.STORE_ON_DISK);
		}
		
		if ( a == 'memory' || a == 'all' || (a == 'default' && this.prefManager.getBoolPref(this.prefPrefix + 'removeMemoryCache') === true) ) {
			this.cacheService.evictEntries(Components.interfaces.nsICache.STORE_IN_MEMORY);
		}
		
		if ( a == 'offline' || a == 'all' || (a == 'default' && this.prefManager.getBoolPref(this.prefPrefix + 'removeOfflineCache') === true) ) {
			this.cacheService.evictEntries(Components.interfaces.nsICache.STORE_OFFLINE);
		}
		
		if ( a == 'favicon' || a == 'all' || (a == 'default' && this.prefManager.getBoolPref(this.prefPrefix + 'removeImageCache') === true) ) {
			if (this.ffService.version >= '18.0') {
				Components.classes["@mozilla.org/image/tools;1"]
				.getService(Components.interfaces.imgITools)
				.getImgCacheForDocument(null)
				.clearCache(false);
			} else {
				Components.classes["@mozilla.org/image/cache;1"]
				.getService(Components.interfaces.imgICache)
				.imgCacheService.clearCache(false);
			}
		}
		
		if (this.prefManager.getBoolPref(this.prefPrefix + 'showNotification') === true) {
			this.alertService.showAlertNotification(
				'chrome://emptycachebutton/skin/icon_32x32.png',
				'Success!', 'Cache has been cleared.', false, '', null, ''
			);
		}
		
		if (this.prefManager.getIntPref(this.prefPrefix + 'doAfterClear') == 2) {
			BrowserReloadSkipCache();
		} else if (this.prefManager.getIntPref(this.prefPrefix + 'doAfterClear') == 3) {
			gBrowser.reloadAllTabs();
		}
		
	},
	
	ffService : Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo),
	
	prefPrefix : 'extensions.{4cc4a13b-94a6-7568-370d-5f9de54a9c7f}.',
	
	prefManager : Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch),
	
	cacheService : Components.classes["@mozilla.org/network/cache-service;1"].getService(Components.interfaces.nsICacheService),
	
	alertService : Components.classes["@mozilla.org/alerts-service;1"].getService(Components.interfaces.nsIAlertsService)

};

window.addEventListener("load", function () { EmptyCacheButton.init(); }, false);
