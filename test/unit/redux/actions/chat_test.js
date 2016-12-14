let sendMsg,
  updateCurrentMsg,
  mockSendChatMsg = jasmine.createSpy('sendChatMsg');

const actionsPath = buildSrcPath('redux/actions/chat');

describe('chat redux actions', () => {
  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'vendor/web-sdk': {
        sendChatMsg: mockSendChatMsg
      }
    });

    mockery.registerAllowable(actionsPath);
    sendMsg = requireUncached(actionsPath).sendMsg;
    updateCurrentMsg = requireUncached(actionsPath).updateCurrentMsg;

    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('updateCurrentMsg', () => {
    let action;

    beforeEach(() => {
      action = updateCurrentMsg('new message');
    });

    it('creates an action of type UPDATE_CHAT_MSG', () => {
      expect(action.type)
        .toEqual('UPDATE_CHAT_MSG');
    });

    it('has the message in the payload', () => {
      expect(action.payload)
        .toEqual('new message');
    });
  });

  describe('sendMsg', () => {
    let thunk;

    beforeEach(() => {
      thunk = sendMsg('hi there');
    });

    it('returns a thunk', () => {
      expect(typeof(thunk))
        .toEqual('function');
    });
  });
});
