import publicApi from '../'
import tracker from 'service/tracker'
import { logAndTrackApiError } from 'service/api/errorHandlers'
import LegacyZEApiError from 'src/framework/services/publicApi/LegacyZEApiError'

jest.mock('service/tracker')
jest.mock('service/api/errorHandlers')

describe('public api service', () => {
  let mockApi
  let mockLegacyApi
  let isMessengerWidget = false

  const setupWithQueueAndMockApi = api => {
    mockApi = api || {
      mock: {
        example: jest.fn(),
        example2: jest.fn()
      }
    }
    mockLegacyApi = {
      example: jest.fn(),
      example2: jest.fn()
    }
    document.zEQueue = []
    window.zE = window.zEmbed = function() {
      document.zEQueue.push(arguments)
    }
    publicApi.registerApi(mockApi)
    publicApi.registerLegacyApi(mockLegacyApi)
  }

  beforeEach(() => {
    isMessengerWidget = false
  })

  it('supports a legacy and undocumented way of changing the locale', () => {
    const mockSetLocale = jest.fn()

    setupWithQueueAndMockApi({
      webWidget: {
        setLocale: mockSetLocale
      }
    })
    zE({ locale: 'ko' })

    publicApi.run({ isMessengerWidget })

    expect(mockSetLocale).toHaveBeenCalledWith('ko')
  })

  describe('when the service is run', () => {
    it('begins running apis on demand', () => {
      setupWithQueueAndMockApi()
      zE('mock', 'example')

      expect(mockApi.mock.example).not.toHaveBeenCalled()

      publicApi.run({ isMessengerWidget })

      mockApi.mock.example.mockClear()
      expect(mockApi.mock.example).not.toHaveBeenCalled()

      zE('mock', 'example')

      expect(mockApi.mock.example).toHaveBeenCalled()
    })

    it('executes the queue that was defined by the asset composer', () => {
      setupWithQueueAndMockApi()
      zE('mock', 'example')
      zE('mock', 'example2')
      zE('mock', 'example')

      publicApi.run({ isMessengerWidget })

      expect(mockApi.mock.example).toHaveBeenCalledTimes(2)
      expect(mockApi.mock.example2).toHaveBeenCalledTimes(1)
    })

    it('logs an error instead of crashing when an unknown API was in the queue', () => {
      /* eslint-disable no-console */

      console.error = jest.fn()

      setupWithQueueAndMockApi()
      zE('mock', 'invalid')
      zE('mock', 'example')

      publicApi.run({ isMessengerWidget })

      expect(mockApi.mock.example).toHaveBeenCalled()
      expect(console.error).toHaveBeenCalledWith(new Error('Method mock.invalid does not exist'))
      /* eslint-enable no-console */
    })

    it('logs an error only once if an unknown API was in the queue of the new Messenger widget', () => {
      /* eslint-disable no-console */

      console.warn = jest.fn()

      isMessengerWidget = true
      setupWithQueueAndMockApi()
      zE('mock', 'invalid')
      zE('mock', 'invalid')

      publicApi.run({ isMessengerWidget })

      expect(console.warn).toHaveBeenCalledTimes(1)
      /* eslint-enable no-console */
    })
  })

  describe('function based api', () => {
    describe('when called with a callback function', () => {
      it('calls the callback function', () => {
        setupWithQueueAndMockApi()
        const callback = jest.fn()
        publicApi.run({ isMessengerWidget })

        zE(callback)

        expect(callback).toHaveBeenCalled()
      })
    })

    describe('when called with a string', () => {
      describe('when the string matches a valid api', () => {
        it('calls the api function with provided arguments', () => {
          setupWithQueueAndMockApi()
          zE('mock', 'example', 'argument 1', 'argument 2')

          publicApi.run({ isMessengerWidget })

          expect(mockApi.mock.example).toHaveBeenCalledWith('argument 1', 'argument 2')
        })

        it('tracks the api call', () => {
          setupWithQueueAndMockApi()
          zE('mock', 'example', 'argument 1', 'argument 2')
          publicApi.run({ isMessengerWidget })

          expect(tracker.track).toHaveBeenCalledWith('mock.example', 'argument 1', 'argument 2')
        })
      })

      describe('when the string does not match a valid api', () => {
        it('throws an error', () => {
          setupWithQueueAndMockApi()
          publicApi.run({ isMessengerWidget })

          expect(() => {
            zE('does not', 'match')
          }).toThrow('Method does not.match does not exist')
        })
      })
    })
  })

  describe('object based api', () => {
    describe('when a valid call is made', () => {
      it('calls the api', () => {
        setupWithQueueAndMockApi()
        publicApi.run({ isMessengerWidget })

        zE.example('argument 1', 'argument 2')

        expect(mockLegacyApi.example).toHaveBeenCalledWith('argument 1', 'argument 2')
      })

      it('catches and logs errors if the api function fails', () => {
        const error = new Error('some error')
        const mockApiThatFails = () => {
          throw error
        }

        setupWithQueueAndMockApi()
        publicApi.registerLegacyApi({
          mockApiThatFails
        })
        publicApi.run({ isMessengerWidget })

        zE.mockApiThatFails()

        expect(logAndTrackApiError).toHaveBeenCalledWith(
          new LegacyZEApiError(`zE.mockApiThatFails()`, error)
        )
      })
    })
  })

  describe('when window.zE is not available to use', () => {
    it('uses window.zEmbed instead', () => {
      setupWithQueueAndMockApi()
      const customersOwnzEFunction = jest.fn()
      window.zE = customersOwnzEFunction

      publicApi.run({ isMessengerWidget })
      expect(window.zE).toBe(customersOwnzEFunction)

      window.zEmbed('mock', 'example')

      expect(mockApi.mock.example).toHaveBeenCalled()
    })
  })

  it('copies over properties from the original zE function to the one defined in the framework', () => {
    setupWithQueueAndMockApi()
    zE.someCustomProperty = 'custom value'

    publicApi.run({ isMessengerWidget })

    expect(zE.someCustomProperty).toBe('custom value')
  })
})
