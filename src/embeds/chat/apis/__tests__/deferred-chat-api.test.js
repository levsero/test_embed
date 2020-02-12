import superagent from 'superagent'
import { fetchDeferredChatStatus } from '../deferred-chat-api'

jest.mock('superagent')

describe('deferred chat api', () => {
  describe('fetchDeferredChatStatus', () => {
    const mockFetch = (response, statusCode = 200) => {
      superagent.mockReturnValue({
        responseType: () => ({
          end: cb => {
            cb(undefined, {
              status: statusCode,
              body: response
            })
          }
        })
      })
    }

    afterEach(() => {
      superagent.mockReset()
    })

    it('throws an error when no endpoint provided', async () => {
      await expect(fetchDeferredChatStatus()).rejects.toThrow(
        new Error('Failed to get deferred chat status, no endpoint specified')
      )
    })

    it('throws an error when api returns an unknown status code', async () => {
      mockFetch({ status: 'unknown status', departments: [] }, 401)

      await expect(fetchDeferredChatStatus('example.com')).rejects.toThrow(
        new Error('Unexpected status code, expected 200 got 401')
      )
    })

    it('throws an error when api returns an unknown chat status', async () => {
      mockFetch({ status: 'unknown status', departments: [] })

      await expect(fetchDeferredChatStatus('example.com')).rejects.toThrow(
        new Error(`Got invalid account status from deferred chat endpoint, "unknown status"`)
      )
    })

    it('throws an error when api returns invalid departments', async () => {
      mockFetch({ status: 'unknown status', departments: [] })

      await expect(fetchDeferredChatStatus('example.com')).rejects.toThrow(
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

      await expect(await fetchDeferredChatStatus('example.com')).toEqual({
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

      await expect(await fetchDeferredChatStatus('example.com')).toEqual({
        status: 'online',
        departments: {}
      })
    })
  })
})
