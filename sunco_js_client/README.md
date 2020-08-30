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

##### Example use

Super basic interface so far and still needs some work, but the basic gist of it looks something like this:

```js
let integrationId = 'replace with integration id'
let appId = 'replace with app id'

let client = new Sunco({ integrationId, appId })

client.startConversation().then(conversation => {
  // fetch conversation history via REST API
  conversation.listMessages().then(response => console.log(response))

  // subscribe to socket events to listen for live changes
  conversation.socketClient.subscribe(event => {
    console.log('received via socket: ', event.message?.text)
  })
})

// Once the startConversation promise has been fulfilled you can
// send and receive messages via the client instance and it will associate the requests
// with the active conversation taking place
client.sendMessage('plain text message')
client.listMessages()
```

##### Local storage tokens

- [integrationId].clientId: Used to identify the device where the conversation is initiated from
- [integrationId].appUserId: Used to identify the particular end user that has started the conversation
- [integrationId].sessionToken: Long lived session token used to verify that the end user is who they say they are
