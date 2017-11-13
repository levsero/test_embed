describe('events', () => {
  let talkEmbedableConfigEventToAction,
    talkAgentAvailabilityEventToAction,
    mockSocket,
    mockReduxStore;

  const eventsPath = buildSrcPath('service/transport/websockets/events');

  beforeEach(() => {
    mockery.enable();

    mockSocket = { on: jasmine.createSpy('socket.on') };
    mockReduxStore = { dispatch: jasmine.createSpy('reduxStore.dispatch') };

    initMockRegistry({
      'lodash': _
    });

    mockery.registerAllowable(eventsPath);
    talkEmbedableConfigEventToAction = requireUncached(eventsPath).talkEmbedableConfigEventToAction;
    talkAgentAvailabilityEventToAction = requireUncached(eventsPath).talkAgentAvailabilityEventToAction;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('talkEmbedableConfigEventToAction', () => {
    beforeEach(() => {
      talkEmbedableConfigEventToAction(mockSocket, mockReduxStore);
    });

    it('calls socket.on with the event name and a callback', () => {
      expect(mockSocket.on)
        .toHaveBeenCalledWith('socket.embeddableConfig', jasmine.any(Function));
    });

    describe('when the event is fired', () => {
      let callback;
      const mockConfig = {
        agentAvailability: false,
        averageWaitTimeSetting: null,
        capability: '0',
        enabled: 'false',
        groupName: '',
        keywords: '',
        phoneNumber: ''
      };

      beforeEach(() => {
        callback = mockSocket.on.calls.mostRecent().args[1];
        callback(mockConfig);
      });

      it('dispatches an embeddable config action', () => {
        expect(mockReduxStore.dispatch.calls.argsFor(0)[0])
          .toEqual({
            type: 'talk/socket.embeddableConfig',
            payload: _.omit(mockConfig, 'agentAvailability')
          });
      });

      it('dispatches an agent availability action', () => {
        expect(mockReduxStore.dispatch.calls.argsFor(1)[0])
          .toEqual({
            type: 'talk/socket.agentAvailability',
            payload: false
          });
      });
    });
  });

  describe('talkAgentAvailabilityEventToAction', () => {
    beforeEach(() => {
      talkAgentAvailabilityEventToAction(mockSocket, mockReduxStore);
    });

    it('calls socket.on with the event name and a callback', () => {
      expect(mockSocket.on)
        .toHaveBeenCalledWith('socket.agentAvailability', jasmine.any(Function));
    });

    describe('when the event is fired', () => {
      let callback;
      const mockAgentAvailability = { agentAvailability: true };

      beforeEach(() => {
        callback = mockSocket.on.calls.mostRecent().args[1];
        callback(mockAgentAvailability);
      });

      it('dispatches an agent availability action', () => {
        expect(mockReduxStore.dispatch)
          .toHaveBeenCalledWith({
            type: 'talk/socket.agentAvailability',
            payload: true
          });
      });
    });
  });
});
