var SaveFrom = {
  strBundle: null,
  prefs: null,
  tabKey: 'SaveFrom_tab_data',

  utils: null,
  JSON: null,
  base64: null,
  utf8: null,
  request: null,
  download: null,
  video: null,
  md5: null,

  module: {},

  // required for all supported services
  requiredComponents: ['base64', 'request'],

  moduleParams: {
    'lm': {
      require: [],
      file: 'link_modifier.jsm',
      modifiesPanel: true,
      isEnabled: function(){
        return (SaveFrom.prefs.getBoolPref('lmFileHosting') ||
          SaveFrom.prefs.getBoolPref('lmMediaHosting'));
      }
    },

    'youtube': {
      require: ['video'],
      file: 'youtube_com.jsm',
      pref: 'moduleYoutube',
      modifiesPanel: true
    },

    'dailymotion': {
      file: 'dailymotion_com.jsm',
      require: ['download'],
      pref: 'moduleDailymotion'
    },

    'vimeo': {
      file: 'vimeo_com.jsm',
      require: ['vimeo_com_embed'],
      pref: 'moduleVimeo',
      modifiesPanel: true
    },

    'vkontakte': {
      file: 'vkontakte_ru.jsm',
      require: ['download', 'video', 'youtube_com_embed', 'vimeo_com_embed'],
      pref: 'moduleVkontakte',
      modifiesPanel: true
    },

    'odnoklassniki': {
      file: 'odnoklassniki_ru.jsm',
      require: ['download', 'video', 'youtube_com_embed', 'md5'],
      pref: 'moduleOdnoklassniki',
      modifiesPanel: true
    },

    'sf': {
      file: 'savefrom_net.jsm',
      require: ['download', 'video', 'youtube_com_embed', 'vkontakte_ru_embed']
    }
  },


  loadModule: function(name)
  {
    if(SaveFrom.module[name])
    {
      if(SaveFrom.moduleParams[name].pref)
      {
        if(!SaveFrom.prefs.getBoolPref(SaveFrom.moduleParams[name].pref))
          return false;
      }
      else if(SaveFrom.moduleParams[name].isEnabled)
      {
        if(!SaveFrom.moduleParams[name].isEnabled())
          return false;
      }


      return true;
    }

    if(SaveFrom.moduleParams[name].require)
    {
      var r = SaveFrom.requiredComponents;

      if(SaveFrom.moduleParams[name].require)
        r = r.concat(SaveFrom.moduleParams[name].require);

      for(var i = 0; i < r.length; i++)
      {
        if(!SaveFrom[r[i]])
        {
          if(r[i] == 'download')
            SaveFrom.loadSubScript("resource://savefrom/" + r[i] + ".jsm", SaveFrom);
          else
            Components.utils.import("resource://savefrom/" + r[i] + ".jsm", SaveFrom);
        }
      }
    }

    SaveFrom.loadSubScript("resource://savefrom/" + SaveFrom.moduleParams[name].file, SaveFrom.module);
    return true;
  },


  runModule: function(name, win, repeated)
  {
    if(!win)
      win = gBrowser.selectedBrowser.contentWindow;

    if(!SaveFrom.loadModule(name))
    {
      SaveFrom.setBrowserData(win);
      return false;
    }

    if(SaveFrom.module[name])
    {
      if(!repeated)
        SaveFrom.setBrowserData(win);

      SaveFrom.module[name].run(win, win.document);

      if(name == 'lm')
      {
        win.addEventListener("load", function(){
          setTimeout(function(){
            if(SaveFrom.module.lm)
              SaveFrom.module.lm.run(win, win.document);
          }, 3000);
        }, false);
      }

      return true;
    }

    return false;
  },


  run: function(event)
  {
    if(!SaveFrom.prefs.getBoolPref('enabled'))
      return;

    if(!(event.originalTarget instanceof HTMLDocument))
      return;

    var win = event.originalTarget.defaultView;
    if(!win)
      return;

    SaveFrom.changeVersion();

    var domain = '';
    try
    {
      if(win.location.hostname)
        domain = SaveFrom.utils.getTopLevelDomain(win.location.hostname);
    }
    catch(err)
    {
      return;
    }

    var hostings = {
      'youtube.com': {
        module: 'youtube',
        re: [/^https?:\/\/([\w\-]+\.)?youtube\.com\//i],
      },

      'dailymotion.com': {
        module: 'dailymotion',
        re: [/^https?:\/\/([\w\-]+\.)?dailymotion\.com\//i]
      },

      'vimeo.com': {
        module: 'vimeo',
        re: [/^https?:\/\/([\w\-]+\.)?vimeo\.com\//i],
      },

      'vkontakte.ru': {
        module: 'vkontakte',
        re: [/^https?:\/\/([\w\-]+\.)?vkontakte\.ru\//i],
        frame: true
      },

      'vk.com': {
        module: 'vkontakte',
        re: [/^https?:\/\/([\w\-]+\.)?vk\.com\//i],
        frame: true
      },

      'odnoklassniki.ru': {
        module: 'odnoklassniki',
        re: [/^https?:\/\/([\w\-]+\.)?odnoklassniki\.ru\//i]
      },

      'savefrom.net': {
        module: 'sf',
        re: [/^https?:\/\/([\w\-]+\.)?savefrom\.net\/(index\.php|user\.php|\d+-[^\/]+\/|articles\/.+)?(\?|#|$)/i]
      }
    };


    if(domain && hostings[domain])
    {
      if(win.frameElement && !hostings[domain].frame)
        return;

      for(var i = 0; i < hostings[domain].re.length; i++)
      {
        if(win.location.href.search(hostings[domain].re[i]) != -1)
        {
          SaveFrom.runModule(hostings[domain].module, win);
          return;
        }
      }
    }
    else if(domain.search(/^dailymotion\.[a-z]{2}/i) > -1)
    {
      if(win.frameElement && !hostings['dailymotion.com'].frame)
        return;

      SaveFrom.runModule(hostings['dailymotion.com'].module, win);
      return;
    }

    if(!win.frameElement)
      SaveFrom.runModule('lm', win);
  },


  setBrowserData: function(win, module, tooltip)
  {
    if(!win)
      return;

    var browser = gBrowser.getBrowserForDocument(win.document);
    if(!browser)
      return;

    var data = null;

    if(module)
    {
      var data = {module: module, tooltip: tooltip};
      browser.setUserData(SaveFrom.tabKey, SaveFrom.JSON.stringify(data), null);
    }
    else
      browser.setUserData(SaveFrom.tabKey, data, null);

    if(browser == gBrowser.selectedBrowser)
      SaveFrom.setPanelView(data);
  },


  tabSelect: function(event)
  {
    var browser = gBrowser.selectedBrowser;
    if(!browser)
    {
      SaveFrom.setPanelView(null);
      return;
    }

    var data = browser.getUserData(SaveFrom.tabKey);
    if(data)
      SaveFrom.setPanelView(SaveFrom.JSON.parse(data));
    else
      SaveFrom.setPanelView(null);
  },


  init: function()
  {
    // Preferences
    SaveFrom.prefs = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefService)
      .getBranch("extensions.savefrom.");

    var addonBar = document.getElementById('addon-bar');
    if(addonBar)
    {
      var id = ['savefrom_statusbar_button', 'savefrom_statusbar_popupset'];
      for(var i = 0; i < id.length; i++)
      {
        var e = document.getElementById(id[i]);
        if(e)
          e.parentNode.removeChild(e);
      }
    }

    if(SaveFrom.prefs.getBoolPref('showButton'))
      document.getElementById('savefrom_statusbar_button').collapsed = false;


    if(!SaveFrom.prefs.getBoolPref('enabled'))
    {
      SaveFrom.start();
      return;
    }

    try
    {
      Components.utils.import("resource://gre/modules/AddonManager.jsm");
      if(AddonManager)
      {
        AddonManager.getAddonByID("helper@savefrom.net", function(addon){
          SaveFrom.newVersion = addon.version;
          SaveFrom.versionCheck(true);
        });
      }
    }
    catch(err)
    {
      var em = Components.classes["@mozilla.org/extensions/manager;1"].getService(Components.interfaces.nsIExtensionManager);
      if(em)
      {
        SaveFrom.newVersion = em.getItemForID("helper@savefrom.net").version;
        SaveFrom.versionCheck(false);
      }
    }

    SaveFrom.start();
  },


  shutdown: function()
  {
    SaveFrom.removeObserver();
  },


  addObserver: function()
  {
    if(SaveFrom.prefs)
    {
      SaveFrom.prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
      SaveFrom.prefs.addObserver("", SaveFrom, false);
    }
  },


  removeObserver: function()
  {
    if(SaveFrom.prefs)
      SaveFrom.prefs.removeObserver("", SaveFrom);
  },


  observe: function(subject, topic, data)
  {
    if(topic != "nsPref:changed")
      return;

    switch(data)
    {
      case "showButton":
        document.getElementById('savefrom_statusbar_button').collapsed = !SaveFrom.prefs.getBoolPref('showButton');
        break;
    }
  },


  versionCheck: function(ff4)
  {
    var curVersion = SaveFrom.prefs.getCharPref('version');
    var newVersion = SaveFrom.newVersion ? SaveFrom.newVersion : '';

    if(!curVersion || curVersion == '0')
    {
      SaveFrom.firstRun = 1;
      SaveFrom.newVersion = newVersion;
    }
    else if(newVersion && curVersion != newVersion)
    {
      SaveFrom.firstRun = 2;
      SaveFrom.newVersion = newVersion;
    }

    if(ff4)
      SaveFrom.changeVersion();
  },


  changeVersion: function()
  {
    if(SaveFrom.firstRun)
    {
      var url = '', newVersion = false;
      if(SaveFrom.firstRun == 1)
      {
        newVersion = true;
        url = 'http://savefrom.net/user.php?helper=ff;firstrun';

        var addonBar = document.getElementById('addon-bar');
        if (addonBar && addonBar.collapsed)
          addonBar.collapsed = false;
      }
      else if(SaveFrom.firstRun == 2)
      {
        newVersion = true;
        //url = 'http://savefrom.net/user.php?helper=ff;update';
      }

      if(newVersion)
      {
        SaveFrom.prefs.setCharPref('version',  SaveFrom.newVersion);
        SaveFrom.firstRun = 0;
      }

      if(url)
        gBrowser.selectedTab = gBrowser.addTab(url);
    }
  },


  start: function()
  {
    SaveFrom.addObserver();

    if(!SaveFrom.strBundle)
      SaveFrom.strBundle = document.getElementById("savefrom-string-bundle");

    if(!SaveFrom.utils)
      Components.utils.import("resource://savefrom/utils.jsm", SaveFrom);

    if(!SaveFrom.JSON)
      Components.utils.import("resource://savefrom/json.jsm", SaveFrom);

    SaveFrom.setPanelView(null);

    if(!SaveFrom.prefs.getBoolPref('enabled'))
    {
      SaveFrom.setDisableMenuLabel(false);
      return;
    }

    gBrowser.addEventListener("DOMContentLoaded", SaveFrom.run, false);
    gBrowser.tabContainer.addEventListener("TabSelect", SaveFrom.tabSelect, false);
  },


  stop: function()
  {
    SaveFrom.removeObserver();

    gBrowser.removeEventListener("DOMContentLoaded", SaveFrom.run, false);
    gBrowser.tabContainer.removeEventListener("TabSelect", SaveFrom.tabSelect, false);

    SaveFrom.setPanelView(null);
  },


  disable: function()
  {
    var p = !SaveFrom.prefs.getBoolPref('enabled');
    SaveFrom.prefs.setBoolPref('enabled', p);
    SaveFrom.setDisableMenuLabel(p);
    if(p)
      SaveFrom.start();
    else
      SaveFrom.stop();
  },


  loadSubScript: function(url, targetObj)
  {
    return Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
      .getService(Components.interfaces.mozIJSSubScriptLoader)
      .loadSubScript(url, targetObj);
  },


  bookmarklet: function()
  {
    var protocol = content.location.protocol.toLowerCase();
    if(protocol != 'http:' && protocol != 'https:')
      return;

    if(SaveFrom.module.vkontakte &&
      content.location.href.search(/^https?:\/\/(?:vkontakte\.ru|vk\.com)\//i) > -1)
    {
      SaveFrom.module.vkontakte.showModuleInfo();
      return;
    }

    gBrowser.selectedTab = gBrowser.addTab('http://savefrom.net/?url=' + escape(content.location.href) +
      '&utm_source=firefox&utm_medium=extensions&utm_campaign=bookmarklet');
  },


  lng: function(str)
  {
    if(!SaveFrom.strBundle)
      return '';

    return SaveFrom.strBundle.getString(str);
  },


  openDialog: function(url, title)
  {
    var w = null;
    try
    {
      w = window.openDialog(url, title, 'chrome,titlebar,toolbar,centerscreen,resizable');
      w.focus();
    }
    catch (e)
    {
      alert(e);
    }

    return w;
  },


  optionMenu: function()
  {
    SaveFrom.openDialog('chrome://savefrom/content/options.xul', 'SaveFrom.net Options');
  },


  aboutMenu: function()
  {
    SaveFrom.openDialog('chrome://savefrom/content/about.xul', 'About SaveFrom.net');
  },


  setDisableMenuLabel: function(enable)
  {
    var id = [
      'savefrom_statusbar_menu_disable',
      'savefrom_toolbar_menu_disable'
    ];

    var label = enable ? SaveFrom.lng('disable') : SaveFrom.lng('enable');

    for(var i = 0; i < id.length; i++)
    {
      var e = document.getElementById(id[i]);
      if(e)
        e.label = label;
    }
  },


  setPanelButtonsAttr: function(attr)
  {
    var id = [
      'savefrom_statusbar_button',
      'savefrom_toolbar_button'
    ];

    for(var i = 0; i < id.length; i++)
    {
      var btn = document.getElementById(id[i]);
      if(btn)
      {
        for(var j in attr)
        {
          btn.setAttribute(j, attr[j], false);
        }
      }
    }
  },


  setPanelView: function(view)
  {
    var attr = {};
    if(view && view.tooltip)
    {
      attr['tooltiptext'] = view.tooltip;
    }
    else
    {
      var p = SaveFrom.prefs.getBoolPref('enabled');
      if(p)
      {
        attr['tooltiptext'] = SaveFrom.lng('tooltipEnabled');
        attr['image'] = 'chrome://savefrom/content/icon.png';
      }
      else
      {
        attr['tooltiptext'] = SaveFrom.lng('tooltipDisabled');
        attr['image'] = 'chrome://savefrom/content/icon_disabled.png';
      }
    }

    SaveFrom.setPanelButtonsAttr(attr);

    var menuData = {
      'lm': [
        {
          id: 'savefrom_menu_lm_bookmarklet_',
          label: 'downloadFromCurrentPage',
          command: 'bookmarklet'
        },

        {
          id: 'savefrom_menu_lm_refresh_',
          label: 'module.menuRefresh',
          command: 'lm_refresh'
        },

        {
          id: 'savefrom_menu_lm_separator_',
          separator: true
        }
      ],

      'youtube': [
        {
          id: 'savefrom_menu_yt_bookmarklet_',
          label: 'downloadFromCurrentPage',
          command: 'bookmarklet'
        },

        {
          id: 'savefrom_menu_yt_separator_',
          separator: true
        }
      ],

      'vimeo': [
        {
          id: 'savefrom_menu_vimeo_bookmarklet_',
          label: 'downloadFromCurrentPage',
          command: 'bookmarklet'
        },

        {
          id: 'savefrom_menu_vimeo_separator_',
          separator: true
        }
      ],

      'vkontakte': [
        {
          id: 'savefrom_menu_vk_refresh_',
          label: 'module.menuRefresh',
          command: 'vk_refresh'
        },

        {
          id: 'savefrom_menu_vk_mp3_list_',
          label: 'module.menuVkMp3List',
          command: 'vk_mp3_list'
        },

        {
          id: 'savefrom_menu_vk_playlist_',
          label: 'module.menuVkPlaylist',
          command: 'vk_playlist'
        },

        {
          id: 'savefrom_menu_vk_separator_',
          separator: true
        }
      ],

      'odnoklassniki': [
        {
          id: 'savefrom_menu_ok_refresh_',
          label: 'module.menuRefresh',
          command: 'ok_refresh'
        },

        {
          id: 'savefrom_menu_ok_separator_',
          separator: true
        }
      ]
    };

    var disBtn = {
      statusbar: 'savefrom_statusbar_menu_disable',
      toolbar: 'savefrom_toolbar_menu_disable'
    };

    for(var panelName in disBtn)
    {
      var addonBar = document.getElementById('addon-bar');
      var excludeModule = '';

      if(view && view.module && menuData[view.module])
      {
        var m = menuData[view.module];

        // Add menu items
        var dis = document.getElementById(disBtn[panelName]);
        if(dis)
        {
          var next = dis.parentNode.firstChild;

          for(var i = 0; i < m.length; i++)
          {
            if(!document.getElementById(m[i].id + panelName))
            {
              var item = null;
              if(m[i].separator)
              {
                item = document.createElement('menuseparator');
                item.id = m[i].id + panelName;
              }
              else
              {
                item = document.createElement('menuitem');
                item.id = m[i].id + panelName;
                item.setAttribute('label', SaveFrom.lng(m[i].label));

                item.setAttribute('data-command', m[i].command);
                item.setAttribute('data-panel', panelName);

                item.addEventListener('command', SaveFrom.onCommand, true);
              }

              if(m[i].attributes)
              {
                for(var j in m[i].attributes)
                {
                  item.setAttribute(j, m[i].attributes[j]);
                }
              }

              if(next)
                dis.parentNode.insertBefore(item, next);
              else
                dis.parentNode.appendChild(item);
            }
          }
        }

        excludeModule = view.module;
      }

      var ids = [];
      for(var i in menuData)
      {
        if(i != excludeModule && menuData[i] && menuData[i].length > 0)
        {
          for(var j = 0; j < menuData[i].length; j++)
          {
            ids.push(menuData[i][j].id + panelName);
          }
        }
      }

      if(ids.length > 0)
      {
        SaveFrom.utils.removeObjectById(document, ids);
      }
    }
  },


  onCommand: function(event)
  {
    var addonBar = document.getElementById('addon-bar');
    if(addonBar)
      event.stopPropagation();

    var item = event.target;
    if(!item)
      return false;

    if(item.getAttribute('data-panel') == 'toolbar')
      event.stopPropagation();

    var command = item.getAttribute('data-command');
    if(!command)
      return false;

    switch(command)
    {
      case 'bookmarklet':
        SaveFrom.bookmarklet();
        break;

      case 'lm_refresh':
        SaveFrom.runModule('lm', null, true);
        break;

      case 'vk_refresh':
        SaveFrom.runModule('vkontakte', null, true);
        break;

      case 'vk_mp3_list':
        if(SaveFrom.module.vkontakte)
        {
          SaveFrom.module.vkontakte.showMp3LinkList(false);
        }
        break;

      case 'vk_playlist':
        if(SaveFrom.module.vkontakte)
        {
          SaveFrom.module.vkontakte.showMp3LinkList(true);
        }
        break;

      case 'ok_refresh':
        SaveFrom.runModule('odnoklassniki', null, true);
        break;
    }

    return false;
  }
};

window.addEventListener("load", function(e){SaveFrom.init();}, false);
window.addEventListener("unload", function(e){SaveFrom.shutdown();}, false);