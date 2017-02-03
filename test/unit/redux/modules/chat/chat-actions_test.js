import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  mockStore,
  mockVisitor,
  mockSendChatMsg = jasmine.createSpy('sendChatMsg'),
  mockSendTyping = jasmine.createSpy('sendTyping'),
  mockEndChat = jasmine.createSpy('endChat');

const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);

describe('chat redux actions', () => {
  beforeAll(() => {
    mockery.enable();

    initMockRegistry({
      'vendor/web-sdk': {
        sendChatMsg: mockSendChatMsg,
        sendTyping: mockSendTyping,
        endChat: mockEndChat
      }
    });

    const actionsPath = buildSrcPath('redux/modules/chat');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

    mockery.registerAllowable(actionsPath);
    mockery.registerAllowable(actionTypesPath);

    actions = requireUncached(actionsPath);
    actionTypes = requireUncached(actionTypesPath);

    mockVisitor = { display_name: 'Visitor 123', nick: 'visitor' };
    mockStore = createMockStore({
      chat: {
        visitor: mockVisitor
      }
    });

    jasmine.clock().install();
    jasmine.clock().mockDate(Date.now());
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
    jasmine.clock().uninstall();
  });

  describe('updateCurrentMsg', () => {
    let message,
      action;

    beforeEach(() => {
      message = 'new message';
      mockStore.dispatch(actions.updateCurrentMsg(message));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_CURRENT_MSG', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_CURRENT_MSG);
    });

    it('has the message in the payload', () => {
      expect(action.payload)
        .toEqual(message);
    });

    it('calls sendTyping(true) on the web sdk', () => {
      expect(mockSendTyping)
        .toHaveBeenCalledWith(true);
    });

    it('calls sendTyping(false) on the web sdk after 2 seconds', () => {
      jasmine.clock().tick(2000);

      expect(mockSendTyping)
        .toHaveBeenCalledWith(false);
    });
  });

  describe('sendMsg', () => {
    let message;

    beforeEach(() => {
      message = 'Hi there';
      mockStore.dispatch(actions.sendMsg(message));
    });

    it('calls sendChatMsg on the web sdk', () => {
      expect(mockSendChatMsg)
        .toHaveBeenCalled();
    });

    it('dispatches a SENT_CHAT_MSG_REQUEST action', () => {
      expect(mockStore.getActions())
        .toContain({
          type: actionTypes.SENT_CHAT_MSG_REQUEST
        });
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
              type: actionTypes.SENT_CHAT_MSG_SUCCESS,
              payload: {
                type: 'chat.msg',
                msg: message,
                timestamp: Date.now(),
                nick: mockVisitor.nick,
                display_name: mockVisitor.display_name
              }
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
              type: actionTypes.SENT_CHAT_MSG_FAILURE,
              payload: errors
            });
        });
      });
    });
  });

  describe('endChat', () => {
    beforeEach(() => {
      mockStore.dispatch(actions.endChat());
    });

    it('calls sendChatMsg on the web sdk', () => {
      expect(mockEndChat)
        .toHaveBeenCalled();
    });

    describe('Web SDK callback', () => {
      let callbackFn;

      beforeEach(() => {
        const endChatCalls = mockEndChat.calls.mostRecent().args;

        callbackFn = endChatCalls[0];
      });

      describe('when there are no errors', () => {
        beforeEach(() => {
          callbackFn();
        });

        it('dispatches a END_CHAT_SUCCESS action', () => {
          expect(mockStore.getActions())
            .toContain({
              type: actionTypes.END_CHAT_SUCCESS
            });
        });
      });

      describe('when there are errors', () => {
        beforeEach(() => {
          callbackFn(['error!']);
        });

        it('dispatches a END_CHAT_FAILURE action', () => {
          expect(mockStore.getActions())
            .toContain({
              type: actionTypes.END_CHAT_FAILURE
            });
        });
      });
    });
  });
});
