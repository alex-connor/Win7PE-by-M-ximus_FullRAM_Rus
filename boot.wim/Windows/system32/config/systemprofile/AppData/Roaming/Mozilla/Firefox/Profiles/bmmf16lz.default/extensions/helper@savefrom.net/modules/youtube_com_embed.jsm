EXPORTED_SYMBOLS = ["youtube_com_embed"];

var youtube_com_embed = {
  getLinks: function(win, sf, id, callback, checkSubtitles)
  {
    var eurl = encodeURIComponent(win.location.href);
    var url = 'http://www.youtube.com/get_video_info?video_id=' + id +
      '&asv=3&eurl=' + eurl + '&el=embedded';

    var cookies = 'VISITOR_INFO1_LIVE=; PREF=; GEO=';
    var _this = this;

    sf.request.send(url, function(r){
      if(r.status == 200 && r.responseText)
      {
        var fmtMap = r.responseText.match(/(?:^|&)(?:fmt_url_map|url_encoded_fmt_stream_map)=([^\s\&\"]+)/i);
        if(fmtMap && fmtMap.length > 1)
        {
          var title = r.responseText.match(/(?:^|&)title=([^\s\&\"]+)/i);
          var titleParam = '';
          if(title)
          {
            title = title[1].replace(/\+/g, '%20');
            title = decodeURIComponent(title).
              replace(/[\x2F\x5C\x3A\x7C]/g, '-').
              replace(/[\x2A\x3F]/g, '').
              replace(/\x22/g, '\'').
              replace(/\x3C/g, '(').
              replace(/\x3E/g, ')').
              replace(/(?:^\s+)|(?:\s+$)/g, '');

            titleParam = '&title=' + encodeURIComponent(title);
          }

          var l = {};

          fmtMap = fmtMap[1];

          if(fmtMap.search(/url(=|%3d)http/i) > -1)
          {
            if(fmtMap.search(/url%3dhttp/i) > -1)
              fmtMap = decodeURIComponent(fmtMap);

            fmtMap = fmtMap.split(',');
            for(var i = 0; i < fmtMap.length; ++i)
            {
              var query = sf.utils.parseQuery(fmtMap[i]);
              if(query.url)
              {
                query.url = decodeURIComponent(query.url);
                if(query.url.search(/(\?|&)sig(nature)?=/i) == -1)
                {
                  if(query.sig)
                    query.url += '&signature=' + query.sig;
                  else if(query.signature)
                    query.url += '&signature=' + query.signature;
                }

                if(query.url.search(/(\?|&)itag=/i) == -1)
                {
                  if(query.itag)
                    query.url += '&itag=' + query.itag;
                }

                var fmt = query.url.match(/(?:\?|&)itag=(\d+)/i);
                if(fmt && fmt.length > 1)
                {
                  fmt = fmt[1];

                  query.url = query.url.replace(/(\?|&)sig=/i, '$1signature=').
                    replace(/\\u0026/ig, '&').replace(/\\\//g, '/');

                  l[fmt] = query.url;

                  if(titleParam)
                    l[fmt] += titleParam;
                }
              }
            }
          }
          else
          {
            fmtMap = decodeURIComponent(fmtMap);
            fmtMap = fmtMap.replace(/\\u0026/ig, '&').replace(/\\\//g, '/');
            fmtMap = fmtMap.replace(/,(\d+)\|/g, "\n$1|");
            fmtMap = fmtMap.split('\n');

            if(fmtMap && fmtMap.length > 0)
            {
              var l = {}, links = [];
              for(var i = 0; i < fmtMap.length; i++)
              {
                var t = fmtMap[i].split('|');
                if(t && t.length >= 2)
                {
                  l[t[0]] = t[1].replace(/\\u0026/ig, '&').replace(/\\\//g, '/');
                  if(titleParam)
                    l[t[0]] += titleParam;
                }
              }
            }
          }

          if(l)
          {
            if(callback && typeof(callback) == 'function')
            {
              if(checkSubtitles)
              {
                _this.checkSubtitles(sf, id, function(subtitles){
                  callback(l, title, subtitles);
                });
              }
              else
              {
                callback(l, title);
              }
            }

            return;
          }
        }
      }

      if(callback && typeof(callback) == 'function')
        callback(null, '');
    }, '', '', '', cookies);
  },


  checkSubtitles :function(sf, id, callback)
  {
    var url = 'http://video.google.com/timedtext?hl=en&v=' + id +
      '&type=list&tlangs=1';

    sf.request.send(url, function(r){
      var result = false;
      if(r.status == 200 && r.responseXML)
      {
        if(r.responseXML.querySelector('target, track'))
          result = true;
      }

      callback(result);
    });
  }
};