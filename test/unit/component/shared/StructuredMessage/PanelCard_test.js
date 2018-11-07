describe('Pure PanelCard Component', () => {
  let PanelCard;

  const panelCardPath = buildSrcPath('component/shared/StructuredMessage/PanelCard');
  const constantPath = buildSrcPath('constants/shared');

  const FONT_SIZE = requireUncached(constantPath).FONT_SIZE;
  const Card = noopReactComponent();
  const ButtonList = noopReactComponent();
  const Icon = noopReactComponent();

  const onClickSpy = jasmine.createSpy('onClick');
  const isFirefoxSpy = jasmine.createSpy('isFirefox');
  const isIESpy = jasmine.createSpy('isIE');

  const expectedDefaultProps = {
    children: [],
    panel:
    {
      headingLineClamp: 2,
      paragraphLineClamp: 2,
      imageAspectRatio: 2
    }
  };

  const mockProps = {
    panel: {
      heading: 'This is a header',
      paragraph: 'This is a paragraph'
    }
  };

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './PanelCard.scss': {
        locals: {
          panel: 'panel',
          panelWithButtons: 'panelWithButtons',
          noPadding: 'noPadding',
          hasLink: 'hasLink',

          panelHeading: 'panelHeading',
          lineClamp: 'lineClamp',
          panelHeaderMargin: 'panelHeaderMargin',
          panelContent: 'panelContent'
        }
      },
      './pure/Card': {
        Card
      },
      './pure/ButtonList': {
        ButtonList
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

    mockery.registerAllowable(panelCardPath);
    PanelCard = requireUncached(panelCardPath).PanelCard;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();

    onClickSpy.calls.reset();
    isFirefoxSpy.calls.reset();
    isIESpy.calls.reset();
  });

  it('has correct default value', () => {
    const component = instanceRender(<PanelCard />);

    expect(component.props).toEqual(expectedDefaultProps);
  });

  describe('when props are empty', () => {
    let result,
      props = {};

    beforeEach(() => {
      const component = instanceRender(<PanelCard {...props} />);

      result = component.render();
    });

    it('parent element should be Card component', () => {
      expect(TestUtils.isElementOfType(result, Card)).toEqual(true);
    });

    it('first child element should be div element', () => {
      const firstChild = result.props.children[0];

      expect(TestUtils.isElementOfType(firstChild, 'div'));
    });

    it('second child element should be ButtonList component', () => {
      const secondChild = result.props.children[1];

      expect(TestUtils.isElementOfType(secondChild, ButtonList));
    });
  });

  describe('when props.panel.onClick is valid', () => {
    let result,
      props = {
        panel: {
          onClick: onClickSpy
        }
      };

    beforeEach(() => {
      const component = instanceRender(<PanelCard {...props} />);

      result = component.render();
    });

    it('first child element should be button element', () => {
      const firstChild = result.props.children[0];

      expect(TestUtils.isElementOfType(firstChild, 'button'));
    });
  });

  describe('Panel element should receive the correct props', () => {
    let panel;
    let props = {};

    beforeEach(() => {
      const component = instanceRender(<PanelCard {...props}/>);
      const result = component.render();

      panel = result.props.children[0];
    });

    describe('classname prop', () => {
      it('has .panel when there is no children', () => {
        expect(panel.props.className).toContain('panel');
      });

      describe('when there is children', () => {
        beforeAll(() => {
          props = {
            children: [noopReactComponent()]
          };
        });

        it('has .panelWithButtons', () => {
          expect(panel.props.className).toContain('panelWithButtons');
        });

        it('has no .panel', () => {
          expect(panel.props.className.split(' ')).not.toContain('panel');
        });
      });

      it('has no .hasLink when there is props.panel.onClick is invalid', () => {
        expect(panel.props.className).not.toContain('hasLink');
      });

      describe('where props.panel.onClick is valid', () => {
        beforeAll(() => {
          props = {
            panel: {
              onClick: onClickSpy
            }
          };
        });

        it('has .hasLink', () => {
          expect(panel.props.className).toContain('hasLink');
        });
      });
    });

    describe('onClick prop', () => {
      beforeAll(() => {
        props = {
          panel: {
            onClick: onClickSpy
          }
        };
      });

      it('pass the onClick prop to button', () => {
        expect(panel.props.onClick).toEqual(onClickSpy);
      });
    });
  });

  describe('.renderPanelImage with default panel props', () => {
    let component;

    beforeEach(() => {
      component = instanceRender(<PanelCard {...mockProps} />);
      spyOn(component, 'renderPanelImage');

      component.render();
    });

    it('should call renderPanelImage', () => {
      expect(component.renderPanelImage).toHaveBeenCalled();
    });

    it('should call renderPanelImage with correct default params', () => {
      expect(component.renderPanelImage).toHaveBeenCalledWith({
        ...expectedDefaultProps.panel,
        ...mockProps.panel
      });
    });

    it('should return null when imageUrl is undefined', () => {
      const component = instanceRender(<PanelCard />);
      const response = component.renderPanelImage({});

      expect(response).toEqual(undefined);
    });

    it('should return not null when imageUrl is defined', () => {
      const component = instanceRender(<PanelCard />);
      const response = component.renderPanelImage({imageUrl: 'image.png'});

      expect(response).not.toEqual(undefined);
    });

    it('should give the correct aspect ratio style', () => {
      const component = instanceRender(<PanelCard />);
      const response = component.renderPanelImage({
        imageUrl: 'image.png',
        imageAspectRatio: 4/3
      });

      expect(response.props.children[0].props.style).toEqual({paddingBottom: '75%'});
    });
  });

  describe('.renderPanelImage with custom panel props', () => {
    const customProps = {
      panel: {
        ...mockProps.panel,
        headingLineClamp: 3,
        paragraphLineClamp: 5,
        imageAspectRatio: 4 / 3
      }
    };
    let component;

    beforeEach(() => {
      component = instanceRender(<PanelCard {...customProps} />);
      spyOn(component, 'renderPanelImage');

      component.render();
    });

    it('should call renderPanelImage with overwritten params', () => {
      expect(component.renderPanelImage).toHaveBeenCalledWith({
        ...customProps.panel
      });
    });
  });

  describe('.renderPanelContent with default params', () => {
    let component;

    beforeEach(() => {
      component = instanceRender(<PanelCard {...mockProps} />);
      spyOn(component, 'renderPanelContent');

      component.render();
    });

    it('should call renderPanelContent', () => {
      expect(component.renderPanelContent).toHaveBeenCalled();
    });

    it('should call renderPanelContent with correct default params', () => {
      expect(component.renderPanelContent).toHaveBeenCalledWith({
        ...expectedDefaultProps.panel,
        ...mockProps.panel
      });
    });
  });

  describe('.renderPanelContent with custom panel props', () => {
    const customProps = {
      panel: {
        ...mockProps.panel,
        headingLineClamp: 3,
        paragraphLineClamp: 5,
        imageAspectRatio: 10 / 6
      }
    };

    it('should call renderPanelContent with overwritten params', () => {
      const component = instanceRender(<PanelCard {...customProps} />);

      spyOn(component, 'renderPanelContent');

      component.render();

      expect(component.renderPanelContent).toHaveBeenCalledWith({
        ...customProps.panel
      });
    });
  });

  describe('.renderPanelContent with different browser support', () => {
    let component;

    beforeEach(() => {
      component = instanceRender(<PanelCard {...mockProps} />);
      component.render();
    });

    describe('Browser is not IE and firefox', () => {
      beforeAll(() => {
        isFirefoxSpy.and.returnValue(false);
        isIESpy.and.returnValue(false);
      });

      it('should set max height "auto" for header', () => {
        const response = component.renderPanelContent(mockProps.panel);

        expect(response.props.children[0].props.style.maxHeight)
          .toEqual('auto');
      });

      it('should set max height "auto" for paragraph', () => {
        const response = component.renderPanelContent(mockProps.panel);

        expect(response.props.children[1].props.style.maxHeight)
          .toEqual('auto');
      });
    });

    describe('Browser is IE', () => {
      beforeAll(() => {
        isFirefoxSpy.and.returnValue(false);
        isIESpy.and.returnValue(true);
      });

      it('should set calculated max height for header', () => {
        const response = component.renderPanelContent(mockProps.panel);

        expect(response.props.children[0].props.style.maxHeight)
          .toEqual(`${16 * mockProps.panel.headingLineClamp / FONT_SIZE}rem`);
      });

      it('should set calculated max height for paragraph', () => {
        const response = component.renderPanelContent(mockProps.panel);

        expect(response.props.children[1].props.style.maxHeight)
          .toEqual(`${16 * mockProps.panel.paragraphLineClamp / FONT_SIZE}rem`);
      });
    });

    describe('Browser is Firefox', () => {
      beforeAll(() => {
        isFirefoxSpy.and.returnValue(true);
        isIESpy.and.returnValue(false);
      });

      it('should set calculated max height for header', () => {
        const response = component.renderPanelContent(mockProps.panel);

        expect(response.props.children[0].props.style.maxHeight)
          .toEqual(`${16 * mockProps.panel.headingLineClamp / FONT_SIZE}rem`);
      });

      it('should set calculated max height for paragraph', () => {
        const response = component.renderPanelContent(mockProps.panel);

        expect(response.props.children[1].props.style.maxHeight)
          .toEqual(`${16 * mockProps.panel.paragraphLineClamp / FONT_SIZE}rem`);
      });
    });
  });
});
