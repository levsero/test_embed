describe('ChannelChoiceMobile component', () => {
  let ChannelChoiceMobile,
    channelChoiceMobile,
    channelChoiceComponent;
  const channelChoicePath = buildSrcPath('component/channelChoice/ChannelChoiceMobile');

  const Button = noopReactComponent();

  beforeEach(() => {
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
      'component/button/Button': { Button },
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
    beforeEach(() => {
      channelChoiceMobile = domRender(
        <ChannelChoiceMobile
          handleNextClick={noop}
          handleCancelClick={noop} />
      );
      channelChoiceComponent = ReactDOM.findDOMNode(channelChoiceMobile);
    });

    it('renders the ChannelChoiceMobilePopup component', () => {
      expect(channelChoiceComponent.querySelector('.ChannelChoicePopupMobile'))
        .not.toBeNull();
    });
  });

  describe('renderCancelButton', () => {
    let result,
      componentProps;

    beforeEach(() => {
      const component = instanceRender(<ChannelChoiceMobile {...componentProps} />);

      result = component.renderCancelButton();
    });

    describe('when newChannelChoice is true', () => {
      beforeAll(() => {
        componentProps = { newChannelChoice: true };
      });

      it('returns null', () => {
        expect(result)
          .toBeNull();
      });
    });

    describe('when newChannelChoice is false', () => {
      beforeAll(() => {
        componentProps = { newChannelChoice: false };
      });

      it('returns a Button component', () => {
        expect(TestUtils.isElementOfType(result, Button))
          .toEqual(true);
      });
    });
  });
});
