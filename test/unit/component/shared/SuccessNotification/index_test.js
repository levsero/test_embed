describe('SuccessNotification component', () => {
  let SuccessNotification;
  const successNotificationPath = buildSrcPath('component/shared/SuccessNotification');
  const Icon = noopReactComponent();

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './SuccessNotification.scss': {
        locals: {
          'button': 'btnClass',
          'contentMobile': 'contentMobile',
          'mobileMessages': 'mobileMessages',
          'desktopMessages': 'desktopMessages'
        }
      },
      'component/Icon': {
        Icon
      },
      '@zendeskgarden/react-buttons': {
        Button: class extends Component {
          render() {
            const { onClick, className } = this.props;

            return (
              <input type='button' className={className} onClick={onClick} />
            );
          }
        }
      },
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      }
    });

    mockery.registerAllowable(successNotificationPath);
    SuccessNotification = requireUncached(successNotificationPath).SuccessNotification;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('icon', () => {
    let component;

    beforeEach(() => {
      component = domRender(
        <SuccessNotification icon='my-icon' />
      );
    });

    it('renders the icon', () => {
      expect(() => TestUtils.findRenderedComponentWithType(component, Icon))
        .not.toThrow();
    });

    it('the rendered Icon has the type of the icon prop', () => {
      expect(TestUtils.findRenderedComponentWithType(component, Icon).props.type)
        .toEqual('my-icon');
    });
  });

  describe('contentClasses', () => {
    let component,
      result;

    beforeEach(() => {
      component = domRender(
        <SuccessNotification isMobile={true} />
      );
      result = component.render();
    });

    it('renders contentMobile class', () => {
      expect(result.props.className)
        .toContain('contentMobile');
    });
  });

  describe('messageClasses', () => {
    let component,
      result,
      mockIsMobile;

    beforeEach(() => {
      component = domRender(
        <SuccessNotification isMobile={mockIsMobile} />
      );
      result = component.render();
    });

    describe('when isMobile is true', () => {
      beforeAll(() => {
        mockIsMobile = true;
      });

      it('renders mobileMessages class', () => {
        expect(result.props.children[1].props.className)
          .toContain('mobileMessages');
      });

      it('does not render desktopMessages class', () => {
        expect(result.props.children[1].props.className)
          .not
          .toContain('desktopMessages');
      });
    });

    describe('when isMobile is false', () => {
      beforeAll(() => {
        mockIsMobile = false;
      });

      it('does not render mobileMessages class', () => {
        expect(result.props.children[1].props.className)
          .not
          .toContain('mobileMessages');
      });

      it('renders desktopMessages class', () => {
        expect(result.props.children[1].props.className)
          .toContain('desktopMessages');
      });
    });
  });
});
