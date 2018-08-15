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
      '@zendeskgarden/react-buttons': { Button },
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

    describe('classes', () => {
      beforeEach(() => {
        const component = instanceRender(
          <ChannelChoiceMobile
            handleNextClick={noop}
            handleCancelClick={noop} />
        );

        result = component.render();
      });

      it('has newContainer class', () => {
        expect(result.props.containerClasses)
          .toContain('newContainerClass');
      });
    });
  });
});
