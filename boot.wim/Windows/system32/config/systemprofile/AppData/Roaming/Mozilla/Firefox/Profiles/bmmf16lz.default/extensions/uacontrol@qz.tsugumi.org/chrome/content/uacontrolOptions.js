
var uaOptionsManager = {
	
	getString: function(sStringName)
	{
		return document.getElementById('uacontrol-strings').getString(sStringName);
	},
	
	_aUAActions: null,
	aSortKeys: null,

	// everything except '@DEFAULT' sorted lexicographically
	sortKeys: function(arr)
	{
		var ret = [];
		for (var sKey in arr) {
			if (sKey != '@DEFAULT')
				ret.push(sKey);
		}
		return ret.sort();
	},

	get aUAActions() { return this._aUAActions; },
	set aUAActions(val) {
		this._aUAActions = val;
		this.aSortKeys = this.sortKeys(this._aUAActions);
	},

	get tree() {
		return document.getElementById("actionsTree");
	},
	
	view: {
		mgr: null,		// points back to uaOptionsManager
		atomBold: null,
		
		init: function(mgr)
		{
			this.mgr = mgr;
			
			var svcAtom = Components.classes["@mozilla.org/atom-service;1"].getService(Components.interfaces.nsIAtomService);
			this.atomBold = svcAtom.getAtom("bold");
		},
		
		// Implement TreeView interface
		get rowCount()
		{
			return this.mgr.aSortKeys.length; 
		},

		getCellText: function (aRow, aColumn)
		{
			try {
				var sColumn = (aColumn.id != undefined) ? aColumn.id : aColumn;
				if (sColumn == "siteCol") {
					return this.mgr.formatSite(this.mgr.aSortKeys[aRow]);
				} else if (sColumn == "actionCol") {
					return this.mgr.formatAction(this.mgr.aUAActions[this.mgr.aSortKeys[aRow]]);
				}
			} catch (ex) {
				uacontrolMisc.dump("getCellText: " + ex);
			}
			return "";
		},
		
		isSeparator: function(aIndex) { return false; },
		isSorted: function() { return false; },
		isContainer: function(aIndex) { return false; },
		setTree: function(aTree){},
		getImageSrc: function(aRow, aColumn) {},
		getProgressMode: function(aRow, aColumn) {},
		getCellValue: function(aRow, aColumn) {},
		cycleHeader: function(aColId, aElt) {},
		getRowProperties: function(aRow, aProperty) {},
		getColumnProperties: function(aColumn, aColumnElement, aProperty) {},

		getCellProperties: function(aRow, aColumn, aProperty)
		{
			try {
				var bBold = false;
				var sColumn = (aColumn.id != undefined) ? aColumn.id : aColumn;
				var sValue;
				if (sColumn == "siteCol") {
					sValue = this.mgr.aSortKeys[aRow];
					bBold = (sValue.charAt(0) == '@');
				} else if (sColumn == "actionCol") {
					sValue = this.mgr.aUAActions[this.mgr.aSortKeys[aRow]].str;
					bBold = (sValue.charAt(0) == '@' || sValue == '');
				}
				if (bBold)
					aProperty.AppendElement(this.atomBold);
			} catch (ex) {
				uacontrolMisc.dump("getCellProperties: " + ex);
			}
		},

		get selection() {
			return (
				this._selection != undefined ? this._selection :
				this.mgr.tree.selection != undefined ? this.mgr.tree.selection : undefined);
		},
		set selection(val) { return this._selection = val; }
		// end Implement TreeView interface
	},

	getActionsToExport: function()
	{
		function myEncodeURI(sURI)
		{
			if (sURI.charAt(0) == '@')
				return sURI;
			else
				return encodeURI(sURI);
		}
		
		var aKVs = [];
		var myKeys = ['@DEFAULT'].concat(this.aSortKeys);
		for (var i = 0; i < myKeys.length; i++) {
			aKVs.push(myKeys[i] + "=" + myEncodeURI(this.aUAActions[myKeys[i]].str));
		}
		return aKVs;
	},

	getActionsFromImport: function(aActions, oldActions)
	{
		function myDecodeURI(sEncodedURI)
		{
			if (sEncodedURI.charAt(0) == '@')
				return sEncodedURI;
			try {
				return decodeURI(sEncodedURI);
			} catch (ex) {
				return sEncodedURI;
			}
		}

		var newActions = oldActions ? oldActions : [];
		for (var i in aActions) {
			var aKV = aActions[i].match(/(.*?)=(.*)/);
			if (aKV != null) {
				newActions[aKV[1]] = { str: myDecodeURI(aKV[2]) };
			}
		}
		
		return newActions;
	},
	
	getActionsFromBranch: function(oPrefBranch)
	{
		var sActions = oPrefBranch.getCharPref('actions');
		
		var oldActions = [];
		oldActions['@DEFAULT'] = { str: '@NORMAL' };	// in case it is not in the pref
		
		return this.getActionsFromImport(sActions.split(' '), oldActions);
	},
	
	getActions: function()
	{
		return this.getActionsFromBranch(uaPrefs.getPrefBranch());
	},

	onLoad: function()
	{
		try {
			this.aUAActions = this.getActions();
	
			this.view.init(this);
			this.tree.treeBoxObject.view = this.view;
			this.onActionsSelected();
			this.onDefaultChanged();
			
			if (window.arguments != undefined &&
				window.arguments[0] != undefined &&
				window.arguments[0].contextSite != undefined)
			{
				// opened from context menu
				setTimeout(function(myThis, sSite) { myThis.contextEdit(sSite); },
							0,
							this, window.arguments[0].contextSite);
//				this.contextEdit(window.arguments[0].contextSite);
			}
		} catch (ex) {
			uacontrolMisc.dump("onLoad: " + ex);
		}
	},
	
	onOK: function()
	{
		try {
			var sActions = this.getActionsToExport().join(" ");

			var prefBranch = uaPrefs.getPrefBranch();
			prefBranch.setCharPref("actions", sActions);

			return true;
		} catch (ex) {
			uacontrolMisc.dump("onOK: " + ex);
		}
		return false;
	},
	

	findRDFID: function(extDB, sID)
	{
		var prefixes = [
			"urn:mozilla:extension:", 	// Firefox 1.0.x
			"urn:mozilla:item:"			// Firefox 1.5
		];
		var rdfs = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);
		
		for (var i in prefixes) {
			var sRDFID = prefixes[i] + sID;
			if (extDB.GetTarget(rdfs.GetResource(sRDFID), 
								rdfs.GetResource("http://www.mozilla.org/2004/em-rdf#name"), 
								true) !== null)
				return sRDFID;
		}
		
		return null;
	},
	
	getLineBreak: function()
	{
		var p = navigator.platform;
		return (
			(new RegExp("win", "i").test(p) || new RegExp("os/2", "i").test(p)) ?
			"\r\n" : "\n"
		);
	},
	
	onImport: function()
	{
		var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
		fp.init(window, this.getString("ImportTitle"), fp.modeOpen);
		fp.appendFilters(fp.filterText);
		fp.appendFilters(fp.filterAll);
		
		if (fp.show() == fp.returnCancel)
			return;
		
		try {
			var fis = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
			fis.QueryInterface(Components.interfaces.nsILineInputStream);
			
			fis.init(fp.file, 
						0x01,	/* PR_RDONLY */
						0444,	/* r--r--r-- (unused?) */
						0);
			var lines = []
			var line = {};
			var eof;

			eof = !fis.readLine(line);
			if (line.value != '[UAControl]') {
				alert(this.getString("ImportInvalidFileAlert"));
				return;
			}
			
			while (!eof) {
				eof = !fis.readLine(line);
				if (line.value.charAt(0) == '[')
					break;
				if (line.value.charAt(0) == ';')
					continue;
				lines.push(line.value);
			}

			fis.close();
			
			this.aUAActions = this.getActionsFromImport(lines, this.aUAActions);
			if (this.view.selection) {
				this.view.selection.clearSelection();
				this.view.selection.currentIndex = -1;
			}
			this.tree.treeBoxObject.view = this.view;	/* refresh tree view */
			this.onDefaultChanged();					/* refresh default box, just in case */
		} catch(ex) {
			alert(this.getString("ImportErrorAlert") + ": " + ex);
		}
	},
	
	onExport: function()
	{
		var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
		fp.init(window, this.getString("ExportTitle"), fp.modeSave);
		fp.defaultExtension = "txt";
		fp.appendFilters(fp.filterText);
		fp.appendFilters(fp.filterAll);
		
		if (fp.show() == fp.returnCancel)
			return;

		try {
			var fos = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
	
			fos.init(fp.file, 
						0x02 |	/* PR_WRONLY */
						0x08 | 	/* PR_CREATE_FILE */
						0x20,	/* PR_TRUNCATE */
						0644,	/* rw-r--r-- */
						0);
			
			/* remove first entry (@DEFAULT) and add '[UAControl]' at front */
			var arrLines = ['[UAControl]'].concat(this.getActionsToExport().slice(1));
			var sLines = arrLines.join(this.getLineBreak()) + this.getLineBreak();
			fos.write(sLines, sLines.length);
			fos.close();
		} catch(ex) {
			alert(this.getString("ExportErrorAlert") + ": " + ex);
		}
	},
	
	onActionsDblClick: function(aEvent)
	{
		try {
			if (aEvent.target._lastSelectedRow != -1)
				this.onEdit();
			else
				this.onAdd();
		} catch (ex) {
			uacontrolMisc.dump("onActionsDblClick: " + ex);
		}
	},
	
	onActionsKeyPress: function(aEvent)
	{
		if (aEvent.keyCode == 46) {
			/* Delete */
			var btnRemove = document.getElementById("btnRemove");
			if (!btnRemove.disabled)
				this.onRemove();
		}
	},
	
	onActionsSelected: function()
	{
		try {
			var selection = this.view.selection;
			var btnEdit = document.getElementById("btnEdit");
			var btnRemove = document.getElementById("btnRemove");

			btnEdit.disabled   = !(selection && (selection.count == 1));
			btnRemove.disabled = !(selection && (selection.count >= 1));

		} catch (ex) {
			uacontrolMisc.dump("onActionsSelected: " + ex);
		}
	},
	
	doEdit: function(oldSite, oldIndex)
	{
		if (oldIndex != -1) {
			if (this.view.selection)
				this.view.selection.select(oldIndex);
			this.tree.treeBoxObject.ensureRowIsVisible(oldIndex);
		}

		var oldAction = (this.aUAActions[oldSite] != undefined) ? 
						this.aUAActions[oldSite] : 
						{ str: '@NORMAL' };
		var arg = { site: oldSite, action: oldAction };

		openDialog("chrome://uacontrol/content/uacontrolEdit.xul",
			"", "centerscreen,chrome,modal,resizable=no", arg);
		
		if (!arg.ret)
			return;
			
		if (arg.site != oldSite)
			delete this.aUAActions[oldSite];
		this.aUAActions[arg.site] = arg.action;

		if (oldIndex == -1 || arg.site != oldSite) {
			this.aUAActions = this.aUAActions;		// yea for hidden side-effects
			if (this.view.selection) {
				this.view.selection.clearSelection();
				// don't know why, but we need this next line if called via
				// the setTimeout for the contextEdit
				this.view.selection.currentIndex = -1;
			}
			this.tree.treeBoxObject.view = this.view;	// force total refresh
		} else {
			this.tree.treeBoxObject.invalidateRow(oldIndex);
		}

		if (arg.site == '@DEFAULT')
			this.onDefaultChanged();
	},
	
	onAdd: function()
	{
		try {
			this.doEdit("", -1);
		} catch (ex) {
			uacontrolMisc.dump("onAdd: " + ex);
		}
	},

	onEdit: function()
	{
		try {
			var selection = this.view.selection;
			var oldSite = this.aSortKeys[selection.currentIndex];
			
			this.doEdit(oldSite, selection.currentIndex);
		} catch (ex) {
			uacontrolMisc.dump("onEdit: " + ex);
		}
	},

	contextEdit: function(sSite)
	{
		try {
			this.doEdit(sSite, this.binarySearch(this.aSortKeys, sSite));
		} catch (ex) {
			uacontrolMisc.dump("contextEdit: " + ex);
		}
	},
	
	binarySearch: function(arr, searchElement, lft, rgt)
	{
		if (lft == undefined || lft < 0) lft = 0;
		if (rgt == undefined || rgt > arr.length - 1) rgt = arr.length - 1;
		
		while (lft <= rgt) {
			var mid = Math.floor((rgt + lft) / 2);
			
			if (arr[mid] < searchElement)
				lft = mid + 1;
			else if (arr[mid] > searchElement)
				rgt = mid - 1;
			else if (arr[mid] == searchElement)
				return mid;
			else
				throw "Array contains invalid elements for binary search";
		}

		return -1;
	},
	
	onRemove: function()
	{
		try {
			var selection = this.view.selection;
			var oldIndex = selection.currentIndex;

			selection.selectEventsSuppressed = true;

			// remove selected items from aUAActions
			var rangeCount = selection.getRangeCount();
			for (var range = 0; range < rangeCount; range++) {
				var min = new Object(), max = new Object();
				selection.getRangeAt(range, min, max);
				for (var i = min.value; i <= max.value; i++) {
					delete this.aUAActions[this.aSortKeys[i]];
				}
			}

			// remove references from aSortKeys and refresh tree display
			for (i = 0; i < this.aSortKeys.length; i++) {
				if (this.aUAActions[this.aSortKeys[i]] == undefined) {
					var r = i;
					while (
						r < this.aSortKeys.length &&
						this.aUAActions[this.aSortKeys[r]] == undefined
					)
						r++;
					this.aSortKeys.splice(i, r - i);
					this.tree.treeBoxObject.rowCountChanged(i, i - r);
				}
			}

			selection.selectEventsSuppressed = false;
			
			// fix selection
			if (oldIndex > this.view.rowCount - 1)
				oldIndex = this.view.rowCount - 1;
			this.view.selection.select(oldIndex);
			this.tree.treeBoxObject.ensureRowIsVisible(oldIndex);

		} catch (ex) {
			uacontrolMisc.dump("onRemove: " + ex);
		}
	},

	onRemoveAll: function()
	{
		try {
			if (!window.confirm(this.getString("ConfirmRemoveAll")))
				return;
			
			var newUAActions = {};
			var oldRowCount = this.view.rowCount;
			
			newUAActions['@DEFAULT'] = this.aUAActions['@DEFAULT'];
			this.aUAActions = newUAActions;

			this.tree.treeBoxObject.rowCountChanged(0, -oldRowCount);
			
			var selection = this.view.selection;
			if (selection)
				selection.clearSelection();
		} catch (ex) {
			uacontrolMisc.dump("onRemoveAll: " + ex);
		}
	},
	
	onDefaultChanged: function()
	{
		try {
			var txtDefault = document.getElementById("txtDefault");
			var act = this.aUAActions['@DEFAULT'];
			var bBold = (act.str.charAt(0) == '@' || act.str == '');

			txtDefault.value = this.formatAction(act);
			txtDefault.style.color = "#000000";
			txtDefault.style.fontWeight = bBold ? 'bold' : 'normal';
		} catch (ex) {
			uacontrolMisc.dump("onDefaultChanged: " + ex);
		}
	},	

	onEditDefault: function()
	{
		try {
			this.doEdit('@DEFAULT', -1);
		} catch (ex) {
			uacontrolMisc.dump("onEditDefault: " + ex);
		}
	},
	
	formatSite: function(sSite)
	{
		return (
			(sSite == '@DEFAULT') ?
				this.getString("SiteDefault") :
				sSite
		);
	},
	
	formatAction: function(act)
	{
		return (
			(act.str == '@NORMAL') ? 
				this.getString("ActionNormal") :
			(act.str == '') ?
				this.getString("ActionBlock") :
				act.str
		);
	}	
};

