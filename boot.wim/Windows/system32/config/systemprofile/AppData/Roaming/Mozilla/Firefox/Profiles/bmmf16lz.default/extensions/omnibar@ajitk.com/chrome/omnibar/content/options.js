var Options = {
  commitChanges: true,
  init: function() {
    
  },
  done: function() {
    
  },
  updateDependents: function(conditionId) {
    var pref = document.getElementById(conditionId).getAttribute('preference');
    var disable = !document.getElementById(pref).value;
    var els = document.getElementsByAttribute("dependson", conditionId);
    for(var i = 0; i < els.length; i += 1) {
      els[i].disabled = disable;
    }
  }
}
