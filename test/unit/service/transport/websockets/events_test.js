describe('events', () => {
  let talkEmbeddableConfigEventToAction,
    talkAgentAvailabilityEventToAction,
    talkAverageWaitTimeEventToAction,
    updateTalkEmbeddableConfigSpy,
    updateTalkAgentAvailabilitySpy,
    updateTalkAverageWaitTimeSpy,
    updateTalkAverageWaitTimeEnabledSpy,
    resetTalkScreenSpy,
    actionTypes,
    mockSocket,
    mockReduxStore;

  const eventsPath = buildSrcPath('service/transport/websockets/events');
  const actionTypesPath = buildSrcPath('redux/modules/talk/talk-action-types');

  beforeEach(() => {
    mockery.enable();

    mockSocket = { on: jasmine.createSpy('socket.on') };
    mockReduxStore = { dispatch: jasmine.createSpy('reduxStore.dispatch') };

    actionTypes = requireUncached(actionTypesPath);
    updateTalkEmbeddableConfigSpy = actionSpy('updateTalkEmbeddableConfig', actionTypes.UPDATE_TALK_EMBEDDABLE_CONFIG);
    updateTalkAgentAvailabilitySpy = actionSpy('updateTalkAgentAvailability', actionTypes.UPDATE_TALK_AGENT_AVAILABILITY);
    updateTalkAverageWaitTimeSpy = actionSpy('updateTalkAverageWaitTime', actionTypes.UPDATE_TALK_AVERAGE_WAIT_TIME);
    updateTalkAverageWaitTimeEnabledSpy = actionSpy('updateTalkAverageWaitTimeEnabled', actionTypes.UPDATE_TALK_AVERAGE_WAIT_TIME_ENABLED);
    resetTalkScreenSpy = actionSpy('resetTalkScreen', 'RESET_SCREEN');

    initMockRegistry({
      'service/mediator': {
        mediator: { channel: { broadcast: noop } }
      },
      'src/redux/modules/talk/talk-action-types': actionTypes,
      'src/redux/modules/talk': {
        updateTalkEmbeddableConfig: updateTalkEmbeddableConfigSpy,
        updateTalkAgentAvailability: updateTalkAgentAvailabilitySpy,
        updateTalkAverageWaitTime: updateTalkAverageWaitTimeSpy,
        updateTalkAverageWaitTimeEnabled: updateTalkAverageWaitTimeEnabledSpy,
        resetTalkScreen: resetTalkScreenSpy
      }
    });

    mockery.registerAllowable(eventsPath);
    talkEmbeddableConfigEventToAction = requireUncached(eventsPath).talkEmbeddableConfigEventToAction;
    talkAgentAvailabilityEventToAction = requireUncached(eventsPath).talkAgentAvailabilityEventToAction;
    talkAverageWaitTimeEventToAction = requireUncached(eventsPath).talkAverageWaitTimeEventToAction;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('talkEmbeddableConfigEventToAction', () => {
    let callback,
      mockConfig;

    beforeEach(() => {
      talkEmbeddableConfigEventToAction(mockSocket, mockReduxStore);
    });

    it('calls socket.on with the event name and a callback', () => {
      expect(mockSocket.on)
        .toHaveBeenCalledWith('socket.embeddableConfig', jasmine.any(Function));
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
          groupName: '',
          keywords: '',
          phoneNumber: ''
        };

        callback = mockSocket.on.calls.argsFor(0)[1];
        callback(mockConfig);
      });

      it('dispatches the updateTalkEmbeddableConfig action', () => {
        expect(updateTalkEmbeddableConfigSpy)
          .toHaveBeenCalledWith(mockConfig);

        expect(mockReduxStore.dispatch.calls.argsFor(0)[0].type)
          .toBe(actionTypes.UPDATE_TALK_EMBEDDABLE_CONFIG);
      });

      it('dispatches an updateTalkAgentAvailability action', () => {
        expect(updateTalkAgentAvailabilitySpy)
          .toHaveBeenCalledWith(false);

        expect(mockReduxStore.dispatch.calls.argsFor(1)[0].type)
          .toBe(actionTypes.UPDATE_TALK_AGENT_AVAILABILITY);
      });

      it('dispatches an updateTalkAverageWaitTime action', () => {
        expect(updateTalkAverageWaitTimeSpy)
          .toHaveBeenCalledWith('1');

        expect(mockReduxStore.dispatch.calls.argsFor(2)[0].type)
          .toBe(actionTypes.UPDATE_TALK_AVERAGE_WAIT_TIME);
      });

      it('dispatches an updateTalkAverageWaitTimeEnabled action', () => {
        expect(updateTalkAverageWaitTimeEnabledSpy)
          .toHaveBeenCalledWith(true);

        expect(mockReduxStore.dispatch.calls.argsFor(3)[0].type)
          .toBe(actionTypes.UPDATE_TALK_AVERAGE_WAIT_TIME_ENABLED);
      });

      it('dispatches the resetTalkScreen action', () => {
        expect(resetTalkScreenSpy)
          .toHaveBeenCalled();
        expect(mockReduxStore.dispatch.calls.argsFor(4)[0].type)
          .toBe('RESET_SCREEN');
      });
    });

    describe('when the disconnect socket event is fired', () => {
      beforeEach(() => {
        mockConfig = { enabled: false };

        callback = mockSocket.on.calls.argsFor(1)[1];
        callback();
      });

      it('dispatches the updateTalkEmbeddableConfig action with enabled as false', () => {
        expect(updateTalkEmbeddableConfigSpy)
          .toHaveBeenCalledWith(mockConfig);

        expect(mockReduxStore.dispatch.calls.argsFor(0)[0].type)
          .toBe(actionTypes.UPDATE_TALK_EMBEDDABLE_CONFIG);
      });

      it('dispatches an updateTalkAgentAvailability action with false', () => {
        expect(updateTalkAgentAvailabilitySpy)
          .toHaveBeenCalledWith(false);

        expect(mockReduxStore.dispatch.calls.argsFor(1)[0].type)
          .toBe(actionTypes.UPDATE_TALK_AGENT_AVAILABILITY);
      });
    });
  });

  describe('talkAgentAvailabilityEventToAction', () => {
    beforeEach(() => {
      talkAgentAvailabilityEventToAction(mockSocket, mockReduxStore);
    });

    it('calls socket.on with the event name and a callback', () => {
      expect(mockSocket.on)
        .toHaveBeenCalledWith('socket.availability', jasmine.any(Function));
    });

    describe('when the event is fired', () => {
      let callback,
        mockAgentAvailability;

      describe('when agentAvailability is defined', () => {
        beforeEach(() => {
          mockAgentAvailability = { agentAvailability: true };

          callback = mockSocket.on.calls.mostRecent().args[1];
          callback(mockAgentAvailability);
        });

        it('dispatches an agent availability action', () => {
          expect(updateTalkAgentAvailabilitySpy)
            .toHaveBeenCalledWith(true);

          expect(mockReduxStore.dispatch.calls.mostRecent().args[0].type)
            .toBe(actionTypes.UPDATE_TALK_AGENT_AVAILABILITY);
        });
      });

      describe('when agentAvailability is undefined', () => {
        beforeEach(() => {
          mockAgentAvailability = {};

          callback = mockSocket.on.calls.mostRecent().args[1];
          callback(mockAgentAvailability);
        });

        it('does dispatch an agent availability action', () => {
          expect(updateTalkAgentAvailabilitySpy)
            .toHaveBeenCalled();

          expect(mockReduxStore.dispatch)
            .toHaveBeenCalled();
        });

        it('dispatches an agent availability action', () => {
          expect(updateTalkAgentAvailabilitySpy)
            .toHaveBeenCalledWith(undefined);

          expect(mockReduxStore.dispatch.calls.mostRecent().args[0].type)
            .toBe(actionTypes.UPDATE_TALK_AGENT_AVAILABILITY);
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
        .toHaveBeenCalledWith('socket.waitTimeChange', jasmine.any(Function));
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

          callback = mockSocket.on.calls.mostRecent().args[1];
          callback(mockData);
        });

        it('dispatches an average wait time change action', () => {
          expect(updateTalkAverageWaitTimeSpy)
            .toHaveBeenCalledWith('1');

          expect(mockReduxStore.dispatch.calls.argsFor(0)[0].type)
            .toBe(actionTypes.UPDATE_TALK_AVERAGE_WAIT_TIME);
        });

        it('dispatches an average wait time enabled update action with true', () => {
          expect(updateTalkAverageWaitTimeEnabledSpy)
            .toHaveBeenCalledWith(true);

          expect(mockReduxStore.dispatch.calls.argsFor(1)[0].type)
            .toBe(actionTypes.UPDATE_TALK_AVERAGE_WAIT_TIME_ENABLED);
        });
      });

      describe('when the averageWaitTime is undefined', () => {
        beforeEach(() => {
          mockData = {
            averageWaitTimeSetting: 'exact',
            averageWaitTimeEnabled: false
          };

          callback = mockSocket.on.calls.mostRecent().args[1];
          callback(mockData);
        });

        it('does not dispatch an average wait time change action', () => {
          expect(updateTalkAverageWaitTimeSpy)
            .not.toHaveBeenCalled();
        });

        it('dispatches an average wait time enabled update action with false', () => {
          expect(updateTalkAverageWaitTimeEnabledSpy)
            .toHaveBeenCalledWith(false);

          expect(mockReduxStore.dispatch.calls.mostRecent().args[0].type)
            .toBe(actionTypes.UPDATE_TALK_AVERAGE_WAIT_TIME_ENABLED);
        });
      });

      describe('when the averageWaitTimeSetting is undefined', () => {
        beforeEach(() => {
          mockData = {
            averageWaitTime: '1',
            averageWaitTimeEnabled: false
          };

          callback = mockSocket.on.calls.mostRecent().args[1];
          callback(mockData);
        });

        it('does not dispatch an average wait time change action', () => {
          expect(updateTalkAverageWaitTimeSpy)
            .not.toHaveBeenCalled();
        });

        it('dispatches an average wait time enabled update action with false', () => {
          expect(updateTalkAverageWaitTimeEnabledSpy)
            .toHaveBeenCalledWith(false);

          expect(mockReduxStore.dispatch.calls.mostRecent().args[0].type)
            .toBe(actionTypes.UPDATE_TALK_AVERAGE_WAIT_TIME_ENABLED);
        });
      });

      describe('when the averageWaitTimeEnabled is false', () => {
        beforeEach(() => {
          mockData = {
            averageWaitTime: '1',
            averageWaitTimeSetting: 'exact',
            averageWaitTimeEnabled: false
          };

          callback = mockSocket.on.calls.mostRecent().args[1];
          callback(mockData);
        });

        it('does not dispatch an average wait time change action', () => {
          expect(updateTalkAverageWaitTimeSpy)
            .not.toHaveBeenCalled();
        });

        it('dispatches an average wait time enabled update action with false', () => {
          expect(updateTalkAverageWaitTimeEnabledSpy)
            .toHaveBeenCalledWith(false);

          expect(mockReduxStore.dispatch.calls.mostRecent().args[0].type)
            .toBe(actionTypes.UPDATE_TALK_AVERAGE_WAIT_TIME_ENABLED);
        });
      });
    });
  });
});
