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
      './Navigation.scss': {
        locals: {
          'iconNewDesign': 'iconNewDesign',
          'icon': 'icon'
        }
      },
      'component/Icon': {
        Icon: class extends Component {
          render() {
            return <div className={`${this.props.type} ${this.props.className}`} />;
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

    describe('when props.hideCloseButton is false', () => {
      beforeEach(() => {
        navigation = domRender(<Navigation hideCloseButton={false} />);
        navigationNode = ReactDOM.findDOMNode(navigation);
      });

      it('renders the close button', () => {
        expect(navigationNode.querySelector('.Icon--close'))
          .not.toBeNull();
      });
    });

    describe('when state.showCloseButton is true', () => {
      beforeEach(() => {
        navigation = domRender(<Navigation hideCloseButton={true} />);
        navigationNode = ReactDOM.findDOMNode(navigation);
      });

      it('does not render the close button', () => {
        expect(navigationNode.querySelector('.Icon--close'))
          .toBeNull();
      });
    });

    it('does not have new design classes', () => {
      expect(navigationNode.querySelector('.iconNewDesign'))
        .toBeNull();
    });

    describe('when newDesign is true', () => {
      beforeEach(() => {
        navigation = domRender(<Navigation newDesign={true} />);
        navigationNode = ReactDOM.findDOMNode(navigation);
      });

      it('renders the dash button icon', () => {
        expect(navigationNode.querySelector('.Icon--dash'))
          .not.toBeNull();
      });

      it('has new design classes', () => {
        expect(navigationNode.querySelector('.iconNewDesign'))
          .not.toBeNull();
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
