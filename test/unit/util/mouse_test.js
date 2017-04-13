describe('mouse', () => {
  let mouse,
    mockDocument;
  const mousePath = buildSrcPath('util/mouse');

  beforeEach(() => {
    mockery.enable();

    const mockRegistry = initMockRegistry({
      'lodash': _,
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

  describe('#target', () => {
    let cancelHandler;

    beforeEach(() => {
      cancelHandler = mouse.target(document.createElement('div'), () => {});
    });

    it('should add a document event handler for mousemove', () => {
      expect(mockDocument.addEventListener)
        .toHaveBeenCalledWith('mousemove', jasmine.any(Function));
    });

    it('should return a cancel handler function', () => {
      expect(cancelHandler)
        .toEqual(jasmine.any(Function));
    });

    describe('when there is an existing target', () => {
      beforeEach(() => {
        // We need to call 'target' twice in order to simulate there being an existing target element.
        mouse.target(document.createElement('div'), () => {});
        mouse.target(document.createElement('div'), () => {});
      });

      it('should not add a document event handler for mousemove', () => {
        expect(mockDocument.addEventListener.calls.count())
          .toBe(1);
      });
    });

    describe('when the cancel handler is called', () => {
      beforeEach(() => {
        cancelHandler();
      });

      it('should remove the document event handler for mousemove', () => {
        expect(mockDocument.removeEventListener)
          .toHaveBeenCalledWith('mousemove', jasmine.any(Function));
      });
    });
  });

  describe('#_hasTargetHit', () => {
    let distance,
      speed,
      isMovingTowards,
      result;

    describe('when the minimum distance has not been reached', () => {
      beforeEach(() => {
        distance = 0.26;
        speed = 0.1;
      });

      describe('when the mouse is moving towards the target', () => {
        beforeEach(() => {
          isMovingTowards = true;
          result = mouse._hasTargetHit(distance, speed, isMovingTowards);
        });

        it('should return false', () => {
          expect(result)
            .toBe(false);
        });
      });

      describe('when the mouse is moving away from the target', () => {
        beforeEach(() => {
          isMovingTowards = false;
          result = mouse._hasTargetHit(distance, speed, isMovingTowards);
        });

        it('should return false', () => {
          expect(result)
            .toBe(false);
        });
      });
    });

    describe('when the minimum distance has been reached', () => {
      beforeEach(() => {
        distance = 0.24;
        speed = 0.1;
      });

      describe('when the mouse is moving towards the target', () => {
        beforeEach(() => {
          isMovingTowards = true;
          result = mouse._hasTargetHit(distance, speed, isMovingTowards);
        });

        it('should return true', () => {
          expect(result)
            .toBe(true);
        });
      });

      describe('when the mouse is moving away from the target', () => {
        beforeEach(() => {
          isMovingTowards = false;
          result = mouse._hasTargetHit(distance, speed, isMovingTowards);
        });

        it('should return false', () => {
          expect(result)
            .toBe(false);
        });
      });
    });
  });

  describe('#_getMouseProperties', () => {
    let props;

    describe('returns an object', () => {
      beforeEach(() => {
        const now = new Date();
        const lastEvent = { clientX: 100, clientY: 200, time: new Date(now.getTime() - 1000) };
        const event = { clientX: 150, clientY: 250 };

        jasmine.clock().mockDate(now);
        props = mouse._getMouseProperties(event, lastEvent);
      });

      it('containing correct x and y props', () => {
        const expectation = {
          x: 150,
          y: 250
        };

        expect(props)
          .toEqual(jasmine.objectContaining(expectation));
      });

      it('containing correct speed prop', () => {
        expect(props.speed)
          .toBeCloseTo(0.071, 3);
      });

      it('containing the correct vx and vy props', () => {
        const expectation = {
          vx: 0.05,
          vy: 0.05
        };

        expect(props)
          .toEqual(jasmine.objectContaining(expectation));
      });
    });
  });
});
