describe('MessageError component', () => {
  let MessageError;

  const messageErrorPath = buildSrcPath('component/chat/chatting/MessageError');
  const Alert = noopReactComponent();

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './MessageError.scss': {
        locals: {
          container: 'container',
          messageErrorLink: 'messageErrorLink'
        }
      },
      '@zendeskgarden/react-notifications': {
        Alert: Alert
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

      it('returns a garden <Alert> component', () => {
        expect(TestUtils.isElementOfType(el, Alert)).toEqual(true);
      });

      describe('when there is a handler', () => {
        beforeAll(() => {
          handleErrorSpy = jasmine.createSpy('handleError').and.returnValue('random click');
        });

        beforeEach(() => {
          errorElement = el.props.children;
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
          errorElement = el.props.children;
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
