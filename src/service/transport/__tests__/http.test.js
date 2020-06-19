import { http } from '../http'
import { identity } from 'service/identity'
import { base64decode } from 'utility/utils'
import superagent from 'superagent'
import errorTracker from 'service/errorTracker'

jest.mock('superagent')
jest.mock('service/settings', () => {
  return {
    settings: {
      get: () => 48
    }
  }
})

jest.mock('service/errorTracker', () => ({
  error: jest.fn()
}))

beforeEach(() => {
  superagent.__clearInstances()
  http.resetConfig()
})

describe('#updateConfig', () => {
  it('updates the config', () => {
    http.updateConfig({ test: 'config2' })

    expect(http.getConfig()).toEqual(
      expect.objectContaining({
        test: 'config2',
        scheme: 'https'
      })
    )
  })
})

describe('#send', () => {
  let payload

  beforeEach(() => {
    payload = {
      method: 'get',
      path: '/test/path',
      params: {
        name: 'John Doe'
      },
      callbacks: {
        done: jest.fn(),
        fail: jest.fn(),
        always: jest.fn()
      }
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

describe('#get', () => {
  let payload

  beforeEach(() => {
    http.clearCache()
    payload = {
      path: '/test/path'
    }
  })

  it('with default config values only path passed in', () => {
    http.get(payload)

    expect(superagent.__mostRecent().query).not.toHaveBeenCalled()
    expect(superagent.__mostRecent().retry).toHaveBeenCalledWith(1)
    expect(superagent.__mostRecent().set).toHaveBeenCalledWith('Authorization', undefined)
    expect(superagent.__mostRecent().set).toHaveBeenCalledTimes(1)
    expect(superagent.__mostRecent().responseType).not.toHaveBeenCalled()
    expect(superagent.__mostRecent().timeout).toHaveBeenCalledWith({
      response: 5000,
      deadline: 60000
    })
  })

  it('sends a query string if payload contains it', () => {
    payload.query = { hello: 'there' }

    http.get(payload)

    expect(superagent.__mostRecent().query).toHaveBeenCalledWith(payload.query)
  })

  it('sends the Accept-Language if payload contains a locale', () => {
    payload.locale = 'fr'
    http.get(payload)
    expect(superagent.__mostRecent().set).toHaveBeenCalledWith('Accept-Language', 'fr')
  })

  it('overrides the timeout value if passed in', () => {
    http.get(payload, { timeout: 1000 })
    expect(superagent.__mostRecent().timeout).toHaveBeenCalledWith(1000)
  })

  it('overrides the retries value if passed in', () => {
    http.get(payload, { retries: 3 })
    expect(superagent.__mostRecent().retry).toHaveBeenCalledWith(3)
  })

  it('caches correctly based on path', async () => {
    await http.get(payload)
    expect(superagent.__getInstances().length).toEqual(1)
    await http.get({ path: '/test/path/2' })
    expect(superagent.__getInstances().length).toEqual(2)
    await http.get(payload)
    expect(superagent.__getInstances().length).toEqual(2)
  })

  it('caches correctly based on query string', async () => {
    await http.get({ path: '/test/path', query: { a: '123' } })
    expect(superagent.__getInstances().length).toEqual(1)
    await http.get({ path: '/test/path', query: { a: '123', b: '123' } })
    expect(superagent.__getInstances().length).toEqual(2)
    await http.get({ path: '/test/path', query: { a: '123' } })
    expect(superagent.__getInstances().length).toEqual(2)
  })

  it('caches correctly based on authorization', async () => {
    await http.get({ path: '/test/path', authorization: 'token1' })
    expect(superagent.__getInstances().length).toEqual(1)
    await http.get({ path: '/test/path' })
    expect(superagent.__getInstances().length).toEqual(2)
    await http.get({ path: '/test/path', authorization: 'token1' })
    expect(superagent.__getInstances().length).toEqual(2)
  })

  it('does not cache on error', async () => {
    const error = new Error('there was an error')
    superagent.__setMockError(error)

    await http.get({ path: '/test/path' }).catch(err => {
      expect(err).toEqual(error)
    })

    expect(superagent.__getInstances().length).toEqual(1)
    superagent.__setMockError(undefined)

    await http.get({ path: '/test/path' })
    expect(superagent.__getInstances().length).toEqual(2)
  })

  it('does not use cache if skipCache is true', async () => {
    await http.get(payload)
    expect(superagent.__getInstances().length).toEqual(1)
    await http.get(payload, { skipCache: true })
    expect(superagent.__getInstances().length).toEqual(2)
  })

  describe('when not forcing http', () => {
    let urlArg

    beforeEach(() => {
      http.get(payload)

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

      http.get(payload)

      urlArg = superagent.mock.calls[0][1]
    })

    it('uses the hostmapped domain', () => {
      expect(urlArg).toEqual(expect.stringContaining('help.x.yz'))
    })
  })
})

describe('#sendWithMeta', () => {
  let base64result

  const payload = {
    method: 'get',
    path: 'https://www.example.com/test',
    params: {}
  }
  const userInfo = {
    name: 'Bob',
    email: 'bob@example.com'
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
      identity.setUserIdentity(userInfo.name, userInfo.email)

      http.sendWithMeta(payload)

      base64result = base64decode(superagent.__mostRecent().query.mock.calls[0][0].data)
    })

    it('includes the identity data in the base64 encoded payload', () => {
      const { identity } = JSON.parse(base64result)

      expect(identity).toEqual(userInfo)
    })
  })
})

describe('#sendFile', () => {
  let payload

  beforeEach(() => {
    payload = {
      method: 'post',
      path: '/test/path',
      file: {
        name: 'fakeFile'
      },
      callbacks: {
        done: jest.fn(),
        fail: jest.fn(),
        progress: jest.fn()
      }
    }
  })

  describe('when the request fails', () => {
    let callback

    beforeEach(() => {
      http.sendFile(payload)

      callback = superagent.__mostRecent().end.mock.calls[0][0]
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

  describe('when callbacks are present', () => {
    beforeEach(() => {
      http.updateConfig({ zendeskHost: 'test.zendesk.host' })
      http.sendFile(payload)
    })

    it('sets the correct http method and path', () => {
      expect(superagent).toHaveBeenCalledWith('POST', 'https://test.zendesk.host/test/path')
    })

    it('adds a query string with the filename', () => {
      expect(superagent.__mostRecent().query).toHaveBeenCalledWith({
        filename: 'fakeFile'
      })
    })

    it('adds a query string with the web_widget via_id', () => {
      /* eslint camelcase:0 */
      expect(superagent.__mostRecent().query).toHaveBeenCalledWith({
        via_id: 48
      })
    })

    it('adds the file data with the key `uploaded_data`', () => {
      expect(superagent.__mostRecent().attach).toHaveBeenCalledWith('uploaded_data', payload.file)
    })

    it('triggers the done callback if response is successful', () => {
      expect(superagent.__mostRecent().end).toHaveBeenCalled()

      const callback = superagent.__mostRecent().end.mock.calls[0][0]

      callback(null, { ok: true })

      expect(payload.callbacks.done).toHaveBeenCalled()

      expect(payload.callbacks.fail).not.toHaveBeenCalled()
    })

    it('triggers the fail callback if response is unsuccessful', () => {
      expect(superagent.__mostRecent().end).toHaveBeenCalled()

      const callback = superagent.__mostRecent().end.mock.calls[0][0]

      callback({ error: true }, undefined)

      expect(payload.callbacks.fail).toHaveBeenCalled()
    })
  })

  describe('when callbacks object is not present', () => {
    beforeEach(() => {
      delete payload.callbacks

      http.sendFile(payload)
    })

    it('will not die', () => {
      const callback = superagent.__mostRecent().end.mock.calls[0][0]

      expect(() => callback(null, { ok: true })).not.toThrow()
    })
  })

  describe('when callbacks.done is not present', () => {
    beforeEach(() => {
      delete payload.callbacks.done

      http.sendFile(payload)
    })

    it('will not die', () => {
      const callback = superagent.__mostRecent().end.mock.calls[0][0]

      expect(() => callback(null, { ok: true })).not.toThrow()
    })
  })

  describe('when callbacks.fail is not present', () => {
    beforeEach(() => {
      delete payload.callbacks.fail

      http.sendFile(payload)
    })

    it('will not die', () => {
      const callback = superagent.__mostRecent().end.mock.calls[0][0]

      expect(() => callback({ error: true }, undefined)).not.toThrow()
    })
  })

  describe('when callbacks.progress is not present', () => {
    beforeEach(() => {
      delete payload.callbacks.progress

      http.sendFile(payload)
    })

    it('will not die', () => {
      const callback = superagent.__mostRecent().on.mock.calls[0][1]

      expect(() => callback({ percent: 10 })).not.toThrow()
    })
  })
})

describe('#callMeRequest', () => {
  let payload

  beforeEach(() => {
    payload = {
      params: {
        phoneNumber: '+61412345678',
        subdomain: 'bob',
        keyword: 'Support'
      },
      callbacks: {
        done: jest.fn(),
        fail: jest.fn()
      }
    }

    http.callMeRequest('http://talk_service.com', payload)
  })

  describe('sends a post request', () => {
    it('with the correct url', () => {
      expect(superagent).toHaveBeenCalledWith(
        'POST',
        'http://talk_service.com/talk_embeddables_service/callback_request'
      )
    })

    it('with the specified params', () => {
      expect(superagent.__mostRecent().send).toHaveBeenCalledWith(payload.params)
    })
  })

  describe('when the request fails', () => {
    let callback

    beforeEach(() => {
      callback = superagent.__mostRecent().end.mock.calls[0][0]
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
})

describe('#getDynamicHostname', () => {
  let result, mockConfig

  describe('when useHostmappingIfAvailable is true', () => {
    describe('when config.hostMapping exists', () => {
      beforeEach(() => {
        mockConfig = {
          hostMapping: 'super.mofo.io',
          zendeskHost: 'dbradfordstaging999.zendesk-staging.com'
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
          zendeskHost: 'dbradfordstaging999.zendesk-staging.com'
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
        zendeskHost: 'dbradfordstaging999.zendesk-staging.com'
      }
      http.updateConfig(mockConfig)
      result = http.getDynamicHostname(false)
    })

    it('returns the config.zendeskHost', () => {
      expect(result).toEqual(mockConfig.zendeskHost)
    })
  })
})

describe('#logFailure', () => {
  const baseError = {
    status: 500,
    message: 'whatcha want'
  }
  const basePayload = {
    method: 'get',
    path: '/beastie/boys.json'
  }

  let error, payload

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
        status: 500
      })
    })
  })
})
