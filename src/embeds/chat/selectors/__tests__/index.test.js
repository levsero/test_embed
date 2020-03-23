import {
  getIsPollingChat,
  getDeferredChatHasResponse,
  getMenuVisible,
  getUserSoundSettings
} from '../index'

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

  describe('getDeferredChatHasResponse', () => {
    it('returns the value of chat.deferredChatHasResponse', () => {
      expect(
        getDeferredChatHasResponse({
          chat: { deferredChatHasResponse: 'boopidy' }
        })
      ).toEqual('boopidy')
    })
  })

  describe('getMenuVisible', () => {
    it('returns true when the menu is visible', () => {
      expect(getMenuVisible({ chat: { menuVisible: true } })).toBe(true)
    })

    it('returns true when the menu is not visible', () => {
      expect(getMenuVisible({ chat: { menuVisible: false } })).toBe(false)
    })
  })

  test('getUserSoundSettings', () => {
    const result = getUserSoundSettings({ chat: { soundEnabled: true } })

    expect(result).toEqual(true)
  })
})
