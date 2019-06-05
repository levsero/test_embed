# Intro

This doc lists our guidelines and conventions for the code in this codebase. We are restructuring the codebase and in order to add new files to the new folders they must follow the standard outlined in this document. The goal is to eventually have everything in the new structure.

# File structure

Part of this change it switching to a new file structure. This shows what the old one is and what the new one will be. Components in the new structure should match the guidelines specified below.

### Old file structure

```
|-- asset
|-- component
    |-- ${Embed name}
|-- constants
    |-- ${Embed name}
|-- embed
|-- fixtures
|-- polyfills
|-- redux
    |-- {$Embed name}
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
    |-- {$Embed name}
        |-- actions
        |-- assets
        |-- components
        |-- constants
        |-- pages
            |-- {$page components}
            |-- routes.js
        |-- reducers
            |-- settings
            |-- config
        |-- selectors
        |-- utils
        |-- index.js
|-- framework
  |-- Frame.js
  |-- mobileScaling.js
  |-- services
|-- webWidget
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

Each embed will have it's own folder and should never reach across it's own boundried to to get information from other embeds. Any files that relate only to that component should be stored in here.

#### framework*

Contains any logic needed for rendering an embeddable. No Web Widget logic should be in here, it should be able to render any embeddable. Contains services like tracking, http and renderer

#### webWidget*

Contains the overall logic for the Web Widget, such as top level routing.

#### utils

Contains any shared utils

* Note: These folders might be shifted and renamed once we have done some work on splitting out our Embeds and have a better idea of the ideal structure of the codebase.

# Guidelines

## General

### Don’t use relative paths to parent components

- No relative paths can be used to access a parent, no `../` allowed
- You can use relative paths to access files in the same folder. `./`
- They can also be used to access children if it makes sense for that file.
- Don't be afraid to set up a webpack alias to a folder.
- Note: An exemption to this rule is in our style files as you can't use webpack aliases *pending investigate story

## React Components

### Components should be kept in a folder per component

- Components must have a folder as the component name with an index file inside that exports the component.
- Any styles, selectors, helpers, utils and tests that only relate to that component will be kept in that folder.
- You should be able to copy/paste a component folder and use it within another project in exactly the same way.

Example directory:
```
ComponentName
|-- index.js
|-- styles.scss
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

- Small components that only render one thing are fine
- If concerned about lines of code a component can always be functional

### Use Garden components where possible

- Prefer using Garden components to building them ourself. If it is possible to replace one of ours with a garden one try to do so.
- We can always wrap garden components in our own component to override styles if needed. Garden should still be the base component.
- Mandy has prepared a [design menu](https://app.goabstract.com/invitations/bcbe7a4adc99e746b51bf6a79d0b3457fa4d6c10ec61cf9891b077e2354f5dcc) for our components. Try to match these designs.

## Styles

### Do not import any global styles in a scss file.

- Remove any imported global styles from the component,
- If the style is used in multiple places it should instead become a component that can be reused in the javascript.
- Only the _vars file should be imported, and this is only used for $font-size, no other variables should be used
- The old styles folder will eventually be removed

### Avoid composing classes

- Instead of composing classes, create an override class and let the css cascade handle it for you.
- Remove any global suit css utils from the files. If they aren’t in use after this delete them from the suitcss global file too.
- Store any garden style overrides with the component as per [this ADR](https://github.com/zendesk/embeddable_framework/blob/master/doc/architecture/decisions/0006-css-overrides.md)

## Routing

This an example of what `talk` routes will be used:

```
/embed/talk/online/callback
/embed/talk/online/phone
/embed/talk/online/callbackPhone
/embed/talk/offline
```

The talk routes directory will look like:

```
|-- pages
  |-- online
    |-- callback
      |-- index.js
    |-- phone
      |-- index.js
    |-- callbackPhone
      |-- index.js
    |-- routes.js
  |-- offline
    |-- index.js
  |-- routes.js
```

### Our routes will always point to a Page component

- Pages are stored separately to other components
- The file path of a page component should match logically with the route that points to it
  - Ie /embeds/talk/online/callback  => /embeds/talk/pages/online/CallbackPage

### Routing components should only contain routing logic

- No view logic, no containers, footers or styles

### Embed routes will be prefixed with their embed name

- For example all talk routes will be stored under `embed/talk/`

### Embeds that have online and offline states will have routes for both

- There will be a parent router that controls the switch between online and offline
- This makes it easier to handle this state change happening when the component is open.
- Use `history.replace(path)` when going between offline/online so the user cannot go back to the other one. (As opposed to `history.push(path)` which allows going back to it.)

### Navigation based on state (as opposed to links) should happen in the parent route file.

- The route file should have a redirect from `/` to the correct subpath
  - `<Redirect exact={true} from='/' to={page} />`
- Route files should not need to know any paths outside of their immediate children
  - eg. the `/talk` router knows about `talk/online` and `talk/offline`, but does not know `talk/online/callback`. Similarly `/talk/online` does not know about `/talk/offline`.
- Handle any static routing logic inside componentWillMount and dynamic logic inside render.
  - eg. In the talk online router determining if the talk phone screen or callback screen should display based on talk settings is static since it won't change. Online and offline state is dynamic can should be done inside render.

### Each embed will only control its own routing

- Each embed is in charge of its routing and will only know about itself.
- Any switching between components will be handled by the router inside webWidget.
- An embed will simply indicate to the top level router that it's time to move to the next state.

### Use `component` prop instead of `render` inside routes.

- All page component should be connected to the Redux store so shouldn’t need any props passed down.

## Redux

- See [REDUX_STYLE.md](https://github.com/zendesk/embeddable_framework/blob/master/REDUX_STYLE.md)

### Have separate exports for connected components and non connected

- The connected component is for use in our codebase and should be the default export.
- The non connected component is for testing. This makes components easier to test as a provider isn't needed in the test file.

## Testing

### Use Jest as the unit testing framework

- Any tests currently in Jasmine must be ported to Jest
- Follow the [style guide](https://github.com/zendesk/embeddable_framework/blob/master/TEST_STYLE.md)
