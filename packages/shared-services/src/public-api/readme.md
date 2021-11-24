# Public Api

## About

The embeddable framework allows customers to use public APIs to configure or perform some action for the embeddable on their website.

[Documentation for our APIs](https://developer.zendesk.com/embeddables/docs/widget/introduction)

At the moment, the embeddable framework supports two ways of defining APIs.

The `zE` function syntax, which is the current standard and the `zE` object syntax which is now legacy.

## zE function

```js
zE('webWidget:<action>', '<event|property>', <parameters>);
```

The zE function consists of three parts,

- Embeddable namespace
- Event
- Parameters, if any

An example of this is the api to send a message in Chat for the Web Widget.

```js
zE('webWidget', 'chat:send', 'Some message')
```

On page load, a temporary queue is set up by the script that loads in the framework. Any APIs the customers call before the framework is ready will be queued up and called right before an embeddable is displayed.

### Defining your APIs

Your APIs should be defined using nested objects, where the top level object represents the namespace for your APIs and the second level represents the action.

For example

```js
const publicApi = {
  catEmbeddable: {
    open: () => {
      /* function to open cat embeddable */
    },
    showCat: (id) => {
      /* function to show a specific cat in the embeddable */
    },
  },
}
```

Here we can see that this object is defining two APIs for the `catEmbeddable` namespace.

The `open` command doesn't take any arguments and can be called simply using `zE('catEmbeddable', 'open')`

The `showCat` command does take an argument, this can be provided like this `zE('catEmbeddable', 'showCat', 1337)`

There are currently no set guidelines for how to structure arguments, however keep in mind using an object makes it easier to alter your arguments over time.

E.g. `zE('catEmbeddable', 'showCat', { id: 1337 })`

### zE object

```js
zE.someMethodName(...args)
```

This is the legacy way of doing public APIs, for this one the API function is defined on the zE object.

API functions for the object syntax aren't namespaced and don't have any other structure other than being on the zE object.

These API functions won't be available to the user until the framework has booted up. This means it is important customers only use these functions inside of a `zE` callback

```js
zE(() => {
  zE.open()
})
```

### Defining your APIs

Since the APIs for the object syntax can't be namespaced, a simple object where the key is the API name and the value is the function is enough.

```js
const publicApi = {
  open: () => {
    /* function to open an embeddable */
  },
  log: (message) => {
    /* function to log the provided message */
  },
}
```

These APIs are accessible from the `zE` object on the window object, e.g. `zE.open()` and `zE.log('some message')`

## Registering your APIs

Before your embeddable is run - during some kind of boot sequence, register your API using the service's `registerApi` function for the modern function syntax and `registerLegacyApi` for the legacy object syntax..

E.g.

```js
const bootEmbeddable = () => {
  const publicApi = {
    catEmbeddable: {
      open: () => {
        /* function to open cat embeddable */
      },
      showCat: (id) => {
        /* function to show a specific cat in the embeddable */
      },
    },
  }

  const legacyApi = {
    open: () => {
      /* function to open an embeddable */
    },
    log: (message) => {
      /* function to log the provided message */
    },
  }

  publicApi.registerApi(publicApi)
  publicApi.registerLegacyApi(legacyApi)
}
```

In the embeddable framework, right before each embeddable is run, the framework will begin executing all calls the customer has made up until now.
This means it is important that your public APIs can be executed without any UI being visible at the time.
