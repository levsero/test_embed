import airwaves from 'airwaves'

import { proactiveMessageReceived } from 'src/redux/modules/chat'

const c = new airwaves.Channel()

const launcher = 'launcher'
const chat = 'zopimChat'
const state = {}

state[`${chat}.userClosed`] = false

function init(store) {
  c.intercept('newChat.newMessage', _ => {
    if (!state[`${chat}.userClosed`]) {
      c.broadcast('webWidget.proactiveChat')
      store.dispatch(proactiveMessageReceived())
    }
  })

  c.intercept('webWidget.onClose', () => {
    state[`${chat}.userClosed`] = true
  })

  c.intercept('.clear', () => {
    c.broadcast('webWidget.clearAttachments')
  })

  c.intercept('.onSetLocale', () => {
    c.broadcast(`${launcher}.refreshLocale`)
    c.broadcast('webWidget.refreshLocale')
  })
}

export const mediator = {
  channel: c,
  init
}
