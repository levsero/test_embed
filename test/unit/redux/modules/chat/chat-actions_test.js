import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  screenTypes,
  mockStore,
  mockAccountSettings,
  mockIsChatting,
  mockSendChatMsg = jasmine.createSpy('sendChatMsg'),
  mockSendTyping = jasmine.createSpy('sendTyping'),
  mockSetVisitorInfo = jasmine.createSpy('mockSetVisitorInfo'),
  mockEndChat = jasmine.createSpy('endChat'),
  mockSendChatRating = jasmine.createSpy('sendChatRating'),
  mockSendChatComment = jasmine.createSpy('sendChatComment'),
  mockSendFile = jasmine.createSpy('sendFile'),
  mockSendEmailTranscript = jasmine.createSpy('sendEmailTranscript'),
  mockSetVisitorDefaultDepartment = jasmine.createSpy('setVisitorDefaultDepartment'),
  showRatingScreen = false,
  getShowRatingScreenSpy = jasmine.createSpy('getShowRatingScreenSpy').and.callFake(() => showRatingScreen);

const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);
const mockVisitor = { display_name: 'Visitor 123', nick: 'visitor' };

describe('chat redux actions', () => {
  beforeEach(() => {
    mockery.enable();

    mockStore = createMockStore({
      chat: {
        visitor: mockVisitor
      }
    });

    mockIsChatting = false;

    initMockRegistry({
      'chat-web-sdk': {
        sendChatMsg: mockSendChatMsg,
        sendTyping: mockSendTyping,
        endChat: mockEndChat,
        setVisitorInfo: mockSetVisitorInfo,
        sendChatRating: mockSendChatRating,
        sendChatComment: mockSendChatComment,
        sendFile: mockSendFile,
        sendEmailTranscript: mockSendEmailTranscript,
        setVisitorDefaultDepartment: mockSetVisitorDefaultDepartment,
        isChatting: () => true,
        _getAccountSettings: () => mockAccountSettings
      },
      'src/redux/modules/chat/chat-selectors': {
        getChatVisitor: () => mockVisitor,
        getShowRatingScreen: getShowRatingScreenSpy,
        getIsChatting: () => mockIsChatting
      }
    });

    const actionsPath = buildSrcPath('redux/modules/chat');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');
    const screenTypesPath = buildSrcPath('redux/modules/chat/chat-screen-types');

    mockery.registerAllowable(actionsPath);
    mockery.registerAllowable(actionTypesPath);
    mockery.registerAllowable(screenTypesPath);

    actions = requireUncached(actionsPath);
    actionTypes = requireUncached(actionTypesPath);
    screenTypes = requireUncached(screenTypesPath);

    mockStore = createMockStore({
      chat: {
        visitor: mockVisitor,
        rating: {},
        accountSettings: {
          rating: {}
        }
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

  describe('handleChatBoxChange', () => {
    let message,
      action;

    beforeEach(() => {
      message = 'new message';
      mockStore.dispatch(actions.handleChatBoxChange(message));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type CHAT_BOX_CHANGED', () => {
      expect(action.type)
        .toEqual(actionTypes.CHAT_BOX_CHANGED);
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

    describe('when the visitor.nick is blank', () => {
      beforeEach(() => {
        const mockState = mockStore.getState();

        delete mockState.chat.visitor.nick;
        mockStore = createMockStore(mockState);
        mockStore.dispatch(actions.sendMsg(message));
      });

      it('does not dispatch a CHAT_MSG_REQUEST_SENT action', () => {
        expect(mockStore.getActions().map((action) => action.type))
          .not
          .toContain(actionTypes.CHAT_MSG_REQUEST_SENT);
      });
    });

    describe('when the visitor.nick is set', () => {
      beforeEach(() => {
        const mockState = mockStore.getState();

        mockState.chat.visitor.nick = 'visitor';
        mockStore = createMockStore(mockState);
        mockStore.dispatch(actions.sendMsg(message));
      });

      it('dispatches a CHAT_MSG_REQUEST_SENT action', () => {
        expect(mockStore.getActions().map((action) => action.type))
          .toContain(actionTypes.CHAT_MSG_REQUEST_SENT);
      });

      it('sets pending on the payload to true', () => {
        expect(
          mockStore.getActions()
            .find((action) => action.type === actionTypes.CHAT_MSG_REQUEST_SENT)
            .payload
            .pending
        )
          .toEqual(true);
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

        it('dispatches a CHAT_MSG_REQUEST_SUCCESS action with the message in payload', () => {
          expect(mockStore.getActions().map((action) => action.type))
            .toContain(actionTypes.CHAT_MSG_REQUEST_SUCCESS);
        });

        it('sets the message on the payload', () => {
          expect(
            mockStore.getActions()
              .find((action) => action.type === actionTypes.CHAT_MSG_REQUEST_SUCCESS)
              .payload
              .msg
          )
            .toEqual(message);
        });

        it('sets pending on the payload to false', () => {
          expect(
            mockStore.getActions()
              .find((action) => action.type === actionTypes.CHAT_MSG_REQUEST_SUCCESS)
              .payload
              .pending
          )
            .toEqual(false);
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

        it('dispatches a CHAT_MSG_REQUEST_FAILURE action with the errors in the payload', () => {
          expect(mockStore.getActions())
            .toContain({
              type: actionTypes.CHAT_MSG_REQUEST_FAILURE,
              payload: errors
            });
        });
      });
    });
  });

  describe('endChat', () => {
    const makeEndChatCall = (...args) => {
      mockEndChat.calls.mostRecent().args[0](...args);
    };

    beforeEach(() => {
      mockStore.dispatch(actions.endChat());
    });

    it('calls endChat on the Web SDK', () => {
      expect(mockEndChat)
        .toHaveBeenCalled();
    });

    describe('Web SDK callback', () => {
      describe('when there are no errors', () => {
        beforeEach(() => {
          makeEndChatCall();
        });

        it('dispatches a END_CHAT_REQUEST_SUCCESS action', () => {
          expect(mockStore.getActions())
            .toContain({
              type: actionTypes.END_CHAT_REQUEST_SUCCESS
            });
        });
      });

      describe('when there are errors', () => {
        beforeEach(() => {
          makeEndChatCall(['error!']);
        });

        it('dispatches a END_CHAT_REQUEST_FAILURE action', () => {
          expect(mockStore.getActions())
            .toContain({
              type: actionTypes.END_CHAT_REQUEST_FAILURE
            });
        });
      });
    });
  });

  describe('endChatViaPostChatScreen', () => {
    beforeEach(() => {
      mockStore.clearActions();
    });

    describe('when the getShowRatingScreen selector returns true', () => {
      beforeEach(() => {
        showRatingScreen = true;
        mockStore.dispatch(actions.endChatViaPostChatScreen());
      });

      it('dispatches an UPDATE_CHAT_SCREEN action with the FEEDBACK_SCREEN', () => {
        expect(mockStore.getActions())
          .toContain({
            type: actionTypes.UPDATE_CHAT_SCREEN,
            payload: { screen: screenTypes.FEEDBACK_SCREEN }
          });
      });
    });

    describe('when the getShowRatingScreen selector returns false', () => {
      beforeEach(() => {
        showRatingScreen = false;
        mockStore.dispatch(actions.endChatViaPostChatScreen());
      });

      it('does not dispatch an UPDATE_CHAT_SCREEN action with the FEEDBACK_SCREEN', () => {
        expect(mockStore.getActions())
          .not
          .toContain({
            type: actionTypes.UPDATE_CHAT_SCREEN,
            payload: { screen: screenTypes.FEEDBACK_SCREEN }
          });
      });
    });
  });

  describe('setVisitorInfo', () => {
    beforeEach(() => {
      const info = { email: 'x@x.com' };

      mockStore.dispatch(actions.setVisitorInfo(info));
    });

    it('dispatches a SET_VISITOR_INFO_REQUEST_PENDING action', () => {
      const expected = { type: actionTypes.SET_VISITOR_INFO_REQUEST_PENDING };

      expect(mockStore.getActions())
        .toContain(jasmine.objectContaining(expected));
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

        it('dispatches a SET_VISITOR_INFO_REQUEST_SUCCESS action with the correct payload', () => {
          expect(mockStore.getActions())
            .toContain({
              type: actionTypes.SET_VISITOR_INFO_REQUEST_SUCCESS,
              payload: { email: 'x@x.com' }
            });
        });
      });

      describe('when there are errors', () => {
        beforeEach(() => {
          callbackFn(['error!']);
        });

        it('dispatches a SET_VISITOR_INFO_REQUEST_FAILURE action', () => {
          expect(mockStore.getActions())
            .toContain({
              type: actionTypes.SET_VISITOR_INFO_REQUEST_FAILURE
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

        it('dispatches a CHAT_RATING_REQUEST_SUCCESS action with the correct payload', () => {
          expect(mockStore.getActions())
            .toContain({
              type: actionTypes.CHAT_RATING_REQUEST_SUCCESS,
              payload: 'good'
            });
        });
      });

      describe('when there are errors', () => {
        beforeEach(() => {
          callbackFn(['error!']);
        });

        it('dispatches a CHAT_RATING_REQUEST_FAILURE action', () => {
          expect(mockStore.getActions())
            .toContain({
              type: actionTypes.CHAT_RATING_REQUEST_FAILURE
            });
        });
      });
    });
  });

  describe('sendEmailTranscript', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.sendEmailTranscript('some@email.com'));
      action = mockStore.getActions()[0];
    });

    it('should dispatch an EMAIL_TRANSCRIPT_REQUEST_SENT action', () => {
      expect(action)
        .toEqual({
          type: actionTypes.EMAIL_TRANSCRIPT_REQUEST_SENT,
          payload: 'some@email.com'
        });
    });

    it('calls sendEmailTranscript on web sdk', () => {
      expect(mockSendEmailTranscript)
        .toHaveBeenCalled();
    });

    describe('web sdk callback', () => {
      let callbackFn;

      beforeEach(() => {
        callbackFn = mockSendEmailTranscript.calls.mostRecent().args[1];
      });

      describe('when there are no errors', () => {
        beforeEach(() => {
          callbackFn(null);
          action = mockStore.getActions()[1];
        });

        it('dispatches an EMAIL_TRANSCRIPT_SUCCESS action', () => {
          expect(action)
            .toEqual({
              type: actionTypes.EMAIL_TRANSCRIPT_SUCCESS,
              payload: 'some@email.com'
            });
        });
      });

      describe('when there are errors', () => {
        beforeEach(() => {
          callbackFn(true);
          action = mockStore.getActions()[1];
        });

        it('dispatches an EMAIL_TRANSCRIPT_FAILURE action', () => {
          expect(action)
            .toEqual({
              type: actionTypes.EMAIL_TRANSCRIPT_FAILURE,
              payload: 'some@email.com'
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

        it('dispatches a CHAT_RATING_COMMENT_REQUEST_SUCCESS action with the correct payload', () => {
          expect(mockStore.getActions())
            .toContain({
              type: actionTypes.CHAT_RATING_COMMENT_REQUEST_SUCCESS,
              payload: rating
            });
        });
      });

      describe('when there are errors', () => {
        beforeEach(() => {
          mockEndChat.calls.reset();
          callbackFn(['error!']);
        });

        it('dispatches a CHAT_RATING_COMMENT_REQUEST_FAILURE action', () => {
          expect(mockStore.getActions())
            .toContain({
              type: actionTypes.CHAT_RATING_COMMENT_REQUEST_FAILURE
            });
        });

        it('does not call endChat', () => {
          expect(mockEndChat)
            .not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('getAccountSettings', () => {
    let updateAccountSettingsAction;

    describe('when the prechat form is required', () => {
      let updateScreenAction;

      beforeEach(() => {
        mockAccountSettings = {
          forms: { pre_chat_form: { required: true } }
        };
        mockStore.dispatch(actions.getAccountSettings());
        updateScreenAction = mockStore.getActions()[0];
        updateAccountSettingsAction = mockStore.getActions()[1];
      });

      describe('when isChatting is false', () => {
        it('dispatches updateChatScreen action with the prechat screen', () => {
          expect(updateScreenAction)
            .toEqual({
              type: actionTypes.UPDATE_CHAT_SCREEN,
              payload: { screen: screenTypes.PRECHAT_SCREEN }
            });
        });
      });

      describe('when isChatting is true', () => {
        let action;

        beforeEach(() => {
          mockAccountSettings = {
            forms: { pre_chat_form: { required: true } }
          };
          mockStore.clearActions();
          mockIsChatting = true;
          mockStore.dispatch(actions.getAccountSettings());
          action = mockStore.getActions()[0];
        });

        it('does not dispatch updateChatScreen', () => {
          expect(action.type)
            .toEqual(actionTypes.GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS);
        });
      });

      it('dispatches an action of type GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS', () => {
        expect(updateAccountSettingsAction.type)
          .toBe(actionTypes.GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS);
      });

      it('has the value returned from zChat._getAccountSettings() in the payload', () => {
        expect(updateAccountSettingsAction.payload)
          .toEqual(mockAccountSettings);
      });
    });

    describe('when the prechat form is not required', () => {
      beforeEach(() => {
        mockAccountSettings = {
          forms: { pre_chat_form: { required: false } }
        };
        mockStore.dispatch(actions.getAccountSettings());
        updateAccountSettingsAction = mockStore.getActions()[0];
      });

      it('dispatches an action of type GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS', () => {
        expect(updateAccountSettingsAction.type)
          .toEqual(actionTypes.GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS);
      });

      it('has the value returned from zChat._getAccountSettings() in the payload', () => {
        expect(updateAccountSettingsAction.payload)
          .toEqual(mockAccountSettings);
      });
    });
  });

  describe('handleSoundIconClick', () => {
    let action,
      setting;

    beforeEach(() => {
      setting = { sound: true };
      mockStore.dispatch(actions.handleSoundIconClick(setting));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type SOUND_ICON_CLICKED ', () => {
      expect(action.type)
        .toEqual(actionTypes.SOUND_ICON_CLICKED);
    });

    it('has the settings in the payload', () => {
      expect(action.payload)
        .toBe(setting);
    });
  });

  describe('chatNotificationDismissed', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.chatNotificationDismissed());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type CHAT_NOTIFICATION_DISMISSED', () => {
      expect(action.type)
        .toEqual(actionTypes.CHAT_NOTIFICATION_DISMISSED);
    });
  });

  describe('chatNotificationRespond', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.chatNotificationRespond());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type CHAT_NOTIFICATION_RESPONDED', () => {
      expect(action.type)
        .toEqual(actionTypes.CHAT_NOTIFICATION_RESPONDED);
    });
  });

  describe('updateChatScreen', () => {
    let action;

    beforeEach(() => {
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

  describe('sendAttachment', () => {
    let fileList,
      dispatchedActions;

    beforeEach(() => {
      fileList = [
        {
          name: 'icecream.png',
          size: 512,
          type: 'image/png'
        },
        {
          name: 'rainbows.jpg',
          size: 128,
          type: 'image/jpeg'
        },
        {
          name: 'tulips.gif',
          size: 64,
          type: 'image/gif'
        }
      ];

      mockStore.dispatch(actions.sendAttachments(fileList));
      dispatchedActions = mockStore.getActions();
    });

    it('calls sendFile on the Web SDK', () => {
      expect(mockSendFile.calls.count()).toBe(fileList.length);
    });

    it('dispatches a CHAT_FILE_REQUEST_SENT action for each file', () => {
      for (var i=0; i < fileList.length; i++) {
        expect(dispatchedActions[i].type)
          .toEqual(actionTypes.CHAT_FILE_REQUEST_SENT);
      }
    });

    it('has the correct params in the payload for each file', () => {
      for (var i=0; i < fileList.length; i++) {
        expect(dispatchedActions[i].payload)
          .toEqual(jasmine.objectContaining({
            type: 'chat.file',
            timestamp: Date.now(),
            nick: mockVisitor.nick,
            display_name: mockVisitor.display_name,
            file: {
              ...fileList[i],
              uploading: true
            }
          }));
      }
    });

    describe('Web SDK callback', () => {
      let mostRecentAction,
        callbackFn,
        data,
        err;

      beforeEach(() => {
        const sendFileCall = mockSendFile.calls.mostRecent().args;

        data = { url: 'something.com/46278rfa' };
        callbackFn = sendFileCall[1];
      });

      describe('when there are no errors', () => {
        beforeEach(() => {
          callbackFn(false, data);
          mostRecentAction = _.last(mockStore.getActions());
        });

        it('dispatches a CHAT_FILE_REQUEST_SUCCESS action', () => {
          expect(mostRecentAction.type)
            .toEqual(actionTypes.CHAT_FILE_REQUEST_SUCCESS);
        });

        it('has the correct params in the payload', () => {
          expect(mostRecentAction.payload)
            .toEqual(jasmine.objectContaining({
              type: 'chat.file',
              timestamp: Date.now(),
              nick: mockVisitor.nick,
              display_name: mockVisitor.display_name,
              file: {
                ...fileList[fileList.length - 1],
                url: data.url,
                uploading: false
              }
            }));
        });
      });

      describe('when there are errors', () => {
        beforeEach(() => {
          err = { message: 'EXCEED_SIZE_ERROR' };
          callbackFn(err, data);
          mostRecentAction = _.last(mockStore.getActions());
        });

        it('dispatches a CHAT_FILE_REQUEST_FAILURE action', () => {
          expect(mostRecentAction.type)
            .toEqual(actionTypes.CHAT_FILE_REQUEST_FAILURE);
        });

        it('has the correct params in the payload', () => {
          expect(mostRecentAction.payload)
            .toEqual(jasmine.objectContaining({
              type: 'chat.file',
              timestamp: Date.now(),
              nick: mockVisitor.nick,
              display_name: mockVisitor.display_name,
              file: {
                ...fileList[fileList.length - 1],
                error: err,
                uploading: false
              }
            }));
        });
      });
    });
  });

  describe('newAgentMessageReceived', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.newAgentMessageReceived());
      action = mockStore.getActions()[0];
    });

    it('dispatches a NEW_AGENT_MESSAGE_RECEIVED action', () => {
      const expected = { type: actionTypes.NEW_AGENT_MESSAGE_RECEIVED };

      expect(action)
        .toEqual(expected);
    });
  });

  describe('chatOpened', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.chatOpened());
      action = mockStore.getActions()[0];
    });

    it('dispatches a CHAT_OPENED action', () => {
      const expected = { type: actionTypes.CHAT_OPENED };

      expect(action)
        .toEqual(expected);
    });
  });

  describe('resetEmailTranscript', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.resetEmailTranscript());
      action = mockStore.getActions()[0];
    });

    it('dispatches RESET_EMAIL_TRANSCRIPT action', () => {
      expect(action)
        .toEqual({
          type: actionTypes.RESET_EMAIL_TRANSCRIPT
        });
    });
  });

  describe('getIsChatting', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.getIsChatting());
      action = mockStore.getActions()[0];
    });

    it('dispatches IS_CHATTING action', () => {
      expect(action.type)
        .toEqual(actionTypes.IS_CHATTING);
    });

    it('has the value from zChat.getIsChatting in the payload', () => {
      expect(action.payload)
        .toEqual(true);
    });
  });

  describe('chatOfflineFormChanged', () => {
    let action,
      mockFormState;

    beforeEach(() => {
      mockFormState = {
        name: 'Terence',
        phone: '123456789',
        message: 'foo bar'
      };

      mockStore.dispatch(actions.chatOfflineFormChanged(mockFormState));
      action = mockStore.getActions()[0];
    });

    it('dispatches CHAT_OFFLINE_FORM_CHANGED action', () => {
      expect(action.type)
        .toEqual(actionTypes.CHAT_OFFLINE_FORM_CHANGED);
    });

    it('has the correct params in the payload', () => {
      expect(action.payload)
        .toEqual(jasmine.objectContaining(mockFormState));
    });
  });

  describe('setDepartment', () => {
    const departmentId = 12345;
    const successCallbackSpy = jasmine.createSpy('successCallback');
    const errCallbackSpy = jasmine.createSpy('errCallback');

    beforeEach(() => {
      mockStore.dispatch(
        actions.setDepartment(departmentId, successCallbackSpy, errCallbackSpy)
      );
    });

    afterEach(() => {
      successCallbackSpy.calls.reset();
      errCallbackSpy.calls.reset();
    });

    it('calls setVisitorDefaultDepartment on the Web SDK', () => {
      expect(mockSetVisitorDefaultDepartment)
        .toHaveBeenCalled();
    });

    describe('Web SDK callback', () => {
      let callbackFn;

      beforeEach(() => {
        const setVisitorDefaultDepartmentCalls = mockSetVisitorDefaultDepartment.calls.mostRecent().args;

        callbackFn = setVisitorDefaultDepartmentCalls[1];
      });

      describe('when there are no errors', () => {
        beforeEach(() => {
          callbackFn();
        });

        it('calls the success callback function and not the error callback function', () => {
          expect(successCallbackSpy)
            .toHaveBeenCalled();

          expect(errCallbackSpy)
            .not
            .toHaveBeenCalled();
        });
      });

      describe('when there are errors', () => {
        beforeEach(() => {
          callbackFn(['error!']);
        });

        it('calls the error callback function and not the success callback function', () => {
          expect(errCallbackSpy)
            .toHaveBeenCalled();

          expect(successCallbackSpy)
            .not
            .toHaveBeenCalled();
        });
      });
    });
  });

  describe('handlePreChatFormChange', () => {
    let action;
    const payload = {
      name: 'name',
      email: 'foo@bar.com'
    };

    beforeEach(() => {
      mockStore.dispatch(actions.handlePreChatFormChange(payload));
      action = mockStore.getActions()[0];
    });

    it('dispatches a PRE_CHAT_FORM_ON_CHANGE action with the payload passed in', () => {
      const expected = {
        type: actionTypes.PRE_CHAT_FORM_ON_CHANGE,
        payload
      };

      expect(action)
        .toEqual(expected);
    });
  });

  describe('updateContactDetailsVisibility', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.updateContactDetailsVisibility(true));
      action = mockStore.getActions()[0];
    });

    it('dispatches UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY action', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_CHAT_CONTACT_DETAILS_VISIBILITY);
    });

    it('has the correct params in the payload', () => {
      expect(action.payload)
        .toEqual(true);
    });
  });
});
