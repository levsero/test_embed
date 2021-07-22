import { CONNECTION_CLOSED_REASON, SDK_ACTION_TYPE_PREFIX } from 'constants/chat'
import { CHAT_DEPARTMENT_STATUS_EVENT, CHAT_STATUS_EVENT, CHAT_ENDED_EVENT } from 'constants/event'
import { registerCallback } from 'service/api/callbacks'
import { chatBanned } from 'src/redux/modules/chat'
import firehoseListener from '../firehoseListener'

describe('firehoseListener', () => {
  let zChat,
    dispatch,
    listener,
    departmentCallback,
    statusCallback,
    endChatCallback,
    getReduxState,
    mockHasBackfillCompleted

  beforeEach(() => {
    dispatch = jest.fn()
    getReduxState = () => ({ chat: { chatLogBackfillCompleted: mockHasBackfillCompleted } })
    departmentCallback = jest.fn()
    statusCallback = jest.fn()
    endChatCallback = jest.fn()
    zChat = {
      getConnectionClosedReason: jest.fn(),
    }
    listener = firehoseListener(zChat, dispatch, getReduxState)
    registerCallback(departmentCallback, CHAT_DEPARTMENT_STATUS_EVENT)
    registerCallback(statusCallback, CHAT_STATUS_EVENT)
    registerCallback(endChatCallback, CHAT_ENDED_EVENT)
  })

  it('dispatches an history action when data.type is history', () => {
    const data = {
      type: 'history',
      detail: {
        type: 'fetch_history',
      },
    }

    listener(data)

    expect(dispatch).toHaveBeenCalledWith({
      type: `${SDK_ACTION_TYPE_PREFIX}/history/${data.detail.type}`,
      payload: data,
    })
  })

  it("uses the detail type when it it exists and isn't a history type", () => {
    const data = {
      type: 'not history',
      detail: {
        type: 'fetch_history',
      },
    }

    listener(data)

    expect(dispatch).toHaveBeenCalledWith({
      type: `${SDK_ACTION_TYPE_PREFIX}/${data.detail.type}`,
      payload: data,
    })
  })

  it("uses the data type when the detail type does not exist and isn't a history type", () => {
    const data = {
      type: 'not history',
      detail: {
        type: null,
      },
    }

    listener(data)

    expect(dispatch).toHaveBeenCalledWith({
      type: `${SDK_ACTION_TYPE_PREFIX}/${data.type}`,
      payload: data,
    })
  })

  it('sets the detail timestamp to now if it does not exist for chat types', () => {
    Date.now = jest.fn(() => 123)
    const data = {
      type: 'chat',
      detail: {},
    }
    const expectedAction = {
      type: `${SDK_ACTION_TYPE_PREFIX}/${data.type}`,
      payload: {
        type: 'chat',
        detail: {
          timestamp: Date.now(),
        },
        isLastChatRatingEnabled: false,
      },
    }

    listener(data)

    expect(dispatch).toHaveBeenCalledWith(expectedAction)
  })

  it('sets the payload timestamp to now when the type is not "chat"', () => {
    Date.now = jest.fn(() => 123)
    const data = {
      type: 'visitor_update',
      detail: {},
    }

    const expectedAction = {
      type: `${SDK_ACTION_TYPE_PREFIX}/${data.type}`,
      payload: {
        type: 'visitor_update',
        timestamp: Date.now(),
        detail: {},
        isLastChatRatingEnabled: false,
      },
    }

    listener(data)

    expect(dispatch).toHaveBeenCalledWith(expectedAction)
  })

  it('does not change the detail timestamp for chat types if it exists', () => {
    Date.now = jest.fn(() => 123)
    const data = {
      type: 'chat',
      detail: {
        timestamp: 321,
      },
    }

    listener(data)

    expect(dispatch).toHaveBeenCalledWith({
      type: `${SDK_ACTION_TYPE_PREFIX}/${data.type}`,
      payload: data,
    })
  })

  it('calls the registered callbacks when a type is a department update', () => {
    expect(departmentCallback).not.toHaveBeenCalled()

    const data = {
      type: 'department_update',
      detail: {},
    }

    listener(data)

    expect(departmentCallback).toHaveBeenCalledWith(data.detail)
  })

  it('calls the registered callbacks when a type is a department update', () => {
    expect(statusCallback).not.toHaveBeenCalled()

    const data = {
      type: 'account_status',
      detail: {},
    }

    listener(data)

    expect(statusCallback).toHaveBeenCalled()
  })

  describe('when backfill has completed', () => {
    it('calls the end chat callbacks when the type is a visitor member leave', () => {
      mockHasBackfillCompleted = true
      const data = {
        type: 'chat.memberleave',
        detail: { nick: 'visitor' },
      }

      listener(data)

      expect(endChatCallback).toHaveBeenCalled()
    })
  })

  describe('when backfill has not completed', () => {
    it('does not call the end chat callbacks when the type is a visitor member leave', () => {
      mockHasBackfillCompleted = false
      const data = {
        type: 'chat.memberleave',
        detail: { nick: 'visitor' },
      }

      listener(data)

      expect(endChatCallback).not.toHaveBeenCalled()
    })
  })

  it('does not call the end chat callbacks when a type is an agent member leave', () => {
    const data = {
      type: 'chat.memberleave',
      detail: { nick: 'agent:124' },
    }

    listener(data)

    expect(endChatCallback).not.toHaveBeenCalled()
  })

  it('dispatches a chat banned action when the connection was closed due to being banned', () => {
    zChat.getConnectionClosedReason.mockReturnValue(CONNECTION_CLOSED_REASON.BANNED)

    const data = {
      type: 'connection_update',
      detail: 'closed',
    }

    listener(data)

    expect(dispatch).toHaveBeenCalledWith(chatBanned())
  })

  it('does not dispatch a chat banned action when the connection was closed but not banned', () => {
    zChat.getConnectionClosedReason.mockReturnValue(CONNECTION_CLOSED_REASON.UNKNOWN)

    const data = {
      type: 'connection_update',
      detail: 'closed',
    }

    listener(data)

    expect(dispatch).not.toHaveBeenCalledWith(chatBanned())
  })
})
