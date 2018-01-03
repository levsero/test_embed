describe('Navigation', () => {
  let Navigation;

  const navigationPath = buildSrcPath('component/frame/Navigation');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/button/ButtonNav': {
        ButtonNav: class extends Component {
          render() {
            return (
              <div className={this.props.className}>
                {this.props.label}
              </div>
            );
          }
        }
      },
      'service/i18n': {
        i18n: {
          isRTL: () => false
        }
      },
      'component/Icon': {
        Icon: class extends Component {
          render() {
            return <div className={this.props.type} />;
          }
        }
      }
    });

    Navigation = requireUncached(navigationPath).default.WrappedComponent;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('close button', () => {
    let navigation, navigationNode;

    beforeEach(() => {
      navigation = domRender(<Navigation />);
      navigationNode = ReactDOM.findDOMNode(navigation);
    });

    describe('when state.showCloseButton is true', () => {
      beforeEach(() => {
        navigation.setState({ showCloseButton: true });
      });

      it('should render the close button', () => {
        expect(navigationNode.querySelector('.Icon--close'))
          .not.toBeNull();
      });
    });

    describe('when state.showCloseButton is false', () => {
      beforeEach(() => {
        navigation.setState({ showCloseButton: false });
      });

      it('should not render the close button', () => {
        expect(navigationNode.querySelector('.Icon--close'))
          .toBeNull();
      });
    });
  });

  describe('back button', () => {
    let navigation, navigationNode;

    describe('when props.backButtonVisible is true', () => {
      describe('when props.useBackButton is true', () => {
        beforeEach(() => {
          navigation = domRender(
            <Navigation useBackButton={true} backButtonVisible={true} />
          );
          navigationNode = ReactDOM.findDOMNode(navigation);
        });

        it('should render the back button', () => {
          expect(navigationNode.querySelector('.Icon--back'))
            .not.toBeNull();
        });
      });

      describe('when props.useBackButton is false', () => {
        beforeEach(() => {
          navigation = domRender(
            <Navigation useBackButton={false} backButtonVisible={true} />
          );
          navigationNode = ReactDOM.findDOMNode(navigation);
        });

        it('should not render the back button', () => {
          expect(navigationNode.querySelector('.Icon--back'))
            .toBeNull();
        });
      });
    });

    describe('when props.backButtonVisible is false', () => {
      beforeEach(() => {
        navigation = domRender(<Navigation backButtonVisible={false} />);
        navigationNode = ReactDOM.findDOMNode(navigation);
      });

      it('should not render the back button', () => {
        expect(navigationNode.querySelector('.Icon--back'))
          .toBeNull();
      });
    });
  });
});
