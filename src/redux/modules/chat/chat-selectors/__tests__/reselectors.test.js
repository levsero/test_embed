import * as selectors from '../reselectors';
import {
  CHAT_MESSAGE_EVENTS,
  CHAT_SYSTEM_EVENTS
} from 'constants/chat';
import 'utility/i18nTestHelper';
import * as globals from 'utility/globals';
import { map } from 'when';
import getModifiedState from 'src/fixtures/chat-reselectors-test-state';

describe('getIsPopoutAvailable', () => {
  let result;

  test('when values are correct', () => {
    jest.spyOn(globals, 'isPopout').mockReturnValue(false);
    result = selectors.getIsPopoutAvailable(getModifiedState());

    expect(result).toEqual(true);
    globals.isPopout.mockRestore();
  });

  describe('when values are invalid', () => {
    test('is authenticated', () => {
      result = selectors.getIsPopoutAvailable(getModifiedState({ chat: { isAuthenticated: true } }));

      expect(result).toEqual(false);
    });

    test('chat is offline', () => {
      result = selectors.getIsPopoutAvailable(getModifiedState({ chat: { forcedStatus: 'offline' } }));

      expect(result).toEqual(false);
    });

    test('screen is already a popout', () => {
      jest.spyOn(globals, 'isPopout').mockReturnValue(true);
      result = selectors.getIsPopoutAvailable(getModifiedState());

      expect(result).toEqual(false);
      globals.isPopout.mockRestore();
    });
  });
});

test('getPrechatFormRequired returns the expected value', () => {
  const result = selectors.getPrechatFormRequired(getModifiedState());

  expect(result).toEqual('burp');
});

describe('getIsProactiveSession', () => {
  let result;

  it('returns false when no chats exist', () => {
    result = selectors.getIsProactiveSession(getModifiedState({
      chat: { chats: new Map([]) }
    }));

    expect(result).toEqual(false);
  });

  it('returns true when session is proactive', () => {
    result = selectors.getIsProactiveSession(getModifiedState({
      chat: {
        chats: new Map([
          [
            1, {
              type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG,
              nick: 'agent:bob'
            },
            2, {
              type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_MEMBERLEAVE,
              nick: 'visitor:steve'
            },
            3, {
              type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_COMMENT,
              nick: 'visitor:steve'
            },
          ]
        ])
      }
    }));

    expect(result).toEqual(true);
  });

  it('returns false when visitor began the chat', () => {
    result = selectors.getIsProactiveSession(getModifiedState({
      chat: {
        chats: new Map([
          [
            1, {
              type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_MEMBERLEAVE,
              nick: 'visitor:steve'
            },
            2, {
              type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_COMMENT,
              nick: 'visitor:steve'
            },
            3, {
              type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG,
              nick: 'agent:bob'
            }
          ]
        ])
      }
    }));

    expect(result).toEqual(false);
  });
});

describe('getThemeShowAvatar', () => {
  let result;

  it('returns true when theme includes CHAT_THEME_SHOW_AVATAR when message_type is \'basic_avatar\'', () => {
    result = selectors.getThemeShowAvatar(getModifiedState());

    expect(result).toEqual(true);
  });

  it('returns true when theme includes CHAT_THEME_SHOW_AVATAR when message_type is \'bubble_avatar\'', () => {
    result = selectors.getThemeShowAvatar(getModifiedState({
      chat: {
        accountSettings: {
          theme: {
            message_type: 'bubble_avatar'
          }
        }
      }
    }));

    expect(result).toEqual(true);
  });

  it('returns false when theme includes CHAT_THEME_SHOW_AVATAR when message_type is another value', () => {
    result = selectors.getThemeShowAvatar(getModifiedState({
      chat: {
        accountSettings: {
          theme: {
            message_type: ''
          }
        }
      }
    }));

    expect(result).toEqual(false);
  });
});

describe('getAuthUrls', () => {
  let result;

  test('returns expected values', () => {
    result = selectors.getAuthUrls(getModifiedState());

    expect(result).toEqual({
      facebook: 'www.foo.com/facebook/bar-baz',
      google: 'www.foo.com/google/bar-baz'
    });
  });

  test('when authenticated, return empty', () => {
    result = selectors.getAuthUrls(getModifiedState({
      chat: {
        isAuthenticated: true
      }
    }));

    expect(result).toEqual({});
  });

  test('when no zChatGetAuthLoginUrl, return empty', () => {
    result = selectors.getAuthUrls(getModifiedState({
      chat: {
        vendor: {
          zChat: {
            getAuthLoginUrl: null
          }
        }
      }
    }));

    expect(result).toEqual({});
  });
});

describe('getActiveAgents', () => {
  let result;

  test('returns the active bot and not the trigger', () => {
    result = selectors.getActiveAgents(getModifiedState());

    expect(result).toEqual({ 'agent:mcbob': { avatar_path: 'bobPath' } });
  });
});

describe('getShowRatingScreen', () => {
  let result;

  test('when all values are correct', () => {
    result = selectors.getShowRatingScreen(getModifiedState());

    expect(result).toEqual(true);
  });

  test('when rating has already been set', () => {
    result = selectors.getShowRatingScreen(getModifiedState({
      chat: {
        rating: {
          value: 5
        }
      }
    }));

    expect(result).toEqual(false);
  });

  test('when ratingSettings is disabled', () => {
    result = selectors.getShowRatingScreen(getModifiedState({
      chat: {
        accountSettings: {
          rating: {
            enabled: false
          }
        }
      }
    }));

    expect(result).toEqual(false);
  });

  test('when there are no agents', () => {
    result = selectors.getShowRatingScreen(getModifiedState({
      chat: {
        agents: new map([])
      }
    }));

    expect(result).toEqual(false);
  });

  test('when end-screen is disabled', () => {
    result = selectors.getShowRatingScreen(getModifiedState({
      chat: {
        rating: {
          disableEndScreen: true
        }
      }
    }));

    expect(result).toEqual(false);
  });
});

describe('getShowOfflineChat', () => {
  let result;

  test('when values are correct', () => {
    result = selectors.getShowOfflineChat(getModifiedState({
      chat: {
        forcedStatus: 'offline',
        rating: {
          disableEndScreen: true
        },
        is_chatting: false,
        isLoggingOut: false
      }
    }));

    expect(result).toEqual(true);
  });

  test('when chat is online', () => {
    result = selectors.getShowOfflineChat(getModifiedState({
      chat: {
        forcedStatus: 'online',
        rating: {
          disableEndScreen: true
        },
        isChatting: false,
        isLoggingOut: false
      }
    }));

    expect(result).toEqual(false);
  });

  test('when is chatting', () => {
    result = selectors.getShowOfflineChat(getModifiedState({
      chat: {
        forcedStatus: 'offline',
        is_chatting: true,
        rating: {
          disableEndScreen: true
        },
        isLoggingOut: 'false'
      }
    }));

    expect(result).toEqual(false);
  });

  test('when should show rating screen', () => {
    result = selectors.getShowOfflineChat(getModifiedState({
      chat: {
        forcedStatus: 'online',
        isLoggingOut: false,
        is_chatting: false
      }
    }));

    expect(result).toEqual(false);
  });

  test('when is logging out', () => {
    result = selectors.getShowOfflineChat(getModifiedState({
      chat: {
        forcedStatus: 'offline',
        isLoggingOut: true,
        rating: {
          disableEndScreen: true
        },
        is_chatting: false
      }
    }));

    expect(result).toEqual(false);
  });
});

describe('getChatBanned', () => {
  it('returns the expected value', () => {
    const result = selectors.getChatBanned(getModifiedState({
      chat: {
        vendor: {
          zChat: {
            isBanned: () => 'blarg'
          }
        }
      }
    }));

    expect(result).toEqual('blarg');
  });
});

describe('getConnectionClosedReason', () => {
  it('returns the expected value', () => {
    const result = selectors.getConnectionClosedReason(getModifiedState({
      chat: {
        vendor: {
          zChat: {
            getConnectionClosedReason: () => 'helloPersonReadingThis'
          }
        }
      }
    }));

    expect(result).toEqual('helloPersonReadingThis');
  });
});

describe('hasUnseenAgentMessage', () => {
  // TODO when the selectors have been split
});
