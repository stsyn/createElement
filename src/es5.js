function __isElement(obj) {
  try {
    return obj instanceof HTMLElement;
  }
  catch (e) {
    return typeof obj === "object" &&
      obj.nodeType === 1 && typeof obj.style === "object" &&
      typeof obj.ownerDocument ==="object";
  }
}

function __createElement(tag, properties, children, notationCreator) {
  var element = document.createElement(tag), i;
  var applyAsJsField = ['innerHTML', 'checked', 'disabled', 'value', 'selected', 'className', 'crossOrigin'];
  var applyNotAsAttribute = applyAsJsField.concat(['events', 'dataset', 'style']);

  for (i in properties) {
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
    __fillElement(element, children, notationCreator);
  }
  return element;
}

function __fillElement(element, items, notationCreator) {
  var textCollection = null;
  var isPreviousElementWasTextNode = false;

  function makeTextNode() {
    if (!textCollection) return;
    element.appendChild(document.createTextNode(textCollection));
    textCollection = null;
    isPreviousElementWasTextNode = false;
  }

  for (var i = 0; i < items.length; i++) {
    var c = items[i];
    if (c === undefined || c === null) continue;
    else if (Array.isArray(c)) {
      if (isPreviousElementWasTextNode) {
        makeTextNode();
      }
      element.appendChild(notationCreator(c));
    } else if (!__isElement(c)) {
      if (textCollection === null) {
        textCollection = String(c);
      } else {
        textCollection += String(c);
      }
      isPreviousElementWasTextNode = true;
    } else {
      if (isPreviousElementWasTextNode) {
        makeTextNode();
      }
      element.appendChild(c.parentNode == null ? c : c.cloneNode(true));
    }
  }
  makeTextNode();
}

function __notatorParser(children) {
  var tag = children.shift();
  var values = children.shift();
  return __repackAndValidate(tag, values, children);
}

function __repackAndValidate(tag, properties, children) {
  if (typeof tag !== 'string') {
    console.trace();
    throw 'Unacceptable CSS selector ' + tag;
  }
  if (__isElement(children) && !Array.isArray(children)){
    children = [children];
  }

  if (typeof properties === 'undefined') {
    properties = {};
  } else if ((__isElement(properties) || typeof properties === 'string' || typeof properties === 'number' || typeof properties === 'boolean')) {
    if (Array.isArray(children)) {
      children.unshift(properties);
    } else {
      children = [properties];
    }
    properties = {};
  } else if (Array.isArray(properties)) {
    if (Array.isArray(children)) {
      children.unshift(properties);
    } else {
      children = properties;
    }
    properties = {};
  }

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
  return [tag, properties, children];
}

function createElement(tag, properties, children) {
  var items = __repackAndValidate(tag, properties, children);

  return __createElement(items[0], items[1], items[2], function (notation) {
    return createElement(notation[0], notation[1], notation[2]);
  });
}

function createFromNotation(tag, properties, children) {
  var parsed = __notatorParser(Array.prototype.slice.call(arguments));

  return __createElement(parsed[0], parsed[1], parsed[2], function notatorParser(notation) {
    var parsed = __notatorParser(notation);
    return __createElement(parsed[0], parsed[1], parsed[2], notatorParser);
  });
}

function fillElement(element, items) {
  if (!__isElement(element)) {
    console.trace();
    throw 'Unacceptable element ' + String(element);
  }
  if (__isElement(items)) {
    items = [items];
  }
  if (!Array.isArray(items)) {
    console.trace();
    throw 'Unacceptable children ' + String(items);
  }

  __fillElement(element, items, function (notation) {
    return createElement(notation[0], notation[1], notation[2]);
  });
}

function fillFromNotation(element, items) {
  if (!__isElement(element)) {
    console.trace();
    throw 'Unacceptable element ' + String(element);
  }
  if (__isElement(items)) {
    items = [items];
  }
  if (!Array.isArray(items)) {
    console.trace();
    throw 'Unacceptable children ' + String(items);
  }

  __fillElement(element, items, function notatorParser(notation) {
    var parsed = __notatorParser(notation);
    return __createElement(parsed[0], parsed[1], parsed[2], notatorParser);
  });
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
