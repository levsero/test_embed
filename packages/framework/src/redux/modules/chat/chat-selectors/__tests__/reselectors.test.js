import * as selectors from '../reselectors'
import { CHAT_MESSAGE_EVENTS, CHAT_SYSTEM_EVENTS } from 'constants/chat'
import * as globals from 'utility/globals'
import getModifiedState from 'src/fixtures/chat-reselectors-test-state'

describe('getIsPopoutAvailable', () => {
  test('when values are correct', () => {
    jest.spyOn(globals, 'isPopout').mockReturnValue(false)
    const result = selectors.getIsPopoutAvailable(getModifiedState())

    expect(result).toEqual(true)
    globals.isPopout.mockRestore()
  })

  describe('when values are invalid', () => {
    test('is authenticated', () => {
      const result = selectors.getIsPopoutAvailable(
        getModifiedState({ chat: { isAuthenticated: true } })
      )

      expect(result).toEqual(false)
    })

    test('chat is offline', () => {
      const result = selectors.getIsPopoutAvailable(
        getModifiedState({ chat: { forcedStatus: 'offline' } })
      )

      expect(result).toEqual(false)
    })

    test('screen is already a popout', () => {
      jest.spyOn(globals, 'isPopout').mockReturnValue(true)
      const result = selectors.getIsPopoutAvailable(getModifiedState())

      expect(result).toEqual(false)
      globals.isPopout.mockRestore()
    })
  })
})

test('getPrechatFormRequired returns the expected value', () => {
  const result = selectors.getPrechatFormRequired(getModifiedState())

  expect(result).toEqual('burp')
})

describe('getIsProactiveSession', () => {
  it('returns false when no chats exist', () => {
    const result = selectors.getIsProactiveSession(
      getModifiedState({
        chat: { chats: new Map() },
      })
    )

    expect(result).toEqual(false)
  })

  it('returns true when session is proactive', () => {
    const result = selectors.getIsProactiveSession(
      getModifiedState({
        chat: {
          chats: new Map([
            [
              1,
              {
                type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_MEMBERLEAVE,
                nick: 'visitor:steve',
              },
            ],
            [
              2,
              {
                type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG,
                nick: 'agent:bob',
              },
            ],
          ]),
        },
      })
    )

    expect(result).toEqual(true)
  })

  it('returns false when visitor began the chat', () => {
    const result = selectors.getIsProactiveSession(
      getModifiedState({
        chat: {
          chats: new Map([
            [
              1,
              {
                type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_MEMBERLEAVE,
                nick: 'visitor:steve',
              },
            ],
            [
              2,
              {
                type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_COMMENT,
                nick: 'visitor:steve',
              },
            ],
            [
              3,
              {
                type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG,
                nick: 'agent:bob',
              },
            ],
          ]),
        },
      })
    )

    expect(result).toEqual(false)
  })
})

describe('getThemeShowAvatar', () => {
  it("returns true when theme includes CHAT_THEME_SHOW_AVATAR when message_type is 'basic_avatar'", () => {
    const result = selectors.getThemeShowAvatar(getModifiedState())

    expect(result).toEqual(true)
  })

  it("returns true when theme includes CHAT_THEME_SHOW_AVATAR when message_type is 'bubble_avatar'", () => {
    const result = selectors.getThemeShowAvatar(
      getModifiedState({
        chat: {
          accountSettings: {
            theme: {
              message_type: 'bubble_avatar',
            },
          },
        },
      })
    )

    expect(result).toEqual(true)
  })

  it('returns false when theme includes CHAT_THEME_SHOW_AVATAR when message_type is another value', () => {
    const result = selectors.getThemeShowAvatar(
      getModifiedState({
        chat: {
          accountSettings: {
            theme: {
              message_type: '',
            },
          },
        },
      })
    )

    expect(result).toEqual(false)
  })
})

describe('getAuthUrls', () => {
  test('returns expected values', () => {
    const result = selectors.getAuthUrls(getModifiedState())

    expect(result).toEqual({
      facebook: 'www.foo.com/facebook/bar-baz',
      google: 'www.foo.com/google/bar-baz',
    })
  })

  test('when authenticated, return empty', () => {
    const result = selectors.getAuthUrls(
      getModifiedState({
        chat: {
          isAuthenticated: true,
        },
      })
    )

    expect(result).toEqual({})
  })

  test('when no zChatGetAuthLoginUrl, return empty', () => {
    const result = selectors.getAuthUrls(
      getModifiedState({
        chat: {
          vendor: {
            zChat: {
              getAuthLoginUrl: null,
            },
          },
        },
      })
    )

    expect(result).toEqual({})
  })
})

describe('getActiveAgents', () => {
  test('returns the active bot and not the trigger', () => {
    const result = selectors.getActiveAgents(getModifiedState())

    expect(result).toEqual({ 'agent:mcbob': { avatar_path: 'bobPath' } })
  })
})

describe('getShowRatingScreen', () => {
  test('when all values are correct', () => {
    const result = selectors.getShowRatingScreen(getModifiedState())

    expect(result).toEqual(true)
  })

  test('when rating has already been set', () => {
    const result = selectors.getShowRatingScreen(
      getModifiedState({
        chat: {
          rating: {
            value: 5,
          },
        },
      })
    )

    expect(result).toEqual(false)
  })

  test('when ratingSettings is disabled', () => {
    const result = selectors.getShowRatingScreen(
      getModifiedState({
        chat: {
          accountSettings: {
            rating: {
              enabled: false,
            },
          },
        },
      })
    )

    expect(result).toEqual(false)
  })

  test('when there are no agents', () => {
    const result = selectors.getShowRatingScreen(
      getModifiedState({
        chat: {
          activeAgents: new Map(),
        },
      })
    )

    expect(result).toEqual(false)
  })

  test('when end-screen is disabled', () => {
    const result = selectors.getShowRatingScreen(
      getModifiedState({
        chat: {
          rating: {
            disableEndScreen: true,
          },
        },
      })
    )

    expect(result).toEqual(false)
  })
})

describe('getShowOfflineChat', () => {
  test('when values are correct', () => {
    const result = selectors.getShowOfflineChat(
      getModifiedState({
        chat: {
          forcedStatus: 'offline',
          rating: {
            disableEndScreen: true,
          },
          is_chatting: false,
          isLoggingOut: false,
        },
      })
    )

    expect(result).toEqual(true)
  })

  test('when chat is online', () => {
    const result = selectors.getShowOfflineChat(
      getModifiedState({
        chat: {
          forcedStatus: 'online',
          rating: {
            disableEndScreen: true,
          },
          isChatting: false,
          isLoggingOut: false,
        },
      })
    )

    expect(result).toEqual(false)
  })

  test('when is chatting', () => {
    const result = selectors.getShowOfflineChat(
      getModifiedState({
        chat: {
          forcedStatus: 'offline',
          is_chatting: true,
          rating: {
            disableEndScreen: true,
          },
          isLoggingOut: 'false',
        },
      })
    )

    expect(result).toEqual(false)
  })

  test('when should show rating screen', () => {
    const result = selectors.getShowOfflineChat(
      getModifiedState({
        chat: {
          forcedStatus: 'online',
          isLoggingOut: false,
          is_chatting: false,
        },
      })
    )

    expect(result).toEqual(false)
  })

  test('when is logging out', () => {
    const result = selectors.getShowOfflineChat(
      getModifiedState({
        chat: {
          forcedStatus: 'offline',
          isLoggingOut: true,
          rating: {
            disableEndScreen: true,
          },
          is_chatting: false,
        },
      })
    )

    expect(result).toEqual(false)
  })
})

describe('getChatConnectionMade', () => {
  it('returns true when chat connection state is connected', () => {
    const result = selectors.getChatConnectionMade(
      getModifiedState({
        chat: {
          connection: 'connected',
        },
      })
    )

    expect(result).toEqual(true)
  })

  it('returns true when chat connection state is closed', () => {
    const result = selectors.getChatConnectionMade(
      getModifiedState({
        chat: {
          connection: 'closed',
        },
      })
    )

    expect(result).toEqual(true)
  })

  it('returns false when chat connection state is not connected or closed', () => {
    const result = selectors.getChatConnectionMade(
      getModifiedState({
        chat: {
          connection: 'connecting',
        },
      })
    )

    expect(result).toEqual(false)
  })
})

describe('hasUnseenAgentMessage', () => {
  // TODO when the selectors have been split
})

describe('getChatMessagesFromAgents', () => {
  it('only returns messages from agents', () => {
    const state = getModifiedState({
      chat: {
        chats: new Map([
          [
            1,
            {
              type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG,
              nick: 'agent:bob',
            },
          ],
          [
            2,
            {
              type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_MEMBERLEAVE,
              nick: 'visitor:steve',
            },
          ],
          [
            3,
            {
              type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_COMMENT,
              nick: 'visitor:steve',
            },
          ],
          [
            4,
            {
              type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG,
              nick: 'agent:marley',
            },
          ],
          [
            5,
            {
              type: 'chat.typing',
              nick: 'agent:blah',
            },
          ],
        ]),
      },
    })
    const result = selectors.getChatMessagesFromAgents(state)

    expect(result).toEqual([
      { type: 'chat.msg', nick: 'agent:bob' },
      { type: 'chat.msg', nick: 'agent:marley' },
    ])
  })
})

describe('getActiveAgentCount', () => {
  const selector = selectors.getActiveAgentCount.resultFunc
  const activeAgents = {
    'agent:1234': {
      name: 'Johnson',
    },
    'agent:5678': {
      name: 'Smith',
    },
  }

  it('returns the number of active agents passed', () => {
    expect(selector(activeAgents)).toEqual(2)
  })
})
