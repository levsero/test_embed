# Intro

This doc lists our guidelines and conventions for the code for the messenger embeddable.

# File structure

The messenger embeddable follows a feature folder based approach. Anything that is generic can be left in the top level components/hooks/etc folders. But where possible code should be inside of a feature folder.

```
|-- pages
    |-- PageComponent
        |-- __tests__
            |-- index.test.js
        |-- index.js
|-- components
    |-- SomeGeneralComponent
            |-- __tests__
                |-- index.test.js
        |-- index.js
        |-- styles.js
|-- store
    |-- someGeneralStore
        |-- index.js
|-- hooks
    |-- useGeneralHook.js
|-- features
    |-- featureName
        |-- components
            |-- SpecificFeatureComponent
                    |-- __tests__
                        |-- index.test.js
                |-- index.js
                |-- styles.js
        |-- hooks
                |-- useSpecificFeatureHook.js
        |-- store
            |-- specificFeatureStore
                |-- index.js
```

## Folders

### Pages

Page components are the only components that can be used in our react router routes.
Page components are responsible for piecing together the UI for each of the main pages.

### Components

Contains React components that are general in natural and not tied to any specific feature.

E.g. `Button`

### Hooks

Contains React hooks that are general in natural and not tied to any specific feature.

E.g. `useInterval`

### Store

Contains code for our redux store. Each different chunk of state can include actions, reducers and selectors.

### Features

A feature is a group of components, hooks, stores, utility functions and anything else that relates to the specific folder.

Each feature folder should match the same folder structure as the top level for the messenger embeddable.

This means if your feature has a component, it should be nested under a `components` folder, hooks under a `hooks` folder and so on.
