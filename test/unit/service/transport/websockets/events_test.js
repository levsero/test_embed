describe('events', () => {
  let talkEmbeddableConfigEventToAction,
    talkAgentAvailabilityEventToAction,
    talkAverageWaitTimeEventToAction,
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

      it('dispatches an embeddable config action', () => {
        expect(mockReduxStore.dispatch.calls.argsFor(0)[0])
          .toEqual({
            type: 'talk/socket.embeddableConfig',
            payload: _.omit(mockConfig, 'agentAvailability', 'averageWaitTime')
          });
      });

      it('dispatches an agent availability action', () => {
        expect(mockReduxStore.dispatch.calls.argsFor(1)[0])
          .toEqual({
            type: 'talk/socket.availability',
            payload: false
          });
      });

      describe('when surfacing the wait time is enabled', () => {
        beforeEach(() => {
          const averageWaitTimeConfig = {
            averageWaitTimeSetting: null,
            averageWaitTime: '1'
          };

          mockConfig = { ...mockConfig, ...averageWaitTimeConfig };
          mockReduxStore.dispatch.calls.reset();
          callback = mockSocket.on.calls.mostRecent().args[1];
          callback(mockConfig);
        });

        it('dispatches an average wait time change action', () => {
          expect(mockReduxStore.dispatch.calls.argsFor(2)[0])
            .toEqual({
              type: 'talk/socket.waitTimeChange',
              payload: '1'
            });
        });
      });

      describe('when surfacing the wait time is disabled', () => {
        it('does not dispatch an average wait time change action', () => {
          expect(mockReduxStore.dispatch.calls.mostRecent().args[0])
            .toEqual({
              type: 'talk/socket.availability',
              payload: false
            });
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
        expect(mockReduxStore.dispatch)
          .toHaveBeenCalledWith({
            type: 'talk/socket.availability',
            payload: true
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
      let callback;

      beforeEach(() => {
        callback = mockSocket.on.calls.mostRecent().args[1];
        callback('5');
      });

      it('dispatches an average wait time change action', () => {
        expect(mockReduxStore.dispatch)
          .toHaveBeenCalledWith({
            type: 'talk/socket.waitTimeChange',
            payload: '5'
          });
      });
    });
  });
});
