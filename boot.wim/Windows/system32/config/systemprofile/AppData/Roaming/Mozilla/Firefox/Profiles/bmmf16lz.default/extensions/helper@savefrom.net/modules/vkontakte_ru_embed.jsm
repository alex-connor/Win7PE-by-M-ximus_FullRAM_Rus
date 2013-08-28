EXPORTED_SYMBOLS = ["vkontakte_ru_embed"];

var vkontakte_ru_embed = {
  getLinks: function(sf, id, callback)
  {
    var vid = id;
    if(vid.search(/^video-?\d+_\d+/i) == -1)
    {
      var oid = '', id = '';
      var m = vid.match(/(?:^|&)oid=(-?\d+)/i);
      if(m && m.length > 1)
        oid = m[1];
        
      m = vid.match(/(?:^|&)id=(-?\d+)/i);
      if(m && m.length > 1)
        id = m[1];
        
      vid = '';
      if(oid && id)
        vid = 'video' + oid + '_' + id;
    }

    if(!vid)
    {
      if(callback && typeof(callback) == 'function')
        callback(vid, null, '');

      return;
    }
    
    var url = 'http://vk.com/' + vid;
    
    sf.request.send(url, function(r){
      if(r.status == 200 && r.responseText)
      {
        var links = null;

        var json = r.responseText.match(/var vars\s*=\s*(\{[^\}]+\})/i);
        if(json)
        {
          try
          {
            json = json[1];
            
            if(json.search(/^\{\s*\\\"/) > -1)
              json = json.replace(/\\\"/g, '"');

            json = sf.JSON.parse(json);
            if(json)
            {
              links = json;
            }
          }
          catch(err){}
        }
        
        if(links)
        {
          if(callback && typeof(callback) == 'function')
            callback(vid, links, '');
            
          return;  
        }
      }

      if(callback && typeof(callback) == 'function')
        callback(vid, null, '');
    });
  }
};