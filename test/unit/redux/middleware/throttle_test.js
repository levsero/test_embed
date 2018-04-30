describe('throttle middleware', () => {
  let throttle;

  beforeEach(() => {
    const throttlePath = buildSrcPath('redux/middleware/throttle');

    mockery.enable();

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
  });
});
