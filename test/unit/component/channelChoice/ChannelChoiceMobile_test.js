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
        locals: {
          container: 'containerClass',
          newContainer: 'newContainerClass'
        }
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
    let result;

    describe('when it is called', () => {
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

    describe('when newHeight is true', () => {
      beforeEach(() => {
        const component = instanceRender(
          <ChannelChoiceMobile
            handleNextClick={noop}
            handleCancelClick={noop}
            newHeight={true} />
        );

        result = component.render();
      });

      it('has newContainer class', () => {
        expect(result.props.containerClasses)
          .toContain('newContainerClass');
      });
    });

    describe('when newHeight is false', () => {
      beforeEach(() => {
        const component = instanceRender(
          <ChannelChoiceMobile
            handleNextClick={noop}
            handleCancelClick={noop}
            newHeight={false} />
        );

        result = component.render();
      });

      it('has container class', () => {
        expect(result.props.containerClasses)
          .toContain('containerClass');
      });
    });
  });

  describe('renderCancelButton', () => {
    let result,
      componentProps;

    beforeEach(() => {
      const component = instanceRender(<ChannelChoiceMobile {...componentProps} />);

      result = component.renderCancelButton();
    });

    describe('when newHeight is true', () => {
      beforeAll(() => {
        componentProps = { newHeight: true };
      });

      it('returns null', () => {
        expect(result)
          .toBeNull();
      });
    });

    describe('when newHeight is false', () => {
      beforeAll(() => {
        componentProps = { newHeight: false };
      });

      it('returns a Button component', () => {
        expect(TestUtils.isElementOfType(result, Button))
          .toEqual(true);
      });
    });
  });
});
