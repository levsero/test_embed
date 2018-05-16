import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  screenTypes,
  CHAT_MESSAGE_TYPES,
  mockStore,
  mockAccountSettings,
  mockOperatingHours,
  mockIsChatting,
  mockChatStandalone,
  mockChatOnline,
  mockSendChatMsg = jasmine.createSpy('sendChatMsg'),
  mockSendTyping = jasmine.createSpy('sendTyping'),
  mockSetVisitorInfo = jasmine.createSpy('mockSetVisitorInfo'),
  mockEndChat = jasmine.createSpy('endChat'),
  mockSendChatRating = jasmine.createSpy('sendChatRating'),
  mockSendChatComment = jasmine.createSpy('sendChatComment'),
  mockSendFile = jasmine.createSpy('sendFile'),
  mockSendEmailTranscript = jasmine.createSpy('sendEmailTranscript'),
  mockSetVisitorDefaultDepartment = jasmine.createSpy('setVisitorDefaultDepartment'),
  mockClearVisitorDefaultDepartment = jasmine.createSpy('mockClearVisitorDefaultDepartment'),
  mockSendOfflineMsg = jasmine.createSpy('sendOfflineMsg'),
  mockReconnect = jasmine.createSpy('reconnect'),
  showRatingScreen = false,
  getActiveAgentsSpy = jasmine.createSpy('getActiveAgents'),
  getShowRatingScreenSpy = jasmine.createSpy('getShowRatingScreenSpy').and.callFake(() => showRatingScreen),
  getIsChattingSpy = jasmine.createSpy('getIsChatting').and.callFake(() => mockIsChatting),
  mockFetchChatHistory = jasmine.createSpy('fetchChatHistory');

const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);
const mockVisitor = { display_name: 'Visitor 123', nick: 'visitor' };
const broadcastSpy = jasmine.createSpy('broadcast');

describe('chat redux actions', () => {
  beforeEach(() => {
    mockery.enable();

    const chatConstantsPath = buildSrcPath('constants/chat');
    const actionsPath = buildSrcPath('redux/modules/chat');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');
    const screenTypesPath = buildSrcPath('redux/modules/chat/chat-screen-types');
    const chatConstants = requireUncached(chatConstantsPath);

    mockIsChatting = false;
    mockChatStandalone = false;
    mockery.registerAllowable(actionsPath);
    mockery.registerAllowable(actionTypesPath);
    mockery.registerAllowable(screenTypesPath);
    mockery.registerAllowable(chatConstantsPath);

    CHAT_MESSAGE_TYPES = chatConstants.CHAT_MESSAGE_TYPES;

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
        clearVisitorDefaultDepartment: mockClearVisitorDefaultDepartment,
        isChatting: () => true,
        sendOfflineMsg: mockSendOfflineMsg,
        reconnect: mockReconnect,
        getAccountSettings: () => mockAccountSettings,
        getOperatingHours: () => mockOperatingHours,
        fetchChatHistory: mockFetchChatHistory,
        on: noop
      },
      'src/redux/modules/base/base-selectors': {
        getChatStandalone: () => mockChatStandalone
      },
      'src/redux/modules/chat/chat-selectors': {
        getChatVisitor: () => mockVisitor,
        getShowRatingScreen: getShowRatingScreenSpy,
        getIsChatting: getIsChattingSpy,
        getChatOnline: () => mockChatOnline,
        getActiveAgents: getActiveAgentsSpy
      },
      'src/constants/chat': {
        CHAT_MESSAGE_TYPES
      },
      'service/mediator': {
        mediator: {
          channel: {
            broadcast: broadcastSpy
          }
        }
      }
    });

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

  describe('resetCurrentMessage', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.resetCurrentMessage());
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type RESET_CURRENT_MESSAGE', () => {
      expect(action.type)
        .toEqual(actionTypes.RESET_CURRENT_MESSAGE);
    });
  });

  describe('handleChatBoxChange', () => {
    let message,
      action;

    beforeEach(() => {
      mockStore.dispatch(actions.handleChatBoxChange(message));
      action = mockStore.getActions()[0];
    });

    afterEach(() => {
      mockSendTyping.calls.reset();
    });

    describe('when message length greater than 0', () => {
      beforeAll(() => {
        message = 'new message';
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
    });

    describe('when message length is 0', () => {
      beforeAll(() => {
        message = '';
      });

      it('dispatches an action of type CHAT_BOX_CHANGED', () => {
        expect(action.type)
          .toEqual(actionTypes.CHAT_BOX_CHANGED);
      });

      it('has the message in the payload', () => {
        expect(action.payload)
          .toEqual(message);
      });

      it('calls sendTyping(false) on the Web SDK', () => {
        expect(mockSendTyping)
          .toHaveBeenCalledWith(false);
      });
    });
  });

  describe('sendMsg', () => {
    let message;

    beforeEach(() => {
      message = 'Hi there';
      mockStore.dispatch(actions.sendMsg(message));
    });

    it('calls sendTyping with false', () => {
      expect(mockSendTyping)
        .toHaveBeenCalledWith(false);
    });

    it('calls sendChatMsg on the Web SDK', () => {
      expect(mockSendChatMsg)
        .toHaveBeenCalled();
    });

    it('dispatches a CHAT_MSG_REQUEST_SENT action', () => {
      expect(mockStore.getActions().map((action) => action.type))
        .toContain(actionTypes.CHAT_MSG_REQUEST_SENT);
    });

    it('sets status of payload to CHAT_MESSAGE_PENDING', () => {
      expect(
        mockStore.getActions()
          .find((action) => action.type === actionTypes.CHAT_MSG_REQUEST_SENT)
          .payload
          .status
      )
        .toEqual(CHAT_MESSAGE_TYPES.CHAT_MESSAGE_PENDING);
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

        it('sets status of payload CHAT_MESSAGE_SUCCESS', () => {
          expect(
            mockStore.getActions()
              .find((action) => action.type === actionTypes.CHAT_MSG_REQUEST_SUCCESS)
              .payload
              .status
          )
            .toEqual(CHAT_MESSAGE_TYPES.CHAT_MESSAGE_SUCCESS);
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
          expect(mockStore.getActions().map((action) => action.type))
            .toContain(actionTypes.CHAT_MSG_REQUEST_FAILURE);
        });

        it('sets the message on the payload', () => {
          expect(
            mockStore.getActions()
              .find((action) => action.type === actionTypes.CHAT_MSG_REQUEST_FAILURE)
              .payload
              .msg
          )
            .toEqual(message);
        });

        it('sets status of payload CHAT_MESSAGE_FAILURE', () => {
          expect(
            mockStore.getActions()
              .find((action) => action.type === actionTypes.CHAT_MSG_REQUEST_FAILURE)
              .payload
              .status
          )
            .toEqual(CHAT_MESSAGE_TYPES.CHAT_MESSAGE_FAILURE);
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

        it('dispatches a CHAT_ALL_AGENTS_INACTIVE action', () => {
          expect(mockStore.getActions()[0].type)
            .toContain(actionTypes.CHAT_ALL_AGENTS_INACTIVE);
        });

        it('dispatches a END_CHAT_REQUEST_SUCCESS action', () => {
          expect(mockStore.getActions()[1].type)
            .toContain(actionTypes.END_CHAT_REQUEST_SUCCESS);
        });

        it('calls getActiveAgents selector', () => {
          expect(getActiveAgentsSpy)
            .toHaveBeenCalled();
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
    let info,
      timestamp;

    beforeEach(() => {
      info = { email: 'x@x.com' };
      timestamp = Date.now();

      mockStore.dispatch(actions.setVisitorInfo(info, timestamp));
    });

    it('dispatches a SET_VISITOR_INFO_REQUEST_PENDING action', () => {
      const expected = {
        type: actionTypes.SET_VISITOR_INFO_REQUEST_PENDING,
        payload: { ...info, timestamp }
      };

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
              payload: { email: 'x@x.com', timestamp }
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
          forms: { pre_chat_form: { required: true } },
          chat_button: { hide_when_offline: false }
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
            forms: { pre_chat_form: { required: true } },
            chat_button: { hide_when_offline: false }
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

      it('has the value returned from zChat.getAccountSettings() in the payload', () => {
        expect(updateAccountSettingsAction.payload)
          .toEqual(mockAccountSettings);
      });
    });

    describe('when the prechat form is not required', () => {
      beforeEach(() => {
        mockAccountSettings = {
          forms: { pre_chat_form: { required: false } },
          chat_button: { hide_when_offline: false }
        };
        mockStore.dispatch(actions.getAccountSettings());
        updateAccountSettingsAction = mockStore.getActions()[0];
      });

      it('dispatches an action of type GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS', () => {
        expect(updateAccountSettingsAction.type)
          .toEqual(actionTypes.GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS);
      });

      it('has the value returned from zChat.getAccountSettings() in the payload', () => {
        expect(updateAccountSettingsAction.payload)
          .toEqual(mockAccountSettings);
      });
    });

    describe('when hide_when_offline is false', () => {
      beforeEach(() => {
        mockAccountSettings = {
          forms: { pre_chat_form: { required: false } },
          chat_button: { hide_when_offline: false }
        };
      });

      describe('when chat is not standalone', () => {
        beforeEach(() => {
          mockStore.dispatch(actions.getAccountSettings());
        });

        it('does not broadcast to mediator', () => {
          expect(broadcastSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('when chat is standalone', () => {
        beforeEach(() => {
          mockChatStandalone = true;
        });

        describe('when chat is online', () => {
          beforeEach(() => {
            mockChatOnline = true;
            mockStore.dispatch(actions.getAccountSettings());
          });

          it('does not broadcast to mediator', () => {
            expect(broadcastSpy)
              .not.toHaveBeenCalledWith('newChat.offlineFormOn');
          });
        });

        describe('when chat is offline', () => {
          beforeEach(() => {
            mockChatOnline = false;
            mockStore.dispatch(actions.getAccountSettings());
          });

          it('broadcasts show to mediator', () => {
            expect(broadcastSpy)
              .toHaveBeenCalledWith('newChat.offlineFormOn');
          });
        });
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
    const agentMessage = { nick: 'agent:007', msg: 'hello, world' };

    beforeEach(() => {
      mockStore.dispatch(actions.newAgentMessageReceived(agentMessage));
      action = mockStore.getActions()[0];
    });

    it('dispatches a NEW_AGENT_MESSAGE_RECEIVED action', () => {
      expect(action.type)
        .toEqual(actionTypes.NEW_AGENT_MESSAGE_RECEIVED);
    });

    it('has the agent message in the payload', () => {
      expect(action.payload)
        .toEqual(agentMessage);
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

  describe('getOperatingHours', () => {
    let updateOperatingHoursAction;

    describe('when operating hours enabled', () => {
      beforeEach(() => {
        mockOperatingHours = {
          account_schedule: [[456]]
        };

        mockStore.dispatch(actions.getOperatingHours());
        updateOperatingHoursAction = mockStore.getActions()[0];
      });

      it('dispatches an action of type GET_OPERATING_HOURS_REQUEST_SUCCESS', () => {
        expect(updateOperatingHoursAction.type)
          .toEqual(actionTypes.GET_OPERATING_HOURS_REQUEST_SUCCESS);
      });

      it('has the value returned from zChat.getOperatingHours() in the payload', () => {
        expect(updateOperatingHoursAction.payload)
          .toEqual(mockOperatingHours);
      });
    });

    describe('when operating hours disabled', () => {
      beforeEach(() => {
        mockOperatingHours = undefined;
        mockStore.dispatch(actions.getOperatingHours());
      });

      it('does not dispatches an action of type GET_OPERATING_HOURS_REQUEST_SUCCESS', () => {
        expect(mockStore.getActions().length)
          .toEqual(0);
      });
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

  describe('clearDepartment', () => {
    const successCallbackSpy = jasmine.createSpy('successCallbackSpy');

    beforeEach(() => {
      mockStore.dispatch(
        actions.clearDepartment(successCallbackSpy)
      );
    });

    it('calls clearVisitorDefaultDepartment on the Web SDK', () => {
      expect(mockClearVisitorDefaultDepartment)
        .toHaveBeenCalled();
    });

    describe('Web SDK callback', () => {
      let callbackFn;

      beforeEach(() => {
        const clearVisitorDefaultDepartmentCalls = mockClearVisitorDefaultDepartment.calls.mostRecent().args;

        callbackFn = clearVisitorDefaultDepartmentCalls[0];

        callbackFn();
      });

      it('calls success callback', () => {
        expect(successCallbackSpy)
          .toHaveBeenCalled();
      });
    });
  });

  describe('sendOfflineMessage', () => {
    let action,
      callbackSuccessSpy,
      callbackFailureSpy;
    const mockFormState = {
      name: 'Boromir',
      email: 'boromir@gondor.nw',
      message: 'One does not simply walk into Mordor'
    };

    beforeEach(() => {
      callbackSuccessSpy = jasmine.createSpy('callbackSuccess');
      callbackFailureSpy = jasmine.createSpy('callbackFailure');

      mockStore.dispatch(actions.sendOfflineMessage(mockFormState, callbackSuccessSpy, callbackFailureSpy));
      action = mockStore.getActions()[0];
    });

    it('calls sendOfflineMsg on the Web SDK', () => {
      expect(mockSendOfflineMsg)
        .toHaveBeenCalled();
    });

    it('dispatches OFFLINE_FORM_REQUEST_SENT action', () => {
      expect(action.type)
        .toEqual(actionTypes.OFFLINE_FORM_REQUEST_SENT);
    });

    it('does not call callbackSuccess', () => {
      expect(callbackSuccessSpy)
        .not
        .toHaveBeenCalled();
    });

    it('does not call callbackFailure', () => {
      expect(callbackFailureSpy)
        .not
        .toHaveBeenCalled();
    });

    describe('Web SDK callback', () => {
      let callbackFn;

      beforeEach(() => {
        const sendOfflineMsgCalls = mockSendOfflineMsg.calls.mostRecent().args;

        callbackFn = sendOfflineMsgCalls[1];
      });

      describe('when there are no errors', () => {
        beforeEach(() => {
          callbackFn();
          action = mockStore.getActions()[1];
        });

        it('dispatches OFFLINE_FORM_REQUEST_SUCCESS action', () => {
          expect(action.type)
            .toEqual(actionTypes.OFFLINE_FORM_REQUEST_SUCCESS);
        });

        it('has the formState as the payload', () => {
          expect(action.payload)
            .toEqual(mockFormState);
        });

        it('calls callbackSuccess', () => {
          expect(callbackSuccessSpy)
            .toHaveBeenCalled();
        });

        it('does not call callbackFailure', () => {
          expect(callbackFailureSpy)
            .not
            .toHaveBeenCalled();
        });
      });

      describe('when there are errors', () => {
        beforeEach(() => {
          callbackFn(['error!']);
          action = mockStore.getActions()[1];
        });

        it('dispatches OFFLINE_FORM_REQUEST_FAILURE action', () => {
          expect(action.type)
            .toEqual(actionTypes.OFFLINE_FORM_REQUEST_FAILURE);
        });

        it('calls callbackFailure', () => {
          expect(callbackFailureSpy)
            .toHaveBeenCalled();
        });

        it('does not call callbackSuccess', () => {
          expect(callbackSuccessSpy)
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

  describe('updateEmailTranscriptVisibility', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.updateEmailTranscriptVisibility(true));
      action = mockStore.getActions()[0];
    });

    it('dispatches UPDATE_CHAT_EMAIL_TRANSCRIPT_VISIBILITY action', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_CHAT_EMAIL_TRANSCRIPT_VISIBILITY);
    });

    it('has the correct params in the payload', () => {
      expect(action.payload)
        .toEqual(true);
    });
  });

  describe('handleOfflineFormBack', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.handleOfflineFormBack(true));
      action = mockStore.getActions()[0];
    });

    it('dispatches OFFLINE_FORM_BACK_BUTTON_CLICKED action', () => {
      expect(action.type)
        .toEqual(actionTypes.OFFLINE_FORM_BACK_BUTTON_CLICKED);
    });
  });

  describe('updateMenuVisibility', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.updateMenuVisibility(false));
      action = mockStore.getActions()[0];
    });

    it('dispatches an action of type UPDATE_CHAT_MENU_VISIBILITY', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_CHAT_MENU_VISIBILITY);
    });

    it('has the value of the argument in the payload', () => {
      expect(action.payload)
        .toEqual(false);
    });
  });

  describe('handleReconnect', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.handleReconnect(true));
      action = mockStore.getActions()[0];
    });

    it('calls zChat.reconnect', () => {
      expect(mockReconnect)
        .toHaveBeenCalled();
    });

    it('dispatches CHAT_RECONNECT action', () => {
      expect(action.type)
        .toEqual(actionTypes.CHAT_RECONNECT);
    });
  });

  describe('showStandaloneMobileNotification', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.showStandaloneMobileNotification());
      action = mockStore.getActions()[0];
    });

    it('dispatches SHOW_STANDALONE_MOBILE_NOTIFICATION action', () => {
      expect(action.type)
        .toBe(actionTypes.SHOW_STANDALONE_MOBILE_NOTIFICATION);
    });
  });

  describe('fetchConversationHistory', () => {
    let returnedActions;

    beforeEach(() => {
      mockStore.dispatch(actions.fetchConversationHistory());
      returnedActions = mockStore.getActions();
    });

    it('calls fetchChatHistory on the Web SDK', () => {
      expect(mockFetchChatHistory)
        .toHaveBeenCalled();
    });

    it('dispatches an action of type HISTORY_REQUEST_SENT', () => {
      expect(returnedActions[0].type)
        .toEqual(actionTypes.HISTORY_REQUEST_SENT);
    });

    describe('when there are errors', () => {
      const error = 123;

      beforeAll(() => {
        mockFetchChatHistory.and.callFake((callback) => {
          callback(error);
        });
      });

      it('dispatches an action of type HISTORY_REQUEST_FAILURE', () => {
        expect(returnedActions[1].type)
          .toEqual(actionTypes.HISTORY_REQUEST_FAILURE);
      });

      it('returns the error as payload', () => {
        expect(returnedActions[1].payload)
          .toEqual(error);
      });
    });

    describe('when there are no errors', () => {
      const data = { count: 20, has_more: true };

      beforeAll(() => {
        mockFetchChatHistory.and.callFake((callback) => {
          callback(null, data);
        });
      });

      it('dispatches an action of type HISTORY_REQUEST_SUCCESS', () => {
        expect(returnedActions[1].type)
          .toEqual(actionTypes.HISTORY_REQUEST_SUCCESS);
      });

      it('returns the data as payload', () => {
        const expected = {
          ...data,
          history: []
        };

        expect(returnedActions[1].payload)
          .toEqual(expected);
      });
    });
  });

  describe('updatePreviewerScreen', () => {
    let action;

    beforeEach(() => {
      mockStore.dispatch(actions.updatePreviewerScreen('chatting'));
      action = mockStore.getActions()[0];
    });

    it('dispatches UPDATE_PREVIEWER_SCREEN action', () => {
      expect(action.type)
        .toBe(actionTypes.UPDATE_PREVIEWER_SCREEN);
    });

    it('has the correct params in the payload', () => {
      expect(action.payload)
        .toBe('chatting');
    });
  });

  describe('updatePreviewerSettings', () => {
    let action;
    const settings = { rating: { enabled: true } };

    beforeEach(() => {
      mockStore.dispatch(actions.updatePreviewerSettings(settings));
      action = mockStore.getActions()[0];
    });

    it('dispatches UPDATE_PREVIEWER_SETTINGS action', () => {
      expect(action.type)
        .toBe(actionTypes.UPDATE_PREVIEWER_SETTINGS);
    });

    it('has the correct params in the payload', () => {
      expect(action.payload)
        .toBe(settings);
    });
  });
});
