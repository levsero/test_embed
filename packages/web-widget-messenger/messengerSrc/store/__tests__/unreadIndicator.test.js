import * as unreadIndicator from '../unreadIndicator'

describe('unreadIndicator store', () => {
  describe('getUnreadMessages', () => {
    const unreadMessage = [
      {
        _id: 1,
        type: 'text',
        text: 'first text',
        role: 'business',
        received: 1,
      },
    ]

    const readMessage = [
      {
        _id: 2,
        type: 'text',
        text: 'second text',
        role: 'business',
        received: 2,
        isLocalMessageType: true,
      },
    ]

    const appUserMessage = [
      {
        _id: 3,
        type: 'text',
        text: 'third text',
        role: 'appUser',
        received: 3,
      },
    ]

    const messages = [...unreadMessage, ...readMessage, ...appUserMessage]

    it('returns unreadMessage if lastReadTimestamp is undefined', () => {
      expect(unreadIndicator.getUnreadMessages.resultFunc(messages, undefined)).toEqual(
        unreadMessage
      )
    })

    it('returns unreadMessage if lastReadTimestamp is defined and message.received is later than lastReadTimestamp', () => {
      expect(unreadIndicator.getUnreadMessages.resultFunc(messages, 0)).toEqual(unreadMessage)
    })

    it('does not return unreadMessage if lastReadTimestamp is defined and message.received is earlier than or equal to lastReadTimestamp', () => {
      expect(unreadIndicator.getUnreadMessages.resultFunc(messages, 2)).not.toEqual(unreadMessage)
      expect(unreadIndicator.getUnreadMessages.resultFunc(messages, 1)).not.toEqual(unreadMessage)
    })
  })
})
