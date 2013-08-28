var odnoklassniki = {
  downloadLinkClassName: 'savefrom_ok_download',


  run: function(win, doc){
    SaveFrom.setBrowserData(win, 'odnoklassniki', '');

    var winObj = win.wrappedJSObject;

    function createTextLink(href, text, blank) {
      if(blank == undefined)
        blank = true;

      var a = doc.createElement('a');
      a.href = href;
      a.className = odnoklassniki.downloadLinkClassName;
      a.textContent = text;

      if(blank)
        a.setAttribute('target', '_blank', false);

      return a;
    }


    function removeDownloadLinks()
    {
      var selector = '.' + odnoklassniki.downloadLinkClassName;

      var e = doc.querySelectorAll(selector);
      for(var i = e.length-1; i >= 0; i--)
        e[i].parentNode.removeChild(e[i]);
    }


    ///////////////////////////////////////////////////////////////////
    //  AUDIO

    var audio = {
      downloadIdPrefix: 'savefrom_ok_audio_download_',
      infoIdPrefix: 'savefrom_ok_audio_info_',
      lastRow: null,
      lastRowCandidate: null,
      timer: 0,
      jsessionId: '',
      cache: {},
      ajaxTimer: {},


      emptyObject: function(o)
      {
        for(var i in o)
          delete o[i];
      },


      showRowElements: function(row, show, force)
      {
        if(!row)
          return;

        var node = row.querySelectorAll('div.' + odnoklassniki.downloadLinkClassName);

        if(show && (!node || node.length == 0))
        {
          if(!audio.showRowLinks(row))
            return;

          node = row.querySelectorAll('div.' + odnoklassniki.downloadLinkClassName);
        }

        if(node && node.length > 0)
        {
          var d = show ? '' : 'none';
          for(var i = 0; i < node.length; i++)
          {
            node[i].style.display = d;
          }
        }
      },


      getNodeTrackId: function(node)
      {
        var query = node.getAttribute('data-query');
        if(query)
        {
          query = SaveFrom.JSON.parse(query);
          if(query && query.trackId)
            return query.trackId;
        }

        return null;
      },


      getTrackId: function(parent)
      {
        if(!parent)
          return null;

        var trackId = audio.getNodeTrackId(parent);
        if(trackId)
        {
          var links = {};
          links[trackId] = parent;
          return links;
        }

        var node = parent.querySelector('*["data-query"]');
        if(!node)
          return null;

        trackId = audio.getNodeTrackId(node);
        if(trackId)
        {
          var links = {};
          links[trackId] = node;
          return links;
        }

        return null;
      },


      showRowLinks: function(row)
      {
        var links = audio.getTrackId(row);
        for(var i in links)
        {
          if(audio.handleRow(i, links[i]))
            return true;
        }

        return false;
      },


      showLinks: function()
      {
        if(!winObj.pageCtx || !winObj.pageCtx.jsessionId)
          return;

        audio.jsessionId = winObj.pageCtx.jsessionId.toString();
        audio.emptyObject(audio.cache);

        for(var i in audio.ajaxTimer)
          win.clearTimeout(audio.ajaxTimer[i]);

        audio.emptyObject(audio.ajaxTimer);

        doc.removeEventListener('mouseover', audio.onMouseOver, false);
        doc.removeEventListener('mouseout', audio.onMouseOut, false);

        doc.addEventListener('mouseover', audio.onMouseOver, false);
        doc.addEventListener('mouseout', audio.onMouseOut, false);
      },


      getLink: function(trackId)
      {
        if(!trackId || !audio.jsessionId)
          return;

        audio.ajaxTimer[trackId] = win.setTimeout(function(){
          delete audio.ajaxTimer[trackId];
          audio.deleteLink(trackId);
        }, 30000);

        var url = 'http://wmf1.odnoklassniki.ru/play;jsessionid=' + audio.jsessionId +
          '?tid=' + trackId + '&';

        SaveFrom.request.send(url, function(r){
          var data = null;
          if(r.status == 200 && r.responseText)
          {
            data = SaveFrom.JSON.parse(r.responseText);
          }

          audio.setLink(trackId, data);
        });
      },


      onMouseOver: function(event)
      {
        var node = event.target;
        var row = SaveFrom.utils.getParentByClass(node, ['m_c_tr', 'mus-tr_i', 'm_portal_track']);
        if(row)
        {
          audio.lastRowCandidate = row;
          win.clearTimeout(audio.timer);

          if(audio.lastRow == row)
            return;

          audio.timer = win.setTimeout(function(){
            audio.showRowElements(audio.lastRow, false);
            audio.lastRow = row;
            audio.lastRowCandidate = null;
            audio.showRowElements(audio.lastRow, true);
          }, 250);
        }
      },


      onMouseOut: function(event)
      {
        if(!audio.lastRow && !audio.lastRowCandidate)
          return;

        var node = event.target;
        if(SaveFrom.utils.isParent(node, audio.lastRow) ||
          SaveFrom.utils.isParent(node, audio.lastRowCandidate))
        {
          win.clearTimeout(audio.timer);
          audio.timer = win.setTimeout(function(){
            audio.showRowElements(audio.lastRow, false);
            audio.lastRow = null;
            audio.lastRowCandidate = null;
          }, 1000);
        }
      },


      handleRow: function(trackId, row)
      {
        if(!trackId || !row)
          return false;

        var parent = row;
        parent.style.position = 'relative';

        var duration = row.querySelector('.m_c_duration, .m_portal_duration');

        var box = doc.createElement('div');
        box.className = odnoklassniki.downloadLinkClassName;
        SaveFrom.utils.setStyle(box, {
          color: '#fff',
          background: '#46aa19',
          border: '1px solid #337d12',
          borderRadius: '3px',
          padding: '1px 5px',
          position: 'absolute',
          right: '0',
          top: '50%',
          lineHeight: '15px',
          opacity: 0,
          zIndex: 9999
        });

        box.addEventListener('click', function(event){
          event.preventDefault();
          event.stopPropagation();

          var a = box.querySelector('a.' + odnoklassniki.downloadLinkClassName);
          if(a)
          {
            a.click();
            return false;
          }

          box.style.display = 'none';

          return false;
        }, false);

        var title = audio.getTitle(trackId, row);

        var link1 = createTextLink('#', '...');
        link1.id = audio.downloadIdPrefix + trackId;
        if(duration)
        {
          link1.setAttribute('data-savefrom-helper-duration',
            audio.secondsFromDurationNode(duration));
        }

        if(title)
        {
          link1.setAttribute('download', title + '.mp3');
        }

        SaveFrom.utils.setStyle(link1, {
          color: '#fff',
          fontWeight: 'normal'
        });

        link1.addEventListener('click', audio.onMp3Download, false);

        box.appendChild(link1);
        parent.appendChild(box);

        if(audio.cache[trackId])
          audio.setLinkFromCache(trackId, link1);
        else
          audio.getLink(trackId);

        box.style.marginTop = '-' + (box.offsetHeight / 2) + 'px';
        box.style.opacity = '1';

        var close = doc.createElement('span');
        close.textContent = '\xD7';
        close.title = SaveFrom.lng('module.close');
        SaveFrom.utils.setStyle(close, {
          color: '#fff',
          fontFamily: 'Tahoma,Helvetica,sans-serif',
          fontSize: '15px',
          marginLeft: '7px',
          opacity: '.7'
        });
        close.addEventListener('click', audio.close, true);

        box.appendChild(close);

        return true;
      },


      close: function(event)
      {
        if(event.button == 2)
          return true;

        event.preventDefault();
        event.stopPropagation();

        parent = SaveFrom.utils.getParentByClass(event.target, odnoklassniki.downloadLinkClassName);
        if(parent)
          parent.style.display = 'none';

        return false;
      },


      onMp3Download: function(event)
      {
        if(event.button == 2)
          return true;

        var link = event.target;
        if(!link.href)
          link = link.parentNode;

        event.stopPropagation();

        if(link.href == '#')
          event.preventDefault();

        if(link && link.href)
        {
          event.preventDefault();
          event.stopPropagation();
          SaveFrom.download.save(doc, link.href, link.getAttribute('download'));
          return false;
        }

        return false;
      },


      deleteLink: function(trackId, node)
      {
        if(!node && trackId)
          node = doc.getElementById(audio.downloadIdPrefix + trackId);

        if(!node)
          return;

        var parent = SaveFrom.utils.getParentByClass(node, odnoklassniki.downloadLinkClassName);
        if(parent)
        {
          parent.parentNode.removeChild(parent);
          return;
        }
      },


      getHash: function(src, magic)
      {
        if(!magic)
          magic = [4,3,5,6,1,2,8,7,2,9,3,5,7,1,4,8,8,3,4,3,1,7,3,5,9,8,1,4,3,7,2,8];

        var a = [];
        for(var i = 0; i < src.length; i++)
        {
          a.push(parseInt('0x0' + src.charAt(i)));
        }

        src = a;

        var res = [];
        src = src.slice(0);
        src[32] = src[31];
        var sum = 0;
        var i = 32;
        while(i-- > 0)
          sum += src[i];

        for(x = 0; x < 32; x++)
          res[x] = Math.abs(sum - src[x + 1] * src[x] * magic[x]);

        return res.join('');
      },


      setLinkFromCache: function(trackId, node)
      {
        if(!audio.cache[trackId])
          return false;

        if(!node)
          node = doc.getElementById(audio.downloadIdPrefix + trackId);

        if(!node)
          return false;

        node.href = audio.cache[trackId].url;
        node.textContent = '';
        if(audio.cache[trackId].downloadAttr)
          node.setAttribute('download', audio.cache[trackId].downloadAttr);

        var icon = doc.createElement('img');
        icon.src = SaveFrom.utils.svg.getSrc(SaveFrom, 'download', '#ffffff');
        icon.title = SaveFrom.lng('module.download');
        SaveFrom.utils.setStyle(icon, {
          width: '16px',
          height: '16px',
          verticalAlign: 'middle',
          opacity: '0.9'
        });
        node.appendChild(icon);

        var info = doc.createTextNode(audio.cache[trackId].info);

        if(node.nextSibling)
          node.parentNode.insertBefore(info, node.nextSibling);
        else
          node.parentNode.appendChild(info);

        return true;
      },


      setLink: function(trackId, data, clientHash)
      {
        if(!trackId)
          return;

        win.clearTimeout(audio.ajaxTimer[trackId]);

        var node = doc.getElementById(audio.downloadIdPrefix + trackId);
        if(!node)
          return;

        if(audio.setLinkFromCache(trackId, node))
          return;

        if(!data || !data.play)
        {
          audio.deleteLink(trackId, node);
          node.textContent = '?';
          return;
        }

        if(clientHash === undefined)
        {
          var md5 = data.play.match(/(?:\?|&)md5=([\da-f]{32})/i);
          if(md5 && md5.length > 1)
          {
            md5 = md5[1];
            try
            {
              md5 = SaveFrom.md5(md5 + 'secret');
              audio.setLink(trackId, data, audio.getHash(md5));
              return;
            }
            catch(err)
            {
            }
          }

          audio.deleteLink(trackId, node);
          return;
        }

        var size = SaveFrom.utils.getMatchFirst(data.play, /(?:\?|&)size=(\d+)/i);
        if(!size)
          return;

        audio.cache[trackId] = {};
        audio.cache[trackId].url = data.play + (clientHash ? '&clientHash=' + clientHash : '');

        var sizeHuman = SaveFrom.utils.sizeHuman(size, 2);
        if(sizeHuman[1])
          sizeHuman = sizeHuman[0] + ' ' + SaveFrom.lng('fileSize' + sizeHuman[1]);
        else
          sizeHuman = sizeHuman[0];

        var info = ' (' + sizeHuman;

        var duration = node.getAttribute('data-savefrom-helper-duration');
        if(data.track)
        {
          if(data.track.duration)
            duration = data.track.duration;

          if(data.track.ensemble && data.track.name)
          {
            var title = data.track.ensemble + ' - ' + data.track.name;
            audio.cache[trackId].title = title;
            audio.cache[trackId].downloadAttr = title + '.mp3';
          }
        }

        if(size && duration)
        {
          duration = parseInt(duration);
          if(isNaN(duration))
          {
            delete audio.cache[trackId];
            return;
          }

          var bitrate = Math.floor((size / duration) / 125) + ' ' + SaveFrom.lng('kbps');
          info += ' ~ ' + bitrate;
        }

        doc.title = '5';

        info += ')';
        audio.cache[trackId].info = info;

        audio.setLinkFromCache(trackId, node);
      },


      getTitle: function(id, row)
      {
        if(!id || !row)
          return '';

        var name = '';

        var performer = row.querySelector('.m_c_artist, .mus-tr_artist, .m_portal_c_artist');
        var title = row.querySelector('.m_track_source, .mus-tr_song, .m_portla_track_name');

        if(performer)
        {
          performer = performer.textContent;
          if(performer)
            name += SaveFrom.utils.trim(performer);
        }

        if(title)
        {
          title = title.textContent;
          if(title)
          {
            if(name)
              name += ' - ';

            name += SaveFrom.utils.trim(title);
          }
        }

        if(name)
          return name.replace(/\<a\s+[^\>]+\>/ig, '').replace(/\<\/a\>/ig, '');

        return '';
      },


      secondsFromDurationNode: function(node)
      {
        if(!node)
          return 0;

        var text = node.innerText;
        if(!text)
          return 0;

        var m = text.match(/^\s*(\d+)\s*\:\s*(\d+)/);
        if(m && m.length > 2)
          return parseInt(m[1]) * 60 + parseInt(m[2]);

        return 0;
      },


      showListOfAudioFiles: function(playlist)
      {
      }
    };

    //  /AUDIO
    ///////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////////////////////////////
    //  VIDEO

    var video = {
      popupTimer: 0,
      panelId: 'savefrom__ok_video_links_',
      panelCount: 0,
      parentDataAttr: 'data-savefrom-video-container',
      titleTimer: 0,

      style: {fontSize: '10pt', margin: '15px 0', padding: '0'},


      appendButton: function(links, title, style, external, parent)
      {
        if(!parent)
          return;

        if(parent.getAttribute(video.parentDataAttr))
          return;

        parent.setAttribute(video.parentDataAttr, '1');

        parent = parent.querySelector('ul.controls-list');
        if(!parent)
          return;

        if(parent.querySelector('.' + odnoklassniki.downloadLinkClassName))
          return;

        var box = doc.createElement('li');
        box.className = odnoklassniki.downloadLinkClassName + ' controls-list_item';

        var a = doc.createElement('a');
        a.href = '#';
        a.className = 'al';
        a.textContent = SaveFrom.lng('module.download');
        a.style.fontWeight = 'bold';
        box.appendChild(a);

        parent.appendChild(box);

        var panel = doc.createElement('div');
        panel.className = odnoklassniki.downloadLinkClassName + ' al';
        panel.id = video.panelId + video.panelCount;
        video.panelCount++;
        panel.style.textDecoration = 'none';

        a.setAttribute('data-savefrom-video-box', panel.id);

        if(parent.nextSibling)
          parent.parentNode.insertBefore(panel, parent.nextSibling);
        else
          parent.parentNode.appendChild(panel);

        a.addEventListener('click', function(event){
          event.stopPropagation();
          event.preventDefault();

          var node = event.target;
          var id = node.getAttribute('data-savefrom-video-box');
          if(!id)
            return false;

          var panel = doc.getElementById(id);
          if(!panel)
            return false;

          if(panel.getAttribute('data-savefrom-video') == 'active')
          {
            panel.style.display = (panel.style.display == 'none') ? 'block' : 'none';
            return false;
          }

          panel.setAttribute('data-savefrom-video', 'active');

          if(links)
          {
            video.count++;
            video.show(links, title, panel, style);
          }
          else if(external && external.module)
          {
            video.show('...', '', panel, style);

            if(external.module == 'youtube')
            {
              SaveFrom.youtube_com_embed.getLinks(win, SaveFrom, external.extVideoId,
                function(links, title){
                  video.show(links, title, panel, style, external.module);
                }
              );
            }
            else if(external.module == 'odnoklassniki')
            {
              video.getLinks(external.extVideoId, function(links){
                video.show(links, external.title, panel, style, external.module);
              });
            }
          }

          return false;
        }, false);
      },


      show: function(links, title, parent, style, external)
      {
        if(!parent)
          return;

        SaveFrom.utils.emptyNode(parent);

        if(!links)
          return;

        if(external == 'youtube')
        {
          SaveFrom.video.yt.init(SaveFrom.prefs);
          SaveFrom.video.yt.show(SaveFrom, links, parent, {
            link: {color: '#eb722e'},
            text: null,
            btn: {color: '#777', borderColor: '#555', fontSize: '95%'},
            fsIcon: {opacity: '.5'},
            fsText: {fontSize: '80%'}
          });

          return;
        }

        if(title)
          title = SaveFrom.utils.trim(title.replace(/\x2B+/g, ' '));

        var html = false;
        if(typeof(links) == 'string')
          html = true;
        else if(links.length == 0)
          return;

        SaveFrom.utils.setStyle(parent, {
          color: '#555',
          display: 'block',
          float: 'none',
          fontSize: '11pt',
          fontWeight: 'bold',
          margin: '15px 0',
          padding: '0',
          textAlign: 'center'
        });

        if(style && typeof(style) == 'object')
          SaveFrom.utils.setStyle(parent, style);

        if(html)
        {
          parent.textContent = links;
          return;
        }

        parent.appendChild(doc.createTextNode(SaveFrom.lng('module.download') + ':'));

        for(var i = 0; i < links.length; i++)
        {
          var a = null;

          if(typeof(links[i]) == 'object' && links[i].url)
          {
            var ext = links[i].ext;
            if(!ext)
            {
              ext = 'FLV';
              if(links[i].url.search(/\.mp4$/i) != -1)
                ext = 'MP4';
            }

            var name = links[i].name ? links[i].name : ext;
            a = createTextLink(links[i].url, name);

            if(title && !links[i].noTitle)
            {
              a.setAttribute('download', SaveFrom.download.modifyFileName(
                doc, title + '.' + ext.toLowerCase()));
            }

            if(links[i].subname)
            {
              var st = doc.createElement('span');
              SaveFrom.utils.setStyle(st, {
                fontSize: '80%',
                fontWeight: 'normal',
                marginLeft: '3px'
              });
              st.innerText = links[i].subname;
              a.appendChild(st);
            }
          }
          else
          {
            var ext = 'FLV';
            if(links[i].search(/\.mp4$/i) != -1)
              ext = 'MP4';

            var name = ext;
            q = SaveFrom.utils.getMatchFirst(links[i], /\.(\d+)\.mp4/i);
            if(q)
              name += ' (' + q + ')';

            a = createTextLink(links[i], name);

            if(title)
            {
              a.setAttribute('download', SaveFrom.download.modifyFileName(
                doc, title + '.' + ext.toLowerCase()));
            }
          }

          if(a)
          {
            if(title)
              a.addEventListener('click', video.onDownload, true);

            a.style.marginLeft = '10px';
            parent.appendChild(a);

            SaveFrom.utils.appendFileSizeIcon(SaveFrom, a,
              {opacity: '.5'},
              {fontSize: '80%', opacity: '.9'});
          }
        }
      },


      onDownload: function(event)
      {
        if(event.button == 2)
          return;

        var link = event.target;
        if(link && link.href)
        {
          SaveFrom.download.save(doc, link.href, link.getAttribute('download'));
          event.preventDefault();
          event.stopPropagation();
        }
      },


      showExternalLinks: function(vid, module, title, parent)
      {
        video.appendButton('', '', video.style, {
          module: module,
          extVideoId: vid,
          title: title
        }, parent);
      },


      showLinks: function()
      {
        win.clearInterval(video.titleTimer);

        var node = doc.querySelectorAll('*[' + video.parentDataAttr + '="1"]');
        if(node && node.length > 0)
        {
          for(var i = 0; i < node.length; i++)
            node[i].removeAttribute(video.parentDataAttr);
        }

        node = null;

        var parent = doc.getElementById('videoPlayerPanel');
        if(parent && !parent.getAttribute(video.parentDataAttr))
        {
          node = parent.querySelectorAll('param[name="flashvars"]');

          for(var i = 0; i < node.length; i++)
          {
            var provider = SaveFrom.utils.getMatchFirst(node[i].value, /providerId=(\w+)/);
            if(provider)
            {
              provider = provider.toLowerCase();

              var vid = SaveFrom.utils.getMatchFirst(node[i].value, /movieId=([\w\-]+)/);
              if(vid)
              {
                var module = '';
                switch(provider)
                {
                  case 'user_youtube':
                    module = 'youtube';
                    break;

                  case 'uploaded':
                    module = 'odnoklassniki';
                    break;
                }

                if(module)
                {
                  video.showExternalLinks(vid, module, '', parent);
                }
              }
            }
          }
        }

        var result = false;
        var selector = {
          'feed_panel_activity': '.feed_panel_activity img.cthumb_img__wide',
          'share_card': '.share_card img.cthumb_img__wide',
          'dsub': '.dsub img.cthumb_img'
        };

        for(var i in selector)
        {
          var node = doc.querySelectorAll(selector[i]);
          for(var j = 0; j < node.length; j++)
          {
            var src = node[j].src;
            if(src)
            {
              var re = {
                'youtube': /(?:\/|\.)ytimg\.com\/vi\/([\w\-]+)/i,
                'odnoklassniki': /\.mail\.ru\/media\/(OK_\d+_\d+)/i
              };

              for(var k in re)
              {
                var vid = SaveFrom.utils.getMatchFirst(src, re[k]);
                if(vid)
                {
                  var title = node[j].alt;

                  video.showExternalLinks(vid, k, title,
                    SaveFrom.utils.getParentByClass(node[j], i));

                  result = true;
                  break;
                }
              }
            }
          }
        }

        video.catchPopupLinks();

        return result;
      },


      catchPopupLinks: function()
      {
        doc.removeEventListener('mousedown', video.onVideoClick, false);
        doc.addEventListener('mousedown', video.onVideoClick, false);

        var loc = doc.location.href;
        video.titleTimer = win.setInterval(function(){
          if(doc.location.href != loc)
          {
            loc = doc.location.href;
            win.clearInterval(video.titleTimer);
            video.showLinks();
          }
        }, 3000);
      },


      onVideoClick: function(event)
      {
        var node = event.target;
        if(node.tagName != 'A')
        {
          for(var parent = node; parent; parent = parent.parentNode)
          {
            if(parent.tagName == 'A')
            {
              node = parent;
              break;
            }
          }
        }

        if(node.tagName != 'A')
          return;

        if(node.href && node.href.search(/\/video\/\d+/i) > -1)
        {
          win.setTimeout(function(){
            var node = doc.getElementById('videoPlayerPanel');
            if(node)
              video.catchPopup();
          }, 1000);

          return;
        }

        if(node.getAttribute('hrefattrs'))
        {
          win.setTimeout(function(){
            video.catchPopup();
          }, 1000);

          return;
        }
      },


      catchPopup: function(event)
      {
        clearTimeout(video.popupTimer);
        video.popupTimer = win.setTimeout(function(){
          clearTimeout(video.popupTimer);
          video.showLinks();
        }, 2000);
      },


      getLinks: function(vid, callback)
      {
        if(!vid)
        {
          callback(null);
          return;
        }

        var url = 'http://in.video.mail.ru/cgi-bin/video/oklite?eid=' + vid;

        SaveFrom.request.send(url, function(r){
          if(r.status == 200 && r.responseText)
          {
            var u = 'http://www.okcontent.video.mail.ru/media/';

            var host = SaveFrom.utils.getMatchFirst(r.responseText, /\$vcontentHost=([^\s\"'\<\>]+)/i);
            if(host)
              u = 'http://' + host + '/media/';

            u += vid;

            var links = [];
            links.push({
              url: u + '-v.mp4',
              title: 'SD',
              ext: 'FLV'
            });

            if(r.responseText.search(/\$HDexist=1/i) > -1)
            {
              links.push({
                url: u + '-hv.mp4',
                title: 'HD',
                ext: 'MP4'
              });
            }

            if(links)
            {
              callback(links);
              return;
            }
          }

          callback(null);
        }, '', url);
      }
    };

    //  /VIDEO
    ///////////////////////////////////////////////////////////////////


    removeDownloadLinks();
    audio.showLinks();
    video.showLinks();
  }
};
