import _ from 'lodash'
import createStore from 'src/redux/createStore'

jest.mock('service/settings')
jest.mock('src/redux/modules/base', () => ({
  updateEmbedAccessible: jest.fn().mockReturnValue({ type: 'embed accessible' }),
  widgetInitialised: jest.fn().mockReturnValue({ type: 'widget init' })
}))
jest.mock('service/i18n')
jest.mock('src/service/api/apis')
jest.mock('src/redux/modules/chat')
jest.mock('src/redux/modules/talk')
jest.mock('src/embeds/helpCenter/actions')
jest.mock('src/embeds/webWidget/selectors/feature-flags')

const store = createStore()

store.dispatch = jest.fn()

let mockSettings,
  renderer,
  baseActions,
  chatActions,
  talkActions,
  helpCenterActions,
  setLocaleApi,
  i18n,
  settings,
  talkfeature

beforeEach(() => {
  jest.resetModules()
  window.zESettings = {}
  mockSettings = {
    contactOptions: { enabled: false },
    offset: { vertical: 20, horizontal: 30 }
  }
  settings = require('service/settings').settings
  settings.get = value => _.get(mockSettings, value, null)

  talkfeature = require('src/embeds/webWidget/selectors/feature-flags').default
  talkfeature.mockImplementation(() => false)
  baseActions = require('src/redux/modules/base')
  setLocaleApi = require('src/service/api/apis').setLocaleApi
  i18n = require('service/i18n').i18n

  chatActions = require('src/redux/modules/chat')
  talkActions = require('src/redux/modules/talk')
  helpCenterActions = require('src/embeds/helpCenter/actions')

  renderer = require('../renderer').renderer
})

const testConfig = () => ({
  embeds: {
    helpCenterForm: {
      embed: 'helpCenter',
      props: {}
    },
    launcher: {
      embed: 'launcher',
      props: {
        position: 'right'
      }
    },
    ticketSubmissionForm: {
      embed: 'submitTicket'
    },
    chat: {
      embed: 'chat',
      props: {
        zopimId: '2EkTn0An31opxOLXuGgRCy5nPnSNmpe6',
        position: 'br'
      }
    },
    talk: {
      embed: 'talk',
      props: {
        nickname: 'yoyo'
      }
    }
  }
})

describe('init', () => {
  it('calls and renders correct embeds from config', () => {
    renderer.init(testConfig(), store)

    expect(baseActions.updateEmbedAccessible).toHaveBeenCalledWith(expect.any(String), true)

    expect(baseActions.widgetInitialised).toHaveBeenCalled()
  })

  it('handles empty config', () => {
    expect(() => {
      renderer.init({})
    }).not.toThrow()
  })

  it('does not call renderer.init more than once', () => {
    renderer.init(
      {
        embeds: {
          thing: {
            embed: 'submitTicket'
          },
          thingLauncher: {
            embed: 'launcher',
            props: {
              onDoubleClick: {
                name: 'thing',
                method: 'show'
              }
            }
          }
        }
      },
      store
    )

    renderer.init(
      {
        embeds: {
          thing: {
            embed: 'submitTicket'
          },
          thingLauncher: {
            embed: 'launcher',
            props: {
              onDoubleClick: {
                name: 'thing',
                method: 'show'
              }
            }
          }
        }
      },
      store
    )
  })

  it('it calls set up on the embeds if they exist in config', () => {
    renderer.init(testConfig(), store)

    expect(chatActions.setUpChat).toHaveBeenCalled()
    expect(talkActions.loadTalkVendors).toHaveBeenCalled()
    expect(helpCenterActions.setUpHelpCenterAuth).toHaveBeenCalled()
  })

  it('it sets up the embeds when polling talk', () => {
    talkfeature.mockImplementation(() => true)
    renderer.init(testConfig(), store)

    expect(chatActions.setUpChat).toHaveBeenCalled()
    expect(talkActions.pollTalkStatus).toHaveBeenCalled()
    expect(helpCenterActions.setUpHelpCenterAuth).toHaveBeenCalled()
  })

  it('it does not call set up on the embeds if they are not in config', () => {
    renderer.init({})

    expect(chatActions.setUpChat).not.toHaveBeenCalled()
    expect(talkActions.loadTalkVendors).not.toHaveBeenCalled()
    expect(helpCenterActions.setUpHelpCenterAuth).not.toHaveBeenCalled()
  })

  describe('initialising services', () => {
    const initRender = () => {
      renderer.init(
        {
          locale: 'en',
          webWidgetCustomizations: true,
          embeds: { x: 1 }
        },
        store
      )
    }

    it('call settings.enableCustomizations', () => {
      initRender()
      expect(settings.enableCustomizations).toHaveBeenCalled()
    })

    describe('when locale has not been set', () => {
      it('calls i18n.setLocale with the correct locale', () => {
        i18n.getLocale.mockReturnValue(null)
        initRender()
        expect(setLocaleApi).toHaveBeenCalledWith(store, 'en')
      })
    })

    describe('when locale has been set', () => {
      it('does not call i18n.setLocale', () => {
        i18n.getLocale.mockReturnValue('ar')
        initRender()
        expect(setLocaleApi).not.toHaveBeenCalled()
      })
    })
  })
})

describe('#initIPM', () => {
  const configJSON = {
    embeds: {
      helpCenterForm: {
        embed: 'helpCenter',
        props: { color: 'white' }
      }
    }
  }

  it('calls and render correct embeds from config', () => {
    renderer.initIPM(configJSON)

    expect(baseActions.updateEmbedAccessible).toHaveBeenCalledWith(expect.any(String), true)
  })
})
