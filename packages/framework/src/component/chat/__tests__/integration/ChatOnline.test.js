import { fireEvent } from '@testing-library/react'
import React from 'react'
import createStore from 'src/redux/createStore'
import { render, dispatchChatAccountSettings } from 'utility/testHelpers'
import { settings } from 'service/settings'
import ChatOnline from '../../ChatOnline'
import * as chatActionTypes from 'src/redux/modules/chat/chat-action-types'
import { CHAT_MESSAGE_TYPES } from 'src/constants/chat'
import { TEST_IDS } from 'src/constants/shared'
import { handleChatSDKInitialized, handleChatConnected } from 'src/service/api/zopimApi/callbacks'

jest.mock('service/transport/http')
jest.mock('embeds/chat/components/ImageMessage', () => () => <div>ImageMessage</div>)

jest.useFakeTimers()

const updateChatBackButtonVisibility = jest.fn()

let store

beforeEach(() => {
  store = createStore()
  settings.init(store)
  handleChatSDKInitialized()
  handleChatConnected()
})

let counter = 0

const timestamp = () => {
  counter += 1
  return 1544788677868 + counter
}

const renderComponent = (props) => {
  const mergedProps = {
    updateChatBackButtonVisibility,
    ...props,
  }

  return render(<ChatOnline {...mergedProps} />, { store })
}

describe('chat log', () => {
  const assertChatLog = (...actions) => {
    const { queryByTestId } = renderComponent()

    actions.forEach((action) => {
      store.dispatch(action)
    })
    jest.runAllTimers()

    expect(queryByTestId(TEST_IDS.CHAT_LOG)).toMatchSnapshot()
  }

  test('member join', () => {
    assertChatLog({
      type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
      payload: {
        type: 'chat',
        detail: {
          display_name: 'Visitor 123',
          nick: 'visitor',
          timestamp: timestamp(),
          type: 'chat.memberjoin',
        },
      },
    })
  })

  describe('visitor message', () => {
    describe('account settings login enabled', () => {
      beforeEach(() => {
        dispatchChatAccountSettings(store, {
          login: { enabled: true },
        })
      })

      test('displays update info if visitor info is not available', () => {
        assertChatLog({
          type: chatActionTypes.CHAT_MSG_REQUEST_SENT,
          payload: {
            status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_PENDING,
            detail: {
              timestamp: timestamp(),
              msg: 'Hi',
              nick: 'visitor',
              display_name: 'Visitor 123',
              type: 'chat.msg',
            },
          },
        })
      })

      test('does not display update info if visitor email is already set', () => {
        assertChatLog(
          {
            type: chatActionTypes.SDK_VISITOR_UPDATE,
            payload: {
              type: 'visitor_update',
              detail: {
                email: 'hello@me.com',
              },
            },
          },
          {
            type: chatActionTypes.CHAT_MSG_REQUEST_SENT,
            payload: {
              status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_PENDING,
              detail: {
                timestamp: timestamp(),
                msg: 'Hi',
                nick: 'visitor',
                display_name: 'Visitor 123',
                type: 'chat.msg',
              },
            },
          }
        )
      })

      test('does not display update info if visitor name is already set', () => {
        assertChatLog(
          {
            type: chatActionTypes.SDK_VISITOR_UPDATE,
            payload: {
              type: 'visitor_update',
              detail: {
                display_name: 'Jill',
              },
            },
          },
          {
            type: chatActionTypes.CHAT_MSG_REQUEST_SENT,
            payload: {
              status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_PENDING,
              detail: {
                timestamp: timestamp(),
                msg: 'Hi',
                nick: 'visitor',
                display_name: 'Jill',
                type: 'chat.msg',
              },
            },
          }
        )
      })

      test('displays update info if visitor name is default', () => {
        assertChatLog(
          {
            type: chatActionTypes.SDK_VISITOR_UPDATE,
            payload: {
              type: 'visitor_update',
              detail: {
                display_name: 'Visitor 123',
              },
            },
          },
          {
            type: chatActionTypes.CHAT_MSG_REQUEST_SENT,
            payload: {
              status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_PENDING,
              detail: {
                timestamp: timestamp(),
                msg: 'Hi',
                nick: 'visitor',
                display_name: 'Visitor 123',
                type: 'chat.msg',
              },
            },
          }
        )
      })
    })

    test('success', () => {
      const time = timestamp()

      assertChatLog(
        {
          type: chatActionTypes.CHAT_MSG_REQUEST_SENT,
          payload: {
            status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_PENDING,
            detail: {
              timestamp: time,
              msg: 'Hi',
              nick: 'visitor',
              display_name: 'Visitor 123',
              type: 'chat.msg',
            },
          },
        },
        {
          type: chatActionTypes.CHAT_MSG_REQUEST_SUCCESS,
          payload: {
            status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_SUCCESS,
            detail: {
              timestamp: time,
              msg: 'Hi',
              nick: 'visitor',
              display_name: 'Visitor 123',
              type: 'chat.msg',
            },
          },
        }
      )
    })

    test('failure', () => {
      const time = timestamp()

      assertChatLog(
        {
          type: chatActionTypes.CHAT_MSG_REQUEST_SENT,
          payload: {
            status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_PENDING,
            detail: {
              timestamp: time,
              msg: 'Hi',
              nick: 'visitor',
              display_name: 'Visitor 123',
              type: 'chat.msg',
            },
          },
        },
        {
          type: chatActionTypes.CHAT_MSG_REQUEST_FAILURE,
          payload: {
            status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_FAILURE,
            detail: {
              timestamp: time,
              msg: 'Hi',
              nick: 'visitor',
              display_name: 'Visitor 123',
              type: 'chat.msg',
            },
          },
        }
      )
    })
  })

  test('queue position', () => {
    assertChatLog({
      type: chatActionTypes.SDK_CHAT_QUEUE_POSITION,
      payload: {
        type: 'chat',
        detail: {
          timestamp: timestamp(),
          queue_position: 3,
          nick: 'system.queue',
          type: 'chat.queue_position',
        },
      },
    })
  })

  test('agent join', () => {
    assertChatLog({
      type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
      payload: {
        type: 'chat',
        detail: {
          display_name: 'Agent McAgent',
          nick: 'agent:123',
          timestamp: timestamp(),
          type: 'chat.memberjoin',
        },
      },
    })
  })

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
            metadata: { width: 429, height: 723 },
          },
        },
      },
    })
  })

  test('agent typing', () => {
    assertChatLog(
      {
        type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
        payload: {
          detail: {
            display_name: 'Mr F',
            nick: 'agent:456',
            timestamp: timestamp(),
            type: 'chat.memberjoin',
          },
        },
      },
      {
        type: chatActionTypes.SDK_AGENT_UPDATE,
        payload: {
          detail: {
            timestamp: timestamp(),
            display_name: 'Mr F',
            nick: 'agent:456',
            title: 'Mistah J',
            type: 'agent_update',
          },
        },
      },
      {
        type: chatActionTypes.SDK_CHAT_TYPING,
        payload: {
          type: 'chat',
          detail: {
            timestamp: timestamp(),
            typing: true,
            nick: 'agent:456',
            type: 'typing',
          },
        },
      }
    )
  })

  test('agent stopped typing', () => {
    assertChatLog(
      {
        type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
        payload: {
          detail: {
            display_name: 'Mr F',
            nick: 'agent:456',
            timestamp: timestamp(),
            type: 'chat.memberjoin',
          },
        },
      },
      {
        type: chatActionTypes.SDK_AGENT_UPDATE,
        payload: {
          detail: {
            display_name: 'Mr F',
            nick: 'agent:456',
            title: 'Mistah J',
            type: 'agent_update',
          },
        },
      },
      {
        type: chatActionTypes.SDK_CHAT_TYPING,
        payload: {
          type: 'chat',
          detail: {
            timestamp: timestamp(),
            typing: true,
            nick: 'agent:456',
            type: 'typing',
          },
        },
      },
      {
        type: chatActionTypes.SDK_CHAT_TYPING,
        payload: {
          type: 'chat',
          detail: {
            timestamp: timestamp(),
            typing: false,
            nick: 'agent:456',
            type: 'typing',
          },
        },
      }
    )
  })

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
          type: 'chat.msg',
        },
      },
    })
  })

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
          new_rating: 'good',
        },
      },
    })
  })

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
          type: 'chat.comment',
        },
      },
    })
  })

  test('member leave', () => {
    assertChatLog(
      {
        type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
        payload: {
          type: 'chat',
          detail: {
            display_name: 'Mugen',
            nick: 'agent:123',
            timestamp: timestamp(),
            type: 'chat.memberjoin',
          },
        },
      },
      {
        type: chatActionTypes.SDK_CHAT_MEMBER_LEAVE,
        payload: {
          type: 'chat',
          detail: {
            display_name: 'Mugen',
            nick: 'agent:123',
            timestamp: timestamp(),
            type: 'chat.memberleave',
          },
        },
      }
    )
  })

  test('agent member leave with disconnection reason', () => {
    assertChatLog(
      {
        type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
        payload: {
          type: 'chat',
          detail: {
            display_name: 'Mugen',
            nick: 'agent:123',
            timestamp: timestamp(),
            type: 'chat.memberjoin',
          },
        },
      },
      {
        type: chatActionTypes.SDK_CHAT_MEMBER_LEAVE,
        payload: {
          type: 'chat',
          detail: {
            display_name: 'Mugen',
            nick: 'agent:123',
            reason: 'disconnect_user',
            timestamp: timestamp(),
            type: 'chat.memberleave',
          },
        },
      }
    )
  })

  test('agent member leave with non-disconnection reason', () => {
    assertChatLog(
      {
        type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
        payload: {
          type: 'chat',
          detail: {
            display_name: 'Mugen',
            nick: 'agent:123',
            timestamp: timestamp(),
            type: 'chat.memberjoin',
          },
        },
      },
      {
        type: chatActionTypes.SDK_CHAT_MEMBER_LEAVE,
        payload: {
          type: 'chat',
          detail: {
            display_name: 'Mugen',
            nick: 'agent:123',
            reason: 'arbitrary_unknown_reason',
            timestamp: timestamp(),
            type: 'chat.memberleave',
          },
        },
      }
    )
  })

  test('series of actions', () => {
    assertChatLog(
      {
        type: chatActionTypes.SDK_VISITOR_UPDATE,
        payload: {
          type: 'visitor_update',
          detail: {
            timestamp: timestamp(),
            display_name: 'Spike',
            email: '',
          },
        },
      },
      {
        type: chatActionTypes.SDK_CONNECTION_UPDATE,
        payload: {
          type: 'connection_update',
          detail: 'connected',
        },
      },
      {
        type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
        payload: {
          type: 'chat',
          detail: {
            display_name: 'Spike',
            nick: 'visitor',
            timestamp: timestamp(),
            type: 'chat.memberjoin',
          },
        },
      },
      {
        type: chatActionTypes.CHAT_MSG_REQUEST_SENT,
        payload: {
          status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_PENDING,
          detail: {
            timestamp: timestamp(),
            msg: 'Hi',
            nick: 'visitor',
            display_name: 'Spike',
            type: 'chat.msg',
          },
        },
      },
      {
        type: chatActionTypes.CHAT_MSG_REQUEST_SUCCESS,
        payload: {
          status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_SUCCESS,
          detail: {
            timestamp: timestamp() - 1,
            msg: 'Hi',
            nick: 'visitor',
            display_name: 'Spike',
            type: 'chat.msg',
          },
        },
      },
      {
        type: chatActionTypes.SDK_CHAT_QUEUE_POSITION,
        payload: {
          type: 'chat',
          detail: {
            timestamp: timestamp(),
            queue_position: 1,
            nick: 'system.queue',
            type: 'chat.queue_position',
          },
        },
      },
      {
        type: chatActionTypes.SDK_CHAT_QUEUE_POSITION,
        payload: {
          type: 'chat',
          detail: {
            timestamp: timestamp(),
            queue_position: 0,
            nick: 'system.queue',
            type: 'chat.queue_position',
          },
        },
      },
      {
        type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
        payload: {
          type: 'chat',
          detail: {
            timestamp: timestamp(),
            display_name: 'Jet',
            nick: 'agent:4567',
            type: 'chat.memberjoin',
          },
        },
      },
      {
        type: chatActionTypes.SDK_AGENT_UPDATE,
        payload: {
          detail: {
            display_name: 'Jet',
            nick: 'agent:4567',
            title: 'Black',
            type: 'agent_update',
          },
        },
      },
      {
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
              metadata: { width: 429, height: 723 },
            },
          },
        },
      },
      {
        type: chatActionTypes.SDK_CHAT_MSG,
        payload: {
          type: 'chat',
          detail: {
            display_name: 'Jet',
            msg: 'blah blah',
            nick: 'agent:4567',
            options: [],
            timestamp: timestamp(),
            type: 'chat.msg',
          },
        },
      },
      {
        type: chatActionTypes.SDK_CHAT_RATING,
        payload: {
          type: 'chat',
          detail: {
            rating: undefined,
            display_name: 'Spike',
            nick: 'visitor',
            timestamp: timestamp(),
            type: 'chat.rating',
            new_rating: 'good',
          },
        },
      },
      {
        type: chatActionTypes.SDK_CHAT_MEMBER_LEAVE,
        payload: {
          type: 'chat',
          detail: {
            display_name: 'Jet',
            nick: 'agent:4567',
            timestamp: timestamp(),
            type: 'chat.memberleave',
          },
        },
      }
    )
  })
})

test('update chat header', () => {
  const { getByTestId } = renderComponent()

  store.dispatch({
    type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
    payload: {
      detail: {
        display_name: 'Mr F',
        nick: 'agent:456',
        timestamp: timestamp(),
        type: 'chat.memberjoin',
      },
    },
  })
  store.dispatch({
    type: chatActionTypes.SDK_AGENT_UPDATE,
    payload: {
      detail: {
        display_name: 'Mr F',
        nick: 'agent:456',
        title: 'Mistah J',
        type: 'agent_update',
      },
    },
  })

  expect(getByTestId(TEST_IDS.CHAT_HEADER_TEXT_CONTAINER)).toMatchSnapshot()
})

describe('rating', () => {
  it('does not show rating on agent join if rating settings are disabled', () => {
    dispatchChatAccountSettings(store, {
      rating: { enabled: false },
    })

    const { queryByTestId } = renderComponent()

    store.dispatch({
      type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
      payload: {
        type: 'chat',
        detail: {
          display_name: 'Agent G',
          nick: 'agent:1234',
          timestamp: timestamp(),
          type: 'chat.memberjoin',
        },
      },
    })

    expect(queryByTestId(TEST_IDS.ICON_THUMB_UP)).not.toBeInTheDocument()
    expect(queryByTestId(TEST_IDS.ICON_THUMB_DOWN)).not.toBeInTheDocument()
  })

  it('shows rating on agent join if rating settings are enabled', () => {
    dispatchChatAccountSettings(store, {
      rating: { enabled: true },
    })

    const { queryByTestId } = renderComponent()

    store.dispatch({
      type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
      payload: {
        type: 'chat',
        detail: {
          display_name: 'Agent G',
          nick: 'agent:1234',
          timestamp: timestamp(),
          type: 'chat.memberjoin',
        },
      },
    })

    expect(queryByTestId(TEST_IDS.ICON_THUMB_UP)).toBeInTheDocument()
    expect(queryByTestId(TEST_IDS.ICON_THUMB_DOWN)).toBeInTheDocument()
  })
})

describe('end chat', () => {
  it('enables end chat icon when chatting', () => {
    const { getByTestId } = renderComponent()
    const endChatButtonNode = getByTestId(TEST_IDS.ICON_END_CHAT).closest('button')

    store.dispatch({
      type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
      payload: {
        type: 'chat',
        detail: {
          display_name: 'Visitor 123',
          nick: 'visitor',
          timestamp: timestamp(),
          type: 'chat.memberjoin',
        },
      },
    })

    expect(endChatButtonNode.classList).not.toEqual('iconDisabled')
  })

  it('disables end chat icon when not chatting', () => {
    const { getByTestId } = renderComponent()
    const endChatButtonNode = getByTestId(TEST_IDS.ICON_END_CHAT).closest('button')

    expect(endChatButtonNode.disabled).toBe(true)
  })
})

it('opens edit contact details popout', () => {
  store.dispatch({
    type: chatActionTypes.GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
    payload: {
      enabled: true,
    },
  })

  const { getByTestId, getByText } = renderComponent()

  fireEvent.click(getByTestId(TEST_IDS.CHAT_MENU))
  fireEvent.click(getByText('Edit contact details'))
  jest.runAllTimers()

  expect(getByTestId(TEST_IDS.CHAT_EDIT_CONTACT_DETAILS_MODAL)).toBeInTheDocument()
})

describe('connection', () => {
  it('shows "Click to reconnect" if the connection is closed', () => {
    const { getByText } = renderComponent()

    store.dispatch({
      type: chatActionTypes.SDK_CONNECTION_UPDATE,
      payload: {
        type: 'connection_update',
        detail: 'closed',
      },
    })

    expect(getByText('Click to reconnect')).toBeInTheDocument()
  })

  it('shows "Reconnecting..." if the connection is connecting', () => {
    const { getByText } = renderComponent()

    store.dispatch({
      type: chatActionTypes.SDK_CONNECTION_UPDATE,
      payload: {
        type: 'connection_update',
        detail: 'connecting',
      },
    })

    expect(getByText('Reconnecting...')).toBeInTheDocument()
  })
})
