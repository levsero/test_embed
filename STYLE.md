# Embeddable Framework Style Guide

This document contains guidelines for the Embeddable Framework's Javascript and React coding conventions.

**Table of Contents**

* [Core Formatting](#headFormatting)
* [Modules](#headModules)
  * [External Modules](#headModulesExternal)
  * [Internal Modules](#headModulesInternal)
* [React](#headReact)
  * [Components](#headReactComponents)
  * [Props](#headReactProps)
  * [Event Handlers](#headReactEvents)
* [Special Cases](#headSpecial)
  * [Ternary Expressions](#headSpecialTernary)
  * [Object Literals](#headSpecialObject)
  * [Functions](#headSpecialFunction)

## <a name="headFormatting"></a>Core Formatting

ESLint enforces the majority of the core Javascript and React styles, throwing errors on any line of code that breaks the rules defined in `.eslintrc`.

To lint all the source and test files, use the command `npm run lint`.

Adhere to the following core rules:

* Use **2 spaces** for indentation.
* Prefer `const` & `let` over `var`.
* Only use single quotes (e.g `'string'`).
* Always end statements with a semicolon.
* No empty code blocks.
* No more than **1** empty line.
* No padding new lines in a function:
  ```javascript
  function foo() {
    // bad
    const foo = 'bar';

    return foo;
    // bad
  }
  ```
* Max line length of **120** (ignores comments and urls).
* Always prefer **dot notation** unless unavoidable (e.g `foo['bar']` => `foo.bar`)
* Use **triple equals** to test equivalence (e.g `foo === bar`)

## <a name="headModules"></a>Modules

<a name="headModulesExternal"></a>**External Modules**

Install dependencies via NPM

```zsh
npm install package-name --save
```

Use ES6 `import` statements over require if possible:

```javascript
import React from 'react';
```

<a name="headModulesInternal"></a>**Internal Modules**

Export Classes, Functions, Variables and Objects individually in an export statement:

```javascript
class foo {
  ...
}

export { foo };
```

```javascript
function foo() {
  ...
}

function bar() {
  ...
}

export {
  foo,
  bar
};
```

When importing either from an internal or external module, try to import only what function(s) or module(s) are actually required:

```javascript
import { noop, forEach, ... } from 'lodash';
import { FooComponent } from 'component/FooComponent';
```

## <a name="headReact"></a>React

<a name="headReactComponents"></a>**Components**

Define components using ES6 Classes that extend from `React.Component`:

```javascript
import React, { Component, PropTypes } from 'react';

class NewComponent extends Component {
  ...

  render() {
    ...

    return (
      <div
        PropName={...} />
    );
  }
}

export {
  NewComponent
};
```

<a name="headReactProps"></a>**Props**

Component `propTypes` must be defined for each prop as a static object literal that is added to the class:

```javascript
class NewComponent extends Component { ... }

NewComponent.propTypes = {
  foo: PropTypes.string.isRequired,
  bar: PropTypes.bool
};
```

For all optional (non-required) props, a default value must be supplied to the `defaultProps` static object literal:

```javascript
NewComponent.defaultProps = {
  bar: false
};
```

*Note: `propTypes` and `defaultProps` are not required in tests.*


<a name="headReactEvents"></a>**Event Handlers**

Prepend event handler functions with *handle* (e.g `handleOnClick`, `handleSubmit`, ...).

Due to the upgrade to ES6 class syntax, event handlers passed to React components require context binding. If a component has *more than 1* event handler, use the `bindMethods` function in *util/utils.js*:

```javascript
class NewComponent extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, NewComponent.prototype);

    ...
  }

  ...
}
```

## <a name="headSpecial"></a>Special Cases

<a name="headSpecialTernary"></a>**Ternary Expressions**

**TODO**: This needs discussion

```javascript
const expr = (x === y)
           ? x
           : y;
```

<a name="headSpecialObject"></a>**Object Literals**

There must be a space between object literal's braces and properties:

```javascript
const foo = { bar: 'foo' };
```

If multiple properties, place each one on a new line:

```javascript
const foo = {
  bar: 'foo'
  x: 1,
  y: 2
};

```

However in React props there is no space:

```javascript
render() {
  const foo = 'bar';

  return (
    <div
      PropName={foo} />
  );
}
```

<a name="headSpecialFunction"></a>**Functions**

In non instance method functions always prefer ES6 fat arrow notation:

```javascript
const foo = () => {
  ...
};
```

*Note: Fat arrow functions lexically bind the `this` context.*
