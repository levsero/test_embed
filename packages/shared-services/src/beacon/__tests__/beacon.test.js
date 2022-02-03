import isFeatureEnabled from 'src/feature-flags'
import { store } from 'src/persistence'
import * as http from 'src/transport/http/base'
import { appendMetaTag } from 'src/util/devices'
import * as globals from 'src/util/globals'
import * as pages from 'src/util/pages'
import { beacon } from '../'

globals.navigator = {
  userAgent: 'myuseragent',
  language: 'th',
}

jest.mock('src/transport/http/base')
jest.mock('src/feature-flags')

let dateNowMock

beforeEach(() => {
  document.title = undefined
  document.t = undefined
  dateNowMock = jest.spyOn(Date, 'now')
  store.clear('session')
  store.clear()
  window.i18n = {}
})

afterEach(() => {
  dateNowMock.mockRestore()
})

describe('trackLocaleDiff', () => {
  describe('when there is a locale mismatch', () => {
    it('sends the correct blip', () => {
      const mockSendWithMeta = jest.spyOn(http, 'sendWithMeta')

      beacon.trackLocaleDiff({
        rawServerLocale: 'en-GB',
        clientLocale: 'ar',
        serverLocale: 'en-gb',
        rawClientLocale: 'ar',
      })

      expect(mockSendWithMeta).toHaveBeenCalledWith({
        method: 'GET',
        params: {
          analytics: {
            action: 'localeMismatch',
            category: 'locale',
            value: {
              isMobile: false,
              rawClientLocale: 'ar',
              clientLocale: 'ar',
              rawServerLocale: 'en-GB',
              serverLocale: 'en-gb',
              userAgent: 'myuseragent',
            },
          },
        },
        path: '/embeddable_blip',
        type: 'analytics',
      })
    })

    describe('when there is not a locale mismatch', () => {
      it('does not send blip', () => {
        const mockSendWithMeta = jest.spyOn(http, 'sendWithMeta')

        window.i18n.getBrowserLocale = jest.fn(() => 'ar')
        beacon.trackLocaleDiff('ar')

        expect(mockSendWithMeta).not.toHaveBeenCalled()
      })
    })
  })
})

test('identify', () => {
  beacon.identify(
    {
      name: 'hello',
      email: 'a@a.com',
    },
    12345
  )

  expect(http.sendWithMeta).toHaveBeenCalledWith({
    method: 'GET',
    path: '/embeddable_identify',
    type: 'user',
    params: {
      user: {
        email: 'a@a.com',
        name: 'hello',
        localeId: 12345,
      },
      userAgent: 'myuseragent',
    },
  })
})

describe('trackUserAction', () => {
  it('calls sendWithMeta with the right arguments', () => {
    beacon.trackUserAction('mycategory', 'myaction', {
      label: 'mylabel',
      value: 'myvalue',
    })

    expect(http.sendWithMeta).toHaveBeenCalledWith({
      method: 'GET',
      path: '/embeddable_blip',
      type: 'userAction',
      params: {
        channel: 'web_widget',
        userAction: {
          action: 'myaction',
          category: 'mycategory',
          label: 'mylabel',
          value: 'myvalue',
        },
      },
    })
  })

  it('allows for options', () => {
    beacon.trackUserAction('mycategory', 'myaction', {
      channel: 'zendeskSpace',
    })

    expect(http.sendWithMeta).toHaveBeenCalledWith({
      method: 'GET',
      path: '/embeddable_blip',
      type: 'userAction',
      params: {
        channel: 'zendeskSpace',
        userAction: {
          action: 'myaction',
          category: 'mycategory',
          label: null,
          value: null,
        },
      },
    })
  })

  describe('when sendApiBlips = true', () => {
    beforeEach(() => {
      store.sessionStorageSet('sendApiBlips', true)
    })

    it('sends api blips when a local session storage value is set to true', () => {
      beacon.trackUserAction('api', 'myAPIAction', {
        channel: 'zendeskSpace',
      })

      expect(http.sendWithMeta).toHaveBeenCalledWith({
        method: 'GET',
        path: '/embeddable_blip',
        type: 'userAction',
        params: {
          channel: 'zendeskSpace',
          userAction: {
            action: 'myAPIAction',
            category: 'api',
            label: null,
            value: null,
          },
        },
      })
    })
  })

  describe('when sendApiBlips = false', () => {
    beforeEach(() => {
      store.sessionStorageSet('sendApiBlips', false)
    })

    it('does NOT send api blips', () => {
      beacon.trackUserAction('api', 'myAPIAction', {
        channel: 'zendeskSpace',
      })
      expect(http.sendWithMeta).not.toHaveBeenCalled()
    })

    it('still sends pageview blips', () => {
      beacon.sendPageView()
      expect(http.sendWithMeta).toHaveBeenCalled()
    })

    it('still sends identify blips', () => {
      beacon.identify(
        {
          name: 'hello',
          email: 'a@example.com',
        },
        6789
      )

      expect(http.sendWithMeta).toHaveBeenCalledWith({
        method: 'GET',
        path: '/embeddable_identify',
        type: 'user',
        params: {
          user: {
            email: 'a@example.com',
            name: 'hello',
            localeId: 6789,
          },
          userAgent: 'myuseragent',
        },
      })
    })
  })
})

describe('sendPageView', () => {
  describe('without referrer', () => {
    beforeEach(() => {
      Object.defineProperty(document, 'referrer', {
        value: '',
        configurable: true,
      })
    })

    it('sends the expected payload', () => {
      document.title = 'hello world'

      dateNowMock.mockImplementation(() => 67)
      globals.win.zEmbed = { t: 50 }
      beacon.sendPageView()

      expect(http.sendWithMeta).toHaveBeenCalledWith({
        method: 'GET',
        params: {
          channel: 'web_widget',
          pageView: {
            helpCenterDedup: false,
            isMobile: false,
            isResponsive: false,
            viewportMeta: '',
            pageTitle: 'hello world',
            referrer: 'http://localhost/',
            userAgent: 'myuseragent',
            loadTime: 17,
            navigatorLanguage: 'th',
            time: 0,
          },
        },
        path: '/embeddable_blip',
        type: 'pageView',
      })
    })
  })

  describe('with referrer policy', () => {
    beforeEach(() => {
      Object.defineProperty(document, 'referrer', {
        value: 'http://www.example.com/path',
        configurable: true,
      })
    })

    it('returns null when referrerPolicy specifies so', () => {
      jest.spyOn(globals, 'getReferrerPolicy').mockReturnValue('same-origin')

      beacon.sendPageView()

      expect(http.sendWithMeta).not.toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            channel: 'web_widget',
            pageView: expect.objectContaining({
              referrer: expect.stringContaining('http://www.example.com'),
            }),
          },
        })
      )
    })

    it('returns referrer origin when referrerPolicy specifies so', () => {
      jest.spyOn(globals, 'getReferrerPolicy').mockReturnValue('strict-origin-when-cross-origin')

      beacon.sendPageView()

      expect(http.sendWithMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            channel: 'web_widget',
            pageView: expect.objectContaining({
              referrer: 'http://www.example.com',
            }),
          },
        })
      )
    })
  })

  describe('with different referrer', () => {
    beforeEach(() => {
      jest.spyOn(globals, 'getReferrerPolicy').mockReturnValue('')
      Object.defineProperty(document, 'referrer', {
        value: 'http://www.example.com/path',
        configurable: true,
      })
    })

    it('sends the referrer', () => {
      beacon.sendPageView()

      expect(http.sendWithMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            channel: 'web_widget',
            pageView: expect.objectContaining({
              referrer: 'http://www.example.com/path',
            }),
          },
        })
      )
    })

    it('sets the initial time even if previous time already exists', () => {
      store.set('currentTime', 78, 'session')
      beacon.sendPageView()

      expect(http.sendWithMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            channel: 'web_widget',
            pageView: expect.objectContaining({
              time: 0,
            }),
          },
        })
      )
    })
  })

  describe('with same referrer', () => {
    beforeEach(() => {
      Object.defineProperty(document, 'referrer', {
        value: 'http://localhost/path',
        configurable: true,
      })
    })

    it('sends the referrer', () => {
      beacon.sendPageView()

      expect(http.sendWithMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            channel: 'web_widget',
            pageView: expect.objectContaining({
              referrer: 'http://localhost/path',
            }),
          },
        })
      )
    })
  })

  it('sends helpCenterDedup as true when on HC', () => {
    pages.isOnHelpCenterPage = () => true
    beacon.sendPageView()

    expect(http.sendWithMeta).toHaveBeenCalledWith(
      expect.objectContaining({
        params: {
          channel: 'web_widget',
          pageView: expect.objectContaining({
            helpCenterDedup: true,
          }),
        },
      })
    )
  })

  it('sends the channel param in the blip', () => {
    beacon.sendPageView('web_messenger')

    expect(http.sendWithMeta).toHaveBeenCalledWith(
      expect.objectContaining({
        params: {
          channel: 'web_messenger',
          pageView: expect.objectContaining({
            helpCenterDedup: true,
          }),
        },
      })
    )
  })

  it('sends through information on mobile and responsive websites', () => {
    appendMetaTag(document, 'viewport', 'initial-scale=1')
    globals.navigator.userAgent = 'iphone'

    http.sendWithMeta.mockClear()
    beacon.sendPageView()

    expect(http.sendWithMeta).toHaveBeenCalledWith(
      expect.objectContaining({
        params: {
          channel: 'web_widget',
          pageView: expect.objectContaining({
            isMobile: true,
            isResponsive: true,
            viewportMeta: 'initial-scale=1',
          }),
        },
      })
    )
  })

  it('does not send until page has loaded', (done) => {
    Object.defineProperty(document, 'readyState', {
      get() {
        return 'loading'
      },
    })
    beacon.sendPageView()
    expect(http.sendWithMeta).not.toHaveBeenCalled()
    document.dispatchEvent(
      new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true,
      })
    )
    setTimeout(() => {
      expect(http.sendWithMeta).toHaveBeenCalled()
      done()
    }, 0)
  })
})

describe('trackSettings', () => {
  const settings = { webWidget: { viaId: 48 } }

  describe('argument guards', () => {
    ;[undefined, {}, { cookies: false }].forEach((arg) => {
      test(`when passed ${JSON.stringify(arg)}, no blips sent`, () => {
        beacon.trackSettings(arg)

        expect(http.sendWithMeta).not.toHaveBeenCalled()
      })
    })
  })

  it('sends expected payload', () => {
    globals.win.zESettings = settings
    beacon.trackSettings(settings)
    expect(http.sendWithMeta).toHaveBeenCalledWith({
      callbacks: {
        done: expect.any(Function),
      },
      method: 'GET',
      path: '/embeddable_blip',
      type: 'settings',
      params: {
        settings: {
          webWidget: {
            viaId: 48,
          },
        },
      },
    })
  })

  describe('multiple calls', () => {
    beforeEach(() => {
      globals.win.zESettings = settings
      beacon.trackSettings(settings)
    })

    it('stores the settings in the store on success', () => {
      const success = http.sendWithMeta.mock.calls[0][0].callbacks.done
      let stored = store.get('settings')

      expect(stored).toBeNull()

      success()
      stored = store.get('settings')

      expect(stored).not.toBeNull()
    })

    describe('next call', () => {
      beforeEach(() => {
        const success = http.sendWithMeta.mock.calls[0][0].callbacks.done

        success()
        http.sendWithMeta.mockClear()
      })

      it('does not send another call again for the same setting', () => {
        beacon.trackSettings(settings)
        expect(http.sendWithMeta).not.toHaveBeenCalled()
      })

      it('clears expired settings', () => {
        const previous = store.get('settings')

        previous.push(['expired', 0])
        store.set('settings', previous)

        beacon.trackSettings(settings)
        const newSettings = store.get('settings')

        expect(newSettings.length).toEqual(1)
        expect(newSettings[0][0]).not.toEqual('expired')
      })

      it('sends another call again for a new setting', () => {
        beacon.trackSettings({ webWidget: { viaId: 46 } })
        expect(http.sendWithMeta).toHaveBeenCalled()
      })
    })
  })

  afterEach(() => {
    globals.win.zESettings = null
  })
})

describe('throttleIdentify feature flag', () => {
  const throttleIdentifyFeatureSwitch = (returnValue) => {
    return isFeatureEnabled.mockImplementation(() => returnValue)
  }

  it('does not send identify when throttleIdentify is true', () => {
    throttleIdentifyFeatureSwitch(true)
    beacon.identify({ name: 'blah', email: 'a@b.com' })
    expect(http.sendWithMeta).not.toHaveBeenCalled()
  })

  it('sends identify when throttleIdentify is false', () => {
    throttleIdentifyFeatureSwitch(false)
    beacon.identify({ name: 'blah', email: 'a@b.com' })
    expect(http.sendWithMeta).toHaveBeenCalled()
  })

  describe('reduceBlipping feature flag', () => {
    // enable feature flag for reduceBlipping
    beforeEach(() => isFeatureEnabled.mockImplementation(() => true))

    it('does not send trackUserAction', () => {
      beacon.trackUserAction('fasd', 'adsfsadf', 'afdasdf')
      expect(http.sendWithMeta).not.toHaveBeenCalled()
    })

    it('does not send sendPageView', () => {
      beacon.sendPageView()
      expect(http.sendWithMeta).not.toHaveBeenCalled()
    })

    it('does not send trackSettings', () => {
      const settings = { webWidget: { viaId: 48 } }

      globals.win.zESettings = settings
      beacon.trackSettings(settings)
      expect(http.sendWithMeta).not.toHaveBeenCalled()
    })
  })
})
