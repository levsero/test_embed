describe('ChannelChoice component', () => {
  let ChannelChoice;
  const channelChoicePath = buildSrcPath('component/channelChoice/ChannelChoice');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      './ChannelChoice.sass': {
        locals: {
          hr: 'hr',
          inner: 'inner',
          footerNoLogo: 'footerNoLogo'
        }
      },
      'component/button/ButtonIcon': {
        ButtonIcon: noopReactComponent()
      },
      'component/container/Container': {
        Container: class extends Component {
          render() {
            return (
              <div>{this.props.children}</div>
            );
          }
        }
      },
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
    let channelChoice, channelChoiceComponent;

    describe('default props', () => {
      beforeEach(() => {
        channelChoice = domRender(<ChannelChoice />);
        channelChoiceComponent = ReactDOM.findDOMNode(channelChoice);
      });

      it('has an inner container class', () => {
        expect(channelChoiceComponent.querySelector('.inner'))
          .not.toBeNull();
      });

      it('shows the divider', () => {
        expect(channelChoiceComponent.querySelector('.hr'))
          .not.toBeNull();
      });

      it('renders the zendesk logo component', () => {
        expect(channelChoiceComponent.querySelector('.zendeskLogo'))
          .not.toBeNull();
      });

      it('does not pass the footerNoLogo class to ScrollContainer', () => {
        expect(channelChoiceComponent.querySelector('.footerNoLogo'))
          .toBeNull();
      });
    });

    describe('when hideZendeskLogo is true', () => {
      beforeEach(() => {
        channelChoice = domRender(<ChannelChoice hideZendeskLogo={true} />);
        channelChoiceComponent = ReactDOM.findDOMNode(channelChoice);
      });

      it('does not have an inner container class', () => {
        expect(channelChoiceComponent.querySelector('.inner'))
          .toBeNull();
      });

      it('does not show the divider', () => {
        expect(channelChoiceComponent.querySelector('.hr'))
          .toBeNull();
      });

      it('does not render the zendesk logo component', () => {
        expect(channelChoiceComponent.querySelector('.zendeskLogo'))
          .toBeNull();
      });

      it('passes the footerNoLogo class to ScrollContainer', () => {
        expect(channelChoiceComponent.querySelector('.footerNoLogo'))
          .not.toBeNull();
      });
    });
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
