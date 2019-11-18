import airwaves from 'airwaves'

const c = new airwaves.Channel()

const launcher = 'launcher'

function init() {
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
