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
        },
        normaliseCoords: () => {}
      }
    });

    mockery.registerAllowable(mousePath);
    mouse = requireUncached(mousePath).mouse;

    mockDocument = mockRegistry['utility/globals'].document;
    mouse.remove('move');
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#on', () => {
    it('should store the listener', () => {
      const listener = () => {};

      mouse.on('move', listener);

      expect(mouse.getListeners('move')[0])
        .toEqual(listener);
    });

    describe('when there are no listeners for the event type attached', () => {
      it('should add the event type handler to the document', () => {
        mouse.on('move', noop);

        expect(mockDocument.addEventListener)
          .toHaveBeenCalledWith('mousemove', jasmine.any(Function));
      });
    });
  });

  describe('#off', () => {
    const listenerA = () => {};
    const listenerB = () => {};

    beforeEach(() => {
      mouse.on('move', listenerA);
      mouse.on('move', listenerB);
    });

    it('should remove the listener', () => {
      mouse.off('move', listenerA);

      expect(mouse.getListeners('move')[0])
        .toBe(listenerB);
    });

    describe('when the last listener for the event type is to be removed', () => {
      beforeEach(() => {
        mouse.off('move', listenerA);
        mouse.off('move', listenerB);
      });

      it('should remove the event type handler from the document', () => {
        expect(mockDocument.removeEventListener)
          .toHaveBeenCalledWith('mousemove', jasmine.any(Function));
      });
    });
  });

  describe('once', () => {

  });

  describe('target', () => {

  });

  describe('#remove', () => {
    beforeEach(() => {
      mouse.once('move', noop);
      mouse.once('move', noop);

      mouse.remove('move');
    });

    it('should remove all listeners for the event type', () => {
      expect(mouse.getListeners('move').length)
        .toBe(0);
    });

    it('should remove the event type handler from the document', () => {
      expect(mockDocument.removeEventListener)
        .toHaveBeenCalledWith('mousemove', jasmine.any(Function));
    });
  });

  describe('#getListeners', () => {
    describe('when the event type exists', () => {
      const listenerA = () => {};
      const listenerB = () => {};

      beforeEach(() => {
        mouse.on('move', listenerA);
        mouse.on('move', listenerB);
      });

      it('should return the array of listeners', () => {
        expect(mouse.getListeners('move')[0])
          .toEqual(listenerA);

        expect(mouse.getListeners('move')[1])
          .toEqual(listenerB);
      });
    });

    describe('when the event type does not exist', () => {
      it('should return null', () => {
        expect(mouse.getListeners('bort simpson'))
          .toBe(null);
      });
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

      mouse.on('move', mockListener);
    });

    it('should call that listener on the event with valid params', () => {
      mouse.handleMouseMove(mockEvent);

      expect(mockListener)
        .toHaveBeenCalledWith({
          x: 100,
          y: 200,
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

      expect(args[0].x)
        .toBe(150);

      expect(args[0].y)
        .toBe(250);

      expect(args[0].speed)
        .toBeCloseTo(0.071, 3);

      expect(args[0].event)
        .toEqual(nextMockEvent);
    });
  });
});
