describe('chat reducer departments', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-departments');
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

    initialState = reducer(undefined, { type: '' });
    actionTypes = requireUncached(actionTypesPath);
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('reducer', () => {
    let state;

    describe('initial state', () => {
      it('is set to an empty array', () => {
        expect(initialState)
          .toEqual([]);
      });
    });

    describe('when a SDK_DEPARTMENT_UPDATE action is dispatched', () => {
      let payload = {
          detail: {
            id: 123,
            name: 'Helpdesk',
            status: 'online'
          }
        },
        newState;

      beforeEach(() => {
        state = reducer(initialState, {
          type: actionTypes.SDK_DEPARTMENT_UPDATE,
          payload: payload
        });
      });

      describe('when the department is not present', () => {
        beforeEach(() => {
          newState = reducer(state, {
            type: actionTypes.SDK_DEPARTMENT_UPDATE,
            payload: {
              detail: _.extend({}, payload.detail, { id: 456 })
            }
          });
        });

        it('adds a department with the payload data', () => {
          expect(newState[payload.detail.id])
            .toEqual(payload.detail);
        });
      });

      describe('when the department is present', () => {
        beforeEach(() => {
          newState = reducer(state, {
            type: actionTypes.SDK_DEPARTMENT_UPDATE,
            payload: {
              detail: _.extend({}, payload.detail, { status: 'offline' })
            }
          });
        });

        it('updates the department with the payload data', () => {
          expect(newState[payload.detail.id].status)
            .toEqual('offline');
        });
      });
    });
  });
});
