function loadPrefs(e)
{
  var prefs = Components.classes["@mozilla.org/preferences-service;1"]
    .getService(Components.interfaces.nsIPrefService);
  prefs = prefs.getBranch("extensions.tabpopup.");

  // load tab preview size selection (default to percent)
  try {
    document.getElementById("SizePreview").value = prefs.getIntPref("tabpopup.SizePreview");
  }
  catch(ex) {
    document.getElementById("SizePreview").value = 2;
  }

  // load tab preview percent size (default to 40%)
  try {
    document.getElementById("PreviewPercent").value = prefs.getIntPref("tabpopup.PreviewPercent");
  }
  catch(ex) {
    document.getElementById("PreviewPercent").value = 40;
  }

  // load tab preview pixel size (default to 200)
  try {
    document.getElementById("PreviewPixel").value = prefs.getIntPref("tabpopup.PreviewPixel");
  }
  catch(ex) {
    document.getElementById("PreviewPixel").value = 200;
  }

  // load tab preview delay setting (default to OFF)
  try {
    document.getElementById("DelayPreview").checked = prefs.getBoolPref("tabpopup.DelayPreview");
  }
  catch(ex) {
    document.getElementById("DelayPreview").checked = true;
  }

  // load tab preview delay time (default to .2 seconds)
  try {
    document.getElementById("PreviewDelay").value = prefs.getIntPref("tabpopup.PreviewDelay");
  }
  catch(ex) {
    document.getElementById("PreviewDelay").value = 200;
  }
  // load tab preview color
  try {
    document.getElementById("PreviewColor").value = prefs.getCharPref("tabpopup.PreviewColor");
  }
  catch(ex) {
    document.getElementById("PreviewColor").value = '#afd6ea';
  }
}

function savePrefs(e)
{
  if(!colorcode_validate(document.getElementById("PreviewColor").value)){
	alert("Color code is not valid.");
	return;
  }
  try {
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefService);
	prefs = prefs.getBranch("extensions.tabpopup.");
    prefs.setIntPref("tabpopup.SizePreview",document.getElementById("SizePreview").value);
    prefs.setIntPref("tabpopup.PreviewPercent",document.getElementById("PreviewPercent").value);
    prefs.setIntPref("tabpopup.PreviewPixel",document.getElementById("PreviewPixel").value);
    prefs.setBoolPref("tabpopup.DelayPreview",document.getElementById("DelayPreview").checked);
    prefs.setIntPref("tabpopup.PreviewDelay",document.getElementById("PreviewDelay").value);
	prefs.setCharPref("tabpopup.PreviewColor",document.getElementById("PreviewColor").value);
  }
  catch(ex) { dump(ex + "\n"); }
}

function colorcode_validate(colorcode)
{
     var regColorcode = /^#([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/;
     if(regColorcode.test(colorcode) == true)
		 return true;
	 return false;
}