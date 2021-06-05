(function(): any {
  if (typeof window.CustomEvent === 'function') return false; //If not IE

  function CustomEvent(event: string, params: any) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail
    );
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = <any>CustomEvent;
  window.Event = <any>CustomEvent;
})();

if (!Array.prototype.includes) {
  Array.prototype.includes = function(str) {
    var returnValue = false;

    if (this.indexOf(str) !== -1) {
      returnValue = true;
    }

    return returnValue;
  };
}

if (!String.prototype.includes) {
  String.prototype.includes = function(str) {
    var returnValue = false;

    if (this.indexOf(str) !== -1) {
      returnValue = true;
    }

    return returnValue;
  };
}

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate: any) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      if (i in list) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return value;
        }
      }
    }
    return undefined;
  };
}
