describe('ChannelChoiceDesktop component', () => {
  let ChannelChoiceDesktop,
    channelChoiceDesktop,
    channelChoiceComponent;
  const channelChoicePath = buildSrcPath('component/channelChoice/ChannelChoiceDesktop');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      './ChannelChoiceDesktop.sass': {
        locals: {
          hr: 'hr',
          inner: 'inner',
          footerNoLogo: 'footerNoLogo'
        }
      },
      'component/button/ButtonIcon': { ButtonIcon: noopReactComponent() },
      'component/container/ScrollContainer': {
        ScrollContainer: class extends Component {
          render() {
            return (
              <div className={this.props.footerClasses}>
                {this.props.children}
              </div>
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

    ChannelChoiceDesktop = requireUncached(channelChoicePath).ChannelChoiceDesktop;
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    describe('default props', () => {
      beforeEach(() => {
        channelChoiceDesktop = domRender(
          <ChannelChoiceDesktop
            formTitleKey='key'
            handleNextClick={noop} />
        );
        channelChoiceComponent = ReactDOM.findDOMNode(channelChoiceDesktop);
      });

      it('has an inner container class', () => {
        expect(channelChoiceComponent.querySelector('.inner'))
          .not.toBeNull();
      });

      it('shows the divider', () => {
        expect(channelChoiceComponent.querySelector('.hr'))
          .not.toBeNull();
      });

      it('does not pass the footerNoLogo class to ScrollContainer', () => {
        expect(channelChoiceComponent.querySelector('.footerNoLogo'))
          .toBeNull();
      });
    });

    describe('when hideZendeskLogo is true', () => {
      beforeEach(() => {
        channelChoiceDesktop = domRender(
          <ChannelChoiceDesktop
            formTitleKey='key'
            handleNextClick={noop}
            hideZendeskLogo={true} />
        );
        channelChoiceComponent = ReactDOM.findDOMNode(channelChoiceDesktop);
      });

      it('does not have an inner container class', () => {
        expect(channelChoiceComponent.querySelector('.inner'))
          .toBeNull();
      });

      it('does not show the divider', () => {
        expect(channelChoiceComponent.querySelector('.hr'))
          .toBeNull();
      });

      it('passes the footerNoLogo class to ScrollContainer', () => {
        expect(channelChoiceComponent.querySelector('.footerNoLogo'))
          .not.toBeNull();
      });
    });
  });
});
