describe('ButtonPill component', () => {
  let ButtonPill,
    mockRTL;
  const buttonPath = buildSrcPath('component/button/ButtonPill');

  const Icon = noopReactComponent('Icon');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Icon': { Icon },
      'service/i18n': {
        i18n: {
          isRTL: () => mockRTL
        }
      },
      './ButtonPill.scss': {
        locals: {
          fullscreen: 'fullscreen',
          rtl: 'rtl',
        }
      }
    });

    mockery.registerAllowable(buttonPath);

    ButtonPill = requireUncached(buttonPath).ButtonPill;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let component,
      componentArgs;

    beforeEach(() => {
      component = shallowRender(<ButtonPill {...componentArgs} />);
    });

    describe('when fullscreen is false', () => {
      beforeAll(() => {
        componentArgs = {
          fullscreen: false
        };
      });

      it('has fullscreen styles', () => {
        expect(component.props.className)
          .not.toContain('fullscreen');
      });
    });

    describe('when fullscreen is true', () => {
      beforeAll(() => {
        componentArgs = {
          fullscreen: true
        };
      });

      it('does not have fullscreen styles', () => {
        expect(component.props.className)
          .toContain('fullscreen');
      });
    });

    describe('when the browser is in RTL mode', () => {
      beforeAll(() => {
        mockRTL = true;
      });

      it('has rtl styles', () => {
        expect(component.props.className)
          .toContain('rtl');
      });
    });

    describe('when fullscreen is true', () => {
      beforeAll(() => {
        mockRTL = false;
      });

      it('does not have rtl styles', () => {
        expect(component.props.className)
          .not.toContain('rtl');
      });
    });

    describe('when showIcon is true', () => {
      beforeAll(() => {
        componentArgs = {
          showIcon: true
        };
      });

      it('renders an icon', () => {
        const icon = component.props.children[1];

        expect(TestUtils.isElementOfType(icon, Icon))
          .toEqual(true);

        expect(icon.props.type)
          .toEqual('Icon--arrow-down');
      });
    });

    describe('when showIcon is false', () => {
      beforeAll(() => {
        componentArgs = {
          showIcon: false
        };
      });

      it('does not render an icon', () => {
        const icon = component.props.children[1];

        expect(icon)
          .toBeNull();
      });
    });
  });
});
