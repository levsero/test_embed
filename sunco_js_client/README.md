#### SunCo JS Client Library

This is a very early scaffold to get us up and running with a JS client to send and receive messages to the Sunco API through.

In order to use the SunCo client, you need to have first setup an `App` within https://app.smooch.io/
and within that `App` you need to have setup a `web` integration - please select the Smooch Web Messenger as the integration type for the time being, we'll likely have our own custom integration shortly, but this will suffice for now.

**please note:- This client will only work with the V2 APIs which need to be enabled via a feature flag**

```js
const appId = 'copy from Sunco admin'
const integrationId = 'copy from Sunco admin'

const sunco = new Sunco({ integrationId, appId })

// by default the client will attempt to connect to a production URL (https://api.smooch.io). If you wish to use a different base url you can pass in during initialisation.

const sunco = new Sunco({
  integrationId: integrationId,
  appId: appId,
  baseUrl: 'https://smooch-lhills.ngrok.io'
})
```

#### Still TODO

- refactor the current session token management - they shouldn't be passed in via params - currently hardcoding additional steps within the API endpoints to cater for the API, `appUsers.create` and the auth headers being used in the messages APIs are examples
- refactor util/storage.js - its a bit bulky and seems to be catering for very obsolete browsers
- move socket client + connection into an appUser subscribe API

##### Example use

Super basic interface so far and still needs some work, but the basic gist of it looks something like this:

```js
let integrationId = 'replace with integration id'
let appId = 'replace with app id'

let client = new Sunco({ integrationId, appId })

client.startConversation().then(conversation => {
  conversation.socketClient.subscribe(event => {
    console.log('received: ', event)
  })
})

client.sendMessage('plain text message')
client.listMessages('plain text message')
```

##### Local storage tokens

TODO - fill in what these are all used for

- [integrationId].clientId:
- [integrationId].appUserId:
- [integrationId].sessionToken:
