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

  describe('Render the parent and child elements', () => {
    let result;

    beforeEach(() => {
      const component = instanceRender(<PanelCard />);

      result = component.render();
    });

    it('returns a Card component', ()=> {
      expect(TestUtils.isElementOfType(result, Card)).toEqual(true);
    });

    it('returns button element as one of the children', () => {
      const foundChild = result.props.children.some((child) => {
        return TestUtils.isElementOfType(child, 'button');
      });

      expect(foundChild).toEqual(true);
    });

    it('returns ButtonList component as one of the children', () => {
      const foundChild = result.props.children.some((child) => {
        return TestUtils.isElementOfType(child, ButtonList);
      });

      expect(foundChild).toEqual(true);
    });
  });

  describe('Button element should receive the correct props', () => {
    let button;
    let props = {};

    beforeEach(() => {
      const component = instanceRender(<PanelCard {...props}/>);
      const result = component.render();

      button = result.props.children.find((child) => {
        return TestUtils.isElementOfType(child, 'button');
      });
    });

    describe('classname prop', () => {
      it('has .panel when there is no children', () => {
        expect(button.props.className).toContain('panel');
      });

      describe('when there is children', () => {
        beforeAll(() => {
          props = {
            children: [noopReactComponent()]
          };
        });

        it('has .panelWithButtons', () => {
          expect(button.props.className).toContain('panelWithButtons');
        });

        it('has no .panel', () => {
          expect(button.props.className.split(' ')).not.toContain('panel');
        });
      });

      it('has no .hasLink when there is props.panel.onClick is invalid', () => {
        expect(button.props.className).not.toContain('hasLink');
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
          expect(button.props.className).toContain('hasLink');
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
        expect(button.props.onClick).toEqual(onClickSpy);
      });
    });
  });

  describe('.renderPanelImage', () => {
    let mockProps = {
      panel: {
        heading: 'This is a header'
      }
    };
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

    describe('Overwrite default values', () => {
      beforeAll(() => {
        mockProps.panel = {
          ...mockProps.panel,
          headingLineClamp: 3,
          paragraphLineClamp: 5,
          imageAspectRatio: 4/3
        };
      });

      it('should call renderPanelImage with overwritten params', () => {
        expect(component.renderPanelImage).toHaveBeenCalledWith({
          ...mockProps.panel
        });
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

  describe('.renderPanelContent', () => {
    const originalProps = {
      panel: {
        heading: 'This is a header',
        paragraph: 'This is a paragraph'
      }
    };
    let mockProps = { ...originalProps };
    let component;

    beforeEach(() => {
      component = instanceRender(<PanelCard {...mockProps} />);
      spyOn(component, 'renderPanelContent');

      component.render();
    });

    afterEach(() => {
      mockProps = { ... originalProps };
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

    describe('Overwrite default values', () => {
      beforeAll(() => {
        mockProps.panel = {
          ...mockProps.panel,
          headingLineClamp: 3,
          paragraphLineClamp: 5,
          imageAspectRatio: 10/6
        };
      });

      it('should call renderPanelContent with overwritten params', () => {
        expect(component.renderPanelContent).toHaveBeenCalledWith({
          ...mockProps.panel
        });
      });
    });

    describe('Setting max height for header and paragraph', () => {
      let component;

      beforeEach(() => {
        mockProps.panel = {
          ...mockProps.panel,
          headingLineClamp: 3,
          paragraphLineClamp: 5,
          imageAspectRatio: 10 / 6
        };

        component = instanceRender(<PanelCard {...mockProps} />);
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
});
