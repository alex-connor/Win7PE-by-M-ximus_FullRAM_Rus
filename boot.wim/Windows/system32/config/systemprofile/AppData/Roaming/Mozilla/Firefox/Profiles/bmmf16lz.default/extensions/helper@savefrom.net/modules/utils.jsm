EXPORTED_SYMBOLS = ["utils"];

var utils = {

  trim: function(str)
  {
    return str.replace(/^\s+|\s+$/g, '');
  },

  getStyle: function(doc, node, property)
  {
    return doc.defaultView.getComputedStyle(node, null).getPropertyValue(property);
  },


  setStyle: function(node, style)
  {
    if(!node || !style)
      return;

    for(var i in style)
      node.style[i] = style[i];
  },


  nextSibling: function(node)
  {
    if(!node)
      return null;

    var next = node;
    do
    {
      next = next.nextSibling;
      if(next)
      {
        if(next.nodeType == 1)
          return next;

        if(next.nodeType == 9)
          break;
      }
    }
    while(next);

    return null;
  },


  hasClass: function(node, name)
  {
    if(!node || !node.className || name == '')
      return false;

    if(node.className == name)
      return true;

    var re = new RegExp("(^|\\s+)" + name + "(\\s+|$)");
    if(node.className.search(re) != -1)
      return true;

    return false;
  },


  addClass: function(node, name)
  {
    if(!utils.hasClass(node, name))
    {
      var c = node.className;
      if(c)
        node.className = c + ' ' + name;
      else
        node.className = name;
    }
  },


  removeClass: function(node, name)
  {
    if(!utils.hasClass(node, name))
      return;

    var re = new RegExp("(^|\\s+)" + name + "(\\s+|$)");
    node.className = node.className.replace(re, function(t, s1, s2){
      if(s1 && s2)
        return ' ';

      return '';
    });
  },


  getParentByClass: function(node, name)
  {
    if(!node || name == '')
      return false;

    if(utils.isArray(name) && name.length > 0)
    {
      for(var parent = node; parent; parent = parent.parentNode)
      {
        for(var i = 0; i < name.length; i++)
        {
          if(utils.hasClass(parent, name[i]))
            return parent;
        }
      }
    }
    else
    {
      for(var parent = node; parent; parent = parent.parentNode)
      {
        if(utils.hasClass(parent, name))
          return parent;
      }
    }

    return null;
  },


  isParent: function(node, testParent)
  {
    for(var parent = node; parent; parent = parent.parentNode)
    {
      if (parent == testParent)
        return true;
    }

    return false;
  },


  emptyNode: function(node)
  {
    while(node.firstChild)
      node.removeChild(node.firstChild);
  },


  getMatchFirst: function(str, re)
  {
    var m = str.match(re);
    if(m && m.length > 1)
      return m[1];

    return '';
  },


  ucfirst: function(str)
  {
    if(str.length)
      str = str.charAt(0).toUpperCase() + str.slice(1);

    return str;
  },


  isArray: function(obj)
  {
    if(typeof(obj) != 'object')
      return false;

    if(obj.constructor.toString().indexOf("Array") == -1)
      return false;

    return true;
  },


  getElementByIds: function(doc, ids)
  {
    for(var i = 0; i < ids.length; i++)
    {
      var node = doc.getElementById(ids[i]);
      if(node)
        return node;
    }

    return null;
  },


  removeObjectById: function(doc, id)
  {
    if(utils.isArray(id))
    {
      var res = true;

      for(var i = 0; i < id.length; i++)
      {
        var e = doc.getElementById(id[i]);
        if(e)
          e.parentNode.removeChild(e);
        else
          res = false;
      }

      return res;
    }

    var e = doc.getElementById(id);
    if(e)
    {
      e.parentNode.removeChild(e);
      return true;
    }

    return false;
  },


  getTopLevelDomain: function(domain)
  {
    if(!domain)
      return '';

    if(!domain.match(/^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}/))
      return domain;

    var a = domain.split('.');
    var l = a.length;

    if(l == 2)
      return domain;

    return (a[l - 2] + '.' + a[l - 1]);
  },


  modifyTitle: function(t)
  {
    t = t.replace(/[\x2F\x5C\x3A\x7C]/g, '-');
    t = t.replace(/[\x2A\x3F]/g, '');
    t = t.replace(/\x22/g, '\'');
    t = t.replace(/\x3C/g, '(');
    t = t.replace(/\x3E/g, ')');
    t = t.replace(/(?:^\s+)|(?:\s+$)/g, '');
    return t;
  },


  sizeHuman: function(size, round)
  {
    if(round == undefined || round == null)
      round = 2;

    var s = size, unite_spec = ['B','kB','MB','GB','TB'], count = 0, sign = '';
    if(s < 0)
    {
      sign = '-';
      s = Math.abs(s);
    }

    while(s >= 1024)
    {
      count++;
      s /= 1024;
    }

    if(round >= 0)
    {
      var m = round * 10;
      s = Math.round(s * m) / m;
    }

    if(count < unite_spec.length)
      return [sign + s, unite_spec[count]];

    return [size, ''];
  },


  parseQuery: function(query)
  {
    var k = [], m = null, re = /[?&]?([^=]+)(?:=([^&]*))?/g;
    while(m = re.exec(query))
    {
      if(m[1] && m[2])
        k[m[1]] = m[2];
      else if(m[1])
        k[m[1]] = '';
    };
    return k;
  },


  getQueryString: function(query, key_prefix, key_suffix)
  {
    if(!query || typeof(query) != 'object')
      return '';

    if(key_prefix === undefined)
      key_prefix = '';

    if(key_suffix === undefined)
      key_suffix = '';

    var str = '';
    for(var key in query)
    {
      if(str.length)
        str += '&';

      if(query[key] instanceof Object)
      {
        if(!key_prefix)
          key_prefix = '';

        if(!key_suffix)
          key_suffix = '';

        str += this.getQueryString(query[key], key_prefix + key + "[", "]" + key_suffix);
      }
      else
        str += key_prefix + escape(key) + key_suffix + '=' + escape(query[key]);
    }

    return str;
  },


  appendFileSizeIcon: function(sf, anchor, iconStyle, textStyle, title)
  {
    if(!sf.request)
      return;

    var _this = this;

    var iconColor = '#333333';
    if(iconStyle && iconStyle.color)
      iconColor = iconStyle.color;

    var s = anchor.ownerDocument.createElement('img');
    s.src = this.svg.getSrc(sf, 'info', iconColor);
    s.title = title || sf.lng('module.fileSizeIconTitle');

    var defIconStyle = {
      width: '14px',
      height: '14px',
      marginLeft: '3px',
      verticalAlign: 'middle',
      position: 'relative',
      top: '-1px',
      cursor: 'pointer'
    };

    var defTextStyle = {
      fontSize: '75%',
      fontWeight: 'normal',
      marginLeft: '3px',
      whiteSpace: 'nowrap'
    };

    this.setStyle(s, defIconStyle);
    if (iconStyle != null)
      this.setStyle(s, iconStyle);

    s.addEventListener("click", function(event){
      event.preventDefault();
      event.stopPropagation();

      var node = anchor.ownerDocument.createElement('span');
      node.textContent = '...';
      _this.setStyle(node, defTextStyle);
      if (textStyle != null)
        _this.setStyle(node, textStyle);

      s.parentNode.replaceChild(node, s);

      sf.request.getFileSize(anchor.href, function(fileSize, fileType){
        if (fileSize == 0)
        {
          node.parentNode.removeChild(node);

          if(!iconStyle)
            iconStyle = {};

          iconStyle.color = '#f00';

          _this.appendFileSizeIcon(sf, anchor, iconStyle, textStyle, sf.lng('module.fileSizeIconErrTitle'));
          return;
        }

        var size = _this.sizeHuman(fileSize, 2);
        if(size[1])
          size = size[0] + ' ' + sf.lng('fileSize' + size[1]);
        else
          size = size[0];

        if(fileType.search(/^audio\//i) > -1)
        {
          var seconds = anchor.getAttribute('data-savefrom-helper-duration', false);
          if(seconds)
          {
            seconds = parseInt(seconds);
            if(!isNaN(seconds))
            {
              var bitrate = Math.floor((fileSize / seconds) / 125) + ' ' + sf.lng('kbps');

              node.textContent = '(' + size + ' ~ ' + bitrate + ')';
              return;
            }
          }
        }

        node.textContent = '(' + size + ')';
        node.title = fileType ? fileType : '';
      });

      return false;

    }, true);

    if (anchor.nextSibling == null)
      anchor.parentNode.appendChild(s);
    else
      anchor.parentNode.insertBefore(s, anchor.nextSibling);

    return s;
  },


  svg: {
    icon: {
      download: 'M 4,0 4,8 0,8 8,16 16,8 12,8 12,0 4,0 z',
      info: 'M 8,1.55 C 11.6,1.55 14.4,4.44 14.4,8 14.4,11.6 11.6,14.4 8,14.4 4.44,14.4 1.55,11.6 1.55,8 1.55,4.44 4.44,1.55 8,1.55 M 8,0 C 3.58,0 0,3.58 0,8 0,12.4 3.58,16 8,16 12.4,16 16,12.4 16,8 16,3.58 12.4,0 8,0 L 8,0 z M 9.16,12.3 H 6.92 V 7.01 H 9.16 V 12.3 z M 8.04,5.91 C 7.36,5.91 6.81,5.36 6.81,4.68 6.81,4 7.36,3.45 8.04,3.45 8.72,3.45 9.27,4 9.27,4.68 9.27,5.36 8.72,5.91 8.04,5.91 z'
    },

    cache: {},

    getSrc: function(sf, icon, color)
    {
      if(!this.icon[icon])
        return '';

      if(!this.cache[icon])
        this.cache[icon] = {};

      if(!this.cache[icon][color] && sf.base64)
      {
        this.cache[icon][color] = sf.base64.encode(
          '<?xml version="1.0" encoding="UTF-8"?>' +
          '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.1" width="16" height="16" viewBox="0 0 16 16" id="svg2" xml:space="preserve">' +
          '<path d="' + this.icon[icon] + '" fill="' + color + '" /></svg>'
        );
      }

      if(this.cache[icon][color])
        return 'data:image/svg+xml;base64,' + this.cache[icon][color];

      return '';
    }
  }
};