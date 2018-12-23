import 'utility/i18nTestHelper';
import { render } from 'react-testing-library';
import React from 'react';

import createStore from 'src/redux/createStore';
import { Provider } from 'react-redux';

import { dispatchChatAccountSettings } from 'utility/testHelpers';
import { settings } from 'service/settings';

import ChatOnline from '../ChatOnline';

import * as chatActionTypes from 'src/redux/modules/chat/chat-action-types';
import { CHAT_MESSAGE_TYPES } from 'src/constants/chat';

jest.useFakeTimers();

let store;

beforeEach(() => {
  store = createStore();
  settings.init(store);
});

let counter = 0;

const timestamp = () => {
  counter += 1;
  return 1544788677868 + counter;
};

const renderComponent = () => {
  return render(
    <Provider store={store}>
      <ChatOnline
        getFrameContentDocument={() => {}}
        updateChatBackButtonVisibility={() => {}}
      />
    </Provider>
  );
};

describe('chat log', () => {
  const assertChatLog = (...actions) => {
    const { container } = renderComponent();

    actions.forEach((action) => {
      store.dispatch(action);
    });
    jest.runAllTimers();
    expect(container.querySelector('.chatLogContainer'))
      .toMatchSnapshot();
  };

  test('member join', () => {
    assertChatLog({
      type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
      payload: {
        type: 'chat',
        detail: {
          display_name: 'Visitor 123',
          nick: 'visitor',
          timestamp: timestamp(),
          type: 'chat.memberjoin'
        }
      }
    });
  });

  describe('visitor message', () => {
    describe('account settings login enabled', () => {
      beforeEach(() => {
        dispatchChatAccountSettings(store, {
          login: { enabled: true }
        });
      });

      test('displays update info if visitor info is not available', () => {
        assertChatLog({
          type: chatActionTypes.CHAT_MSG_REQUEST_SENT,
          payload: {
            status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_PENDING,
            timestamp: timestamp(),
            msg: 'Hi',
            nick: 'visitor',
            display_name: 'Visitor 123',
            type: 'chat.msg',
          }
        });
      });

      test('does not display update info if visitor email is already set', () => {
        assertChatLog({
          type: chatActionTypes.SDK_VISITOR_UPDATE,
          payload: {
            type: 'visitor_update',
            detail: {
              email: 'hello@me.com'
            }
          }
        }, {
          type: chatActionTypes.CHAT_MSG_REQUEST_SENT,
          payload: {
            status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_PENDING,
            timestamp: timestamp(),
            msg: 'Hi',
            nick: 'visitor',
            display_name: 'Visitor 123',
            type: 'chat.msg',
          }
        });
      });

      test('does not display update info if visitor name is already set', () => {
        assertChatLog({
          type: chatActionTypes.SDK_VISITOR_UPDATE,
          payload: {
            type: 'visitor_update',
            detail: {
              display_name: 'Jill'
            }
          }
        }, {
          type: chatActionTypes.CHAT_MSG_REQUEST_SENT,
          payload: {
            status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_PENDING,
            timestamp: timestamp(),
            msg: 'Hi',
            nick: 'visitor',
            display_name: 'Jill',
            type: 'chat.msg',
          }
        });
      });

      test('displays update info if visitor name is default', () => {
        assertChatLog({
          type: chatActionTypes.SDK_VISITOR_UPDATE,
          payload: {
            type: 'visitor_update',
            detail: {
              display_name: 'Visitor 123'
            }
          }
        }, {
          type: chatActionTypes.CHAT_MSG_REQUEST_SENT,
          payload: {
            status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_PENDING,
            timestamp: timestamp(),
            msg: 'Hi',
            nick: 'visitor',
            display_name: 'Visitor 123',
            type: 'chat.msg'
          }
        });
      });
    });

    test('request', () => {
      assertChatLog({
        type: chatActionTypes.CHAT_MSG_REQUEST_SENT,
        payload: {
          status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_PENDING,
          timestamp: timestamp(),
          msg: 'Hi',
          nick: 'visitor',
          display_name: 'Visitor 123',
          type: 'chat.msg',
        }
      });
    });

    test('success', () => {
      assertChatLog({
        type: chatActionTypes.CHAT_MSG_REQUEST_SUCCESS,
        payload: {
          status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_SUCCESS,
          timestamp: timestamp(),
          msg: 'Hi',
          nick: 'visitor',
          display_name: 'Visitor 123',
          type: 'chat.msg',
        }
      });
    });

    test('failure', () => {
      assertChatLog({
        type: chatActionTypes.CHAT_MSG_REQUEST_FAILURE,
        payload: {
          status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_FAILURE,
          timestamp: timestamp(),
          msg: 'Hi',
          nick: 'visitor',
          display_name: 'Visitor 123',
          type: 'chat.msg',
        }
      });
    });
  });

  test('queue position', () => {
    assertChatLog({
      type: chatActionTypes.SDK_CHAT_QUEUE_POSITION,
      payload: {
        type: 'chat',
        detail: {
          queue_position: 3,
          nick: 'system.queue',
          type: 'chat.queue_position'
        }
      }
    });
  });

  test('agent join', () => {
    assertChatLog({
      type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
      payload: {
        type: 'chat',
        detail: {
          display_name: 'Agent McAgent',
          nick: 'agent:123',
          timestamp: timestamp(),
          type: 'chat.memberjoin'
        }
      }
    });
  });

  test('agent attachment', () => {
    assertChatLog({
      type: chatActionTypes.SDK_CHAT_FILE,
      payload: {
        type: 'chat',
        detail: {
          display_name: 'Agent McAgent',
          nick: 'agent:123',
          timestamp: timestamp(),
          type: 'chat.file',
          attachment: {
            mime_type: 'image/png',
            name: 'pic.png',
            size: 23392,
            url: 'http://a.png',
            metadata: { width: 429, height: 723 }
          }
        }
      }
    });
  });

  test('agent typing', () => {
    assertChatLog(
      {
        type: chatActionTypes.SDK_AGENT_UPDATE,
        payload: {
          detail: {
            display_name: 'Mr F',
            nick: 'agent:456',
            title: 'Mistah J',
            type: 'agent_update'
          }
        }
      }, {
        type: chatActionTypes.SDK_CHAT_TYPING,
        payload: {
          type: 'chat',
          detail: {
            typing: true,
            nick: 'agent:456',
            type: 'typing'
          }
        }
      }
    );
  });

  test('agent stopped typing', () => {
    assertChatLog(
      {
        type: chatActionTypes.SDK_AGENT_UPDATE,
        payload: {
          detail: {
            display_name: 'Mr F',
            nick: 'agent:456',
            title: 'Mistah J',
            type: 'agent_update'
          }
        }
      }, {
        type: chatActionTypes.SDK_CHAT_TYPING,
        payload: {
          type: 'chat',
          detail: {
            typing: true,
            nick: 'agent:456',
            type: 'typing'
          }
        }
      }, {
        type: chatActionTypes.SDK_CHAT_TYPING,
        payload: {
          type: 'chat',
          detail: {
            typing: false,
            nick: 'agent:456',
            type: 'typing'
          }
        }
      }
    );
  });

  test('agent message', () => {
    assertChatLog({
      type: chatActionTypes.SDK_CHAT_MSG,
      payload: {
        type: 'chat',
        detail: {
          display_name: 'Random display name',
          msg: 'blah blah',
          nick: 'agent:123',
          options: [],
          timestamp: timestamp(),
          type: 'chat.msg'
        }
      }
    });
  });

  test('rating', () => {
    assertChatLog({
      type: chatActionTypes.SDK_CHAT_RATING,
      payload: {
        type: 'chat',
        detail: {
          rating: undefined,
          display_name: 'Visitor 123456',
          nick: 'visitor',
          timestamp: timestamp(),
          type: 'chat.rating',
          new_rating: 'good'
        }
      }
    });
  });

  test('comment', () => {
    assertChatLog({
      type: chatActionTypes.SDK_CHAT_COMMENT,
      payload: {
        type: 'chat',
        detail: {
          comment: undefined,
          display_name: 'Visitor 123456',
          new_comment: 'asdf',
          nick: 'visitor',
          timestamp: timestamp(),
          type: 'chat.comment'
        }
      }
    });
  });

  test('member leave', () => {
    assertChatLog({
      type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
      payload: {
        type: 'chat',
        detail: {
          display_name: 'Mugen',
          nick: 'agent:123',
          timestamp: timestamp(),
          type: 'chat.memberjoin'
        }
      }
    }, {
      type: chatActionTypes.SDK_CHAT_MEMBER_LEAVE,
      payload: {
        type: 'chat',
        detail: {
          display_name: 'Mugen',
          nick: 'agent:123',
          timestamp: timestamp(),
          type: 'chat.memberleave'
        }
      }
    });
  });

  test('series of actions', () => {
    assertChatLog(
      {
        type: chatActionTypes.SDK_VISITOR_UPDATE,
        payload: {
          type: 'visitor_update',
          detail: {
            display_name: 'Spike',
            email: ''
          }
        }
      }, {
        type: chatActionTypes.SDK_CONNECTION_UPDATE,
        payload: {
          type: 'connection_update',
          detail: 'connected'
        }
      }, {
        type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
        payload: {
          type: 'chat',
          detail: {
            display_name: 'Spike',
            nick: 'visitor',
            timestamp: timestamp(),
            type: 'chat.memberjoin'
          }
        }
      }, {
        type: chatActionTypes.CHAT_MSG_REQUEST_SENT,
        payload: {
          status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_PENDING,
          timestamp: timestamp(),
          msg: 'Hi',
          nick: 'visitor',
          display_name: 'Spike',
          type: 'chat.msg',
        }
      }, {
        type: chatActionTypes.CHAT_MSG_REQUEST_SUCCESS,
        payload: {
          status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_SUCCESS,
          timestamp: timestamp() - 1,
          msg: 'Hi',
          nick: 'visitor',
          display_name: 'Spike',
          type: 'chat.msg',
        }
      }, {
        type: chatActionTypes.SDK_CHAT_QUEUE_POSITION,
        payload: {
          type: 'chat',
          detail: {
            queue_position: 1,
            nick: 'system.queue',
            type: 'chat.queue_position'
          }
        }
      }, {
        type: chatActionTypes.SDK_CHAT_QUEUE_POSITION,
        payload: {
          type: 'chat',
          detail: {
            queue_position: 0,
            nick: 'system.queue',
            type: 'chat.queue_position'
          }
        }
      }, {
        type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
        payload: {
          type: 'chat',
          detail: {
            display_name: 'Jet',
            nick: 'agent:4567',
            timestamp: timestamp(),
            type: 'chat.memberjoin'
          }
        }
      }, {
        type: chatActionTypes.SDK_AGENT_UPDATE,
        payload: {
          detail: {
            display_name: 'Jet',
            nick: 'agent:4567',
            title: 'Black',
            type: 'agent_update'
          }
        }
      }, {
        type: chatActionTypes.SDK_CHAT_FILE,
        payload: {
          type: 'chat',
          detail: {
            display_name: 'Jet',
            nick: 'agent:4567',
            timestamp: timestamp(),
            type: 'chat.file',
            attachment: {
              mime_type: 'image/png',
              name: 'pic.png',
              size: 23392,
              url: 'http://a.png',
              metadata: { width: 429, height: 723 }
            }
          }
        }
      }, {
        type: chatActionTypes.SDK_CHAT_MSG,
        payload: {
          type: 'chat',
          detail: {
            display_name: 'Jet',
            msg: 'blah blah',
            nick: 'agent:4567',
            options: [],
            timestamp: timestamp(),
            type: 'chat.msg'
          }
        }
      }, {
        type: chatActionTypes.SDK_CHAT_RATING,
        payload: {
          type: 'chat',
          detail: {
            rating: undefined,
            display_name: 'Spike',
            nick: 'visitor',
            timestamp: timestamp(),
            type: 'chat.rating',
            new_rating: 'good'
          }
        }
      }, {
        type: chatActionTypes.SDK_CHAT_MEMBER_LEAVE,
        payload: {
          type: 'chat',
          detail: {
            display_name: 'Jet',
            nick: 'agent:4567',
            timestamp: timestamp(),
            type: 'chat.memberleave'
          }
        }
      });
  });
});

test('update chat header', () => {
  const { getByTestId } = renderComponent();

  store.dispatch({
    type: chatActionTypes.SDK_AGENT_UPDATE,
    payload: {
      detail: {
        display_name: 'Mr F',
        nick: 'agent:456',
        title: 'Mistah J',
        type: 'agent_update'
      }
    }
  });

  expect(getByTestId('header-text-container'))
    .toMatchSnapshot();
});

describe('rating', () => {
  it('does not show rating on agent join if rating settings are disabled', () => {
    dispatchChatAccountSettings(store, {
      rating: { enabled: false }
    });

    const { container } = renderComponent();

    store.dispatch({
      type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
      payload: {
        type: 'chat',
        detail: {
          display_name: 'Agent G',
          nick: 'agent:1234',
          timestamp: timestamp(),
          type: 'chat.memberjoin'
        }
      }
    });

    expect(container.querySelector('.Icon--thumbUp'))
      .not.toBeInTheDocument();

    expect(container.querySelector('.Icon--thumbDown'))
      .not.toBeInTheDocument();
  });

  it('shows rating on agent join if rating settings are enabled', () => {
    dispatchChatAccountSettings(store, {
      rating: { enabled: true }
    });

    const { container } = renderComponent();

    store.dispatch({
      type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
      payload: {
        type: 'chat',
        detail: {
          display_name: 'Agent G',
          nick: 'agent:1234',
          timestamp: timestamp(),
          type: 'chat.memberjoin'
        }
      }
    });

    expect(container.querySelector('.Icon--thumbUp'))
      .toBeInTheDocument();

    expect(container.querySelector('.Icon--thumbDown'))
      .toBeInTheDocument();
  });
});

test('connection closed', () => {
  const { getByText } = renderComponent();

  store.dispatch({
    type: chatActionTypes.SDK_CONNECTION_UPDATE,
    payload: {
      type: 'connection_update',
      detail: 'closed'
    }
  });

  expect(getByText('Click to reconnect'))
    .toBeInTheDocument();
});
