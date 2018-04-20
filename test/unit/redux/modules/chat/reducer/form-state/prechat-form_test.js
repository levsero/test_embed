describe('chat reducer formState preChatForm', () => {
  const reducerPath = buildSrcPath('redux/modules/chat/reducer/form-state/prechat-form'),
    chatActionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types'),
    baseActionTypesPath = buildSrcPath('redux/modules/base/base-action-types'),
    reducer = requireUncached(reducerPath).default,
    chatActionTypes = requireUncached(chatActionTypesPath),
    baseActionTypes = requireUncached(baseActionTypesPath),
    initialState = reducer(undefined, { type: '' });

  describe('reducer', () => {
    let state;
    const mockFormState = {
      name: 'test name',
      phone: '123456789',
      email: 'foo@bar',
      message: 'message text'
    };

    describe('initial state', () => {
      it('formState is set to an empty object', () => {
        expect(initialState)
          .toEqual({});
      });
    });

    describe('when an action of type PRE_CHAT_FORM_ON_CHANGE is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: chatActionTypes.PRE_CHAT_FORM_ON_CHANGE,
          payload: mockFormState
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual(mockFormState);
      });
    });

    describe('when an action of type IDENTIFY_RECIEVED is dispatched', () => {
      beforeEach(() => {
        state = reducer(initialState, {
          type: baseActionTypes.IDENTIFY_RECIEVED,
          payload: mockFormState
        });
      });

      it('sets the action payload as the state', () => {
        expect(state)
          .toEqual(mockFormState);
      });

      describe('when the payload contains overrides for some keys and not others', () => {
        const mockFormUpdate = {
          email: 'new@email.com',
          newKey: 'value'
        };

        beforeEach(() => {
          state = reducer(state, {
            type: baseActionTypes.IDENTIFY_RECIEVED,
            payload: mockFormUpdate
          });
        });

        it('updates the state while maintaining the keys not in the payload', () => {
          expect(state)
            .toEqual({ ...state, ...mockFormUpdate });
        });
      });
    });
  });
});
