import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

let actions,
  actionTypes,
  mockStore,
  mockSendChatMsg = jasmine.createSpy('sendChatMsg');

const middlewares = [thunk];
const createMockStore = configureMockStore(middlewares);

describe('chat redux actions', () => {
  beforeAll(() => {
    mockery.enable();

    initMockRegistry({
      'vendor/web-sdk': {
        sendChatMsg: mockSendChatMsg
      }
    });

    const actionsPath = buildSrcPath('redux/modules/chat');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

    mockery.registerAllowable(actionsPath);
    mockery.registerAllowable(actionTypesPath);

    actions = requireUncached(actionsPath);
    actionTypes = requireUncached(actionTypesPath);

    jasmine.clock().install();
    jasmine.clock().mockDate(Date.now());
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
    jasmine.clock().uninstall();
  });

  describe('updateCurrentMsg', () => {
    let action;

    beforeEach(() => {
      action = actions.updateCurrentMsg('new message');
    });

    it('creates an action of type UPDATE_CURRENT_MSG', () => {
      expect(action.type)
        .toEqual(actionTypes.UPDATE_CURRENT_MSG);
    });

    it('has the message in the payload', () => {
      expect(action.payload)
        .toEqual('new message');
    });
  });

  describe('sendMsg', () => {
    let message,
      mockVisitor;

    beforeAll(() => {
      message = 'Hi there';
      mockVisitor = {
        display_name: 'Visitor 123', // eslint-disable-line camelcase
        nick: 'visitor'
      };
      mockStore = createMockStore({
        chat: {
          visitor: mockVisitor
        }
      });
    });

    beforeEach(() => {
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
                display_name: mockVisitor.display_name // eslint-disable-line camelcase
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
});
