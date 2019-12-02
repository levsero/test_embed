import airwaves from 'airwaves'

const c = new airwaves.Channel()

function init() {
  c.intercept('.clear', () => {
    c.broadcast('webWidget.clearAttachments')
  })
}

export const mediator = {
  channel: c,
  init
}
