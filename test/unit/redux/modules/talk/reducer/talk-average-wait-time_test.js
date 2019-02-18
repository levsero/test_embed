describe('talk reducer average wait time', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/talk/reducer/talk-average-wait-time');
    const actionTypesPath = buildSrcPath('redux/modules/talk/talk-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

    initialState = reducer(undefined, { type: '' });
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('reducer', () => {
    let state;

    describe('initial state', () => {
      it('is set correctly', () => {
        expect(initialState)
          .toEqual({
            waitTime: '0',
            enabled: false
          });
      });
    });

    // TODO: When porting to jest loop over these two events because they do the same thing
    describe('when a TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT action is received', () => {
      let mockData;

      describe('when the averageWaitTimeEnabled is true', () => {
        mockData = {
          averageWaitTime: '1',
          averageWaitTimeSetting: 'exact',
          averageWaitTimeEnabled: true
        };

        beforeEach(() => {
          state = reducer(initialState, {
            type: actionTypes.TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
            payload: mockData
          });
        });

        it('sets the waitTime', () => {
          expect(state.waitTime)
            .toEqual('1');
        });

        it('sets enabled to true', () => {
          expect(state.enabled)
            .toEqual(true);
        });
      });

      describe('when the averageWaitTimeEnabled is false', () => {
        beforeEach(() => {
          mockData = {
            averageWaitTime: null,
            averageWaitTimeSetting: 'exact',
            averageWaitTimeEnabled: false
          };

          state = reducer(initialState, {
            type: actionTypes.TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
            payload: mockData
          });
        });

        it('does not change the waitTime', () => {
          expect(state.waitTime)
            .toEqual('0');
        });

        it('sets enabled to false', () => {
          expect(state.enabled)
            .toEqual(false);
        });
      });

      describe('when the averageWaitTimeSetting is undefined', () => {
        beforeEach(() => {
          mockData = {
            averageWaitTime: null,
            averageWaitTimeEnabled: false
          };

          state = reducer(initialState, {
            type: actionTypes.TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
            payload: mockData
          });
        });

        it('does not change the waitTime', () => {
          expect(state.waitTime)
            .toEqual('0');
        });

        it('sets enabled to false', () => {
          expect(state.enabled)
            .toEqual(false);
        });
      });
    });

    describe('when a TALK_AVERAGE_WAIT_TIME_SOCKET_EVENT action is received', () => {
      let mockData;

      describe('when the averageWaitTimeEnabled is true', () => {
        mockData = {
          averageWaitTime: '1',
          averageWaitTimeSetting: 'exact',
          averageWaitTimeEnabled: true
        };

        beforeEach(() => {
          state = reducer(initialState, {
            type: actionTypes.TALK_AVERAGE_WAIT_TIME_SOCKET_EVENT,
            payload: mockData
          });
        });

        it('sets the waitTime', () => {
          expect(state.waitTime)
            .toEqual('1');
        });

        it('sets enabled to true', () => {
          expect(state.enabled)
            .toEqual(true);
        });
      });

      describe('when the averageWaitTimeEnabled is false', () => {
        beforeEach(() => {
          mockData = {
            averageWaitTime: null,
            averageWaitTimeSetting: 'exact',
            averageWaitTimeEnabled: false
          };

          state = reducer(initialState, {
            type: actionTypes.TALK_AVERAGE_WAIT_TIME_SOCKET_EVENT,
            payload: mockData
          });
        });

        it('does not change the waitTime', () => {
          expect(state.waitTime)
            .toEqual('0');
        });

        it('sets enabled to false', () => {
          expect(state.enabled)
            .toEqual(false);
        });
      });

      describe('when the averageWaitTimeSetting is undefined', () => {
        beforeEach(() => {
          mockData = {
            averageWaitTime: null,
            averageWaitTimeEnabled: false
          };

          state = reducer(initialState, {
            type: actionTypes.TALK_AVERAGE_WAIT_TIME_SOCKET_EVENT,
            payload: mockData
          });
        });

        it('does not change the waitTime', () => {
          expect(state.waitTime)
            .toEqual('0');
        });

        it('sets enabled to false', () => {
          expect(state.enabled)
            .toEqual(false);
        });
      });
    });
  });
});
