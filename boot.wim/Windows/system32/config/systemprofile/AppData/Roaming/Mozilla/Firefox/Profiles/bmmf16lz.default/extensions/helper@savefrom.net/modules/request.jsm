EXPORTED_SYMBOLS = ["request"];

var request = {
  send: function (url, callback, method, referer, post, cookie, user_agent, header, noRedirect)
  {
    var req = null;
    try
    {
      req = new XMLHttpRequest();
    }
    catch(err)
    {
      req = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].
        createInstance(Components.interfaces.nsIXMLHttpRequest);
    }

    if(!req)
      return;

    method = method ? method : ((post) ? 'POST' : 'GET');

    req.open(method, url, true);
    
    if(noRedirect)
    {
      var channel = req.channel.QueryInterface(Components.interfaces.nsIHttpChannel);
      channel.redirectionLimit = 0;
    }

    if(user_agent)
      req.setRequestHeader('User-Agent', user_agent);
      
    if(referer)
      req.setRequestHeader('Referer', referer);

    if(cookie)
      req.setRequestHeader('Cookie', cookie);
      
    if(post)
    {
      req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      req.setRequestHeader("Content-Length", post.length);
    }
    if(header)
    {
      for(var i = 0; i < header.length; i++)
      {
        req.setRequestHeader(header[i][0], header[i][1]);
      }
    }
    
    req.onreadystatechange = function ()
    {
      if(req.readyState != 4)
        return;
      
      callback(req);
    };
    
    if(req.readyState == 4)
    {
      return;
    }  

    if(post)
      req.send(post);
    else
      req.send();
  },
  
  
  getFileSize: function(url, callback, method, referer, post, cookie, user_agent, header)
  {
    const redirectionsLimit = 5;
    var redirects = 0;

    if(!method)
      method = 'HEAD';      
      
    fileSizeRequestSend();
      
    function fileSizeRequestSend()
    {
      request.send(url, function(req){
        if(req.status == 0 || (req.status >= 300 && req.status < 400))
        {
          redirects++;
          if(redirects > redirectionsLimit)
          {
            var fileType = req.getResponseHeader('Content-Type');
            callback(0, (fileType != null) ? fileType : '');
            return;
          }

          url = req.getResponseHeader('Location');
          if(url)
          {
            fileSizeRequestSend();
            return;
          }
        }        
        
        
        if(req.status < 300)
        {
          var fileSize = req.getResponseHeader('Content-Length');          
          fileSize = (fileSize != null) ? parseInt(fileSize) : 0;
          if(isNaN(fileSize))
            fileSize = 0;
          
          var fileType = req.getResponseHeader('Content-Type');
          callback(fileSize, (fileType != null) ? fileType : '');
          return;
        }

        callback(0, '');
      }, method, referer, null, cookie, user_agent, header, true);
    }
  }
};