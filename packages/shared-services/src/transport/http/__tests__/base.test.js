import superagent from 'superagent'
import { errorTracker } from 'src/errorTracker'
import { identity } from 'src/identity'
import * as http from 'src/transport/http/base'
import { base64decode } from 'src/util/utils'

jest.mock('superagent')

jest.mock('src/errorTracker')

beforeEach(() => {
  http.resetConfig()
})

describe('#logFailure', () => {
  const baseError = {
    status: 500,
    message: 'whatcha want',
  }
  const basePayload = {
    method: 'get',
    path: '/beastie/boys.json',
  }

  let error, payload

  beforeEach(() => {
    jest.spyOn(errorTracker, 'error')
  })

  describe('when the error is a 404', () => {
    beforeEach(() => {
      error = { status: 404 }
      http.logFailure({ ...baseError, ...error }, basePayload)
    })

    it('returns and does not report to rollbar', () => {
      expect(errorTracker.error).not.toHaveBeenCalled()
    })
  })

  describe('when the request is a blip', () => {
    beforeEach(() => {
      payload = { path: 'https://sd.zendesk.com/embeddable_blip?type=pageView&data=abcde' }
      http.logFailure(baseError, { ...basePayload, ...payload })
    })

    it('returns and does not report to rollbar', () => {
      expect(errorTracker.error).not.toHaveBeenCalled()
    })
  })

  describe('when the request is an identify blip', () => {
    beforeEach(() => {
      payload = { path: 'https://sd.zendesk.com/embeddable_identify?type=pageView&data=abcde' }
      http.logFailure(baseError, { ...basePayload, ...payload })
    })

    it('returns and does not report to rollbar', () => {
      expect(errorTracker.error).not.toHaveBeenCalled()
    })
  })

  describe('when the error is not a 404', () => {
    beforeEach(() => {
      http.logFailure(baseError, basePayload)
    })

    it('uses errorTracker to report to rollbar andsends the correct params', () => {
      expect(errorTracker.error).toHaveBeenNthCalledWith(1, 'HttpApiError: whatcha want', {
        actualErrorMessage: 'whatcha want',
        hostname: 'localhost',
        method: 'GET',
        path: '/beastie/boys.json',
        status: 500,
      })
    })
  })
})

describe('#send', () => {
  let payload

  beforeEach(() => {
    payload = {
      method: 'get',
      path: '/test/path',
      params: {
        name: 'John Doe',
      },
      callbacks: {
        done: jest.fn(),
        fail: jest.fn(),
        always: jest.fn(),
      },
    }
  })

  describe('if it is a POST request', () => {
    it('sets payload.params to {} if no params are passed through', () => {
      payload.method = 'post'
      delete payload.params

      http.send(payload)

      expect(superagent.__mostRecent().send).toHaveBeenCalledWith({})
    })
  })

  describe('if it is a GET request', () => {
    it('does not pass through params if they are not defined', () => {
      payload.method = 'get'
      delete payload.params

      http.send(payload)

      expect(superagent.__mostRecent().send).not.toHaveBeenCalled()
    })
  })

  describe('query string', () => {
    beforeEach(() => {
      global.__DEV__ = false
    })

    it('sends a query string if payload contains it', () => {
      payload.query = { hello: 'there' }

      http.send(payload)

      expect(superagent.__mostRecent().query).toHaveBeenCalledWith(payload.query)
    })

    it('does not send a query string if the payload does not contain it', () => {
      payload.query = {}

      http.send(payload)

      expect(superagent.__mostRecent().query).not.toHaveBeenCalled()
    })
  })

  describe('Accept-Language', () => {
    beforeEach(() => {
      payload.locale = 'fr'
      payload.Authorization = undefined

      http.send(payload)
    })

    it('sends the Accept-Language if payload contains a locale', () => {
      expect(superagent.__mostRecent().set).toHaveBeenCalledWith('Accept-Language', 'fr')
    })
  })

  describe('type header', () => {
    it('sets the json type by default', () => {
      http.send(payload)

      expect(superagent.__mostRecent().type).toHaveBeenCalledWith('json')
    })

    it('does not send a json type if explicitly omitted', () => {
      http.send(payload, false)

      expect(superagent.__mostRecent().type).not.toHaveBeenCalled()
    })
  })

  describe('if response is successful', () => {
    it('triggers the done and always callbacks', () => {
      http.send(payload)

      expect(superagent.__mostRecent().end).toHaveBeenCalled()

      expect(payload.callbacks.done).toHaveBeenCalled()

      expect(payload.callbacks.always).toHaveBeenCalled()

      expect(payload.callbacks.fail).not.toHaveBeenCalled()
    })
  })

  describe('if response is unsuccessful', () => {
    let calls, recentCall, callback

    beforeEach(() => {
      http.send(payload)

      calls = superagent.__mostRecent().end.mock.calls
      recentCall = calls[calls.length - 1]
      callback = recentCall[0]
    })

    it('triggers the fail and always callbacks', () => {
      expect(superagent.__mostRecent().end).toHaveBeenCalled()

      callback({ error: true }, undefined)

      expect(payload.callbacks.fail).toHaveBeenCalled()

      expect(payload.callbacks.always).toHaveBeenCalled()
    })

    describe('when the error is a 404', () => {
      it('does not track the error in rollbar', () => {
        callback({ status: 404 }, undefined)

        expect(errorTracker.error).not.toHaveBeenCalled()
      })
    })

    describe('when the error is not a 404', () => {
      it('tracks the error in rollbar', () => {
        callback({ status: 500 }, undefined)

        expect(errorTracker.error).toHaveBeenCalledTimes(1)
      })
    })
  })

  it('will not die if callbacks object is not present', () => {
    delete payload.callbacks

    http.send(payload)

    const calls = superagent.__mostRecent().end.mock.calls

    const recentCall = calls[calls.length - 1]

    const callback = recentCall[0]

    expect(() => {
      callback(null, { ok: true })
    }).not.toThrow()
  })

  it('will not die if callbacks.done is not present', () => {
    delete payload.callbacks.done

    http.send(payload)

    const calls = superagent.__mostRecent().end.mock.calls

    const recentCall = calls[calls.length - 1]

    const callback = recentCall[0]

    expect(() => {
      callback(null, { ok: true })
    }).not.toThrow()
  })

  it('will not die if callbacks.fail is not present', () => {
    delete payload.callbacks.fail

    http.send(payload)

    const calls = superagent.__mostRecent().end.mock.calls

    const recentCall = calls[calls.length - 1]

    const callback = recentCall[0]

    expect(() => {
      callback({ error: true }, undefined)
    }).not.toThrow()
  })

  describe('when not forcing http', () => {
    let urlArg

    beforeEach(() => {
      http.send(payload)

      urlArg = superagent.mock.calls[0][1]
    })

    it('uses the protocol from the config', () => {
      expect(urlArg).toEqual(expect.stringContaining('https'))
    })
  })

  describe('when useHostMappingIfAvailable is set', () => {
    let urlArg

    beforeEach(() => {
      payload.useHostMappingIfAvailable = true
      http.updateConfig({ hostMapping: 'help.x.yz' })

      http.send(payload)

      urlArg = superagent.mock.calls[0][1]
    })

    it('uses the hostmapped domain', () => {
      expect(urlArg).toEqual(expect.stringContaining('help.x.yz'))
    })
  })
})

describe('#updateConfig', () => {
  it('updates the config', () => {
    http.updateConfig({ test: 'config2' })

    expect(http.getConfig()).toEqual(
      expect.objectContaining({
        test: 'config2',
        scheme: 'https',
      })
    )
  })
})

describe('#sendWithMeta', () => {
  let base64result

  const payload = {
    method: 'get',
    path: 'https://www.example.com/test',
    params: {},
  }
  const userInfo = {
    name: 'Bob',
    email: 'bob@example.com',
    phone: '0430999777',
  }

  describe('when identity is not set', () => {
    beforeEach(() => {
      http.sendWithMeta(payload)

      base64result = base64decode(superagent.__mostRecent().query.mock.calls[0][0].data)
    })

    it('does NOT include identity data in the base64 encoded payload', () => {
      const { identity } = JSON.parse(base64result)

      expect(identity).toBeUndefined()
    })
  })

  describe('when identity is set', () => {
    beforeEach(() => {
      identity.setUserIdentity(userInfo)

      http.sendWithMeta(payload)

      base64result = base64decode(superagent.__mostRecent().query.mock.calls[0][0].data)
    })

    it('includes the identity data in the base64 encoded payload', () => {
      const { identity } = JSON.parse(base64result)

      expect(identity).toEqual(userInfo)
    })
  })
})

describe('#getDynamicHostname', () => {
  let result, mockConfig

  describe('when useHostmappingIfAvailable is true', () => {
    describe('when config.hostMapping exists', () => {
      beforeEach(() => {
        mockConfig = {
          hostMapping: 'super.mofo.io',
          zendeskHost: 'dbradfordstaging999.zendesk-staging.com',
        }
        http.updateConfig(mockConfig)
        result = http.getDynamicHostname(true)
      })

      it('returns the config.hostMapping', () => {
        expect(result).toEqual(mockConfig.hostMapping)
      })
    })

    describe('when config.hostMapping does not exist', () => {
      beforeEach(() => {
        mockConfig = {
          zendeskHost: 'dbradfordstaging999.zendesk-staging.com',
        }
        http.updateConfig(mockConfig)
        result = http.getDynamicHostname(true)
      })

      it('returns the config.zendeskHost', () => {
        expect(result).toEqual(mockConfig.zendeskHost)
      })
    })
  })

  describe('when useHostmappingIfAvailable is false', () => {
    beforeEach(() => {
      mockConfig = {
        hostMapping: 'super.mofo.io',
        zendeskHost: 'dbradfordstaging999.zendesk-staging.com',
      }
      http.updateConfig(mockConfig)
      result = http.getDynamicHostname(false)
    })

    it('returns the config.zendeskHost', () => {
      expect(result).toEqual(mockConfig.zendeskHost)
    })
  })
})
