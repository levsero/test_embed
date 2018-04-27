import * as chatActionTypes from '../../../../../../../src/redux/modules/chat/chat-action-types';

describe('chat reducer chatHistory chats', () => {
  let reducer,
    initialState;

  const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-history/chats');

  beforeEach(() => {
    reducer = requireUncached(reducerPath).default;
    initialState = reducer(undefined, { type: '' });
  });

  describe('reducer', () => {
    describe('initial state', () => {
      it('contains no entries', () => {
        expect(initialState.size)
          .toEqual(0);
      });
    });

    describe('chat SDK actions', () => {
      let state,
        detail;

      const sdkActionTypes = [
        chatActionTypes.SDK_HISTORY_CHAT_QUEUE_POSITION,
        chatActionTypes.SDK_HISTORY_CHAT_REQUEST_RATING,
        chatActionTypes.SDK_HISTORY_CHAT_MSG,
        chatActionTypes.SDK_HISTORY_CHAT_RATING,
        chatActionTypes.SDK_HISTORY_CHAT_COMMENT,
        chatActionTypes.SDK_HISTORY_CHAT_MEMBER_JOIN,
        chatActionTypes.SDK_HISTORY_CHAT_MEMBER_LEAVE
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

      describe('when a websdk/history/chat.file action is dispatched', () => {
        describe('and it is triggered by an outgoing attachment', () => {
          beforeEach(() => {
            detail = {
              timestamp: Date.now(),
              nick: 'visitor',
              display_name: 'Visitor',
              attachment: {
                name: 'file',
                size: 1,
                mime_type: 'some/file'
              }
            };

            state = reducer(initialState, {
              type: 'websdk/history/chat.file',
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

        describe('and it is triggered by an incoming attachment', () => {
          beforeEach(() => {
            detail = {
              timestamp: Date.now(),
              nick: 'agent:123',
              display_name: 'Agent 123',
              attachment: {
                name: 'file',
                size: 1,
                mime_type: 'some/file'
              }
            };

            state = reducer(initialState, {
              type: 'websdk/history/chat.file',
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
