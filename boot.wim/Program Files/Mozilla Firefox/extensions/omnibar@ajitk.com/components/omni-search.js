const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;
const ACR = Ci.nsIAutoCompleteResult;

//FF3 only method.
//http://developer.mozilla.org/En/How_to_Build_an_XPCOM_Component_in_Javascript
Cu.import("resource://gre/modules/XPCOMUtils.jsm");

const log = function(msg) {
  Cc["@mozilla.org/consoleservice;1"].getService(Ci.nsIConsoleService).logStringMessage('OM:'+msg);
}

const PREF_BRANCH = Cc["@mozilla.org/preferences-service;1"].
getService(Ci.nsIPrefService).getBranch("extensions.omnibar.").QueryInterface(Ci.nsIPrefBranch2);

function OmnibarSearch() {
  var localeService = Cc["@mozilla.org/intl/nslocaleservice;1"]
                      .getService(Ci.nsILocaleService);
  var stringBundleService = Cc["@mozilla.org/intl/stringbundle;1"]
                            .getService(Ci.nsIStringBundleService);
  this._sb = stringBundleService.createBundle(
              "chrome://omnibar/locale/strings.properties",
              localeService.getApplicationLocale());
};

OmnibarSearch.prototype = {
  classDescription: "omnibar search companion",
  classID:          Components.ID("{629F60A2-7C31-11DD-9566-E35956D89593}"),
  contractID:       "@mozilla.org/autocomplete/search;1?name=omnibar-search",
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIAutoCompleteSearch]),
  createNewResult: function(searchString) {
    var result = Cc['@mozilla.org/autocomplete/simple-result;1']
                  .createInstance(Ci.nsIAutoCompleteSimpleResult);
    result.setSearchString(searchString);
    result.setDefaultIndex(-1);
    result.setErrorDescription("omnibar search failure");
    result.setSearchResult(Ci.nsIAutoCompleteResult.RESULT_SUCCESS);
    return result;
  },
  startSearch: function(searchString, searchParam, previousResult, listener) {
    searchString = trim(searchString);
    var utils = new SearchUtils();
    var pref = utils._prefBranch;
    // create a simple result object
    var result = this.createNewResult(searchString);
    var kwdInfo = utils.getKeywordInfo(searchString.split(' ')[0]);
    if(kwdInfo) {
      result.appendMatch(searchString,
                 kwdInfo.title + " (keyword: " + kwdInfo.keyword + ")",
                 kwdInfo.iconURL,
                 "bookmark");
      listener.onSearchResult(this, result);
      return;
    }
    
    var showdefaultsearch = false;  //pref.getBoolPref("showdefaultsearch");
    var enabledefaultsearch = pref.getBoolPref("enabledefaultsearch");
    var query = utils.parseQuery(searchString);
    if(searchString.length > 0
       && (showdefaultsearch ||
           // show default search option for query containing @ operator
           (searchString.indexOf("@") >=0 && query[1] && query[1].length > 0) ||
           // and for query starting with search engine keyword
           query[3])) {
      var engines = query[1];
      // no engine option was found
      if(!enabledefaultsearch
         && !(engines && engines.length > 0)
         && !utils.isAProtocolOrLocation(searchString)
        ) {
        // as if user had typed in a valid query with default engine name
        var e = utils._ss.currentEngine;
        query[0] = searchString;
        searchString = pref.getCharPref("defaultqueryformat")
                           .replace("$Q$", searchString).replace("$E$", e.name);
        engines = [e];
      }
      
      if(engines && engines.length > 0) {
        // show default option only if found an engine to search with
        var engineNames = [];
        engines.forEach(function(e) {
          engineNames.push(e.name);
        });
        // XXX when "browser.urlbar.autoFill" is true and this is the first
        // result cursor in textbox with autocomplete goes to the begining after
        // the a space is entered. A workaround is available... it would be to
        // add " " to the searchString, but its better to log a bug for this
        // issue.
        if(utils._mainPref.getBoolPref("browser.urlbar.autoFill")) {
          // XXX this is a temporary workaround for the above mentioned bug.
          // check in next version and remove if its fixed.
          // here we have added an empty space in search suggestion so that even
          // if its the first choice in location-bar autocomplete it wont
          // trigger the buggy behavior.
          searchString = searchString + "";
        }
        var currQry = this.getQueryForEngine(searchString,
                                             query[0],
                                             engineNames.join(", "),
                                             engines.length === 1 ? engines[0].iconURI.spec : undefined);
        // call append match method to add a search result to urlbar autocomplete.
        //
        // result.appendMatch  takes the following arguments:
        //    1. the actual string to be used in the urlbar.
        //    2. comment to be shown for the string in the urlbar.
        //    3. path to the image to be shown besides the comment.
        //    4. some style. dont remember what's it used for... :|
        result.appendMatch.apply(result, currQry);
      }
    }
    listener.onSearchResult(this, result);
  },
  getQueryForEngine: function(query, searchString, engineName, icon) {
    if(trim(searchString).length == 0) {
      searchString = this._sb ?
                      this._sb.GetStringFromName("EmptyStringFiller") : "___";
    }
    // XXX cache these string bundles
    var comment = "";
    try{
    comment = this._sb ? this._sb.GetStringFromName("DefaultSearchCommentFormat") :
                            "search $1 for: $2"
    }catch(e) {
      // failing for swedish locale check to see if there's a problem with file 
      comment = "$1: $2"
    }
    return [
            query,
            comment.replace("$1", engineName).replace("$2", searchString),
            icon || "chrome://omnibar/skin/classic/magnifier.png",
            "omnibar-search"
           ];
  },
  stopSearch: function() {
    // for now nothing to do. everything is synchronous
  }
}

/**
 * another component class to enable detailed search which are shown at the end
 * of the normal places results.
 */
DetailedOmnibarSearch = function() {
  OmnibarSearch.call(this);
  this.init();
}

DetailedOmnibarSearch.prototype = {
  classDescription: "Firefox Search component for location bar",
  classID:          Components.ID("{AA5CDC32-8148-11DD-99E5-B6AA56D89593}"),
  contractID:       "@mozilla.org/autocomplete/search;1?name=omnibar-search-suggestions",
  __proto__: OmnibarSearch.prototype,
  
  init: function() {
    this._autoComplete = Cc["@mozilla.org/autocomplete/search;1?name=search-autocomplete"]
                                .createInstance(Ci.nsIAutoCompleteSearch);
    this._utils = new SearchUtils();
  },
  boot: function() {
    // do any init here if required.
    var prefBranch = Cc["@mozilla.org/preferences-service;1"]
                        .getService(Ci.nsIPrefBranch);
    var utils = this._utils;
    var engine = utils._ss.currentEngine;
    this._suggestEnabled = prefBranch.getBoolPref("browser.search.suggest.enabled") && engine.supportsResponseType("application/x-suggestions+json");
    this._mainPref = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
  },
  startSearch: function(searchString, searchParam, previousResult, listener) {
    // before going ahead stop old searches if there are any...
    this.stopSearch();
    var self = this;
    self.boot();
    this._listener = listener;
    this._searchString = searchString;
    var utils = this._utils;
    var query = self._query = utils.parseQuery(searchString);
    var result = this._result = this.createNewResult(searchString);
    // load the preference baranch. will use it for a bunch of operations.
    var prefs = utils._prefBranch;
    var kwdInfo = utils.getKeywordInfo(searchString.split(' ')[0]);
    var fileCompletions = [];//getFileCompletions(searchString);
    if(fileCompletions.length > 0) {
      fileCompletions.forEach(function(f) {
        result.appendMatch(f.path,
                           f.name,
                           "chrome://omnibar/skin/classic/local.png",
                           "omnibar-filepath");
      });
      listener.onSearchResult(this, result);
      return;
    } else if(self._suggestEnabled && (prefs.getBoolPref('enabledefaultsearch') || query[3] || query[4])) {
      self._autoComplete.startSearch(query[0] || searchString, searchParam,
                                     null, new SearchObserver({
                                      onSearchResult: function(search, result) {
                                        self.onSuggestedResult(search, result);
                                      }
                                    }));
    } else {
      this.sendCancelledSearchResult(listener, result);
    }
  },
  sendCancelledSearchResult: function(listener, result) {
    try{
    var self = this;
    //RESULT_NOMATCH_ONGOING,RESULT_FAILURE,RESULT_NOMATCH,RESULT_SUCCESS_ONGOING
    Cc["@mozilla.org/thread-manager;1"]
    .getService(Ci.nsIThreadManager).mainThread.dispatch({
      run: function() {
        try{
        if(self._utils._prefBranch.getCharPref("popupstyle") == 'SIMPLE') {
          // workarounds for different behavior in different popups :|
          result.setSearchResult(Ci.nsIAutoCompleteResult.RESULT_NOMATCH);
        } else {
          result.setSearchResult(Ci.nsIAutoCompleteResult.RESULT_FAILURE);
        }
        listener.onSearchResult(self, result);
        }catch(e){log(e)}
      }
    }, Ci.nsIThread.DISPATH_NORMAL);
    }catch(e){log(e)}
  },
  stopSearch: function() {
    this._autoComplete.stopSearch();
  },
  /**
   * method called after the suggested search results have been found.
   */
  onSuggestedResult: function(search, suggested_result) {
    
    var result = this._result;
    var utils = this._utils;
    var searchString = this._searchString;
    var query = this._query;
    var listener = this._listener;
    var prefs = utils._prefBranch;
    var format = query[2] || prefs.getCharPref("defaultqueryformat");
    var defaultEngines = query[1];
    var $E$, $Q$;
    if(!(defaultEngines && defaultEngines.length > 0)) {
      defaultEngines = [utils._ss.currentEngine];
    }
    // temporary variable used at places to get engine names from engines list.
    var engine_names = [];
    defaultEngines.forEach(function(e) {
      engine_names.push(e.name);
    });
    $E$ = engine_names.join(",");
    var MAX_COUNT = prefs.getIntPref("numsuggestions");
    // for some reason suggested_result is null in a few cases!
    var count = Math.min(MAX_COUNT,
                         suggested_result ? suggested_result.matchCount : 0);
    var old_$Q$;
    var iconURI = defaultEngines.length === 1 ?
                  defaultEngines[0].iconURI.spec :
                  // TODO replace with an icon that shows that its a suggestion
                  "chrome://omnibar/skin/classic/magnifier.png";
    //var results = [], comments = [], styles = [], images = [];
    for(var i = 0; i < count; i++) {
      //    1. the actual string to be used in the urlbar.
      //    2. comment to be shown for the string in the urlbar.
      //    3. path to the image to be shown besides the comment.
      //    4. some style. dont remember what's it used for... :|
      $Q$ = suggested_result.getValueAt(i);
      // TODO verify the correctness of this logic
      var possible_url = $Q$.replace(/^http(s)\s/, "http://")
                            .replace(/\s/g, ".");
      // XXX for addresses starting with "http ", it should be replaced with
      // "http://"
      if(($Q$.indexOf("www") === 0 || $Q$.indexOf("http") === 0) && utils.isAProtocolOrLocation(possible_url)) {
        $Q$ = possible_url;
      }
      if( $Q$ !== old_$Q$) {
        var comment;
        if(utils.isAProtocolOrLocation($Q$)) {
          // TODO cache these string bundles
          comment = this._sb ? this._sb.GetStringFromName("UrlSuggestCommentFormat") :
                               "suggested url: $1"
          result.appendMatch($Q$,
                             comment.replace("$1", $Q$),
                             utils.getIconSpec($Q$),
                             "omnibar-suggestion-url");
        } else {
          comment = this._sb ? this._sb.GetStringFromName("PhraseSuggestCommentFormat") :
                               "search $1 for suggestion: $2"
          result.appendMatch(trim(format.replace("$Q$", $Q$).replace("$E$", $E$)),
                             comment.replace("$1", $E$).replace("$2", $Q$),
                             iconURI,
                             "omnibar-suggestion-phrase");
        }
      }
      old_$Q$ = $Q$;
    }
    
    // now append other results...
    var $Q$ = query[0] || searchString;
    var engineseparator = prefs.getCharPref("engineseparator");
    
    listener.onSearchResult(this, result);
  }
}

// our implementation of nsIAutoCompleteObserver
SearchObserver = function(owner) {
  this.owner = owner;
}

SearchObserver.prototype = {
  QueryInterface: function(iid) {
    if(iid === Ci.nsIAutoCompleteObserver
       || iid === Ci.nsISupports) {
      return this;
    }
    throw Components.results.NS_ERROR_NO_INTERFACE;
  },
  onSearchResult: function(search, result) {
    this.owner.onSearchResult(search, result);
  }
}

// omnibar-allinone
OmnibarAllInOne = function() {
  OmnibarSearch.call(this);
  this.init();
}

OmnibarAllInOne.prototype = {
  classDescription: "Firefox Search and History component for location bar",
  classID:          Components.ID("{4087d5ad-ab64-4314-8899-fb9ccd7afe41}"),
  contractID:       "@mozilla.org/autocomplete/search;1?name=omnibar-allinone",
  __proto__: OmnibarSearch.prototype,
  
  init: function() {
    // do any init here if required.
    this.mainPrefs = Cc["@mozilla.org/preferences-service;1"]
                      .getService(Ci.nsIPrefBranch);
    this.prefs = Cc["@mozilla.org/preferences-service;1"]
                        .getService(Ci.nsIPrefService)
                        .getBranch("extensions.omnibar.");
    this.utils = new SearchUtils();
    this.omnibarSearch = new DetailedOmnibarSearch();
    this.historySearch = Cc["@mozilla.org/autocomplete/search;1?name=history"].createInstance(Ci.nsIAutoCompleteSearch);
    this.hiddenWindow = Cc["@mozilla.org/appshell/appShellService;1"]
                        .getService(Ci.nsIAppShellService).hiddenDOMWindow;
    this.observerService = Cc["@mozilla.org/observer-service;1"]
                           .getService(Ci.nsIObserverService);
  },
  query: null,
  listener: null,
  searchString: null,
  historySearchOn: false,
  omnibarSearchOn: false,
  searchTimer: 0,
  startSearch: function(searchString, searchParam, previousResult, listener) {
    var utils = this.utils;
    var me = this;
    this.listener = listener;
    this.searchString = searchString;
    // query === [search_str, engines, user_format, isKeyword, hasOperator]
    var query = this.query = utils.parseQuery(searchString);
    var resultDisplayStrategy = "HISTORY";
    if(query.length > 0 && (query[3] || query[4])) {
      resultDisplayStrategy = "OMNIBAR";
    } else if(trim(searchString).indexOf(" ") > 0) {
      resultDisplayStrategy = "OMNIBAR+HISTORY";
    }
    //log("startSearch: " + searchString);
    var result = this.result = new CompositeAutoCompleteResult(searchString, resultDisplayStrategy);
    if(query.length == 0 || (!query[3] && !query[4])) {
      // perform a history search only when a search engine keyword is not used
      // and search engine operator is not used
      result.setHistorySearchOn(true);
      this.historySearch.startSearch(searchString, searchParam,
                                     previousResult, new SearchObserver({
                                      onSearchResult: function(search, result) {
                                        me.onHistoryResult(search, result);
                                      }
                                    }));
    }
    if((query[3] || query[4] || this.prefs.getBoolPref('enabledefaultsearch'))) {
      result.setOmnibarSearchOn (true);
      var searchDelay = this.prefs.getIntPref('searchdelay');
      function search(){
        me.searchTimer = 0;
        var searchObserver = new SearchObserver({
          onSearchResult: function(search, result){
            me.onOmnibarResult(search, result);
          }
        });
        me.omnibarSearch.startSearch(searchString,
                                     searchParam,
                                     previousResult,
                                     searchObserver);
      }
      me.searchTimer = me.hiddenWindow.setTimeout(search,searchDelay);
    }
  },
  onHistoryResult: function(search, history_result) {
    //log('onHistoryResult:'+history_result.searchResult + ':' +history_result.matchCount)
    var result = this.result;
    result.setHistoryResult(history_result);
    this.listener.onSearchResult(this, result);
    //log('done onHistoryResult:'+result.searchResult + ':' +result.matchCount)
  },
  onOmnibarResult: function(search, omnibar_result) {
    //log('onOmnibarResult:'+omnibar_result.searchResult + ':' +omnibar_result.matchCount)
    var result = this.result;
    result.setOmnibarResult(omnibar_result);
    this.listener.onSearchResult(this, result);
    //this.observerService.notifyObservers(null, "places-autocomplete-feedback-updated", "");
  },
  stopSearch: function() {
    //log('stopSearch');
    this.historySearch.stopSearch();
    this.omnibarSearch.stopSearch();
    if(this.searchTimer) {
      this.hiddenWindow.clearTimeout(this.searchTimer);
    }
  }
}

var MAX = 20;
var OMNIBAR = 'O', HISTORY = 'H';
const DISTRIBUTION = {
  "OMNIBAR": [[OMNIBAR, MAX]],
  "OMNIBAR+HISTORY": [[OMNIBAR, 2], [HISTORY, 4], [OMNIBAR, 4], [HISTORY, MAX]],
  "HISTORY": [[HISTORY, MAX], [OMNIBAR, MAX]]
};

const DISTRIBUTION_STRATEGIES = {};

function setHistoryCount(aSubject, aTopic, aData){
  var numhistory = PREF_BRANCH.getIntPref('numhistory');
  //log("numhistory is " + numhistory);
  DISTRIBUTION.HISTORY[0][1] = numhistory;

  for(let name in DISTRIBUTION) {
    var array = [], strategy = DISTRIBUTION[name];
    for(let i = 0, len = strategy.length; i < len; i += 1) {
      var sourceAndBlock = strategy[i];
      var source = sourceAndBlock[0];
      for(let i = 0, len = sourceAndBlock[1]; i < len; i +=1) {
        array.push(source);
      }
    }
    DISTRIBUTION_STRATEGIES[name] = array;
  }

}

PREF_BRANCH.addObserver("", {
  observe: setHistoryCount
}, false);
setHistoryCount();

// Implements nsIAutoCompleteResult
function SimpleAutoCompleteResult(searchString, searchResult,
                                  defaultIndex, errorDescription,
                                  results, comments, styles, images) {
  this.searchString = searchString;
  this.searchResult = searchResult;
  this.defaultIndex = defaultIndex;
  this.errorDescription = errorDescription;
  this.results = results;
  this.comments = comments;
  this.styles = styles;
  this.images = images;
}

SimpleAutoCompleteResult.prototype = {
  searchString: "",
  searchResult: 0,
  defaultIndex: 0,
  errorDescription: "",
  results: [],
  comments: [],
  styles: [],
  images: [],

  get matchCount() {
    return this.results.length;
  },
  getValueAt: function(index) {
    return this.results[index];
  },
  getCommentAt: function(index) {
    return this.comments[index];
  },
  getStyleAt: function(index) {
    return this.styles[index];
  },
  getImageAt : function (index) {
    return this.images[index];
  },
  removeValueAt: function(index, removeFromDb) {
    this.results.splice(index, 1);
    this.comments.splice(index, 1);
    this.styles.splice(index, 1);
    this.images.splice(index, 1);
  },
  QueryInterface: function(aIID) {
    if (!aIID.equals(Ci.nsIAutoCompleteResult) && !aIID.equals(Ci.nsISupports))
        throw Components.results.NS_ERROR_NO_INTERFACE;
    return this;
  }
};

// nsIAutoCompleteResult
function CompositeAutoCompleteResult(searchString, strategy) {
  this.searchString = searchString;
  this.strategy = strategy = strategy ||  "HISTORY";
}

CompositeAutoCompleteResult.prototype = {
  strategy: "OMNIBAR",
  searchString: "",
  get searchResult() {
    var omnibarResult = this.omnibarResult;
    var historyResult = this.historyResult;
    var matchCount = this._matchCount;
    if(this.omnibarSearchOn && (!omnibarResult ||
       omnibarResult.searchResult == ACR.RESULT_SUCCESS_ONGOING)) {
      if(this.matchCount == 0) return ACR.RESULT_NOMATCH_ONGOING;
      else return ACR.RESULT_SUCCESS_ONGOING;
    }
    if(this.historySearchOn && (!historyResult ||
       historyResult.searchResult == ACR.RESULT_SUCCESS_ONGOING)) {
      if(this.matchCount == 0) return ACR.RESULT_NOMATCH_ONGOING;
      else return ACR.RESULT_SUCCESS_ONGOING;
    }
    //log("return ACR.RESULT_SUCCESS");
    return ACR.RESULT_SUCCESS;
  },
  omnibarSearchOn: false,
  setOmnibarSearchOn: function(omnibarSearchOn){
    this.omnibarSearchOn = omnibarSearchOn;
  },
  historySearchOn: false,
  setHistorySearchOn: function(historySearchOn) {
    this.historySearchOn = historySearchOn;
  },
  defaultIndex: 0,
  _errorDescription: null,
  displayTemplateItems: [],
  get errorDescription() {
    return this._errorDescription || (this.historyResult ? this.historyResult.errorDescription : "<Not Available>");
  },
  omnibarResult: null,
  historyResult: null,
  setOmnibarResult: function(result) {
    this.omnibarResult = result;
    this._update();
  },
  setHistoryResult: function(result) {
    this.historyResult = result;
    this._update();
  },
  _update: function() {
    try{
    var displayTemplateItems = DISTRIBUTION_STRATEGIES[this.strategy].slice(),
        compositeResult  = new Array(displayTemplateItems.length),
        omnibar_count = 0,
        history_count = 0,
        omnibarResult = this.omnibarResult,
        historyResult = this.historyResult,
        omnibar_max = omnibarResult ? omnibarResult.matchCount : 0,
        history_max = historyResult ? historyResult.matchCount : 0,
        max = Math.min(MAX, omnibar_max + history_max);
    this._matchCount = max;
    
    for(var i = 0; i < max; i += 1) {
      if(omnibar_max <= omnibar_count) {
        displayTemplateItems.splice(i);
        for(var j = i; j < max; j += 1) {
        compositeResult[j] = [historyResult.getValueAt(history_count),
                              historyResult.getCommentAt(history_count),
                              historyResult.getStyleAt(history_count),
                              historyResult.getImageAt(history_count),
                              HISTORY,
                              history_count
                              ];
          history_count += 1;
        }
        break;
      } else if(history_max <= history_count) {
        for(var j = i; j < max; j += 1) {
        compositeResult[j] = [omnibarResult.getValueAt(omnibar_count),
                              omnibarResult.getCommentAt(omnibar_count),
                              omnibarResult.getStyleAt(omnibar_count),
                              omnibarResult.getImageAt(omnibar_count),
                              OMNIBAR,
                              omnibar_count
                              ];
          omnibar_count += 1;
        }
        break;
      }
      var src = displayTemplateItems[i];
      if(src == OMNIBAR) {
        compositeResult[i] = [omnibarResult.getValueAt(omnibar_count),
                              omnibarResult.getCommentAt(omnibar_count),
                              omnibarResult.getStyleAt(omnibar_count),
                              omnibarResult.getImageAt(omnibar_count),
                              OMNIBAR,
                              omnibar_count
                              ];
        omnibar_count += 1;
      } else {
        compositeResult[i] = [historyResult.getValueAt(history_count),
                              historyResult.getCommentAt(history_count),
                              historyResult.getStyleAt(history_count),
                              historyResult.getImageAt(history_count),
                              HISTORY,
                              history_count
                              ];
        history_count += 1;
      }
    }
    this.compositeResult = compositeResult;
    }catch(e){log(e)}
  },
  //_update: function() {
  //  try{
  //  var displayTemplateItems = DISTRIBUTION_STRATEGIES[this.strategy].slice();
  //  var omnibar_count = 0;
  //  var history_count = 0;
  //  var omnibar_max = this.omnibarResult ? this.omnibarResult.matchCount : 0;
  //  var history_max = this.historyResult ? this.historyResult.matchCount : 0;
  //  var max = Math.min(MAX, omnibar_max + history_max);
  //  this._matchCount = max;
  //  
  //  for(var i = 0; i < max; i += 1) {
  //    if(omnibar_max <= omnibar_count) {
  //      displayTemplateItems.splice(i);
  //      for(var j = i; j < max; j += 1) {
  //        displayTemplateItems.push([HISTORY, history_count]);
  //        history_count += 1;
  //      }
  //      break;
  //    } else if(history_max <= history_count) {
  //      displayTemplateItems.splice(i);
  //      for(var j = i; j < max; j += 1) {
  //        displayTemplateItems.push([OMNIBAR, omnibar_count]);
  //        omnibar_count += 1;
  //      }
  //      break;
  //    }
  //    var src = displayTemplateItems[i];
  //    if(src == OMNIBAR) {
  //      displayTemplateItems[i] = [OMNIBAR, omnibar_count];
  //      omnibar_count += 1;
  //    } else {
  //      displayTemplateItems[i] = [HISTORY, history_count];
  //      history_count += 1;
  //    }
  //  }
  //  this.displayTemplateItems = displayTemplateItems;
  //  }catch(e){log(e)}
  //},
  get matchCount() {
    return this._matchCount;
  },
  getValueAt: function(index) {
    return this.compositeResult[index][0];
  },
  getCommentAt: function(index) {
    return this.compositeResult[index][1];
  },
  getStyleAt: function(index) {
    return this.compositeResult[index][2];
  },
  getImageAt: function (index) {
    return this.compositeResult[index][3];
  },
  getLabelAt: function(index) {
    return this.getValueAt(index);
  },
  removeValueAt: function(index, removeFromDb) {
    //log('remove:'+index+'-'+removeFromDb);
    var res = this.compositeResult[index];
    if(res[4] == HISTORY) {
      this.historyResult.removeValueAt(res[5], removeFromDb);
    } else {
      this.omnibarResult.removeValueAt(res[5], removeFromDb);
    }
    this.compositeResult.splice(index, 1);
  },
  QueryInterface: function(aIID) {
    if (!aIID.equals(Ci.nsIAutoCompleteResult) && !aIID.equals(Ci.nsISupports))
        throw Components.results.NS_ERROR_NO_INTERFACE;
    return this;
  }
};



// list of *all* available tlds. update whenever a new tld pops-up.
const TLDS = ["aero","asia","biz","cat","com","coop","edu","gov","info","int",
              "jobs","mil","mobi","museum","name","net","org","pro","tel",
              "travel","ac","ad","ae","af","ag","ai","al","am","an","ao","aq",
              "ar","as","at","au","aw","ax","az","ba","bb","bd","be","bf","bg",
              "bh","bi","bj","bm","bn","bo","br","bs","bt","bv","bw","by","bz",
              "ca","cc","cd","cf","cg","ch","ci","ck","cl","cm","cn","co","cr",
              "cu","cv","cx","cy","cz","de","dj","dk","dm","do","dz","ec","ee",
              "eg","er","es","et","eu","fi","fj","fk","fm","fo","fr","ga","gb",
              "gd","ge","gf","gg","gh","gi","gl","gm","gn","gp","gq","gr","gs",
              "gt","gu","gw","gy","hk","hm","hn","hr","ht","hu","id","ie","il",
              "im","in","io","iq","ir","is","it","je","jm","jo","jp","ke","kg",
              "kh","ki","km","kn","kp","kr","kw","ky","kz","la","lb","lc","li",
              "lk","lr","ls","lt","lu","lv","ly","ma","mc","md","me","mg","mh",
              "mk","ml","mm","mn","mo","mp","mq","mr","ms","mt","mu","mv","mw",
              "mx","my","mz","na","nc","ne","nf","ng","ni","nl","no","np","nr",
              "nu","nz","om","pa","pe","pf","pg","ph","pk","pl","pm","pn","pr",
              "ps","pt","pw","py","qa","re","ro","rs","ru","rw","sa","sb","sc",
              "sd","se","sg","sh","si","sj","sk","sl","sm","sn","so","sr","st",
              "su","sv","sy","sz","tc","td","tf","tg","th","tj","tk","tl","tm",
              "tn","to","tp","tr","tt","tv","tw","tz","ua","ug","uk","us","uy",
              "uz","va","vc","ve","vg","vi","vn","vu","wf","ws","ye","yt","yu",
              "za","zm","zw"];


var SearchUtils = function() {
  this.wrappedJSObject = this;
  this.init();
}

SearchUtils.prototype = {
  classDescription: "Omnibar search query parser",
  classID:          Components.ID("{0cca1b29-1489-4826-ba0c-21fee771afbd}"),
  contractID:       "@ajitk.com/omnibar/queryparser;1",
  QueryInterface: XPCOMUtils.generateQI([Components.interfaces.nsISupports]),
  RE_PROTOCOL_PREFIX: /^(www\.|http:|htttps:|ftp:|file:|chrome:)/i,
  RE_IP: /^(\d{1,3}\.){3}(\d{1,3}){1}(:\d+)*$/,
  RE_MOZ_ACTION: /^moz-action:([^,]+),(.*)$/,
  init: function() {
    var ss = this._ss = Cc['@mozilla.org/browser/search-service;1']
                .getService(Ci.nsIBrowserSearchService);
    var engines = this._engines = [];
    ss.getEngines({}, []).forEach(function(e) {
      if(e.hidden !== true) {
        engines.push(e);
      }
    });
    this._prefBranch = Cc["@mozilla.org/preferences-service;1"]
                        .getService(Ci.nsIPrefService)
                        .getBranch("extensions.omnibar.");
    this._mainPref = Cc["@mozilla.org/preferences-service;1"]
                        .getService(Ci.nsIPrefBranch);
    this._bookmarks = Cc["@mozilla.org/browser/nav-bookmarks-service;1"].
                      getService(Ci.nsINavBookmarksService);
    this._faviconService = Cc["@mozilla.org/browser/favicon-service;1"]
                         .getService(Ci.nsIFaviconService);
  },
  getAllEngines: function() {
    return this._engines;
  },
  getIconSpec: function(uri){
    try {
      if(typeof uri === "string") {
        // TODO create a URL object.
        return "";
      }
      var iconURI = this._faviconService.getFaviconForPage(uri);
      return iconURI ? iconURI.spec : "";
    } catch (e){}
    return "";
  },
  getKeywordInfo: function(keyword) {
    // currently in FF, keywords cannot be a capital letter. when
    // getURIForKeyword is called for a keyword in uppercase, it hangs FF. fix
    // for now is to convert the keyword to lower case.
    keyword = keyword.toLowerCase();
    try {
      var bms = this._bookmarks;
      // getting some errors a this line
      var kwdURI = bms.getURIForKeyword(keyword);
      if (kwdURI) {
        var title = "keyword " + keyword;
        var iconURL = this.getIconSpec(kwdURI);
        var items = bms.getBookmarkIdsForURI(kwdURI, {});
        for(var i = 0; items.length; i++) {
          if(bms.getKeywordForBookmark(items[i]) == keyword) {
            title = bms.getItemTitle(items[i]);
            break;
          }
        }
        return {
          keyword: keyword,
          spec: kwdURI.spec,
          title: title,
          iconURL: iconURL
        };
      }
    } catch(e){}
    return undefined;
  },
  parseQuery: function(query) {
    // there a few things that we need to keep in mind here.
    // we need to respect user's way of searching things and should help him
    // search efficiently. a typical search process would consist of two things:
    // 1. the search query
    // 2. intended search engine(s). this is a tricky one to identify. our goal
    //    is to identify the search engines using @ operatoror or usage of
    //    search engine keywords as identifier of search engine. So, this is
    //    what we are going to do to parse user queries: first look for
    //    operator "@" at the begining of the search string.
    
    //    Case 1. if found "@" look for a syntax "@engine1,engine2, engine3
    //    search query" notice the empty space behind engine3 keyword. keep
    //    looking for comma-separated search eingine and stop as soon an entry
    //    is found that does not stand for a search engine.
    
    //    Case 2. user has entered a normal string (not starting with "@"). Now
    //    there can be a possibility that the user is trying to use a search
    //    engine keyword. In this case, find the keyword string (test words
    //    separated by space if it is a keyword) and perform search accordingly.
    
    //    in both cases it is important to show the intended result of user's
    //    query. user can choose to learn and refine his query so one can search
    //    easily and more intuitively.
    
    //    Case 3. "@engine name one, engine name two search query" How to handle
    //    this case where the engine name contains spaces and they may not be
    //    separated from teh search query with comma? TODO find a good solution
    var search_str = "";
    var engines = [];
    var isKeyword = false;
    var hasOperator = true;
    var pref = this._prefBranch;
    var OP = pref.getCharPref('operator');
    var SEP = pref.getCharPref('engineseparator');
    var user_format = OP + "$E$ $Q$";
    
    query = trim(query);
    
    // check if the query starts with a standard protocol.
    if(this.isAProtocolOrLocation(query)) {
      return [];
    }

    // no protocol is being used. proceed ahead with parsing the query.
    // before going ahead, there's one more kind of url that we need to handle.
    // what if the user is typing in some intranet url such as http://home/
    // etc? The best way to test that will be to actually try that and find out
    // if that kind of url is active and can be used or not.
    var enabledefaultsearch = pref.getBoolPref("enabledefaultsearch");
    var idxOfAt = query.indexOf(OP);
    if( idxOfAt === 0) {
      var keys = [];
      // what we are trying to parse: @ engine1 , engine2 ,engine3 search string
      search_str = trim(query.substring(1));
      // search_str = engine1 , engine2 ,engine3 search string
      var sequence = search_str.split(SEP);
      // sequence = ["engine1 ", " engine2 ", "engine3 search string"]
      var last_str = trim(sequence.pop());
      // sequence = ["engine1 ", " engine2 "]
      var end_sequence = last_str.split(" ");
      // end_sequence = ["engine3", "search", "string"]
      sequence.push(end_sequence.shift());
      // sequence = ["engine1 ", " engine2 ", "engine3"]
      // end_sequence = ["search", "string"]
      while(sequence.length >= 0) {
        var next_name = sequence[0];
        var finds = this.findEngines([next_name]);
        //log("!next engine name:|" + next_name + "| has N: " + finds.length);
        if(finds.length > 0) {
          keys.push(next_name);
          engines = engines.concat(finds);
          sequence.shift();
        } else if(next_name && next_name.length == 0) {
          // search engine names were separated by more than one whitespaces
          sequence.shift();
        } else {
          // found an entry which is not a valid search engine. time to stop;
          break;
        }
      }
      search_str = trim(sequence.join(SEP) + " " + end_sequence.join(" "));
      user_format = [OP, keys.join(SEP), " $Q$"].join("");
    } else if(idxOfAt > 0) {
      // once we know that there is an "@" character, reset the query to assume
      // it to be at the end. there maybe a "@"(OP) character in search string
      idxOfAt = query.lastIndexOf(OP);
      user_format = "$Q$ "+OP+"$E$";
      search_str = query.substring(0, idxOfAt);
      var engines_str = query.substring(idxOfAt + 1);
      engines = this.findEngines(engines_str.split(SEP));
    } else {
      // it is also possible to perform search in the form of: g y x search
      // query as one of the users suggested! this method can be refoactored to
      // reuse the engine parsing logic if there is a need to!
      hasOperator = false;
      // look for any search engine keyword
      var seq = query.split(" ");
      var key = seq.shift();
      var engine = this.findByKeyword(key);
      if(engine) {  // user is going to use engine by keyword
        isKeyword = true;
        user_format = [key, "$Q$"].join(" ");
        engines.push(engine);
        search_str = seq.join(" ");
      } else if(enabledefaultsearch) {
        search_str = query;
      }
    }
    if(engines.length === 0) {
      hasOperator = false;
      // if none of the engines were found to match, search using default engine
      if(enabledefaultsearch) {
        engines.push(this._ss.currentEngine);
      }
    }
    if(enabledefaultsearch && engines.length == 1 && engines[0] == this._ss.currentEngine) {
      user_format = "$Q$";
    }
    //log([search_str, engines, user_format, isKeyword, hasOperator])
    return [search_str, engines, user_format, isKeyword, hasOperator];
  },
  isAProtocolOrLocation: function(query) {
    // first check if the query starts with a standard protocol.
    if(this.RE_PROTOCOL_PREFIX.test(query) || this.RE_IP.test(query) ||
       query.match(this.RE_MOZ_ACTION)) {
      return true;
    }
    if(query.indexOf(" ") < 0) {
      if(query.indexOf("/") > 0) {
        return true;
      }
      if(this.getKeywordInfo(query) != null) {
        return true;
      }
      
      var lastIndexOfDot = query.lastIndexOf(".");
      if(lastIndexOfDot > 0) {
        // check for a possible TLD
        var tld_name = query.substring(lastIndexOfDot + 1);
        if(TLDS.indexOf(tld_name) >= 0) { // found a valid TLD!
          return true;
        }
      }
    }
    
    // perform a generic test if a protocol is being used.
    var protocol_name = query.substring(0, query.indexOf(":"));
    if(protocol_name.length > 0) { //a probable candidate!
      try {
        if(protocol_name.indexOf(" ") < 0
           && Cc["@mozilla.org/network/protocol;1?name="+protocol_name]
           ) {
          return true;
        }
      } catch (e) {}
    }
    
    // final test for a posible fiel path
    try {
      // this is a bad check. on some systems, it may not work even for a valid
      // path
      var file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
      file.initWithPath(query);
      // came here w/o any exception => a valid file path
      return true;
    } catch(e){
    }
    // another check for a possible keyword
    return false;
  },
  /**
   *
   */
  findByKeyword: function(kwd) {
    return this._ss.getEngineByAlias(kwd);
  },
  /**
   *
   */
  findEngines: function (nameHints) {
    var filteredEngines = [];
    var allEngines = this._engines;
    var self = this;
    nameHints.forEach(function(hint) {
      hint = trim(hint).toLowerCase();
      if(hint.length > 0) {
        var engine = self.findByKeyword(hint);
        if(engine) {
          filteredEngines.push(engine);
        } else {
          allEngines.forEach(function(e){
            var name = e.name.toLowerCase();
            if(name.indexOf(hint) == 0 && filteredEngines.indexOf(e) < 0) {
              filteredEngines.push(e);
            }
          });
        }
      }
    });
    return filteredEngines;
  }
}

function trim(str) {
  return str ? str.trim() : '';
}

var FILE_SEP = '/';  //Default value.

// XXX how do we determine the operating system. we want to set the file
// separator. maybe that the file object has the required property
// get profile directory
(function() {
  try {
    var file = Cc["@mozilla.org/file/local;1"]
                  .createInstance(Ci.nsILocalFile);
    file.initWithPath("c:\\");  //do all windows have a c-drive?
  if(file.exists()) {
    FILE_SEP = "\\";
  }
  }catch(e){
    //log(e);
  }
})();

var File = function(x) {
  if(typeof x === "string") {
    var path = x;
    // best possible sub stitution?
    var file = Cc["@mozilla.org/file/local;1"]
                  .createInstance(Ci.nsILocalFile);
    file.initWithPath(path);
    // save the file handle for future reference.
    x = file;
  }
  this.handle = x;
  var path = this.path = x.path;
  this.name = path.substring(path.lastIndexOf(FILE_SEP) + 1);
}

/**
 * Object corresponding to an actual file.
 */
File.prototype = {
  exists: function() {
    return this.handle.exists();
  },
  /**
   * returns true if file is a file and not a directory.
   */
  isFile: function() {
    return this.handle.isFile();
  },
  /**
   * returns true if file is a directory
   */
  isDir: function() {
    return this.handle.isDirectory();
  },
  /**
   * returns a list of files available in the current folder.
   * @param filter {string} a simple wildcard filter or a function
   */
  getFiles: function(filter) {
    filter = (typeof filter === "function") ? filter : getWidlcardFilter(filter);
    var arrey = [];
    try {
      var entries = this.handle.directoryEntries;
      while(entries && entries.hasMoreElements()) {
        var entry = entries.getNext();
        
        // can we get the name from entry?
        var file = entry.QueryInterface(Ci.nsIFile);
        var path = file.path;
        var name = path.substring(path.lastIndexOf(FILE_SEP) + 1)
        if(filter(name)) {
          arrey.push(new File(file));
        }
      }
    } catch(e) {}
    return arrey;
  },
  /**
   * appends the name to the file and returns the new file object.
   */
  append: function(name) {
    return this.handle.append(name);
  },
  /**
   * returns the file path representing the file
   */
  getPath: function() {
    return this.handle.path;
  }
  // no file I/O is being provided here, its just for the purpose of getting a
  // list of files in the file system.
}

function getWidlcardFilter(simple_wildcard) {
  function any() {
    return true;
  }
  function none() {
    return false;
  }
  function is(aName) {
    return aName === simple_wildcard;
  }
  function prefix(aName) {
    return aName.indexOf(simple_wildcard) === 0;
  }
  // some simple functions for trivial cases
  if(simple_wildcard === undefined) {
    return none;
  }
  if(simple_wildcard.length === 0) {
    return any;
  }
  if(simple_wildcard.indexOf("*") < 0) {
    return is;
  }
  
  var parts = simple_wildcard.split("*");
  var first = parts.shift();
  var len = parts.length;
  return function(aName) {
    var part,
        idxPart,
        idxFirst = aName.indexOf(first);
    if(idxFirst !== 0) {
      return false;
    }
    aName = aName.substring(idxFirst + first.length);
    for(var i = 0; i < len; i++) {
      part = parts[i];
      idxPart = aName.indexOf(part);
      if(idxPart < 0) {
        return false;
      }
      aName = aName.substring(idxPart + part.length);
    }
    return true;
  }
}

function getFileCompletions(path, MAX_COUNT) {
  try {
    // sanitize path
    MAX_COUNT = MAX_COUNT || 1000; // any pref?
    if(path.indexOf("file://") === 0) {
      path = path.substring("file://".length);
      // check for windows drive
      if(path.indexOf(":") === 2 && path.indexOf("/") === 0) {
        path = path.substring(1);
      }
    }
    path = path.replace(/\//g, FILE_SEP);
    var lisep = path.lastIndexOf(FILE_SEP);
    var filter, dirpath;
    var paths = path.split(FILE_SEP);
    // get the root file. no filter supported in root name.
    var rootFile = new File(paths.shift());
    // take the last path out for preparing final filter
    var lastPath = paths.pop();
    
    var files = [rootFile], t;
    for(var i = 0; i < paths.length; i++) {
      var filter = paths[i];
      t = [];
      files.forEach(function(f) {
        if(f.isDir()) {
          t = t.concat(f.getFiles(filter));
        }
      });
      files = t;
    }
    t = [];
    var lastPathFilter = lastPath + "*";
    
    for(var i = 0; i < files.length && t.length < MAX_COUNT; i++) {
      if(files[i].isDir()) {
        t = t.concat(files[i].getFiles(lastPathFilter));
      }
    }
    return t;
  } catch(e) {
    // ignore
  }
  return [];  //t || [];
}

var components = [OmnibarSearch, DetailedOmnibarSearch, OmnibarAllInOne, SearchUtils];

/**
* XPCOMUtils.generateNSGetFactory was introduced in Mozilla 2 (Firefox 4).
* XPCOMUtils.generateNSGetModule is for Mozilla 1.9.2 (Firefox 3.6).
*/
if (XPCOMUtils.generateNSGetFactory)
  var NSGetFactory = XPCOMUtils.generateNSGetFactory(components);
else
  var NSGetModule = XPCOMUtils.generateNSGetModule(components);
