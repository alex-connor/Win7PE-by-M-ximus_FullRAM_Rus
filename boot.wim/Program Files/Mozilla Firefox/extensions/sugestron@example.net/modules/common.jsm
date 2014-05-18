var EXPORTED_SYMBOLS = ["SUGESTRON"];

var SUGESTRON = {
	numberDials: 1,
	thumbnailWidth: 1,
	thumbnailHeight: 1,
	urlsToTrack: 1,
	timeToExpireUrl: 1,
	intervalToCheckExpiredVisits: 1,
	homepage: "about:blank",
	speedDialXUL: "chrome://sugestron/content/speeddial.xul",

	//indicates if the extension is being disabled
	disabled: false,

	faviconService: Components.classes["@mozilla.org/browser/favicon-service;1"]
                                               .getService(Components.interfaces.nsIFaviconService),
	ioService: Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService),
        privateBrowsingService: Components.classes["@mozilla.org/privatebrowsing;1"].getService(Components.interfaces.nsIPrivateBrowsingService),

	init: function(){
		SUGESTRON.preferences.init();
	},

	stringIntoArray: function(stringList, array){
                var times = stringList.split(" ");
                for (let i = 0; i < times.length; i++){
                        if (times[i] != "")
                                array.push(times[i]);
                }
        },

	arrayToString: function(array) {
                var result = "";
                for (let i = 0; i < array.length; i++){
                        result += array[i] + " ";
                }
                return result;
        },

	captureThumbnail: function(document, contentWindow){
		var canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
                var ctx = canvas.getContext("2d");
                canvas.width = SUGESTRON.thumbnailWidth;
                canvas.height = SUGESTRON.thumbnailHeight;
                ctx.save();
                var factor = canvas.width/contentWindow.innerWidth;
                ctx.scale(factor, factor);
                ctx.drawWindow(contentWindow, 0, 0, contentWindow.innerWidth,
                                        canvas.height * contentWindow.innerWidth / canvas.width, "rgb(255,255,255)");
                ctx.restore();

                var mimeType = "image/png";
                var dataURL = canvas.toDataURL(mimeType, "");
		return dataURL;
	},

	getFavicon: function(url){
		var result = null;
	        var urlFavicon = this.ioService.newURI(url, null, null);
        	result = this.faviconService.getFaviconImageForPage(urlFavicon).spec;
        	return result;
	},

        inPrivateBrowsingMode: function(){
		return this.privateBrowsingService.privateBrowsingEnabled;
        }
};

//load preferences routines
Components.utils.import("resource://sugestron/preferences.js");
SUGESTRON.preferences = SUGESTRON_PREFERENCES(SUGESTRON);

SUGESTRON.init();

//load database routines
Components.utils.import("resource://sugestron/database.js");
SUGESTRON.database = SUGESTRON_DATABASE(SUGESTRON);

//load site list routines
Components.utils.import("resource://sugestron/sugestron_list.js");
SUGESTRON.sugestronList = SUGESTRON_LIST(SUGESTRON);

