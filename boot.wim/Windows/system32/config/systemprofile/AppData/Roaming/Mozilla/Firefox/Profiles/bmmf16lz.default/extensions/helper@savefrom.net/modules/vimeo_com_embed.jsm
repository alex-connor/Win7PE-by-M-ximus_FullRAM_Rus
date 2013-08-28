EXPORTED_SYMBOLS = ["vimeo_com_embed"];

var vimeo_com_embed = {
  getLinks: function(sf, id, callback)
  {
    var url = 'http://vimeo.com/moogaloop/load/clip:' + id + '/';
    
    sf.request.send(url, function(r){
      if(r.status == 200 && r.responseXML)
      { 
        var sig = r.responseXML.querySelector('request_signature');
        if(sig && sig.firstChild.nodeValue)
        {
          if(sig)
          {
            var u = 'http://vimeo.com/moogaloop/play/clip:' +
              id + '/' + sig.firstChild.nodeValue + '/';
              
            var sigExp = r.responseXML.querySelector('request_signature_expires');
            if(sigExp && sigExp.firstChild.nodeValue)
              u += sigExp.firstChild.nodeValue + '/';
              
            var title = '';
            var t = r.responseXML.querySelector('video caption');
            if(t && t.firstChild.nodeValue)
              title = t.firstChild.nodeValue;
              
            var links = [];
            links.push({
              url: u + '?q=sd',
              name: 'SD',
              type: 'mp4',
              ext: 'MP4'
            });
              
            var hd = r.responseXML.querySelector('isHD');
            if(hd && hd.firstChild.nodeValue == '1')
            {
              links.push({
                url: u + '?q=hd',
                name: 'HD',
                type: 'mp4',
                ext: 'MP4'
              });
            }
            
            if(callback && typeof(callback) == 'function')
              callback(links, title);

            return;
          }
        }
      }
      
      vimeo_com_embed.getNoEmbedLinks(sf, id, callback);
    });
  },
  
  
  getNoEmbedLinks: function(sf, id, callback)
  {
    var url = 'http://vimeo.com/' + id;
    
    sf.request.send(url, function(r){
      if(r.status == 200 && r.responseText)
      { 
        var re = new RegExp('clip' + id + '_\\d+\\s*=\\s*(\\{[\\s\\S]+?\\})\\s*;', 'i');
        
        var config = r.responseText.match(re);
        if(config && config.length > 1)
        {
          config = config[1].replace(/(\{|,)\s*(\w+)\s*:/ig, '$1"$2":').
            replace(/(:\s+)\'/g, '$1"').replace(/\'([,\]\}])/g, '"$1');

          try
          {
            config = sf.JSON.parse(config);
            config = config.config;
          }
          catch(err)
          {
            if(callback && typeof(callback) == 'function')
              callback(null, '');

            return;
          }
          
          if(config && config.request && config.video &&
            config.request.signature && config.request.timestamp)
          {
            var data = {
              'clip_id': id,
              'sig': config.request.signature,
              'time': config.request.timestamp,
              'type': 'moogaloop_local',
              'quality': 'sd',
              'codecs': 'H264,VP8,VP6'
            };
            
            var title = config.video.title ? config.video.title : '';

            var links = [];
            links.push({
              url: 'http://player.vimeo.com/play_redirect?' + sf.utils.getQueryString(data),
              name: 'SD',
              type: 'mp4',
              ext: 'MP4'
            });
            
            if(config.video.hd == 1)
            {
              data.quality = 'hd';
              links.push({
                url: 'http://player.vimeo.com/play_redirect?' + sf.utils.getQueryString(data),
                name: 'HD',
                type: 'mp4',
                ext: 'MP4'
              });
            }
            
            if(config.video.files && config.video.files.h264)
            {
              var files = config.video.files.h264;
              if(files.length > 0)
              {
                for(var i = 0; i < files.length; i++)
                {
                  if(files[i] != 'sd' && files[i] != 'hd')
                  {
                    data.quality = files[i];
                    links.push({
                      url: 'http://player.vimeo.com/play_redirect?' + sf.utils.getQueryString(data),
                      name: ((files[i].length <= 3) ? files[i].toUpperCase() :
                        sf.utils.ucfirst(files[i].toLowerCase())),
                      type: 'mp4',  
                      ext: 'MP4'
                    });
                  }
                }
              }
            }

            if(callback && typeof(callback) == 'function')
              callback(links, title);
              
            return;  
          }
        }
      }

      if(callback && typeof(callback) == 'function')
        callback(null, '');
    });
  }
};