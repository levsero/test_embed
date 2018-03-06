describe('socketio', () => {
  let socketio,
    ioSpy,
    mockIoReturnValue,
    talkEmbeddableConfigEventToActionSpy,
    talkAgentAvailabilityEventToActionSpy,
    talkAverageWaitTimeEventToActionSpy;

  const socketioPath = buildSrcPath('service/transport/websockets/socketio');

  beforeEach(() => {
    mockery.enable();

    mockIoReturnValue = 'socket';
    ioSpy = jasmine.createSpy('io').and.returnValue(mockIoReturnValue);
    talkEmbeddableConfigEventToActionSpy = jasmine.createSpy('talkEmbeddableConfigEventToAction');
    talkAgentAvailabilityEventToActionSpy = jasmine.createSpy('talkAgentAvailabilityEventToAction');
    talkAverageWaitTimeEventToActionSpy = jasmine.createSpy('talkAverageWaitTimeEventToAction');

    initMockRegistry({
      'socket.io-client': ioSpy,
      './events': {
        talkEmbeddableConfigEventToAction: talkEmbeddableConfigEventToActionSpy,
        talkAgentAvailabilityEventToAction: talkAgentAvailabilityEventToActionSpy,
        talkAverageWaitTimeEventToAction: talkAverageWaitTimeEventToActionSpy
      }
    });

    mockery.registerAllowable(socketioPath);
    socketio = requireUncached(socketioPath).socketio;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('connect', () => {
    let args, socket;

    beforeEach(() => {
      socket = socketio.connect('talk.com', 'foocustomer', 'Support');
      args = ioSpy.calls.mostRecent().args;
    });

    it('calls io with the correct service url', () => {
      expect(args[0])
        .toBe('talk.com');
    });

    it('calls io with the correct options', () => {
      expect(args[1])
        .toEqual({
          query: 'subdomain=foocustomer&keyword=Support',
          path: '/talk_embeddables_service/socket.io',
          reconnectionAttempts: 6,
          transports: ['websocket']
        });
    });

    it('returns the socket', () => {
      expect(socket)
        .toBe(mockIoReturnValue);
    });
  });

  describe('mapEventsToActions', () => {
    const socket = { on: () => {} };
    const reduxStore = { state: {} };

    beforeEach(() => {
      socketio.mapEventsToActions(socket, reduxStore);
    });

    it('calls talkEmbeddableConfigEventToAction with socket and reduxStore', () => {
      expect(talkEmbeddableConfigEventToActionSpy)
        .toHaveBeenCalledWith(socket, reduxStore);
    });

    it('calls talkAgentAvailabilityEventToAction with socket and reduxStore', () => {
      expect(talkAgentAvailabilityEventToActionSpy)
        .toHaveBeenCalledWith(socket, reduxStore);
    });

    it('calls talkAverageWaitTimeEventToAction with socket and reduxStore', () => {
      expect(talkAverageWaitTimeEventToActionSpy)
        .toHaveBeenCalledWith(socket, reduxStore);
    });
  });
});
