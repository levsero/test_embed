describe('mouse', () => {
  let mouse,
    mockDocument;
  const mousePath = buildSrcPath('util/mouse');

  beforeEach(() => {
    mockery.enable();

    const mockRegistry = initMockRegistry({
      'utility/globals': {
        document: {
          addEventListener: jasmine.createSpy('addEventListener'),
          removeEventListener: jasmine.createSpy('removeEventListener')
        }
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

    mockDocument = mockRegistry['utility/globals'].document;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#addListener', () => {
    beforeEach(() => {
      mouse.removeAllListeners('mousemove');
    });

    it('should store the listener', () => {
      mouse.addListener('mousemove', noop, 'ratatouille');
      mouse.addListener('mousemove', noop, 'mickey');

      expect(mouse.getListener('mousemove', 'ratatouille'))
        .toBeTruthy();

      expect(mouse.getListener('mousemove', 'mickey'))
        .toBeTruthy();
    });

    describe('when there are no listeners for the event type attached', () => {
      it('should add the event type handler to the document', () => {
        mouse.addListener('mousemove', noop, 'ratatouille');

        expect(mockDocument.addEventListener)
          .toHaveBeenCalledWith('mousemove', jasmine.any(Function));
      });
    });

    describe('when the event type does not exist', () => {
      it('should not store the listener', () => {
        mouse.addListener('null', noop, 'ratatouille');

        expect(mouse.getListener('null', 'ratatouille'))
          .toBe(null);
      });
    });
  });

  describe('#getListener', () => {
    beforeEach(() => {
      mouse.addListener('mousemove', noop, 'ratatouille');
      mouse.addListener('mousedown', noop, 'ratatouille');
    });

    it('should return the listener for the event type', () => {
      expect(mouse.getListener('mousemove', 'ratatouille'))
        .toEqual(jasmine.any(Function));

      expect(mouse.getListener('mousedown', 'ratatouille'))
        .toEqual(jasmine.any(Function));
    });

    describe('when the listener for the event type does not exist', () => {
      it('should return null', () => {
        expect(mouse.getListener('mousemove', 'mickey'))
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
    beforeEach(() => {
      mouse.addListener('mousemove', noop, 'ratatouille');
      mouse.addListener('mousemove', noop, 'mickey');
    });

    it('should remove the listener', () => {
      mouse.removeListener('mousemove', 'mickey');

      expect(mouse.getListener('mousemove', 'mickey'))
        .toBe(null);
    });

    describe('when the last listener for the event type is to be removed', () => {
      beforeEach(() => {
        mouse.removeListener('mousemove', 'ratatouille');
        mouse.removeListener('mousemove', 'mickey');
      });

      it('should remove the event type handler from the document', () => {
        expect(mockDocument.removeEventListener)
          .toHaveBeenCalledWith('mousemove', jasmine.any(Function));
      });
    });

    describe('when the event type does not exist', () => {
      beforeEach(() => {
        mouse.removeListener('mouseparty', 'ratatouille');
        mouse.removeListener('mouseparty', 'mickey');
      });

      it('should not remove any matching listeners', () => {
        expect(mouse.getListener('mousemove', 'ratatouille'))
          .toEqual(jasmine.any(Function));

        expect(mouse.getListener('mousemove', 'mickey'))
          .toEqual(jasmine.any(Function));
      });
    });

    describe('when the event type has no listeners', () => {
      beforeEach(() => {
        mouse.removeListener('mousedown', 'ratatouille');
        mouse.removeListener('mousedown', 'mickey');
      });

      it('should not remove any matching listeners', () => {
        expect(mouse.getListener('mousemove', 'ratatouille'))
          .toEqual(jasmine.any(Function));

        expect(mouse.getListener('mousemove', 'mickey'))
          .toEqual(jasmine.any(Function));
      });
    });
  });

  describe('#removeAllListeners', () => {
    beforeEach(() => {
      mouse.addListener('mousemove', noop, 'ratatouille');
      mouse.addListener('mousemove', noop, 'mickey');
    });

    it('should remove all listeners for the event type', () => {
      mouse.removeAllListeners('mousemove');

      expect(mouse.getListener('mousemove', 'ratatouille'))
        .toBe(null);

      expect(mouse.getListener('mousemove', 'mickey'))
        .toBe(null);
    });

    it('should remove the event type handler from the document', () => {
      mouse.removeAllListeners('mousemove');

      expect(mockDocument.removeEventListener)
        .toHaveBeenCalledWith('mousemove', jasmine.any(Function));
    });
  });

  describe('handling events', () => {
    let mockEvent,
      mockListener;

    beforeEach(() => {
      mockEvent = {
        clientX: 100,
        clientY: 200
      };
      mockListener = jasmine.createSpy('listener');

      mouse.removeAllListeners('mousemove');
      mouse.addListener('mousemove', mockListener, 'ratatouille');
    });

    it('should call that listener on the event with valid params', () => {
      mouse.handleMouseMove(mockEvent);

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
      mouse.handleMouseMove(mockEvent);

      // Advance the clock by 1 second.
      jasmine.clock().mockDate(new Date(now.getTime() + 1000));
      mockListener.calls.reset();

      // Move the mouse to x: 150, y: 250 to simulate the user moving 50px
      // along the x and y axis in one second.
      const nextMockEvent =_.merge({}, mockEvent, {
        clientX: 150,
        clientY: 250
      });

      mouse.handleMouseMove(nextMockEvent);

      expect(mockListener)
        .toHaveBeenCalled();

      const args = mockListener.calls.mostRecent().args;

      expect(args[0].position)
        .toEqual({ x: 150, y: 250});

      expect(args[0].speed)
        .toBeCloseTo(0.071, 3);

      expect(args[0].event)
        .toEqual(nextMockEvent);
    });
  });
});
