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
          removeEventListener: jasmine.createSpy('removeEventListener'),
          getElementById: document.getElementById,
          documentElement: {
            clientWidth: 1920,
            clientHeight: 1080
          }
        }
      },
      'utility/utils': { clamp }
    });

    mockery.registerAllowable(mousePath);
    mouse = requireUncached(mousePath).mouse;
    mockDocument = mockRegistry['utility/globals'].document;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#target', () => {
    let onHitHandler,
      cancelHandler,
      target,
      targetBounds;

    beforeEach(() => {
      target = document.createElement('div');
      targetBounds = { top: 0, left: 0, bottom: 20, right: 20 };
      target.getBoundingClientRect = () => targetBounds;
      onHitHandler = jasmine.createSpy('onHitHandler');
      cancelHandler = mouse.target(target, onHitHandler);
    });

    it('should add a _zEId property to the target element', () => {
      expect(target._zEId)
        .toBeDefined();
    });

    it('should add the listener with the _zEId and handler', () => {
      expect(mouse.listeners[0].id)
        .toBe(target._zEId);

      expect(mouse.listeners[0].handler)
        .toEqual(jasmine.any(Function));
    });

    describe('when there are no existing listeners', () => {
      it('should add a document event handler for mousemove', () => {
        expect(mockDocument.addEventListener)
          .toHaveBeenCalledWith('mousemove', jasmine.any(Function));
      });
    });

    describe('when there are existing listeners', () => {
      beforeEach(() => {
        mockDocument.addEventListener.calls.reset();
        mouse.target(document.createElement('div'), onHitHandler);
      });

      it('should not add a document event handler for mousemove', () => {
        expect(mockDocument.addEventListener)
          .not.toHaveBeenCalledWith('mousemove', jasmine.any(Function));
      });

      describe('when a listener does not exist for the given target', () => {
        it('should add the listener', () => {
          expect(mouse.listeners.length)
            .toBe(2);
        });
      });

      describe('when a listener already exists for the given target', () => {
        beforeEach(() => {
          mouse.target(target, onHitHandler);
        });

        it('should not add the listener', () => {
          expect(mouse.listeners.length)
            .toBe(2);
        });
      });
    });

    describe('when the cancel handler is called', () => {
      beforeEach(() => {
        cancelHandler();
      });

      it('should remove the listener', () => {
        expect(mouse.listeners.length)
          .toBe(0);
      });
    });

    describe('distance check', () => {
      let props,
        handler;
      const minDistanceInPixels = 240;

      beforeEach(() => {
        handler = mouse.listeners[0].handler;
        props = {
          x: targetBounds.right + minDistanceInPixels,
          y: targetBounds.bottom + minDistanceInPixels,
          vx: -1,
          vy: -1,
          speed: 0.1
        };
      });

      describe('when the minimum distance has not been reached', () => {
        beforeEach(() => {
          handler(props);
        });

        it('should not call the onHit callback', () => {
          expect(onHitHandler)
            .not.toHaveBeenCalled();
        });

        it('should not remove the listener', () => {
          expect(mouse.listeners.length)
            .toBe(1);
        });
      });

      describe('when the mouse is moving away from the target', () => {
        beforeEach(() => {
          props.vx = props.vy = 1;
          handler(props);
        });

        it('should not call the onHit callback', () => {
          expect(onHitHandler)
            .not.toHaveBeenCalled();
        });

        it('should not remove the listener', () => {
          expect(mouse.listeners.length)
            .toBe(1);
        });
      });

      describe('when the minimum distance has been reached', () => {
        beforeEach(() => {
          props.x -= 10; // Move 10 pixels closer
          props.y -= 10;
        });

        describe('when the mouse is moving away from the target', () => {
          beforeEach(() => {
            props.vx = props.vy = 1;
            handler(props);
          });

          it('should not call the onHit callback', () => {
            expect(onHitHandler)
              .not.toHaveBeenCalled();
          });

          it('should not remove the listener', () => {
            expect(mouse.listeners.length)
              .toBe(1);
          });
        });

        describe('when the mouse is moving towards from the target', () => {
          beforeEach(() => {
            handler(props);
          });

          it('should call the onHit callback', () => {
            expect(onHitHandler)
              .toHaveBeenCalled();
          });

          it('should remove the listener', () => {
            expect(mouse.listeners.length)
              .toBe(0);
          });
        });
      });
    });
  });

  describe('handling mousemove event', () => {
    let event,
      handler,
      args;

    beforeEach(() => {
      event = {
        clientX: 100,
        clientY: 200
      };
      mouse.target(document.createElement('div'), () => {});
      handler = mouse.listeners[0].handler = jasmine.createSpy('listener');

      const now = new Date();

      // The mouse is initially at is at x: 100, y: 200.
      jasmine.clock().mockDate(now);
      mouse.handleMouseMove(event);

      // Advance the clock by 1 second.
      jasmine.clock().mockDate(new Date(now.getTime() + 1000));
      handler.calls.reset();

      // Move the mouse to x: 150, y: 250 to simulate the user moving 50px
      // along the x and y axis in one second.
      const nextEvent =_.merge({}, event, {
        clientX: 150,
        clientY: 250
      });

      mouse.handleMouseMove(nextEvent);
      args = handler.calls.mostRecent().args;
    });

    it('should call the handler', () => {
      expect(handler)
        .toHaveBeenCalled();
    });

    it('sets the mouse x and y props', () => {
      expect(args[0].x)
        .toBe(150);

      expect(args[0].y)
        .toBe(250);
    });

    it('sets the mouse speed prop', () => {
      expect(args[0].speed)
        .toBeCloseTo(0.071, 3);
    });

    it('sets the mouse vx and vy props', () => {
      expect(args[0].vx)
        .toBe(0.05);

      expect(args[0].vy)
        .toBe(0.05);
    });
  });
});
