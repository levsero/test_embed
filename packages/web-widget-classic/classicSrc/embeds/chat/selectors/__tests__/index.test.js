import { isFeatureEnabled } from '@zendesk/widget-shared-services'
import {
  getIsPollingChat,
  getDeferredChatHasResponse,
  getMenuVisible,
  getUserSoundSettings,
  getEditContactDetails,
} from '../index'

jest.mock('@zendesk/widget-shared-services')

const disableStatusPollingFeatureSwitch = (returnValue) => {
  return isFeatureEnabled.mockImplementation(() => returnValue)
}

describe('chat selectors', () => {
  describe('getIsPollingChat', () => {
    it('returns true when deferred chat is polling', () => {
      disableStatusPollingFeatureSwitch(false)

      expect(
        getIsPollingChat({
          chat: {
            deferredChatIsPolling: true,
          },
        })
      ).toBe(true)
    })

    it('returns false when deferred chat is not polling', () => {
      disableStatusPollingFeatureSwitch(false)

      expect(
        getIsPollingChat({
          chat: {
            deferredChatIsPolling: false,
          },
        })
      ).toBe(false)
    })

    it('returns false when arturo "disableStatusPolling" is enabled', () => {
      disableStatusPollingFeatureSwitch(true)

      expect(
        getIsPollingChat({
          chat: {
            deferredChatIsPolling: true,
          },
        })
      ).toBe(false)
    })
  })

  describe('getDeferredChatHasResponse', () => {
    it('returns the value of chat.deferredChatHasResponse', () => {
      expect(
        getDeferredChatHasResponse({
          chat: { deferredChatHasResponse: 'boopidy' },
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

  test('getEditContactDetails', () => {
    const result = getEditContactDetails({ chat: { editContactDetails: 'bad edit' } })

    expect(result).toEqual('bad edit')
  })
})
