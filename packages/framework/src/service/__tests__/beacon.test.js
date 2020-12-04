import { beacon } from '../beacon'
import { store } from 'src/framework/services/persistence'
import { http } from 'service/transport'
import { i18n } from 'service/i18n'
import * as pages from 'utility/pages'
import * as globals from 'utility/globals'
import { appendMetaTag } from 'utility/devices'

globals.navigator = {
  userAgent: 'myuseragent',
  language: 'th'
}

jest.mock('service/transport')

let dateNowMock

beforeEach(() => {
  document.title = undefined
  document.t = undefined
  dateNowMock = jest.spyOn(Date, 'now')
  store.clear('session')
  store.clear()
  beacon.setConfig({
    reduceBlipping: false,
    throttleIdentify: false
  })
})

afterEach(() => {
  dateNowMock.mockRestore()
})

describe('trackLocaleDiff', () => {
  describe('when there is a locale mismatch', () => {
    it('sends the correct blip', () => {
      const mockSendWithMeta = jest.spyOn(http, 'sendWithMeta')

      i18n.getClientLocale = jest.fn(() => 'ar')
      beacon.trackLocaleDiff('en-GB')

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
              userAgent: 'myuseragent'
            }
          }
        },
        path: '/embeddable_blip',
        type: 'analytics'
      })
    })

    describe('when there is not a locale mismatch', () => {
      it('does not send blip', () => {
        const mockSendWithMeta = jest.spyOn(http, 'sendWithMeta')

        i18n.getClientLocale = jest.fn(() => 'ar')
        beacon.trackLocaleDiff('ar')

        expect(mockSendWithMeta).not.toHaveBeenCalled()
      })
    })
  })
})

test('identify', () => {
  i18n.getLocaleId = jest.fn(() => 12345)
  beacon.identify({
    name: 'hello',
    email: 'a@a.com'
  })

  expect(http.sendWithMeta).toHaveBeenCalledWith({
    method: 'GET',
    path: '/embeddable_identify',
    type: 'user',
    params: {
      user: {
        email: 'a@a.com',
        name: 'hello',
        localeId: 12345
      },
      userAgent: 'myuseragent'
    }
  })
})

describe('trackUserAction', () => {
  it('calls sendWithMeta with the right arguments', () => {
    beacon.trackUserAction('mycategory', 'myaction', {
      label: 'mylabel',
      value: 'myvalue'
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
          value: 'myvalue'
        }
      }
    })
  })

  it('allows for options', () => {
    beacon.trackUserAction('mycategory', 'myaction', {
      channel: 'zendeskSpace'
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
          value: null
        }
      }
    })
  })
})

describe('sendPageView', () => {
  describe('without referrer', () => {
    beforeEach(() => {
      Object.defineProperty(document, 'referrer', {
        value: '',
        configurable: true
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
            time: 0
          }
        },
        path: '/embeddable_blip',
        type: 'pageView'
      })
    })
  })

  describe('with referrer policy', () => {
    beforeEach(() => {
      Object.defineProperty(document, 'referrer', {
        value: 'http://www.example.com/path',
        configurable: true
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
              referrer: expect.stringContaining('http://www.example.com')
            })
          }
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
              referrer: 'http://www.example.com'
            })
          }
        })
      )
    })
  })

  describe('with different referrer', () => {
    beforeEach(() => {
      jest.spyOn(globals, 'getReferrerPolicy').mockReturnValue('')
      Object.defineProperty(document, 'referrer', {
        value: 'http://www.example.com/path',
        configurable: true
      })
    })

    it('sends the referrer', () => {
      beacon.sendPageView()

      expect(http.sendWithMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            channel: 'web_widget',
            pageView: expect.objectContaining({
              referrer: 'http://www.example.com/path'
            })
          }
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
              time: 0
            })
          }
        })
      )
    })
  })

  describe('with same referrer', () => {
    beforeEach(() => {
      Object.defineProperty(document, 'referrer', {
        value: 'http://localhost/path',
        configurable: true
      })
    })

    it('sends the referrer', () => {
      beacon.sendPageView()

      expect(http.sendWithMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          params: {
            channel: 'web_widget',
            pageView: expect.objectContaining({
              referrer: 'http://localhost/path'
            })
          }
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
            helpCenterDedup: true
          })
        }
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
            helpCenterDedup: true
          })
        }
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
            viewportMeta: 'initial-scale=1'
          })
        }
      })
    )
  })

  it('does not send until page has loaded', done => {
    Object.defineProperty(document, 'readyState', {
      get() {
        return 'loading'
      }
    })
    beacon.sendPageView()
    expect(http.sendWithMeta).not.toHaveBeenCalled()
    document.dispatchEvent(
      new Event('DOMContentLoaded', {
        bubbles: true,
        cancelable: true
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
    ;[undefined, {}, { cookies: false }].forEach(arg => {
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
        done: expect.any(Function)
      },
      method: 'GET',
      path: '/embeddable_blip',
      type: 'settings',
      params: {
        settings: {
          webWidget: {
            viaId: 48
          }
        }
      }
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

describe('setConfig', () => {
  it('does not send identify when throttleIdentify is true', () => {
    beacon.setConfig({ throttleIdentify: true })
    beacon.identify({ name: 'blah', email: 'a@b.com' })
    expect(http.sendWithMeta).not.toHaveBeenCalled()
  })

  describe('reduceBlipping', () => {
    beforeEach(() => {
      beacon.setConfig({ reduceBlipping: true })
    })

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
