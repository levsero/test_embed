describe('queue middleware', () => {
  let queueCallsFn,
    mockQueue,
    removeFromQueueSpy = jasmine.createSpy('removeFromQueue'),
    performContextualSearchSpy = jasmine.createSpy('performContextualSearch');
  const AUTHENTICATION_SUCCESS = 'widget/base/AUTHENTICATION_SUCCESS';

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'src/redux/modules/base/base-selectors': {
        getQueue: () => mockQueue
      },
      'src/redux/modules/base': {
        removeFromQueue: removeFromQueueSpy
      },
      'src/redux/modules/helpCenter': {
        performContextualSearch: performContextualSearchSpy
      },
      'src/redux/modules/base/base-action-types': {
        AUTHENTICATION_SUCCESS
      }
    });

    const path = buildSrcPath('redux/middleware/queue');

    queueCallsFn = requireUncached(path).default;
  });

  afterEach(() => {
    removeFromQueueSpy.calls.reset();
    performContextualSearchSpy.calls.reset();
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('onAuthenticationSuccess', () => {
    let prevState,
      nextState,
      action,
      dispatchSpy = jasmine.createSpy('dispatch').and.callThrough();

    beforeEach(() => {
      queueCallsFn(prevState, nextState, action, dispatchSpy);
    });

    describe('when action type is AUTHENTICATION_SUCCESS', () => {
      beforeAll(() => {
        action = { type: AUTHENTICATION_SUCCESS };
      });

      describe('when queue has performContextualSearch', () => {
        beforeAll(() => {
          mockQueue = {
            performContextualSearch: ['some', 'args']
          };
        });

        it('calls performContextualSearch with the correct args', () => {
          expect(performContextualSearchSpy)
            .toHaveBeenCalledWith('some', 'args');
        });

        it('calls removeFromQueue with the correct args', () => {
          expect(removeFromQueueSpy)
            .toHaveBeenCalledWith('performContextualSearch');
        });
      });

      describe('when queue does not have performContextualSearch', () => {
        beforeAll(() => {
          mockQueue = {
            yoloMethod: ['some', 'args']
          };
        });

        it('does not call performContextualSearch', () => {
          expect(performContextualSearchSpy)
            .not
            .toHaveBeenCalled();
        });

        it('does not call removeFromQueue', () => {
          expect(removeFromQueueSpy)
            .not
            .toHaveBeenCalled();
        });
      });
    });

    describe('when action type is not AUTHENTICATION_SUCCESS', () => {
      beforeAll(() => {
        action = { type: 'yoloType' };
      });

      it('does not call performContextualSearch', () => {
        expect(performContextualSearchSpy)
          .not
          .toHaveBeenCalled();
      });

      it('does not call removeFromQueue', () => {
        expect(removeFromQueueSpy)
          .not
          .toHaveBeenCalled();
      });
    });
  });
});
