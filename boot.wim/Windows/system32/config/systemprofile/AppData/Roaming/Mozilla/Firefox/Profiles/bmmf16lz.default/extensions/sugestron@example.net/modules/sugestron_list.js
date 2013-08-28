var EXPORTED_SYMBOLS = ["SUGESTRON_LIST"]

SUGESTRON_LIST = function(SUGESTRON) {

	//private declarations

	//website declaration
	var SugestronWebsite = function(url, title){
		this.url = url;
		this.title = title;
		//list of the times the website was visited
		this.visited = new Array();
	}

	var findSiteIndex = function(url){
                for(var i = 0; i < websites.length; i++){
                	if (websites[i].url == url)
                        	return i;
                }
                return null;
        }

	var findSite = function(url){
                var index = findSiteIndex(url);
                if (index != null)
                	return websites[index];
                return null;
        }

	var removeExpiredVisits = function(site, now){
		var changed = false;
                while (site.visited.length > 1 && now - site.visited[0] > SUGESTRON.timeToExpireUrl) {
                        site.visited.splice(0, 1);
			changed = true;
                }
		return changed;
	}

	var sortSites = function(){
		websites.sort(function (siteA, siteB){
			if (siteA.visited.length > siteB.visited.length){
				return -1;
			}
			else if (siteA.visited.length < siteB.visited.length){
				return 1;
			}
			
			var visitedA = siteA.visited[siteA.visited.length - 1];
			var visitedB = siteB.visited[siteB.visited.length - 1];

			if (visitedA > visitedB) {
				return -1;
			}
			else if (visitedA < visitedB) {
				return 1;
			}
			return 0;			
		});	
	}

	var addSiteToSiteList = function(url, title, image, visited){
		var site = findSite(url);
		var now = new Date().getTime();
		var exists = true;
		if (!site){
			site = new SugestronWebsite(url, title);
			websites.push(site);
			exists = false;
		}
		else {
			site.title = title;
		}

		if (visited){
			for (var i = 0; i < visited.length; i++){
				site.visited.push(visited[i]);
			}
		}
		else {
			site.visited.push(now);
		}

		removeExpiredVisits(site, now);	
               
		sortSites();
 
		//should track only the last 1000 urls
		if (websites.length > SUGESTRON.urlsToTrack){
			var websitesToDelete = [];
			while (websites.length > SUGESTRON.urlsToTrack){
                                var deleted = websites.pop();
				websitesToDelete.push(deleted);
			}
			SUGESTRON.database.removeURLs(websitesToDelete);
		}
		
		//save changes to database
		SUGESTRON.database.saveSite(site, image, exists);
	}

	//list of sites sorted by number of visits and how recent it was visited
	//doesnt contain sites in blacklist or fixed list
	websites = this.websites = new Array();

	//list of sites fixed (pinned) to the speed dial
	fixed = this.fixed = new Array();

	//periodically clean expired visits
	var timer = Components.classes["@mozilla.org/timer;1"]
                    .createInstance(Components.interfaces.nsITimer);
	var timerCallback = {
		notify: function(nTimer) {
			var now = new Date().getTime();
			var changed = false;
			for (var i = 0; i < websites.length; i++){
				if (websites[i].visited.length > 1){
					var changedThis = removeExpiredVisits(websites[i], now);
					changed = changed || changedThis;
					if (changedThis){
						SUGESTRON.database.updateVisitedList(websites[i]);
					}	
				}
			}

			//sort the array if it changed
			if (changed){
				sortSites();
			}
		}
	};
	timer.initWithCallback(timerCallback, SUGESTRON.intervalToCheckExpiredVisits, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
	
	//load data from database
	SUGESTRON.database.loadData(function(row){
			var site = new SugestronWebsite(row.getResultByName("url"), row.getResultByName("title"));
                	SUGESTRON.stringIntoArray(row.getResultByName("visited"), site.visited);
                	websites.push(site);
		}
		
		,

		function(){
			timerCallback.notify(null);
		}
	);

	SUGESTRON.database.loadDataFixedList(function(row){
		var site = new SugestronWebsite(row.getResultByName("url"), row.getResultByName("title"));
		SUGESTRON.stringIntoArray(row.getResultByName("visited"), site.visited);
		fixed[row.getResultByName("dialNumber")] = site;
	});


	return {timer:timer,
		websites: this.websites,
		addSite: function(url, title, image){
			if (!SUGESTRON.inPrivateBrowsingMode() && !SUGESTRON.database.isBlacklisted(url)){
				if (this.isFixed(url))
					this.updateFixedList(url, title, image);
				else	
					addSiteToSiteList(url, title, image);
			}
		},

		getIterator: function(){
			var indexWebsites = 0;
			var index = 1;
			
			return {
				hasNext: function(){
					return index  <= SUGESTRON.numberDials;
				},
				next: function(){
					var result = null;
					if (fixed[index] != null){
						result = fixed[index];
					}
					else if (indexWebsites < websites.length){
						result = websites[indexWebsites];
						indexWebsites++;
					}
					index++;
					return result;
				}
			};
		},

		getThumbnail: function(url, caller, callback){
			if (this.isFixed(url))
				SUGESTRON.database.getThumbnailFixed(url, caller, callback);
			else
				SUGESTRON.database.getThumbnail(url, caller, callback);
		},

		addToBlacklist: function(url){
			SUGESTRON.database.addToBlacklist(url);
			var indexToRemove = findSiteIndex(url);
			if (indexToRemove != null) {
				websites.splice(indexToRemove, 1);
			}

			for (var i = 0; i < fixed.length; i++){
				if (fixed[i] != null && fixed[i].url == url){
					SUGESTRON.database.removeFromFixedList(i);
					fixed[i] = null;
				}
			}	
		},
		
		isFixed: function(url, index) {
			var found = false;
			if (index) {
				found = fixed[index] != null;
			}
			else
				for (var i = 0; i < fixed.length; i++){
					if (fixed[i] != null && fixed[i].url == url){
						found = true;
						break;
					}
				}
			return found;
		},


		addToFixedList: function(indexDial, url, title, image){
			var now = new Date().getTime();
			var deleted = null;
			var indexToRemove = findSiteIndex(url);
                        if (indexToRemove != null) {
                                deleted = websites[indexToRemove];
				websites.splice(indexToRemove, 1);
                        }

			fixed[indexDial] = new SugestronWebsite(url, title);

			if (deleted !== null){
				for (var i = 0; i < deleted.visited.length; i++){
					fixed[indexDial].visited.push(deleted.visited[i]);
				}
			}
              
			if (fixed[indexDial].visited.length == 0){ 
                		fixed[indexDial].visited.push(now);
			}

			removeExpiredVisits(fixed[indexDial], now);

			SUGESTRON.database.addToFixedList(indexDial, fixed[indexDial], image, false);
		},
	
		updateFixedList: function(url, title, image){
			var now = new Date().getTime();
			for (var i = 0; i < fixed.length; i++){
				if (fixed[i] != null && fixed[i].url == url){
					fixed[i].title = title;
					fixed[i].visited.push(now);
					removeExpiredVisits(fixed[i], now);
					SUGESTRON.database.addToFixedList(i, fixed[i], image, true);
				}
			}
		},

		removeFromFixedList: function(indexDial, image){
			SUGESTRON.database.removeFromFixedList(indexDial);
			
			var url = fixed[indexDial].url;
			var title = fixed[indexDial].title;
			var visited = fixed[indexDial].visited;
			
			fixed[indexDial] = null;
			if (!this.isFixed(url)){
				addSiteToSiteList(url, title, image, visited);
			}

		}
	};
}
