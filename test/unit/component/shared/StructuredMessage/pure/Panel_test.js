describe('Pure Panel Component', () => {
  let Panel;
  let PanelWrapper;

  const panelPath = buildSrcPath('component/shared/StructuredMessage/pure/Panel');
  const constantPath = buildSrcPath('constants/shared');

  const FONT_SIZE = requireUncached(constantPath).FONT_SIZE;

  const Icon = noopReactComponent();

  const onClickSpy = jasmine.createSpy('onClick');
  const isFirefoxSpy = jasmine.createSpy('isFirefox');
  const isIESpy = jasmine.createSpy('isIE');

  const expectedDefaultProps = {
    panel:
    {
      headingLineClamp: 2,
      paragraphLineClamp: 2,
      imageAspectRatio: 2,
      layout: 'hero',
      roundedTop: false,
      roundedBottom: false,
      borderBottomWidth: true
    }
  };

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './Panel.scss': {
        locals: {
          panel: 'panel',
          noPadding: 'noPadding',
          hasLink: 'hasLink',

          panelHeading: 'panelHeading',
          lineClamp: 'lineClamp',
          panelHeaderMargin: 'panelHeaderMargin',
          panelContent: 'panelContent',

          noBorderRadiusTop: 'noBorderRadiusTop',
          noBorderRadiusBottom: 'noBorderRadiusBottom',
          noBorderBottomWidth: 'noBorderBottomWidth'
        }
      },
      'component/Icon': {
        Icon
      },
      'constants/shared': {
        FONT_SIZE
      },
      'utility/devices': {
        isFirefox: isFirefoxSpy,
        isIE: isIESpy
      }
    });

    mockery.registerAllowable(panelPath);
    Panel = requireUncached(panelPath).Panel;
    PanelWrapper = requireUncached(panelPath).PanelWrapper;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();

    onClickSpy.calls.reset();
    isFirefoxSpy.calls.reset();
    isIESpy.calls.reset();
  });

  it('has correct default value', () => {
    const component = instanceRender(<Panel />);

    expect(component.props).toEqual(expectedDefaultProps);
  });

  describe('with default props', () => {
    let component;
    let result;

    beforeEach(() => {
      component = instanceRender(<Panel />);
      spyOn(component, 'renderHeroImage');
      spyOn(component, 'renderPanelContent');
      spyOn(component, 'renderThumbnail');

      result = component.render();
    });

    it('should get correct panelClassNames', () => {
      expect(result.props.className).toEqual('panel noBorderRadiusTop noBorderRadiusBottom');
    });

    it('should call renderHeroImage', () => {
      expect(component.renderHeroImage).toHaveBeenCalledWith(expectedDefaultProps.panel);
    });

    it('should call renderPanelContent', () => {
      expect(component.renderPanelContent).toHaveBeenCalledWith(expectedDefaultProps.panel);
    });

    it('should return undefined for the first child', () => {
      expect(result.props.children[0]).toBeUndefined();
    });
  });

  describe('with custom props', () => {
    describe('imageUrl', () => {
      it('should get defined first child when imageUrl prop is provided', () => {
        const panel = {
          imageUrl: 'image.jpg'
        };

        const component = instanceRender(<Panel panel={panel} />);
        const result = component.render();

        expect(result.props.children[0]).toBeDefined();
      });
    });

    describe('layout', () => {
      it('should get null as first child when layout is not hero', () => {
        const panel = {
          layout: 'thumbnail'
        };

        const component = instanceRender(<Panel panel={panel} />);
        const result = component.render();

        expect(result.props.children[0]).toBeUndefined();
      });
    });

    describe('roundedTop', () => {
      it('should not have noBorderRadiusTop classname when roundedTop is true', () => {
        const panel = {
          roundedTop: true
        };

        const component = instanceRender(<Panel panel={panel} />);
        const result = component.render();

        expect(result.props.className).toEqual('panel noBorderRadiusBottom');
      });
    });

    describe('roundedBottom', () => {
      it('should not have noBorderRadiusBottom classname when roundedBottom is true', () => {
        const panel = {
          roundedBottom: true
        };

        const component = instanceRender(<Panel panel={panel} />);
        const result = component.render();

        expect(result.props.className).toEqual('panel noBorderRadiusTop');
      });
    });

    describe('borderBottomWidth', () => {
      it('should have noBorderBottomWidth classname when borderBottomWidth is false', () => {
        const panel = {
          borderBottomWidth: false
        };

        const component = instanceRender(<Panel panel={panel} />);
        const result = component.render();

        expect(result.props.className).toEqual('panel noBorderRadiusTop noBorderRadiusBottom noBorderBottomWidth');
      });
    });
  });

  describe('.renderHeroImage', () => {
    const panelProps = {
      imageAspectRatio: 4 / 3,
      imageUrl: 'image.png'
    };
    let component;

    beforeEach(() => {
      component = instanceRender(<Panel panel={panelProps}/>);
    });

    it('should give the correct aspect ratio style', () => {
      const result = component.render();

      expect(result.props.children[0].props.children[0].props.style).toEqual({ paddingBottom: '75%' });
    });
  });

  describe('.renderPanelContent', () => {
    let component,
      result;

    const panelProps = {
      ...expectedDefaultProps.panel,
      paragraph: 'text'
    };

    beforeEach(() => {
      component = instanceRender(<Panel panel={panelProps}/>);
      spyOn(component, 'renderThumbnail');
    });

    it('should call renderThumbnail', () => {
      result = component.render();

      expect(component.renderThumbnail).toHaveBeenCalledWith(panelProps);
    });

    describe('Browser is neither IE nor firefox', () => {
      beforeEach(() => {
        isFirefoxSpy.and.returnValue(false);
        isIESpy.and.returnValue(false);

        result = component.render();
      });

      it('should set max height "auto" for header', () => {
        expect(result.props.children[1].props.children[1].props.children[0].props.style.maxHeight)
          .toEqual('auto');
      });

      it('should set max height "auto" for paragraph', () => {
        expect(result.props.children[1].props.children[1].props.children[1].props.style.maxHeight)
          .toEqual('auto');
      });
    });

    describe('Browser is IE', () => {
      beforeEach(() => {
        isFirefoxSpy.and.returnValue(false);
        isIESpy.and.returnValue(true);

        result = component.render();
      });

      it('should set calculated max height for header', () => {
        expect(result.props.children[1].props.children[1].props.children[0].props.style.maxHeight)
          .toEqual(`${16 * expectedDefaultProps.panel.headingLineClamp / FONT_SIZE}rem`);
      });

      it('should set calculated max height for paragraph', () => {
        expect(result.props.children[1].props.children[1].props.children[1].props.style.maxHeight)
          .toEqual(`${16 * expectedDefaultProps.panel.paragraphLineClamp / FONT_SIZE}rem`);
      });
    });

    describe('Browser is Firefox', () => {
      beforeEach(() => {
        isFirefoxSpy.and.returnValue(true);
        isIESpy.and.returnValue(false);

        result = component.render();
      });

      it('should set calculated max height for header', () => {
        expect(result.props.children[1].props.children[1].props.children[0].props.style.maxHeight)
          .toEqual(`${16 * expectedDefaultProps.panel.headingLineClamp / FONT_SIZE}rem`);
      });

      it('should set calculated max height for paragraph', () => {
        expect(result.props.children[1].props.children[1].props.children[1].props.style.maxHeight)
          .toEqual(`${16 * expectedDefaultProps.panel.paragraphLineClamp / FONT_SIZE}rem`);
      });
    });
  });

  describe('PanelWrapper', () => {
    describe('when onclick is invalid', () => {
      it('should return div element', () => {
        const result = new PanelWrapper({});

        expect(result.type).toEqual('div');
      });
    });

    describe('when onclick is valid', () => {
      it('should return button element', () => {
        const result = new PanelWrapper({ onClick: onClickSpy });

        expect(result.type).toEqual('button');
      });
    });
  });
});
