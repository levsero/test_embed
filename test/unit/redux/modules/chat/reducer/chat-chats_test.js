import SortedMap from 'collections/sorted-map';

import * as chatActionTypes from '../../../../../../src/redux/modules/chat/chat-action-types';

describe('chat reducer chats', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    initMockRegistry({
      'collections/sorted-map': SortedMap
    });

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
        expect(initialState.length)
          .toEqual(0);
      });
    });

    describe('when a SENT_CHAT_MSG_SUCCESS action is dispatched', () => {
      let state,
        testPayload;

      beforeAll(() => {
        testPayload = {
          timestamp: Date.now(),
          msg: 'Hi'
        };
      });

      beforeEach(() => {
        const action = {
          type: actionTypes.SENT_CHAT_MSG_SUCCESS,
          payload: testPayload
        };

        state = reducer(initialState, action);
      });

      it('adds the message to the chats collection', () => {
        expect(state.length)
          .toEqual(1);

        expect(state.toObject()[testPayload.timestamp])
          .toEqual(jasmine.objectContaining({
            timestamp: testPayload.timestamp,
            msg: testPayload.msg
          }));
      });
    });

    describe('chat SDK actions', () => {
      const sdkActionTypes = [
        chatActionTypes.SDK_CHAT_FILE,
        chatActionTypes.SDK_CHAT_WAIT_QUEUE,
        chatActionTypes.SDK_CHAT_REQUEST_RATING,
        chatActionTypes.SDK_CHAT_RATING,
        chatActionTypes.SDK_CHAT_COMMENT,
        chatActionTypes.SDK_CHAT_MSG,
        chatActionTypes.SDK_CHAT_MEMBER_JOIN,
        chatActionTypes.SDK_CHAT_MEMBER_LEAVE
      ];

      sdkActionTypes.forEach((actionType) => {
        describe(`when a ${actionType} action is dispatched`, () => {
          let state,
            testPayload = {
              detail: {
                timestamp: Date.now(),
                nick: 'person:x',
                display_name: 'Mr X' // eslint-disable-line camelcase
              }
            };

          beforeEach(() => {
            const action = {
              type: actionType,
              payload: testPayload
            };

            state = reducer(initialState, action);
          });

          it('adds the message to the chats collection', () => {
            expect(state.length)
              .toEqual(1);

            expect(state.toObject()[testPayload.detail.timestamp])
              .toEqual(jasmine.objectContaining(testPayload.detail));
          });
        });
      });
    });
  });
});
