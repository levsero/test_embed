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

      describe('when HISTORY_REQUEST_SUCCESS action is dispatched', () => {
        beforeEach(() => {
          detail = {
            timestamp: Date.now(),
            nick: 'visitor 136248723',
            display_name: 'Mr Abc'
          };

          const newEntry = [detail.timestamp, detail];

          state = reducer(initialState, {
            type: chatActionTypes.HISTORY_REQUEST_SUCCESS,
            payload: {
              history: [newEntry]
            }
          });
        });

        it('adds the message to the chats collection', () => {
          expect(state.size)
            .toEqual(1);

          expect(state.get(detail.timestamp))
            .toEqual(jasmine.objectContaining(detail));
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
