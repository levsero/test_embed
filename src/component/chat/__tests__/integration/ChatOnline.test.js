import { fireEvent } from '@testing-library/react'
import React from 'react'
import createStore from 'src/redux/createStore'
import { render, dispatchChatAccountSettings } from 'utility/testHelpers'
import { settings } from 'service/settings'
import ChatOnline from '../../ChatOnline'
import * as chatActionTypes from 'src/redux/modules/chat/chat-action-types'
import { CHAT_MESSAGE_TYPES } from 'src/constants/chat'
import { TEST_IDS } from 'src/constants/shared'
import * as screens from 'src/redux/modules/chat/chat-screen-types'
import * as actions from 'src/redux/modules/chat/chat-actions/actions'

jest.mock('service/transport/http')

jest.useFakeTimers()

let store

beforeEach(() => {
  store = createStore()
  settings.init(store)
})

let counter = 0

const timestamp = () => {
  counter += 1
  return 1544788677868 + counter
}

const renderComponent = () => {
  return render(<ChatOnline updateChatBackButtonVisibility={() => {}} />, { store })
}

describe('chat log', () => {
  const assertChatLog = (...actions) => {
    const { container } = renderComponent()

    actions.forEach(action => {
      store.dispatch(action)
    })
    jest.runAllTimers()
    expect(container.querySelector('.chatLogContainer')).toMatchSnapshot()
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
          type: 'chat.memberjoin'
        }
      }
    })
  })

  describe('visitor message', () => {
    describe('account settings login enabled', () => {
      beforeEach(() => {
        dispatchChatAccountSettings(store, {
          login: { enabled: true }
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
              type: 'chat.msg'
            }
          }
        })
      })

      test('does not display update info if visitor email is already set', () => {
        assertChatLog(
          {
            type: chatActionTypes.SDK_VISITOR_UPDATE,
            payload: {
              type: 'visitor_update',
              detail: {
                email: 'hello@me.com'
              }
            }
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
                type: 'chat.msg'
              }
            }
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
                display_name: 'Jill'
              }
            }
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
                type: 'chat.msg'
              }
            }
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
                display_name: 'Visitor 123'
              }
            }
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
                type: 'chat.msg'
              }
            }
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
              type: 'chat.msg'
            }
          }
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
              type: 'chat.msg'
            }
          }
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
              type: 'chat.msg'
            }
          }
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
              type: 'chat.msg'
            }
          }
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
          type: 'chat.queue_position'
        }
      }
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
          type: 'chat.memberjoin'
        }
      }
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
            metadata: { width: 429, height: 723 }
          }
        }
      }
    })
  })

  test('agent typing', () => {
    assertChatLog(
      {
        type: chatActionTypes.SDK_AGENT_UPDATE,
        payload: {
          detail: {
            timestamp: timestamp(),
            display_name: 'Mr F',
            nick: 'agent:456',
            title: 'Mistah J',
            type: 'agent_update'
          }
        }
      },
      {
        type: chatActionTypes.SDK_CHAT_TYPING,
        payload: {
          type: 'chat',
          detail: {
            timestamp: timestamp(),
            typing: true,
            nick: 'agent:456',
            type: 'typing'
          }
        }
      }
    )
  })

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
      },
      {
        type: chatActionTypes.SDK_CHAT_TYPING,
        payload: {
          type: 'chat',
          detail: {
            timestamp: timestamp(),
            typing: true,
            nick: 'agent:456',
            type: 'typing'
          }
        }
      },
      {
        type: chatActionTypes.SDK_CHAT_TYPING,
        payload: {
          type: 'chat',
          detail: {
            timestamp: timestamp(),
            typing: false,
            nick: 'agent:456',
            type: 'typing'
          }
        }
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
          type: 'chat.msg'
        }
      }
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
          new_rating: 'good'
        }
      }
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
          type: 'chat.comment'
        }
      }
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
            type: 'chat.memberjoin'
          }
        }
      },
      {
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
            type: 'chat.memberjoin'
          }
        }
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
            type: 'chat.memberleave'
          }
        }
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
            type: 'chat.memberjoin'
          }
        }
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
            type: 'chat.memberleave'
          }
        }
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
            email: ''
          }
        }
      },
      {
        type: chatActionTypes.SDK_CONNECTION_UPDATE,
        payload: {
          type: 'connection_update',
          detail: 'connected'
        }
      },
      {
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
            type: 'chat.msg'
          }
        }
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
            type: 'chat.msg'
          }
        }
      },
      {
        type: chatActionTypes.SDK_CHAT_QUEUE_POSITION,
        payload: {
          type: 'chat',
          detail: {
            timestamp: timestamp(),
            queue_position: 1,
            nick: 'system.queue',
            type: 'chat.queue_position'
          }
        }
      },
      {
        type: chatActionTypes.SDK_CHAT_QUEUE_POSITION,
        payload: {
          type: 'chat',
          detail: {
            timestamp: timestamp(),
            queue_position: 0,
            nick: 'system.queue',
            type: 'chat.queue_position'
          }
        }
      },
      {
        type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
        payload: {
          type: 'chat',
          detail: {
            timestamp: timestamp(),
            display_name: 'Jet',
            nick: 'agent:4567',
            type: 'chat.memberjoin'
          }
        }
      },
      {
        type: chatActionTypes.SDK_AGENT_UPDATE,
        payload: {
          detail: {
            display_name: 'Jet',
            nick: 'agent:4567',
            title: 'Black',
            type: 'agent_update'
          }
        }
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
              metadata: { width: 429, height: 723 }
            }
          }
        }
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
            type: 'chat.msg'
          }
        }
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
            new_rating: 'good'
          }
        }
      },
      {
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
      }
    )
  })
})

test('update chat header', () => {
  const { getByTestId } = renderComponent()

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
  })

  expect(getByTestId(TEST_IDS.CHAT_HEADER_TEXT_CONTAINER)).toMatchSnapshot()
})

describe('rating', () => {
  it('does not show rating on agent join if rating settings are disabled', () => {
    dispatchChatAccountSettings(store, {
      rating: { enabled: false }
    })

    const { container } = renderComponent()

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
    })

    expect(container.querySelector('.Icon--thumbUp')).not.toBeInTheDocument()

    expect(container.querySelector('.Icon--thumbDown')).not.toBeInTheDocument()
  })

  it('shows rating on agent join if rating settings are enabled', () => {
    dispatchChatAccountSettings(store, {
      rating: { enabled: true }
    })

    const { container } = renderComponent()

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
    })

    expect(container.querySelector('.Icon--thumbUp')).toBeInTheDocument()

    expect(container.querySelector('.Icon--thumbDown')).toBeInTheDocument()
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
          type: 'chat.memberjoin'
        }
      }
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
      enabled: true
    }
  })

  const { getByTestId, getByText } = renderComponent()

  fireEvent.click(getByTestId(TEST_IDS.CHAT_MENU))
  fireEvent.click(getByText('Edit contact details'))
  jest.runAllTimers()

  const editContactDetailsPopoutNode = getByTestId(TEST_IDS.CHAT_EDIT_CONTACT_DETAILS_POPUP)

  expect(editContactDetailsPopoutNode).toBeInTheDocument()
})

describe('connection', () => {
  it('shows "Click to reconnect" if the connection is closed', () => {
    const { getByText } = renderComponent()

    store.dispatch({
      type: chatActionTypes.SDK_CONNECTION_UPDATE,
      payload: {
        type: 'connection_update',
        detail: 'closed'
      }
    })

    expect(getByText('Click to reconnect')).toBeInTheDocument()
  })

  it('shows "Reconnecting..." if the connection is connecting', () => {
    const { getByText } = renderComponent()

    store.dispatch({
      type: chatActionTypes.SDK_CONNECTION_UPDATE,
      payload: {
        type: 'connection_update',
        detail: 'connecting'
      }
    })

    expect(getByText('Reconnecting...')).toBeInTheDocument()
  })
})

describe('prechat form', () => {
  const zChat = {
    setVisitorDefaultDepartment: jest.fn(),
    setVisitorInfo: jest.fn(),
    sendOfflineMsg: jest.fn(),
    sendTyping: jest.fn(),
    sendChatMsg: jest.fn(),
    clearVisitorDefaultDepartment: jest.fn()
  }

  beforeEach(() => {
    store.dispatch({
      type: chatActionTypes.CHAT_VENDOR_LOADED,
      payload: { zChat }
    })
    store.dispatch(actions.updateChatScreen(screens.PRECHAT_SCREEN))
    dispatchChatAccountSettings(store, {
      forms: {
        pre_chat_form: {
          required: true,
          profile_required: false,
          message: 'test',
          form: {
            '0': {
              name: 'name',
              required: false
            },
            '1': {
              name: 'email',
              required: false
            },
            '2': {
              label: 'Department',
              name: 'department',
              required: false,
              type: 'department'
            },
            '3': {
              label: null,
              name: 'message',
              required: false,
              type: 'textarea'
            },
            '4': {
              label: 'Phone',
              name: 'phone',
              required: false,
              type: 'text'
            }
          }
        }
      }
    })
  })

  it('submits the prechat form', () => {
    store.dispatch({
      type: chatActionTypes.SDK_DEPARTMENT_UPDATE,
      payload: {
        detail: {
          name: 'eight',
          status: 'online',
          id: 1
        }
      }
    })
    const { container, getByLabelText, getByText, queryByText, queryByTestId } = renderComponent()
    fireEvent.change(getByLabelText('Message (optional)'), { target: { value: 'burger' } })
    fireEvent.change(getByLabelText('Name (optional)'), { target: { value: 'Bruised Wayne' } })
    fireEvent.change(getByLabelText('Email (optional)'), { target: { value: 'bat@man.com' } })
    fireEvent.click(container.querySelector('[data-garden-id="dropdowns.select"]'))
    fireEvent.click(getByText('eight'))
    jest.runAllTimers()
    fireEvent.click(getByText('Start chat'))
    expect(zChat.setVisitorInfo).toHaveBeenCalledWith(
      {
        display_name: 'Bruised Wayne',
        email: 'bat@man.com',
        phone: ''
      },
      expect.any(Function)
    )
    store.dispatch({
      type: chatActionTypes.SDK_VISITOR_UPDATE,
      payload: {
        detail: {
          display_name: 'Bruised Wayne',
          email: 'bat@man.com'
        }
      }
    })
    expect(zChat.setVisitorDefaultDepartment).toHaveBeenCalledWith(1, expect.any(Function))
    // The new screen is now chatting screen
    expect(queryByText('Live Support')).toBeInTheDocument()
    jest.runAllTimers()
    expect(zChat.sendTyping).toHaveBeenCalledWith(false)
    expect(zChat.sendChatMsg).toHaveBeenCalledWith('burger', expect.any(Function))
    store.dispatch({
      type: chatActionTypes.SDK_CHAT_MEMBER_JOIN,
      payload: {
        detail: {
          nick: 'visitor',
          type: 'chat.memberjoin',
          display_name: 'Bruised Wayne',
          timestamp: 12345
        }
      }
    })
    expect(queryByTestId('chat-msg-user').textContent).toEqual('burger')
  })

  it('clears the department if no department is selected', () => {
    store.dispatch({
      type: chatActionTypes.SDK_DEPARTMENT_UPDATE,
      payload: {
        detail: {
          name: 'eight',
          status: 'online',
          id: 1
        }
      }
    })
    const { getByText, queryByText } = renderComponent()
    jest.runAllTimers()
    fireEvent.click(getByText('Start chat'))
    jest.runAllTimers()
    expect(zChat.setVisitorInfo).not.toHaveBeenCalled()
    expect(zChat.clearVisitorDefaultDepartment).toHaveBeenCalled()
    expect(zChat.sendChatMsg).not.toHaveBeenCalled()
    expect(queryByText('Live Support')).toBeInTheDocument()
  })

  it('submits offline message if offline department is selected', () => {
    store.dispatch({
      type: chatActionTypes.SDK_DEPARTMENT_UPDATE,
      payload: {
        detail: {
          name: 'nine',
          status: 'offline',
          id: 1
        }
      }
    })
    const { container, getByLabelText, getByText } = renderComponent()
    fireEvent.change(getByLabelText('Message (optional)'), { target: { value: 'my offline msg' } })
    fireEvent.change(getByLabelText('Name (optional)'), { target: { value: 'Bruised Wayne' } })
    fireEvent.change(getByLabelText('Email (optional)'), { target: { value: 'bat@man.com' } })
    fireEvent.click(container.querySelector('[data-garden-id="dropdowns.select"]'))
    fireEvent.click(getByText('nine (offline)'))
    jest.runAllTimers()
    fireEvent.click(getByText('Send message'))
    expect(zChat.sendOfflineMsg).toHaveBeenCalledWith(
      {
        '': '', // the submit button serializes to an empty prop
        department: 1,
        email: 'bat@man.com',
        message: 'my offline msg',
        name: 'Bruised Wayne'
      },
      expect.any(Function)
    )
  })
})
