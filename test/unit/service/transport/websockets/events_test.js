describe('events', () => {
  let talkEmbeddableConfigEventToAction,
    talkAgentAvailabilityEventToAction,
    talkAverageWaitTimeEventToAction,
    updateTalkEmbeddableConfigSpy,
    updateTalkAgentAvailabilitySpy,
    updateTalkAverageWaitTimeSpy,
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
    updateTalkEmbeddableConfigSpy = actionSpy('updateTalkEmbeddableConfig', actionTypes.UPDATE_EMBEDDABLE_CONFIG);
    updateTalkAgentAvailabilitySpy = actionSpy('updateTalkAgentAvailability', actionTypes.UPDATE_AGENT_AVAILABILITY);
    updateTalkAverageWaitTimeSpy = actionSpy('updateTalkAverageWaitTime', actionTypes.UPDATE_AVERAGE_WAIT_TIME);
    resetTalkScreenSpy = actionSpy('resetTalkScreen', 'RESET_SCREEN');

    initMockRegistry({
      'lodash': _,
      'src/redux/modules/talk/talk-action-types': actionTypes,
      'src/redux/modules/talk': {
        updateTalkEmbeddableConfig: updateTalkEmbeddableConfigSpy,
        updateTalkAgentAvailability: updateTalkAgentAvailabilitySpy,
        updateTalkAverageWaitTime: updateTalkAverageWaitTimeSpy,
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
    beforeEach(() => {
      talkEmbeddableConfigEventToAction(mockSocket, mockReduxStore);
    });

    it('calls socket.on with the event name and a callback', () => {
      expect(mockSocket.on)
        .toHaveBeenCalledWith('socket.embeddableConfig', jasmine.any(Function));
    });

    describe('when the event is fired', () => {
      let callback,
        mockConfig;

      beforeEach(() => {
        mockConfig = {
          agentAvailability: false,
          capability: '0',
          enabled: 'false',
          groupName: '',
          keywords: '',
          phoneNumber: ''
        };

        callback = mockSocket.on.calls.mostRecent().args[1];
        callback(mockConfig);
      });

      it('dispatches the updateTalkEmbeddableConfig action', () => {
        expect(updateTalkEmbeddableConfigSpy)
          .toHaveBeenCalledWith(mockConfig);

        expect(mockReduxStore.dispatch.calls.argsFor(0)[0].type)
          .toBe(actionTypes.UPDATE_EMBEDDABLE_CONFIG);
      });

      it('dispatches an updateTalkAgentAvailability action', () => {
        expect(updateTalkAgentAvailabilitySpy)
          .toHaveBeenCalledWith(false);

        expect(mockReduxStore.dispatch.calls.argsFor(1)[0].type)
          .toBe(actionTypes.UPDATE_AGENT_AVAILABILITY);
      });

      it('dispatches the resetTalkScreen action', () => {
        expect(resetTalkScreenSpy)
          .toHaveBeenCalled();

        expect(mockReduxStore.dispatch.calls.argsFor(2)[0].type)
          .toBe('RESET_SCREEN');
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
      let callback;
      const mockAgentAvailability = { agentAvailability: true };

      beforeEach(() => {
        callback = mockSocket.on.calls.mostRecent().args[1];
        callback(mockAgentAvailability);
      });

      it('dispatches an agent availability action', () => {
        expect(updateTalkAgentAvailabilitySpy)
          .toHaveBeenCalledWith(true);

        expect(mockReduxStore.dispatch.calls.mostRecent().args[0].type)
          .toBe(actionTypes.UPDATE_AGENT_AVAILABILITY);
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
      let callback;

      beforeEach(() => {
        callback = mockSocket.on.calls.mostRecent().args[1];
        callback({ waitTime: '5' });
      });

      it('dispatches an average wait time change action', () => {
        expect(updateTalkAverageWaitTimeSpy)
          .toHaveBeenCalledWith('5');

        expect(mockReduxStore.dispatch.calls.mostRecent().args[0].type)
          .toBe(actionTypes.UPDATE_AVERAGE_WAIT_TIME);
      });
    });
  });
});
