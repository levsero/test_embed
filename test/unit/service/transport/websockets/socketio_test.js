describe('socketio', () => {
  let socketio,
    ioSpy,
    mockIoReturnValue,
    talkEmbeddableConfigEventToActionSpy,
    talkAgentAvailabilityEventToActionSpy;

  const socketioPath = buildSrcPath('service/transport/websockets/socketio');

  beforeEach(() => {
    mockery.enable();

    mockIoReturnValue = 'socket';
    ioSpy = jasmine.createSpy('io').and.returnValue(mockIoReturnValue);
    talkEmbeddableConfigEventToActionSpy = jasmine.createSpy('talkEmbeddableConfigEventToAction');
    talkAgentAvailabilityEventToActionSpy = jasmine.createSpy('talkAgentAvailabilityEventToAction');

    initMockRegistry({
      'socket.io-client': ioSpy,
      './events': {
        talkEmbeddableConfigEventToAction: talkEmbeddableConfigEventToActionSpy,
        talkAgentAvailabilityEventToAction: talkAgentAvailabilityEventToActionSpy
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
    const subdomain = 'foocustomer';
    const keyword = 'Support';

    beforeEach(() => {
      socket = socketio.connect(subdomain, keyword);
      args = ioSpy.calls.mostRecent().args;
    });

    it('calls io with the correct url', () => {
      expect(args[0])
        .toBe('http://talkintegration-pod999.zendesk-staging.com');
    });

    it('calls io with the correct options', () => {
      expect(args[1])
        .toEqual({
          query: 'subdomain=foocustomer&keyword=Support',
          path: '/talk_embeddables_service/socket.io'
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
  });
});
