import { logging } from 'service/logging';
import { beacon } from 'service/beacon';
const preventLoops = jest.requireActual('../').default;

jest.mock('service/logging', () => ({
  logging: {
    error: jest.fn()
  },
}));
jest.mock('service/beacon', () => ({
  beacon: {
    trackUserAction: jest.fn()
  },
}));
import { SDK_CHAT_MSG, CHAT_BOX_CHANGED, SDK_HISTORY_CHAT_MSG } from 'src/redux/modules/chat/chat-action-types';

const getAction = (actionType = 'fake_action') => {
  return {
    type: actionType
  };
};

describe('preventLoops', () => {
  describe('with less than 100 actions', () => {
    beforeEach(() => {
      Array.from({ length: 25 }).forEach(() => {
        preventLoops({ getState: noop })(jest.fn())(getAction());
      });
    });

    it('does not call the logger', () => {
      expect(logging.error).not.toHaveBeenCalled();
      expect(beacon.trackUserAction).not.toHaveBeenCalled();
    });
  });

  describe('with a total of more than 100 actions calls', () => {
    beforeEach(() => {
      Array.from({ length: 79 }).forEach(() => {
        preventLoops({ getState: noop })(jest.fn())(getAction());
      });
    });

    it('calls the logger for each action', () => {
      expect(logging.error).toHaveBeenCalledTimes(5);
      expect(beacon.trackUserAction).toHaveBeenCalledTimes(5);
    });
  });

  describe('it ignores certain actions', () => {
    beforeEach(() => {
      const actionsToSkip = [SDK_HISTORY_CHAT_MSG, SDK_CHAT_MSG, CHAT_BOX_CHANGED];

      actionsToSkip.forEach((actionName) => {
        preventLoops({ getState: noop })(jest.fn())(getAction(actionName));
      });
    });

    it('calls the logger for each action', () => {
      expect(logging.error).not.toHaveBeenCalled();
      expect(beacon.trackUserAction).not.toHaveBeenCalled();
    });
  });
});
