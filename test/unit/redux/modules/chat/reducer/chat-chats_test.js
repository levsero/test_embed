import * as chatActionTypes from '../../../../../../src/redux/modules/chat/chat-action-types';

describe('chat reducer chats', () => {
  let reducer,
    actionTypes,
    initialState,
    playSoundSpy;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-chats');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

    playSoundSpy = jasmine.createSpy('playSound');

    initMockRegistry({
      'service/audio': {
        audio: { playSound: playSoundSpy }
      }
    });

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

    describe('chat SDK actions', () => {
      let state,
        detail;
      const sdkActionTypes = [
        chatActionTypes.SDK_CHAT_FILE,
        chatActionTypes.SDK_CHAT_WAIT_QUEUE,
        chatActionTypes.SDK_CHAT_REQUEST_RATING,
        chatActionTypes.SDK_CHAT_RATING,
        chatActionTypes.SDK_CHAT_COMMENT,
        chatActionTypes.SDK_CHAT_MEMBER_JOIN,
        chatActionTypes.SDK_CHAT_MEMBER_LEAVE
      ];

      describe('when a SDK_CHAT_MSG action is dispatched', () => {
        beforeEach(() => {
          detail = {
            timestamp: Date.now(),
            nick: 'visitor:x',
            display_name: 'Mr X'
          };

          state = reducer(initialState, {
            type: chatActionTypes.SDK_CHAT_MSG,
            payload: { detail: detail }
          });
        });

        it('plays the incoming_message sound', () => {
          expect(playSoundSpy)
            .toHaveBeenCalledWith('incoming_message');
        });

        it('adds the message to the chats collection', () => {
          expect(state.size)
            .toEqual(1);

          expect(state.get(detail.timestamp))
            .toEqual(jasmine.objectContaining(detail));
        });
      });

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
