describe('ChannelChoice component', () => {
  let ChannelChoice,
    channelChoice;
  const channelChoicePath = buildSrcPath('component/channelChoice/ChannelChoice');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'component/container/Container': {
        Container: class extends Component {
          render() {
            return (
              <div>{this.props.children}</div>
            );
          }
        }
      },
      'component/channelChoice/ChannelChoiceDesktop': { ChannelChoiceDesktop: noopReactComponent() },
      'component/channelChoice/ChannelChoiceMobile': { ChannelChoiceMobile: noopReactComponent() },
      'component/ZendeskLogo': {
        ZendeskLogo: class extends Component {
          render() {
            return (
              <div className='zendeskLogo' />
            );
          }
        }
      },
      'service/i18n': {
        i18n: {
          init: noop,
          setLocale: noop,
          isRTL: noop,
          t: _.identity
        }
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

    describe('zendeskLogo', () => {
      let channelChoiceComponent;

      describe('when props.hideZendeskLogo is false', () => {
        beforeEach(() => {
          channelChoice = domRender(<ChannelChoice hideZendeskLogo={false} />);
          channelChoiceComponent = ReactDOM.findDOMNode(channelChoice);
        });

        it('should render the zendesk logo', () => {
          expect(channelChoiceComponent.querySelector('.zendeskLogo'))
            .not.toBeNull();
        });
      });

      describe('when props.hideZendeskLogo is true', () => {
        beforeEach(() => {
          channelChoice = domRender(<ChannelChoice hideZendeskLogo={true} />);
          channelChoiceComponent = ReactDOM.findDOMNode(channelChoice);
        });

        it('should not render the zendesk logo', () => {
          expect(channelChoiceComponent.querySelector('.zendeskLogo'))
            .toBeNull();
        });
      });
    });
  });

  describe('handleNextClick', () => {
    let onNextClickSpy,
      showCloseButtonSpy;

    beforeEach(() => {
      onNextClickSpy = jasmine.createSpy('onNextClick');
      showCloseButtonSpy = jasmine.createSpy('showCloseButton');
      channelChoice = domRender(
        <ChannelChoice
          onNextClick={onNextClickSpy}
          showCloseButton={showCloseButtonSpy} />
      );

      channelChoice.handleNextClick('chat');
    });

    it('should call props.onNextClick with embed param', () => {
      expect(onNextClickSpy)
        .toHaveBeenCalledWith('chat');
    });

    it('should call props.showCloseButton', () => {
      expect(showCloseButtonSpy)
        .toHaveBeenCalled();
    });
  });
});
