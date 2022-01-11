# Intro

This doc lists our guidelines and conventions for the code in this codebase. We are restructuring the codebase and in order to add new files to the new folders they must follow the standard outlined in this document. The goal is to eventually have everything in the new structure.

# File structure

Part of this change is switching to a new file structure. This shows what the old one is and what the new one will be. Components in the new structure should match the guidelines specified below.

### Old file structure

```
|-- asset
|-- component
    |-- ${EmbedName}
|-- constants
    |-- ${embedName}
|-- embed
|-- fixtures
|-- polyfills
|-- redux
    |-- {$embedName}
        |-- actions.js
        |-- reducers
        |-- selectors.js
|-- service
|-- styles
|-- translation
|-- types
|-- util
```

### New file structure

```
|-- assets
|-- components
|-- embeds
    |-- {$embedName}
        |-- actions
        |-- assets
        |-- components
        |-- constants
        |-- pages
            |-- {$PageComponents}
            |-- routes.js
        |-- reducers
            |-- settings
            |-- config
        |-- selectors
        |-- utils
        |-- index.js
|-- webWidget
  |-- services
  |-- actions
  |-- reducers
    |-- settings
    |-- config
  |-- selectors
  |-- routes.js
  |-- index.js
|-- utils
```

## Folders

You can see that the key difference between the old structure and the new one is that our Embed specific code has been moved into each Embed. This will allow us to more easily dynamically load components.

#### assets

This folder will contain any assets that are used across the entire widget. Any assets only used by one embed should be inside the specific folder

#### components

This folder will contain any components that should be shared across all embeds. This would include any garden components that are used in multiple places.

#### embeds

Each embed will have its own folder and must never reach across its own boundries to to get information from other embeds. More detail on the subfolders is listed below.

##### actions

Contains any redux actions used by the embed.

##### assets

Contains any assets used only by the embed. These include images and icons.

##### components

Contains any React Components that are only used by the Embed. If the component is a common across multiple components it should go in the top level components folder.

##### constants

Contains any constants used by the embed.

##### pages

Contains the Page components and the routing logic for the embed

##### reducers

Contains any redux reducers used by the embed. Any embed specific state inside the settings and base reducers should be moved to the embed reducers.

##### selectors

Contains any redux selectors used multiple times by the embed. Any selectors that are only used by one component should be stored with that component. Basic selectors should be kept in a seperate file to reselectors.

##### utils

Contains any utils only used by the embed. If the util is used across multiple embeds it should go in the top level utils folder.

#### webWidget\*

Contains the overall logic for the Web Widget, such as top level routing.

#### utils

Contains any shared utils

- Note: These folders might be shifted and renamed once we have done some work on splitting out our Embeds and have a better idea of the ideal structure of the codebase.

# Guidelines

## General

### Don’t use relative paths to parent components

- No relative paths can be used to access a parent, no `../` allowed
- You can use relative paths to access files in the same folder. `./`
- They can also be used to access children if it makes sense for that file.
- Don't be afraid to set up a webpack alias to a folder.
- An exemption to this a jest test file. It can reach one level up to get the file it is testng.
- An exemption to this rule is in our style files as you can't use webpack aliases \*pending investigate story

### Files and folders should follow a consistent naming convention

- All file and folder names must be camelcase.
- React components must be capitalized.
- Non react components must not be capitalized.

## React Components

### Components should be kept in a folder per component

- Components must have a folder as the component name with an index file inside that exports the component.
- Any styles, selectors, helpers, utils and tests that only relate to that component will be kept in that folder.
- You should be able to copy/paste a component folder and use it within another project in exactly the same way.

Example directory:

```
ComponentName
|-- index.js
|-- styles.js
|-- selectors.js
|-- __tests__
    |-- index.test.js
    |-- selectors.test.js
```

### Use PureComponents or stateless functional components wherever possible.

- Prefer Pure components unless the component is very small
- Functional components can be wrapped in the HOC `pure`
- https://medium.com/groww-engineering/stateless-component-vs-pure-component-d2af88a1200b

### Break down components as much as needed

- Components that only render one thing and are only a few lines long are fine
- If concerned about lines of code a component can always be functional

### Use Garden components where possible

- Prefer using Garden components to building them ourself. If it is possible to replace one of ours with a garden one try to do so.
- We can always wrap garden components in our own component to override styles if needed. Garden should still be the base component.
- Mandy has prepared a [design menu](https://app.goabstract.com/invitations/bcbe7a4adc99e746b51bf6a79d0b3457fa4d6c10ec61cf9891b077e2354f5dcc) for our components. Try to match these designs.

### Avoid using PropTypes.object

- Prefer to use PropTypes.shape and define the properties passed in the object
- If the shape is shared across multiple components it can be extracted into it's own file for reuse

### Limit the use of globals inside components

- Try to avoid using globals from imports as we need to call `forceUpdate` to have the UI rerender when it changes
- Globals can be passed into a component as a prop through the `mapStateToProps` object

## Styles

For styling, we use the library [styled-components](https://www.styled-components.com).

### General rules

- All global variables should go into the `WidgetThemeProvider` component. Think **really hard** about if you actually need a global variable, chances are you don't
- If you need to use Garden overrides because styled-components can't do what you need, store the garden style overrides with the component as per [this ADR](https://github.com/zendesk/embeddable_framework/blob/master/doc/architecture/decisions/0006-css-overrides.md)
- Don't forget that you are writing JavaScript, all of the same (security)[https://www.styled-components.com/docs/advanced#security] rules apply

### Where to use styled-components

All styles for your component should go in the `styles.js` file inside of your component directory, and then imported into your components file where it will be used.

The exception to this is if you are creating a re-usable component that just contains styles, in that case your folder structure can look like this

```
ComponentName
|-- __tests__
    |-- index.test.js
|-- index.js
```

Where your index.js file looks like this

```jsx
import styled from 'styled-components'
const FunkyButton = styled.button`
  background-color: orange;
`
export default FunkyButton
```

## Routing

This an example of what `talk` routes will be used:

```
/embed/talk/online/callback_only
/embed/talk/online/phone_only
/embed/talk/online/callback_and_phone
/embed/talk/offline
```

The talk routes directory will look like:

```
|-- routes
  |-- index.js
|-- pages
  |-- online
    |-- CallbackOnlyPage
      |-- index.js
    |-- PhoneOnlyPage
      |-- index.js
    |-- CallbackAndPhonePage
      |-- index.js
  |-- offline
    |-- OfflinePage
      |-- index.js
```

Use the `routes/index.js` file to define all of your embeds routes.

### Our routes will always point to a Page component

- Pages are stored separately to other components
- The file path of a page component should match logically with the route that points to it
  - Ie /embeds/talk/online/callback_only => /embeds/talk/pages/online/CallbackOnlyPage

### Embed routes will be prefixed with their embed name

- For example all talk routes will be stored under `embed/talk/`

### Embeds that have online and offline states will have routes for both

- There will be a parent router that controls the switch between online and offline
- This makes it easier to handle this state change happening when the component is open.
- Use `history.replace(path)` when going between offline/online so the user cannot go back to the other one. (As opposed to `history.push(path)` which allows going back to it.)

### Navigation based on state (as opposed to links) should happen in the parent route file.

- Use a `<Switch>` component to define all of the main routes for each embed. A `<Switch>` statement will **only render the first** `<Redirect />` or `<Route />` child that has a matching path to the current route.
- If there a no matching routes, then you can use a `<Redirect to={dynamicPath} />` near the bottom of the `<Switch>` statement to dynamically redirect to one of the routes that you've defined above it. You can use this to choose which page to dynamically route to based on state.

### Each embed will only control its own routing

- Each embed is in charge of its routing and will only know about itself.
- Embeds shouldn't know about each other so any routing between components will be handled by routing logic inside the core of the WebWidget. (As of Feb 2020 this doesn't exist yet - we'll add it once it becomes a requirement for embed switching)
- An embed will simply indicate to the top level router that it's time to move to the next state.

## Redux

- See [REDUX_STYLE.md](https://github.com/zendesk/embeddable_framework/blob/master/REDUX_STYLE.md)

### Have separate exports for connected components and non connected

- The connected component is for use in our codebase and should be the default export.
- The non connected component is for testing. This makes components easier to test as a provider isn't needed in the test file.

## Testing

### Use Jest as the unit and integration testing framework

- Any tests currently in Jasmine must be ported to Jest
- Follow the [style guide](https://github.com/zendesk/embeddable_framework/blob/master/TEST_STYLE.md)

### Use Jest Puppeteer as the browser testing framework

- Follow the [style guide](BROWSER_TEST_STYLE.md)

## Feature flags

You can add feature flags to the Web Widget in this file [@zendesk/widget-shared-services/feature-flags/features.js](@zendesk/widget-shared-services/feature-flags/features.js)

The only thing required for this is the feature flag name and its default value.

```js
export default {
  /* ... */
  fancyNewFeature: {
    defaultValue: false,
  },
}
```

All major features should be behind an arturo flag.
To update your feature to use an arturo flag, you can provide a function on the property `getArturoValue` that returns the arturo flags value.

When your feature flag matches up with an arturo, it is considered best practice to use the same name as the arturo for the local feature name.

```js
export default {
  /* ... */
  fancyNewFeature: {
    defaultValue: false,
    getArturoValue: () => features.fancyNewFeature,
  },
}
```

In dev and debug mode, these feature flags can be updated or overridden by setting their value in local storage in the format `ZD-feature-YOUR-FEATURE-NAME`

Example:

```js
localStorage.setItem(`ZD-feature-fancyNewFeature`, true)
```

Then to check if this feature is enabled in your code, you can use the function `isFeatureEnabled`.

Note:

- Depending on the feature you are adding, it may be worth lazy loading in your change. Large features that aren't visible to our customers shouldn't impact the bundle size.
- Since these values are stored purely in local storage, if you want to update a feature flag while the web widget is running, you will need to trigger a re-render of the widget to get the new value to apply. A simple example of this is closing and re-opening the Web Widget.

```jsx
import React from 'react
import { isFeatureEnabled } from '@zendesk/widget-shared-services'

const FancyNewFeature = React.lazy(() => import('./FancyNewFeature))

const SomeComponent = () => {
  const useFancyNewFeature = isFeatureEnabled('fancyNewFeature')

  if(useFancyNewFeature) {
    return (
      <Suspense>
        <FancyNewFeature />
      </Suspense>
    )
  }

  return <LegacyFeature />
}
```
