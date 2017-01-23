import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let sendMsg,
  updateCurrentMsg,
  msgActionPayload,
  mockStore,
  mockSendChatMsg = jasmine.createSpy('sendChatMsg');

const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);

describe('chat redux actions', () => {
  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'vendor/web-sdk': {
        sendChatMsg: mockSendChatMsg
      }
    });

    const actionsPath = buildSrcPath('redux/actions/chat');

    mockery.registerAllowable(actionsPath);

    sendMsg = requireUncached(actionsPath).sendMsg;
    updateCurrentMsg = requireUncached(actionsPath).updateCurrentMsg;
    msgActionPayload = requireUncached(actionsPath).msgActionPayload;

    jasmine.clock().install();
    jasmine.clock().mockDate(Date.now());
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
    let message = 'Hi there';

    beforeEach(() => {
      mockStore = createMockStore({});
      mockStore.dispatch(sendMsg(message));
    });

    it('calls sendChatMsg on the web sdk', () => {
      expect(mockSendChatMsg)
        .toHaveBeenCalled();
    });

    it('dispatches a SENT_CHAT_MSG_REQUEST action', () => {
      expect(mockStore.getActions())
        .toContain({ type: 'SENT_CHAT_MSG_REQUEST' });
    });

    describe('Web SDK callback', () => {
      let callbackFn;

      beforeEach(() => {
        const sendMsgCall = mockSendChatMsg.calls.mostRecent().args;

        callbackFn = sendMsgCall[1];
      });

      describe('when there are no errors', () => {
        beforeEach(() => {
          callbackFn();
        });

        it('dispatches a SENT_CHAT_MSG_SUCCESS action with the message in payload', () => {
          expect(mockStore.getActions())
            .toContain({
              type: 'SENT_CHAT_MSG_SUCCESS',
              payload: msgActionPayload(message)
            });
        });
      });

      describe('when there are errors', () => {
        let errors = [
          'There was an error',
          'Another error'
        ];

        beforeEach(() => {
          callbackFn(errors);
        });

        it('dispatches a SENT_CHAT_MSG_FAILURE action with the errors in the payload', () => {
          expect(mockStore.getActions())
            .toContain({
              type: 'SENT_CHAT_MSG_FAILURE',
              payload: errors
            });
        });
      });
    });
  });
});
