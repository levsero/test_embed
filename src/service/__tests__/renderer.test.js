import _ from 'lodash'
import { createStore } from 'redux'
import reducer from 'src/redux/modules/reducer'
import { FONT_SIZE } from 'constants/shared'

jest.mock('service/settings')
jest.mock('src/redux/modules/base')
jest.mock('embed/webWidget/webWidget')
jest.mock('service/i18n')
jest.mock('src/service/api/apis')

const store = createStore(reducer)

store.dispatch = jest.fn()

let mockSettings, mockWebWidget, mockLauncher, renderer, baseActions, setLocaleApi, i18n, settings

beforeEach(() => {
  jest.resetModules()
  window.zESettings = {}
  mockSettings = {
    contactOptions: { enabled: false },
    offset: { vertical: 20, horizontal: 30 }
  }
  mockLauncher = embedMocker()
  mockWebWidget = embedMocker()
  const mockWebWidgetFactory = () => mockWebWidget

  settings = require('service/settings').settings
  settings.get = value => _.get(mockSettings, value, null)
  const embedLauncher = require('embed/launcher/launcher')
  const WebWidgetFactory = require('embed/webWidget/webWidget').default

  baseActions = require('src/redux/modules/base')
  setLocaleApi = require('src/service/api/apis').setLocaleApi
  i18n = require('service/i18n').i18n

  embedLauncher.launcher = mockLauncher
  WebWidgetFactory.mockImplementation(mockWebWidgetFactory)

  renderer = require('../renderer').renderer
})

const updateBaseFontSize = jest.fn(),
  forceUpdateWorld = jest.fn()

const embedMocker = () => {
  return {
    create: jest.fn(),
    render: jest.fn(),
    show: jest.fn(),
    hide: jest.fn(),
    postRender: jest.fn(),
    get: () => ({
      instance: {
        updateBaseFontSize,
        forceUpdateWorld
      }
    })
  }
}

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
    }
  }
})

describe('init', () => {
  it('calls and renders correct embeds from config', () => {
    renderer.init(testConfig())

    expect(baseActions.updateEmbedAccessible).toHaveBeenCalledWith(expect.any(String), true)

    expect(baseActions.widgetInitialised).toHaveBeenCalled()

    expect(mockLauncher.create).toHaveBeenCalled()
  })

  it('handles empty config', () => {
    expect(() => {
      renderer.init({})
    }).not.toThrow()
  })

  it('does not call renderer.init more than once', () => {
    renderer.init({
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
    })

    renderer.init({
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
    })

    expect(mockLauncher.create).toHaveBeenCalledTimes(1)

    expect(mockLauncher.render).toHaveBeenCalledTimes(1)
  })

  describe('when config is not naked zopim', () => {
    beforeEach(() => {
      renderer.init(testConfig())
    })

    it('creates a webWidget embed', () => {
      expect(mockWebWidget.create).toHaveBeenCalledWith(
        'webWidget',
        expect.any(Object),
        expect.any(Object)
      )
    })

    it('passes through the ticketSubmissionForm and helpCenterForm config', () => {
      expect(mockWebWidget.create).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          embeds: {
            ticketSubmissionForm: expect.any(Object),
            helpCenterForm: expect.any(Object),
            chat: expect.any(Object)
          }
        }),
        expect.anything()
      )
    })
  })

  describe('when the config is chat standalone', () => {
    beforeEach(() => {
      const config = {
        embeds: { chat: { embed: 'chat' } }
      }

      renderer.init(config)
    })

    it('creates a webWidget', () => {
      expect(mockWebWidget.create).toHaveBeenCalled()
    })

    it('creates a launcher', () => {
      expect(mockLauncher.create).toHaveBeenCalled()
    })

    it('sets visibile prop in launcher config to false', () => {
      expect(mockLauncher.create).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          visible: false
        }),
        expect.anything()
      )
    })
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

describe('propagateFontRatio', () => {
  beforeEach(() => {
    renderer.init({
      embeds: {
        ticketSubmissionForm: {
          embed: 'ticketSubmissionForm'
        },
        launcher: {
          embed: 'launcher',
          props: {}
        }
      }
    })
  })

  it('loops over all rendered embeds and update base font-size based on ratio', () => {
    renderer.propagateFontRatio(2)

    expect(updateBaseFontSize).toHaveBeenCalledWith(`${FONT_SIZE * 2}px`)

    expect(updateBaseFontSize).toHaveBeenCalledTimes(3)
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
    const hcProps = configJSON.embeds.helpCenterForm.props

    renderer.initIPM(configJSON)

    const mockWebWidgetRecentCall = mockWebWidget.create.mock.calls[0]

    expect(baseActions.updateEmbedAccessible).toHaveBeenCalledWith(expect.any(String), true)

    expect(mockWebWidget.create).toHaveBeenCalledTimes(1)

    expect(mockWebWidgetRecentCall[1].embeds.helpCenterForm.props.color).toEqual(hcProps.color)
  })

  describe('embeddableConfig present', () => {
    const embeddableConfig = {
      embeds: {
        helpCenterForm: {
          embed: 'helpCenter',
          props: {
            color: 'black',
            position: 'left'
          }
        }
      }
    }

    it('merges the embeddableConfig with the custom config', () => {
      const hcProps = configJSON.embeds.helpCenterForm.props

      renderer.initIPM(configJSON, embeddableConfig)

      const mockWebWidgetRecentCall = mockWebWidget.create.mock.calls[0]

      expect(mockWebWidgetRecentCall[1].embeds.helpCenterForm.props.color).toEqual(hcProps.color)
    })
  })
})
