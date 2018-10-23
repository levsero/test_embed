describe('onWidgetOpen', () => {
  const setScrollKillerSpy = jasmine.createSpy('setScrollKiller');
  const setWindowScrollSpy = jasmine.createSpy('setWindowScroll');
  const revertWindowScrollSpy = jasmine.createSpy('revertWindowScroll');

  let mockIsMobile,
    onWidgetOpen,
    prevState,
    nextState,
    mockPrevActiveEmbed,
    mockPrevWebWidgetVisible,
    mockNextActiveEmbed,
    mockNextWebWidgetVisible;

  beforeEach(() => {
    mockery.enable();
    jasmine.clock().install();

    initMockRegistry({
      'utility/devices': {
        isMobileBrowser: () => mockIsMobile
      },
      'src/redux/modules/base/base-selectors': {
        getActiveEmbed: (state) => state.activeEmbed
      },
      'src/redux/modules/selectors': {
        getWebWidgetVisible: (state) => state.webWidgetVisible
      },
      'utility/scrollHacks': {
        setScrollKiller: setScrollKillerSpy,
        setWindowScroll: setWindowScrollSpy,
        revertWindowScroll: revertWindowScrollSpy
      }
    });

    const path = buildSrcPath('redux/middleware/onStateChange/onWidgetOpen');

    onWidgetOpen = requireUncached(path).default;

    prevState = {
      activeEmbed: mockPrevActiveEmbed,
      webWidgetVisible: mockPrevWebWidgetVisible
    };

    nextState = {
      activeEmbed: mockNextActiveEmbed,
      webWidgetVisible: mockNextWebWidgetVisible
    };

    onWidgetOpen(prevState, nextState);
    jasmine.clock().tick(1);
  });

  afterEach(() => {
    setScrollKillerSpy.calls.reset();
    setWindowScrollSpy.calls.reset();
    revertWindowScrollSpy.calls.reset();

    jasmine.clock().uninstall();
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('when not on mobile', () => {
    beforeAll(() => {
      mockIsMobile = false;
    });

    it('does not apply any scroll hacks', () => {
      expect(setWindowScrollSpy)
        .not
        .toHaveBeenCalled();
      expect(setScrollKillerSpy)
        .not
        .toHaveBeenCalled();
      expect(revertWindowScrollSpy)
        .not
        .toHaveBeenCalled();
    });
  });

  describe('when on mobile', () => {
    beforeAll(() => {
      mockIsMobile = true;
    });

    describe('when active embed is zopimChat', () => {
      beforeAll(() => {
        mockNextActiveEmbed = 'zopimChat';
      });

      it('does not apply any scroll hacks', () => {
        expect(setWindowScrollSpy)
          .not
          .toHaveBeenCalled();
        expect(setScrollKillerSpy)
          .not
          .toHaveBeenCalled();
        expect(revertWindowScrollSpy)
          .not
          .toHaveBeenCalled();
      });
    });

    describe('when active embed is not zopimChat', () => {
      beforeAll(() => {
        mockNextActiveEmbed = 'chat';
      });

      describe('when web widget goes from not visible to visble', () => {
        beforeAll(() => {
          mockPrevWebWidgetVisible = false;
          mockNextWebWidgetVisible = true;
        });

        it('applies scroll hacks', () => {
          expect(setWindowScrollSpy)
            .toHaveBeenCalledWith(0);
          expect(setScrollKillerSpy)
            .toHaveBeenCalledWith(true);
        });
      });

      describe('when web widget already visible', () => {
        beforeAll(() => {
          mockPrevWebWidgetVisible = true;
          mockNextWebWidgetVisible = true;
        });

        it('applies scroll hacks', () => {
          expect(setScrollKillerSpy)
            .toHaveBeenCalledWith(false);
          expect(revertWindowScrollSpy)
            .toHaveBeenCalled();
        });
      });
    });
  });
});
