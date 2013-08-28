var dailymotion = {
  run: function(win, doc){
    var embed = null;
    var videoTitle = '';
    var panelId = 'SaveFrom_download_panel';

    if(doc.getElementById(panelId))
      return;

    var video = getVideoInfo();
    if(!video)
      return;

    var result = handleLinks(video);
    if(!result)
      return;

    var panel = createPanel(result);

    var btnBox = doc.getElementById('sd_video_tools');
    if(btnBox && btnBox.tagName == 'UL')
    {
      panel.style.display = 'none';
      panel.style.textAlign = 'center';

      btnBox.parentNode.insertBefore(panel, SaveFrom.utils.nextSibling(btnBox));

      var li = doc.createElement('li');
      var a = doc.createElement('a');
      a.className = 'dmco_simplelink button linkable';
      a.style.fontWeight = 'bold';
      a.href = '#';
      a.textContent = SaveFrom.lng('module.download');
      a.addEventListener('click', function(event){
        event.preventDefault();
        event.stopPropagation();
        panel.style.display = (panel.style.display == 'none') ? '' : 'none';
      }, true);
      li.appendChild(a);
      btnBox.insertBefore(li, btnBox.firstChild);
    }
    else
    {
      if(embed)
        embed.parentNode.parentNode.parentNode.appendChild(panel);
      else
        doc.body.insertBefore(panel, doc.body.firstChild);
    }



    function createPanel(result)
    {
      var p = doc.createElement('div');
      p.id = panelId;
      p.style.background = '#fff';
      p.style.fontSize = '17px';
      p.style.padding = '5px 0';

      p.appendChild(doc.createTextNode(SaveFrom.lng('module.download') + ': '));

      var fsStyle = {position: 'relative', bottom: '2px'};
      var sStyle = {
        fontSize: '75%',
        fontWeight: 'normal',
        marginLeft: '3px',
        whiteSpace: 'nowrap'
      };

      for(var i = 0; i < result.length; i++)
      {
        var a = doc.createElement('a');
        a.href = result[i][0];
        a.title = videoTitle ? (videoTitle + '.' + result[i][2].toLowerCase()) : '';
        a.textContent = result[i][2];
        a.style.margin = '0 0 0 10px';
        a.style.paddingTop = '10px';
        a.addEventListener('click', onDownloadVideo, true);

        if(result[i][1])
        {
          var s = doc.createElement('span');
          s.textContent = result[i][1];
          SaveFrom.utils.setStyle(s, sStyle);
          a.appendChild(s);
        }

        p.appendChild(a);

        SaveFrom.utils.appendFileSizeIcon(SaveFrom, a, fsStyle, fsStyle);
      }

      return p;
    }


    function handleLinks(video)
    {
      var result = [];
      var links = null;

      if(typeof(video) == 'object')
        links = video;
      else
        var links = video.split('||');

      if(links && links.length > 0)
      {
        for(var i = 0; i < links.length; i++)
        {
          links[i] = links[i].replace(/\\\//g, '/');
          links[i] = links[i].replace(/\@\@[\w\-]+$/, '');
          var size = '';
          var t = links[i].match(/\/cdn\/\w+\-(\d+x\d+)\//i);
          if(t && t.length > 1)
          {
            size = t[1];
          }
          else
          {
            t = links[i].match(/\D(\d+x\d+)\D/i);
            if(t && t.length > 1)
            {
              size = t[1];
            }
          }

          var ext = 'FLV';
          var t = links[i].match(/\.(\w{1,6})(?:$|\?)/);
          if(t && t.length > 1)
          {
            ext = t[1].toUpperCase();
          }

          if(size !== '80x60')
          {
            result.push([links[i], size, ext]);
          }
        }
      }

      if(!result)
        return null;

      var sort = function(a, b){
        a = parseInt(a[1]);
        a = isNaN(a) ? 0 : a;
        b = parseInt(b[1]);
        b = isNaN(b) ? 0 : b;
        return a - b;
      };

      result.sort(sort);

      return result;
    }


    function onDownloadVideo(event)
    {
      if(event.button == 2)
        return true;

      var link = event.target;
      if(!link)
        return true;

      if(!link.href && link.parentNode.href)
        link = link.parentNode;

      if(link.href)
      {
        SaveFrom.download.save(doc, link.href, link.title);
        event.preventDefault();
        event.stopPropagation();
        return false;
      }

      return true;
    }


    function getVideoInfo()
    {
      var e = doc.querySelectorAll('param[name="flashvars"]');
      for(var i = 0; i < e.length; i++)
      {
        var fv = e[i].getAttribute('value', false);
        if(fv)
        {
          var video = fv.match(/(?:^|&)video=([^\s\"\'\&]+)/i);
          if(video && video.length > 1)
          {
            embed = e[i];
            return decodeURIComponent(video[1]);
          }
          else
          {
            var sequence = fv.match(/(?:^|&)sequence=([^\s\"\'\&]+)/i);
            if(sequence && sequence.length > 1)
            {
              var data = decodeURIComponent(sequence[1]);
              if(data)
              {
                var links = [];
                var p = ['sdURL', 'hqURL', 'hdURL', 'hd\\d+URL'];
                for(var j = 0; j < p.length; j++)
                {
                  var re = new RegExp("[\\x22\\x27]" + p[j] + "[\\x22\\x27]\s*:\s*[\\x22\\x27]([^\\s\\x22\\x27]+)", "ig");
                  while(l = re.exec(data))
                  {
                    if(l && l.length > 1)
                      links.push(l[1]);
                  }
                }

                if(links)
                {
                  var t = data.match(/[\x22\x27]videoTitle[\x22\x27]\s*:\s*[\x22\x27]([^\s\x22\x27]+)/i);
                  if(t && t.length > 1)
                  {
                    videoTitle = t[1].replace(/\\u([\da-f]{4})/g, function(p1, p2){
                      p2 = p2.replace(/^0+/, '');
                      return String.fromCharCode(parseInt(p2, '16'));
                    });
                    videoTitle = videoTitle.replace(/\+/ig, ' ');
                  }

                  embed = e[i];
                  return links;
                }
              }
            }
          }
        }
      }

      var e = doc.querySelectorAll('.dm_widget_videoplayer');
      if(e)
      {
        for(var i = 0; i < e.length; i++)
        {
          if(e[i].innerHTML)
          {
            var fv = e[i].innerHTML.match(/flashvars=[\"\']([^\s\"\']+)/i);
            if(fv && fv.length > 1)
            {
              fv = fv[1];
              var video = fv.match(/(?:^|&)video=([^\s\"\'\&]+)/i);
              if(video && video.length > 1)
              {
                embed = e[i];
                return decodeURIComponent(video[1]);
              }
            }
          }
        }
      }


      var video = doc.body.innerHTML.match(/\(\s*[\"\']video[\"\']\s*,\s*[\"\']([^\s\"\'\<\>]+)/i);
      if(video && video.length > 1)
      {
        return decodeURIComponent(video[1]);
      }

      return '';
    }
  }
};