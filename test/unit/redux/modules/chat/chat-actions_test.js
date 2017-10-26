import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  screenTypes,
  mockStore,
  mockVisitor,
  mockAccountSettings,
  mockSendChatMsg = jasmine.createSpy('sendChatMsg'),
  mockSendTyping = jasmine.createSpy('sendTyping'),
  mockSetVisitorInfo = jasmine.createSpy('mockSetVisitorInfo'),
  mockEndChat = jasmine.createSpy('endChat'),
  mockSendChatRating = jasmine.createSpy('sendChatRating'),
  mockSendChatComment = jasmine.createSpy('sendChatComment'),
  mockSendFile = jasmine.createSpy('sendFile');

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
        sendChatComment: mockSendChatComment,
        sendFile: mockSendFile,
        _getAccountSettings: () => mockAccountSettings
      },
      'src/redux/modules/chat/selectors': {
        getChatVisitor: () => 'Batman'
      }
    });

    const actionsPath = buildSrcPath('redux/modules/chat');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');
    const screenTypesPath = buildSrcPath('redux/modules/chat/reducer/chat-screen-types');

    mockery.registerAllowable(actionsPath);
    mockery.registerAllowable(actionTypesPath);
    mockery.registerAllowable(screenTypesPath);

    actions = requireUncached(actionsPath);
    actionTypes = requireUncached(actionTypesPath);
    screenTypes = requireUncached(screenTypesPath);

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

  describe('toggleEndChatNotification', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.toggleEndChatNotification(true));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type TOGGLE_END_CHAT_NOTIFICATION', () => {
      expect(action.type)
        .toEqual(actionTypes.TOGGLE_END_CHAT_NOTIFICATION);
    });

    it('dispatches an action with payload of true', () => {
      expect(action.payload)
        .toEqual(true);
    });
  });

  describe('acceptEndChatNotification', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.acceptEndChatNotification());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type TOGGLE_END_CHAT_NOTIFICATION', () => {
      expect(action.type)
        .toEqual(actionTypes.TOGGLE_END_CHAT_NOTIFICATION);
    });

    it('calls endChat on the Web SDK', () => {
      expect(mockEndChat)
        .toHaveBeenCalled();
    });
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

    it('calls endChat on the Web SDK', () => {
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

  describe('sendChatComment', () => {
    const rating = 'The product was faulty and foobard';

    beforeEach(() => {
      mockStore.dispatch(actions.sendChatComment(rating));
    });

    it('calls sendChatComment on the Web SDK', () => {
      expect(mockSendChatComment)
        .toHaveBeenCalled();
    });

    describe('Web SDK callback', () => {
      let callbackFn;

      beforeEach(() => {
        callbackFn = mockSendChatComment.calls.mostRecent().args[1];
      });

      describe('when there are no errors', () => {
        beforeEach(() => {
          mockEndChat.calls.reset();
          callbackFn();
        });

        it('dispatches a SEND_CHAT_RATING_COMMENT_SUCCESS action with the correct payload', () => {
          expect(mockStore.getActions())
            .toContain({
              type: actionTypes.SEND_CHAT_RATING_COMMENT_SUCCESS,
              payload: rating
            });
        });

        it('calls endChat', () => {
          expect(mockEndChat)
            .toHaveBeenCalled();
        });
      });

      describe('when there are errors', () => {
        beforeEach(() => {
          mockEndChat.calls.reset();
          callbackFn(['error!']);
        });

        it('dispatches a SEND_CHAT_RATING_COMMENT_FAILURE action', () => {
          expect(mockStore.getActions())
            .toContain({
              type: actionTypes.SEND_CHAT_RATING_COMMENT_FAILURE
            });
        });

        it('does not call endChat', () => {
          expect(mockEndChat)
            .not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('updateAccountSettings', () => {
    let action;

    describe('when the prechat form is required', () => {
      let updateScreenAction;

      beforeEach(() => {
        mockAccountSettings = { forms: { pre_chat_form: { required: true } } };
        mockStore.dispatch(actions.updateAccountSettings());

        updateScreenAction = mockStore.getActions()[0];
        action = mockStore.getActions()[1];
      });

      it('dispatches updateChatScreen action with the prechat screen', () => {
        expect(updateScreenAction)
          .toEqual({
            type: actionTypes.UPDATE_CHAT_SCREEN,
            payload: { screen: screenTypes.PRECHAT_SCREEN }
          });
      });

      it('dispatches an action of type UPDATE_ACCOUNT_SETTINGS', () => {
        expect(action.type)
          .toBe(actionTypes.UPDATE_ACCOUNT_SETTINGS);
      });

      it('has the value returned from zChat._getAccountSettings() in the payload', () => {
        expect(action.payload)
          .toEqual(mockAccountSettings);
      });
    });

    describe('when the prechat form is not required', () => {
      beforeEach(() => {
        mockAccountSettings = { forms: { pre_chat_form: { required: false } } };
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

  describe('hideChatNotification', () => {
    let action;

    beforeEach(() => {
      mockAccountSettings = { foo: 'bar' };
      mockStore.dispatch(actions.hideChatNotification());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type HIDE_CHAT_NOTIFICATION', () => {
      expect(action.type)
        .toEqual(actionTypes.HIDE_CHAT_NOTIFICATION);
    });
  });

  describe('updateChatScreen', () => {
    let action;

    beforeEach(() => {
      mockAccountSettings = { foo: 'bar' };
      mockStore.dispatch(actions.updateChatScreen(screenTypes.CHATTING_SCREEN));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_CHAT_SCREEN ', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_CHAT_SCREEN);
    });

    it('has the updated screen in the payload', () => {
      expect(action.payload.screen)
        .toBe(screenTypes.CHATTING_SCREEN);
    });
  });

  describe('sendAttachments', () => {
    let files, action;

    beforeEach(() => {
      files = { name: 'testFile.jpg' };
      mockStore.dispatch(actions.sendAttachments(files));

      action = mockStore.getActions()[0];
    });

    it('calls sendFile on the Web SDK', () => {
      expect(mockSendFile)
        .toHaveBeenCalled();
    });

    it('dispatches a SEND_CHAT_FILE action', () => {
      expect(action)
        .toEqual(jasmine.objectContaining({
          type: actionTypes.SEND_CHAT_FILE
        }));
    });

    it('has the correct params in the payload', () => {
      expect(action.payload)
        .toEqual(jasmine.objectContaining({
          type: 'chat.file',
          uploading: true
        }));
    });

    describe('Web SDK callback', () => {
      let callbackFn, endpointData;

      beforeEach(() => {
        const sendFileCall = mockSendFile.calls.mostRecent().args;

        endpointData = { url: 'something.com/46278rfa' };

        callbackFn = sendFileCall[1];
      });

      describe('when there are no errors', () => {
        beforeEach(() => {
          callbackFn(false, endpointData);

          action = mockStore.getActions()[1];
        });

        it('dispatches a SEND_CHAT_FILE_SUCCESS action', () => {
          expect(action)
            .toEqual(jasmine.objectContaining({
              type: actionTypes.SEND_CHAT_FILE_SUCCESS
            }));
        });

        it('has the correct params in the payload', () => {
          expect(action.payload)
            .toEqual(jasmine.objectContaining({
              type: 'chat.file',
              uploading: false,
              attachment: endpointData.url
            }));
        });
      });

      describe('when there are errors', () => {
        beforeEach(() => {
          callbackFn(true);
        });

        it('dispatches a SEND_CHAT_FILE_FAILURE action', () => {
          expect(mockStore.getActions()[1])
            .toEqual(jasmine.objectContaining({
              type: actionTypes.SEND_CHAT_FILE_FAILURE
            }));
        });
      });
    });
  });
});
