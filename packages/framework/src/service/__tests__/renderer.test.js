import _ from 'lodash'
import isFeatureEnabled from 'src/embeds/webWidget/selectors/feature-flags'
import createStore from 'src/redux/createStore'
import { BOOT_UP_TIMER_COMPLETE } from 'src/redux/modules/base/base-action-types'

jest.mock('src/service/settings')
jest.mock('src/framework/services/errorTracker')
jest.mock('src/redux/modules/base', () => ({
  updateEmbedAccessible: jest.fn().mockReturnValue({ type: 'embed accessible' }),
  widgetInitialised: jest.fn().mockReturnValue({ type: 'widget init' }),
}))
jest.mock('src/apps/webWidget/services/i18n')
jest.mock('src/service/api/apis')
jest.mock('src/redux/modules/chat')
jest.mock('src/redux/modules/talk')
jest.mock('src/embeds/webWidget', () => ({
  render: jest.fn(),
}))
jest.mock('src/embeds/helpCenter/actions')
jest.mock('src/embeds/webWidget/selectors/feature-flags')

const store = createStore()

store.dispatch = jest.fn()
store.dispatch({ type: BOOT_UP_TIMER_COMPLETE })

let mockSettings,
  renderer,
  baseActions,
  chatActions,
  talkActions,
  helpCenterActions,
  setLocaleApi,
  i18n,
  settings,
  errorTracker,
  talkfeature,
  renderWebWidget

beforeEach(() => {
  jest.resetModules()

  window.zESettings = {}
  mockSettings = {
    contactOptions: { enabled: false },
    offset: { vertical: 20, horizontal: 30 },
  }
  settings = require('src/service/settings').settings
  settings.get = (value) => _.get(mockSettings, value, null)
  settings.getErrorReportingEnabled = () => false
  errorTracker = require('src/framework/services/errorTracker').default
  errorTracker.configure = jest.fn()
  talkfeature = require('src/embeds/webWidget/selectors/feature-flags').default
  talkfeature.mockImplementation(() => false)
  baseActions = require('src/redux/modules/base')
  setLocaleApi = require('src/service/api/apis').setLocaleApi
  i18n = require('src/apps/webWidget/services/i18n').i18n
  renderWebWidget = require('src/embeds/webWidget').render

  chatActions = require('src/redux/modules/chat')
  talkActions = require('src/redux/modules/talk')
  helpCenterActions = require('src/embeds/helpCenter/actions')

  renderer = require('../renderer').renderer
})

const testConfig = () => ({
  embeds: {
    helpCenterForm: {
      embed: 'helpCenter',
      props: {},
    },
    launcher: {
      embed: 'launcher',
      props: {
        position: 'right',
      },
    },
    ticketSubmissionForm: {
      embed: 'submitTicket',
    },
    chat: {
      embed: 'chat',
      props: {
        zopimId: '2EkTn0An31opxOLXuGgRCy5nPnSNmpe6',
        position: 'br',
      },
    },
    talk: {
      embed: 'talk',
      props: {
        nickname: 'yoyo',
      },
    },
  },
})

describe('init', () => {
  it('calls and renders correct embeds from config', async () => {
    await renderer.init({
      config: testConfig(),
      reduxStore: store,
    })
    await renderer.run({
      config: testConfig(),
      reduxStore: store,
    })

    expect(baseActions.updateEmbedAccessible).toHaveBeenCalledWith(expect.any(String), true)

    expect(baseActions.widgetInitialised).toHaveBeenCalled()
  })

  it('handles empty config', () => {
    expect(() => {
      renderer.init({})
    }).not.toThrow()
  })

  it('configures the errorTracker when false', async () => {
    await renderer.init({ config: testConfig() })
    expect(errorTracker.configure).toHaveBeenCalledWith({ enabled: false })
  })

  it('configures the errorTracker when true', async () => {
    settings.getErrorReportingEnabled = () => true
    await renderer.init({ config: testConfig() })
    expect(errorTracker.configure).toHaveBeenCalledWith({ enabled: true })
  })

  describe('when config is not naked zopim', () => {
    beforeEach(async () => {
      await renderer.init({
        config: testConfig(),
        reduxStore: store,
      })
      renderer.run({
        config: testConfig(),
        reduxStore: store,
      })
    })

    it('creates a webWidget embed', () => {
      expect(renderWebWidget).toHaveBeenCalled()
    })

    describe('when the config is chat standalone', () => {
      beforeEach(async () => {
        const config = {
          embeds: { chat: { embed: 'chat' } },
        }

        await renderer.init({ config })
        renderer.run({ config })
      })

      it('creates a webWidget', () => {
        expect(renderWebWidget).toHaveBeenCalled()
      })
    })

    it('it calls set up on the embeds if they exist in config', () => {
      renderer.init({
        config: testConfig(),
        reduxStore: store,
      })

      expect(chatActions.setUpChat).toHaveBeenCalled()
      expect(talkActions.pollTalkStatus).toHaveBeenCalled()
      expect(helpCenterActions.setUpHelpCenterAuth).toHaveBeenCalled()
    })
  })

  it('it sets up the embeds when polling talk', async () => {
    talkfeature.mockImplementation(() => true)
    isFeatureEnabled.mockReturnValue(true)
    await renderer.init({
      config: testConfig(),
      reduxStore: store,
    })
    await renderer.run({
      config: testConfig(),
      reduxStore: store,
    })

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
      renderer.init({
        config: {
          locale: 'en',
          webWidgetCustomizations: true,
          embeds: {
            x: 1,
          },
        },
        reduxStore: store,
      })
    }

    it('call settings.enableCustomizations', () => {
      initRender()
      expect(settings.enableCustomizations).toHaveBeenCalled()
    })

    describe('when locale has not been set', () => {
      it('calls i18n.setLocale with the correct locale', async () => {
        i18n.getLocale.mockReturnValue(null)
        await initRender()
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

  describe('#initIPM', () => {
    const configJSON = {
      embeds: {
        helpCenterForm: {
          embed: 'helpCenter',
          props: { color: 'white' },
        },
      },
    }

    it('calls and render correct embeds from config', () => {
      renderer.initIPM(configJSON)

      expect(baseActions.updateEmbedAccessible).toHaveBeenCalledWith(expect.any(String), true)
    })
  })
})
