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
        action = { type: 'random_type'};
        listen({ getState: () => flatState })(nextSpy)(action);
      });

      it('calls next function', () => {
        expect(nextSpy)
          .toHaveBeenCalledWith({ type: 'random_type'});
      });
    });

    describe('action is part of listeners', () => {
      let actionType;
      const callbackSpy1 = jasmine.createSpy();
      const callbackSpy2 = jasmine.createSpy();

      beforeEach(() => {
        action = { type: actionType };
        const flatState = {
          onApiListeners: {
            'CLOSE_BUTTON_CLICKED': [ callbackSpy1, callbackSpy2 ]
          }
        };

        listen({ getState: () => flatState })(nextSpy)(action);
      });

      describe('action is part of listeners', () => {
        beforeAll(() => {
          actionType = 'ANOTHER_ACTION';
        });

        it('does not call any callbacks from the listeners', () => {
          expect(callbackSpy1)
            .not.toHaveBeenCalled();

          expect(callbackSpy2)
            .not.toHaveBeenCalled();
        });
      });

      describe('action is part of listeners', () => {
        beforeAll(() => {
          actionType = 'CLOSE_BUTTON_CLICKED';
        });

        it('calls all the callbacks of the listeners corrisponding to the action', () => {
          expect(callbackSpy1)
            .toHaveBeenCalled();

          expect(callbackSpy2)
            .toHaveBeenCalled();
        });
      });
    });
  });
});