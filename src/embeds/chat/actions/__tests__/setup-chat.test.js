import { BEGIN_CHAT_SETUP, RECEIVE_DEFERRED_CHAT_STATUS } from 'embeds/chat/actions/action-types'
import createStore from 'src/redux/createStore'
import { fetchDeferredChatStatus } from 'embeds/chat/api/deferred-chat-api'
import { MAX_CHAT_POLL_INTERVAL, BASE_CHAT_POLL_INTERVAL } from 'constants/chat'
import errorTracker from 'service/errorTracker/errorTracker'
import { beginChatSetup, deferChatSetup } from '../setup-chat'

jest.useFakeTimers()
jest.mock('embeds/chat/api/deferred-chat-api')
jest.mock('service/errorTracker/errorTracker')

describe('chat embed actions', () => {
  describe('beginChatSetup', () => {
    it('returns an action to acknowledge chat has begun to be set up', () => {
      expect(beginChatSetup()).toEqual({
        type: BEGIN_CHAT_SETUP
      })
    })
  })

  describe('deferChatSetup', () => {
    const waitForApi = async () => {
      await new Promise(res => {
        res()
      })
      await new Promise(res => {
        res()
      })
    }

    const waitForTimer = async (time = MAX_CHAT_POLL_INTERVAL) => {
      await new Promise(res => {
        res()
      })
      jest.advanceTimersByTime(time)
      await new Promise(res => {
        res()
      })
    }

    const iteration = async time => {
      await waitForApi()
      await waitForTimer(time)
    }

    const response = {
      status: 'online',
      departments: {
        1: {
          id: 1,
          status: 'online'
        }
      }
    }

    const expectedAction = {
      type: RECEIVE_DEFERRED_CHAT_STATUS,
      payload: response
    }

    afterEach(() => {
      jest.clearAllTimers()
      fetchDeferredChatStatus.mockReset()
    })

    it('polls backing off exponentially', async () => {
      fetchDeferredChatStatus.mockReturnValue(response)

      const store = createStore()
      const mockDispatch = jest.fn(store.dispatch)

      deferChatSetup()(mockDispatch, store.getState)
      mockDispatch.mockClear()

      // initial call is immediate
      await iteration(0)
      expect(mockDispatch.mock.calls).toEqual([[expectedAction]])
      mockDispatch.mockClear()

      // subsequent 2 calls use base interval
      await iteration(BASE_CHAT_POLL_INTERVAL)
      await iteration(BASE_CHAT_POLL_INTERVAL)

      expect(mockDispatch.mock.calls).toEqual([[expectedAction], [expectedAction]])
      mockDispatch.mockClear()

      // then waits double base time
      await iteration(BASE_CHAT_POLL_INTERVAL)
      expect(mockDispatch.mock.calls).toEqual([])
      await iteration(BASE_CHAT_POLL_INTERVAL)
      expect(mockDispatch.mock.calls).toEqual([[expectedAction]])
      mockDispatch.mockClear()

      // then waits four * base time
      await iteration(BASE_CHAT_POLL_INTERVAL * 3)
      expect(mockDispatch.mock.calls).toEqual([])
      await iteration(BASE_CHAT_POLL_INTERVAL)
      expect(mockDispatch.mock.calls).toEqual([[expectedAction]])
      mockDispatch.mockClear()
    })

    it('polls the deferred chat api until stopped', async () => {
      fetchDeferredChatStatus.mockReturnValue(response)

      const store = createStore()
      const mockDispatch = jest.fn(store.dispatch)

      deferChatSetup()(mockDispatch, store.getState)
      mockDispatch.mockClear()

      await iteration()
      await iteration()
      await iteration()

      await waitForApi()

      expect(mockDispatch.mock.calls).toEqual([
        [expectedAction],
        [expectedAction],
        [expectedAction],
        [expectedAction]
      ])
      mockDispatch.mockClear()

      store.dispatch(beginChatSetup())

      await waitForTimer()

      await iteration()
      await iteration()

      expect(mockDispatch).not.toHaveBeenCalled()
    })

    it('continues polling even after getting an error', async () => {
      fetchDeferredChatStatus.mockImplementationOnce(() => response)
      fetchDeferredChatStatus.mockImplementationOnce(async () => {
        throw new Error('some error')
      })
      fetchDeferredChatStatus.mockImplementationOnce(() => response)

      const store = createStore()
      const mockDispatch = jest.fn(store.dispatch)

      deferChatSetup()(mockDispatch, store.getState)
      mockDispatch.mockClear()
      await waitForApi()

      expect(mockDispatch).toHaveBeenCalledWith(expectedAction)
      mockDispatch.mockClear()

      await waitForTimer()
      await waitForApi()

      expect(mockDispatch).not.toHaveBeenCalled()
      expect(errorTracker.error).toHaveBeenCalledWith(
        new Error('Failed getting deferred chat data'),
        { apiError: new Error('some error') }
      )

      await waitForTimer()
      await waitForApi()
      expect(mockDispatch).toHaveBeenCalledWith(expectedAction)
    })
  })
})