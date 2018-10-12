describe('ImageMessage component', () => {
  let ImageMessage,
    component,
    sharedPropTypes,
    constantsShared;

  const imageMessagePath = buildSrcPath('component/chat/chatting/ImageMessage');
  const sharedTypesPath = buildSrcPath('types/shared');
  const constantsSharedPath = buildSrcPath('constants/shared');
  const placeholderEl = '<div>Image Loading...</div>';
  const onImageLoadSpy = jasmine.createSpy('onImageLoad');

  beforeEach(() => {
    mockery.enable();

    sharedPropTypes = requireUncached(sharedTypesPath).sharedPropTypes;
    constantsShared = requireUncached(constantsSharedPath);

    initMockRegistry({
      'types/shared': {
        sharedPropTypes
      },
      'constants/shared': constantsShared,
      './ImageMessage.scss': {
        locals: {
          container: 'container',
          link: 'link',
          hidden: 'hidden'
        }
      }
    });

    mockery.registerAllowable(imageMessagePath);
    ImageMessage = requireUncached(imageMessagePath).ImageMessage;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('shared functionality', () => {
    beforeEach(() => {
      let mockFile = {
        name: 'test',
        size: 100,
        type: 'image/png',
        webkitRelativePath: ''
      };

      component = domRender(<ImageMessage file={mockFile} onImageLoad={onImageLoadSpy} placeholderEl={placeholderEl} />);
    });

    describe('initial state', () => {
      it('sets local state of loading to true', () => {
        expect(component.state.loading).toEqual(true);
      });
    });

    describe('#onLoad', () => {
      beforeEach(() => {
        component.onLoad();
      });

      it('sets local state of loading to false', () => {
        expect(component.state.loading)
          .toEqual(false);
      });

      it('calls onImageLoad prop', () => {
        expect(onImageLoadSpy)
          .toHaveBeenCalled();
      });
    });

    describe('#render', () => {
      let result;

      describe('when the image has not yet loaded', () => {
        beforeEach(() => {
          result = component.render();
        });

        it('renders a placeholder element', () => {
          expect(result.props.children).toContain(placeholderEl);
        });

        it('hides the div containing the image', () => {
          expect(result.props.children[1].props.className)
            .toContain('hidden');
        });
      });

      describe('when the image has loaded', () => {
        beforeEach(() => {
          component.setState({ loading: false });
          result = component.render();
        });

        it('does not render a placeholder element', () => {
          expect(result.props.children).not.toContain(placeholderEl);
        });

        it('does not hide the div containing the image', () => {
          expect(result.props.children[1].props.className)
            .not.toContain('hidden');
        });
      });
    });
  });

  describe('dimensions metadata present', () => {
    beforeEach(() => {
      let mockFile = {
        name: 'test',
        size: 100,
        type: 'image/png',
        webkitRelativePath: '',
        metadata: {
          height: 300,
          width: 600
        }
      };

      component = domRender(<ImageMessage file={mockFile} />);
    });

    describe('initial state', () => {
      it('has local state of thumbnail size set correctly', () => {
        expect(component.state.thumbnailWidth).toEqual(180);
        expect(component.state.thumbnailHeight).toEqual(90);
      });
    });

    describe('#onLoad', () => {
      beforeEach(() => {
        component.onLoad();
      });

      it('sets local state of thumbnail sizes to 0', () => {
        expect(component.state.thumbnailWidth).toEqual(0);
        expect(component.state.thumbnailHeight).toEqual(0);
      });
    });

    describe('#render', () => {
      let result;

      describe('when the image has not yet loaded', () => {
        beforeEach(() => {
          result = component.render();
        });

        it('sets size on the div containing the image', () => {
          expect(result.props.children[1].props.style)
            .toEqual(jasmine.objectContaining({
              width: `${180/constantsShared.FONT_SIZE}rem`,
              height: `${90/constantsShared.FONT_SIZE}rem`
            }));
        });

        it('does not hide the div containing the image', () => {
          expect(result.props.children[1].props.className)
            .not.toContain('hidden');
        });
      });
    });

    describe('when the image has loaded', () => {
      let result;

      beforeEach(() => {
        component.onLoad();
        result = component.render();
      });

      it('unsets size on the div containing the image', () => {
        expect(result.props.children[1].props.style.width)
          .not.toEqual(jasmine.anything());
        expect(result.props.children[1].props.style.height)
          .not.toEqual(jasmine.anything());
      });
    });
  });
});
