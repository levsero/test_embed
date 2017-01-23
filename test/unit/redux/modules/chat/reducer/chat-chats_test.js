import SortedMap from 'collections/sorted-map';

describe('chat reducer chats', () => {
  let initialState,
    reducer,
    actionTypes;

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
  });
});
