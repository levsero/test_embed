#### SunCo JS Client Library

This is a very early scaffold to get us up and running with a JS client to send and receive messages to the Sunco API through.

In order to use the SunCo client, you need to have first setup an `App` within https://app.smooch.io/
and within that `App` you need to have setup a `web` integration - please select the Smooch Web Messenger as the integration type for the time being, we'll likely have our own custom integration shortly, but this will suffice for now.

**please note:- Most of the client APIs will only work with the V2 APIs. These need to be enabled via a feature flag**
To see if you integration has the correct feature flag enabled we can use the client to check:

```js
//after you've initialised the client
client.SDKConfig.init().then((response) => console.log(response.body.config.app.settings))
//=> { multiConvoEnabled: true }
```

If you need to toggle the feature flag, you can do so via a script in our developer dashboard repo. PR to add this particular script is here: https://github.com/zendesk/widget-developer-dashboard/pull/47

##### Client initialisation

```js
import Sunco from '@zendesk/sunco-js-client'

const appId = 'replace with app id'
const integrationId = 'replace with integration id'

// by default the client will attempt to connect to a production URL (https://api.smooch.io). If you wish to use a different base url you can pass in during initialisation.
const client = new Sunco({
  integrationId: integrationId,
  appId: appId,
  baseUrl: 'https://smooch-lhills.ngrok.io',
})
```

##### Example use

Super basic interface so far and still needs some work, but the basic gist of it looks something like this:

```js
client.startConversation().then((conversation) => {
  // fetch conversation history via REST API
  conversation.listMessages().then((response) => console.log(response))

  // subscribe to socket events to listen for live changes
  conversation.socketClient.subscribe((event) => {
    console.log('received via socket: ', event.message?.text)
  })
})

// Once the startConversation promise has been fulfilled you can
// send and receive messages via the client instance and it will associate the requests
// with the active conversation taking place
client.sendMessage('plain text message')
client.listMessages().then((response) => console.log(response))
```

##### Local storage tokens

- [integrationId].clientId: Used to identify the device where the conversation is initiated from
- [integrationId].appUserId: Used to identify the particular end user that has started the conversation
- [integrationId].sessionToken: Long lived session token used to verify that the end user is who they say they are

##### Sunco SDK API Docs

To see the API docs needed for the client, clone this repo: https://github.com/zendesk/sunco-sdk-api-docs
Then run the docs locally via:

```bash
npx redoc-cli serve openapi/oas-2.yaml
```

The docs should then be available to read at: http://127.0.0.1:8080
