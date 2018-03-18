describe('MessageError component', () => {
  let MessageError,
    ICONS;

  const messageErrorPath = buildSrcPath('component/chat/MessageError');
  const sharedConstantsPath = buildSrcPath('constants/shared');
  const Icon = noopReactComponent();

  ICONS = requireUncached(sharedConstantsPath).ICONS;

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'component/Icon': { Icon },
      'constants/shared': {
        ICONS
      },
      './MessageError.scss': {
        locals: {
          container: 'container',
          icon: 'icon'
        }
      }
    });

    mockery.registerAllowable(messageErrorPath);
    MessageError = requireUncached(messageErrorPath).MessageError;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#render', () => {
    let el;
    const errorMessage = 'Something went wrong';

    beforeEach(() => {
      const messageErrorComponent = (
        <MessageError errorMessage={errorMessage}
          className='customClassName'
          handleError={() => {}} />
      );
      const component = instanceRender(messageErrorComponent);

      el = component.render();
    });

    it('renders an Icon component with the correct icon', () => {
      const firstChild = el.props.children[0];

      expect(TestUtils.isElementOfType(firstChild, Icon)).toEqual(true);
      expect(firstChild.props.type).toEqual(ICONS.ERROR_FILL);
    });

    describe('error element', () => {
      let secondChild;

      beforeEach(() => {
        secondChild = el.props.children[1];
      });

      it('renders a span tag', () => {
        expect(TestUtils.isElementOfType(secondChild, 'span'))
          .toEqual(true);
      });

      it('renders custom className prop', () => {
        expect(secondChild.props.className)
          .toEqual('customClassName');
      });

      it('renders handleError props', () => {
        expect(secondChild.props.onClick)
          .toEqual(jasmine.any(Function));
      });

      it('renders the error message', () => {
        expect(secondChild.props.children).toContain(errorMessage);
      });
    });
  });
});
