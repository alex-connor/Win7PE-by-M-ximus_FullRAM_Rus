var sf = {
  scriptId: 'savefrom__ext_script',
  dataAttr: 'data-extension-disabled',


  run: function(win, doc)
  {
    setExtParams();
    if(!SaveFrom.prefs.getBoolPref('enabled'))
      return;

    var form = doc.getElementById('sf_form');
    if(!form)
      return;

    form.addEventListener('submit', function(event){
      var url = form.ownerDocument.getElementById('sf_url');
      if(!url || !url.value)
        return true;

      url = url.value;

      if(form.getAttribute(sf.dataAttr) == '1')
        return true;

      var re = {
        vk: [
          /^https?:\/\/(?:[a-z]+\.)?(?:vk\.com|vkontakte\.ru)\/(video-?\d+_-?\d+)/i,
          /^https?:\/\/(?:[a-z]+\.)?(?:vk\.com|vkontakte\.ru)\/video_ext.php\?(.*oid=-?\d+.*)$/i,
          /^https?:\/\/(?:[a-z]+\.)?(?:vk\.com|vkontakte\.ru)\/[\w\-]+\?.*z=(video-?\d+_-?\d+)/i
        ],

        yt: [
          /^https?:\/\/(?:[a-z]+\.)?youtube\.com\/(?:#!?\/)?watch\?.*v=([\w\-]+)/i,
          /https?:\/\/(?:[a-z0-9]+\.)?youtube\.com\/embed\/([\w\-]+)/i
        ]
      };

      for(var i in re)
      {
        for(var j = 0; j < re[i].length; j++)
        {
          var vid = url.match(re[i][j]);
          if(vid && vid.length > 1)
          {
            vid = vid[1];
            event.preventDefault();
            event.stopPropagation();

            if(i == 'vk')
            {
              SaveFrom.vkontakte_ru_embed.getLinks(SaveFrom, vid, function(vid, links, title){
                setVKLinks(vid, links, title, null);
              });
            }
            else if(i == 'yt')
            {
              SaveFrom.youtube_com_embed.getLinks(win, SaveFrom, vid, function(links, title, subtitles){
                setYoutubeLinks(vid, links, title, null, subtitles);
              }, true);
            }

            return false;
          }
        }
      }

      return true;
    }, false);


    doc.body.addEventListener('click', function(event){
      var node = event.target;
      if(node.tagName != 'A')
      {
        if(node.parentNode.tagName == 'A')
          node = node.parentNode;
        else
          return true;
      }

      var vid = node.getAttribute('data-video-id');
      if(!vid)
        return true;

      if(node.getAttribute(sf.dataAttr) == '1')
        return true;

      var module = {vk: 1, yt: 1};

      vid = vid.split(':', 2);
      if(vid.length != 2 || !module[vid[0]])
        return true;

      event.preventDefault();
      event.stopPropagation();

      node.style.display = 'none';

      if(!node.id)
        node.id = vid[0] + '_' + vid[1] + '_' + (Math.random() * 1000) + '_' + (new Date()).getTime();

      if(vid[0] == 'vk')
      {
        SaveFrom.vkontakte_ru_embed.getLinks(SaveFrom, vid[1], function(vid, links, title){
          setVKLinks(vid, links, title, node);
        });
      }
      else if(vid[0] == 'yt')
      {
        SaveFrom.youtube_com_embed.getLinks(win, SaveFrom, vid[1], function(links, title, subtitles){
          setYoutubeLinks(vid[1], links, title, node, subtitles);
        }, true);
      }

      return false;
    }, true);


    function sendMessageToPage(msg)
    {
      var node = doc.createTextNode(JSON.stringify(msg));
      doc.head.appendChild(node);

      var event = doc.createEvent("HTMLEvents");
      event.initEvent("extension-query", true, false);
      node.dispatchEvent(event);
    }


    function setExtParams()
    {
      sendMessageToPage({
        msg: 'setBrowserExtension',
        params: {
          id: 'ff',
          version: SaveFrom.prefs.getCharPref('version'),
          enable: SaveFrom.prefs.getBoolPref('enabled')
        }
      });
    }


    function handleError(btn)
    {
      if(btn)
      {
        if(btn)
        {
          btn.style.display = '';
          btn.setAttribute(sf.dataAttr, '1');
          btn.click();
        }
        return;
      }

      var form = doc.getElementById('sf_form');
      if(!form)
        return;

      form.setAttribute(sf.dataAttr, '1');
      form.submit();
      form.removeAttribute(sf.dataAttr);
    }


    function showVideoResult(result, btn)
    {
      if(!result || !result.url || !result.url.length)
      {
        handleError(btn);
        return;
      }

      if(btn)
      {
        sendMessageToPage({
          msg: 'replaceAjaxResult',
          btn: btn.id,
          data: result
        });
      }
      else
      {
        sendMessageToPage({
          msg: 'showVideoResult',
          video: result
        });
      }
    }


    function setVKLinks(vid, data, title, btn)
    {
      if(!vid || !data)
      {
        handleError(btn);
        return;
      }

      links = SaveFrom.video.vk.getLinks(data);
      if(!links)
      {
        handleError(btn);
        return;
      }

      var result = {
        url: links,
        meta: {
          title: (data.md_title ? SaveFrom.download.modifyFileName(doc, data.md_title) : ''),
          source: ''
        }
      };

      if(data.thumb)
      {
        if(data.thumb.search(/\\\//) > -1)
          data.thumb = data.thumb.replace(/\\\//g, '/');

        result.thumb = data.thumb;
      }


      for(var i = 0; i < result.url.length; i++)
      {
        result.url[i].info_url = '';

        if(!result.sd && !result.url[i].subname)
          result.sd = {url: result.url[i].url};
        else if(!result.hd && result.url[i].subname && parseInt(result.url[i].subname) >= 720)
          result.hd = {url: result.url[i].url};
      }

      showVideoResult(result, btn);
    }


    function setYoutubeLinks(vid, links, title, btn, subtitles)
    {
      if(!vid || !links)
      {
        handleError(btn);
        return;
      }

      var result = {
        url: [],
        meta: {
          title: (title ? SaveFrom.download.modifyFileName(doc, title) : ''),
          source: (vid ? 'http://youtube.com/watch?v=' + vid : '')
        },
        thumb: (vid ? 'http://i.ytimg.com/vi/' + vid + '/hqdefault.jpg' : '')
      };

      var sig = false;

      for(var i in SaveFrom.video.yt.format)
      {
        var f = SaveFrom.video.yt.format[i];
        for(var j in f)
        {
          if(links[j])
          {
            if(!sig && links[j].search(/(\?|&)sig(nature)?=/i) > -1)
              sig = true;

            var l = {
              url: links[j],
              name: i,
              subname: f[j].quality,
              info_url: '',
              type: i,
              quality: f[j].quality
            };

            if(f[j]['3d'])
            {
              l.name = '3D ' + l.name;
              l.group = '3d';
              l['3d'] = true;
            }
            else
            {
              if(i.toLowerCase() == 'flv' && !result.sd)
              {
                result.sd = {url: links[j]};
              }

              if(parseInt(f[j].quality) >= 720 && result.sd && !result.hd)
              {
                result.hd = {url: links[j]};
              }
            }

            result.url.push(l);
            delete links[j];
          }
        }
      }

      if(!sig)
      {
        handleError(btn);
        return;
      }

      if(subtitles)
      {
        var subsId = vid.replace(/[^\w]/, '_');
        var btnId = 'yt_subs_btn_' + subsId;
        subsId = 'yt_subs_' + subsId;

        var subtToken = 'extension';
        var subsTitle = result.meta.title ?
          window.btoa(SaveFrom.utf8.encode(result.meta.title)) : '';

        result.action = [];
        result.action.push({
          name: SaveFrom.lng('module.subtitles'),
          attr: {
            id: btnId,
            href: '#',
          },

          bind: {
            click: {
              fn: "sf.youtubeSubtitles('" + vid + "','" + subsId + "'" +
                ",'#" + btnId + "','" + subtToken + "','" + subsTitle + "');"
            }
          }
        });
      }

      showVideoResult(result, btn);
    }
  }
};