# createElement
Real-DOM dependencies-free imitator of React.createElement() designed to simplify creating HTMLElements from JavaScript 
code, when you for some reason don't want to use templates or frameworks.

It's not designed to work with real-time "canvas-like" redrawing (render everything each X ms), this may significally 
worse responsibility of active UI elements (like inputs).

# How to use
Simply add `<script>` tag in your HTML.

## createElement(CSS selector, options, children)
Similar with `React.createElement` syntax, but all child elements should be in array. 
- ***returns*** — HTMLElement;
- **CSS selector** — `tag#id.className` or **component**, empty tag defaults to `div`;
- **options** — **[can be omited]** map-like object with general HTMLElement fields. Special cases:
  - *style* — can be both string (then it will be applied as CSS-string), or object (then each property will be applied 
    as JS-accesible field);
  - *dataset* — allows to set `data-attributes` on the element;
  - *className* — combined with retrieved from **CSS selector**, recommeded for dynamic classes;
  - *id* — takes priority over retrieved from **CSS selector**, recommeded for dynamic IDs;
  - \_cast — can be function, which will be called with HTMLElement argument when it will be created;
  - \_redraw - can be function, which will be called with rerender function argument, which accepts *Notations* or *HTMLElement*;
  - *onX* — events.
- **children** — **[can be omited]** array of HTMLElements or any primitive types to insert into created element;

***Note 1:*** keep in mind, that **you can't insert the same HTMLElement into multiple different places on the page**. 
Unlike current master, this version does **not** perform copying and will just remove element from the previous place. Use *Notation mode* or *Components*;

***Note 2:*** single child element can be inserted without array;

***Note 3:*** generally speaking any type is acceptable as child element, but **arrays are unacceptable**, since they 
will be confused with **Notation mode**. Theoretically you can still use common JS objects, which are not HTMLElements 
or arrays, but you should avoid doing this;

***Note 4:*** `null` or `undefined` in children array won't be rendered.

## fillElement(container, children)
Part of `createElement()`, inserts all `children` elements into `container` HTMLElement.

- ***returns*** — nothing;
- **container** — HTMLElement in which children elements should be inserted;
- **children** — see `createElement` definition. 

***Note:*** does not clear container, use `clearElement()` before if needed.

## clearElement(container)
Clears `container`.

- ***returns*** — nothing;
- **container** — HTMLElement to be cleared from children.

## wrapElement(element, container)
Inserts `container` in the place of `element` and puts `element` inside.

- ***returns*** — nothing;
- **container** — HTMLElement to be inserted instead of `element`;
- **element** — HTMLElement to be inserted inside of `container`.

# Notation mode
Initially designed to singifically reduce amount of code. You may omit function word and pass not HTMLElement as in 
`createElement(CSS selector, options, [childElement1, childElement2...])`, but plain notation array 
`[CSS selector, options, [childElement1, childElement2...]]`. You can mix normal mode with Notation mode, when you need 
to store specific elements in variables.

Consider two examples:

```javascript
createElement('div', [
  createElement('h4', name),
  createElement('table.table', [
    renderTableHead(),
    areaTop = createElement('tbody')
  ]),
  createElement('.toggle-box-container', [
    createElement('table.table', [
      renderTableHead(),
      areaHidden = createElement('tbody')
    ])
  ])
])
```

```javascript
createElement('div', [
  ['h4', name],
  ['table.table', [
    renderTableHead(),
    areaTop = createElement('tbody')
  ]],
  ['.toggle-box-container', [
    ['table.table', [
      renderTableHead(),
      areaHidden = createElement('tbody')
    ]]
  ]]
])
```

# Components
You can use functions accepting `options` and `children` parameters instead of CSS selectors. Can return either a
HTML element or *Notation*.
