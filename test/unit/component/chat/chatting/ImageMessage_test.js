describe('ImageMessage component', () => {
  let ImageMessage,
    component,
    sharedPropTypes,
    mockFile;

  const imageMessagePath = buildSrcPath('component/chat/chatting/ImageMessage');
  const sharedTypesPath = buildSrcPath('types/shared');
  const placeholderEl = '<div>Image Loading...</div>';
  const onImageLoadSpy = jasmine.createSpy('onImageLoad');

  beforeEach(() => {
    mockery.enable();

    sharedPropTypes = requireUncached(sharedTypesPath).default;

    initMockRegistry({
      'types/shared': sharedPropTypes,
      './ImageMessage.scss': {
        locals: {
          container: 'container',
          spinner: 'spinner',
          link: 'link' }
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
      mockFile = {
        name: 'test',
        size: 100,
        type: 'image/png',
        webkitRelativePath: '',
        url: 'https://mockurl.com'
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
      });

      describe('when the image has loaded', () => {
        beforeEach(() => {
          component.setState({ loading: false });
          result = component.render();
        });

        it('does not render a placeholder element', () => {
          expect(result.props.children).not.toContain(placeholderEl);
        });

        it('renders an anchor tag', () => {
          expect(result.props.children.props.href)
            .toEqual(mockFile.url);
        });

        it('changes the background image', () => {
          expect(result.props.children.props.children.props.style)
            .toEqual(jasmine.objectContaining({
              backgroundImage: `url("${mockFile.url}")`
            }));
        });
      });
    });
  });

  describe('without placeholder', () => {
    beforeEach(() => {
      mockFile = {
        name: 'test',
        size: 100,
        type: 'image/png',
        webkitRelativePath: '',
        url: 'https://mockurl.com'
      };

      component = domRender(<ImageMessage file={mockFile} onImageLoad={onImageLoadSpy} />);
    });

    describe('#render', () => {
      let result;

      describe('when the image has not yet loaded', () => {
        beforeEach(() => {
          result = component.render();
        });

        it('renders the spinner', () => {
          expect(result.props.children.props.children.props.className)
            .toContain('spinner');
        });
      });

      describe('when the image has loaded', () => {
        beforeEach(() => {
          component.setState({ loading: false });
          result = component.render();
        });

        it('does not render the spinner', () => {
          expect(result.props.children.props.children.props.className)
            .not.toContain('spinner');
        });
      });
    });
  });
});
