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

    describe('when a CHAT_MSG_REQUEST_SUCCESS action is dispatched', () => {
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
          type: actionTypes.CHAT_MSG_REQUEST_SUCCESS,
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

    describe('when a CHAT_FILE_REQUEST_SENT action is dispatched', () => {
      let state,
        sendPayload;

      beforeEach(() => {
        sendPayload = {
          timestamp: Date.now(),
          uploading: true,
          nick: 'visitor',
          display_name: 'Visitor 123'
        };

        state = reducer(initialState, {
          type: actionTypes.CHAT_FILE_REQUEST_SENT,
          payload: sendPayload
        });
      });

      it('adds the attachment message to the chats collection', () => {
        expect(state.size)
          .toEqual(1);

        expect(state.get(sendPayload.timestamp))
          .toEqual(jasmine.objectContaining({
            timestamp: sendPayload.timestamp,
            uploading: sendPayload.uploading
          }));
      });

      describe('when a CHAT_FILE_REQUEST_SUCCESS action is dispatched', () => {
        let successPayload;

        beforeEach(() => {
          successPayload = {
            timestamp: sendPayload.timestamp,
            uploading: false,
            attachment: { name: 'bunpun.png' },
            nick: 'visitor',
            display_name: 'Visitor 123'
          };
        });

        it('overrides the CHAT_FILE_REQUEST_SENT state', () => {
          expect(state.size)
            .toEqual(1);

          state = reducer(state, {
            type: actionTypes.CHAT_FILE_REQUEST_SUCCESS,
            payload: successPayload
          });

          expect(state.size)
            .toEqual(1);

          expect(state.get(successPayload.timestamp))
            .toEqual(jasmine.objectContaining({
              timestamp: successPayload.timestamp,
              uploading: successPayload.uploading,
              attachment: successPayload.attachment
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
