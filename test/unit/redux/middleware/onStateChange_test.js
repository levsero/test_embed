describe('onStateChange middleware', () => {
  let stateChangeFn;
  const updateAccountSettingsSpy = jasmine.createSpy('updateAccountSettings');

  beforeAll(() => {
    mockery.enable();

    const path = buildSrcPath('redux/middleware/onStateChange');

    initMockRegistry({
      'src/redux/modules/chat': {
        updateAccountSettings: updateAccountSettingsSpy
      }
    });

    stateChangeFn = requireUncached(path).default;
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('onStateChange', () => {
    describe('onChatConnected', () => {
      const connectingState = {
        chat: { connection: 'connecting' }
      };
      const connectedState = {
        chat: { connection: 'connected' }
      };
      const dispatchSpy = jasmine.createSpy('dispatch').and.callThrough();

      describe('when chat has not connected', () => {
        beforeEach(() => {
          stateChangeFn(connectingState, connectingState, {}, dispatchSpy);
        });

        it('does not dispatch the updateAccountSettings action', () => {
          expect(updateAccountSettingsSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('when chat has not connected', () => {
        beforeEach(() => {
          stateChangeFn(connectingState, connectedState, {}, dispatchSpy);
        });

        it('dispatches the updateAccountSettings action', () => {
          expect(updateAccountSettingsSpy)
            .toHaveBeenCalled();
        });
      });
    });
  });
});
