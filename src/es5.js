// noinspection JSUnfilteredForInLoop

var ___temp___ = (function() {
  function __isArray(a) {
    return Array.isArray(a);
  }

  function __isElement(obj) {
    try {
      return obj instanceof HTMLElement;
    } catch (e) {
      return typeof obj === "object" &&
        obj.nodeType === 1 && typeof obj.style === "object" &&
        typeof obj.ownerDocument === "object";
    }
  }

  function __createElement(tag, properties, children) {
    if (__isElement(tag)) {
      return tag;
    }

    var element, i;
    var applyAsJsField = ['innerHTML', 'checked', 'disabled', 'value', 'selected', 'className', 'crossOrigin', 'muted'];
    var applyNotAsAttribute = applyAsJsField.concat(['events', 'dataset', 'style', '_cast', '_redraw']);

    element = document.createElement(tag);
    for (i in properties) {
      if (properties[i] === null || properties[i] === undefined ||
        (typeof properties[i] === 'object' && applyNotAsAttribute.indexOf(i) === -1)
      ) {
        continue;
      }

      if (i.indexOf('on') === 0) {
        element.addEventListener(i.substring(2), properties[i]);
      } else if (applyNotAsAttribute.indexOf(i) === -1) {
        element.setAttribute(i, properties[i]);
      } else if (applyAsJsField.indexOf(i) !== -1) {
        element[i] = properties[i];
      }
    }

    if (typeof properties.dataset === 'object') {
      for (i in properties.dataset) {
        element.dataset[i] = properties.dataset[i];
      }
    }
    if (typeof properties.style === 'object') {
      for (i in properties.style) {
        element.style[i] = properties.style[i];
      }
    } else if (typeof properties.style === 'string') {
      element.style = properties.style;
    }

    if (children && children.length) {
      __fillElement(element, children);
    }

    if (typeof properties._cast === 'function') {
      properties._cast(element);
    }

    if (typeof properties._redraw === 'function') {
      var renderFunction = function(rawNotation) {
        if (!element.parentNode) {
          throw new Error('Cannot redraw element without parent node!');
        }

        var parent = element.parentNode;
        var update;
        if (__isArray(rawNotation)) {
          update = createElement(rawNotation[0], rawNotation[1], rawNotation[2]);
        } else if (typeof rawNotation === 'function') {
          throw new Error('_redraw callback does not accept functions as argument');
        } else if (typeof rawNotation === 'string' || typeof rawNotation === 'number') {
          update = document.createTextNode(rawNotation);
        } else {
          update = rawNotation;
        }
        parent.replaceChild(update, element);
        element = update;
      }

      properties._redraw(renderFunction);
    }

    return element;
  }

  function __fillElement(element, items) {
    var textCollection = null;
    var isPreviousElementTextNode = false;

    function makeTextNode() {
      if (!textCollection) return;
      element.appendChild(document.createTextNode(textCollection));
      textCollection = null;
      isPreviousElementTextNode = false;
    }

    for (var i = 0; i < items.length; i++) {
      var c = items[i];
      if (c === undefined || c === null) {
        continue;
      }
      if (__isArray(c)) {
        if (isPreviousElementTextNode) {
          makeTextNode();
        }
        var parsed = __repackAndValidate(c[0], c[1], c[2]);
        if (__isElement(parsed)) {
          element.appendChild(parsed);
        } else {
          element.appendChild(__createElement(parsed[0], parsed[1], parsed[2]));
        }
      } else if (typeof c === 'function') {
        throw new Error('Function cannot be used as a child');
      } else if (__isElement(c)) {
        if (isPreviousElementTextNode) {
          makeTextNode();
        }
        element.appendChild(c);
      } else {
        if (textCollection === null) {
          textCollection = String(c);
        } else {
          textCollection += String(c);
        }
        isPreviousElementTextNode = true;
      }
    }
    makeTextNode();
  }

  function __repackAndValidate(tag, properties, children, noCast) {
    if (__isElement(tag)) {
      return [tag];
    }
    if (typeof tag !== 'string' && typeof tag !== 'function') {
      throw new Error('Unacceptable CSS selector ' + tag);
    }
    if (__isElement(children) && !__isArray(children)) {
      children = [children];
    }

    if (typeof properties === 'undefined') {
      properties = {};
    } else if (
      __isElement(properties) ||
      ['string', 'number', 'boolean'].indexOf(typeof properties) > -1
    ) {
      if (__isArray(children)) {
        children.unshift(properties);
      } else {
        children = [properties];
      }
      properties = {};
    } else if (__isArray(properties)) {
      if (__isArray(children)) {
        children.concat(properties);
      } else {
        children = properties;
      }
      properties = {};
    }

    if (!noCast) {
      if (typeof tag === 'string') {
        var classes = (tag || '').split('.');
        tag = classes.shift();
        if (classes.length > 0) {
          properties.className = (properties.className ? properties.className + ' ' : '') + classes.join(' ');
        }
        var id = tag.split('#');
        tag = id.shift() || 'div';
        id = id.shift();

        if (id && !properties.id) {
          properties.id = id;
        }
      } else {
        var parsedChildren = __validateChildren(children);
        var data = tag(properties, parsedChildren);
        if (__isElement(data)) return data;
        return __repackAndValidate(data[0], data[1], data[2]);
      }
    }

    return [tag, properties, children];
  }

  function __validateChildren(children) {
    if (!children) return;
    if (!Array.isArray(children)) return children;

    return children.map(function(child) {
      if (!Array.isArray(child)) return child;

      var output = __repackAndValidate(child[0], child[1], child[2], true);
      if (output[2]) {
        output[2] = __validateChildren(output[2]);
      }

      return output;
    });
  }

  function createElement(tag, properties, children) {
    var items = __repackAndValidate(tag, properties, children);

    return __createElement(items[0], items[1], items[2]);
  }

  function fillElement(element, items) {
    if (!__isElement(element)) {
      throw new Error('Unacceptable element ' + element);
    }
    if (__isElement(items)) {
      items = [items];
    }
    if (!__isArray(items)) {
      throw new Error('Unacceptable children ' + items);
    }

    __fillElement(element, items);
  }

  function wrapElement(element, target) {
    var parent = target.parentNode;
    parent.insertBefore(element, target);
    element.appendChild(target);
  }

  function clearElement(element) {
    while (element.hasChildNodes()) {
      element.removeChild(element.lastChild);
    }
  }

  return [createElement, fillElement, wrapElement, clearElement];
})();

var createElement = ___temp___[0];
var fillElement = ___temp___[1];
var wrapElement = ___temp___[2];
var clearElement = ___temp___[3];
