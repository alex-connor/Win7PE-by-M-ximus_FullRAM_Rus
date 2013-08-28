var vkontakte = {
  downloadLinkClassName: 'savefrom_vk_download',


  addTab: function(callback)
  {
    var newTab = gBrowser.addTab("about:blank");
    var newTabBrowser = gBrowser.getBrowserForTab(newTab);
    newTabBrowser.addEventListener("load", function(){
      if(callback && typeof(callback) == 'function')
      {
        gBrowser.selectedTab = newTab;
        callback(newTabBrowser.contentDocument);
      }
    }, true);
  },


  run: function(win, doc){
    SaveFrom.setBrowserData(win, 'vkontakte', '');

    var iframe = false, videoExt = false;

    if(win.location.href.search(/\/video_ext\.php\?.+/) > -1)
      videoExt = true;

    if(win.frameElement)
    {
      if(!videoExt)
        return;

      iframe = true;
    }

    var winObj = win.wrappedJSObject;
    var domain = win.location.hostname.replace(/^(?:[\w\-]+\.)*(\w+\.[a-z]{2,6})$/i, '$1');
    var titleTimer = 0;



    function createImgLink(href, src, alt)
    {
      var a = doc.createElement('a');
      a.href = href;
      a.className = vkontakte.downloadLinkClassName;
      a.setAttribute('target', '_blank', false);

      var i = doc.createElement('img');
      i.src = src;
      i.alt = alt;
      i.title = alt;
      a.appendChild(i);

      return a;
    }


    function createTextLink(href, text, targetBlank)
    {
      if(targetBlank == undefined)
        targetBlank = true;

      var a = doc.createElement('a');
      a.href = href;
      a.className = vkontakte.downloadLinkClassName;
      a.textContent = text;
      if(targetBlank)
        a.setAttribute('target', '_blank', false);

      return a;
    }


    function removeDownloadLinks()
    {
      var e = doc.querySelectorAll('.' + vkontakte.downloadLinkClassName);
      if(!e)
        return;

      for(var i = e.length - 1; i >= 0; i--)
      {
        e[i].parentNode.removeChild(e[i]);
      }
    }

    var audio = {
      downloadBg: '#f4f7fc',
      lastRow: null,
      lastRowCandidate: null,
      timer: 0,

      showLinks: function()
      {
        doc.removeEventListener('mouseover', audio.onMouseOver, false);
        doc.removeEventListener('mouseout', audio.onMouseOut, false);

        doc.addEventListener('mouseover', audio.onMouseOver, false);
        doc.addEventListener('mouseout', audio.onMouseOut, false);
      },


      onMouseOver: function(event)
      {
        var node = event.target;
        var row = SaveFrom.utils.getParentByClass(node, ['audioRow', 'audioRowWall', 'audio']);
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
          }, 500);
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


      showRowElements: function(row, show, force)
      {
        if(!row)
          return;

        var node = row.querySelectorAll('div.' + vkontakte.downloadLinkClassName);

        if(show && (!node || node.length == 0))
        {
          if(!audio.handleRow(row))
            return;

          node = row.querySelectorAll('div.' + vkontakte.downloadLinkClassName);
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


      handleRow: function(row)
      {
        var mp3Url = '', audioId = '', links = vkontakte.getAudioLinks(row);
        for(var i in links)
        {
          mp3Url = links[i];
          audioId = i;
        }

        if(!mp3Url)
          return false;

        var parent = row.querySelector('.info');
        if(!parent)
          return false;

        parent.style.position = 'relative';
        if(parent.tagName == 'TD')
          parent.style.display = 'inline-block';

        var duration = row.querySelector('.duration');
        if(!duration)
          return false;

        if(!doc.getElementById('audio' + audioId))
          audioId = '';

        var box = doc.createElement('div');
        box.className = vkontakte.downloadLinkClassName;
        SaveFrom.utils.setStyle(box, {
          color: '#fff',
          background: '#6181a6',
          border: '1px solid #5980a9',
          borderRadius: '3px',
          padding: '3px 5px',
          position: 'absolute',
          right: '30px',
          top: '50%',
          lineHeight: '17px',
          whiteSpace: 'nowrap',
          opacity: 0
        });

        if(!SaveFrom.utils.hasClass(row, 'fl_l'))
          box.style.right = '0';

        box.addEventListener('click', function(event){
          event.preventDefault();
          event.stopPropagation();

          var a = box.querySelector('a.' + vkontakte.downloadLinkClassName);
          if(a)
          {
            a.click();
            return false;
          }

          box.style.display = 'none';

          return false;
        }, false);

        var link1 = createTextLink(mp3Url, '', false);
        link1.setUserData('audioRow', row, null);
        link1.title = vkontakte.getAudioTitle(audioId, row);
        if(link1.title)
          link1.title += '.mp3';

        if(audioId)
        {
          link1.id = 'SaveFrom_download_' + audioId;
        }

        link1.setAttribute('data-savefrom-helper-duration',
          vkontakte.secondsFromDurationNode(duration));

        SaveFrom.utils.setStyle(link1, {
          color: '#fff',
          fontWeight: 'normal'
        });

        link1.addEventListener('click', audio.onMp3Download, true);

        var icon = doc.createElement('img');
        icon.src = SaveFrom.utils.svg.getSrc(SaveFrom, 'download', '#ffffff');
        SaveFrom.utils.setStyle(icon, {
          width: '16px',
          height: '16px',
          verticalAlign: 'middle',
          opacity: '0.9'
        });
        link1.appendChild(icon);


        box.appendChild(link1);

        parent.appendChild(box);
        box.style.marginTop = '-' + (box.offsetHeight / 2) + 'px';
        box.style.opacity = '1';

        var icon = SaveFrom.utils.appendFileSizeIcon(SaveFrom, link1,
          {color: '#fff', opacity: '.75'},
          {fontSize: '95%', opacity: '.9'});

        if(SaveFrom.prefs.getBoolPref('vkShowBitrate'))
          icon.click();

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

        parent = SaveFrom.utils.getParentByClass(event.target, vkontakte.downloadLinkClassName);
        if(parent)
          parent.style.display = 'none';

        return false;
      },


      onMp3Download: function(event)
      {
        if(event.button == 2)
          return true;

        var row = event.target.getUserData('audioRow');
        if(row)
        {
          row.setUserData('SaveFrom_visible', '1', null);
          row.style.backgroundColor = audio.downloadBg;
        }

        var link = event.target;
        if(!link.href)
          link = link.parentNode;

        if(link && link.href)
        {
          SaveFrom.download.save(doc, link.href, link.title);
          event.preventDefault();
          event.stopPropagation();
          return false;
        }

        return true;
      }
    };



    var video = {
      popupTimer: 0,
      iframeParent: null,
      extVideoId: null,
      panelId: 'savefrom__vk_video_links',
      videoAttr: 'data-savefrom-video',
      hiddenAttr: 'data-savefrom-hidden',
      btnBox: null,

      style: {fontSize: '10pt', margin: '15px 0', padding: '0'},


      getSingleVideoInfo: function()
      {
        if(winObj.video_host && (winObj.video_uid > 0 || winObj.video_vkid) && winObj.video_vtag)
        {
          return {
            host: winObj.video_host,
            uid: winObj.video_uid,
            vtag: winObj.video_vtag,
            vkid: (winObj.video_vkid ? winObj.video_vkid : ''),
            hd_def: (winObj.video_max_hd ? winObj.video_max_hd : 0),
            no_flv: (winObj.video_no_flv ? winObj.video_no_flv : 0),
            md_title: (winObj.video_title ? winObj.video_title : '')
          };
        }

        var json = SaveFrom.utils.getMatchFirst(doc.body.innerHTML, /loadflashplayer\s*\(\s*(\{[^\}]+\})/i);
        if(json)
        {
          var o = SaveFrom.JSON.parse(json);
          if(o)
            return o;
        }


        var e = doc.getElementById('player');
        if(!e)
          e = doc.getElementById('playerObj');

        if(e && e.tagName == 'OBJECT')
        {
          var fv = '', cn = e.childNodes;
          for(var i = cn.length - 1; i >= 0; i--)
          {
            if(cn[i].nodeType == '1' && cn[i].name == 'flashvars')
            {
              try{fv = cn[i].value;}catch(err){fv = cn[i].getAttribute('value', false);}
              break;
            }
          }

          var host = SaveFrom.utils.getMatchFirst(fv, /(?:^|[\?\&])host=([\w\.]+)/i);
          var vtag = SaveFrom.utils.getMatchFirst(fv, /(?:^|[\?\&])vtag=([\w\-]+)/i);
          var vkid = SaveFrom.utils.getMatchFirst(fv, /(?:^|[\?\&])vkid=(\d+)/i);
          var uid = SaveFrom.utils.getMatchFirst(fv, /(?:^|[\?\&])uid=(\d+)/i);
          var no_flv = SaveFrom.utils.getMatchFirst(fv, /(?:^|[\?\&])no_flv=(\d+)/i);
          var hd_def = SaveFrom.utils.getMatchFirst(fv, /(?:^|[\?\&])hd_def=(\d+)/i);
          var hd = SaveFrom.utils.getMatchFirst(fv, /(?:^|[\?\&])hd=(\d+)/i);
          var md_title = SaveFrom.utils.getMatchFirst(fv, /(?:^|[\?\&])md_title=([^\s\"\&]+)/i);

          if(hd > 0 && (!hd_def || hd > hd_def))
            hd_def = hd;

          if(host && vtag && (vkid || uid))
          {
            return {
              host: host,
              uid: uid,
              vtag: vtag,
              vkid: vkid,
              hd_def: hd_def,
              no_flv: no_flv,
              md_title: md_title
            };
          }
        }

        return null;
      },


      onExtPlayerOver: function(event)
      {
        if(video.btnBox)
        {
          var panel = doc.getElementById(video.panelId);
          if(panel && (panel.getAttribute(video.videoAttr) != 'active' ||
            panel.getAttribute(video.hiddenAttr)))
          {
            panel = null;
          }

          if(event.type == 'mouseover')
          {
            if(video.btnBox.style.display == 'none')
              video.btnBox.style.display = 'block';

            if(panel)
              panel.style.display = 'block';
          }
          else if(event.type == 'mouseout')
          {
            video.btnBox.style.display = 'none';

            if(panel)
              panel.style.display = 'none';
          }
        }
      },


      appendButton: function(links, title, style, external)
      {
        var parent = doc.getElementById('mv_controls_line');
        if(videoExt)
          parent = doc.getElementById('playerWrap');

        if(!parent)
          return;

        if(parent.querySelector('.' + vkontakte.downloadLinkClassName))
          return;

        var panel = doc.getElementById(video.panelId);
        if(panel)
          panel.parentNode.removeChild(panel);

        var box, a;

        if(videoExt)
        {
          if(video.btnBox)
            video.btnBox.parentNode.removeChild(video.btnBox);

          box = doc.createElement('div');
          box.id = video.btnBoxId;
          box.className = vkontakte.downloadLinkClassName;
          SaveFrom.utils.setStyle(box, {
            background: '#000',
            border: '1px solid #fff',
            display: 'none',
            fontFamily: 'Arial,Helvetica,sans-serif',
            fontSize: '13px',
            lineHeight: 'normal',
            position: 'absolute',
            top: '2px',
            right: '2px',
            padding: '3px 5px',
            margin: 0,
            zIndex: 99999
          });

          video.btnBox = box;
          doc.removeEventListener('mouseover', video.onExtPlayerOver, false);
          doc.removeEventListener('mouseout', video.onExtPlayerOver, false);
          doc.addEventListener('mouseover', video.onExtPlayerOver, false);
          doc.addEventListener('mouseout', video.onExtPlayerOver, false);

          a = doc.createElement('a');
          a.href = '#';
          a.textContent = SaveFrom.lng('module.download');
          a.style.color = '#fff';
          a.style.textDecoration = 'none';
          box.appendChild(a);

          panel = doc.createElement('div');
          panel.id = video.panelId;
          panel.className = vkontakte.downloadLinkClassName;
          SaveFrom.utils.setStyle(panel, {
            background: '#000',
            border: 0,
            display: 'block',
            fontFamily: 'Arial,Helvetica,sans-serif',
            fontSize: '13px',
            lineHeight: 'normal',
            position: 'absolute',
            top: '25px',
            left: 0,
            right: 0,
            margin: 0,
            padding: 0,
            zIndex: 99990
          });

          parent.parentNode.insertBefore(panel, parent);
        }
        else
        {
          box = doc.createElement('span');
          box.className = vkontakte.downloadLinkClassName;

          var d = doc.createElement('span');
          d.className = 'divider';
          d.textContent = '|';
          box.appendChild(d);

          a = doc.createElement('a');
          a.href = '#';
          a.textContent = SaveFrom.lng('module.download');
          a.style.color = '#a0a0a0';
          a.style.fontWeight = 'bold';
          box.appendChild(a);

          panel = doc.createElement('div');
          panel.id = video.panelId;
          panel.className = vkontakte.downloadLinkClassName;
          parent.parentNode.insertBefore(panel, parent);
        }

        a.addEventListener('click', function(event){
          event.stopPropagation();
          event.preventDefault();

          if(panel.getAttribute(video.videoAttr) == 'active')
          {
            if(panel.style.display == 'none')
            {
              panel.style.display = 'block';
              panel.removeAttribute(video.hiddenAttr);
            }
            else
            {
              panel.style.display = 'none';
              panel.setAttribute(video.hiddenAttr, '1');
            }

            return false;
          }

          panel.setAttribute(video.videoAttr, 'active');

          if(links)
            video.showDownloadLinks(links, title, panel, style);
          else if(external && external.module)
          {
            video.showDownloadLinks('...', '', panel, style);

            if(external.module == 'youtube')
            {
              SaveFrom.youtube_com_embed.getLinks(win, SaveFrom, external.extVideoId,
                function(links, title){
                  if(links)
                  {
                    if(video.iframeParent && video.extVideoId == external.extVideoId)
                      video.showDownloadLinks(links, title, null, style, external.module);
                  }
                }
              );
            }
            else if(external.module == 'vimeo')
            {
              SaveFrom.vimeo_com_embed.getLinks(SaveFrom, external.extVideoId,
                function(links, title){
                  if(links)
                  {
                    if(video.iframeParent && video.extVideoId == external.extVideoId)
                      video.showDownloadLinks(links, title, null, style, external.module);
                  }
                }
              );
            }
          }

          return false;
        }, false);

        parent.appendChild(box);
      },


      showDownloadLinks: function(links, title, parent, style, external)
      {
        if(!links || links.length == 0)
          return;

        if(!parent)
          parent = doc.getElementById(video.panelId);

        if(!parent)
          return;

        if(title)
          title = title.replace(/\x2B+/g, ' ');

        SaveFrom.utils.emptyNode(parent);

        if(external == 'youtube')
        {
          SaveFrom.video.yt.init(SaveFrom.prefs);
          SaveFrom.video.yt.show(SaveFrom, links, parent, {
            link: null,
            text: null,
            btn: {color: '#777', borderColor: '#555', fontSize: '95%'},
            fsIcon: null,
            fsText: {fontSize: '80%'}
          });

          return;
        }

        var string = false;
        if(typeof(links) == 'string')
          string = true;
        else if(links.length == 0)
          return;

        if(videoExt)
        {
          SaveFrom.utils.setStyle(parent, {
            color: '#fff',
            display: 'block',
            float: 'none',
            fontSize: '11pt',
            fontWeight: 'normal',
            margin: 0,
            padding: '5px',
            textAlign: 'center'
          });
        }
        else
        {
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
        }

        if(style && typeof(style) == 'object')
          SaveFrom.utils.setStyle(parent, style);

        if(string)
        {
          parent.textContent = links;
          return;
        }

        var sStyle = {
          fontSize: '80%',
          fontWeight: 'normal',
          marginLeft: '3px',
          whiteSpace: 'nowrap'
        };

        var fsIconStyle = {color: '#a0a0a0', opacity: '.75'};
        var fsTextStyle = {fontSize: '95%', opacity: '.9'};

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
            a = createTextLink(links[i].url, name, false);

            if(!links[i].noTitle)
              a.title = title ? (title + '.' + ext.toLowerCase()) : '';

            if(links[i].subname)
            {
              var s = doc.createElement('span');
              SaveFrom.utils.setStyle(s, sStyle);
              s.textContent = links[i].subname;
              a.appendChild(s);
            }
          }

          if(a)
          {
            if(a.title)
              a.addEventListener('click', video.onDownload, true);

            a.style.marginLeft = '10px';
            if(videoExt)
              a.style.color = '#fff';

            parent.appendChild(a);

            SaveFrom.utils.appendFileSizeIcon(SaveFrom, a, fsIconStyle, fsTextStyle);
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
          SaveFrom.download.save(doc, link.href, link.title);
          event.preventDefault();
          event.stopPropagation();
        }
      },


      showLinks: function()
      {
        var v = video.getSingleVideoInfo();
        if(v)
        {
          var links = SaveFrom.video.vk.getLinks(v);
          if(links)
          {
            video.appendButton(links, v.md_title);
            return true;
          }
        }

        video.catchPopupLinks();
        var result = false;

        var count = 0;

        var a = doc.getElementsByTagName('a');
        for(var i = 0; i < a.length; i++)
        {
          if(a[i].href && a[i].href.search(/\/?video[\d\_\-]+/i) != -1)
          {
            var onclick = '';
            try
            {
              onclick = a[i].getAttribute('onclick', false);
            }
            catch(err)
            {
              onclick = a[i].onclick;
            }

            if(onclick)
            {
              var json = SaveFrom.utils.getMatchFirst(onclick, /showvideoboxcommon\s*\(\s*(\{[^\}]+\})/i);
              if(json)
              {
                var o = SaveFrom.JSON.parse(json);
                if(o)
                {
                  if(o.hd > 0 && (!o.hd_def || o.hd > o.hd_def))
                    o.hd_def = o.hd;

                  var links = SaveFrom.video.vk.getLinks(o);
                  if(links)
                    video.appendButton(links, o.md_title, video.style);
                }
              }
            }
          }
        }

        doc.removeEventListener('click', video.onClick, false);
        doc.addEventListener('click', video.onClick, false);

        return result;
      },


      getPopupParent: function(node, removeOldLinks)
      {
        var parent = SaveFrom.utils.getParentByClass(node, 'wrap');
        if(!parent)
          parent = node.parentNode.parentNode;

        if(removeOldLinks)
        {
          node = parent.querySelector('.' + vkontakte.downloadLinkClassName);
          if(node)
            node.parentNode.removeChild(node);
        }

        return parent;
      },


      onClick: function(event)
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

        if(node.tagName == 'A' && node.href && node.href.search(/\/video-?\d+_\d+/i) > -1)
        {
          win.setTimeout(function(){
            var node = doc.getElementById('mv_layer_wrap');
            if(node)
              video.catchPopupLinks();

          }, 1000);
        }
      },


      catchPopupLinks: function()
      {
        win.clearInterval(video.popupTimer);

        if(video.getPopupLinks())
          return;

        var count = 0;

        video.popupTimer = win.setInterval(function(){
          if(count >= 10 || video.getPopupLinks())
          {
            win.clearInterval(video.popupTimer);
            return;
          }

          count++;
        }, 1000);
      },


      getPopupLinks: function()
      {
        var box = SaveFrom.utils.getElementByIds(doc, ['mv_layer_wrap', 'box_layer_wrap']);
        if(!box)
          return false;

        var embed = box.querySelector('embed'), iframe = null;
        if(!embed)
          iframe = box.querySelector('iframe');

        if(iframe && iframe.src)
        {
          var parent = video.getPopupParent(iframe, true);
          if(video.iframeParent == parent)
            return false;

          var extVideoId = SaveFrom.utils.getMatchFirst(iframe.src, /youtube.com\/embed\/([\w\-]+)/i);
          if(extVideoId)
          {
            // youtube
            video.extVideoId = extVideoId;
            video.iframeParent = parent;
            win.setTimeout(function(){
              video.appendButton('', '', video.style, {
                module: 'youtube',
                extVideoId: extVideoId
              });
            }, 2000);
            return true;
          }


          extVideoId = SaveFrom.utils.getMatchFirst(iframe.src, /vimeo.com\/video\/(\d+)/i);
          if(extVideoId)
          {
            // vimeo
            video.extVideoId = extVideoId;
            video.iframeParent = parent;
            win.setTimeout(function(){
              video.appendButton('', '', video.style, {
                module: 'vimeo',
                extVideoId: extVideoId
              });
            }, 2000);
            return true;
          }
        }

        video.extVideoId = null;
        video.iframeParent = null;

        if(!embed)
          return false;

        var fv = embed.getAttribute('flashvars', false);
        if(!fv)
          return false;

        fv = decodeURIComponent(fv);
        fv = SaveFrom.utils.parseQuery(fv);

        var vid = {
          host: '',
          uid: 0,
          vtag: 0,
          vkid: '',
          hd: 0,
          hd_def: 0,
          no_flv: 0,
          md_title: ''
        };

        for(var i in vid)
        {
          if(fv[i])
            vid[i] = fv[i];
        }

        if(vid.hd > 0 && (!vid.hd_def || vid.hd > vid.hd_def))
          vid.hd_def = vid.hd;

        var links = SaveFrom.video.vk.getLinks(vid);
        if(links)
        {
          win.setTimeout(function(){
            video.appendButton(links, vid.md_title, video.style);
          }, 2000);
        }

        return true;
      }
    };



    var photo = {
      box: null,
      album: '',

      links: {},
      count: 0,
      found: 0,
      indicator: null,
      offset: 0,
      offsetStep: 10,


      init: function()
      {
        photo.box = null;
        photo.album = '';

        photo.links = {};
        photo.count = 0;
        photo.found = 0;
        photo.indicator = null;
        photo.offset = 0;
      },


      showLinks: function()
      {
        photo.init();

        if(win.location.href.search(/\/(?:albums?|tag|photos)-?\d+(?:_\d+)?/i) == -1)
          return false;

        var id = win.location.href.match(/#\/(albums?|tag|photos)(-?\d+)(?:_(\d+))?/i);
        if(!id || id.length == 0)
          id = win.location.href.match(/\/(albums?|tag|photos)(-?\d+)(?:_(\d+))?/i);

        if(!id || id.length < 3)
        return false;

        if(id.length > 3 && id[3])
          photo.album = 'album' + id[2] + '_' + id[3];
        else
        {
          if(id[1] == 'albums')
            id[1] = 'photos';

          photo.album = id[1] + id[2];
        }

        var parent = doc.getElementById('photos_albums_container');
        if(!parent)
          parent = doc.getElementById('photos_container');

        if(!photo.album || !parent)
          return false;

        photo.box = doc.createElement('div');
        photo.box.id = 'SaveFrom_vk_album';
        photo.box.className = vkontakte.downloadLinkClassName;
        photo.box.style.margin = '10px 20px';
        parent.parentNode.insertBefore(photo.box, parent);
        photo.addDownloadAlbumBtn(SaveFrom.lng('vk.downloadPhotoAlbum'));
        return true;
      },


      addDownloadAlbumBtn: function(value)
      {
        var parent = doc.querySelector('.photos_album_page, .photos_albums_page, ' +
        '.photos_tag_page, #photos_albums');

        if(parent)
          parent = parent.querySelector('.summary_wrap .summary');

        if(parent)
        {
          var divide = doc.createElement('span');
          divide.className = 'divide ' + vkontakte.downloadLinkClassName;
          divide.textContent = '|';
          parent.appendChild(divide);

          var btn = doc.createElement('a');
          btn.href = '#';
          btn.className = vkontakte.downloadLinkClassName;
          btn.textContent = value;
          btn.style.fontWeight = 'bold';
          btn.addEventListener('click', function(event){
            event.stopPropagation();
            event.preventDefault();
            if(photo.box)
            {
              if(!photo.box.firstChild)
                photo.ajaxStart();
              else
              {
                if(photo.box.style.display == 'none')
                  photo.box.style.display = '';
                else
                  photo.box.style.display = 'none';
              }
            }
          }, false);

          return parent.appendChild(btn);
        }

        var clear_fix = doc.createElement('div');
        clear_fix.className = 'clear_fix';

        var blue_box = doc.createElement('div');
        blue_box.className = 'button_blue fl_l';

        var btn = doc.createElement('button');
        btn.textContent = value;
        btn.addEventListener('click', function(){
          var node = this.parentNode.parentNode;
          node.parentNode.removeChild(node);
          photo.ajaxStart();
        }, false);

        blue_box.appendChild(btn);
        clear_fix.appendChild(blue_box);

        return photo.box.appendChild(clear_fix);
      },


      getAlbumTitle: function()
      {
        var title = '';
        if(doc.title)
        {
          title = doc.title.replace(/\|[^\|]+$/, '');
          if(title)
            title = ' &quot;' + title + '&quot;';
        }

        return '<b>' + SaveFrom.lng('vk.downloadPhotoAlbum') + title + '</b><br><br>';
      },


      ajaxStart: function()
      {
        var d = doc.createElement('div');
        d.style.marginTop = '15px';
        photo.box = photo.box.appendChild(d);

        var ind = document.createElement('img');
        ind.src = '//' + domain + '/images/upload.gif';
        ind.alt = '---';
        photo.indicator = photo.box.appendChild(ind);

        photo.getLinks(true);
      },


      ajaxStop: function()
      {
        photo.offset = -1;
        photo.indicator.parentNode.removeChild(photo.indicator);

        if(!photo.found)
        {
          photo.box.appendChild(doc.createTextNode(SaveFrom.lng('vk.foundPhotos') + ': 0'));
          return;
        }

        photo.createLinkPanel();
      },


      getLinks: function(init)
      {
        if(photo.offset < 0)
          return;

        if(photo.count && photo.offset >= photo.count)
        {
          photo.offset = -1;
          photo.ajaxStop();
          return;
        }

        var post = 'act=show&al=1&list=' + photo.album + '&offset=' + photo.offset;
        photo.offset += photo.offsetStep;

        var counterId = 'SaveFrom_vk_photo_found';

        SaveFrom.request.send(win.location.protocol + '//' + domain + '/al_photos.php', function(r){
          if(r.responseText)
          {
            var t = r.responseText.replace(/\<!\>/g, '\n');

            var json = SaveFrom.utils.getMatchFirst(t, /\<!json\>(.+?\}\s*\])/i);
            if(!json)
            {
              photo.ajaxStop();
              return;
            }

            json = SaveFrom.JSON.parse(json);
            if(!json || !json.length)
            {
              photo.ajaxStop();
              return;
            }

            var found = false;
            var src = ['w_src', 'z_src', 'y_src', 'x_src'];
            for(var i = 0; i < json.length; i++)
            {
              for(var j = 0; j < src.length; j++)
              {
                if(json[i][src[j]])
                {
                  if(!photo.links[json[i][src[j]]])
                  {
                    found = true;
                    photo.found++;
                    photo.links[json[i][src[j]]] = 1;
                  }

                  break;
                }
              }
            }

            if(!found)
            {
              photo.ajaxStop();
              return;
            }

            if(init)
            {
              photo.count = SaveFrom.utils.getMatchFirst(t, /\<!int>(\d+)/i);
              if(!photo.count)
              {
                photo.ajaxStop();
                return;
              }

              var info = doc.createElement('span');

              info.appendChild(doc.createTextNode(SaveFrom.lng('vk.foundLinks') +
                ': '));

              var counter = doc.createElement('span');
              counter.id = counterId;
              counter.textContent = 0;
              info.appendChild(counter);

              info.appendChild(doc.createTextNode(
                ' ' + SaveFrom.lng('vk.foundOf') + ' ' + photo.count));

              info.style.marginRight = '20px';
              photo.box.insertBefore(info, photo.box.firstChild);
            }

            var node = doc.getElementById(counterId);
            if(node)
              node.textContent = photo.found;

            if(init)
            {
              if(photo.offset >= photo.count)
              {
                photo.ajaxStop();
                return;
              }

              photo.getLinks(false);
              photo.getLinks(false);
              photo.getLinks(false);
            }
            else
              photo.getLinks(false);
          }
          else
          {
            photo.ajaxStop();
          }
        }, '', '', post);
      },


      createLinkPanel: function()
      {
        var title = photo.getAlbumTitle();

        photo.box.appendChild(doc.createElement('br'));
        photo.box.appendChild(doc.createElement('br'));
        photo.box.appendChild(doc.createTextNode(SaveFrom.lng('vk.showAs') + ':'));

        var btn1 = createTextLink('javascript:void(0);', SaveFrom.lng('vk.listOfLinks'));
        btn1.style.margin = '0 20px';
        btn1.style.fontWeight = 'bold';
        btn1.addEventListener('click', function(event){
          event.preventDefault();
          photo.showListOfLinks(title);
        }, false);
        photo.box.appendChild(btn1);

        var btn2 = createTextLink('javascript:void(0);', SaveFrom.lng('vk.listOfPhotos'));
        btn2.style.marginRight = '20px';
        btn2.style.fontWeight = 'bold';
        btn2.addEventListener('click', function(event){
          event.preventDefault();
          photo.showListOfPhotos(title);
        }, false);
        photo.box.appendChild(btn2);
      },


      showListOfLinks: function(title)
      {
        var box = doc.createElement('div');

        var p = doc.createElement('p');
        p.innerHTML = SaveFrom.lng('vk.listOfLinksInstruction');
        box.appendChild(p);

        box.appendChild(doc.createElement('br'));
        box.appendChild(doc.createElement('br'));

        var t = doc.createElement('textarea');
        t.cols = 40;
        t.rows = 10;
        t.style.width = '100%';

        var text = '';
        for(var i in photo.links)
          text += i + '\r\n';

        t.textContent = text;
        box.appendChild(t);

        vkontakte.popupDiv(win, doc, box);
      },


      showListOfPhotos: function(title)
      {
        vkontakte.addTab(function(tabDoc){
          if(!tabDoc || !tabDoc.body)
            return;

          var w = '640px';

          var p = tabDoc.createElement('p');
          p.innerHTML = SaveFrom.lng('vk.listOfPhotosInstruction');
          p.style.width = w;
          tabDoc.body.appendChild(p);

          tabDoc.body.appendChild(tabDoc.createElement('br'));
          tabDoc.body.appendChild(tabDoc.createElement('br'));

          for(var i in photo.links)
          {
            var img = tabDoc.createElement('img');
            img.src = i;
            img.alt = 'photo';
            SaveFrom.utils.setStyle(img, {display: 'block', marginBottom: '5px'});
            tabDoc.body.appendChild(img);
          }
        });
      }
    };


    function autoFocusLoginForm()
    {
      if(win.location.href.search(/https?:\/\/(vkontakte\.ru|vk\.com)\/(login\.php)?$/i) != -1)
      {
        var email = doc.getElementById('email');
        if(!email)
          email = doc.getElementById('quick_email');

        if(email && email.tagName == 'INPUT' && email.focus)
          win.setTimeout(function(){email.focus();}, 1000);
      }
    }


    function catchTitleChanging(event)
    {
      win.clearTimeout(titleTimer);
      titleTimer = win.setTimeout(function(){
        removeDownloadLinks();
        audio.showLinks();
        video.showLinks();
        photo.showLinks();
      }, 1000);
    }



    autoFocusLoginForm();

    removeDownloadLinks();
    audio.showLinks();
    video.showLinks();
    photo.showLinks();

    var current_url = win.location.href;
    win.setInterval(function(){
      if (current_url != win.location.href)
      {
        current_url = win.location.href;
        catchTitleChanging();
      }
    }, 1000);
  },


  getAudioTitle: function(id, row)
  {
    if(!id || !row)
      return '';

    var name = '';
    var e = row.querySelector('#performer' + id);
    if(!e)
    {
      e = row.querySelector('#performerWall' + id);
      if(!e)
        e = row.querySelector('.info b');
    }

    if(e && e.textContent)
      name += e.textContent;

    e = row.querySelector('#title' + id);
    if(!e)
    {
      e = row.querySelector('#titleWall' + id);
      if(!e)
        e = row.querySelector('span.title');
    }

    if(e && e.textContent)
    {
      if(name)
        name += ' - ';

      name += e.textContent;
      name = name.replace(/\<a\s+[^\>]+\>/ig, '').replace(/\<\/a\>/ig, '');
      if(name)
        return name;
    }

    var info = row.querySelector('td.info');
    if(info)
    {
      var a = info.querySelector('a');
      if(a)
        name += a.textContent;

      var span = info.querySelector('span');
      if(span)
      {
        if(name)
          name += ' - ';

        name += span.textContent;
      }
    }

    name = name.replace(/\<a\s+[^\>]+\>/ig, '').replace(/\<\/a\>/ig, '');
    if(name)
      return name;

    return '';
  },


  getAudioLinks: function(parent)
  {
    if(!parent)
      return null;

    var links = {};

    var img = parent.querySelectorAll('img.playimg');
    for(var i = 0; i < img.length; i++)
    {
      var a = '';
      try
      {
        a = img[i].getAttribute('onclick', false);
      }
      catch(err)
      {
        a = img[i].onclick;
      }

      a = a.toString();

      if(a && a.search(/(operate|operatewall)/i) >= 0)
      {
        var audioId = '', src = '';
        var r = a.match(/(?:operate|operatewall)\s*\x28\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*[\x22\x27](\w+)[\x22\x27]/i);
        if(r && r.length > 4)
        {
          audioId = r[1];
          src = 'http://cs' + r[2] + '.' + domain + '/u' + r[3] + '/audio/' + r[4] + '.mp3';
        }
        else
        {
          var r = a.match(/(?:operate|operatewall)\s*\x28\s*[\x22\x27]?([\w\-]+)[\x22\x27]?\s*,\s*[\x22\x27](https?:\/\/[\w\_]+\.(?:vkontakte\.ru|vk\.com)\/u\d+\/audio\/\w+\.mp3)[\x22\x27]/i);
          if(r && r.length > 2)
          {
            audioId = r[1];
            src = r[2];
          }
        }

        if(!audioId && img[i].id && img[i].id.search(/^imgbutton/i) != -1)
          audioId = img[i].id.replace(/^imgbutton/i, '');

        links[audioId] = src;
      }
    }

    var play = parent.querySelectorAll('div.play, div.play_new');
    if(play && play.length > 0)
    {
      for(var i = 0; i < play.length; i++)
      {
        if(play[i].id)
        {
          var audioId = play[i].id.replace(/^[^\d]+?(\-?\d+.+)$/i, '$1');
          var info = parent.querySelector('#audio_info' + audioId);
          if(info && info.value)
          {
            var src = SaveFrom.utils.getMatchFirst(info.value, /(https?:\/\/.+\.mp3)/i);
            if(src)
            {
              links[audioId] = src;
            }
          }
        }
      }
    }

    return links;
  },


  showMp3LinkList: function(playList, win, doc)
  {
    if(!win)
    {
      win = gBrowser.selectedBrowser.contentWindow;
      doc = win.document;
    }

    var links = vkontakte.getAudioLinks(doc);
    if(!links)
    {
      win.alert(SaveFrom.lng('vk.mp3LinksNotFound'));
      return false;
    }

    var box = doc.createElement('div');
    var width = '640px';

    var list = [];
    for(var i in links)
    {
      var id = i;
      var row = doc.getElementById('audio' + id);
      if(row)
      {
        var title = vkontakte.getAudioTitle(i, row);

        var duration = 0;
        var d = row.querySelector('.duration');
        if(d)
          duration = vkontakte.secondsFromDurationNode(d);

        list.push([links[i], title, duration ? duration : '-1']);
      }
    }

    if(list && list.length > 0)
    {
      if(playList)
      {
        var b = doc.createElement('b');
        b.textContent = SaveFrom.lng('vk.playlistPageTitle');
        box.appendChild(b);

        box.appendChild(doc.createElement('br'));

        var p = doc.createElement('p');
        p.textContent = SaveFrom.lng('vk.playlistPageInstruction');
        p.style.width = width;

        box.appendChild(doc.createElement('br'));
        box.appendChild(doc.createElement('br'));

        // m3u8
        var file = '#EXTM3U\r\n';

        for(var i = 0; i < list.length; i++)
        {
          if(list[i][1] || list[i][2])
            file += '#EXTINF:' + list[i][2] + ',' + list[i][1] + '\r\n';

          file += list[i][0] + '\r\n';
        }

        box.appendChild(doc.createTextNode('M3U8:   '));

        var a = doc.createElement('a');
        a.href = 'data:audio/x-mpegurl;charset=utf-8;base64,' +
          escape(SaveFrom.base64.encode(SaveFrom.utf8.encode(file)));
        a.textContent = SaveFrom.lng('module.download').toLowerCase();
        box.appendChild(a);

        box.appendChild(doc.createElement('br'));

        var ta = doc.createElement('textarea');
        ta.rows = 10;
        ta.cols = 60;
        ta.textContent = file;
        ta.style.width = '100%';
        box.appendChild(ta);

        box.appendChild(doc.createElement('br'));
        box.appendChild(doc.createElement('br'));

        // pls
        file = '[playlist]\r\n\r\n';

        for(var i = 0; i < list.length; i++)
        {
          var num = i + 1;
          file += 'File' + num + '=' + list[i][0] + '\r\n';

          if(list[i][1] || list[i][2])
          {
            file += 'Title' + num + '=' + list[i][1] + '\r\n' +
              'Length' + num + '=' + list[i][2] + '\r\n';
          }

          file += '\r\n';
        }

        file += 'NumberOfEntries=' + list.length + '\r\n\r\n' +
          'Version=2\r\n';

        box.appendChild(doc.createTextNode('PLS:   '));

        var a = doc.createElement('a');
        a.href = 'data:audio/x-scpls;charset=utf-8;base64,' +
          escape(SaveFrom.base64.encode(SaveFrom.utf8.encode(file)));
        a.textContent = SaveFrom.lng('module.download').toLowerCase();
        box.appendChild(a);

        box.appendChild(doc.createElement('br'));

        var ta = doc.createElement('textarea');
        ta.rows = 10;
        ta.cols = 60;
        ta.textContent = file;
        ta.style.width = '100%';
        box.appendChild(ta);

        box.appendChild(doc.createElement('br'));
        box.appendChild(doc.createElement('br'));

        vkontakte.popupDiv(win, doc, box);
        return true;
      }
      else
      {
        var div = doc.createElement('div');
        SaveFrom.utils.setStyle(div, {width: width, overflow: 'auto', margin: 0});

        var e = doc.createElement('b');
        e.textContent = SaveFrom.lng('vk.mp3LinksPageTitle');
        div.appendChild(e);

        div.appendChild(doc.createElement('br'));

        // instruction 1
        var p = doc.createElement('p');
        div.appendChild(p);

        e = doc.createElement('a');
        e.href = '#';
        e.textContent = SaveFrom.lng('vk.mp3LinksPageHdr1');
        e.addEventListener('click', function(event){
          var s = this.ownerDocument.getElementById('spoiler1');
          if(s)
            s.style.display = (s.style.display == 'none') ? '' : 'none';

          return false;
        }, true);
        p.appendChild(e);

        e = doc.createElement('div');
        e.id = 'spoiler1';
        e.innerHTML = SaveFrom.lng('vk.mp3LinksPageInstruction1');
        e.style.display = 'none';
        e.style.paddingTop = '1em';
        p.appendChild(e);

        // instruction 2
        p = doc.createElement('p');
        div.appendChild(p);

        e = doc.createElement('a');
        e.href = '#';
        e.addEventListener('click', function(event){
          var s = this.ownerDocument.getElementById('spoiler2');
          if(s)
            s.style.display = (s.style.display == 'none') ? '' : 'none';

          return false;
        }, true);
        e.textContent = SaveFrom.lng('vk.mp3LinksPageHdr2');
        p.appendChild(e);

        e = doc.createElement('div');
        e.id = 'spoiler2';
        e.innerHTML = SaveFrom.lng('vk.mp3LinksPageInstruction2');
        e.style.display = 'none';
        e.style.paddingTop = '1em';
        p.appendChild(e);

        box.appendChild(div);
        box.appendChild(doc.createElement('br'));
        box.appendChild(doc.createElement('br'));

        for(var i = 0; i < list.length; i++)
        {
          var t = SaveFrom.download.modifyFileName(doc, list[i][1]);
          e = doc.createElement('a');
          e.href = list[i][0];
          e.title = t;
          e.textContent = list[i][0];
          box.appendChild(e);
          box.appendChild(doc.createElement('br'));
        }
      }
    }


    if(box.firstChild)
    {
      vkontakte.addTab(function(tabDoc){
        if(!tabDoc || !tabDoc.body)
          return false;

        tabDoc.body.appendChild(box);
        return true;
      });
      return true;
    }

    win.alert(SaveFrom.lng('vk.mp3LinksNotFound'));
    return false;
  },


  secondsFromDurationNode: function(node)
  {
    if(!node || !node.textContent)
      return 0;

    var m = node.textContent.match(/^\s*(\d+)\s*\:\s*(\d+)/);
    if(m && m.length > 2)
      return parseInt(m[1]) * 60 + parseInt(m[2]);

    return 0;
  },


  popupDiv: function(win, doc, mixed)
  {
    if(!win)
    {
      win = gBrowser.selectedBrowser.contentWindow;
      doc = win.document;
    }

    var id = 'savefrom_top_box', maxWidth = 580, maxHeight = 460;

    var d = doc.getElementById(id);
    if(d)
      d.parentNode.removeChild(d);

    d = doc.createElement('div');
    d.id = id;
    SaveFrom.utils.setStyle(d, {
      zIndex: '9999',
      display: 'block',
      'float': 'none',
      position: 'fixed',
      left: '-10000px',
      top: '-10000px',
      margin: '0',
      padding: '0',
      opacity: '0.0',
      color: '#000',
      background: '#fff',
      border: '3px solid #c0cad5',
      borderRadius: '7px'
    });

    var cnt = doc.createElement('div');
    SaveFrom.utils.setStyle(cnt, {
      display: 'block',
      'float': 'none',
      position: 'relative',
      overflow: 'auto',
      margin: '0',
      padding: '10px 15px'
    });

    if(typeof(mixed) == 'object')
      cnt.appendChild(mixed);
    else if(typeof(mixed) == 'string')
      cnt.innerHTML = SaveFrom.lng(mixed);

    var btn = doc.createElement('img');
    btn.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGxJREFUeNpiYBhxwB+I9bGI60PliALxQPwfiN+jGaYPFfsPVUPQJf+RMMwwZENgGK/LsGl4j0NMn5CrsBlGsiGEDMNpCBMto54qXiM7sNG9pgDEAkj8D0DsAMUfkMQFoGppnyCpmkWGCQAIMADDTkJNpsN+EwAAAABJRU5ErkJggg==';
    btn.alt = 'x';
    btn.width = 18;
    btn.height = 18;
    SaveFrom.utils.setStyle(btn, {
      position: 'absolute',
      top: '10px',
      right: '15px',
      opacity: '0.5'
    })

    btn.addEventListener('mouseover', function(){this.style.opacity = '0.9';}, false);
    btn.addEventListener('mouseout', function(){this.style.opacity = '0.5';}, false);
    btn.addEventListener('click', function(){
      cnt.style.display = 'none';
      setTimeout(function(){d.parentNode.removeChild(d);}, 100);
    }, false);
    cnt.appendChild(btn);
    d.appendChild(cnt);
    doc.body.appendChild(d);

    if(d.offsetWidth > maxWidth)
      d.style.width = maxWidth + 'px';

    if(d.offsetHeight > maxHeight)
    {
      d.style.height = maxHeight + 'px';
      d.style.width = (maxWidth + 20) + 'px';
    }

    var l = Math.floor((win.innerWidth - d.offsetWidth) / 2.0);
    var t = Math.floor((win.innerHeight - d.offsetHeight) / 2.0);
    SaveFrom.utils.setStyle(d, {
      top: t + 'px',
      left: l + 'px',
      opacity: '1.0'
    });

    win.setTimeout(function(){
      doc.addEventListener('click', function(event){
        var node = event.target;
        if(node != d && !SaveFrom.utils.isParent(node, d))
        {
          cnt.style.display = 'none';
          setTimeout(function(){if(d.parentNode){d.parentNode.removeChild(d);}}, 100);
          doc.removeEventListener('click', arguments.callee, false);
        }
      }, false);
    }, 100);
  },


  showModuleInfo: function(win, doc)
  {
    if(!win)
    {
      win = gBrowser.selectedBrowser.contentWindow;
      doc = win.document;
    }

    vkontakte.popupDiv(win, doc, 'vk.moduleInfo');
  }
};