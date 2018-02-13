describe('ChannelChoice component', () => {
  let ChannelChoice,
    channelChoice;
  const channelChoicePath = buildSrcPath('component/channelChoice/ChannelChoice');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'component/channelChoice/ChannelChoiceDesktop': { ChannelChoiceDesktop: noopReactComponent() },
      'component/channelChoice/ChannelChoiceMobile': { ChannelChoiceMobile: noopReactComponent() }
    });

    ChannelChoice = requireUncached(channelChoicePath).ChannelChoice;
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    describe('when on desktop', () => {
      beforeEach(() => {
        channelChoice = domRender(<ChannelChoice isMobile={false} />);
      });

      it('should render the ChannelChoiceDesktop component', () => {
        expect(channelChoice.refs.channelChoiceDesktop)
          .toBeDefined();
      });
    });

    describe('when on mobile', () => {
      beforeEach(() => {
        channelChoice = domRender(<ChannelChoice isMobile={true} />);
      });

      it('should render the ChannelChoiceMobile component', () => {
        expect(channelChoice.refs.channelChoiceMobile)
          .toBeDefined();
      });
    });
  });

  describe('handleNextClick', () => {
    let onNextClickSpy;

    beforeEach(() => {
      onNextClickSpy = jasmine.createSpy('onNextClick');
      channelChoice = domRender(
        <ChannelChoice
          onNextClick={onNextClickSpy} />
      );

      channelChoice.handleNextClick('chat');
    });

    it('should call props.onNextClick with embed param', () => {
      expect(onNextClickSpy)
        .toHaveBeenCalledWith('chat');
    });
  });
});
