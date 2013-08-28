var lm = {
  htmlBefore: ' ',
  htmlAfter: '',

  linkText: '',

  linkStyle: {
    'border': 'none',
    'textDecoration': 'none',
    'padding': '0',
    'position': 'relative',
    'zIndex': '9999'
  },

  imgStyle: {
    'border': 'none',
    'width': 'auto',
    'height': 'auto'
  },

  replaceStyle: {
    'color': '#488939',
    'background': '#daf8cf url("chrome://savefrom/content/bg_button.png") right center no-repeat',
    'borderRadius': '7px',
    'MozBorderRadius': '7px',
    'padding': '0 16px 0 5px',
    'textDecoration': 'none'
  },

  sfref: '&utm_source=firefox&utm_medium=extensions&utm_campaign=link_modifier',

  pageUrl: 'http://savefrom.net/',
  anchorAttribute: 'savefrom_lm',
  anchorIndexAttribute: 'savefrom_lm_index',

  linkRegExp: null,

  re: {
    filehosting: {
      'rapidshare.com': [/^https?:\/\/([\w\-]+\.)?rapidshare\.com\/\#\!download\|\d+\|\d+\|[^\s\"\|]+\|\d+/i, /^https?:\/\/(rs\d+\.|www\.)?rapidshare\.com\/files\/\d+\/.+/i],
      'filefactory.com': [/^http:\/\/(www\.)?filefactory\.com\/file\/[a-z0-9]+\/?/i],
      'sendspace.com': [/^http:\/\/(www\.)?sendspace\.com\/file\/\w+/i]
    },

    mediahosting: {
      'youtube.com': [/^http:\/\/([a-z]+\.)?youtube\.com\/watch\?.*v=/i],
      'youtu.be': [/^http:\/\/youtu\.be\/[\w\-]+/],
      'google.com': [/^http:\/\/video\.google\.com\/videoplay\?.*docid=/i],
      'metacafe.com': [/^http:\/\/(www\.)?metacafe\.com\/watch\/\d+\/[^\/]+\/?/i],
      'break.com': [/^http:\/\/(www\.)?break\.com\/(index|movies\w*|(\w+\-)+\w+)\/.+\.html$/i, /^http:\/\/view\.break\.com\/\d+/i],
      'vimeo.com': [/^http:\/\/([\w\-]+\.)?vimeo\.com\/\d+$/i],
      'sevenload.com': [/^http:\/\/([\w\-]+\.)?sevenload\.com\/videos\/[\w\-\+\/=]+/i, /^http:\/\/([\w\-]+\.)?sevenload\.com\/shows\/.+/i],
      'facebook.com': [/^https?:\/\/(?:www\.)facebook\.com\/([^\/]+\/)*video\.php\?([^&]+&)*v=\d+/i],
      //'rutube.ru': [/^http:\/\/rutube\.ru\/tracks\/\d+\.html\?.*v=[a-f0-9]+/i],
      'mail.ru': [/^http:\/\/([a-z0-9_-]+\.)?video\.mail\.ru\/(.+\/)+\d+\.html/i, /^http:\/\/r\.mail\.ru\/\w+\/video\.mail\.ru\/(.+\/)+\d+\.html/i],
      'yandex.ru': [/^http:\/\/video\.yandex\.ru\/users\/[\w\-,!\+]+\/view\/[\w\-,!\+]+\/?/i],
      'rambler.ru': [/^http:\/\/vision\.rambler\.ru\/users\/[^\/\s]+\/\d+\/[\w\-_\+!]+\/?/i],
      'smotri.com': [/^http:\/\/([a-z0-9_-]+\.)?smotri\.com\/video\/view\/\?.*id=v[0-9a-f]/i],
      'tvigle.ru': [/^http:\/\/(www\.)?tvigle\.ru\/channel\/\d+\?.*vid_id=\d+/i, /^http:\/\/(www\.)tvigle\.ru\/prg\/\d+\/\d+/i],
      'intv.ru': [/^http:\/\/(www\.)?intv\.ru\/(view|quickdl)\/\?.*film_id=\w+/i, /^http:\/\/(www\.)?intv\.ru\/v\/\w+/i],
      'yasee.ru': [/^http:\/\/([a-z0-9_-]+\.)?yasee\.ru\/video\/view\/\?.*id=v[0-9a-f]/i],
      'narod.tv': [/^http:\/\/(?:www\.)?narod\.tv\/\?.*vid=/i],
      'vkadre.ru': [/^http:\/\/(www\.)?vkadre\.ru\/videos\/\d+/i],
      'myvi.ru': [
        /^http:\/\/(www\.)?myvi\.ru\/([a-z][a-z]\/)?videodetail\.aspx\?.*video=/i,
        /^http:\/\/(www|kino|anime)\.myvi\.ru\/watch\/[\w\-]+/i
      ],
      '1tv.ru': [/^http:\/\/(www\.)?1tv\.ru(\:\d+)?\/newsvideo\/\d+/i, /^http:\/\/(www\.)?1tv\.ru(\:\d+)?\/news\/\w+\d+/i],
      'ntv.ru': [/^http:\/\/news\.ntv\.ru\/(\w+\/)?\d+\/video\/?/i],
      'vesti.ru': [/^http:\/\/(www\.)?vesti\.ru\/videos\?.*vid=\d+/i],
      'bibigon.ru': [/^http:\/\/(www\.)?bibigon\.ru\/videow\.html\?id=\d+/i, /^http:\/\/(www\.)?bibigon\.ru\/video\.html\?vid=\d+/i],
      'mreporter.ru': [/^http:\/\/(www\.)?mreporter\.ru\/reportermessages\!viewreport\.do[^\?]*\?.*reportid=\d+/i],
      'autoplustv.ru': [/^http:\/\/(www\.)?autoplustv\.ru\/494\/\?id=\d+/i],
      'russia.ru': [/^http:\/\/([\w\-]+\.)?russia\.ru\/video\/?/i],
      'amik.ru': [/^http:\/\/(www\.)?amik\.ru\/video\/vid\d+\.html/i, /^http:\/\/(www\.)?amik\.ru\/video\/vcid\d+\.html/i],
      'life.ru': [/^http:\/\/([\w+\-]+\.)?life\.ru\/video\/\d+/i]
    }
  },


  parseHref: function(href, search)
  {
    var res = new Array();
    res.push(href);

    var i = href.toLowerCase().indexOf('http://', 7);
    if(i > 7)
    {
      res.push(href.substring(i));
    }
    else if(search)
    {
      var h = search.match(/http%3a(%2f%2f|\/\/)[^\s\&\"\<\>]+/i);
      if(h && h.length > 0)
      {
        res.push(decodeURIComponent(h[0]));
      }
      else
      {
        var s = '';
        try
        {
          s = decodeURIComponent(search);
        }
        catch(err)
        {
        }

        if(s)
        {
          h = s.match(/((?:aHR0cDovL|aHR0cHM6Ly)[a-z0-9+\/=]+)/i);
          if(h && h.length > 1)
          {
            h = SaveFrom.base64.decode(h[1]);
            if(h.search(/^http:\/\//i) != -1)
              res.push(decodeURIComponent(h));
          }
        }
      }
    }

    return res;
  },


  href: function(a)
  {
    return a.getAttribute('href', false);
  },


  getElementIndex: function(e)
  {
    var txt = e.textContent;
    if(e.childNodes.length == 0 || !txt || txt == ' ')
      return 1;

    var bg = e.style.backgroundImage;
    if(bg && bg != 'none')
      return 1;

    var c = e.getElementsByTagName('*');
    for(var i = 0; i < c.length; i++)
    {
      if(c[i].tagName == 'IMG')
        return 2;
      else
      {
        bg = c[i].style.backgroundImage;
        if(bg && bg != 'none')
          return 1;
      }
    }

    return 0;
  },


  run: function(win, doc)
  {
    if(!win || !doc)
      return;

    var prefFileHosting = SaveFrom.prefs.getBoolPref('lmFileHosting');
    var prefMediaHosting = SaveFrom.prefs.getBoolPref('lmMediaHosting');

    if(!prefFileHosting && !prefMediaHosting)
      return;

    lm.linkRegExp = {};
    if(prefFileHosting)
    {
      for(var i in lm.re.filehosting)
        lm.linkRegExp[i] = lm.re.filehosting[i];
    }

    if(prefMediaHosting)
    {
      for(var i in lm.re.mediahosting)
        lm.linkRegExp[i] = lm.re.mediahosting[i];
    }


    var a = doc.getElementsByTagName('a');
    if(doc.body && doc.body.getUserData('savefromLinkCount') != a.length)
    {
      doc.body.setUserData('savefromLinkCount', a.length, null);

      var found = {}, lastHref = '';

      for(var i = 0; i < a.length; i++)
      {
        var href = handleAnchor(a[i]);
        if(href)
        {
          var index = 0;
          var attr = a[i].getAttribute(lm.anchorIndexAttribute, false);
          if(attr === 0 || attr)
            index = parseInt(attr);
          else
          {
            index = lm.getElementIndex(a[i]);
            a[i].setAttribute(lm.anchorIndexAttribute, index, false);
          }

          if(found[href])
          {
            if(index < found[href].index)
            {
              found[href].elements = [a[i]];
              found[href].index = index;
              lastHref = href;
            }
            else if(index == found[href].index && href != lastHref)
            {
              found[href].elements.push(a[i]);
              lastHref = href;
            }
          }
          else
          {
            found[href] = {
              index: index,
              elements: [a[i]]
            };

            lastHref = href;
          }
        }
      }

      var count = 0;
      for(var i in found)
      {
        for(var j = 0; j < found[i].elements.length; j++)
        {
          var e = found[i].elements[j];
          count++;
          if(!e.getAttribute(lm.anchorAttribute, false))
            modifyLink(e, i);
        }
      }

      SaveFrom.setBrowserData(win, 'lm', SaveFrom.lng('lm.tooltip') + ': ' + count);
    }



    function checkLink(link, domain)
    {
      if(!link)
        return false;

      if(link == win.location.href)
        return false;

      domain = SaveFrom.utils.getTopLevelDomain(domain);
      if(!domain || !lm.linkRegExp[domain])
        return false;

      for(var i = 0; i < lm.linkRegExp[domain].length; i++)
      {
        if(link.search(lm.linkRegExp[domain][i]) != -1)
          return true;
      }

      return false;
    }


    function handleAnchor(obj)
    {
      var href = obj.href;
      if(href && (href.search(/^https?:\/\/([\w\-]+\.)?savefrom\.net\//i) == -1))
      {
        var hrefArray = lm.parseHref(href, obj.search);

        if(hrefArray.length > 0)
        {
          if(lm.href(obj).indexOf('#') != 0 && checkLink(hrefArray[0], obj.hostname))
          {
            return hrefArray[0];
          }
          else if(hrefArray.length > 1)
          {
            for(var j = 1; j < hrefArray.length; j++)
            {
              var aTemp = doc.createElement('a');
              aTemp.href = hrefArray[j];
              if(lm.href(aTemp).indexOf('#') != 0 && checkLink(hrefArray[j], aTemp.hostname))
              {
                return hrefArray[j];
              }
            }
          }
        }
      }

      return '';
    }


    function createDownloadButton(parent)
    {
      if(!parent)
        return false;

      var btn = doc.createElement('img');
      btn.src = 'chrome://savefrom/content/button.gif';
      btn.alt = 'SaveFrom.net';
      btn.title = SaveFrom.lng('lm.buttonTitle');
      btn.border = 0;

      for(var i in lm.imgStyle)
        btn.style[i] = lm.imgStyle[i];

      parent.appendChild(btn);

      if(SaveFrom.utils.getStyle(doc, btn, 'vertical-align') == 'baseline')
        btn.style.verticalAlign = 'middle';

      return true;
    }

    function modifyLink(obj, link)
    {
      if(!obj)
        return;

      obj.setAttribute(lm.anchorAttribute, '1', false);

      var box = doc.createElement('span');
      if(lm.htmlBefore)
      {
        box.textContent = lm.htmlBefore;
      }
      box.setAttribute('style', 'padding: 0; margin: 0;', false);

      var parent = obj.parentNode;
      if(!parent)
        return;

      try
      {
        link = encodeURIComponent(link);
      }
      catch(err)
      {
        return;
      }

      var href = lm.pageUrl + '?url=' + link;
      if(lm.sfref)
        href += lm.sfref;

      if(SaveFrom.prefs.getIntPref('lmReplaceLink') == 1)
      {
        // replace link
        obj.setAttribute('href', href, false);
        obj.setAttribute('title', SaveFrom.lng('lm.buttonTitle'), false);

        for(var i in lm.replaceStyle)
        {
          obj.style[i] = lm.replaceStyle[i];
        }
      }
      else
      {
        // add button
        var a = doc.createElement('a');
        a.href = href;
        a.target = '_blank';
        a.title = SaveFrom.lng('lm.buttonTitle');

        for(var i in lm.linkStyle)
          a.style[i] = lm.linkStyle[i];

        a.setAttribute(lm.anchorAttribute, '1', false);
        if(lm.linkText)
        {
          a.textContent = lm.linkText;
        }

        if(!createDownloadButton(a) && lm.linkText == '')
        {
          a.textContent = 'SaveFrom.net';
        }

        box.appendChild(a);
      }

      if(lm.htmlAfter)
        box.textContent += lm.htmlAfter;


      if(obj.nextSibling)
        parent.insertBefore(box, obj.nextSibling);
      else
        parent.appendChild(box);
    }
  }
};