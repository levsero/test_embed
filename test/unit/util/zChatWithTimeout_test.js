describe('zChatWithTimeout', () => {
  let zChatWithTimeout,
    zChatWithTimeoutPath,
    mockTimeout = jasmine.createSpy('timeout'),
    mockGetState = jasmine.createSpy('getState').and.returnValue('yolo');

  let mockSendChatMsg = jasmine.createSpy('sendChatMsg');
  let mockZChatVendor = jasmine.createSpy('zChatVendor').and.returnValue({
    sendChatMsg: mockSendChatMsg
  });

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'src/redux/modules/chat/chat-selectors': {
        getZChatVendor: mockZChatVendor
      },
      'src/constants/chat': {
        TIMEOUT: 5000
      },
      'async': {
        timeout: mockTimeout
      }
    });

    zChatWithTimeoutPath = buildSrcPath('util/zChatWithTimeout');
    mockery.registerAllowable(zChatWithTimeoutPath);
    zChatWithTimeout = requireUncached(zChatWithTimeoutPath).zChatWithTimeout;

    zChatWithTimeout(mockGetState, 'sendChatMsg', 10);
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('calls getState', () => {
    expect(mockGetState)
      .toHaveBeenCalled();
  });

  it('calls getZChatVendor', () => {
    expect(mockZChatVendor)
      .toHaveBeenCalledWith('yolo');
  });

  it('calls timeout', () => {
    expect(mockTimeout)
      .toHaveBeenCalledWith(mockSendChatMsg, 10);
  });
});
