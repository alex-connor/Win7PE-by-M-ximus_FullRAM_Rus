var vimeo = {
  run: function(win, doc){
    SaveFrom.setBrowserData(win, 'vimeo', '');

    var panelId = 'savefrom__vimeo_links';

    init();


    function init()
    {
      var clipId = getClipId();
      if(!clipId)
        return;

      showButton(clipId);
    }


    function getClipId()
    {
      var e = doc.getElementById('clip_id');
      if(e && e.value)
        return e.value;

      var tags = {
        meta: {attr: 'content', re: /(?:\?|&)clip_id=(\d+)/i},
        embed: {attr: 'flashvars', re: /(?:^|&)clip_id=(\d+)/i},
        object: {attr: 'data', re: /(?:\?|&)clip_id=(\d+)/i},
        param: {attr: 'value', re: /(?:\?|&)clip_id=(\d+)/i}
      };

      for(var t in tags)
      {
        e = doc.getElementsByTagName(t);
        if(e && e.length > 0)
        {
          for(var i = 0; i < e.length; i++)
          {
            var attr = e[i].getAttribute(tags[t].attr, false);
            if(attr)
            {
              var id = attr.match(tags[t].re);
              if(id && id.length > 1)
                return id[1];
            }
          }
        }
      }

      return null;
    }


    function showButton(clipId)
    {
      var newDesign = false;
      var box = doc.querySelector('.video_container_hd');
      if(!box)
      {
        box = doc.getElementById('tools');
        if(box)
          newDesign = true;
      }

      if(!box)
        return;

      if(newDesign)
      {
        var btn = doc.createElement('a');
        btn.href = 'javascript:void(0)';
        btn.textContent = SaveFrom.lng('module.download');
        btn.className = 'btn iconify_down_b';

        btn.addEventListener('click', function(event){
          var panel = doc.getElementById(panelId);
          if(!panel)
          {
            SaveFrom.utils.addClass(btn, 'active');

            var panelBox = doc.createElement('div');
            SaveFrom.utils.setStyle(panelBox, {
              display: 'block',
              'float': 'none',
              padding: '20px 0 0 0',
              margin: '0',
              clear: 'both'
            });
            box.appendChild(panelBox);

            panel = doc.createElement('div');
            panel.id = panelId;
            SaveFrom.utils.setStyle(panel, {
              background: '#fff',
              fontSize: '16px',
              display: 'block',
              'float': 'none',
              padding: '10px',
              margin: '0'
            });
            panelBox.appendChild(panel);

            var img = doc.createElement('img');
            img.src = 'data:image/gif;base64,R0lGODlhEAAQAPQAAP///6Ghg/v7+7W1ntHRwqOjha6ule/v6t7e1KmpjczMvMbGtPT08djYzOnp4ru7pcDArAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH+GkNyZWF0ZWQgd2l0aCBhamF4bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAAFUCAgjmRpnqUwFGwhKoRgqq2YFMaRGjWA8AbZiIBbjQQ8AmmFUJEQhQGJhaKOrCksgEla+KIkYvC6SJKQOISoNSYdeIk1ayA8ExTyeR3F749CACH5BAAKAAEALAAAAAAQABAAAAVoICCKR9KMaCoaxeCoqEAkRX3AwMHWxQIIjJSAZWgUEgzBwCBAEQpMwIDwY1FHgwJCtOW2UDWYIDyqNVVkUbYr6CK+o2eUMKgWrqKhj0FrEM8jQQALPFA3MAc8CQSAMA5ZBjgqDQmHIyEAIfkEAAoAAgAsAAAAABAAEAAABWAgII4j85Ao2hRIKgrEUBQJLaSHMe8zgQo6Q8sxS7RIhILhBkgumCTZsXkACBC+0cwF2GoLLoFXREDcDlkAojBICRaFLDCOQtQKjmsQSubtDFU/NXcDBHwkaw1cKQ8MiyEAIfkEAAoAAwAsAAAAABAAEAAABVIgII5kaZ6AIJQCMRTFQKiDQx4GrBfGa4uCnAEhQuRgPwCBtwK+kCNFgjh6QlFYgGO7baJ2CxIioSDpwqNggWCGDVVGphly3BkOpXDrKfNm/4AhACH5BAAKAAQALAAAAAAQABAAAAVgICCOZGmeqEAMRTEQwskYbV0Yx7kYSIzQhtgoBxCKBDQCIOcoLBimRiFhSABYU5gIgW01pLUBYkRItAYAqrlhYiwKjiWAcDMWY8QjsCf4DewiBzQ2N1AmKlgvgCiMjSQhACH5BAAKAAUALAAAAAAQABAAAAVfICCOZGmeqEgUxUAIpkA0AMKyxkEiSZEIsJqhYAg+boUFSTAkiBiNHks3sg1ILAfBiS10gyqCg0UaFBCkwy3RYKiIYMAC+RAxiQgYsJdAjw5DN2gILzEEZgVcKYuMJiEAOwAAAAAAAAAAAA==';
            img.alt = '---';
            panel.appendChild(img);

            SaveFrom.vimeo_com_embed.getLinks(SaveFrom, clipId, function(links, title){
              showLinks(links, title, panel);
            });

            return false;
          }

          panel = panel.parentNode;
          if(panel.style.display == 'none')
          {
            SaveFrom.utils.addClass(btn, 'active');
            panel.style.display = 'block';
          }
          else
          {
            SaveFrom.utils.removeClass(btn, 'active');
            panel.style.display = 'none';
          }

          return false;
        }, false);

        var node = doc.querySelectorAll('#tools a.btn');
        if(node && node.length > 0)
        {
          node = node[node.length - 1];
          var next = SaveFrom.utils.nextSibling(node);
          if(next)
            box.insertBefore(btn, next);
          else
            box.appendChild(btn);
        }
        else
          box.insertBefore(btn, box.firstChild);

        return;
      }

      var next = SaveFrom.utils.nextSibling(box);
      box = box.parentNode;

      var panel = doc.createElement('div');
      panel.id = panelId;
      SaveFrom.utils.setStyle(panel, {
        display: 'block',
        padding: '10px 0',
        fontSize: '16px'
      });

      if(next)
        box.insertBefore(panel, next);
      else
        box.appendChild(panel);

      var btn = doc.createElement('button');
      btn.textContent = SaveFrom.lng('module.download');
      btn.className = 'blue_button';
      SaveFrom.utils.setStyle(btn, {
        borderRadius: '5px',
        fontSize: '16px'
      });

      btn.addEventListener('click', function(event){
        var img = doc.createElement('img');
        img.src = 'data:image/gif;base64,R0lGODlhEAAQAPQAAP///6Ghg/v7+7W1ntHRwqOjha6ule/v6t7e1KmpjczMvMbGtPT08djYzOnp4ru7pcDArAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH+GkNyZWF0ZWQgd2l0aCBhamF4bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAAFUCAgjmRpnqUwFGwhKoRgqq2YFMaRGjWA8AbZiIBbjQQ8AmmFUJEQhQGJhaKOrCksgEla+KIkYvC6SJKQOISoNSYdeIk1ayA8ExTyeR3F749CACH5BAAKAAEALAAAAAAQABAAAAVoICCKR9KMaCoaxeCoqEAkRX3AwMHWxQIIjJSAZWgUEgzBwCBAEQpMwIDwY1FHgwJCtOW2UDWYIDyqNVVkUbYr6CK+o2eUMKgWrqKhj0FrEM8jQQALPFA3MAc8CQSAMA5ZBjgqDQmHIyEAIfkEAAoAAgAsAAAAABAAEAAABWAgII4j85Ao2hRIKgrEUBQJLaSHMe8zgQo6Q8sxS7RIhILhBkgumCTZsXkACBC+0cwF2GoLLoFXREDcDlkAojBICRaFLDCOQtQKjmsQSubtDFU/NXcDBHwkaw1cKQ8MiyEAIfkEAAoAAwAsAAAAABAAEAAABVIgII5kaZ6AIJQCMRTFQKiDQx4GrBfGa4uCnAEhQuRgPwCBtwK+kCNFgjh6QlFYgGO7baJ2CxIioSDpwqNggWCGDVVGphly3BkOpXDrKfNm/4AhACH5BAAKAAQALAAAAAAQABAAAAVgICCOZGmeqEAMRTEQwskYbV0Yx7kYSIzQhtgoBxCKBDQCIOcoLBimRiFhSABYU5gIgW01pLUBYkRItAYAqrlhYiwKjiWAcDMWY8QjsCf4DewiBzQ2N1AmKlgvgCiMjSQhACH5BAAKAAUALAAAAAAQABAAAAVfICCOZGmeqEgUxUAIpkA0AMKyxkEiSZEIsJqhYAg+boUFSTAkiBiNHks3sg1ILAfBiS10gyqCg0UaFBCkwy3RYKiIYMAC+RAxiQgYsJdAjw5DN2gILzEEZgVcKYuMJiEAOwAAAAAAAAAAAA==';
        img.alt = '---';
        this.parentNode.appendChild(img);

        this.parentNode.removeChild(this);

        SaveFrom.vimeo_com_embed.getLinks(SaveFrom, clipId, function(links, title){
          showLinks(links, title, panel);
        });
      }, false);

      panel.appendChild(btn);
    }


    function showLinks(links, title, parent)
    {
      if(!parent)
        return;

      while(parent.firstChild)
        parent.removeChild(parent.firstChild);

      if(links && links.length > 0)
      {
        parent.appendChild(doc.createTextNode(SaveFrom.lng('module.download') + ': '));

        var success = false;
        for(var i = 0; i < links.length; i++)
        {
          if(links[i].url)
          {
            success = true;

            var ext = links[i].ext;
            if(!ext)
            {
              ext = 'MP4';
              if(links[i].url.search(/\.flv($|\?)/i) != -1)
                ext = 'FLV';
            }

            var name = links[i].name ? links[i].name : ext;
            var a = doc.createElement('a');
            a.href = links[i].url;
            a.textContent = name;
            SaveFrom.utils.setStyle(a, {margin: '0 0 0 15px'});
            parent.appendChild(a);
            
            SaveFrom.utils.appendFileSizeIcon(SaveFrom, a);

            if(!links[i].noTitle)
            {
              a.title = title ? (title + '.' + ext.toLowerCase()) : '';
              a.addEventListener('click', onDownload, true);
            }
          }
        }

        if(success)
          return;
      }

      parent.appendChild(doc.createTextNode(SaveFrom.lng('vimeo.linksNotFound')));
      return;
    }


    function onDownload(event)
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
    }
  }
};