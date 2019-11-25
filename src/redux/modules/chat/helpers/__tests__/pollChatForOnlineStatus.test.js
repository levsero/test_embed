import pollChatForOnlineStatus from '../pollChatForOnlineStatus'
import { CHAT_POLL_INTERVAL } from 'src/constants/chat'
import { http } from 'src/service/transport/http'

jest.useFakeTimers()
const cb = jest.fn()
const badResponse = {
  body: {
    status: 'offline'
  }
}
const goodResponse = {
  body: {
    status: 'online',
    departments: [{ sales: 'online' }, { marketing: 'offline' }, { returns: 'online' }]
  }
}

describe('pollChatForOnlineStatus', () => {
  afterEach(() => {
    jest.clearAllTimers()
  })

  describe('when the account is online', () => {
    beforeEach(() => {
      jest.spyOn(http, 'getChatOnlineStatus').mockImplementation(cb => {
        cb(null, goodResponse)
      })
    })

    it('calls the callback', () => {
      pollChatForOnlineStatus(cb)

      expect(cb).toHaveBeenCalled()
    })
  })

  describe('when the account is offline or returns an error', () => {
    describe('when there is an error', () => {
      beforeEach(() => {
        jest.spyOn(http, 'getChatOnlineStatus').mockImplementation(cb => {
          cb({ err: 'derp' }, null)
        })
      })

      it(`polls the endpoint every ${CHAT_POLL_INTERVAL /
        1000} seconds to see if it's changed`, () => {
        pollChatForOnlineStatus(cb)

        expect(cb).not.toHaveBeenCalled()
        jest.advanceTimersByTime(CHAT_POLL_INTERVAL * 3)
        expect(setTimeout).toHaveBeenCalledTimes(4)
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), CHAT_POLL_INTERVAL)
      })
    })

    describe('when the account is offline', () => {
      beforeEach(() => {
        jest.spyOn(http, 'getChatOnlineStatus').mockImplementation(cb => {
          cb(null, badResponse)
        })
      })

      it(`continues polling every ${CHAT_POLL_INTERVAL / 1000} seconds`, () => {
        pollChatForOnlineStatus(cb)

        expect(cb).not.toHaveBeenCalled()
        jest.advanceTimersByTime(CHAT_POLL_INTERVAL * 3)
        expect(setTimeout).toHaveBeenCalledTimes(4)
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), CHAT_POLL_INTERVAL)
        expect(cb).not.toHaveBeenCalled()
      })
    })

    describe('when the account comes online after being offline', () => {
      it('stops polling and calls the callback', () => {
        let pollCount = 0

        jest.spyOn(http, 'getChatOnlineStatus').mockImplementation(cb => {
          pollCount++

          if (pollCount < 2) {
            cb(null, badResponse)
          } else {
            cb(null, goodResponse)
          }
        })

        pollChatForOnlineStatus(cb)
        expect(cb).not.toHaveBeenCalled()
        jest.advanceTimersByTime(CHAT_POLL_INTERVAL * 3)
        expect(setTimeout).toHaveBeenCalledTimes(1)
        expect(cb).toHaveBeenCalledTimes(1)
      })
    })
  })
})
