import onAgentLeave from '../onAgentLeave';
import * as chatReselectors from 'src/redux/modules/chat/chat-selectors/reselectors';
import * as chatSelectors from 'src/redux/modules/chat/chat-selectors/selectors';
import * as chatActions from 'src/redux/modules/chat/chat-actions/actions';
import {
  SDK_CHAT_MEMBER_LEAVE,
  CHAT_AGENT_INACTIVE,
} from 'src/redux/modules/chat/chat-action-types';

const setupMocks = (chatOnline = false, activeAgents = {}) => {
  const dispatchSpy = jest.fn();

  jest.spyOn(chatActions, 'endChat');
  jest.spyOn(chatSelectors, 'getChatOnline').mockImplementation(() => {
    return chatOnline;
  });
  jest.spyOn(chatReselectors, 'getActiveAgents').mockImplementation(() => {
    return activeAgents;
  });

  return { dispatchSpy };
};

describe("when it's not a member leave event", () => {
  it('does not any dispatch anything', () => {
    const { dispatchSpy } = setupMocks();

    onAgentLeave(null, null, { type: 'yolo' }, dispatchSpy);

    expect(dispatchSpy)
      .not
      .toHaveBeenCalled();
  });
});

describe("when it's not an agent leaving", () => {
  it('does not any dispatch anything', () => {
    const { dispatchSpy } = setupMocks();

    onAgentLeave({}, {}, { type: 'yolo', payload: { detail: { nick: 'blerg' } } }, dispatchSpy);

    expect(dispatchSpy)
      .not
      .toHaveBeenCalled();
  });
});

describe('when there are agents left', () => {
  it('dispatches CHAT_AGENT_INACTIVE action', () => {
    const { dispatchSpy } = setupMocks(true, {
      'agent:john': 'yolo'
    });

    onAgentLeave({}, {}, {
      type: SDK_CHAT_MEMBER_LEAVE,
      payload: {
        detail: {
          nick: 'agent:john'
        }
      }
    }, dispatchSpy);

    expect(dispatchSpy)
      .toHaveBeenCalledWith({
        type: CHAT_AGENT_INACTIVE,
        payload: 'yolo'
      });
    expect(chatActions.endChat)
      .not
      .toHaveBeenCalled();
  });
});

describe('when there are no agents left', () => {
  describe('when chat is offline', () => {
    it('ends the chat session', () => {
      const { dispatchSpy } = setupMocks(false, {});

      onAgentLeave({}, {}, {
        type: SDK_CHAT_MEMBER_LEAVE,
        payload: {
          detail: {
            nick: 'agent:john'
          }
        }
      }, dispatchSpy);

      expect(chatActions.endChat)
        .toHaveBeenCalled();
    });
  });
});
