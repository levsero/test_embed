describe('auth utils', () => {
  let isTokenValid, isTokenRenewable, mockSha1
  const authPath = buildSrcPath('redux/modules/base/helpers/auth')

  beforeEach(() => {
    resetDOM()

    mockery.enable()

    initMockRegistry({
      'utility/utils': {
        base64decode: window.atob,
        sha1: () => mockSha1
      }
    })

    isTokenValid = require(authPath).isTokenValid
    isTokenRenewable = require(authPath).isTokenRenewable
  })

  afterEach(() => {
    jasmine.clock().uninstall()
    mockery.deregisterAll()
    mockery.disable()
  })

  describe('isTokenValid', () => {
    let result,
      token,
      currDate = Date.now()

    beforeEach(() => {
      jasmine.clock().install()
      jasmine.clock().mockDate(currDate)
      result = isTokenValid(token)
    })

    describe('when token has expired', () => {
      beforeAll(() => {
        token = {
          expiry: Math.floor(currDate / 1000) - 100
        }
      })

      it('returns false', () => {
        expect(result).toEqual(false)
      })
    })

    describe('when token has not expired', () => {
      beforeAll(() => {
        token = {
          expiry: Math.floor(currDate / 1000) + 100
        }
      })

      it('returns true', () => {
        expect(result).toEqual(true)
      })
    })

    describe('when token does not exist', () => {
      beforeAll(() => {
        token = undefined
      })

      it('returns false', () => {
        expect(result).toEqual(false)
      })
    })

    describe('when token expiry does not exist', () => {
      beforeAll(() => {
        token = {
          expiry: undefined
        }
      })

      it('returns false', () => {
        expect(result).toEqual(false)
      })
    })
  })

  describe('isTokenRenewable', () => {
    let result,
      token,
      currDate = Date.now()

    beforeEach(() => {
      jasmine.clock().install()
      jasmine.clock().mockDate(currDate)
      result = isTokenRenewable(token)
    })

    describe('when not expired and can renew', () => {
      let expiryDate = Math.floor(currDate / 1000) + 1000

      beforeAll(() => {
        token = {
          expiry: expiryDate
        }
      })

      it('returns true', () => {
        expect(result).toEqual(true)
      })
    })

    describe('when not expired and cannot renew', () => {
      let expiryDate = Math.floor(currDate / 1000) + 10000

      beforeAll(() => {
        token = {
          expiry: expiryDate
        }
      })

      it('returns false', () => {
        expect(result).toEqual(false)
      })
    })

    describe('when token has expired', () => {
      let expiryDate = Math.floor(currDate / 1000) - 1000

      beforeAll(() => {
        token = {
          expiry: expiryDate
        }
      })

      it('returns false', () => {
        expect(result).toEqual(false)
      })
    })

    describe('when token does not exist', () => {
      beforeAll(() => {
        token = undefined
      })

      it('returns false', () => {
        expect(result).toEqual(false)
      })
    })

    describe('when token expiry does not exist', () => {
      beforeAll(() => {
        token = {
          expiry: undefined
        }
      })

      it('returns false', () => {
        expect(result).toEqual(false)
      })
    })
  })
})
