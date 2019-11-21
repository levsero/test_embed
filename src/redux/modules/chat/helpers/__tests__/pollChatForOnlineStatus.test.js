import { CHAT_POLL_INTERVAL } from 'src/constants/chat'
import deferredChat, { __forTestingOnlyResetPoll } from '../pollChatForOnlineStatus'
import { http } from 'src/service/transport/http'
import logger from 'utility/logger'
import { updateDeferredChatData } from 'embeds/chat/actions/connectOnPageLoad'
import * as selectors from 'src/redux/modules/chat/chat-selectors/selectors'

jest.mock('utility/logger')

jest.useFakeTimers()
const goodResponse = {
  body: {
    status: 'online',
    departments: [
      { id: '1', name: 'online' },
      { id: '2', name: 'offline' },
      { id: '3', name: 'away' }
    ]
  }
}

const expectedCallback = updateDeferredChatData('online', {
  1: { id: '1', name: 'online' },
  2: { id: '2', name: 'offline' },
  3: { id: '3', name: 'away' }
})

describe('pollChatForOnlineStatus', () => {
  let dispatch
  let getState

  beforeEach(() => {
    dispatch = jest.fn()
    getState = jest.fn()
    jest.spyOn(selectors, 'getDeferredChatApi').mockReturnValue('example.com')
  })

  afterEach(() => {
    deferredChat.stopPolling()
    __forTestingOnlyResetPoll()
    jest.clearAllTimers()
  })

  it('calls the dispatch when a valid response is received', () => {
    jest.spyOn(http, 'getChatOnlineStatus').mockImplementation((_, cb) => {
      cb(null, goodResponse)
    })

    deferredChat.beginPolling(dispatch, getState)

    expect(dispatch).toHaveBeenCalledWith(expectedCallback)
  })

  it('allows departments to not be defined', () => {
    jest.spyOn(http, 'getChatOnlineStatus').mockImplementation((_, cb) => {
      cb(null, {
        body: {
          status: 'online',
          departments: null
        }
      })
    })

    deferredChat.beginPolling(dispatch, getState)

    expect(dispatch).toHaveBeenCalledWith(updateDeferredChatData('online', {}))
  })

  it('continues polling until "stopPolling" is called', () => {
    jest.spyOn(http, 'getChatOnlineStatus').mockImplementation((_, cb) => {
      cb(null, goodResponse)
    })

    deferredChat.beginPolling(dispatch, getState)

    jest.advanceTimersByTime(CHAT_POLL_INTERVAL * 3)
    expect(dispatch.mock.calls).toEqual([
      [expectedCallback],
      [expectedCallback],
      [expectedCallback],
      [expectedCallback]
    ])

    deferredChat.stopPolling()
    dispatch.mockClear()
    jest.advanceTimersByTime(CHAT_POLL_INTERVAL * 3)
    expect(dispatch).not.toHaveBeenCalled()
  })

  it('ignores extra calls to begin polling after it has already started', () => {
    jest.spyOn(http, 'getChatOnlineStatus').mockImplementation((_, cb) => {
      cb(null, goodResponse)
    })

    deferredChat.beginPolling(dispatch, getState)
    deferredChat.beginPolling(dispatch, getState)
    deferredChat.beginPolling(dispatch, getState)

    expect(dispatch).toHaveBeenCalledWith(expectedCallback)
    expect(dispatch).toHaveBeenCalledTimes(1)
  })

  it('logs an error when it fails to reach endpoint', () => {
    const error = new Error('some error')

    jest.spyOn(http, 'getChatOnlineStatus').mockImplementation((_, cb) => {
      cb(error)
    })

    deferredChat.beginPolling(dispatch, getState)

    expect(logger.error).toHaveBeenCalledWith('Failed getting deferred chat data', error)
  })

  it('continues polling even after receiving an error', () => {
    const error = new Error('some error')

    jest.spyOn(http, 'getChatOnlineStatus').mockImplementationOnce((_, cb) => {
      cb(error)
    })
    jest.spyOn(http, 'getChatOnlineStatus').mockImplementationOnce((_, cb) => {
      cb(undefined, goodResponse)
    })

    deferredChat.beginPolling(dispatch, getState)

    expect(logger.error).toHaveBeenCalledWith('Failed getting deferred chat data', error)
    jest.advanceTimersByTime(CHAT_POLL_INTERVAL)
    expect(dispatch).toHaveBeenCalledWith(expectedCallback)
  })

  it('logs an error when it receives an invalid status', () => {
    jest.spyOn(http, 'getChatOnlineStatus').mockImplementation((_, cb) => {
      cb(undefined, {
        body: {
          status: 'invalid status',
          departments: []
        }
      })
    })

    deferredChat.beginPolling(dispatch, getState)

    expect(logger.error).toHaveBeenCalledWith(
      `Got invalid account status from deferred chat endpoint, "invalid status"`
    )
  })

  it('logs an error when it receives invalid departments', () => {
    jest.spyOn(http, 'getChatOnlineStatus').mockImplementation((_, cb) => {
      cb(undefined, {
        body: {
          status: 'online',
          departments: 1337
        }
      })
    })

    deferredChat.beginPolling(dispatch, getState)

    expect(logger.error).toHaveBeenCalledWith(
      `Got invalid departments from deferred chat endpoint, expected array got "number"`
    )
  })

  it('continues polling even after receiving invalid data', () => {
    jest.spyOn(http, 'getChatOnlineStatus').mockImplementationOnce((_, cb) => {
      cb(undefined, {
        body: {
          status: 'invalid status',
          departments: []
        }
      })
    })
    jest.spyOn(http, 'getChatOnlineStatus').mockImplementationOnce((_, cb) => {
      cb(undefined, goodResponse)
    })

    deferredChat.beginPolling(dispatch, getState)

    expect(logger.error).toHaveBeenCalledWith(
      `Got invalid account status from deferred chat endpoint, "invalid status"`
    )
    jest.advanceTimersByTime(CHAT_POLL_INTERVAL * 2)
    expect(dispatch).toHaveBeenCalledWith(expectedCallback)
  })
})
