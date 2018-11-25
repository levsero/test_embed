describe('listener middleware', () => {
  let listen;

  beforeEach(() => {
    const listenPath = buildSrcPath('redux/middleware/listener');

    mockery.enable();
    initMockRegistry({
      'src/redux/modules/base/base-selectors': {
        getOnApiListeners: (prevState) => prevState.onApiListeners
      }
    });

    listen = requireUncached(listenPath).default;
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('listen', () => {
    let action,
      nextSpy;

    describe('next', () => {
      beforeEach(() => {
        const flatState = {
          onApiListeners: {}
        };

        nextSpy = jasmine.createSpy('nextSpy');
        action = { type: 'random_type' };
        listen({ getState: () => flatState })(nextSpy)(action);
      });

      it('calls next function', () => {
        expect(nextSpy)
          .toHaveBeenCalledWith({ type: 'random_type' });
      });
    });

    describe('action is part of listeners', () => {
      let actionType,
        callbackSpy1,
        callbackSpy2,
        actionCreatorPromise,
        useActionPayload = false,
        mockPayload = { foo: 'bar' };

      beforeEach(() => {
        callbackSpy1 = jasmine.createSpy();
        callbackSpy2 = jasmine.createSpy();
        action = { type: actionType, payload: mockPayload };

        const flatState = {
          onApiListeners: {
            'CLOSE_BUTTON_CLICKED': {
              callbackList: [callbackSpy1, callbackSpy2],
              selectors: [],
              useActionPayload
            }
          }
        };

        actionCreatorPromise = listen({ getState: () => flatState })(nextSpy);
      });

      describe('action is part of listeners', () => {
        beforeAll(() => {
          actionType = 'ANOTHER_ACTION';
        });

        it('does not call any callbacks from the listeners', () => {
          actionCreatorPromise(action).then(() => {
            expect(callbackSpy1)
              .not.toHaveBeenCalled();

            expect(callbackSpy2)
              .not.toHaveBeenCalled();
          });
        });
      });

      describe('action is part of listeners', () => {
        beforeAll(() => {
          actionType = 'CLOSE_BUTTON_CLICKED';
        });

        it('calls all the callbacks of the listeners corresponding to the action', () => {
          actionCreatorPromise(action).then(() => {
            expect(callbackSpy1)
              .toHaveBeenCalled();

            expect(callbackSpy2)
              .toHaveBeenCalled();
          });
        });

        describe('when useActionPayload is true', () => {
          beforeAll(() => {
            useActionPayload = true;
          });

          it('appends the payload to the argumentsList array and passes it to the callback', () => {
            actionCreatorPromise(action).then(() => {
              expect(callbackSpy1)
                .toHaveBeenCalledWith(mockPayload);

              expect(callbackSpy2)
                .toHaveBeenCalledWith(mockPayload);
            });
          });
        });
      });
    });
  });
});
