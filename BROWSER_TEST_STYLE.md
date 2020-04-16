# Browser Tests HOWTOs and Best Practices

This document contains guidelines for writing browser tests in Embeddable Framework.

All the browser tests are located in the e2e folder. Jest is the test runner,
and Puppeteer is used for browser automation.

**Table of Contents**

- [Browser Tests HOWTOs and Best Practices](#browser-tests-howtos-and-best-practices)
  - [Best Practices](#best-practices)
    - [Use visual selectors when possible](#use-visual-selectors-when-possible)
    - [Do not include assertions in setup code](#do-not-include-assertions-in-setup-code)
    - [Keep tests focused](#keep-tests-focused)
    - [Wait only when needed](#wait-only-when-needed)
    - [Watch out for shared state](#watch-out-for-shared-state)
    - [Use waitFor\* helpers](#use-waitfor-helpers)
    - [Test APIs in prerender as well](#test-apis-in-prerender-as-well)
    - [Explicit setup function instead of beforeEach](#explicit-setup-function-instead-of-beforeeach)
  - [HOWTOs](#howtos)
    - [Running the tests](#running-the-tests)
    - [Debugging tests](#debugging-tests)
    - [Loading the widget](#loading-the-widget)

## Best Practices

#### Use visual selectors when possible

Prefer to use selectors that refer to visual cues, rather than things that only a computer/developer can interpret. Ideally we should be able to read e2e tests and understand what the behaviour would look like if it was us using the widget in a browser. In order of preference try and use:

- Common helper functions in /e2e/helpers
- Visual helper functions provided by testing libraries (getByLabelText to query for labels, getByPlaceholderText to query for placeholders, etc)
- For elements with no functional selectors, use test ids

#### Do not include assertions in setup code

`beforeEach` and setup code should not contain assertions.

#### Keep tests focused

Try to keep tests concise and try not to include too many test assertions throughout your whole test. Use the `waitFor*` helpers, `click*` helpers and enter text helpers etc to walk through your setup and then test your main assertion at the end of your test. Your main assertion should match your test description.

#### Wait only when needed

The test framework includes built-in helpers that can automatically wait for elements
to appear or disappear from a page. Use `wait` only when necessary, such as if there's
a network request involved or if there's a particularly long animation or an
artificial delay.

#### Watch out for shared state

Be wary of global states like localStorage and cookies, especially if they can affect other tests. A common case is chat, as starting a chat in one test can cause the widget to load the chatting screen in another test

If a newly added test passes, but other tests in the suite suddenly start failing, consider
whether share state could be the cause.

#### Use waitFor\* helpers

To avoid flakiness, use the `waitFor*` helpers to make sure the widget is ready before performing an action. For example, if you want to do a help center search, make sure you’re in the help center embed by checking the title or the existence of the search field, before making a search.

#### Test APIs in prerender as well

When testing APIs, test that they work in prerender as well, especially if the API being tested would most likely be used in prerender. Use the provided `evaluateBeforeSnippetLoads` and
`evaluateAfterSnippetLoads` helpers to inject prerender scripts.

#### Explicit setup function instead of beforeEach

Similar to [integration and unit tests](TEST_STYLE.md#explicit-setup-function-instead-of-beforeeach), use explicit setup functions instead of `beforeEach`.

## HOWTOs

#### Running the tests

Run `npm run e2e <test file>` to run a specific file. If you want to see the browser while
the test runs, set `HEADLESS=false`, e.g. `HEADLESS=false npm run e2e <test file>`.

#### Debugging tests

To debug tests, run the test in headless mode, and add in `await jestPuppeteer.debug()`
in the test code to pause the test.

#### Loading the widget

We can convert the following snippet:

```html
<script type="text/javascript">
  window.zESettings = {
    webWidget: {
      offset: { horizontal: '100px', vertical: '150px' }
    }
  }
</script>
<script id="ze-snippet" src="..widget_url"></script>
<script type="text/javascript">
  zE('webWidget', 'open')
</script>
```

to the equivalent for testing in puppeteer:

```js
import loadWidget from 'e2e/helpers/widget-page'

await loadWidget()
  .evaluateBeforeSnippetLoads(() => {
    window.zESettings = {
      webWidget: {
        offset: { horizontal: '100px', vertical: '150px' }
      }
    }
  })
  .evaluateAfterSnippetLoads(() => {
    zE('webWidget', 'open')
  })
  .load()
```
