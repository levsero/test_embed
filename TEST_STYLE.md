# Test Best Practices and Style Guide

This document contains guidelines for writing tests in Embeddable Framework.

Note: Embeddable Framework is currently migrating from Jasmine tests to using Jest,
and all new tests should be written using the new framework.

**Table of Contents**

- [Test Best Practices and Style Guide](#test-best-practices-and-style-guide)
  - [Best Practices](#best-practices)
    - [Test behavior, not implementation](#test-behavior-not-implementation)
    - [Explicit setup function instead of beforeEach](#explicit-setup-function-instead-of-beforeeach)
    - [Use snapshots wisely](#use-snapshots-wisely)
    - [Reset state between tests](#reset-state-between-tests)
    - [Export unconnected components too](#export-unconnected-components-too)
    - [Include an integration test](#include-an-integration-test)
  - [HOWTOs](#howtos)
    - [Find a DOM node](#find-a-dom-node)
    - [Fire events](#fire-events)
    - [Create a connected component](#create-a-connected-component)
    - [Test selectors that use reselect](#test-selectors-that-use-reselect)
    - [Test thunk actions](#test-thunk-actions)
    - [Mock imports](#mock-imports)
  - [Conventions](#conventions)
    - [Test file location](#test-file-location)
    - [Writing test descriptions](#writing-test-descriptions)
    - [Exporting unconnected components](#exporting-unconnected-components)

## Best Practices

#### Test behavior, not implementation

Tests should be written to exercise the behavior of the subject being tested, and
should not concern itself with the subject's internals. For example, React
components should be tested according to how it will be used, and tests should
not assert anything about the components' props or state.

To illustrate, suppose we want to test a component (called
`MyComponent`) that contains a button that will add a new item to a list.

```js
const renderer = new ShallowRenderer()
renderer.render(<MyComponent {...props} />)
const instance = renderer.getMountedInstance(renderer)
instance.props.handleSubmit('Brand New Car')
expect(instance.state.items[0]).toEqual('Brand New Car')
```

The above test is heavily tied to the implementation of the component. If the
internal state were to change, the tests will break.
A better test would be testing the component's behavior:

```js
const { getByText } = render(<MyComponent {...props} />)
fireEvent.click(getByText('Add New Item'))
expect(getByText('Brand New Car')).toBeInTheDocument()
```

#### Explicit setup function instead of beforeEach

`beforeEach` should be limited to setting up the environment, such as spies and
the DOM:

```js
beforeEach(() => {
  jest.spyOn(selectors, 'getSomething').mockReturnValue(something)
  addMetaTags(document)
})
```

Too often there is the temptation to setup the subject in `beforeEach` as well:

```js
let result
beforeEach(() => {
  result = doSomething()
})
it('tests result equals something', () => {
  expect(result).toEqual(something)
})
```

In the above example, the test becomes more complicated when we need to pass
different arguments to the function being tested:

```js
let result, argument
beforeEach(() => {
  result = doSomething(argument)
})
describe('when argument is 1', () => {
  beforeAll(() => {
    argument = 1
  })
  it('tests result equals something', () => {
    expect(result).toEqual(something)
  })
})
describe('when argument is 2', () => {
  beforeAll(() => {
    argument = 2
  })
  it('tests result equals something else', () => {
    expect(result).toEqual(somethingElse)
  })
})
```

Instead, use functions to setup the subject. This allows us to pass in
different arguments for the setup, and removes the need for the `beforeEach`.

```js
const setup = arg => doSomething(arg)
it('returns something when argument is 1', () => {
  expect(setup(1)).toEqual(something)
})
it('returns somethingElse when argument is 2', () => {
  expect(setup(2)).toEqual(somethingElse)
})
```

Using a function also allows us to return a bootstrapped object, including
other helper objects:

```js
const setup = () => {
  const utils = render(<EmailField />)
  waitForAnimationToFinish()
  const input = utils.getByLabelText('Email')
  return {
    input,
    ...utils
  }
}
```

#### Use snapshots wisely

Embeddable framework makes use of [snapshot testing](https://jestjs.io/docs/en/snapshot-testing),
but is generally limited to:

- component tests where you want to assert the structure of DOM elements and attributes.
- large JSON objects where you want to .
  These are some guidelines to follow when using snapshots:
- The initial generated snapshot should be visually inspected, in order
  to make sure that no incorrect test cases are committed into the repository.
- Make sure that snapshots are not too large, and are limited to what is being tested. Use [snapshot-diff](https://github.com/jest-community/snapshot-diff) when applicable.
- Make sure that the test description is descriptive since the actual assertion
  does not convey the intent of the test.

#### Reset state between tests

When possible, avoid having mutable variables whose scope can be accessed in multiple
tests (see [setup functions](#explicit-setup-function-instead-of-beforeeach) on how to avoid
sharing state). Immutable state can be exposed in a shared scope though:

```js
// Bad
let x = 1
let y = false
let z = { foo: 'bar' }

// Good
const a = 1
const b = true
const c = Object.freeze({ foo: 'bar' })
const d = jest.fn()
```

Mocks created using `jest.fn` are reset after every test and can be
placed in a shared scope. Spies created using `jest.spyOn` don't need to be reset
because the jest environment has [restoreMocks](https://jestjs.io/docs/en/configuration.html#restoremocks-boolean)
set to `true`.

```js
test('tests something', () => {
  jest.spyOn(obj, 'num').mockReturnValue(123)
  expect(calculator.add(1, obj.num)).toEqual(124)
})
```

#### Export unconnected components too

To facilitate unit testing of connected components, export the unconnected version
too. This makes it easier to pass in props that are normally passed in by redux,
and allows rendering of the component without the store. That said, make sure
to [include an integration test](#include-an-integration-test) when possible.

#### Include an integration test

For complex components with child components and relies heavily on the redux
store, it is often more effective, and easier, to write an integration test.
Integration tests get better coverage as they don't require as much
mocking to setup as unit tests. In addition, interaction between components
can only be tested in integration tests. When deciding to between unit
test or integration tests, favor integration tests.

## HOWTOs

Embeddable Framework uses [Jest](https://jestjs.io/) as the test framework and
[react-testing-library](https://github.com/testing-library/react-testing-library),
and listed below are some common how-tos when writing tests.

#### Find a DOM node

`react-testing-library` automatically includes `dom-testing-library` as a dependency,
and that is used to query for DOM nodes. The full list of finders are available
[here](https://testing-library.com/docs/api-queries). If the selectors are not
insufficient, consider adding a
[`data-testid`](https://testing-library.com/docs/api-queries#getbytestid).

#### Fire events

`react-testing-library` automatically includes `dom-testing-library` as a dependency,
and that is used to fire events. The full list of available events can be
found [here](https://github.com/kentcdodds/dom-testing-library/blob/master/src/events.js).

#### Create a connected component

```js
import createStore from 'src/redux/createStore'

const store = createStore()
const utils = render(
  <Provider store={store}>
    <MyComponent />
  </Provider>
)
```

`src/redux/createStore` imports the actual store used by the widget, including all middlewares.

#### Test selectors that use reselect

Use `resultFunc` to pass in the arguments to the selector:

```js
const myComposedSelector = createSelector(
  [firstSelector, secondSelector, thirdSelector],
  (firstResult, secondResult, thirdResult) => {
    return firstResult + secondResult + thirdResult
  }
)
test('myComposedSelector unit test', () => {
  // here instead of calling selector()
  // we just call selector.resultFunc()
  expect(myComposedSelector.resultFunc(1, 2, 3)).toEqual(6)
})
```

#### Test thunk actions

```js
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

const mockStore = configureMockStore([thunk])
const store = mockStore(state)

store.dispatch(actionToTest())

expect(store.getActions()).toEqual(expected)
```

#### Mock imports

If you don't use `jest.mock` to mock out the module, use `jest.spyOn` to mock imports.
This is because `jest.spyOn` will restore the original implementation after the test.

```js
jest.spyOn(selectors, 'getSomething').mockReturnValue(expectedReturnValue)
```

## Conventions

#### Test file location

Tests should reside on the same folder as the file it's testing, but nested in a `__tests__` folder.

#### Writing test descriptions

Be clear about what method you are describing. Do not use words like "should" when describing your tests.
Use the third person in the present tense.

```js
// Bad
it('should render a button', () => {})

// Good
it('renders a button', () => {})
```

#### Exporting unconnected components

When [exporting both connected and unconnected components](#export-unconnected-components-too),
the convention is the connected component is the default export, and the unconnected
component should be named `Component`. In the test, alias the unconnected component with the name
of the component.

```js
// the export of the component
export { connectedComponent as default, MagicalButton as Component }

// in the test
import { Component as MagicalButton } from '../magical_button'
```
