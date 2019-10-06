let { mediator } = require('../mediator')

const c = mediator.channel

const launcherUnreadMsgs = jest.fn()
const launcherUpdateSettings = jest.fn()
const webWidgetUpdateSettings = jest.fn()
const webWidgetProactiveChat = jest.fn()
const webWidgetClearAttachments = jest.fn()

c.subscribe('launcher.setUnreadMsgs', launcherUnreadMsgs)
c.subscribe('launcher.updateSettings', launcherUpdateSettings)
c.subscribe('webWidget.updateSettings', webWidgetUpdateSettings)
c.subscribe('webWidget.proactiveChat', webWidgetProactiveChat)
c.subscribe('webWidget.clearAttachments', webWidgetClearAttachments)

describe('.clear', () => {
  beforeEach(() => {
    mediator.init()

    c.broadcast('.clear')
  })

  it('broadcasts webWidget.clearAttachments', () => {
    expect(webWidgetClearAttachments).toHaveBeenCalled()
  })
})
