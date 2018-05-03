describe('throttle middleware', () => {
  let throttle;

  beforeEach(() => {
    const throttlePath = buildSrcPath('redux/middleware/throttle');

    mockery.enable();

    initMockRegistry({
      'src/redux/modules/chat/chat-action-types': {
        UPDATE_PREVIEWER_SETTINGS: 'UPDATE_PREVIEWER_SETTINGS',
        UPDATE_PREVIEWER_SCREEN: 'UPDATE_PREVIEWER_SCREEN'
      }
    });

    throttle = requireUncached(throttlePath).default;
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('throttle', () => {
    let action;
    const nextSpy = jasmine.createSpy('nextSpy');

    describe('when block is false', () => {
      beforeEach(() => {
        action = { type: 'random_type' };
        throttle(false)()(nextSpy)(action);
      });

      it('calls next function with the action passed in', () => {
        expect(nextSpy)
          .toHaveBeenCalledWith({ type: 'random_type' });
      });
    });

    describe('when block is true', () => {
      describe('and a non allowed action is passed in', () => {
        beforeEach(() => {
          nextSpy.calls.reset();
          action = { type: 'random_type' };
          throttle(true)()(nextSpy)(action);
        });

        it('does not call nextSpy', () => {
          expect(nextSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('and an allowed action is passed in', () => {
        beforeEach(() => {
          nextSpy.calls.reset();
          action = { type: 'UPDATE_PREVIEWER_SCREEN' };
          throttle(true)()(nextSpy)(action);
        });

        it('calls next function with the action passed in', () => {
          expect(nextSpy)
            .toHaveBeenCalledWith({ type: 'UPDATE_PREVIEWER_SCREEN' });
        });
      });

      describe('and a web_sdk event is passed in', () => {
        beforeEach(() => {
          nextSpy.calls.reset();
          action = { type: 'websdk/something' };
          throttle(true)()(nextSpy)(action);
        });

        it('calls next function with the action passed in', () => {
          expect(nextSpy)
            .toHaveBeenCalledWith({ type: 'websdk/something' });
        });
      });
    });
  });
});
