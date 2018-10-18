describe('onChatOpen', () => {
  const chatOpenedSpy = jasmine.createSpy('chatOpened');
  const dispatchSpy = jasmine.createSpy('dispatch');

  let onChatOpen,
    prevState,
    nextState,
    mockPrevWidgetShown,
    mockPrevActiveEmbed,
    mockNextWidgetShown,
    mockNextActiveEmbed;

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'src/redux/modules/base/base-selectors': {
        getWidgetShown: (state) => state.widgetShown,
        getActiveEmbed: (state) => state.activeEmbed
      },
      'src/redux/modules/base': {
        chatOpened: chatOpenedSpy
      }
    });

    prevState = {
      widgetShown: mockPrevWidgetShown,
      activeEmbed: mockPrevActiveEmbed
    };

    nextState = {
      widgetShown: mockNextWidgetShown,
      activeEmbed: mockNextActiveEmbed
    };

    const path = buildSrcPath('redux/middleware/onStateChange/onChatOpen');
    onChatOpen = requireUncached(path).default;

    onChatOpen(prevState, nextState, dispatchSpy);
  });

  afterEach(() => {
    chatOpenedSpy.calls.reset();
    dispatchSpy.calls.reset();

    mockery.disable();
    mockery.deregisterAll()
  });

  describe('when widget not shown', () => {
    beforeAll(() => {
      mockPrevWidgetShown = false;
      mockPrevActiveEmbed = '';
      mockNextActiveEmbed = 'chat';
    });

    it('does not dispatch chatOpened', () => {
      expect(chatOpenedSpy)
        .not
        .toHaveBeenCalled();

      expect(dispatchSpy)
        .not
        .toHaveBeenCalled();
    });

    describe('when widget is shown', () => {
      beforeAll(() => {
        mockPrevWidgetShown = true;
      });

      describe('when chat has already been opened', () => {
        beforeAll(() => {
          mockPrevActiveEmbed = 'chat';
          mockNextActiveEmbed = 'chat';
        });

        it('does not dispatch chatOpened', () => {
          expect(chatOpenedSpy)
            .not
            .toHaveBeenCalled();

          expect(dispatchSpy)
            .not
            .toHaveBeenCalled();
        });
      });

      describe('when active embed is not chat', () => {
        beforeAll(() => {
          mockPrevWidgetShown = true;
          mockPrevActiveEmbed = '';
          mockNextActiveEmbed = 'helpCenter';
        });

        it('does not dispatch chatOpened', () => {
          expect(chatOpenedSpy)
            .not
            .toHaveBeenCalled();

          expect(dispatchSpy)
            .not
            .toHaveBeenCalled();
        });
      });

      describe('when chat has been opened', () => {
        beforeAll(() => {
          mockPrevActiveEmbed = '';
          mockNextActiveEmbed = 'chat';
        });

        it('dispatchs chatOpened', () => {
          expect(chatOpenedSpy)
            .toHaveBeenCalled();

          expect(dispatchSpy)
            .toHaveBeenCalled();
        });
      });
    });
  });
});
