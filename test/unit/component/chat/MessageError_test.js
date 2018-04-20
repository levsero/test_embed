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
          icon: 'icon',
          messageErrorLink: 'messageErrorLink'
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
    let el,
      handleErrorSpy;
    const errorMessage = 'Something went wrong';

    beforeEach(() => {
      const messageErrorComponent = (
        <MessageError errorMessage={errorMessage}
          className='customClassName' handleError={handleErrorSpy} />
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
      let errorElement;

      it('renders default class container', () => {
        expect(el.props.className)
          .toContain('container');
      });

      it('renders custom class container', () => {
        expect(el.props.className)
          .toContain('customClassName');
      });

      describe('when there is a handler', () => {
        beforeAll(() => {
          handleErrorSpy = jasmine.createSpy('handleError').and.returnValue('random click');
        });

        beforeEach(() => {
          errorElement = el.props.children[1];
        });

        it('renders an anchor tag', () => {
          expect(TestUtils.isElementOfType(errorElement, 'a'))
            .toEqual(true);
        });

        it('renders an onClick handler', () => {
          const result = errorElement.props.onClick();

          expect(handleErrorSpy)
            .toHaveBeenCalled();

          expect(result)
            .toEqual('random click');
        });

        it('renders the error message', () => {
          expect(errorElement.props.children)
            .toEqual(errorMessage);
        });

        it('renders the correct messageErrorLink className', () => {
          expect(errorElement.props.className)
            .toContain('messageErrorLink');
        });
      });

      describe('when there is no handler', () => {
        beforeAll(() => {
          handleErrorSpy = null;
        });

        beforeEach(() => {
          errorElement = el.props.children[1];
        });

        it('renders the error message', () => {
          expect(errorElement.props.children)
            .toEqual(errorMessage);
        });

        it('does not render an anchor tag', () => {
          expect(TestUtils.isElementOfType(errorElement, 'a'))
            .toEqual(false);
        });
      });
    });
  });
});
