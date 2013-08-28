var youtube = {
  run: function(win, doc){
    SaveFrom.setBrowserData(win, 'youtube', '');

    var winObj = win.wrappedJSObject;

    var swfargs = null;
    var token = '';
    var video_id = '';

    var changingTimeout = 0;
    var panelId = 'savefrom__yt_links';
    var buttonId = 'savefrom__yt_btn';

    var panelParent = null;
    var panelInsertBefore = null;

    var newInterface = false;

    init();


    function init()
    {
      if(!isVideoPage())
        return;

      var p = doc.getElementById('watch-headline-user-info');
      if(!p)
      {
        p = doc.getElementById('watch7-secondary-actions');
        if(p)
          newInterface = true;
      }

      if(!p)
      {
        var e = doc.getElementById('watch-video-count');
        if(!e)
          e = doc.getElementById('editSubscriptionDiv');

        if(e)
          p = e.parentNode;
      }

      if(p)
      {
        panelParent = p.parentNode;
        panelInsertBefore = SaveFrom.utils.nextSibling(p);
        appendDownloadButton(p);
      }
    }


    function isVideoPage()
    {
      swfargs = getSwfArgs();
      if(!swfargs)
        return false;

      var t = swfargs.t ? swfargs.t : swfargs.token;
      if(!t || (token && token == t))
        return false;

      token = t;

      video_id = swfargs.video_id;
      if(!video_id)
      {
        var m = win.location.href.match(/\/watch\?(?:.+&)?v=([\w\-]+)/i);
        if(m && m.length > 1)
          video_id = m[1];
      }

      if(!video_id)
        return false;

      return true;
    }


    function togglePanel(event)
    {
      var e = doc.getElementById(panelId);
      if(!e)
      {
        getLinks();
        return;
      }

      if(e.style.display == 'none')
        e.style.display = '';
      else
        e.style.display = 'none';
    }


    function appendDownloadButton(parent)
    {
      if(doc.getElementById(buttonId))
        return false;

      var b = doc.createElement('button');
      b.className = newInterface ? 'yt-uix-button yt-uix-button-text' :
        'yt-uix-button yt-uix-button-default';
      b.id = buttonId;
      b.addEventListener('click', togglePanel, false);
      b.style.marginLeft = '10px';

      var s = doc.createElement('span');
      s.className = 'yt-uix-button-content';
      s.textContent = SaveFrom.lng('module.download');
      s.style.fontWeight = 'bold';
      b.appendChild(s);

      parent.appendChild(b);

      return true;
    }


    function catchVideoChanging(event)
    {
      clearTimeout(changingTimeout);
      changingTimeout = setTimeout(function(){
        var p = doc.getElementById(panelId);
        if(p)
          p.parentNode.removeChild(p);

        init();
      }, 1000);
    }


    function getTitle()
    {
      var t = doc.getElementById('watch-headline-title');
      if(t)
        return t.textContent;

      var meta = doc.getElementsByTagName('meta');
      for(var i = 0; i < meta.length; i++)
      {
        var name = meta[i].getAttribute('name', false);
        if(name && name.toLowerCase() == 'title')
          return meta[i].getAttribute('content', false);
      }

      return '';
    }


    function getSwfArgs()
    {
      if(winObj.yt && winObj.yt.config_)
      {
        if(winObj.yt.config_['SWF_CONFIG'] && winObj.yt.config_['SWF_CONFIG'].args)
          return winObj.yt.config_['SWF_CONFIG'].args;
        else if(winObj.yt.config_['PLAYER_CONFIG'] && winObj.yt.config_['PLAYER_CONFIG'].args)
          return winObj.yt.config_['PLAYER_CONFIG'].args;
      }

      var t = doc.body.innerHTML.match(/[\"\']args[\"\']\s*:\s*(\{[^\}]+\})/i);
      if(t && t.length > 1 && SaveFrom.JSON)
      {
        if(t[1].search(/:\"[^\"]+\s*\}$/) > -1)
          t[1] = t[1].replace(/\s*\}$/i, '"}');

        return SaveFrom.JSON.parse(t[1]);
      }

      var e = doc.getElementsByTagName('embed');
      for(var i = 0; i < e.length; i++)
      {
        var f = e[i].getAttribute('flashvars', false);
        if(f && f.search(/fmt_map=/i) != -1)
        {
          var swfargs = [];
          f = f.split('&');
          for(var j = 0; j < f.length; j++)
          {
            var p = f[j].split('=', 2);
            if(p.length == 2)
              swfargs[p[0]] = p[1];
            else if(p.length == 1)
              swfargs[p[0]] = '';
          }

          return swfargs;
        }
      }

      return null;
    }


    function getDownloadLink(video_id, token, fmt)
    {
      return 'http://' + winObj.location.host + '/get_video?video_id=' + video_id + '&t=' + token + '&fmt=' + fmt + '&asv=';
    }


    function showLinks(l)
    {
      var title = getTitle(), titleAttr = '';
      if(title)
      {
        title = SaveFrom.utils.modifyTitle(title);
        titleAttr = '&title=' + encodeURIComponent(title);
      }

      var box = doc.getElementById(panelId);
      if(box)
        box.parentNode.removeChild(box);

      box = doc.createElement('div');
      box.id = panelId;

      if(newInterface)
       box.className = 'yt-uix-button-panel';
      else
      {
        box.className = 'yt-rounded';
        box.style.backgroundColor = '#f3f3f3';
      }

      SaveFrom.utils.setStyle(box, {
        textAlign: 'left',
        fontSize: '15px',
        fontWeight: 'bold',
        padding: '3px 10px',
        margin: '5px 0'
      });

      if(youtube.newInterface)
      {
        SaveFrom.utils.setStyle(box, {
          float: 'none',
          clear: 'both',
          padding: '10px 10px 3px 10px'
        });
      }

      var aStyle = {
        whiteSpace: 'nowrap'
      };

      for(var i in l)
        l[i] += titleAttr;

      SaveFrom.video.yt.init(SaveFrom.prefs);
      SaveFrom.video.yt.show(SaveFrom, l, box,
        {link: aStyle, text: null, btn: null, fsIcon: {opacity: '.5'}, fsText: null});

      if(panelParent)
      {
        try
        {
          if(panelInsertBefore)
            panelParent.insertBefore(box, panelInsertBefore);
          else
            panelParent.appendChild(box);
        }
        catch(err)
        {
          panelParent.appendChild(box);
        }
      }
    }


    function getLinks()
    {
      if(!swfargs || !token || !video_id)
        return false;

      var u = swfargs['fmt_url_map'];
      if(!u)
        u = swfargs['url_encoded_fmt_stream_map'];

      if(!u)
        return false;

      var l = {};

      if(u.search(/url=http/i) > -1)
      {
        u = u.split(',');
        for(var i = 0; i < u.length; ++i)
        {
          u[i] = u[i].replace(/\\u0026/ig, '&').replace(/\\\//g, '/');

          var q = SaveFrom.utils.parseQuery(u[i]);
          if(q.url)
          {
            q.url = decodeURIComponent(q.url);
            if(q.url.search(/(\?|&)sig(nature)?=/i) == -1)
            {
              if(q.sig)
                q.url += '&signature=' + q.sig;
              else if(q.signature)
                q.url += '&signature=' + q.signature;
            }

            if(q.url.search(/(\?|&)itag=/i) == -1)
            {
              if(q.itag)
                q.url += '&itag=' + q.itag;
            }

            var fmt = q.url.match(/(?:\?|&)itag=(\d+)/i);
            if(fmt && fmt.length > 1)
            {
              q.url = q.url.replace(/(\?|&)sig=/i, '$1signature=').
                replace(/\\u0026/ig, '&').replace(/\\\//g, '/');

              l[fmt[1]] = q.url;
            }
          }
        }
      }
      else
      {
        u = decodeURIComponent(u);
        u = u.replace(/\\u0026/ig, '&').replace(/\\\//g, '/');
        u = u.replace(/,(\d+)\|/g, "\n$1|");
        u = u.split('\n');
        if(u && u.length > 0)
        {
          for(var i = 0; i < u.length; i++)
          {
            var t = u[i].split('|');
            if(t && t.length == 2)
            {
              l[t[0]] = t[1];
            }
          }
        }
      }

      showLinks(l);
      return true;
    }
  }
};