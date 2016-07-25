describe('mouse', function() {
  let mouse;
  const mousePath = buildSrcPath('util/mouse');

  beforeEach(function() {
    mockery.enable();

    initMockRegistry({
      'utility/globals': {
        document: global.document
      },
      'utility/utils' : {
        getDistance: (pointA, pointB) => {
          const lhs = Math.pow(pointA.x - pointB.x, 2);
          const rhs = Math.pow(pointA.y - pointB.y, 2);

          return Math.sqrt(lhs + rhs);
        }
      }
    });

    mockery.registerAllowable(mousePath);
    mouse = requireUncached(mousePath).mouse;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#addListener', () => {
    beforeEach(function() {
      mouse.removeAllListeners('onmousemove');
    });

    it('should store the listener', () => {
      mouse.addListener('onmousemove', noop, 'ratatouille');
      mouse.addListener('onmousemove', noop, 'mickey');

      expect(mouse.getListener('onmousemove', 'ratatouille'))
        .toBeTruthy();

      expect(mouse.getListener('onmousemove', 'mickey'))
        .toBeTruthy();
    });

    describe('when there are no listeners for the event type attached', () => {
      it('should add the event type handler to the document', () => {
        mouse.addListener('onmousemove', noop, 'ratatouille');

        expect(global.document.onmousemove)
          .toEqual(jasmine.any(Function));
      });
    });

    describe('when the event type does not exist', () => {
      it('should not store the listener', () => {
        mouse.addListener('null', noop, 'ratatouille');

        expect(mouse.getListener('onmousemove', 'ratatouille'))
          .toBe(null);
      });
    });
  });

  describe('#getListener', () => {
    beforeEach(function() {
      mouse.addListener('onmousemove', noop, 'ratatouille');
      mouse.addListener('onmousedown', noop, 'ratatouille');
    });

    it('should return the listener for the event type', () => {
      expect(mouse.getListener('onmousemove', 'ratatouille'))
        .toEqual(jasmine.any(Function));

      expect(mouse.getListener('onmousedown', 'ratatouille'))
        .toEqual(jasmine.any(Function));
    });

    describe('when the listener for the event type does not exist', () => {
      it('should return null', () => {
        expect(mouse.getListener('onmousemove', 'mickey'))
          .toBe(null);
      });
    });

    describe('when there are no listeners for the event type', () => {
      it('should return null', () => {
        expect(mouse.getListener('mouseparty', 'ratatouille'))
          .toBe(null);
      });
    });
  });

  describe('#removeListener', () => {
    beforeEach(function() {
      mouse.addListener('onmousemove', noop, 'ratatouille');
      mouse.addListener('onmousemove', noop, 'mickey');
    });

    it('should remove the listener', () => {
      mouse.removeListener('onmousemove', 'mickey');

      expect(mouse.getListener('onmousemove', 'mickey'))
        .toBe(null);
    });

    describe('when the last listener for the event type is to be removed', () => {
      beforeEach(function() {
        mouse.removeListener('onmousemove', 'ratatouille');
        mouse.removeListener('onmousemove', 'mickey');
      });

      it('should remove the event type handler from the document', () => {
        expect(global.document.onmousemove)
          .toBe(null);
      });
    });

    describe('when the event type does not exist', () => {
      beforeEach(function() {
        mouse.removeListener('mouseparty', 'ratatouille');
        mouse.removeListener('mouseparty', 'mickey');
      });

      it('should not remove any matching listeners', () => {
        expect(mouse.getListener('onmousemove', 'ratatouille'))
          .toEqual(jasmine.any(Function));

        expect(mouse.getListener('onmousemove', 'mickey'))
          .toEqual(jasmine.any(Function));
      });
    });

    describe('when the event type has no listeners', () => {
      beforeEach(function() {
        mouse.removeListener('onmousedown', 'ratatouille');
        mouse.removeListener('onmousedown', 'mickey');
      });

      it('should not remove any matching listeners', () => {
        expect(mouse.getListener('onmousemove', 'ratatouille'))
          .toEqual(jasmine.any(Function));

        expect(mouse.getListener('onmousemove', 'mickey'))
          .toEqual(jasmine.any(Function));
      });
    });
  });

  describe('#removeAllListeners', () => {
    beforeEach(function() {
      mouse.addListener('onmousemove', noop, 'ratatouille');
      mouse.addListener('onmousemove', noop, 'mickey');
    });

    it('should remove all listeners for the event type', () => {
      mouse.removeAllListeners('onmousemove');

      expect(mouse.getListener('onmousemove', 'ratatouille'))
        .toBe(null);

      expect(mouse.getListener('onmousemove', 'mickey'))
        .toBe(null);
    });

    it('should remove the event type handler from the document', () => {
      mouse.removeAllListeners('onmousemove');

      expect(global.document.onmousemove)
        .toBe(null);
    });
  });

  describe('handling events', () => {
    let mockEvent,
      mockListener;

    beforeEach(function() {
      mockEvent = {
        clientX: 100,
        clientY: 200
      };
      mockListener = jasmine.createSpy('listener');

      mouse.removeAllListeners('onmousemove');
      mouse.addListener('onmousemove', mockListener, 'ratatouille');
    });

    it('should call that listener on the event with valid params', () => {
      global.document.onmousemove(mockEvent);

      expect(mockListener)
        .toHaveBeenCalledWith({
          position: { x: 100, y: 200 },
          speed: 0,
          event: mockEvent
        });
    });

    it('should calculate speed correctly', () => {
      const now = new Date();

      // The mouse is initially at is at x: 100, y: 200.
      jasmine.clock().mockDate(now);
      global.document.onmousemove(mockEvent);

      // Advance the clock by 1 second.
      jasmine.clock().mockDate(new Date(now.getTime() + 1000));
      mockListener.calls.reset();

      // Move the mouse to x: 150, y: 250 to simulate the user moving 50px
      // along the x and y axis in one second.
      const nextMockEvent =_.merge({}, mockEvent, {
        clientX: 150,
        clientY: 250
      });

      global.document.onmousemove(nextMockEvent);

      expect(mockListener)
        .toHaveBeenCalled();

      const args = mockListener.calls.mostRecent().args;

      expect(args[0].position)
        .toEqual({ x: 150, y: 250});

      expect(args[0].speed)
        .toBeCloseTo(0.071);

      expect(args[0].event)
        .toEqual(nextMockEvent);
    });
  });
});
