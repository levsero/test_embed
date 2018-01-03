describe('ChannelChoiceMobile component', () => {
  let ChannelChoiceMobile,
    channelChoiceMobile,
    channelChoiceComponent;
  const channelChoicePath = buildSrcPath('component/channelChoice/ChannelChoiceMobile');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      './ChannelChoiceMobile.scss': {
        locals: {}
      },
      'component/channelChoice/ChannelChoicePopupMobile': {
        ChannelChoicePopupMobile: class extends Component {
          render() {
            return <div className='ChannelChoicePopupMobile' />;
          }
        }
      },
      'component/button/Button': {
        Button: noopReactComponent()
      },
      'component/container/ScrollContainer': {
        ScrollContainer: class extends Component {
          render() {
            return <div>{this.props.children}</div>;
          }
        }
      },
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      }
    });

    ChannelChoiceMobile = requireUncached(channelChoicePath).ChannelChoiceMobile;
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let showCloseButtonSpy;

    beforeEach(() => {
      showCloseButtonSpy = jasmine.createSpy('showCloseButton');

      channelChoiceMobile = domRender(
        <ChannelChoiceMobile
          handleNextClick={noop}
          handleCancelClick={noop}
          showCloseButton={showCloseButtonSpy} />
      );
      channelChoiceComponent = ReactDOM.findDOMNode(channelChoiceMobile);
    });

    it('renders the ChannelChoiceMobilePopup component', () => {
      expect(channelChoiceComponent.querySelector('.ChannelChoicePopupMobile'))
        .not.toBeNull();
    });
  });
});
