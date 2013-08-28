EXPORTED_SYMBOLS = ["JSON"];

if(typeof(JSON) === "undefined")
{
  var JSON = {
    nsIJSON: Components.classes["@mozilla.org/dom/json;1"].createInstance(Components.interfaces.nsIJSON),
        
    parse: function(aJSONString)
    {
      return this.nsIJSON.decode(aJSONString);
    },
        
    stringify: function(aJSObject)
    {
      return this.nsIJSON.encode(aJSObject);
    }
  };
}
