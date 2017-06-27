describe('ChannelChoicePopupDesktop component', () => {
  let ChannelChoicePopupDesktop,
    channelChoicePopup;
  const channelChoicePath = buildSrcPath('component/channelChoice/ChannelChoicePopupDesktop');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'component/button/ButtonIcon': {
        ButtonIcon: noopReactComponent()
      },
      'service/i18n': {
        i18n: {
          init: noop,
          setLocale: noop,
          isRTL: noop,
          t: _.identity
        }
      },
      './ChannelChoice.sass': {
        locals: {}
      }
    });

    ChannelChoicePopupDesktop = requireUncached(channelChoicePath).ChannelChoicePopupDesktop;
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('handleClick', () => {
    it('calls this.props.onClick with the correct params', () => {
      channelChoicePopup = domRender(<ChannelChoicePopupDesktop onNextClick={jasmine.createSpy()} />);

      channelChoicePopup.handleClick('chat')();

      expect(channelChoicePopup.props.onNextClick)
        .toHaveBeenCalledWith('chat');
    });
  });

  describe('handleChatClick', () => {
    describe('when chat is online', () => {
      beforeEach(() => {
        channelChoicePopup = domRender(
          <ChannelChoicePopupDesktop
            chatOnline={true}
            onNextClick={noop} />
        );
        spyOn(channelChoicePopup, 'handleClick');
      });

      it('should call handleClick with `chat`', () => {
        channelChoicePopup.handleChatClick();

        expect(channelChoicePopup.handleClick)
          .toHaveBeenCalledWith('chat');
      });
    });

    describe('when chat is offline', () => {
      let handler,
        stopPropagationSpy;

      beforeEach(() => {
        channelChoicePopup = instanceRender(
          <ChannelChoicePopupDesktop
            chatOnline={false}
            onCancelClick={noop}
            handleNextClick={noop} />
        );
        stopPropagationSpy = jasmine.createSpy('stopPropagation');
        spyOn(channelChoicePopup, 'handleClick');

        handler = channelChoicePopup.handleChatClick();
      });

      it('should not call handleNextClick', () => {
        expect(channelChoicePopup.handleClick)
          .not.toHaveBeenCalled();
      });

      it('returns an anonymous function that calls e.stopPropagation', () => {
        handler({ stopPropagation: stopPropagationSpy });

        expect(stopPropagationSpy)
          .toHaveBeenCalled();
      });
    });
  });
});
