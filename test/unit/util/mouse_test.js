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

  describe('#_getElementHitbox', () => {
    let mockElement,
      mockAnchor,
      mockBoundingRect;

    beforeEach(() => {
      mockAnchor = { horizontal: 'left', vertical: 'top' };
      mockBoundingRect = {
        top: 10,
        left: 10,
        width: 100,
        height: 200
      };
      mockElement = { getBoundingClientRect: () => {
        return mockBoundingRect;
      }};
    });

    it('returns a hitbox with scaled width', () => {
      expect(mouse._getElementHitbox(mockElement, mockAnchor).width)
        .toBe(200);
    });

    it('returns a hitbox with scaled height', () => {
      expect(mouse._getElementHitbox(mockElement, mockAnchor).height)
        .toBe(400);
    });

    describe('when the horizontal anchor is left', () => {
      it('returns a hitbox with widget anchored to the left', () => {
        expect(mouse._getElementHitbox(mockElement, mockAnchor).x)
          .toBe(10);
      });
    });

    describe('when the horizontal anchor is right', () => {
      beforeEach(() => {
        mockAnchor = { horizontal: 'right', vertical: 'top' };
        mockBoundingRect = {
          top: 10,
          left: 1000,
          width: 100,
          height: 200
        };
      });

      it('returns a hitbox with widget anchored to the right', () => {
        expect(mouse._getElementHitbox(mockElement, mockAnchor).x)
          .toBe(900);
      });
    });

    describe('when the vertical anchor is top', () => {
      it('returns a hitbox with widget anchored to the top', () => {
        expect(mouse._getElementHitbox(mockElement, mockAnchor).y)
          .toBe(10);
      });
    });

    describe('when the vertical anchor is bottom', () => {
      beforeEach(() => {
        mockAnchor = { horizontal: 'left', vertical: 'bottom' };
        mockBoundingRect = {
          top: 1000,
          left: 10,
          width: 100,
          height: 200
        };
      });

      it('returns a hitbox with widget anchored to the bottom', () => {
        expect(mouse._getElementHitbox(mockElement, mockAnchor).y)
          .toBe(800);
      });
    });
  });

  describe('#_pointInHitbox', () => {
    let mockHitbox;

    beforeEach(() => {
      mockHitbox = {
        x: 10,
        y: 10,
        width: 100,
        height: 200
      };
    });

    describe('when the point is outside the hitbox', () => {
      it('returns false', () => {
        expect(mouse._pointInHitbox(9, 209, mockHitbox))
          .toBe(false);
      });
    });

    describe('when the point is on the hitbox', () => {
      it('returns false', () => {
        expect(mouse._pointInHitbox(10, 210, mockHitbox))
          .toBe(false);
      });
    });

    describe('when the point is inside the hitbox', () => {
      it('returns true', () => {
        expect(mouse._pointInHitbox(11, 209, mockHitbox))
          .toBe(true);
      });
    });
  });
});
