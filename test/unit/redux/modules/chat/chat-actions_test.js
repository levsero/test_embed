import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  mockStore,
  mockVisitor,
  mockAccountSettings,
  mockSendChatMsg = jasmine.createSpy('sendChatMsg'),
  mockSendTyping = jasmine.createSpy('sendTyping'),
  mockSetVisitorInfo = jasmine.createSpy('mockSetVisitorInfo'),
  mockEndChat = jasmine.createSpy('endChat'),
  mockSendChatRating = jasmine.createSpy('sendChatRating');

const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);

describe('chat redux actions', () => {
  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'chat-web-sdk': {
        sendChatMsg: mockSendChatMsg,
        sendTyping: mockSendTyping,
        endChat: mockEndChat,
        setVisitorInfo: mockSetVisitorInfo,
        sendChatRating: mockSendChatRating,
        _getAccountSettings: () => mockAccountSettings
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

  afterEach(() => {
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

    it('calls sendTyping(true) on the Web SDK', () => {
      expect(mockSendTyping)
        .toHaveBeenCalledWith(true);
    });

    it('calls sendTyping(false) on the Web SDK after 2 seconds', () => {
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

    it('calls sendChatMsg on the Web SDK', () => {
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

    it('calls sendChatMsg on the Web SDK', () => {
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

  describe('setVisitorInfo', () => {
    beforeEach(() => {
      const info = { email: 'x@x.com' };

      mockStore.dispatch(actions.setVisitorInfo(info));
    });

    it('calls setVisitorInfo on the Web SDK', () => {
      expect(mockSetVisitorInfo)
        .toHaveBeenCalled();
    });

    describe('Web SDK callback', () => {
      let callbackFn;

      beforeEach(() => {
        const setVisitorInfoCalls = mockSetVisitorInfo.calls.mostRecent().args;

        callbackFn = setVisitorInfoCalls[1];
      });

      describe('when there are no errors', () => {
        beforeEach(() => {
          callbackFn();
        });

        it('dispatches a UPDATE_VISITOR_INFO_SUCCESS action with the correct payload', () => {
          expect(mockStore.getActions())
            .toContain({
              type: actionTypes.UPDATE_VISITOR_INFO_SUCCESS,
              payload: { email: 'x@x.com' }
            });
        });
      });

      describe('when there are errors', () => {
        beforeEach(() => {
          callbackFn(['error!']);
        });

        it('dispatches a UPDATE_VISITOR_INFO_FAILURE action', () => {
          expect(mockStore.getActions())
            .toContain({
              type: actionTypes.UPDATE_VISITOR_INFO_FAILURE
            });
        });
      });
    });
  });

  describe('sendChatRating', () => {
    beforeEach(() => {
      const rating = 'good';

      mockStore.dispatch(actions.sendChatRating(rating));
    });

    it('calls sendChatRating on the Web SDK', () => {
      expect(mockSendChatRating)
        .toHaveBeenCalled();
    });

    describe('Web SDK callback', () => {
      let callbackFn;

      beforeEach(() => {
        const sendChatRatingCalls = mockSendChatRating.calls.mostRecent().args;

        callbackFn = sendChatRatingCalls[1];
      });

      describe('when there are no errors', () => {
        beforeEach(() => {
          callbackFn();
        });

        it('dispatches a SEND_CHAT_RATING_SUCCESS action with the correct payload', () => {
          expect(mockStore.getActions())
            .toContain({
              type: actionTypes.SEND_CHAT_RATING_SUCCESS,
              payload: 'good'
            });
        });
      });

      describe('when there are errors', () => {
        beforeEach(() => {
          callbackFn(['error!']);
        });

        it('dispatches a SEND_CHAT_RATING_FAILURE action', () => {
          expect(mockStore.getActions())
            .toContain({
              type: actionTypes.SEND_CHAT_RATING_FAILURE
            });
        });
      });
    });
  });

  describe('updateAccountSettings', () => {
    let action;

    beforeEach(() => {
      mockAccountSettings = { foo: 'bar' };
      mockStore.dispatch(actions.updateAccountSettings());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_ACCOUNT_SETTINGS', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_ACCOUNT_SETTINGS);
    });

    it('has the value returned from zChat._getAccountSettings() in the payload', () => {
      expect(action.payload)
        .toEqual(mockAccountSettings);
    });
  });
});
