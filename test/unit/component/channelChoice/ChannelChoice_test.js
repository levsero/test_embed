describe('ChannelChoice component', () => {
  let ChannelChoice;
  const channelChoicePath = buildSrcPath('component/channelChoice/ChannelChoice');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'component/button/Button': {
        Button: NoopReactComponent()
      },
      'component/Container': {
        Container: NoopReactComponent()
      },
      'component/ScrollContainer': {
        ScrollContainer: NoopReactComponent()
      },
      'component/ZendeskLogo': {
        ZendeskLogo: NoopReactComponent()
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

    ChannelChoice = requireUncached(channelChoicePath).ChannelChoice;
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('handleClick', () => {
    it('calls this.props.onClick with the correct params', () => {
      const channelChoice = domRender(<ChannelChoice onNextClick={jasmine.createSpy()} />);

      channelChoice.handleClick('chat')();

      expect(channelChoice.props.onNextClick)
        .toHaveBeenCalledWith('chat');
    });
  });
});
