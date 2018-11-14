import {
  talkEmbeddableConfigEventToAction,
  talkAgentAvailabilityEventToAction,
  talkAverageWaitTimeEventToAction
} from '../events';
import * as actions from 'src/redux/modules/talk';

jest.mock('src/redux/modules/talk');

const mockSocket = {
  on: jest.fn()
};

const mockReduxStore = {
  dispatch: jest.fn()
};

describe('talkEmbeddableConfigEventToAction', () => {
  let callback,
    mockConfig;

  beforeEach(() => {
    talkEmbeddableConfigEventToAction(mockSocket, mockReduxStore);
  });

  it('calls socket.on with the event name and a callback', () => {
    expect(mockSocket.on)
      .toHaveBeenCalledWith('socket.embeddableConfig', expect.any(Function));
  });

  describe('when the event is fired', () => {
    beforeEach(() => {
      mockConfig = {
        agentAvailability: false,
        averageWaitTime: '1',
        averageWaitTimeSetting: 'exact',
        averageWaitTimeEnabled: true,
        capability: '0',
        enabled: false,
        nickname: '',
        phoneNumber: ''
      };

      callback = mockSocket.on.mock.calls[0][1];
      callback(mockConfig);
    });

    it('dispatches the updateTalkEmbeddableConfig action', () => {
      expect(actions.updateTalkEmbeddableConfig)
        .toHaveBeenCalledWith(mockConfig);
    });

    it('dispatches an updateTalkAgentAvailability action', () => {
      expect(actions.updateTalkAgentAvailability)
        .toHaveBeenCalledWith(false);
    });

    it('dispatches an updateTalkAverageWaitTime action', () => {
      expect(actions.updateTalkAverageWaitTime)
        .toHaveBeenCalledWith('1');
    });

    it('dispatches an updateTalkAverageWaitTimeEnabled action', () => {
      expect(actions.updateTalkAverageWaitTimeEnabled)
        .toHaveBeenCalledWith(true);
    });

    it('dispatches the resetTalkScreen action', () => {
      expect(actions.resetTalkScreen)
        .toHaveBeenCalled();
    });
  });

  describe('when the disconnect socket event is fired', () => {
    beforeEach(() => {
      mockConfig = { enabled: false };

      callback = mockSocket.on.mock.calls[1][1];
      callback();
    });

    it('dispatches the updateTalkEmbeddableConfig action with enabled as false', () => {
      expect(actions.updateTalkEmbeddableConfig)
        .toHaveBeenCalledWith(mockConfig);
    });

    it('dispatches an updateTalkAgentAvailability action with false', () => {
      expect(actions.updateTalkAgentAvailability)
        .toHaveBeenCalledWith(false);
    });
  });
});

describe('talkAgentAvailabilityEventToAction', () => {
  beforeEach(() => {
    talkAgentAvailabilityEventToAction(mockSocket, mockReduxStore);
  });

  it('calls socket.on with the event name and a callback', () => {
    expect(mockSocket.on)
      .toHaveBeenCalledWith('socket.availability', expect.any(Function));
  });

  describe('when the event is fired', () => {
    let callback,
      mockAgentAvailability;

    describe('when agentAvailability is defined', () => {
      beforeEach(() => {
        mockAgentAvailability = { agentAvailability: true };

        const calls = mockSocket.on.mock.calls;

        callback = calls[calls.length - 1][1];
        callback(mockAgentAvailability);
      });

      it('dispatches an agent availability action', () => {
        expect(actions.updateTalkAgentAvailability)
          .toHaveBeenCalledWith(true);
      });
    });

    describe('when agentAvailability is undefined', () => {
      beforeEach(() => {
        mockAgentAvailability = {};
        const calls = mockSocket.on.mock.calls;

        callback = calls[calls.length - 1][1];
        callback(mockAgentAvailability);
      });

      it('dispatches an agent availability action', () => {
        expect(actions.updateTalkAgentAvailability)
          .toHaveBeenCalled();

        expect(mockReduxStore.dispatch)
          .toHaveBeenCalled();
      });

      it('dispatches an agent availability action', () => {
        expect(actions.updateTalkAgentAvailability)
          .toHaveBeenCalledWith(undefined);
      });
    });
  });
});

describe('talkAverageWaitTimeEventToAction', () => {
  beforeEach(() => {
    talkAverageWaitTimeEventToAction(mockSocket, mockReduxStore);
  });

  it('calls socket.on with the event name and a callback', () => {
    expect(mockSocket.on)
      .toHaveBeenCalledWith('socket.waitTimeChange', expect.any(Function));
  });

  describe('when the event is fired', () => {
    let callback,
      mockData;

    describe('when the averageWaitTime and averageWaitTimeSetting and averageWaitTimeEnabled are truthy', () => {
      beforeEach(() => {
        mockData = {
          averageWaitTime: '1',
          averageWaitTimeSetting: 'exact',
          averageWaitTimeEnabled: true
        };
        const calls = mockSocket.on.mock.calls;

        callback = calls[calls.length - 1][1];
        callback(mockData);
      });

      it('dispatches an average wait time change action', () => {
        expect(actions.updateTalkAverageWaitTime)
          .toHaveBeenCalledWith('1');
      });

      it('dispatches an average wait time enabled update action with true', () => {
        expect(actions.updateTalkAverageWaitTimeEnabled)
          .toHaveBeenCalledWith(true);
      });
    });

    describe('when the averageWaitTime is undefined', () => {
      beforeEach(() => {
        mockData = {
          averageWaitTimeSetting: 'exact',
          averageWaitTimeEnabled: false
        };
        const calls = mockSocket.on.mock.calls;

        callback = calls[calls.length - 1][1];
        callback(mockData);
      });

      it('does not dispatch an average wait time change action', () => {
        expect(actions.updateTalkAverageWaitTime)
          .not.toHaveBeenCalled();
      });

      it('dispatches an average wait time enabled update action with false', () => {
        expect(actions.updateTalkAverageWaitTimeEnabled)
          .toHaveBeenCalledWith(false);
      });
    });

    describe('when the averageWaitTimeSetting is undefined', () => {
      beforeEach(() => {
        mockData = {
          averageWaitTime: '1',
          averageWaitTimeEnabled: false
        };
        const calls = mockSocket.on.mock.calls;

        callback = calls[calls.length - 1][1];
        callback(mockData);
      });

      it('does not dispatch an average wait time change action', () => {
        expect(actions.updateTalkAverageWaitTime)
          .not.toHaveBeenCalled();
      });

      it('dispatches an average wait time enabled update action with false', () => {
        expect(actions.updateTalkAverageWaitTimeEnabled)
          .toHaveBeenCalledWith(false);
      });
    });

    describe('when the averageWaitTimeEnabled is false', () => {
      beforeEach(() => {
        mockData = {
          averageWaitTime: '1',
          averageWaitTimeSetting: 'exact',
          averageWaitTimeEnabled: false
        };

        const calls = mockSocket.on.mock.calls;

        callback = calls[calls.length - 1][1];
        callback(mockData);
      });

      it('does not dispatch an average wait time change action', () => {
        expect(actions.updateTalkAverageWaitTime)
          .not.toHaveBeenCalled();
      });

      it('dispatches an average wait time enabled update action with false', () => {
        expect(actions.updateTalkAverageWaitTimeEnabled)
          .toHaveBeenCalledWith(false);
      });
    });
  });
});
