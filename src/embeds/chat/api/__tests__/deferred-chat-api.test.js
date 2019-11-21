import { fetchDeferredChatStatus } from '../deferred-chat-api'

describe('deferred chat api', () => {
  describe('fetchDeferredChatStatus', () => {
    const mockFetch = (response, statusCode = 200) => {
      global.fetch = jest.fn(async () => ({
        status: statusCode,
        json: async () => response
      }))
    }

    afterEach(() => {
      delete global.fetch
    })

    it('throws an error when no endpoint provided', () => {
      expect(fetchDeferredChatStatus()).rejects.toThrow(
        new Error('Failed to get deferred chat status, no endpoint specified')
      )
    })

    it('throws an error when api returns an unknown status code', () => {
      mockFetch({ status: 'unknown status', departments: [] }, 401)

      expect(fetchDeferredChatStatus('example.com')).rejects.toThrow(
        new Error('Unexpected status code, expected 200 got 401')
      )
    })

    it('throws an error when api returns an unknown chat status', () => {
      mockFetch({ status: 'unknown status', departments: [] })

      expect(fetchDeferredChatStatus('example.com')).rejects.toThrow(
        new Error(`Got invalid account status from deferred chat endpoint, "unknown status"`)
      )
    })

    it('throws an error when api returns invalid departments', () => {
      mockFetch({ status: 'unknown status', departments: [] })

      expect(fetchDeferredChatStatus('example.com')).rejects.toThrow(
        new Error(`Got invalid account status from deferred chat endpoint, "unknown status"`)
      )
    })

    it('returns the status and departments keyed by id', async () => {
      mockFetch({
        status: 'online',
        departments: [
          { id: '1', name: 'online' },
          { id: '2', name: 'offline' },
          { id: '3', name: 'away' }
        ]
      })

      expect(await fetchDeferredChatStatus('example.com')).toEqual({
        status: 'online',
        departments: {
          1: { id: '1', name: 'online' },
          2: { id: '2', name: 'offline' },
          3: { id: '3', name: 'away' }
        }
      })
    })

    it('allows departments to be undefined', async () => {
      mockFetch({ status: 'online' })

      expect(await fetchDeferredChatStatus('example.com')).toEqual({
        status: 'online',
        departments: {}
      })
    })
  })
})
