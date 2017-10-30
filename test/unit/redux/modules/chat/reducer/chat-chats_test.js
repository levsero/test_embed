import * as chatActionTypes from '../../../../../../src/redux/modules/chat/chat-action-types';

describe('chat reducer chats', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-chats');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

    initialState = reducer(undefined, { type: '' });
  });

  afterAll(() => {
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

    describe('when a SENT_CHAT_MSG_SUCCESS action is dispatched', () => {
      let state,
        payload;

      beforeEach(() => {
        payload = {
          timestamp: Date.now(),
          msg: 'Hi',
          nick: 'visitor',
          display_name: 'Visitor 123'
        };

        state = reducer(initialState, {
          type: actionTypes.SENT_CHAT_MSG_SUCCESS,
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

    describe('when a SEND_CHAT_FILE action is dispatched', () => {
      let state,
        payload;

      beforeEach(() => {
        payload = {
          timestamp: Date.now(),
          uploading: true,
          nick: 'visitor',
          display_name: 'Visitor 123'
        };

        state = reducer(initialState, {
          type: actionTypes.SEND_CHAT_FILE,
          payload: payload
        });
      });

      it('adds the attachment message to the chats collection', () => {
        expect(state.size)
          .toEqual(1);

        expect(state.get(payload.timestamp))
          .toEqual(jasmine.objectContaining({
            timestamp: payload.timestamp,
            uploading: payload.uploading
          }));
      });

      describe('when a SEND_CHAT_FILE_SUCCESS action is dispatched', () => {
        let newState,
          newPayload;

        beforeEach(() => {
          newPayload = {
            timestamp: payload.timestamp,
            uploading: false,
            attachment: { name: 'bunpun.png' },
            nick: 'visitor',
            display_name: 'Visitor 123'
          };

          newState = reducer(state, {
            type: actionTypes.SEND_CHAT_FILE_SUCCESS,
            payload: newPayload
          });
        });

        it('overrides the previous attachment message', () => {
          expect(newState.size)
            .toEqual(1);

          expect(newState.get(newPayload.timestamp))
            .toEqual(jasmine.objectContaining({
              timestamp: newPayload.timestamp,
              uploading: newPayload.uploading,
              attachment: newPayload.attachment
            }));
        });
      });
    });

    describe('chat SDK actions', () => {
      let state,
        detail;
      const sdkActionTypes = [
        chatActionTypes.SDK_CHAT_FILE,
        chatActionTypes.SDK_CHAT_WAIT_QUEUE,
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
              payload: { detail: detail }
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
