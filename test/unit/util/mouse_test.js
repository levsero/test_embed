describe('mouse', () => {
  let mouse;
  const mousePath = buildSrcPath('util/mouse');

  beforeEach(() => {
    mouse = requireUncached(mousePath).mouse;
  });

  describe('#target', () => {
    let mockElement,
      mockIframe;

    describe('when on desktop', () => {
      beforeEach(() => {
        mockElement = { addEventListener: jasmine.createSpy('addEventListener') };
        mockIframe = {
          contentDocument: {
            getElementById: () => mockElement
          }
        };
        mouse.target(mockIframe, () => {}, false);
      });

      it('adds a element event handler for click', () => {
        expect(mockElement.addEventListener)
          .toHaveBeenCalledWith('click', jasmine.any(Function));
      });
    });

    describe('when on mobile', () => {
      beforeEach(() => {
        mockElement = { addEventListener: jasmine.createSpy('addEventListener') };
        mockIframe = {
          contentDocument: {
            getElementById: () => mockElement
          }
        };
        mouse.target(mockIframe, () => {}, true);
      });

      it('adds a element event handler for touchstart', () => {
        expect(mockElement.addEventListener)
          .toHaveBeenCalledWith('touchstart', jasmine.any(Function));
      });
    });

    describe('when there is an existing target', () => {
      beforeEach(() => {
        // We need to call 'target' twice in order to simulate there being an existing target element.
        mockElement = { addEventListener: jasmine.createSpy('addEventListener') };
        mockIframe = {
          contentDocument: {
            getElementById: () => mockElement
          }
        };
        mouse.target(mockIframe, () => {});
      });

      it('does not add a element event handler for mousemove', () => {
        expect(mockElement.addEventListener.calls.count())
          .toBe(1);
      });
    });

    describe('when the cancel handler is called', () => {
      let cancelHandler;

      beforeEach(() => {
        mockElement = {
          addEventListener: () => {},
          removeEventListener: jasmine.createSpy('removeEventListener')
        };
        mockIframe = {
          contentDocument: {
            getElementById: () => mockElement
          }
        };
      });

      describe('when on desktop', () => {
        beforeEach(() => {
          cancelHandler = mouse.target(mockIframe, () => {}, false);
          cancelHandler();
        });

        it('removes the element event handler for click', () => {
          expect(mockElement.removeEventListener)
            .toHaveBeenCalledWith('click', jasmine.any(Function));
        });
      });

      describe('when on mobile', () => {
        beforeEach(() => {
          cancelHandler = mouse.target(mockIframe, () => {}, true);
          cancelHandler();
        });

        it('removes the element event handler for touchstart', () => {
          expect(mockElement.removeEventListener)
            .toHaveBeenCalledWith('touchstart', jasmine.any(Function));
        });
      });
    });
  });
});
