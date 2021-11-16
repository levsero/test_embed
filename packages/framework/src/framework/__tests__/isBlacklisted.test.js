import { isBlacklisted } from 'src/framework/isBlacklisted'
import * as globals from 'src/framework/utils/window'

describe('isBlacklisted', () => {
  beforeEach(() => {
    globals.win = {
      XMLHttpRequest: function () {
        this.withCredentials = true
      },
    }
    globals.navigator = {
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.122 Safari/537.36',
    }
  })

  it("returns false if doesn't support CORS or user agent has nothing within it blacklisted", () => {
    expect(isBlacklisted()).toBe(false)
  })

  it('returns true if chrome browser on iOS 8 is within the user agent string', () => {
    globals.navigator.userAgent =
      'Mozilla/5.0 (iPhone; U; CPU iPhone OS 8_0 like Mac OS X; en) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3'

    expect(isBlacklisted()).toBe(true)
  })

  it('returns false if chrome browser on iOS 8.1 is within the user agent string', () => {
    globals.navigator.userAgent =
      'Mozilla/5.0 (iPhone; U; CPU iPhone OS 8_1 like Mac OS X; en) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3'

    expect(isBlacklisted()).toBe(false)
  })

  it('returns false if chrome browser not on iOS 8 is within the user agent string', () => {
    globals.navigator.userAgent =
      'Mozilla/5.0 (iPhone; U; CPU iPhone OS 7_1 like Mac OS X; en) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3'

    expect(isBlacklisted()).toBe(false)
  })

  it('returns true if MSIE 9 is within the user agent string', () => {
    globals.navigator.userAgent = 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)'

    expect(isBlacklisted()).toBe(true)
  })

  it('returns true if IEMobile/10.0 is within the user agent string', () => {
    globals.navigator.userAgent =
      'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch)'

    expect(isBlacklisted()).toBe(true)
  })

  it('returns true if Googlebot is within the user agent string', () => {
    globals.navigator.userAgent =
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'

    expect(isBlacklisted()).toBe(true)

    globals.navigator.userAgent =
      'DoCoMo/2.0 N905i(c100;TB;W24H16) (compatible; Googlebot-Mobile/2.1; +http://www.google.com/bot.html)'

    expect(isBlacklisted()).toBe(true)
  })

  it("returns true if the browser doesn't supports CORS", () => {
    globals.win.XMLHttpRequest = null
    expect(isBlacklisted()).toBe(true)
  })

  it('Returns false if the browser doeas support CORS', () => {
    expect(isBlacklisted()).toBe(false)
  })
})
