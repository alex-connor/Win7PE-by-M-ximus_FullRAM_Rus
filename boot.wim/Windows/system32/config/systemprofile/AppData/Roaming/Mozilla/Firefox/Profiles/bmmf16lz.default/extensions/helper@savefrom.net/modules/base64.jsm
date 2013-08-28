EXPORTED_SYMBOLS = ["base64", "utf8"];

var base64 = {
  key: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  encode: function(text)
  {
    var res = '';
    var c1, c2, c3, e1, e2, e3, e4;
    var i = 0;

    while(i < text.length)
    {
      c1 = text.charCodeAt(i++);
      c2 = text.charCodeAt(i++);
      c3 = text.charCodeAt(i++);

      e1 = c1 >> 2;
      e2 = ((c1 & 3) << 4) | (c2 >> 4);
      e3 = ((c2 & 15) << 2) | (c3 >> 6);
      e4 = c3 & 63;

      if(isNaN(c2))
      {
        e3 = e4 = 64;
      }
      else if(isNaN(c3))
      {
        e4 = 64;
      }

      res += base64.key.charAt(e1) + base64.key.charAt(e2) + base64.key.charAt(e3) + base64.key.charAt(e4);
    }

    return res;
  },
  
  decode: function(text)
  {
    var res = '';
    var c1, c2, c3, e1, e2, e3, e4;
    var i = 0;

    text = text.replace(/[^A-Za-z0-9\+\/\=]/g, '');

    while(i < text.length)
    {
      e1 = base64.key.indexOf(text.charAt(i++));
      e2 = base64.key.indexOf(text.charAt(i++));
      e3 = base64.key.indexOf(text.charAt(i++));
      e4 = base64.key.indexOf(text.charAt(i++));

      c1 = (e1 << 2) | (e2 >> 4);
      c2 = ((e2 & 15) << 4) | (e3 >> 2);
      c3 = ((e3 & 3) << 6) | e4;

      res += String.fromCharCode(c1);

      if(e3 != 64)
        res += String.fromCharCode(c2);
      if(e4 != 64)
        res += String.fromCharCode(c3);
    }

    return res;
  }
};


var utf8 = {
  encode: function(text)
  {
    text = text.replace(/\r\n/g, '\n');
    var res = '';
    
    for(var i = 0; i < text.length; i++)
    {
      var c = text.charCodeAt(i);
      
      if(c < 128)
        res += String.fromCharCode(c);
      else if((c > 127) && (c < 2048))
      {
        res += String.fromCharCode((c >> 6) | 192);
        res += String.fromCharCode((c & 63) | 128);
      }
      else
      {
        res += String.fromCharCode((c >> 12) | 224);
        res += String.fromCharCode(((c >> 6) & 63) | 128);
        res += String.fromCharCode((c & 63) | 128);
      }
    }
    
    return res;
  },
  
  decode : function (text)  
  {
    var res = '', i = 0, c = c1 = c2 = 0;
    
    while(i < text.length)
    {
      c = text.charCodeAt(i);
      
      if(c < 128)
      {
        res += String.fromCharCode(c);
        i++;
      }
      else if((c > 191) && (c < 224))
      {
        c2 = text.charCodeAt(i + 1);
        res += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      }
      else
      {
        c2 = text.charCodeAt(i + 1);
        c3 = text.charCodeAt(i + 2);
        res += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    
    return res;
  }
};