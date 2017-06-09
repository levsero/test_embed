describe('ChannelChoicePopupDesktop component', () => {
  let ChannelChoicePopupDesktop;
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
      const channelChoicePopup = domRender(<ChannelChoicePopupDesktop onNextClick={jasmine.createSpy()} />);

      channelChoicePopup.handleClick('chat')();

      expect(channelChoicePopup.props.onNextClick)
        .toHaveBeenCalledWith('chat');
    });
  });
});
