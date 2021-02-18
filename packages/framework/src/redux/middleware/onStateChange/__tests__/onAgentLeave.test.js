import onAgentLeave from '../onAgentLeave'
import * as chatReselectors from 'src/redux/modules/chat/chat-selectors/reselectors'
import * as chatSelectors from 'src/redux/modules/chat/chat-selectors/selectors'
import * as chatActions from 'src/redux/modules/chat/chat-actions/actions'
import {
  SDK_CHAT_MEMBER_LEAVE,
  CHAT_AGENT_INACTIVE,
} from 'src/redux/modules/chat/chat-action-types'

const setupMocks = (chatOnline = false, activeAgents = {}, chatStatus = 'offline') => {
  const dispatchSpy = jest.fn()

  jest.spyOn(chatActions, 'endChat')
  jest.spyOn(chatSelectors, 'getChatOnline').mockReturnValue(chatOnline)
  jest.spyOn(chatReselectors, 'getActiveAgents').mockReturnValue(activeAgents)
  jest.spyOn(chatSelectors, 'getChatStatus').mockReturnValue(chatStatus)
  jest.spyOn(chatReselectors, 'getActiveAgentCount').mockImplementation(() => {
    return Object.keys(activeAgents).length
  })

  return dispatchSpy
}

const memberLeaveAction = {
  type: SDK_CHAT_MEMBER_LEAVE,
  payload: {
    detail: {
      nick: 'agent:john',
    },
  },
}

describe('when the Chat SDK is not ready', () => {
  it('returns early without doing anything', () => {
    const dispatchSpy = setupMocks(false, {}, '')

    onAgentLeave({}, {}, memberLeaveAction, dispatchSpy)

    expect(dispatchSpy).not.toHaveBeenCalled()
  })
})

describe("when it's not a member leave event", () => {
  it('does not any dispatch anything', () => {
    const dispatchSpy = setupMocks()

    onAgentLeave(null, null, { type: 'yolo' }, dispatchSpy)

    expect(dispatchSpy).not.toHaveBeenCalled()
  })
})

describe("when it's not an agent leaving", () => {
  it('does not any dispatch anything', () => {
    const dispatchSpy = setupMocks()

    onAgentLeave({}, {}, { type: 'yolo', payload: { detail: { nick: 'blerg' } } }, dispatchSpy)

    expect(dispatchSpy).not.toHaveBeenCalled()
  })
})

describe('when there are agents left', () => {
  it('dispatches CHAT_AGENT_INACTIVE action', () => {
    const dispatchSpy = setupMocks(true, { 'agent:john': 'yolo' }, 'online')

    onAgentLeave({}, {}, memberLeaveAction, dispatchSpy)

    expect(dispatchSpy).toHaveBeenCalledWith({
      type: CHAT_AGENT_INACTIVE,
      payload: 'yolo',
    })
    expect(chatActions.endChat).not.toHaveBeenCalled()
  })
})

describe('when there are no agents left', () => {
  describe('when chat is offline', () => {
    it('ends the chat session', () => {
      const dispatchSpy = setupMocks(false, {})

      onAgentLeave({}, {}, memberLeaveAction, dispatchSpy)

      expect(chatActions.endChat).toHaveBeenCalled()
    })
  })
})
