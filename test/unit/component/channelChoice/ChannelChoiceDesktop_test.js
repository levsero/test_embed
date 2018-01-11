describe('ChannelChoiceDesktop component', () => {
  let ChannelChoiceDesktop,
    channelChoiceDesktop,
    channelChoiceComponent;
  const channelChoicePath = buildSrcPath('component/channelChoice/ChannelChoiceDesktop');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChannelChoiceDesktop.scss': {
        locals: {
          hr: 'hr',
          inner: 'inner',
          footerNoLogo: 'footerNoLogo'
        }
      },
      'component/channelChoice/ChannelChoiceMenu': {
        ChannelChoiceMenu: noopReactComponent()
      },
      'component/container/ScrollContainer': {
        ScrollContainer: class extends Component {
          render() {
            return (
              <div className={this.props.footerClasses}>
                {this.props.children}
                {this.props.footerContent}
              </div>
            );
          }
        }
      },
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

      it('should render the zendesk logo', () => {
        expect(channelChoiceComponent.querySelector('.zendeskLogo'))
          .not.toBeNull();
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

      it('should not render the zendesk logo', () => {
        expect(channelChoiceComponent.querySelector('.zendeskLogo'))
          .toBeNull();
      });
    });
  });
});
