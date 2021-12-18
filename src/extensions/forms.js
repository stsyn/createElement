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
    return function(_child) {
      if (!_child || !Array.isArray(_child)) return _child;
      var child = [_child[0], __mergeObjects({}, _child[1]), Array.isArray(_child[2]) ? [].concat(_child[2]) : _child[2]];
      var propName = child[1] && child[1].name;

      if (__notNull(propName)) {
        var oldOnChange = child[1] && child[1].onchange;
        var oldRerender = child[1] && child[1]._redraw;
        var oldCast = child[1] && child[1]._cast;

        if (!__notNull(data[propName])) data[propName] = __notNull(child[1].value) ? child[1].value : '';

        var renderFunc, element, elementValue = data[propName];

        child[1].value = elementValue;

        child[1]._redraw = function(rerenderFunc) {
          renderFunc = rerenderFunc;
          oldRerender && oldRerender(rerenderFunc);
        }

        child[1]._cast = function(elem) {
          element = elem;
        }

        child[1].onchange = function(event) {
          var value = (element.tagName === 'INPUT' && element.type === 'checkbox') ? element.checked : element.value;
          var canProceed = !oldOnChange || oldOnChange(event) !== false;

          if (canProceed) {
            elementValue = value;
            onFormChange && onFormChange(data);
          }
        };

        Object.defineProperty(data, propName, {
          get: function() {
            return elementValue;
          },
          set: function(newValue) {
            if (element) {
              (element.tagName === 'INPUT' && element.type === 'checkbox') ? (element.checked = newValue) : (element.value = newValue);
            }
            child[1].value = newValue;
            elementValue = newValue;
            renderFunc(child);
          }
        });
      }

      if (child[0] === formElement) return child;

      var elementChildren = Array.isArray(child[2]) ? child[2] : null;

      if (elementChildren) {
        child[2] = __iterateChildren(elementChildren, __notNull(propName) ? data[propName] : data, onFormChange);
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
