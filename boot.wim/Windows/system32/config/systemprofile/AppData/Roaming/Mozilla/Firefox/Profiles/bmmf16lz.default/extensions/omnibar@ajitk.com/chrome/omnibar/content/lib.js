var Omnibar = {
     V: "0.5.4"
};

if(typeof Cc === "undefined") {
     var Cc = Components.classes;
}
if(typeof Ci === "undefined") {
     var Ci = Components.interfaces;
}
if(typeof Cr === "undefined") {
     var Cr = Components.results;
}
if(typeof Cu === "undefined") {
     var Cu = Components.utils;
}

// console for logging messages in browser's error console.
if(typeof console === 'undefined') {
    var console = {
        log: function(o) {
            Cc["@mozilla.org/consoleservice;1"]
                       .getService(Ci.nsIConsoleService).logStringMessage(o+'');
        }
        , error: function(o) {
            Cu.reportError(o+'');
        }
    };
}

Omnibar.DeferredJob = function() {
}
Omnibar.DeferredJob.prototype = {
     timeoutID: null,
     active: false,
     schedule: function(delay, fn, scope, args) {
          this.cancel();
          this.active = true;
          this.timeoutID = setTimeout(function() {
               fn.apply(scope||window, args);
          }, delay);
     },
     cancel: function() {
          this.active = false;
          var timeoutID = this.timeoutID;
          if(timeoutID) {
               clearTimeout(timeoutID);
               this.timeoutID = null;
          }
     }
}

Omnibar.ReJob = function() {
}
Omnibar.ReJob.prototype = {
     _threadID: null,
     active: false,
     start: function(interval, fn, scope, args) {
          var self = this;
          this.active = true;
          this.stop();
          this._threadID = setInterval(function() {
               if(fn.apply(scope||window, args) === false) {
                    self.stop();
               }
               
          }, interval);
     },
     stop: function() {
          this.active = false;
          var threadID = this._threadID;
          if(threadID) {
               clearInterval(threadID);
               this._threadID = null;
          }
     }
}