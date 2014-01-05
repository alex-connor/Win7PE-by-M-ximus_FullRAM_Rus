(function(){
var
Cc = Components.classes,
Ci = Components.interfaces,
Cu = Components.utils,
kXULNS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
DNSSVC = Cc["@mozilla.org/network/dns-service;1"].getService(Ci.nsIDNSService),
mainThread = Cc["@mozilla.org/thread-manager;1"].getService().mainThread,
log = function(o) Cc["@mozilla.org/consoleservice;1"].getService(Ci.nsIConsoleService).logStringMessage(o+''),
error = function(o) Cu.reportError(o+'');

var emptyFn = function(){}

function checkHostname(hostName, callbackIfExists) {
  DNSSVC.asyncResolve(hostName, 0, {
    onLookupComplete: function (request, record, status) {
      log("dns query resolved?" + status);
    }
  }, mainThread);
}

var O = window.Omnibar = {
  _imageElBox: null,
  _imageEl: null,
  _urlbar: null,
  _rlPopup: null,
  _prefs: null,
  _init: function() {
    // cache elements
    O._rlPopup = document.getElementById("PopupAutoCompleteRichResult");
    var textbox = O._urlbar = document.getElementById("urlbar");
    O._imageElBox = document.getElementById("omnibar-defaultEngineBox");
    O._imageEl = document.getElementById("omnibar-defaultEngine");

    // cache services..
    O._prefSvc = Cc["@mozilla.org/preferences-service;1"]
                    .getService(Ci.nsIPrefService);
    
    O._prefs = O._prefSvc.getBranch("extensions.omnibar.");
    O._prefs.QueryInterface(Ci.nsIPrefBranch2).addObserver("", O, false);
    O._ss = Cc['@mozilla.org/browser/search-service;1']
               .getService(Ci.nsIBrowserSearchService);
    
    var localeService = Cc["@mozilla.org/intl/nslocaleservice;1"]
                        .getService(Ci.nsILocaleService);
    var stringBundleService = Cc["@mozilla.org/intl/stringbundle;1"]
                              .getService(Ci.nsIStringBundleService);
    O._sb = stringBundleService.createBundle(
                "chrome://omnibar/locale/strings.properties",
                localeService.getApplicationLocale());

    // do other init related stuff
    if(!(O._defaultAutocompletesearch)) {
      O._defaultAutocompletesearch = textbox.getAttribute('autocompletesearch');
    }
    
    textbox.addEventListener("keydown", function(e) {
      if(e.ctrlKey) {
        switch (e.keyCode) {
          case e.DOM_VK_DOWN:
            O.changeEngine(1);
            e.preventDefault();
            break;
          case e.DOM_VK_UP:
            O.changeEngine(-1);
            e.preventDefault();
            break;
          default:
            break;
        }
      }
    }, false)
    textbox.addEventListener("DOMMouseScroll", function(e) {
      if(e.ctrlKey) {
        O.changeEngine(e.detail > 0 ? 1 : -1);
        e.preventDefault();
      }
    }, false)
    O._originalOnTextEnetered = O._urlbar.getAttribute("ontextentered");

    // add itself as an observer
    var os = Cc["@mozilla.org/observer-service;1"]
             .getService(Ci.nsIObserverService);
    os.addObserver(O, "browser-search-engine-modified", false);

    if (window.onViewToolbarsPopupShowing) {
      window.intercepted_onViewToolbarsPopupShowing = window.onViewToolbarsPopupShowing;
      window.onViewToolbarsPopupShowing = function(event) {
        O.onToolbarPopupShowing(event);
      };
    }

    if (window.openUILink) {
      window.intercepted_openUILink = window.openUILink;
      window.openUILink = function(url, e, ignoreButton, ignoreAlt, allowKeywordFixup, postData, referrerUrl) {
        if(!O.handleSearchQuery(url, e)) {
          var where = whereToOpenLink(e, ignoreButton, ignoreAlt);
          openUILinkIn(url, where, allowKeywordFixup, postData, referrerUrl);
        }
      };
    }
  
    // Need overrides for browser search to work even after search bar is hidden
    var BS = window.BrowserSearch;
    if(BS && BS.addEngine) {
      BS.addEngine_backup = BS.addEngine||emptyFn;
      BS.addEngine = function(engine, targetDoc) {
            var browser = gBrowser.getBrowserForDocument(targetDoc);
            // ignore search engines from subframes (see bug 479408)
            if (!browser)
              return;
        
            // Check to see whether we've already added an engine with this title
            if (browser.engines) {
              if (browser.engines.some(function (e) e.title == engine.title))
                return;
            }
        
            // Append the URI and an appropriate title to the browser data.
            // Use documentURIObject in the check for shouldLoadFavIcon so that we
            // do the right thing with about:-style error pages.  Bug 453442
            var iconURL = null;
            if (gBrowser.shouldLoadFavIcon(targetDoc.documentURIObject))
              iconURL = targetDoc.documentURIObject.prePath + "/favicon.ico";
        
            var hidden = false;
            // If this engine (identified by title) is already in the list, add it
            // to the list of hidden engines rather than to the main list.
            // XXX This will need to be changed when engines are identified by URL;
            // see bug 335102.
            var searchService = Cc["@mozilla.org/browser/search-service;1"].
                                getService(Ci.nsIBrowserSearchService);
            if (searchService.getEngineByName(engine.title))
              hidden = true;
        
            var engines = (hidden ? browser.hiddenEngines : browser.engines) || [];
        
            engines.push({ uri: engine.href,
                           title: engine.title,
                           icon: iconURL });

        if (hidden)
          browser.hiddenEngines = engines;
        else {
          browser.engines = engines;
          if (browser == gBrowser.mCurrentBrowser) {
            BS.updateSearchButton();
          }
        }
      }
      
      BS.updateSearchButton_backup = BS.updateSearchButton||emptyFn;
      BS.updateSearchButton = function() {
        if(BS.searchBar) {
          BS.updateSearchButton_backup();
        }
        var engines = gBrowser.mCurrentBrowser.engines,
            box = document.getElementById("omnibar-in-urlbar");
        if (engines && engines.length > 0) {
          box.setAttribute("addengines", "true");
        } else {
          box.removeAttribute("addengines");
        }
      }
      
      BS.loadSearch_backup = BS.loadSearch||emptyFn;
      BS.loadSearch = function(searchText, useNewTab) {
        var ss = Cc["@mozilla.org/browser/search-service;1"].
                 getService(Ci.nsIBrowserSearchService);
        var engine = ss.currentEngine;
        var submission = engine.getSubmission(searchText, null); // HTML response
        if (!submission)
          return;
        if (useNewTab) {
          gBrowser.loadOneTab(submission.uri.spec, null, null,
                              submission.postData, null, false);
        } else
          loadURI(submission.uri.spec, null, submission.postData, false);
      }
      
      //nsContextMenu.js
      nsContextMenu.prototype.isTextSelection = function() {
        var selectedText = getBrowserSelection(16);
        if (!selectedText)
          return false;
    
        if (selectedText.length > 15)
          selectedText = selectedText.substr(0,15) + this.ellipsis;
    
        var ss = Cc["@mozilla.org/browser/search-service;1"].
                 getService(Ci.nsIBrowserSearchService);
        var engineName = ss.currentEngine.name;
        
        var menuLabel = gNavigatorBundle.getFormattedString("contextMenuSearchText",
                                                            [engineName,
                                                             selectedText]);
        document.getElementById("context-searchselect").label = menuLabel;
        try{
          document.getElementById("context-searchselect").accessKey =
                   gNavigatorBundle.getString("contextMenuSearchText.accesskey"); 
        }catch(e){/*works only in 3.5+ versions*/}
        return true;
      }
      
      BS.webSearch = O.BS_webSearch;
      
    }
    
    if("organizeSE" in window) {
      O.OSE.init();
    }
    
    O.applyPrefs();
  },
  OSE: {
    init: function() {
      var e = document.getElementById('omnibar-osemenu');
      e.setAttribute("ref", "urn:organize-search-engines:root");
      e.setAttribute("datasources", "rdf:organized-internet-search-engines");
      e.setAttribute("template", "searchbar-template");
      e.setAttribute("sortDirection", "natural");
      e.setAttribute("sortResource", "urn:organize-search-engines#Name");
      e.builder.rebuild();
      
      var exts = {};
      exts.omnibar = {
        check: true,
        sortDirectionHandler: function sortDirectionHandler(newVal) {
          e.setAttribute("sortDirection", newVal);
        },
        wait: 0,
        init: function() {
          var e = document.getElementById('omnibar-osemenu');
          e.addEventListener("popupshowing", this.onPopupShowing, true);
          e.addEventListener("command", this.onCommand, true);
        },
        onCommand: function(e) {
          var target = e.originalTarget, engine;
          if(organizeSE.hasClass(target, "openintabs-item")) {
            var folder = target.parentNode.parentNode.id;
            folder = Cc["@mozilla.org/rdf/rdf-service;1"].getService(Ci.nsIRDFService)
                       .GetResource(folder);
            O._ss.currentEngine = organizeSE.SEOrganizer.folderToEngine(folder);
          } else if(target.engine) {
            O._ss.currentEngine = target.engine;
          } else if(organizeSE.hasClass(target, "searchbar-engine-menuitem") ||
                    organizeSE.hasClass(target, "addengine-item")) {
            O._ss.currentEngine = organizeSE.SEOrganizer.getEngineByName(target.label);
          }
        },
        onPopupHidden: function(e) {
        },
        onPopupShowing: function(e) {
          if(e.target.parentNode == e.currentTarget) {
            e.target.id = "omnibar-osemenu";
          } else {
            organizeSE.removeOpenInTabsItems(e.target);
            //organizeSE.insertOpenInTabsItems(e.target); // not supported
          }
          e.stopPropagation();
        }
      };
      
      var initStr = organizeSE__Extensions.prototype.init.toString();
      initStr = initStr.replace(/this\)/,'exts)');
      eval('var initFn = ' + initStr);
      initFn();
    }
  },
  webSearch: function() {
    var BS = BrowserSearch,
        sb = BS.searchBar || (BS.getSearchBar ? BS.getSearchBar() : null);
    if(sb && isElementVisible(sb)) BS.webSearch();
    else openLocation();
  },
  BS_webSearch: function() {
    if (window.fullScreen)
      FullScreen.mouseoverToggle(true);

    var searchBar = BrowserSearch.searchBar;
    if (isElementVisible(searchBar)) {
      searchBar.select();
      searchBar.focus();
    } else openLocation();
  },
  observe: function(aEngine, aTopic, aVerb) {
    O.applyPrefs();
  },
  _recheck: function() {
    // check we still have the auto-complete options setup.
    if(O._urlbar.getAttribute("autocompletesearch").indexOf("omnibar-") < 0) {
      O._defaultAutocompletesearch = textbox.getAttribute('autocompletesearch');
      O.enableSearchAutocomplete();
    }
  },
  /**
   * adds options to urlbar for omni-bar autocompletes.
   */
  enableSearchAutocomplete: function() {
    var textbox = O._urlbar;
    var autocompletesearch = O._defaultAutocompletesearch.replace("history", "") + " omnibar-allinone";
    textbox.setAttribute('autocompletesearch', autocompletesearch);
  },
  get engines() {
    var engines = [];
    O._ss.getEngines({}, []).forEach(function(e){
      if(e.hidden !== true) {
        engines.push(e);
      }
    });
    return engines;
  },
  changeEngine: function(by) {
    var ss = O._ss;
    var engines = O.engines;
    // TODO probably this does not work in a few cases. it would bbe prudent to
    // calculate the index manually
    //var idxCurr = engines.indexOf(ss.currentEngine);
    var idxCurr = O.getEngineIndex(ss.currentEngine, engines);
    if(idxCurr < 0) {
      log("could not determine current engine's index!");
    }
    var newIdx = idxCurr + by;
    if(newIdx >= 0 &&  newIdx < engines.length) {
      ss.currentEngine = engines[newIdx];
      O.setEngineIcon();
    }
  },
  getEngineIndex: function(aEngine, allEngines) {
    for(var i = 0; i < allEngines.length; i ++) {
      if(allEngines[i].name == aEngine.name) {
      return i;
      }
    }
    return -1;
  },
  setEngineIcon: function() {
    var ss = O._ss;
    var engine = ss.currentEngine;
    var iconURI = engine.iconURI;
    if(iconURI) {
      O._imageEl.setAttribute("src", iconURI.spec);
    } else {
      // if none is found, use the default magnifier icon
      O._imageEl.setAttribute("src", "");
    }
    O._imageEl.setAttribute("tooltiptext",
                               O._sb.GetStringFromName("TIP.Search") +
                               " " + engine.name + "\n\n" +
                               O._sb.GetStringFromName("TIP.OmnibarIcon"));
    document.getElementById("omnibar-defaultEngineName").value = engine.name;
  },
  applyPrefs: function() {
    var prefSvc = O._prefSvc;
    var prefs = O._prefs;
    O._urlbar.setAttribute("ontextentered", "Omnibar._handleURLBarCommand(param);");
    O.setEngineIcon();
    O.enableSearchAutocomplete();
    var textbox = O._urlbar, prefs = O._prefs;
    textbox.setAttribute("maxrows", prefs.getIntPref("numresults")+"");
    prefSvc.setIntPref("browser.urlbar.maxRichResults",
                       Math.max(prefs.getIntPref('numresults'), prefSvc.getIntPref('browser.urlbar.maxRichResults')));


    var rlcls = O._rlPopup.getAttribute("class"),
        rlcls_slim,
        CLS = "omnibar-style-slim";
    rlcls = rlcls.replace(CLS, "");
    rlcls_slim = [rlcls, CLS].join(" ");

    var popupStyle = prefs.getCharPref("popupstyle");
    // reset style
    textbox.setAttribute("autocompletepopup", "PopupAutoCompleteRichResult");
    O._rlPopup.setAttribute("class", rlcls);
    // apply style
    switch(popupStyle) {
      case "SIMPLE":
        textbox.setAttribute("autocompletepopup", "PopupAutoComplete");
        break;
      case "RICHSLIM":
        O._rlPopup.setAttribute("class", rlcls_slim);
        break;
    }
    
    document.getElementById("omnibar-in-urlbar").
    setAttribute("autohide", prefs.getBoolPref("autohideinurlbar") ? "yes" : "no");
    document.getElementById("omnibar-in-urlbar").
    setAttribute("showinurlbar", prefs.getBoolPref("showinurlbar") ? "yes" : "no");
    document.getElementById("omnibar-defaultEngineName").
    setAttribute("hide", prefs.getBoolPref("hideenginename") ? "yes" : "no");
    document.getElementById("omnibar-defaultEngine").
    setAttribute("hide", prefs.getBoolPref("hideengineicon") ? "yes" : "no");
    if(BrowserSearch.searchBar) {
      var tbItem = document.getElementById('search-container');
      if(prefs.getBoolPref("hidesearchbar")) {
        tbItem.setAttribute('class', tbItem.getAttribute('class') + ' om-hidden');
      } else {
        tbItem.setAttribute('class', tbItem.getAttribute('class').replace(' om-hidden', ''));
      }
    }
  },
  _handleURLBarCommand: function(event) {
    if(event instanceof KeyEvent) {
      if(event.ctrlKey || event.shiftKey || event.metaKey) {
        O.handleOriginalUrlbarCommand(event);
        return;
      }
    }
    if(!O.handleSearchQuery(O._urlbar.value, event)) {
    // no search was performed. go ahead with default handling
      O.handleOriginalUrlbarCommand(event);
    }
  },
  handleSearchQuery: function(url, event) {
    try {
      var utils = Cc['@ajitk.com/omnibar/queryparser;1']
                            .getService().wrappedJSObject;
      var kwdInfo = utils.getKeywordInfo(url.split(' ')[0]);
      // a keyword was found leave it to default handling
      // XXX should we check for %s in keyword spec?
      if(kwdInfo) return false;
      var query = utils.parseQuery(url);
      if(query.length > 0 && query[1] && query[1].length > 0) {
        var search_str = query[0];
        var ngins = query[1];
        
        // check where to open the first tab
        var openintab = (event && event.altKey);
        if(!openintab && O._prefSvc.getBoolPref("browser.search.openintab")) {
          var currentBrowser = gBrowser.getBrowserForTab(gBrowser.selectedTab);
          openintab = currentBrowser.currentURI.spec != "about:blank";
        }
        
        // checkHostname()  // TODO
        // open the first tab according to user's current behavior. e.g.
        // alt+enter should open things in new tab.
        var firstEngine = ngins.shift();
        var submission = firstEngine.getSubmission(search_str, null);
        
        if(openintab) {
            gBrowser.loadOneTab(submission.uri.spec, null, null,
                                submission.postData, false, true);
            event.preventDefault();
            event.stopPropagation();
        } else {
            openUILinkIn(submission.uri.spec,
                       whereToOpenLink(event),
                       null,
                       submission.postData);
        }
        
        ngins.forEach(function(e, i, arrey) {
          var submission = e.getSubmission(search_str, null);
          openUILinkIn(submission.uri.spec,
                     "tabshifted",
                     null,
                     submission.postData);
        });
        if(ngins.length >= 1) {
          var prefSvc = Cc["@mozilla.org/preferences-service;1"].
                        getService(Ci.nsIPrefService);
          var branch = prefSvc.getBranch("extensions.omnibar.");
          var names = firstEngine.name;
          ngins.forEach(function(n){
            names += "," + n.name
          });
          branch.setCharPref("multiengines", names);
        }
        // everything finished as expected. return now.
        return true;
      }
    }catch(e){
      log(e);
    }
    return false;
  },
  handleOriginalUrlbarCommand: function(e) {
    if(typeof handleURLBarCommand == "function") {
      handleURLBarCommand(e);
    } else {
      // ff 3.1+
      var fn = new Function('event', 'param', O._originalOnTextEnetered);
      fn.call(O._urlbar, e, e);
    }
  },
  onButtonClick: function (event) {
    if(event.button == 0) {
      document.getElementById('omnibar-engine-menu').openPopup(O._imageElBox, "after_end", -1, -1);
			event.preventDefault();
			event.stopPropagation();
    }
  },
  onContextPopupShowing: function(event) {try{
    var popup = document.getElementById("omnibar-engine-menu");
    document.getElementById("omnibar-context-menuitem-suggestenabled")
    .setAttribute("checked", O._prefSvc.getBoolPref("browser.search.suggest.enabled"));
    
    
    if('organizeSE' in window) {
      document.getElementById('omnibar-osemenu').removeAttribute('hidden');
    } else {
      // reference browser/search/search.xml
      // Clear the popup, down to the first separator
      while (popup.firstChild &&
         popup.firstChild.className != "engines-separator") {
        popup.removeChild(popup.firstChild);
      }

      var ss = O._ss;
      var currentEngine = ss.currentEngine;
      var engines = O.engines;
      for (var i = engines.length - 1; i >= 0; --i) {
        var menuitem = document.createElementNS(kXULNS, "menuitem");
        var name = engines[i].name;
        menuitem.setAttribute("label", name);
        menuitem.setAttribute("id", name);
        menuitem.setAttribute("class", "menuitem-iconic omnibar-engine-menuitem");
        if (engines[i] == currentEngine) {
          menuitem.setAttribute("selected", "true");
        }
        if (engines[i].iconURI) {
          menuitem.setAttribute("src", engines[i].iconURI.spec);
        }
        popup.insertBefore(menuitem, popup.firstChild);
        menuitem.engine = engines[i];
      }
    }
    
    var items = popup.childNodes;
    for (var i = items.length - 1; i >= 0; i--) {
      if (items[i].getAttribute("class").indexOf("addengine-") != -1)
        popup.removeChild(items[i]);
    }

    // Add engines.
    var addengines = gBrowser.mCurrentBrowser.engines;
    if (addengines && addengines.length > 0) {
      // Find the (first) separator in the remaining menu, or the first item
      // if no separators are present.
      var insertLocation = popup.firstChild;
      while (insertLocation.nextSibling &&
             insertLocation.localName != "menuseparator") {
        insertLocation = insertLocation.nextSibling;
      }
      if (insertLocation.localName != "menuseparator")
        insertLocation = popup.firstChild;
      
      var separator = document.createElementNS(kXULNS, "menuseparator");
      separator.setAttribute("class", "addengine-separator");
      popup.insertBefore(separator, insertLocation);
      
      // add new engines
      for (var i = 0; i < addengines.length; i++) {
        var menuitem = document.createElementNS(kXULNS, "menuitem");
        var engineInfo = addengines[i];
        var labelStr = 'Add "' + engineInfo.title + '"';
        menuitem = document.createElementNS(kXULNS, "menuitem");
        menuitem.setAttribute("class", "menuitem-iconic addengine-item");
        menuitem.setAttribute("label", labelStr);
        menuitem.setAttribute("tooltiptext", engineInfo.uri);
        menuitem.setAttribute("uri", engineInfo.uri);
        if(engineInfo.icon) menuitem.setAttribute("src", engineInfo.icon);
        menuitem.setAttribute("title", engineInfo.title);
        popup.insertBefore(menuitem, insertLocation);
      }
    }
  }catch(e){alert(e)}},
  onContextMenuClick: function(event) {
    var prefs = O._prefSvc;
    var item = event.originalTarget;
    var cls = item.getAttribute("class");
    if(cls.indexOf("addengine-item") >= 0) {
      var type = Ci.nsISearchEngine.DATA_XML;
      O._ss.addEngine(item.getAttribute("uri"), type,
                         item.getAttribute("src"), false);
    gBrowser.mCurrentBrowser.engines = [];
    } else if(cls.indexOf("engine-menuitem") >= 0) {
      if(item.engine) {
        O._ss.currentEngine = item.engine;
      }
    } else if(cls.indexOf("suggest-option") >= 0) {
      prefs.setBoolPref("browser.search.suggest.enabled",
                        !prefs.getBoolPref("browser.search.suggest.enabled"));
    }
    O.applyPrefs();
  },
  openSearchEngineEditor: function() {
    var wm = Cc["@mozilla.org/appshell/window-mediator;1"]
                .getService(Ci.nsIWindowMediator);

    var window = wm.getMostRecentWindow("Browser:SearchManager");
    if (window) {
      window.focus();
    } else {
      setTimeout(function () {
        openDialog("chrome://browser/content/search/engineManager.xul",
                   "_blank", "chrome,dialog,modal,centerscreen");
      }, 0);
    }
  },
  onToolbarPopupShowing: function(event) {
    window.intercepted_onViewToolbarsPopupShowing(event);
    try{
      if(!O._toolbarPopupItem) {
        var menuItem = O._toolbarPopupItem = document.createElement("menuitem");
        menuItem.setAttribute("type", "checkbox");
        menuItem.setAttribute("label", O._sb.GetStringFromName("ShowInUrlbar"));
        menuItem.setAttribute("accesskey", "O");
        menuItem.setAttribute("command", "cmd_toggleOmnibarIcon");
        var popup = event.target;
        var separator = popup.getElementsByTagName("menuseparator")[0];
        popup.insertBefore(menuItem, separator);
      }
      O._toolbarPopupItem.setAttribute("checked", O._prefs.getBoolPref("showinurlbar"));
    }catch(e){log(e);}
  },
  toggleOmnibarDisplay: function() {
    var prefs = O._prefs;
    prefs.setBoolPref("showinurlbar", !prefs.getBoolPref("showinurlbar"));
  }
};

window.addEventListener(
  "load",
  function () {
    try {
      O._init();
    } catch (e) {
      log(e);
    }
    setTimeout(function() {
      // another call to check setup
      O._recheck();
    }, 200);
    window.removeEventListener('load', arguments.callee, false);
  },
  false
);
})();
