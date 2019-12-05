import { getIsPollingChat } from '../index'

describe('chat selectors', () => {
  describe('getIsPollingChat', () => {
    it('returns true when deferred chat is polling', () => {
      expect(
        getIsPollingChat({
          base: {
            embeddableConfig: {
              disableStatusPolling: false
            }
          },
          chat: {
            deferredChatIsPolling: true
          }
        })
      ).toBe(true)
    })

    it('returns false when deferred chat is not polling', () => {
      expect(
        getIsPollingChat({
          base: {
            embeddableConfig: {
              disableStatusPolling: false
            }
          },
          chat: {
            deferredChatIsPolling: false
          }
        })
      ).toBe(false)
    })

    it('returns false when arturo "disableStatusPolling" is enabled', () => {
      expect(
        getIsPollingChat({
          base: {
            embeddableConfig: {
              disableStatusPolling: true
            }
          },
          chat: {
            deferredChatIsPolling: true
          }
        })
      ).toBe(false)
    })
  })
})
