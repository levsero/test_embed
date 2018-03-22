import * as chatActionTypes from '../../../../../../src/redux/modules/chat/chat-action-types';

describe('chat reducer chats', () => {
  let reducer,
    actionTypes,
    initialState,
    CHAT_MESSAGE_TYPES;

  const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-chats');
  const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');
  const chatConstantsPath = buildSrcPath('constants/chat');
  const chatConstants = requireUncached(chatConstantsPath);

  CHAT_MESSAGE_TYPES = chatConstants.CHAT_MESSAGE_TYPES;

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'constants/chat': {
        CHAT_MESSAGE_TYPES
      }
    });

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);
    initialState = reducer(undefined, { type: '' });
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('reducer', () => {
    describe('initial state', () => {
      it('contains no entries', () => {
        expect(initialState.size)
          .toEqual(0);
      });
    });

    describe('when a CHAT_MSG_REQUEST_SENT action is dispatched', () => {
      let state,
        payload;

      beforeEach(() => {
        payload = {
          type: 'chat.msg',
          timestamp: Date.now(),
          nick: 'visitor',
          display_name: 'Visitor 123',
          msg: 'Hi'
        };

        state = reducer(initialState, {
          type: actionTypes.CHAT_MSG_REQUEST_SENT,
          payload: payload
        });
      });

      it('adds the message to the chats collection', () => {
        expect(state.size)
          .toEqual(1);

        expect(state.get(payload.timestamp))
          .toEqual(jasmine.objectContaining({
            timestamp: payload.timestamp,
            msg: payload.msg
          }));
      });
    });

    describe('when a CHAT_MSG_REQUEST_SUCCESS action is dispatched', () => {
      let state,
        payload;
      const timestamp = Date.now();

      beforeEach(() => {
        payload = {
          timestamp,
          msg: 'Hi',
          nick: 'visitor',
          display_name: 'Visitor 123'
        };
      });

      describe('when there is no chat with this timestamp', () => {
        beforeEach(() => {
          state = reducer(initialState, {
            type: actionTypes.CHAT_MSG_REQUEST_SUCCESS,
            payload: { ...payload, status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_SUCCESS }
          });
        });

        it('adds the message to the chats collection', () => {
          const expectedPayload = {
            ...payload,
            status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_SUCCESS,
            numFailedTries: 0
          };

          expect(state.size)
            .toEqual(1);

          expect(state.get(payload.timestamp))
            .toEqual(expectedPayload);
        });
      });

      describe('when there is a chat with this timestamp', () => {
        let pendingChatPayload,
          successfulChatPayload;

        beforeEach(() => {
          pendingChatPayload = { ...payload, status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_PENDING };
          successfulChatPayload = { ...payload, status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_SUCCESS };

          state = reducer(initialState, {
            type: actionTypes.CHAT_MSG_REQUEST_SENT,
            payload: pendingChatPayload
          });

          state = reducer(state, {
            type: actionTypes.CHAT_MSG_REQUEST_SUCCESS,
            payload: successfulChatPayload
          });
        });

        afterEach(() => {
          initialState.clear();
        });

        it('updates the existing chat in the chats collection', () => {
          const expectedPayload = {
            ...payload,
            status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_SUCCESS,
            numFailedTries: 0
          };

          expect(state.size)
            .toEqual(1);

          expect(state.get(payload.timestamp))
            .toEqual(expectedPayload);
        });
      });
    });

    describe('when a CHAT_MSG_REQUEST_FAILURE action is dispatched', () => {
      let state,
        payload;
      const timestamp = 123;

      beforeEach(() => {
        payload = {
          timestamp,
          msg: 'Hi',
          nick: 'visitor',
          display_name: 'Visitor 123'
        };
      });

      describe('when there is no chat with this timestamp', () => {
        beforeEach(() => {
          state = reducer(initialState, {
            type: actionTypes.CHAT_MSG_REQUEST_FAILURE,
            payload: { ...payload, status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_FAILURE }
          });
        });

        it('adds the message to the chats collection', () => {
          const expectedPayload = {
            ...payload,
            status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_FAILURE,
            numFailedTries: 1
          };

          expect(state.size)
            .toEqual(1);

          expect(state.get(payload.timestamp))
            .toEqual(expectedPayload);
        });
      });

      describe('when there is a chat with this timestamp', () => {
        let pendingChatPayload,
          failureChatPayload;

        beforeEach(() => {
          pendingChatPayload = { ...payload, status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_PENDING };
          failureChatPayload = { ...payload, status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_FAILURE };

          state = reducer(initialState, {
            type: actionTypes.CHAT_MSG_REQUEST_SENT,
            payload: pendingChatPayload
          });

          state = reducer(state, {
            type: actionTypes.CHAT_MSG_REQUEST_FAILURE,
            payload: failureChatPayload
          });
        });

        afterEach(() => {
          initialState.clear();
        });

        it('updates the existing chat in the chats collection', () => {
          const expectedPayload = {
            ...payload,
            status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_FAILURE,
            numFailedTries: 1
          };

          expect(state.size)
            .toEqual(1);

          expect(state.get(payload.timestamp))
            .toEqual(expectedPayload);
        });

        describe('when there is another failed chat', () => {
          beforeEach(() => {
            state = reducer(state, {
              type: actionTypes.CHAT_MSG_REQUEST_SENT,
              payload: pendingChatPayload
            });
            state = reducer(state, {
              type: actionTypes.CHAT_MSG_REQUEST_FAILURE,
              payload: failureChatPayload
            });
          });

          it('increments number of failed tries by 1', () => {
            const expectedPayload = {
              ...payload,
              status: CHAT_MESSAGE_TYPES.CHAT_MESSAGE_FAILURE,
              numFailedTries: 2
            };

            expect(state.size)
              .toEqual(1);

            expect(state.get(payload.timestamp))
              .toEqual(expectedPayload);
          });
        });
      });
    });

    describe('when a CHAT_FILE_REQUEST_SENT action is dispatched', () => {
      let state,
        sendPayload;

      const timestamp = Date.now();

      beforeEach(() => {
        sendPayload = {
          type: 'chat.file',
          timestamp,
          nick: 'visitor',
          display_name: 'Visitor 123',
          file: {
            uploading: true
          }
        };

        state = reducer(initialState, {
          type: actionTypes.CHAT_FILE_REQUEST_SENT,
          payload: sendPayload
        });
      });

      it('adds the attachment message to the chats collection', () => {
        expect(state.get(sendPayload.timestamp))
          .toEqual(sendPayload);
      });

      describe('when a CHAT_FILE_REQUEST_SUCCESS action is dispatched', () => {
        let successPayload;

        beforeEach(() => {
          successPayload = {
            type: 'chat.file',
            timestamp,
            nick: 'visitor',
            display_name: 'Visitor 123',
            file: {
              url: 'http://path/to/file',
              uploading: false
            }
          };
        });

        it('overrides the CHAT_FILE_REQUEST_SENT state', () => {
          expect(state.get(timestamp))
            .toBeDefined();

          expect(state.get(timestamp))
            .not
            .toEqual(successPayload);

          state = reducer(state, {
            type: actionTypes.CHAT_FILE_REQUEST_SUCCESS,
            payload: successPayload
          });

          expect(state.get(timestamp))
            .toEqual(successPayload);
        });
      });

      describe('when a CHAT_FILE_REQUEST_FAILURE action is dispatched', () => {
        let failurePayload;
        const timestamp = Date.now();

        beforeEach(() => {
          failurePayload = {
            type: 'chat.file',
            timestamp,
            nick: 'visitor',
            display_name: 'Visitor 123',
            file: {
              error: { message: 'EXCEED_SIZE_LIMIT' },
              uploading: false
            }
          };
        });

        it('overrides the CHAT_FILE_REQUEST_SENT state', () => {
          expect(state.get(timestamp))
            .toBeDefined();

          expect(state.get(timestamp))
            .not
            .toEqual(failurePayload);

          state = reducer(state, {
            type: actionTypes.CHAT_FILE_REQUEST_FAILURE,
            payload: failurePayload
          });

          expect(state.get(timestamp))
            .toEqual(failurePayload);
        });
      });
    });

    describe('chat SDK actions', () => {
      let state,
        detail;

      const sdkActionTypes = [
        chatActionTypes.SDK_CHAT_QUEUE_POSITION,
        chatActionTypes.SDK_CHAT_REQUEST_RATING,
        chatActionTypes.SDK_CHAT_MSG,
        chatActionTypes.SDK_CHAT_RATING,
        chatActionTypes.SDK_CHAT_COMMENT,
        chatActionTypes.SDK_CHAT_MEMBER_JOIN,
        chatActionTypes.SDK_CHAT_MEMBER_LEAVE
      ];

      sdkActionTypes.forEach((actionType) => {
        describe(`when a ${actionType} action is dispatched`, () => {
          beforeEach(() => {
            detail = {
              timestamp: Date.now(),
              nick: 'visitor:x',
              display_name: 'Mr X'
            };

            state = reducer(initialState, {
              type: actionType,
              payload: { detail }
            });
          });

          it('adds the message to the chats collection', () => {
            expect(state.size)
              .toEqual(1);

            expect(state.get(detail.timestamp))
              .toEqual(jasmine.objectContaining(detail));
          });
        });
      });

      describe('when a websdk/chat.file action is dispatched', () => {
        describe('and it is triggered by an outgoing attachment', () => {
          beforeEach(() => {
            detail = {
              timestamp: Date.now(),
              nick: 'visitor',
              display_name: 'Visitor'
            };

            state = reducer(initialState, {
              type: 'websdk/chat.file',
              payload: { detail }
            });
          });

          it('does not change the state', () => {
            expect(state)
              .toEqual(initialState);
          });
        });

        describe('and it is triggered by an incoming attachment', () => {
          beforeEach(() => {
            detail = {
              timestamp: Date.now(),
              nick: 'agent:123',
              display_name: 'Agent 123'
            };

            state = reducer(initialState, {
              type: 'websdk/chat.file',
              payload: { detail }
            });
          });

          it('adds the message to the chats collection', () => {
            expect(state.size)
              .toEqual(1);

            expect(state.get(detail.timestamp))
              .toEqual(jasmine.objectContaining(detail));
          });
        });
      });
    });
  });
});
