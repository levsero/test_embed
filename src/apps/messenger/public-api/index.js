import { messageReceived } from 'src/apps/messenger/features/messageLog/store'

let id = 1

export default store => ({
  messenger: {
    // Note: This is temporary API to assist with debugging until actual
    // messaging support is added
    send: (text, fromUser = true) => {
      store.dispatch(
        messageReceived({
          message: {
            _id: ++id,
            type: 'dummy',
            text,
            role: fromUser ? 'appUser' : 'business',
            received: Date.now() / 1000,
            isLocalMessageType: true
          }
        })
      )
    },

    sendWithReplies: (text, fromUser = true) => {
      store.dispatch(
        messageReceived({
          message: {
            _id: ++id,
            type: 'text',
            text,
            role: fromUser ? 'appUser' : 'business',
            received: Date.now() / 1000,
            actions: [
              {
                type: 'reply',
                text: 'Tacos',
                iconUrl: 'http://example.org/taco.png',
                payload: 'TACOS',
                _id: '5f584700b53c4e000c41f41a'
              },
              {
                type: 'reply',
                text: 'Burritos',
                iconUrl: 'http://example.org/burrito.png',
                payload: 'BURRITOS',
                _id: '5f584700b53c4e000c41f419'
              }
            ]
          }
        })
      )
    },

    // Note: This is temporary API to assist with debugging until actual
    // messaging support is added
    auto: () => {
      setInterval(() => {
        const messageId = ++id

        store.dispatch(
          messageReceived({
            message: {
              _id: messageId,
              type: 'dummy',
              text: `Message ${messageId}`,
              role: Math.round(Math.random()) === 1 ? 'appUser' : 'business',
              received: Date.now(),
              isLocalMessageType: true
            }
          })
        )
      }, 5000)
    }
  }
})
