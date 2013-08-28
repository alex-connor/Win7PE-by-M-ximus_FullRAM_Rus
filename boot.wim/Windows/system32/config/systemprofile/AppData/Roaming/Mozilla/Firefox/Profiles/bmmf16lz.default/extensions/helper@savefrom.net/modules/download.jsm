var download = {
  maxFileNameLength: 80,

  getFileNameParts: function(fileName)
  {
    return fileName.match(/^(.+)\.([a-z0-9]{1,4})/i);
  },

  decodeHTML: function(html)
  {
    var s = Components.classes["@mozilla.org/feed-unescapehtml;1"]
      .getService(Components.interfaces.nsIScriptableUnescapeHTML);

    return s.unescape(html);
  },

  shortenFileName: function(fileName)
  {
    fileName = fileName.substr(0, download.maxFileNameLength);
    var nws = '\\u0030-\\u0039\\u0041-\\u005a\\u005f\\u0061-\\u007a\\u00aa\\u00b5\\u00ba\\u00c0-\\u00d6\\u00d8-\\u00f6\\u00f8-\\u021f\\u0222-\\u0233\\u0250-\\u02ad\\u0386\\u0388-\\u038a\\u038c\\u038e-\\u03a1\\u03a3-\\u03ce\\u03d0-\\u03d7\\u03da-\\u03f3\\u0400-\\u0481\\u048c-\\u04c4\\u04c7\\u04c8\\u04cb\\u04cc\\u04d0-\\u04f5\\u04f8\\u04f9\\u0531-\\u0556\\u0561-\\u0587\\u05d0-\\u05ea\\u05f0-\\u05f2\\u0621-\\u063a\\u0641-\\u064a\\u0660-\\u0669\\u0671-\\u06d3\\u06d5\\u06f0-\\u06fc\\u0710\\u0712-\\u072c\\u0780-\\u07a5\\u0905-\\u0939\\u093d\\u0950\\u0958-\\u0961\\u0966-\\u096f\\u0985-\\u098c\\u098f\\u0990\\u0993-\\u09a8\\u09aa-\\u09b0\\u09b2\\u09b6-\\u09b9\\u09dc\\u09dd\\u09df-\\u09e1\\u09e6-\\u09f1\\u0a05-\\u0a0a\\u0a0f\\u0a10\\u0a13-\\u0a28\\u0a2a-\\u0a30\\u0a32\\u0a33\\u0a35\\u0a36\\u0a38\\u0a39\\u0a59-\\u0a5c\\u0a5e\\u0a66-\\u0a6f\\u0a72-\\u0a74\\u0a85-\\u0a8b\\u0a8d\\u0a8f-\\u0a91\\u0a93-\\u0aa8\\u0aaa-\\u0ab0\\u0ab2\\u0ab3\\u0ab5-\\u0ab9\\u0abd\\u0ad0\\u0ae0\\u0ae6-\\u0aef\\u0b05-\\u0b0c\\u0b0f\\u0b10\\u0b13-\\u0b28\\u0b2a-\\u0b30\\u0b32\\u0b33\\u0b36-\\u0b39\\u0b3d\\u0b5c\\u0b5d\\u0b5f-\\u0b61\\u0b66-\\u0b6f\\u0b85-\\u0b8a\\u0b8e-\\u0b90\\u0b92-\\u0b95\\u0b99\\u0b9a\\u0b9c\\u0b9e\\u0b9f\\u0ba3\\u0ba4\\u0ba8-\\u0baa\\u0bae-\\u0bb5\\u0bb7-\\u0bb9\\u0be7-\\u0bef\\u0c05-\\u0c0c\\u0c0e-\\u0c10\\u0c12-\\u0c28\\u0c2a-\\u0c33\\u0c35-\\u0c39\\u0c60\\u0c61\\u0c66-\\u0c6f\\u0c85-\\u0c8c\\u0c8e-\\u0c90\\u0c92-\\u0ca8\\u0caa-\\u0cb3\\u0cb5-\\u0cb9\\u0cde\\u0ce0\\u0ce1\\u0ce6-\\u0cef\\u0d05-\\u0d0c\\u0d0e-\\u0d10\\u0d12-\\u0d28\\u0d2a-\\u0d39\\u0d60\\u0d61\\u0d66-\\u0d6f\\u0d85-\\u0d96\\u0d9a-\\u0db1\\u0db3-\\u0dbb\\u0dbd\\u0dc0-\\u0dc6\\u0e01-\\u0e30\\u0e32\\u0e33\\u0e40-\\u0e45\\u0e50-\\u0e59\\u0e81\\u0e82\\u0e84\\u0e87\\u0e88\\u0e8a\\u0e8d\\u0e94-\\u0e97\\u0e99-\\u0e9f\\u0ea1-\\u0ea3\\u0ea5\\u0ea7\\u0eaa\\u0eab\\u0ead-\\u0eb0\\u0eb2\\u0eb3\\u0ebd\\u0ec0-\\u0ec4\\u0ed0-\\u0ed9\\u0edc\\u0edd\\u0f00\\u0f20-\\u0f29\\u0f40-\\u0f47\\u0f49-\\u0f6a\\u0f88-\\u0f8b\\u1000-\\u1021\\u1023-\\u1027\\u1029\\u102a\\u1040-\\u1049\\u1050-\\u1055\\u10a0-\\u10c5\\u10d0-\\u10f6\\u1100-\\u1159\\u115f-\\u11a2\\u11a8-\\u11f9\\u1200-\\u1206\\u1208-\\u1246\\u1248\\u124a-\\u124d\\u1250-\\u1256\\u1258\\u125a-\\u125d\\u1260-\\u1286\\u1288\\u128a-\\u128d\\u1290-\\u12ae\\u12b0\\u12b2-\\u12b5\\u12b8-\\u12be\\u12c0\\u12c2-\\u12c5\\u12c8-\\u12ce\\u12d0-\\u12d6\\u12d8-\\u12ee\\u12f0-\\u130e\\u1310\\u1312-\\u1315\\u1318-\\u131e\\u1320-\\u1346\\u1348-\\u135a\\u1369-\\u1371\\u13a0-\\u13f4\\u1401-\\u166c\\u166f-\\u1676\\u1681-\\u169a\\u16a0-\\u16ea\\u1780-\\u17b3\\u17e0-\\u17e9\\u1810-\\u1819\\u1820-\\u1842\\u1844-\\u1877\\u1880-\\u18a8\\u1e00-\\u1e9b\\u1ea0-\\u1ef9\\u1f00-\\u1f15\\u1f18-\\u1f1d\\u1f20-\\u1f45\\u1f48-\\u1f4d\\u1f50-\\u1f57\\u1f59\\u1f5b\\u1f5d\\u1f5f-\\u1f7d\\u1f80-\\u1fb4\\u1fb6-\\u1fbc\\u1fbe\\u1fc2-\\u1fc4\\u1fc6-\\u1fcc\\u1fd0-\\u1fd3\\u1fd6-\\u1fdb\\u1fe0-\\u1fec\\u1ff2-\\u1ff4\\u1ff6-\\u1ffc\\u203f\\u2040\\u207f\\u2102\\u2107\\u210a-\\u2113\\u2115\\u2119-\\u211d\\u2124\\u2126\\u2128\\u212a-\\u212d\\u212f-\\u2131\\u2133-\\u2139\\u3006\\u3041-\\u3094\\u30a1-\\u30fb\\u3105-\\u312c\\u3131-\\u318e\\u31a0-\\u31b7\\u3400-\\u4db5\\u4e00-\\u9fa5\\ua000-\\ua48c\\uac00-\\ud7a3\\uf900-\\ufa2d\\ufb00-\\ufb06\\ufb13-\\ufb17\\ufb1d\\ufb1f-\\ufb28\\ufb2a-\\ufb36\\ufb38-\\ufb3c\\ufb3e\\ufb40\\ufb41\\ufb43\\ufb44\\ufb46-\\ufbb1\\ufbd3-\\ufd3d\\ufd50-\\ufd8f\\ufd92-\\ufdc7\\ufdf0-\\ufdfb\\ufe33\\ufe34\\ufe4d-\\ufe4f\\ufe70-\\ufe72\\ufe74\\ufe76-\\ufefc\\uff10-\\uff19\\uff21-\\uff3a\\uff3f\\uff41-\\uff5a\\uff65-\\uff6f\\uff71-\\uff9d\\uffa0-\\uffbe\\uffc2-\\uffc7\\uffca-\\uffcf\\uffd2-\\uffd7\\uffda-\\uffdc';
    var re = new RegExp('^(.+)([^' + nws + ']+)[' + nws + ']+$', 'i');
    return fileName.replace(re, function(str, m1, m2){
      m1 = m1.replace(/[,_\-\.]+$/g, '');
      if(m2 == ')' || m2 == ']')
        return m1 + m2;

      return m1;
    });
  },

  modifyFileName: function(doc, fileName)
  {
    if(!fileName)
      return '';

    try
    {
      fileName = decodeURIComponent(fileName);
    }
    catch(err)
    {
      fileName = unescape(fileName);
    }

    fileName = this.decodeHTML(fileName);

    fileName = fileName.replace(/\s+/g, ' ')
      .replace(/[\x2F\x5C\x3A\x7C]+/g, '_')
      .replace(/[\x2A\x3F\x22]/g, '')
      .replace(/\x3C/g, '(')
      .replace(/\x3E/g, ')')
      .replace(/(?:^\s+)|(?:\s+$)/g, '')
      .replace(/(\.|\!|\?|_|,|\-|\(|\)|\:|\+){2,1000}/g, '$1')
      .replace(/[\.,:;\/\-_\+=\x27]$/ig, '');

    if(!fileName)
      return '';

    if(fileName.length <= this.maxFileNameLength)
      return fileName;

    var parts = this.getFileNameParts(fileName);
    if(parts && parts.length == 3)
    {
      parts[1] = this.shortenFileName(parts[1]);
      return parts[1] + '.' + parts[2];
    }

    fileName = this.shortenFileName(fileName);
    return fileName;
  },

  save: function(doc, url, fileName, skipPrompt, filePickerTitleKey)
  {
    if(skipPrompt == undefined)
      skipPrompt = false;

    fileName = this.modifyFileName(doc, fileName);
    var fileInfo = new FileInfo(fileName);
    initFileInfo(fileInfo, url, null, null, null, null);

    if(fileName)
    {
      var parts = this.getFileNameParts(fileName, true);
      fileInfo.fileName = fileName;
      if(parts && parts.length > 1)
      {
        fileInfo.fileBaseName = parts[1];
        if(parts.length > 2)
          fileInfo.fileExt = parts[2];
      }
    }

    var file, fileURL;
    var fpParams = {
      fpTitleKey: filePickerTitleKey,
      isDocument: false,
      fileInfo: fileInfo,
      contentType: null,
      saveMode: SAVEMODE_FILEONLY,
      saveAsType: kSaveAsType_Complete,
      file: file,
      fileURL: fileURL
    };

    if(!getTargetFile(fpParams, skipPrompt))
      return;

    file = fpParams.file;
    fileURL = fpParams.fileURL;
    if (!fileURL)
      fileURL = makeFileURI(file);

    var source = fileInfo.uri;

    var persist = makeWebBrowserPersist();
    const nsIWBP = Components.interfaces.nsIWebBrowserPersist;
    persist.persistFlags = nsIWBP.PERSIST_FLAGS_REPLACE_EXISTING_FILES |
      nsIWBP.PERSIST_FLAGS_AUTODETECT_APPLY_CONVERSION |
      nsIWBP.PERSIST_FLAGS_FORCE_ALLOW_COOKIES;

    var tr = Components.classes["@mozilla.org/transfer;1"].createInstance(Components.interfaces.nsITransfer);
    tr.init(fileInfo.uri, fileURL, '', null, null, null, persist);
    persist.progressListener = new DownloadListener(window, tr);
    persist.saveURI(source, null, null, null, null, fileURL);
  }
};