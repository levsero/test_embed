#### SunCo JS Client Library

This is a very early scaffold to get us up and running with a JS client to send and receive messages to the Sunco API through.

In order to use the SunCo client, you need to have first setup an `App` within https://app.smooch.io/
and within that `App` you need to have setup a `web` integration.

**please note:- This client will only work with the V2 APIs which need to be enabled via a feature flag**

```js
const appId = 'copy from Sunco admin'
const integrationId = 'copy from Sunco admin'

const sunco = new Sunco({ integrationId: integrationId, appId: appId })

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

```js
// Sunco Multi Party
const appId = ''
const integrationId = ''

const client = new Sunco({ integrationId: integrationId, appId: appId })
let appUser
let appUserId
let conversationId
let socket
let sessionToken
let socketSettings

client.appUsers
  .create()
  .then(resp => {
    appUser = resp
    console.log('APPUSER: ', appUser)
    appUserId = appUser.body.appUser._id
    conversationId = appUser.body.conversations[0]._id
    sessionToken = appUser.body.sessionToken
    socketSettings = appUser.body.settings.realtime
  })
  .then(() => {
    socket = new SuncoSocket({ ...socketSettings, appId, appUserId, sessionToken })

    socket.on('connected', () => {
      console.log('CONNECTED callback is working yo!')
    })

    socket.on('disconnected', () => {
      console.log('DISCONNECTED callback is working yo!')
    })

    socket.subscribe(`/sdk/apps/${appId}/appusers/${appUserId}`, function(...args) {
      console.log('RECEIVED SOCKET EVENT: ', ...args)
    })
  })

// Then use the following to send messages to Sunco
// If everything worked correctly, you should've also received the message via the socket connection too
client.messages.create(appUserId, conversationId, 'hello from the client')
```
