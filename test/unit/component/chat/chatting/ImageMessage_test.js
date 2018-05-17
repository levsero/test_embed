describe('ImageMessage component', () => {
  let ImageMessage,
    component;

  const imageMessagePath = buildSrcPath('component/chat/chatting/ImageMessage');
  const placeholderEl = '<div>Image Loading...</div>';
  const onImageLoadSpy = jasmine.createSpy('onImageLoad');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
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
    component = domRender(<ImageMessage onImageLoad={onImageLoadSpy} placeholderEl={placeholderEl} />);
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('initial state', () => {
    it('has local state of loading set to true', () => {
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

    describe('when the image has not yet loading', () => {
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

    describe('when the image has loading', () => {
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
