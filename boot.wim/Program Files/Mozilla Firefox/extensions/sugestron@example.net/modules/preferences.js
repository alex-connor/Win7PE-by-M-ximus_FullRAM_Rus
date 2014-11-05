var EXPORTED_SYMBOLS = ["SUGESTRON_PREFERENCES"];

SUGESTRON_PREFERENCES = function(SUGESTRON) {
	//save homepage so we can set it back in case the homepage is set to the speed dial
	var saveHomepage = function(){
		var homepage = prefsBrowser.getCharPref("homepage");
                if (homepage != SUGESTRON.speedDialXUL){
			//check if homepage is composed by several sites separated by pipe (|)
			if (homepage.indexOf(SUGESTRON.speedDialXUL) >= 0 && homepage.indexOf('|') >= 0){
				var sites = homepage.split('|');
				var sitesFiltered = new Array()
				for (var i = 0; i < sites.length; i++){
					if (sites[i] != SUGESTRON.speedDialXUL)
						sitesFiltered.push(sites[i]);
				}	
				homepage = "";
				for (var i = 0; i < sitesFiltered.length; i++){
					homepage += sitesFiltered[i];
					if (i < sitesFiltered.length - 1){
						homepage += "|";
					}
				}
			}

                	//save the home page URL
                        SUGESTRON.homepage = homepage;
                       	prefs.setCharPref("homepage", homepage);
                }
	}

	var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                        .getService(Components.interfaces.nsIPrefService)
                        .getBranch("extensions.sugestron.");
	prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);

	//get home page preferences config
        var prefsBrowser = Components.classes["@mozilla.org/preferences-service;1"]
                        .getService(Components.interfaces.nsIPrefService)
                        .getBranch("browser.startup.");
        prefsBrowser.QueryInterface(Components.interfaces.nsIPrefBranch2);

	return {
		init: function(){
        		SUGESTRON.numberDials = prefs.getIntPref("numberDials");
        		SUGESTRON.thumbnailWidth = prefs.getIntPref("thumbnailWidth");
        		SUGESTRON.thumbnailHeight = prefs.getIntPref("thumbnailHeight");
        		SUGESTRON.urlsToTrack = prefs.getIntPref("urlsToTrack");
        		SUGESTRON.timeToExpireUrl = prefs.getIntPref("timeToExpireUrl");
			SUGESTRON.intervalToCheckExpiredVisits = prefs.getIntPref("intervalToCheckExpiredVisits");

			saveHomepage();

                	//track changes to the homepage config
			var observerHomepage = {
                                observe: function (aSubject, aTopic, aData){
                                        if(aTopic != "nsPref:changed" || aData != "homepage") return;
                                        saveHomepage();
                                }
                        };
                	prefsBrowser.addObserver("", observerHomepage, false);


			var obsService = Components.classes["@mozilla.org/observer-service;1"]
                           	.getService(Components.interfaces.nsIObserverService);

			//track if the extension is being disabled or uninstalled
			var observerDisabled = {
				observe: function (aSubject, aTopic, aData) {
					aSubject.QueryInterface(Components.interfaces.nsIUpdateItem);
					if (aSubject.id == "sugestron@example.net"){
						if (aData == "item-disabled" || aData == "item-uninstalled")
							SUGESTRON.disabled = true;
						else if (aData == "item-enabled" || aData == "item-installed" || aData == "item-cancel-action")
							SUGESTRON.disabled = false;
					}
				}
			};
			obsService.addObserver(observerDisabled, "em-action-requested", false);

			//track shutdown so we can restore the homepage in case the extension has been disabled
			var observerShutdown = {
				observe: function(aSubject, aTopic, aData){
					if (SUGESTRON.disabled){
						var homepage = prefsBrowser.getCharPref("homepage");

						//test if homepage contains the speed dial
						if (homepage.indexOf(SUGESTRON.speedDialXUL) >= 0){
							//check if one of the sites is the speed dial
							var sites = homepage.split('|');
							var found = false;
							for (var i = 0; i < sites.length; i++)
								if (sites[i] == SUGESTRON.speedDialXUL)
									found = true;
							//if the speed dial is between the sites set the homepage to the previously value or
							//in case it's a list of sites, use the list without the speed dial
							if (found)
								prefsBrowser.setCharPref("homepage", SUGESTRON.homepage);
						}

						//close every open tab where the speed dial is open
						var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                     					.getService(Components.interfaces.nsIWindowMediator);
  						var browserEnumerator = wm.getEnumerator("navigator:browser");

  						while (browserEnumerator.hasMoreElements()) {
    							var browserWin = browserEnumerator.getNext();
    							var tabbrowser = browserWin.gBrowser;

			    				// Check each tab of this browser instance
							var tabsToClose = new Array();	
    							var numTabs = tabbrowser.browsers.length;
    							for (var index = 0; index < numTabs; index++) {
      								var currentBrowser = tabbrowser.getBrowserAtIndex(index);
      								if (currentBrowser.currentURI.spec == SUGESTRON.speedDialXUL) {
									tabsToClose.push(tabbrowser.tabContainer.childNodes[index]);
      								}
    							}
							for (var index = 0; index < tabsToClose.length; index++){
								//select the tab
								tabbrowser.selectedTab = tabsToClose[index];
                                                                tabbrowser.removeCurrentTab();
							}
  						}
						var sessionStore = Components.classes["@mozilla.org/browser/sessionstore;1"]
                    					.getService(Components.interfaces.nsISessionStore);
						sessionStore.setBrowserState(sessionStore.getBrowserState());
					}	
				}
			};
			obsService.addObserver(observerShutdown, "quit-application-requested", false);

			//clean up in case of shutdown
			var observerCleanup = {
                                observe: function(aSubject, aTopic, aData){
					prefsBrowser.removeObserver("", observerHomepage);
					obsService.removeObserver(observerDisabled, "em-action-requested");
					obsService.removeObserver(observerShutdown, "quit-application-requested");
					obsService.removeObserver(observerCleanup, "quit-application-granted");
				}
			};
			obsService.addObserver(observerCleanup, "quit-application-granted", false);
		}
	}
};

