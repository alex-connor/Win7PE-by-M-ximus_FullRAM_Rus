var EXPORTED_SYMBOLS = ["SUGESTRON_DATABASE"];

SUGESTRON_DATABASE = function(SUGESTRON) {
	var dbConn = null;

	var init = function(){
		var file = Components.classes["@mozilla.org/file/directory_service;1"]
                     .getService(Components.interfaces.nsIProperties)
                     .get("ProfD", Components.interfaces.nsIFile);
        	file.append("sugestron.sqlite");

        	var storageService = Components.classes["@mozilla.org/storage/service;1"]
                        .getService(Components.interfaces.mozIStorageService);
        	dbConn = storageService.openDatabase(file);

        	try {
                	dbConn.executeSimpleSQL(
                        	"CREATE TABLE websites (url TEXT, title TEXT, visited TEXT, numberVisits INTEGER, lastVisit INTEGER, thumbnail TEXT)");
                	dbConn.executeSimpleSQL("CREATE UNIQUE INDEX websites_idx_url ON websites (url)");
                	dbConn.executeSimpleSQL("CREATE INDEX websites_idx_numberVisits_lastVisit ON websites (numberVisits DESC, lastVisit DESC)");
        	}
        	catch (e) {
                	//tabela ja foi criada
                	dump("err:" + e.type);
        	}

		try {
			dbConn.executeSimpleSQL("CREATE TABLE blacklist (url TEXT)");
			dbConn.executeSimpleSQL("CREATE UNIQUE INDEX blacklist_idx_url ON blacklist (url)");
		}
		catch (e) {

		}

		try {
			dbConn.executeSimpleSQL("CREATE TABLE fixed (dialNumber INTEGER, url TEXT, title TEXT, visited TEXT, thumbnail TEXT)");
			dbConn.executeSimpleSQL("CREATE UNIQUE INDEX fixed_idx_dialNumber ON fixed (dialNumber)");
		}
		catch (e) {

		}
	}

	var copyDataToDBStatement = function(site, stmt){
		stmt.params.url = site.url;
                stmt.params.title = site.title;
                stmt.params.numberVisits = site.visited.length;
                stmt.params.lastVisit = site.visited[site.visited.length - 1];
        	stmt.params.visited = SUGESTRON.arrayToString(site.visited);
	}

	init();

	return {
		loadData: function(loadRowFunction, onFinishLoadFunction){
			var statement = dbConn.createStatement(
				"SELECT url, title, visited, numberVisits, lastVisit FROM websites ORDER BY numberVisits DESC, lastVisit DESC");
			statement.executeAsync({
				handleResult: function(aResultSet) {
    					for (let row = aResultSet.getNextRow();
         				row;
         				row = aResultSet.getNextRow()) {
						loadRowFunction.apply(null, [row]);
    					}
  				},

  				handleError: function(aError) {
    					Components.utils.reportError("Error retrieving websites data from db: " + aError.message);
  				},

  				handleCompletion: function(aReason) {
    					if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED)
      						Components.utils.reportError("Query to retrieve websites data from db canceled or aborted!");
					else{
						if (onFinishLoadFunction){
							onFinishLoadFunction.apply(null, []);
						}
					}
  				}
			});

		},

		saveSite: function(site, image, update){
			var stmt = null;
                        if (update)
                                stmt = dbConn.createStatement(
                                        "UPDATE websites SET title=:title, visited=:visited, numberVisits=:numberVisits, lastVisit=:lastVisit, thumbnail=:thumbnail WHERE url=:url");
                        else 
                                stmt = dbConn.createStatement(
                                        "INSERT INTO websites (url, title, visited, numberVisits, lastVisit, thumbnail) VALUES (:url, :title, :visited, :numberVisits, :lastVisit, :thumbnail)");
			copyDataToDBStatement(site, stmt);
                        stmt.params.thumbnail = image;
                        stmt.executeAsync();
		},

		updateVisitedList: function(site){
			var stmt = dbConn.createStatement("UPDATE websites SET title=:title, visited=:visited, numberVisits=:numberVisits, lastVisit=:lastVisit WHERE url=:url");
			copyDataToDBStatement(site, stmt);
			stmt.executeAsync();
		},

                getThumbnail: function(url, caller, callback){
                        var stmt = dbConn.createStatement("SELECT thumbnail FROM websites WHERE url=:url");
                        stmt.params.url = url;
                        stmt.executeAsync({
                        handleResult: function(aResultSet) {
                                for (let row = aResultSet.getNextRow();
                                row;
                                row = aResultSet.getNextRow()) {
                                        callback.apply(caller, [row.getResultByName("thumbnail")]);
                                }
                        },

                        handleError: function(aError) {
                                Components.utils.reportError("Error retrieving thumbnail data from db: " + aError.message);
                        },

                        handleCompletion: function(aReason) {
                                if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED)
                                        Components.utils.reportError("Query to retrieve thumbnail data from db canceled or aborted!");
                        }
                        });
                },

		removeURLs: function(websitesToDelete){
			var stmtDelete = dbConn.createStatement("DELETE FROM websites WHERE url=:url");
                        while (websitesToDelete.length > 0){
                                var deleted = websitesToDelete.pop();
                                stmtDelete.params.url = deleted.url;
                                stmtDelete.executeAsync();
                        }
		},

		addToBlacklist: function(url) {
			var stmtDelete = dbConn.createStatement("DELETE FROM websites WHERE url=:url");
			stmtDelete.params.url = url;
			stmtDelete.executeStep();
	
			var stmt = dbConn.createStatement("INSERT INTO blacklist (url) VALUES (:url)");
			stmt.params.url = url;
			stmt.executeStep();
		},

		removeFromBlacklist: function(url) {
                        var stmt = dbConn.createStatement("DELETE FROM blacklist WHERE url=:url");
                        stmt.params.url = url;
                        stmt.executeAsync();
		},

		isBlacklisted: function(url) {
			var stmt = dbConn.createStatement("SELECT url from blacklist WHERE url=:url");
			stmt.params.url = url;
			return stmt.executeStep();
		},

                loadDataFixedList: function(loadRowFunction){
                        var statement = dbConn.createStatement(
                                "SELECT dialNumber, url, title, visited FROM fixed ORDER BY dialNumber");
                        statement.executeAsync({
                                handleResult: function(aResultSet) {
                                        for (let row = aResultSet.getNextRow();
                                        row;
                                        row = aResultSet.getNextRow()) {
                                                loadRowFunction.apply(null, [row]);
                                        }
                                },

                                handleError: function(aError) {
                                        Components.utils.reportError("Error retrieving fixed list data from db: " + aError.message);
                                },

                                handleCompletion: function(aReason) {
                                        if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED)
                                                Components.utils.reportError("Query to retrieve fixed list data from db canceled or aborted!");
                                }
                        });

                },

		addToFixedList: function(dialNumber, site, image, update) {
                        var stmt = null;
                        if (update)
                                stmt = dbConn.createStatement(
                                        "UPDATE fixed SET dialNumber=:dialNumber, title=:title, visited=:visited, thumbnail=:thumbnail WHERE url=:url");
                        else
                                stmt = dbConn.createStatement(
                                        "INSERT INTO fixed (dialNumber, url, title, visited, thumbnail) VALUES (:dialNumber, :url, :title, :visited, :thumbnail)");

                        stmt.params.dialNumber = dialNumber;
			stmt.params.url = site.url;
                        stmt.params.title = site.title;
                        stmt.params.visited = SUGESTRON.arrayToString(site.visited);
                        stmt.params.thumbnail = image;
                        stmt.executeAsync();

			if (!update){
				var stmtDelete = dbConn.createStatement("DELETE FROM websites WHERE url=:url");
                        	stmtDelete.params.url = site.url;
                        	stmtDelete.executeStep();

				this.removeFromBlacklist(site.url);	
			}
		},

		removeFromFixedList: function(dialNumber) {
			var stmt = dbConn.createStatement("DELETE FROM fixed WHERE dialNumber=:dialNumber");
                        stmt.params.dialNumber = dialNumber;
                        stmt.executeAsync();
		},

                getThumbnailFixed: function(url, caller, callback){
                        var stmt = dbConn.createStatement("SELECT thumbnail FROM fixed WHERE url=:url");
                        stmt.params.url = url;
                        stmt.executeAsync({
                        handleResult: function(aResultSet) {
                                for (let row = aResultSet.getNextRow();
                                row;
                                row = aResultSet.getNextRow()) {
                                        callback.apply(caller, [row.getResultByName("thumbnail")]);
                                }
                        },

                        handleError: function(aError) {
                                Components.utils.reportError("Error retrieving thumbnail data from db: " + aError.message);
                        },

                        handleCompletion: function(aReason) {
                                if (aReason != Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED)
                                        Components.utils.reportError("Query to retrieve thumbnail data from db fixed canceled or aborted!");
                        }
                        });
                }
	};
}
