/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1
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
 * The Original Code is Adblock Plus.
 *
 * The Initial Developer of the Original Code is
 * Wladimir Palant.
 * Portions created by the Initial Developer are Copyright (C) 2006-2011
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * ***** END LICENSE BLOCK ***** */

/**
 * @fileOverview Application integration module, will keep track of application
 * windows and handle the necessary events.
 */

var EXPORTED_SYMBOLS = ["AppIntegration"];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;

let baseURL = Cc["@adblockplus.org/abp/private;1"].getService(Ci.nsIURI);

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

Cu.import(baseURL.spec + "Utils.jsm");
Cu.import(baseURL.spec + "Prefs.jsm");
Cu.import(baseURL.spec + "ContentPolicy.jsm");
Cu.import(baseURL.spec + "FilterStorage.jsm");
Cu.import(baseURL.spec + "FilterClasses.jsm");
Cu.import(baseURL.spec + "SubscriptionClasses.jsm");
Cu.import(baseURL.spec + "RequestNotifier.jsm");
Cu.import(baseURL.spec + "Sync.jsm");

if (Utils.isFennec)
	Cu.import(baseURL.spec + "AppIntegrationFennec.jsm");

/**
 * Wrappers for tracked application windows.
 * @type Array of WindowWrapper
 */
let wrappers = [];

/**
 * Stores the current value of showintoolbar preference (to detect changes).
 */
let currentlyShowingInToolbar = Prefs.showintoolbar;

/**
 * Stores the selected hotkeys, initialized when the first browser window opens.
 */
let hotkeys = null;

/**
 * Initializes app integration module
 */
function init()
{
	// Process preferences
	reloadPrefs();

	// Listen for pref and filters changes
	Prefs.addListener(function(name)
	{
		if (name == "enabled" || name == "showintoolbar" || name == "showinstatusbar" || name == "defaulttoolbaraction" || name == "defaultstatusbaraction")
			reloadPrefs();
	});
	FilterStorage.addObserver(reloadPrefs);
}

/**
 * Exported app integration functions.
 * @class
 */
var AppIntegration =
{
	/**
	 * Adds an application window to the tracked list.
	 */
	addWindow: function(/**Window*/ window)
	{
		let hooks = window.document.getElementById("abp-hooks");
		if (!hooks)
			return;


		// Execute first-run actions
		if (!("lastVersion" in Prefs))
		{
			Prefs.lastVersion = Prefs.currentVersion;
	
			// Show subscriptions dialog if the user doesn't have any subscriptions yet
			if (Prefs.currentVersion != Utils.addonVersion)
			{
				Prefs.currentVersion = Utils.addonVersion;
	
				if ("nsISessionStore" in Ci)
				{
					// Have to wait for session to be restored
					let observer =
					{
						QueryInterface: XPCOMUtils.generateQI([Ci.nsIObserver]),
						observe: function(subject, topic, data)
						{
							observerService.removeObserver(observer, "sessionstore-windows-restored");
							timer.cancel();
							timer = null;
							showSubscriptions();
						}
					};
	
					let observerService = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
					observerService.addObserver(observer, "sessionstore-windows-restored", false);
	
					// Just in case, don't wait more than a second
					let timer = Cc['@mozilla.org/timer;1'].createInstance(Ci.nsITimer);
					timer.init(observer, 1000, Ci.nsITimer.TYPE_ONE_SHOT);
				}
				else
					Utils.runAsync(showSubscriptions);
			}
		}


		let wrapper = new WindowWrapper(window, hooks);
		wrappers.push(wrapper);

	},

	/**
	 * Retrieves the wrapper object corresponding to a particular application window.
	 */
	getWrapperForWindow: function(/**Window*/ wnd) /**WindowWrapper*/
	{
		for each (let wrapper in wrappers)
			if (wrapper.window == wnd)
				return wrapper;

		return null;
	},

	/**
	 * Toggles the value of a boolean preference.
	 */
	togglePref: function(/**String*/ pref)
	{
		Prefs[pref] = !Prefs[pref];
	},

	/**
	 * Toggles the pref for the Adblock Lite sync engine.
	 */
	toggleSync: function()
	{
		let syncEngine = Sync.getEngine();
		syncEngine.enabled = !syncEngine.enabled;
	},
	
	/**
	 * If the given filter is already in user's list, removes it from the list. Otherwise adds it.
	 */
	toggleFilter: function(/**Filter*/ filter)
	{
		if (filter.subscriptions.length)
		{
			if (filter.disabled || filter.subscriptions.some(function(subscription) !(subscription instanceof SpecialSubscription)))
			{
				filter.disabled = !filter.disabled;
				FilterStorage.triggerObservers(filter.disabled ? "filters disable" : "filters enable", [filter]);
			}
			else
				FilterStorage.removeFilter(filter);
		}
		else
			FilterStorage.addFilter(filter);
		FilterStorage.saveToDisk();
	}
};

/**
 * Removes an application window from the tracked list.
 */
function removeWindow()
{
	let wnd = this;

	for (let i = 0; i < wrappers.length; i++)
		if (wrappers[i].window == wnd)
			wrappers.splice(i--, 1);
}

/**
 * Class providing various functions related to application windows.
 * @constructor
 */
function WindowWrapper(window, hooks)
{

	this.window = window;

	this.initializeHooks(hooks);


	if (!Utils.isFennec)
	{
		this.fixupMenus();


		this.configureKeys();


		this.initContextMenu();


		let browser = this.getBrowser();
		if (browser && browser.currentURI)
		{
			this.updateState();
		}
		else
		{
			// Update state asynchronously, the Thunderbird window won't be initialized yet for non-default window layouts
			Utils.runAsync(this.updateState, this);
		}


		// Some people actually switch off browser.frames.enabled and are surprised
		// that things stop working...
		window.QueryInterface(Ci.nsIInterfaceRequestor)
					.getInterface(Ci.nsIWebNavigation)
					.QueryInterface(Ci.nsIDocShell)
					.allowSubframes = true;
	}
	this.registerEventListeners(!Utils.isFennec);


	this.executeFirstRunActions();


	// Custom initialization for Fennec
	if (Utils.isFennec)
		AppIntegrationFennec.initWindow(this);


}
WindowWrapper.prototype =
{
	/**
	 * Application window this object belongs to.
	 * @type Window
	 */
	window: null,

	/**
	 * Current state as displayed for this window.
	 * @type String
	 */
	state: null,

	/**
	 * Methods that can be defined at attributes of the hooks element.
	 * @type Array of String
	 */
	customMethods: ["getBrowser", "addTab", "getContextMenu", "getToolbox", "getDefaultToolbar", "toolbarInsertBefore", "unhideToolbar"],

	/**
	 * Progress listener used to watch for location changes, if any.
	 * @type nsIProgressListener
	 */
	progressListener: null,

	/**
	 * Filter corresponding with "disable on site" menu item (set in fillPopup()).
	 * @type Filter
	 */
	siteWhitelist: null,
	/**
	 * Filter corresponding with "disable on site" menu item (set in fillPopup()).
	 * @type Filter
	 */
	pageWhitelist: null,

	/**
	 * Data associated with the node currently under mouse pointer (set in updateContextMenu()).
	 * @type RequestEntry
	 */
	nodeData: null,
	/**
	 * The document node that nodeData belongs to.
	 */
	currentNode: null,
	/**
	 * Data associated with the background image currently under mouse pointer (set in updateContextMenu()).
	 * @type RequestEntry
	 */
	backgroundData: null,
	/**
	 * Data associated with the frame currently under mouse pointer (set in updateContextMenu()).
	 * @type RequestEntry
	 */
	frameData: null,
	/**
	 * The frame that frameData belongs to.
	 */
	currentFrame: null,

	/**
	 * Window of the detached list of blockable items (might be null or closed).
	 * @type Window 
	 */
	detachedSidebar: null,

	/**
	 * Binds a function to the object, ensuring that "this" pointer is always set
	 * correctly.
	 */
	_bindMethod: function(/**Function*/ method) /**Function*/
	{
		let me = this;
		return function() method.apply(me, arguments);
	},

	/**
	 * Retrieves an element by its ID.
	 */
	E: function(/**String*/ id)
	{
		let doc = this.window.document;
		this.E = function(id) doc.getElementById(id);
		return this.E(id);
	},

	/**
	 * Initializes abp-hooks element, converts any function attributes to actual
	 * functions.
	 */
	initializeHooks: function(hooks)
	{
		for each (let hook in this.customMethods)
		{
			let handler = hooks.getAttribute(hook);
			this[hook] = hooks[hook] = (handler ? this._bindMethod(new Function(handler)) : null);
		}
	},

	/**
	 * Makes a copy of the ABP icon's context menu for the toolbar button.
	 */
	fixupMenus: function()
	{
		function fixId(node)
		{
			if (node.nodeType == node.ELEMENT_NODE)
			{
				if (node.hasAttribute("id"))
					node.setAttribute("id", node.getAttribute("id").replace(/abp-status/, "abp-toolbar"));
		
				for (let i = 0, len = node.childNodes.length; i < len; i++)
					fixId(node.childNodes[i]);
			}
			return node;
		}
	
		let menuSource = this.E("abp-status-popup");
		let paletteButton = this.getPaletteButton();
		let toolbarButton = this.E("abp-toolbarbutton");
		if (toolbarButton)
			toolbarButton.appendChild(fixId(menuSource.cloneNode(true)));
		if (paletteButton && paletteButton != toolbarButton)
			paletteButton.appendChild(fixId(menuSource.cloneNode(true)));
	},
	
	/**
	 * Attaches event listeners to a window represented by hooks element
	 */
	registerEventListeners: function(/**Boolean*/ addProgressListener)
	{
		// Palette button elements aren't reachable by ID, create a lookup table
		let paletteButtonIDs = {};
		let paletteButton = this.getPaletteButton();
		if (paletteButton)
		{
			function getElementIds(element)
			{
				if (element.hasAttribute("id"))
					paletteButtonIDs[element.getAttribute("id")] = element;
	
				for (let child = element.firstChild; child; child = child.nextSibling)
					if (child.nodeType == Ci.nsIDOMNode.ELEMENT_NODE)
						getElementIds(child);
			}
			getElementIds(paletteButton);
		}
	
		// Go on and register listeners
		this.window.addEventListener("unload", removeWindow, false);
		for each (let [id, event, handler] in this.eventHandlers)
		{
			handler = this._bindMethod(handler);

			let element = this.E(id);
			if (element)
				element.addEventListener(event, handler, false);
	
			if (id in paletteButtonIDs)
				paletteButtonIDs[id].addEventListener(event, handler, false);
		}
	
		let browser = this.getBrowser();
		browser.addEventListener("click", this._bindMethod(this.handleLinkClick), true);

		// Register progress listener as well if requested
		if (addProgressListener)
		{
			let dummy = function() {};
			this.progressListener =
			{
				onLocationChange: this._bindMethod(this.updateState),
				onProgressChange: dummy,
				onSecurityChange: dummy,
				onStateChange: dummy,
				onStatusChange: dummy,
				QueryInterface: XPCOMUtils.generateQI([Ci.nsIWebProgressListener, Ci.nsISupportsWeakReference])
			};
			browser.addProgressListener(this.progressListener);
		}
	},

	/**
	 * Retrieves the current location of the browser (might return null on failure).
	 */
	getCurrentLocation: function() /**nsIURI*/
	{
		if ("currentHeaderData" in this.window && "content-base" in this.window.currentHeaderData)
		{
			// Thunderbird blog entry
			return Utils.unwrapURL(this.window.currentHeaderData["content-base"].headerValue);
		}
		else if ("currentHeaderData" in this.window && "from" in this.window.currentHeaderData)
		{
			// Thunderbird mail/newsgroup entry
			try
			{
				let headerParser = Cc["@mozilla.org/messenger/headerparser;1"].getService(Ci.nsIMsgHeaderParser);
				let emailAddress = headerParser.extractHeaderAddressMailboxes(this.window.currentHeaderData.from.headerValue);
				return Utils.makeURI("mailto:" + emailAddress.replace(/^[\s"]+/, "").replace(/[\s"]+$/, "").replace(/\s/g, "%20"));
			}
			catch(e)
			{
				return null;
			}
		}
		else
		{
			// Regular browser
			return Utils.unwrapURL(this.getBrowser().currentURI.clone());
		}
	},

	/**
	 * Executes window-specific first-run actions if necessary.
	 */
	executeFirstRunActions: function()
	{
		// Only execute first-run actions for this window once
		if ("doneFirstRunActions " + this.window.location.href in Prefs)
			return;
		Prefs["doneFirstRunActions " + this.window.location.href] = true;

		// Check version we previously executed first-run actions for;
		let hooks = this.E("abp-hooks");
		let lastVersion = hooks.getAttribute("currentVersion") || "0.0";
		if (lastVersion != Prefs.currentVersion)
		{
			hooks.setAttribute("currentVersion", Prefs.currentVersion);
			this.window.document.persist("abp-hooks", "currentVersion");

			let needInstall = (Utils.versionComparator.compare(lastVersion, "0.0") <= 0);
			if (!needInstall)
			{
				// Before version 1.1 we didn't add toolbar icon in SeaMonkey, do it now
				needInstall = Utils.appID == "{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}" &&
											Utils.versionComparator.compare(lastVersion, "1.1") < 0;
			}

			// Add ABP icon to toolbar if necessary
			if (needInstall)
				Utils.runAsync(this.installToolbarIcon, this);
		}
	},

	/**
	 * Finds the toolbar button in the toolbar palette.
	 */
	getPaletteButton: function()
	{
		let toolbox = (this.getToolbox ? this.getToolbox() : null);
		if (!toolbox || !("palette" in toolbox) || !toolbox.palette)
			return null;
	
		for (var child = toolbox.palette.firstChild; child; child = child.nextSibling)
			if (child.id == "abp-toolbarbutton")
				return child;
	
		return null;
	},

	/**
	 * Updates displayed state for an application window.
	 */
	updateState: function()
	{
		let state = (Prefs.enabled ? "active" : "disabled");
	
		if (state == "active")
		{
			let location = this.getCurrentLocation();
			if (location && Policy.isWhitelisted(location.spec))
				state = "whitelisted";
		}
		this.state = state;
	
		function updateElement(element)
		{
			if (!element)
				return;
	
			if (element.tagName == "statusbarpanel")
				element.hidden = !Prefs.showinstatusbar;
			else
			{
				element.hidden = !Prefs.showintoolbar;
				if (element.hasAttribute("context") && Prefs.defaulttoolbaraction == 0)
					element.setAttribute("type", "menu");
				else
					element.setAttribute("type", "menu-button");
			}

			// HACKHACK: Show status bar icon instead of toolbar icon if the application doesn't have a toolbar icon
			if (element.hidden && element.tagName == "statusbarpanel" && !this.getDefaultToolbar)
				element.hidden = !Prefs.showintoolbar;
	
			element.setAttribute("abpstate", state);
		};
	
		let status = this.E("abp-status");
		if (status)
		{
			updateElement.call(this, status);
			if (Prefs.defaultstatusbaraction == 0)
				status.setAttribute("popup", status.getAttribute("context"));
			else
				status.removeAttribute("popup");
		}
		
		let button = this.E("abp-toolbarbutton");
		if (button)
			updateElement.call(this, button);
	
		updateElement.call(this, this.getPaletteButton());
	},

	/**
	 * Sets up hotkeys for the window.
	 */
	configureKeys: function()
	{
		if (!hotkeys)
		{
			hotkeys = {__proto__: null};

			let validModifiers =
			{
				accel: 1,
				shift: 2,
				ctrl: 4,
				control: 4,
				alt: 8,
				meta: 16,
				__proto__: null
			};

			try
			{
				let accelKey = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch).getIntPref("ui.key.accelKey");
				if (accelKey == Ci.nsIDOMKeyEvent.DOM_VK_CONTROL)
					validModifiers.ctrl = validModifiers.control = validModifiers.accel;
				else if (accelKey == Ci.nsIDOMKeyEvent.DOM_VK_ALT)
					validModifiers.alt = validModifiers.accel;
				else if (accelKey == Ci.nsIDOMKeyEvent.DOM_VK_META)
					validModifiers.meta = validModifiers.accel;
			}
			catch(e)
			{
				Cu.reportError(e);
			}

			// Find which hotkeys are already taken, convert them to canonical form
			let existing = {};
			let keys = this.window.document.getElementsByTagName("key");
			for (let i = 0; i < keys.length; i++)
			{
				let key = keys[i];
				let keyChar = key.getAttribute("key");
				let keyCode = key.getAttribute("keycode");
				if (!keyChar && !keyCode)
					continue;

				let modifiers = 0;
				let keyModifiers = key.getAttribute("modifiers");
				if (keyModifiers)
				{
					for each (let modifier in keyModifiers.match(/\w+/g))
					{
						modifier = modifier.toLowerCase();
						if (modifier in validModifiers)
							modifiers |= validModifiers[modifier]
					}

					let canonical = modifiers + " " + (keyChar || keyCode).toUpperCase();
					existing[canonical] = true;
				}
			}

			// Find available keys for our prefs
			for (let pref in Prefs)
			{
				if (/_key$/.test(pref) && typeof Prefs[pref] == "string")
				{
					try
					{
						let id = RegExp.leftContext;
						let result = this.findAvailableKey(id, Prefs[pref], validModifiers, existing);
						if (result)
							hotkeys[id] = result;
					}
					catch (e)
					{
						Cu.reportError(e);
					}
				}
			}
		}

		// Add elements for all configured hotkeys
		for (let id in hotkeys)
		{
			let [keychar, keycode, modifierString] = hotkeys[id];

			let element = this.window.document.createElement("key");
			element.setAttribute("id", "abp-key-" + id);
			element.setAttribute("command", "abp-command-" + id);
			if (keychar)
				element.setAttribute("key", keychar);
			else
				element.setAttribute("keycode", keycode);
			element.setAttribute("modifiers", modifierString);

			this.E("abp-keyset").appendChild(element);
		}
	},

	/**
	 * Finds an available hotkey for a value defined in preferences.
	 */
	findAvailableKey: function(/**String*/ id, /**String*/ value, /**Object*/ validModifiers, /**Object*/ existing) /**Array*/
	{
		let command = this.E("abp-command-" + id);
		if (!command)
			return;
	
		for each (let variant in value.split(/\s*,\s*/))
		{
			if (!variant)
				continue;

			let modifiers = 0;
			let keychar = null;
			let keycode = null;
			for each (let part in variant.split(/\s+/))
			{
				if (part.toLowerCase() in validModifiers)
					modifiers |= validModifiers[part.toLowerCase()];
				else if (part.length == 1)
					keychar = part.toUpperCase();
				else if ("DOM_VK_" + part.toUpperCase() in Ci.nsIDOMKeyEvent)
					keycode = "VK_" + part.toUpperCase();
			}

			if (!keychar && !keycode)
				continue;

			let canonical = modifiers + " " + (keychar || keycode);
			if (canonical in existing)
				continue;

			let modifierString = "";
			for each (let modifier in ["accel", "shift", "control", "alt", "meta"])
			{
				if (modifiers & validModifiers[modifier])
				{
					modifierString += modifier + " ";
					modifiers &= ~validModifiers[modifier];
				}
			}
			return [keychar, keycode, modifierString];
		}
		return null;
	},

	/**
	 * Initializes window's context menu.
	 */
	initContextMenu: function()
	{
		let contextMenu = this.getContextMenu();
		if (contextMenu)
		{
			contextMenu.addEventListener("popupshowing", this._bindMethod(this.updateContextMenu), false);
			contextMenu.addEventListener("popuphidden", this._bindMethod(this.clearContextMenu), false);
			
		
			// Make sure our context menu items are at the bottom
			contextMenu.appendChild(this.E("abp-removeWhitelist-menuitem"));
			contextMenu.appendChild(this.E("abp-frame-menuitem"));
			contextMenu.appendChild(this.E("abp-object-menuitem"));
			contextMenu.appendChild(this.E("abp-media-menuitem"));
			contextMenu.appendChild(this.E("abp-image-menuitem"));
		}
	},

	/**
	 * Makes sure the toolbar button is displayed.
	 */
	installToolbarIcon: function()
	{
		let tb = this.E("abp-toolbarbutton");
		if (tb && tb.parentNode.localName != "toolbarpalette")
			return;

		let toolbar = (this.getDefaultToolbar ? this.getDefaultToolbar() : null);
		if (!toolbar || typeof toolbar.insertItem != "function")
			return;

		let insertBefore = (this.toolbarInsertBefore ? this.toolbarInsertBefore() : null);
		if (insertBefore && insertBefore.parentNode != toolbar)
			insertBefore = null;

		toolbar.insertItem("abp-toolbarbutton", insertBefore, null, false);

		toolbar.setAttribute("currentset", toolbar.currentSet);
		this.window.document.persist(toolbar.id, "currentset");

		if (this.unhideToolbar && this.unhideToolbar())
		{
			toolbar.setAttribute("collapsed", "false");
			this.window.document.persist(toolbar.id, "collapsed");
		}
	},

	/**
	 * Handles browser clicks to intercept clicks on abp: links. This can be
	 * called either with an event object or with the link target (if it is the
	 * former then link target will be retrieved from event target).
	 */
	handleLinkClick: function (/**Event*/ event, /**String*/ linkTarget)
	{
		if (event)
		{
			// Ignore right-clicks
			if (event.button == 2)
				return;

			// Search the link associated with the click
			let link = event.target;
			while (link && !(link instanceof Ci.nsIDOMHTMLAnchorElement))
				link = link.parentNode;

			if (!link || link.protocol != "abp:")
				return;

			// This is our link - make sure the browser doesn't handle it
			event.preventDefault();
			event.stopPropagation();

			linkTarget = link.href;
		}

		if (!/^abp:\/*subscribe\/*\?(.*)/i.test(linkTarget))  /**/
			return;
	
		// Decode URL parameters
		let title = null;
		let url = null;
		let mainSubscriptionTitle = null;
		let mainSubscriptionURL = null;
		for each (let param in RegExp.$1.split('&'))
		{
			let parts = param.split("=", 2);
			if (parts.length != 2 || !/\S/.test(parts[1]))
				continue;
			switch (parts[0])
			{
				case "title":
					title = decodeURIComponent(parts[1]);
					break;
				case "location":
					url = decodeURIComponent(parts[1]);
					break;
				case "requiresTitle":
					mainSubscriptionTitle = decodeURIComponent(parts[1]);
					break;
				case "requiresLocation":
					mainSubscriptionURL = decodeURIComponent(parts[1]);
					break;
			}
		}
		if (!url)
			return;
	
		// Default title to the URL
		if (!title)
			title = url;
	
		// Main subscription needs both title and URL
		if (mainSubscriptionTitle && !mainSubscriptionURL)
			mainSubscriptionTitle = null;
		if (mainSubscriptionURL && !mainSubscriptionTitle)
			mainSubscriptionURL = null;
	
		// Trim spaces in title and URL
		title = title.replace(/^\s+/, "").replace(/\s+$/, "");
		url = url.replace(/^\s+/, "").replace(/\s+$/, "");
		if (mainSubscriptionURL)
		{
			mainSubscriptionTitle = mainSubscriptionTitle.replace(/^\s+/, "").replace(/\s+$/, "");
			mainSubscriptionURL = mainSubscriptionURL.replace(/^\s+/, "").replace(/\s+$/, "");
		}
	
		// Verify that the URL is valid
		url = Utils.makeURI(url);
		if (!url || (url.scheme != "http" && url.scheme != "https" && url.scheme != "ftp"))
			return;
		url = url.spec;
	
		if (mainSubscriptionURL)
		{
			mainSubscriptionURL = Utils.makeURI(mainSubscriptionURL);
			if (!mainSubscriptionURL || (mainSubscriptionURL.scheme != "http" && mainSubscriptionURL.scheme != "https" && mainSubscriptionURL.scheme != "ftp"))
				mainSubscriptionURL = mainSubscriptionTitle = null;
			else
				mainSubscriptionURL = mainSubscriptionURL.spec;
		}
	
		// Open dialog
		if (!Utils.isFennec)
		{
			let subscription = {url: url, title: title, disabled: false, external: false, autoDownload: true,
													mainSubscriptionTitle: mainSubscriptionTitle, mainSubscriptionURL: mainSubscriptionURL};
			this.window.openDialog("chrome://adblocklite/content/ui/subscriptionSelection.xul", "_blank",
														 "chrome,centerscreen,resizable,dialog=no", subscription, null);
		}
		else
		{
			// Special handling for Fennec
			AppIntegrationFennec.openFennecSubscriptionDialog(this, url, title);
		}
	},

	/**
	 * Updates state of the icon tooltip.
	 */
	fillTooltip: function(/**Event*/ event)
	{
		let node = this.window.document.tooltipNode;
		if (!node || !node.hasAttribute("tooltip"))
		{
			event.preventDefault();
			return;
		}
	
		let type = (node.id == "abp-toolbarbutton" ? "toolbar" : "statusbar");
		let action = parseInt(Prefs["default" + type + "action"]);
		if (isNaN(action))
			action = -1;
	
		let actionDescr = this.E("abp-tooltip-action");
		actionDescr.hidden = (action < 0 || action > 3);
		if (!actionDescr.hidden)
			actionDescr.setAttribute("value", Utils.getString("action" + action + "_tooltip"));
	
		let statusDescr = this.E("abp-tooltip-status");
		let statusStr = Utils.getString(this.state + "_tooltip");
		if (this.state == "active")
		{
			let [activeSubscriptions, activeFilters] = FilterStorage.subscriptions.reduce(function([subscriptions, filters], current)
			{
				if (current instanceof SpecialSubscription)
					return [subscriptions, filters + current.filters.filter(function(filter) !filter.disabled).length];
				else if (!current.disabled)
					return [subscriptions + 1, filters];
				else
					return [subscriptions, filters]
			}, [0, 0]);
	
			statusStr = statusStr.replace(/\?1\?/, activeSubscriptions).replace(/\?2\?/, activeFilters);
		}
		statusDescr.setAttribute("value", statusStr);
	
		let activeFilters = [];
		this.E("abp-tooltip-blocked-label").hidden = (this.state != "active");
		this.E("abp-tooltip-blocked").hidden = (this.state != "active");
		if (this.state == "active")
		{
			let stats = RequestNotifier.getWindowStatistics(this.getBrowser().contentWindow);
	
			let blockedStr = Utils.getString("blocked_count_tooltip");
			blockedStr = blockedStr.replace(/\?1\?/, stats ? stats.blocked : 0).replace(/\?2\?/, stats ? stats.items : 0);
	
			if (stats && stats.whitelisted + stats.hidden)
			{
				blockedStr += " " + Utils.getString("blocked_count_addendum");
				blockedStr = blockedStr.replace(/\?1\?/, stats.whitelisted).replace(/\?2\?/, stats.hidden);
			}
	
			this.E("abp-tooltip-blocked").setAttribute("value", blockedStr);

			if (stats)
			{
				let filterSort = function(a, b)
				{
					return stats.filters[b] - stats.filters[a];
				};
				for (let filter in stats.filters)
					activeFilters.push(filter);
				activeFilters = activeFilters.sort(filterSort);
			}
	
			if (activeFilters.length > 0)
			{
				let filtersContainer = this.E("abp-tooltip-filters");
				while (filtersContainer.firstChild)
					filtersContainer.removeChild(filtersContainer.firstChild);
		
				for (let i = 0; i < activeFilters.length && i < 3; i++)
				{
					let descr = filtersContainer.ownerDocument.createElement("description");
					descr.setAttribute("value", activeFilters[i] + " (" + stats.filters[activeFilters[i]] + ")");
					filtersContainer.appendChild(descr);
				}
			}
		}
	
		this.E("abp-tooltip-filters-label").hidden = (activeFilters.length == 0);
		this.E("abp-tooltip-filters").hidden = (activeFilters.length == 0);
		this.E("abp-tooltip-more-filters").hidden = (activeFilters.length <= 3);
	},

	/**
	 * Updates state of the icon context menu.
	 */
	fillPopup: function(/**Event*/ event)
	{
		let popup = event.target;
	
		// Submenu being opened - ignore
		if (!/^(abp-(?:toolbar|status)-)popup$/.test(popup.getAttribute("id")))
			return;
		let prefix = RegExp.$1;
	
		let sidebarOpen = this.isSidebarOpen();
		this.E(prefix + "opensidebar").hidden = sidebarOpen;
		this.E(prefix + "closesidebar").hidden = !sidebarOpen;
	
		let whitelistItemSite = this.E(prefix + "whitelistsite");
		let whitelistItemPage = this.E(prefix + "whitelistpage");
		whitelistItemSite.hidden = whitelistItemPage.hidden = true;
	
		let location = this.getCurrentLocation();
		if (location && Policy.isBlockableScheme(location))
		{
			let host = null;
			try
			{
				host = location.host.replace(/^www\./, "");
			} catch (e) {}
	
			if (host)
			{
				let ending = "|";
				if (location instanceof Ci.nsIURL && location.ref)
					location.ref = "";
				if (location instanceof Ci.nsIURL && location.query)
				{
					location.query = "";
					ending = "?";
				}
	
				this.siteWhitelist = Filter.fromText("@@||" + host + "^$document");
				whitelistItemSite.setAttribute("checked", this.siteWhitelist.subscriptions.length && !this.siteWhitelist.disabled);
				whitelistItemSite.setAttribute("label", whitelistItemSite.getAttribute("labeltempl").replace(/\?1\?/, host));
				whitelistItemSite.hidden = false;
	
				this.pageWhitelist = Filter.fromText("@@|" + location.spec + ending + "$document");
				whitelistItemPage.setAttribute("checked", this.pageWhitelist.subscriptions.length && !this.pageWhitelist.disabled);
				whitelistItemPage.hidden = false;
			}
			else
			{
				this.siteWhitelist = Filter.fromText("@@|" + location.spec + "|");
				whitelistItemSite.setAttribute("checked", this.siteWhitelist.subscriptions.length && !this.siteWhitelist.disabled);
				whitelistItemSite.setAttribute("label", whitelistItemSite.getAttribute("labeltempl").replace(/\?1\?/, location.spec.replace(/^mailto:/, "")));
				whitelistItemSite.hidden = false;
			}
		}

		this.E("abp-command-sendReport").setAttribute("disabled", !location || !Policy.isBlockableScheme(location) || location.scheme == "mailto");
	
		this.E(prefix + "disabled").setAttribute("checked", !Prefs.enabled);
		this.E(prefix + "frameobjects").setAttribute("checked", Prefs.frameobjects);
		this.E(prefix + "slowcollapse").setAttribute("checked", !Prefs.fastcollapse);
		this.E(prefix + "showintoolbar").setAttribute("checked", Prefs.showintoolbar);
		this.E(prefix + "showinstatusbar").setAttribute("checked", Prefs.showinstatusbar);
	
		let syncEngine = Sync.getEngine();
		this.E(prefix + "sync").hidden = !syncEngine;
		this.E(prefix + "sync").setAttribute("checked", syncEngine && syncEngine.enabled);

		let defAction = (prefix == "abp-toolbar-" || this.window.document.popupNode.id == "abp-toolbarbutton" ?
										 Prefs.defaulttoolbaraction :
										 Prefs.defaultstatusbaraction);
		this.E(prefix + "opensidebar").setAttribute("default", defAction == 1);
		this.E(prefix + "closesidebar").setAttribute("default", defAction == 1);
		this.E(prefix + "settings").setAttribute("default", defAction == 2);
		this.E(prefix + "disabled").setAttribute("default", defAction == 3);    
	},

	/**
	 * Opens report wizard for the current page.
	 */
	openReportDialog: function()
	{
		let wnd = Utils.windowMediator.getMostRecentWindow("abp:sendReport");
		if (wnd)
			wnd.focus();
		else
			this.window.openDialog("chrome://adblocklite/content/ui/sendReport.xul", "_blank", "chrome,centerscreen,resizable=no", this.window.content, this.getCurrentLocation());
	},

	/**
	 * Opens our contribution page.
	 */
	openContributePage: function()
	{
		Utils.loadDocLink("contribute");
	},

	/**
	 * Hide contribute button and persist this choice.
	 */
		hideContributeButton: function(event)
		{ 

		for each (let button in [this.E("abp-status-contributebutton"), this.E("abp-toolbar-contributebutton")])
		{
			if (button)
			{      
				button.setAttribute("hidden", "true");
				this.window.document.persist(button.id, "hidden");
			}
		}        
	},

	/**
	 * Tests whether blockable items list is currently open.
	 */
	isSidebarOpen: function() //Boolean
	{
		if (this.detachedSidebar && !this.detachedSidebar.closed)
			return true;
	
		let sidebar = this.E("abp-sidebar");
		return (sidebar ? !sidebar.hidden : false);
	},

	/**
	 * Toggles open/closed state of the blockable items list.
	 */
	toggleSidebar: function()
	{
		if (this.detachedSidebar && !this.detachedSidebar.closed)
		{
			this.detachedSidebar.close();
			this.detachedSidebar = null;
		}
		else
		{
			let sidebar = this.E("abp-sidebar");
			if (sidebar && (!Prefs.detachsidebar || !sidebar.hidden))
			{
				this.E("abp-sidebar-splitter").hidden = !sidebar.hidden;
				this.E("abp-sidebar-browser").setAttribute("src", sidebar.hidden ? "chrome://adblocklite/content/ui/sidebar.xul" : "about:blank");
				sidebar.hidden = !sidebar.hidden;
				if (sidebar.hidden)
					this.getBrowser().contentWindow.focus();
			}
			else
				this.detachedSidebar = this.window.openDialog("chrome://adblocklite/content/ui/sidebarDetached.xul", "_blank", "chrome,resizable,dependent,dialog=no");
		}
	
		let menuItem = this.E("abp-blockableitems");
		if (menuItem)
			menuItem.setAttribute("checked", this.isSidebarOpen());
	},

	/**
	 * Removes/disables the exception rule applying for the current page.
	 */
	removeWhitelist: function()
	{
		let location = this.getCurrentLocation();
		let filter = null;
		if (location)
			filter = Policy.isWhitelisted(location.spec);
		if (filter && filter.subscriptions.length && !filter.disabled)
		{
			AppIntegration.toggleFilter(filter);
			return true;
		}
		return false;
	},

	/**
	 * Handles command events on toolbar icon.
	 */
	handleToolbarCommand: function(event)
	{
		if (event.eventPhase != event.AT_TARGET)
			return;

		if (Prefs.defaulttoolbaraction == 0)
			event.target.open = true;
		else
			this.executeAction(Prefs.defaulttoolbaraction);
	},

	/**
	 * Handles click events on toolbar icon.
	 */
	handleToolbarClick: function(/**Event*/ event)
	{
		if (event.eventPhase != event.AT_TARGET)
			return;

		if (event.button == 1)
			this.executeAction(3);
	},

	/**
	 * Handles click events on status bar icon.
	 */
	handleStatusClick: function(/**Event*/ event)
	{
		if (event.eventPhase != event.AT_TARGET)
			return;

		if (event.button == 0)
			this.executeAction(Prefs.defaultstatusbaraction);
		else if (event.button == 1)
			this.executeAction(3);
	},

	// Executes default action for statusbar/toolbar by its number
	executeAction: function (action)
	{
		if (action == 1)
			this.toggleSidebar();
		else if (action == 2)
			Utils.openSettingsDialog();
		else if (action == 3)
		{
			// If there is a whitelisting rule for current page - remove it (reenable).
			// Otherwise flip "enabled" pref.
			if (!this.removeWhitelist())
				AppIntegration.togglePref("enabled");
		}
	},

	/**
	 * Updates context menu, in particularly controls the visibility of context
	 * menu items like "Block image".
	 */
	updateContextMenu: function(event)
	{
		if (event.eventPhase != event.AT_TARGET)
			return;

		let contextMenu = this.getContextMenu();
		let target = this.window.document.popupNode;
		if (target instanceof Ci.nsIDOMHTMLMapElement || target instanceof Ci.nsIDOMHTMLAreaElement)
		{
			// HTML image maps will usually receive events when the mouse pointer is
			// over a different element, get the real event target.
			let rect = target.getClientRects()[0];
			target = target.ownerDocument.elementFromPoint(Math.max(rect.left, 0), Math.max(rect.top, 0));
		}

		let nodeType = null;
		this.nodeData = null;
		this.currentNode = null;
		this.backgroundData = null;
		this.frameData = null;
		this.currentFrame = null;
		if (target)
		{
			// Lookup the node in our stored data
			let data = RequestNotifier.getDataForNode(target);
			if (data && !data[1].filter)
			{
				[this.currentNode, this.nodeData] = data;
				nodeType = this.nodeData.typeDescr;
			}
	
			let wnd = Utils.getWindow(target);

			if (wnd.frameElement)
			{
				let data = RequestNotifier.getDataForNode(wnd.frameElement, true);
				if (data && !data[1].filter)
					[this.currentFrame, this.frameData] = data;
			}

			if (nodeType != "IMAGE")
			{
				// Look for a background image
				let imageNode = target;
				while (imageNode)
				{
					if (imageNode.nodeType == imageNode.ELEMENT_NODE)
					{
						let style = wnd.getComputedStyle(imageNode, "");
						let bgImage = extractImageURL(style, "background-image") || extractImageURL(style, "list-style-image");
						if (bgImage)
						{
							let data = RequestNotifier.getDataForNode(wnd.document, true, Policy.type.IMAGE, bgImage);
							if (data && !data[1].filter)
							{
								this.backgroundData = data[1];
								break;
							}
						}
					}

					imageNode = imageNode.parentNode;
				}
			}
	
			// Hide "Block Images from ..." if hideimagemanager pref is true and the image manager isn't already blocking something
			let imgManagerContext = this.E("context-blockimage");
			if (imgManagerContext && shouldHideImageManager())
			{
				// Don't use "hidden" attribute - it might be overridden by the default popupshowing handler
				imgManagerContext.collapsed = true;
			}
		}
	
		this.E("abp-image-menuitem").hidden = (nodeType != "IMAGE" && this.backgroundData == null);
		this.E("abp-object-menuitem").hidden = (nodeType != "OBJECT");
		this.E("abp-media-menuitem").hidden = (nodeType != "MEDIA");
		this.E("abp-frame-menuitem").hidden = (this.frameData == null);
	
		let location = this.getCurrentLocation();
		this.E("abp-removeWhitelist-menuitem").hidden = (!location || !Policy.isWhitelisted(location.spec));
	},

	
	 //Clears context menu data once the menu is closed.
	 
	clearContextMenu: function(event)
	{
		if (event.eventPhase != event.AT_TARGET)
			return;
		this.nodeData = null;
		this.currentNode = null;
		this.backgroundData = null;
		this.frameData = null;
		this.currentFrame = null;
	},

	
	 //Brings up the filter composer dialog to block an item.
	 
	blockItem: function(/**Node*/ node, /**RequestEntry*/ item)
	{
		if (!item)
			return;

		this.window.openDialog("chrome://adblocklite/content/ui/composer.xul", "_blank", "chrome,centerscreen,resizable,dialog=no,dependent", [node], item);
	}
};

/**
 * List of event handers to be registered. For each event handler the element ID,
 * event and the actual event handler are listed.
 * @type Array
 */
WindowWrapper.prototype.eventHandlers = [
	["abp-tooltip", "popupshowing", WindowWrapper.prototype.fillTooltip],
	["abp-status-popup", "popupshowing", WindowWrapper.prototype.fillPopup],
	["abp-toolbar-popup", "popupshowing", WindowWrapper.prototype.fillPopup],
	["abp-command-sendReport", "command", WindowWrapper.prototype.openReportDialog],
	["abp-command-settings", "command", function() {Utils.openSettingsDialog();}],
	["abp-command-sidebar", "command", WindowWrapper.prototype.toggleSidebar],
	["abp-command-togglesitewhitelist", "command", function() { AppIntegration.toggleFilter(this.siteWhitelist); }],
	["abp-command-togglepagewhitelist", "command", function() { AppIntegration.toggleFilter(this.pageWhitelist); }],
	["abp-command-toggleobjtabs", "command", function() { AppIntegration.togglePref("frameobjects"); }],
	["abp-command-togglecollapse", "command", function() { AppIntegration.togglePref("fastcollapse"); }],
	["abp-command-togglesync", "command", AppIntegration.toggleSync],
	["abp-command-toggleshowintoolbar", "command", function() { AppIntegration.togglePref("showintoolbar"); }],
	["abp-command-toggleshowinstatusbar", "command", function() { AppIntegration.togglePref("showinstatusbar"); }],
	["abp-command-enable", "command", function() { AppIntegration.togglePref("enabled"); }],
	["abp-command-contribute", "command", WindowWrapper.prototype.openContributePage],
	["abp-command-contribute-hide", "command", WindowWrapper.prototype.hideContributeButton],
	["abp-toolbarbutton", "command", WindowWrapper.prototype.handleToolbarCommand],
	["abp-toolbarbutton", "click", WindowWrapper.prototype.handleToolbarClick],
	["abp-status", "click", WindowWrapper.prototype.handleStatusClick],
	["abp-image-menuitem", "command", function() { this.backgroundData ? this.blockItem(null, this.backgroundData) : this.blockItem(this.currentNode, this.nodeData); }],
	["abp-object-menuitem", "command", function() { this.blockItem(this.currentNode, this.nodeData); }],
	["abp-media-menuitem", "command", function() { this.blockItem(this.currentNode, this.nodeData); }],
	["abp-frame-menuitem", "command", function() { this.blockItem(this.currentFrame, this.frameData); }],
	["abp-removeWhitelist-menuitem", "command", WindowWrapper.prototype.removeWhitelist]
];

/**
 * Updates displayed status for all application windows (on prefs or filters
 * change).
 */
function reloadPrefs()
{
	if (currentlyShowingInToolbar != Prefs.showintoolbar)
	{
		currentlyShowingInToolbar = Prefs.showintoolbar;
		if (Prefs.showintoolbar)
			for each (let wrapper in wrappers)
				wrapper.installToolbarIcon();
	}

	for each (let wrapper in wrappers)
		wrapper.updateState();
}

/**
 * Tests whether image manager context menu entry should be hidden with user's current preferences.
 * @return Boolean
 */
function shouldHideImageManager()
{
	let result = false;
	if (Prefs.hideimagemanager && "@mozilla.org/permissionmanager;1" in Cc)
	{
		try
		{
			result = true;
			let enumerator = Cc["@mozilla.org/permissionmanager;1"].getService(Ci.nsIPermissionManager).enumerator;
			while (enumerator.hasMoreElements())
			{
				let item = enumerator.getNext().QueryInterface(Ci.nsIPermission);
				if (item.type == "image" && item.capability == Ci.nsIPermissionManager.DENY_ACTION)
				{
					result = false;
					break;
				}
			}
		}
		catch(e)
		{
			result = false;
		}
	}

	shouldHideImageManager = function() result;
	return result;
}

/**
 * Executed on first run, presents the user with a list of filter subscriptions
 * and allows choosing one.
 */
function showSubscriptions()
{
	let wrapper = (wrappers.length ? wrappers[0] : null);

	// Don't annoy the user if he has a subscription already
	let hasSubscriptions = FilterStorage.subscriptions.some(function(subscription) subscription instanceof DownloadableSubscription);
	if (hasSubscriptions)
		return;

	// Only show the list if this is the first run or the user has no filters
	let hasFilters = FilterStorage.subscriptions.some(function(subscription) subscription.filters.length);
	if (hasFilters && Utils.versionComparator.compare(Prefs.lastVersion, "0.0") > 0)
		return;

	if (wrapper && wrapper.addTab)
	{
		wrapper.addTab("chrome://adblocklite/content/ui/subscriptionSelection.xul");
	}
	else
	{
		Utils.windowWatcher.openWindow(wrapper ? wrapper.window : null,
																	 "chrome://adblocklite/content/ui/subscriptionSelection.xul",
																	 "_blank", "chrome,centerscreen,resizable,dialog=no", null);
	}
}

/**
 * Extracts the URL of the image from a CSS property.
 */
function extractImageURL(/**CSSStyleDeclaration*/ computedStyle, /**String*/ property)
{
	let value = computedStyle.getPropertyCSSValue(property);
	if (value instanceof Ci.nsIDOMCSSValueList && value.length >= 1)
		value = value[0];
	if (value instanceof Ci.nsIDOMCSSPrimitiveValue && value.primitiveType == Ci.nsIDOMCSSPrimitiveValue.CSS_URI)
		return Utils.unwrapURL(value.getStringValue()).spec;

	return null;
}

init();