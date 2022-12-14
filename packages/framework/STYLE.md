# Embeddable Framework Style Guide

This document contains guidelines for the Embeddable Framework's Javascript and React coding conventions.

**Table of Contents**

- [Core Formatting](#headFormatting)
- [Modules](#headModules)
  - [External Modules](#headModulesExternal)
  - [Internal Modules](#headModulesInternal)
- [React](#headReact)
  - [Components](#headReactComponents)
  - [Props](#headReactProps)
  - [Event Handlers](#headReactEvents)

## <a name="headFormatting"></a>Core Formatting

ESLint enforces the majority of the core Javascript and React styles, throwing lint errors on any line of code that breaks the rules defined in `.eslintrc`.

To lint all the source and test files, use the command `yarn lint`.

Adhere to the following core rules:

##### Use spaces for tabs

Always use spaces for tabs and indent **2** spaces.

##### No var

Always use `const` and `let` over `var`, preferably `const` unless mutability is required.

```js
let thisWillChange // Good
const thisWontChange = 10 // Good

var dontDoThis // Bad!
```

_Note: `var` means the variable is both mutable and function scoped, while `let` is block scope. This is why we prefer `let`._

##### Pad object literals with a space

Always pad object literals with a space at the beginning and end.

```js
const x = { someVar }
```

##### Always use object literal shorthand if possible

Always use the ES6 object literal shorthand if possible.

```js
const key = 'value'
const foo = { key }

// foo = { key: 'value' }
```

##### Multi-line object literals with **2 or more** properties

Always multi-line object literal initialisation if there are 2 or more properties.

```js
const obj = {
  key: 'val',
  foo: 'bar',
  bob: 'bear',
}
```

##### Single quotes only

Always use single quotes for strings.

```js
const good = 'foo'
const bad = 'foo'
```

##### Use string interpolation

Always favour ES6 string interpolation over old style `+` concatenation.

```js
const foo = 'bar'

const foobar = `foo ${foo}` // good
const foobad = 'foo ' + foo // bad
```

##### Always append semicolons

Always append semicolons to the end of statements (this isn't ruby...).

##### New line after variable declarations

Always leave a new line after declaring variables and beginning the next part of the logic.

```js
let something
const foo = 'bar'

if (someFn()) {
  // ..
}

// ..
```

##### Never leave empty blocks

Never leave an empty code block.

```js
if () {
  // nothing..
}
```

##### Never leave multiple empty lines

Never leave more than **1** new line.

```js
// This will throw a eslint error
const foo = 'hello'

someFn(foo)
```

##### No padding new lines within a function

Never leave padding new lines in a function.

```js
function foo() {
  const foo = 'bar'

  return foo
}
```

##### Prefer dot notation

Always prefer dot notation unless unavoidable.

```js
const foo = {
  'bar': 'bar',
  'foo-bar': 'foobar'
}

someFn(foo.bar);            // good
someFn(foo['bar']);         // bad
someFn(foo['foo-bar']);     // unavoidable

const getKey() => 'foo-bar';

soneFn(foo[getKey()])       // unavoidable
```

##### Triple equals

Always use triple equals `===` for comparisons.

```js
if (foo === bar) {
  // Good
}

if (foo == bar) {
  // Bad
}
```

##### Multi-line very long statements

Try to multi-line long statements that reduce readability.

```js
const toBeOrNotToBe = foo === bar || myName === 'anthony' || true !== false

const someThingos = someVar === thisThingyMagingy ? grabThoseThingos() : someString().split(',')
```

##### Prefer ES6 fat-arrow

Use ES6 fat-arrow notation for both anonymous functions and function expressions.

```js
// anonymous function
mediator.channel.subscribe('someEvent', (params) => {
  // ...
})

// function expression
const foo = () => {
  // ...
}
```

##### Prefer ES6 fat-arrow shorthand expression

Use the ES6 shorthand expression if the function simply returns some value.

```js
const isThisThingAvailable = () => isThingOnline && isThingVisible

// isThisThingAvailable() implicitly returns isThingOnline && isThingVisible
```

##### Prefer function expressions for local functions

Use function expressions for functions local to a scope that are not exported.

```js
const someLocalFileMethod = () => {
  // ...
};

function someExportedMethod() {
  const someLocalFunctionMethod = () => {
    // ...
  };
}

...

export {
  someExportedMethod,
  ...
};
```

## <a name="headModules"></a>Modules

<a name="headModulesExternal"></a>**External Modules**

Install dependencies via NPM.

```zsh
npm install package-name --save
```

Use ES6 `import` statements over require if possible.

```js
import React from 'react'
```

<a name="headModulesInternal"></a>**Internal Modules**

Export Classes, Functions, Variables and Objects individually in an export statement.

```js
class foo {
  ...
}

export { foo };
```

```js
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

When importing either from an internal or external module, try to import only what function(s) or module(s) are actually required.

```js
import { FooComponent } from 'src/component/FooComponent'
```

_Note: the lodash library is an exception to this rule as we typically use a range of different functions from it._

```js
// always import the whole library
import _ from 'lodash'
```

When importing modules, make sure that they are imported in alphabetical order by the path/names.

```js
import { Container } from 'src/component/Container';
import { HelpCenterArticle } from 'src/component/helpCenter/HelpCenterArticle';
import { i18n } from '@zendesk/web-widget-classic/services/i18n';
import { isMobileBrowser } from '@zendesk/widget-shared-services/util/devices';

...
```

## <a name="headReact"></a>React

<a name="headReactComponents"></a>**Components**

Define components using ES7 Classes that extend from `React.Component`.

```js
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class NewComponent extends Component {
  ...

  render = () => {
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

Component `propTypes` must be defined for each prop as a static object literal that is added to the class.

```js
class NewComponent extends Component { ... }

NewComponent.propTypes = {
  foo: PropTypes.string.isRequired,
  bar: PropTypes.bool
};
```

For all optional (non-required) props, a default value must be supplied to the `defaultProps` static object literal.

```js
NewComponent.defaultProps = {
  bar: false,
}
```

_Note: `propTypes` and `defaultProps` are not required in tests._

<a name="headReactEvents"></a>**Event Handlers**

Prepend event handler functions with _handle_ (e.g `handleOnClick`, `handleSubmit`, ...).
