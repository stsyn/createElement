var __temp__ = (function() {
  function __notNull(value) {
    return value !== undefined && value !== null;
  }

  function __mergeObjects() {
    var resObj = arguments[0];
    for (var i = 1; i < arguments.length; i += 1) {
      var obj = arguments[i];
      var keys = Object.keys(obj);
      for (var j = 0; j < keys.length; j += 1) {
        resObj[keys[j]] = obj[keys[j]];
      }
    }
    return resObj;
  }

  function __childIterator(data, onFormChange) {
    return function(child) {
      var oldOnChange = child[1] && child[1].onchange;
      var propName = child[1] && child[1].name;

      if (__notNull(propName)) {
        if (!__notNull(data[propName])) data[propName] = __notNull(child[1].value) ? child[1].value : '';

        child[1].value = data[propName];

        child[1].onchange = function(event) {
          var canProceed = !oldOnChange || oldOnChange(event);

          if (canProceed) {
            data[propName] = __notNull(event.target.checked) ? event.target.checked : event.target.value;
            onFormChange && onFormChange();
          }
        };
      }

      var elementChildren = Array.isArray(child[1]) ? child[1] : Array.isArray(child[2]) ? child[2] : null;

      if (elementChildren) {
        __iterateChildren(elementChildren, __notNull(propName) ? data[propName] : data, onFormChange);
      }

      return child;
    }
  }

  function __iterateChildren(children, data, onFormChange) {
    var iterator = __childIterator(data, onFormChange);

    return children.map(iterator);
  }

  /**
   * Smarter form handler. Recursively looks for "name" props in children.
   *
   * @param props
   *    - onchange: (data) => void - called each time form changed
   *    - data: {} - "live" object with user content
   * @param children
   */
  function formElement(props, children) {
    var dupe = __mergeObjects({}, props);
    delete dupe.data;
    delete dupe.onchange;
    return ['form', dupe, __iterateChildren(children, props.data, props.onchange)];
  }

  return [formElement];
})();

var formElement = __temp__[0];
