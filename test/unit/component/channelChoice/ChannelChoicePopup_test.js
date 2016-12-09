describe('ChannelChoicePopup component', () => {
  let ChannelChoicePopup;
  const channelChoicePath = buildSrcPath('component/channelChoice/ChannelChoicePopup');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'component/button/ButtonIcon': {
        ButtonIcon: NoopReactComponent()
      },
      'service/i18n': {
        i18n: {
          init: noop,
          setLocale: noop,
          isRTL: noop,
          t: _.identity
        }
      },
      'utility/utils': {
        bindMethods: mockBindMethods
      }
    });

    ChannelChoicePopup = requireUncached(channelChoicePath).ChannelChoicePopup;
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('handleClick', () => {
    it('calls this.props.onClick with the correct params', () => {
      const channelChoicePopup = domRender(<ChannelChoicePopup onNextClick={jasmine.createSpy()} />);

      channelChoicePopup.handleClick('chat')();

      expect(channelChoicePopup.props.onNextClick)
        .toHaveBeenCalledWith('chat');
    });
  });
});
