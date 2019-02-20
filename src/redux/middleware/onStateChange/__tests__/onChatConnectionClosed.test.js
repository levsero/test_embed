import onChatConnectionClosed from '../onChatConnectionClosed';
import { CHAT_BANNED,
  SDK_CONNECTION_UPDATE } from '../../../modules/chat/chat-action-types';
import { CONNECTION_CLOSED_REASON } from 'src/constants/chat';
import * as chatReselectors from 'src/redux/modules/chat/chat-selectors/reselectors';

const getAction = (actionType = SDK_CONNECTION_UPDATE, inDetail = 'closed') => {
  return {
    type: actionType,
    payload: { detail:  inDetail }
  };
};

const dispatch = jest.fn();

describe('onChatConnectionClosed', () => {
  beforeEach(() => {
    jest.spyOn(chatReselectors, 'getConnectionClosedReason').mockReturnValue(CONNECTION_CLOSED_REASON.BANNED);
  });

  describe('when SDK_CONNECTION_UPDATE is "closed" and the user was banned', () => {
    beforeEach(() => {
      onChatConnectionClosed({}, {}, getAction(), dispatch);
    });

    it('dispatches CHAT_BANNED ', () => {
      expect(dispatch).toHaveBeenCalledWith({ type: CHAT_BANNED });
    });

    it('calls getConnectionClosedReason', () => {
      expect(chatReselectors.getConnectionClosedReason).toHaveBeenCalled();
    });
  });

  describe('when reason is not banned', () => {
    beforeEach(() => {
      jest.spyOn(chatReselectors, 'getConnectionClosedReason').mockReturnValue(CONNECTION_CLOSED_REASON.SERVER_ERROR);
      onChatConnectionClosed({}, {}, getAction(), dispatch);
    });

    it('does not dispatch', () => {
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('does call getConnectionClosedReason', () => {
      expect(chatReselectors.getConnectionClosedReason).toHaveBeenCalled();
    });
  });

  describe('when SDK_CONNECTION_UPDATE is not "closed"', () => {
    beforeEach(() => {
      onChatConnectionClosed({}, {}, getAction(SDK_CONNECTION_UPDATE, 'open'), dispatch);
    });

    it('does not dispatch', () => {
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('does not call getConnectionClosedReason', () => {
      expect(chatReselectors.getConnectionClosedReason).not.toHaveBeenCalled();
    });
  });

  describe('when action.type is not "SDK_CONNECTION_UPDATE"', () => {
    beforeEach(() => {
      onChatConnectionClosed({}, {}, getAction('boop'), getAction(), dispatch);
    });

    it('does not dispatch', () => {
      expect(dispatch).not.toHaveBeenCalled();
    });

    it('does not call getConnectionClosedReason', () => {
      expect(chatReselectors.getConnectionClosedReason).not.toHaveBeenCalled();
    });
  });
});
