EXPORTED_SYMBOLS = ["video"];

var video = {
  dataAttr: 'data-savefrom-video-visible',

  yt: {
    show3D: false,

    showFormat: {
      'FLV': true,
      'MP4': true,
      'WebM': false,
      '3GP': false
    },

    format: {
      'FLV': {
        '5': {quality: '240p'},
        '34': {quality: '360p'},
        '35': {quality: '480p'},
        '83': {quality: '480p', '3d': true}
      },

      'MP4': {
        '18': {quality: '360p'},
        '22': {quality: '720p'},
        '37': {quality: '1080p'},
        '38': {quality: '4k'},
        '82': {quality: '360p', '3d': true},
        '84': {quality: '720p', '3d': true},
        '85': {quality: '1080p', '3d': true}
      },

      'WebM': {
        '43': {quality: '360p'},
        '44': {quality: '480p'},
        '45': {quality: '720p'},
        '46': {quality: '1080p'},
        '100': {quality: '360p', '3d': true},
        '101': {quality: '480p', '3d': true},
        '102': {quality: '720p', '3d': true}
      },

      '3GP': {
        '17': {quality: '144p'},
        '36': {quality: '240p'}
      }
    },


    init: function(prefs)
    {
      this.show3D = !prefs.getBoolPref('ytHide3D');

      var show = false;
      for(var i in this.showFormat)
      {
        this.showFormat[i] = !prefs.getBoolPref('ytHide' + i);
        if(this.showFormat[i])
          show = true;
      }

      if(!show)
        this.showFormat.FLV = true;
    },


    show: function(sf, links, parent, style)
    {
      style = style || {};

      var document = parent.ownerDocument;

      var content = document.createElement('div');
      sf.utils.setStyle(content, {
        display: 'inline-block',
        margin: '0 auto'
      });
      parent.appendChild(content);

      var box = document.createElement('div');
      sf.utils.setStyle(box, {
        display: 'inline-block',
        padding: '0 90px 0 0',
        position: 'relative'
      });
      content.appendChild(box);

      var tbl = document.createElement('table');
      sf.utils.setStyle(tbl, {
        emptyCells: 'show',
        borderCollapse: 'collapse',
        margin: '0 auto',
        padding: '0',
        width: 'auto'
      });
      box.appendChild(tbl);

      var hidden = false;

      for(var i in video.yt.format)
      {
        if(video.yt.append(sf, links, i, video.yt.format[i], tbl, style))
        {
          hidden = true;
        }
      }

      for(var i in links)
      {
        if(video.yt.append(sf, links, '', null, tbl, style))
        {
          hidden = true;
        }

        break;
      }

      if(!hidden)
        return;

      var more = document.createElement('span');
      more.textContent = sf.lng('module.more') + ' »';
      sf.utils.setStyle(more, {
        color: '#555',
        border: '1px solid #a0a0a0',
        borderRadius: '3px',
        display: 'block',
        fontFamily: 'Arial',
        fontSize: '15px',
        padding: '1px 5px',
        position: 'absolute',
        bottom: '3px',
        right: '0',
        cursor: 'pointer'
      });

      if(style.btn && typeof(style.btn) == 'object')
        sf.utils.setStyle(more, style.btn);

      box.appendChild(more);

      more.addEventListener('click', function(event){
        event.preventDefault();
        event.stopPropagation();

        var e = parent.querySelectorAll('*[' + video.dataAttr + ']');
        for(var i = 0; i < e.length; i++)
        {
          var visible = e[i].getAttribute(video.dataAttr, false);
          var display = 'none', symbol = '»';
          if(visible == '0')
          {
            visible = '1';
            display = '';
            symbol = '«';
          }
          else
            visible = '0';

          e[i].style.display = display;
          e[i].setAttribute(video.dataAttr, visible, false);
          this.textContent = sf.lng('module.more') + ' ' + symbol;
        }

        return false;
      }, false);
    },


    append: function(sf, links, title, format, parent, style)
    {
      var document = parent.ownerDocument, hidden = false;

      var aStyle = {
        whiteSpace: 'nowrap'
      };

      var sStyle = {
        fontSize: '75%',
        fontWeight: 'normal',
        marginLeft: '3px',
        whiteSpace: 'nowrap'
      };

      var tr = document.createElement('tr');
      parent.appendChild(tr);

      var td = document.createElement('td');
      td.appendChild(document.createTextNode(title ? title : '???'));

      if(!title || !video.yt.showFormat[title])
      {
        tr.setAttribute(video.dataAttr, '0');
        tr.style.display = 'none';
        hidden = true;
      }

      sf.utils.setStyle(td, {
        border: 'none',
        padding: '3px 15px 3px 0',
        textAlign: 'left',
        verticalAlign: 'middle'
      });

      tr.appendChild(td);

      td = document.createElement('td');
      sf.utils.setStyle(td, {
        border: 'none',
        padding: '3px 0',
        textAlign: 'left',
        verticalAlign: 'middle'
      });
      tr.appendChild(td);

      var sep = false;
      if(format)
      {
        for(var i in format)
        {
          if(links[i])
          {
            if(sep)
              aStyle.marginLeft = '15px';

            var a = document.createElement('a');
            a.href = links[i];
            a.textContent = format[i]['3d'] ? '3D' : format[i].quality;
            sf.utils.setStyle(a, aStyle);
            if(style.link && typeof(style.link) == 'object')
              sf.utils.setStyle(a, style.link);

            if(format[i]['3d'])
            {
              if(!hidden && !video.yt.show3D)
              {
                hidden = true;
                var box = document.createElement('span');
                box.setAttribute(video.dataAttr, '0');
                box.style.display = 'none';
                td.appendChild(box);
                td = box;
              }

              var s = document.createElement('span');
              s.textContent = format[i].quality;
              sf.utils.setStyle(s, sStyle);
              if(style.text && typeof(style.text) == 'object')
                sf.utils.setStyle(s, style.text);

              a.appendChild(s);
            }

            td.appendChild(a);

            sf.utils.appendFileSizeIcon(sf, a, style.fsIcon, style.fsText);

            sep = true;

            delete links[i];
          }
        }
      }
      else
      {
        for(var i in links)
        {
          if(sep)
            aStyle.marginLeft = '15px';

          var a = document.createElement('a');
          a.href = links[i];
          a.textContent = i;
          sf.utils.setStyle(a, aStyle);
          if(style.link && typeof(style.link) == 'object')
              sf.utils.setStyle(a, style.link);

          td.appendChild(a);
          sf.utils.appendFileSizeIcon(sf, a, style.fsIcon, style.fsText);
        }
      }

      return hidden;
    }
  },


  vk: {
    getFlvLink: function(v)
    {
      if(v.host.search(/^http:\/\//i) != -1)
      {
        if(v.host.charAt(v.host.length - 1) != '/')
          v.host += '/';

        if(v.host.search(/^http:\/\/cs\d+\./i) != -1)
          return v.host + 'u' + v.uid + '/videos/' + v.vtag + '.flv';

        return v.host + 'assets/video/' + v.vtag + v.vkid + '.vk.flv';
      }

      if(v.host.search(/\D/) == -1)
        return 'http://cs' + v.host + '.' + 'vk.com/u' + v.uid + '/videos/' + v.vtag + '.flv';

      return 'http://' + v.host + '/assets/video/' + v.vtag + v.vkid + '.vk.flv';
    },


    getMp4Link: function(v, q)
    {
      if(q == 240 && v.no_flv == 0)
        return video.vk.getFlvLink(v);

      if(v.host.search(/^http:\/\//i) != -1)
      {
        if(v.host.charAt(v.host.length - 1) != '/')
          v.host += '/';

        return v.host + 'u' + v.uid + '/videos/' + v.vtag + '.' + q + '.mp4';
      }

      return 'http://cs' + v.host + '.' + 'vk.com/u' + v.uid + '/videos/' + v.vtag + '.' + q + '.mp4';
    },


    getLinks: function(v)
    {
      if(!v || !v.host || !v.vtag || (!v.vkid && !v.uid))
        return null;

      v.host = v.host.replace(/\\\//g, '/');

      if(v.hd > 0 && (!v.hd_def || v.hd > v.hd_def))
        v.hd_def = v.hd;

      var links = [];
      if(v.hd_def <= 0 && v.no_flv == 0)
      {
        links.push({
          url: video.vk.getFlvLink(v),
          name: 'FLV',
          subname: '',
          type: 'flv'
        });
      }
      else
      {
        links.push({
          url: video.vk.getMp4Link(v, 240),
          name: 'MP4',
          subname: '',
          type: 'mp4'
        });

        if(v.hd_def > 0)
        {
          links.push({
            url: video.vk.getMp4Link(v, 360),
            name: 'MP4',
            subname: '360',
            type: 'mp4'
          });
        }
        if(v.hd_def > 1)
        {
          links.push({
            url: video.vk.getMp4Link(v, 480),
            name: 'MP4',
            subname: '480',
            type: 'mp4'
          });
        }
        if(v.hd_def > 2)
        {
          links.push({
            url: video.vk.getMp4Link(v, 720),
            name: 'MP4',
            subname: '720',
            type: 'mp4'
          });
        }
      }

      return links;
    }
  } // vk
};