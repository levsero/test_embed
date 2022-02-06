import createStore from 'classicSrc/redux/createStore'
import { BOOT_UP_TIMER_COMPLETE } from 'classicSrc/redux/modules/base/base-action-types'
import _ from 'lodash'
import isFeatureEnabled from '@zendesk/widget-shared-services/feature-flags'

jest.mock('classicSrc/service/settings')
jest.mock('classicSrc/redux/modules/base', () => ({
  updateEmbedAccessible: jest.fn().mockReturnValue({ type: 'embed accessible' }),
  widgetInitialised: jest.fn().mockReturnValue({ type: 'widget init' }),
}))
jest.mock('classicSrc/app/webWidget/services/i18n')
jest.mock('classicSrc/service/api/apis')
jest.mock('classicSrc/redux/modules/chat')
jest.mock('classicSrc/embeds/talk/actions')
jest.mock('classicSrc/embeds/webWidget', () => ({
  render: jest.fn(),
}))
jest.mock('classicSrc/embeds/helpCenter/actions')
jest.mock('@zendesk/widget-shared-services/feature-flags')

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
  settings = require('classicSrc/service/settings').settings
  settings.get = (value) => _.get(mockSettings, value, null)
  settings.getErrorReportingEnabled = () => false
  errorTracker = require('@zendesk/widget-shared-services').errorTracker
  errorTracker.configure = jest.fn()
  talkfeature = require('@zendesk/widget-shared-services/feature-flags').default
  talkfeature.mockImplementation(() => false)
  baseActions = require('classicSrc/redux/modules/base')
  setLocaleApi = require('classicSrc/service/api/apis').setLocaleApi
  i18n = require('classicSrc/app/webWidget/services/i18n').i18n
  renderWebWidget = require('classicSrc/embeds/webWidget').render

  chatActions = require('classicSrc/redux/modules/chat')
  talkActions = require('classicSrc/embeds/talk/actions')
  helpCenterActions = require('classicSrc/embeds/helpCenter/actions')

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
