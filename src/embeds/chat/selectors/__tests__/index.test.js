import { getIsPollingChat } from '../index'

describe('chat selectors', () => {
  describe('getIsPollingChat', () => {
    it('returns true when deferred chat is polling', () => {
      expect(
        getIsPollingChat({
          chat: {
            deferredChatIsPolling: true
          }
        })
      ).toBe(true)
    })

    it('returns false when deferred chat is not polling', () => {
      expect(
        getIsPollingChat({
          chat: {
            deferredChatIsPolling: false
          }
        })
      ).toBe(false)
    })
  })
})
