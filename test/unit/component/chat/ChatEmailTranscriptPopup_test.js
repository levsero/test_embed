describe('ChatEmailTranscriptPopup component', () => {
  let ChatEmailTranscriptPopup,
    mockShouldRenderErrorMessage,
    mockForm,
    mockFormValidity,
    ICONS;

  const EMAIL_TRANSCRIPT_LOADING_SCREEN = 'widget/chat/EMAIL_TRANSCRIPT_LOADING_SCREEN';
  const EMAIL_TRANSCRIPT_SUCCESS_SCREEN = 'widget/chat/EMAIL_TRANSCRIPT_SUCCESS_SCREEN';
  const EMAIL_TRANSCRIPT_FAILURE_SCREEN = 'widget/chat/EMAIL_TRANSCRIPT_FAILURE_SCREEN';
  const EMAIL_TRANSCRIPT_SCREEN = 'widget/chat/EMAIL_TRANSCRIPT_SCREEN';

  const Message = noopReactComponent();
  const TextField = noopReactComponent();

  const chatEmailTranscriptPopupPath = buildSrcPath('component/chat/ChatEmailTranscriptPopup');
  const sharedConstantsPath = buildSrcPath('constants/shared');

  class ChatPopup extends Component {
    render() {
      const { className, rightCtaDisabled } = this.props;

      return <div className={className} rightCtaDisabled={rightCtaDisabled} /> ;
    }
  }

  beforeEach(() => {
    mockery.enable();

    mockFormValidity = false;
    ICONS = requireUncached(sharedConstantsPath).ICONS;

    initMockRegistry({
      'component/chat/ChatEmailTranscriptPopup.scss': { locals: {} },
      'component/chat/ChatPopup': { ChatPopup },
      'constants/shared': {
        ICONS,
        EMAIL_PATTERN: /.+/
      },
      'service/i18n': {
        i18n: {
          t: noop
        }
      },
      '@zendeskgarden/react-textfields': {
        TextField,
        Label: noopReactComponent(),
        Input: noopReactComponent(),
        Textarea: noopReactComponent(),
        Message
      },
      'src/redux/modules/chat/chat-screen-types': {
        EMAIL_TRANSCRIPT_LOADING_SCREEN: EMAIL_TRANSCRIPT_LOADING_SCREEN,
        EMAIL_TRANSCRIPT_SUCCESS_SCREEN: EMAIL_TRANSCRIPT_SUCCESS_SCREEN,
        EMAIL_TRANSCRIPT_FAILURE_SCREEN: EMAIL_TRANSCRIPT_FAILURE_SCREEN,
        EMAIL_TRANSCRIPT_SCREEN: EMAIL_TRANSCRIPT_SCREEN
      },
      'src/util/utils': {
        emailValid: () => true
      },
      'src/util/fields': {
        shouldRenderErrorMessage: () => mockShouldRenderErrorMessage,
        renderLabel: () => 'someLabel'
      },
      'src/component/Icon': {
        Icon: noop
      },
      'component/loading/LoadingSpinner': noopReactComponent,
      'utility/devices': {
        isIE: () => false
      },
      'utility/keyboard': {
        keyCodes: {
          'a': 65,
          'ENTER': 13
        }
      }
    });

    mockForm = {
      checkValidity: () => mockFormValidity,
      elements: [
        {
          name: 'name',
          value: 'Jon Snow'
        },
        {
          name: 'email',
          value: 'jsnow@nightswatch.org'
        }
      ]
    };

    mockery.registerAllowable(chatEmailTranscriptPopupPath);
    ChatEmailTranscriptPopup = requireUncached(chatEmailTranscriptPopupPath).ChatEmailTranscriptPopup;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('handleSave', () => {
    let component,
      mockState,
      rightCtaFnSpy;

    beforeEach(() => {
      rightCtaFnSpy = jasmine.createSpy('rightCtaFn');

      component = instanceRender(<ChatEmailTranscriptPopup rightCtaFn={rightCtaFnSpy} />);

      spyOn(component, 'setState');
      component.state = mockState;
      component.handleSave({
        preventDefault: () => {}
      });
    });

    describe('when form is invalid', () => {
      beforeAll(() => {
        mockState = {
          formState: {},
          valid: false
        };
      });

      it('shows error', () => {
        expect(component.setState)
          .toHaveBeenCalledWith({ showErrors: true });
      });
    });

    describe('when form is valid', () => {
      beforeAll(() => {
        mockState = { formState: { email: 'bob@zd.com' }, valid: true };
      });

      it('calls props.rightCtaFn with form state name and email', () => {
        expect(rightCtaFnSpy)
          .toHaveBeenCalledWith('bob@zd.com');
      });
    });
  });

  describe('handleKeyPress', () => {
    const keyCodes = { enter: 13, a: 65 };
    let component;
    let event = { charCode: keyCodes.enter, preventDefault: () => false };

    beforeEach(() => {
      component = instanceRender(<ChatEmailTranscriptPopup />);
      spyOn(component, 'handleSave');
    });

    describe('when the user presses <Enter>', () => {
      describe('when shift is _not_ pressed simultaneously', () => {
        it('interprets it as a send signal and sends the message', () => {
          component.handleKeyPress(event);

          expect(component.handleSave)
            .toHaveBeenCalled();
        });
      });

      describe('when shift _is_ pressed simultaneously', () => {
        it('does not send the message and enters a line break', () => {
          event = _.merge(event, { shiftKey: true });
          component.handleKeyPress(event);

          expect(component.handleSave)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('when the user presses any other key', () =>{
      it('does not send the message', () => {
        event = _.merge(event, { keyCode: keyCodes.a });
        component.handleKeyPress(event);

        expect(component.handleSave)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('handleFormChange', () => {
    let component;

    beforeEach(() => {
      component = instanceRender(<ChatEmailTranscriptPopup />);
      mockFormValidity = true;
      component.form = mockForm;

      component.handleFormChange({ target: { name: 'email', value: 'bob@bob.com' } });
    });

    it('sets state.valid using form.checkValidity()', () => {
      expect(component.state.valid)
        .toBe(true);
    });

    it('sets state.formState for target field', () => {
      expect(component.state.formState)
        .toEqual({ email: 'bob@bob.com' });
    });
  });

  describe('componentWillReceiveProps', () => {
    let component;

    beforeEach(() => {
      component = instanceRender(<ChatEmailTranscriptPopup />);

      component.componentWillReceiveProps({ visitor: { email: 'bob@bob.com' }, emailTranscript: {} });
    });

    it('sets email form state to the email visitor prop passed in', () => {
      expect(component.state.formState.email)
        .toEqual('bob@bob.com');
    });
  });

  describe('render', () => {
    let component,
      emailTranscript;

    describe('renderSuccessScreen', () => {
      let response;

      describe('when email transcript screen is EMAIL_TRANSCRIPT_SUCCESS_SCREEN', () => {
        beforeEach(() => {
          emailTranscript = {
            screen: EMAIL_TRANSCRIPT_SUCCESS_SCREEN,
            email: 'yolo@yolo.com'
          };
          component = instanceRender(<ChatEmailTranscriptPopup emailTranscript={emailTranscript} />);
          response = component.renderSuccessScreen();
        });

        it('renders success screen', () => {
          expect(response)
            .toBeTruthy();
        });

        it('renders success icon', () => {
          const popupContent = response.props.children[0];
          const icon = popupContent.props.children;

          expect(icon.props.type)
            .toEqual('Icon--checkmark-fill');
        });
      });

      describe('when email transcript screen is not EMAIL_TRANSCRIPT_SUCCESS_SCREEN', () => {
        beforeEach(() => {
          emailTranscript = {
            screen: 'y0lo',
            email: 'yolo@yolo.com'
          };
          component = instanceRender(<ChatEmailTranscriptPopup emailTranscript={emailTranscript} />);
          response = component.renderSuccessScreen();
        });

        it('does not render success screen', () => {
          expect(response)
            .toEqual(null);
        });
      });
    });

    describe('renderFailureScreen', () => {
      let response;

      describe('when email transcript status is EMAIL_TRANSCRIPT_FAILURE_SCREEN', () => {
        beforeEach(() => {
          emailTranscript = {
            screen: EMAIL_TRANSCRIPT_FAILURE_SCREEN,
            email: 'yolo@yolo.com'
          };
          component = instanceRender(<ChatEmailTranscriptPopup emailTranscript={emailTranscript} />);
          response = component.renderFailureScreen();
        });

        it('renders failure screen', () => {
          expect(response)
            .toBeTruthy();
        });

        it('renders failure icon', () => {
          const popupContent = response.props.children[0];
          const icon = popupContent.props.children;

          expect(icon.props.type)
            .toEqual('Icon--error-fill');
        });
      });

      describe('when email transcript status is not EMAIL_TRANSCRIPT_FAILURE_SCREEN', () => {
        beforeEach(() => {
          emailTranscript = {
            screen: 'y0lo',
            email: 'yolo@yolo.com'
          };
          component = instanceRender(<ChatEmailTranscriptPopup emailTranscript={emailTranscript} />);
          response = component.renderFailureScreen();
        });

        it('does not render failure screen', () => {
          expect(response)
            .toEqual(null);
        });
      });
    });

    describe('renderLoadingScreen', () => {
      let response;

      describe('when email transcript status is EMAIL_TRANSCRIPT_LOADING_SCREEN', () => {
        beforeEach(() => {
          emailTranscript = {
            screen: EMAIL_TRANSCRIPT_LOADING_SCREEN,
            email: 'yolo@yolo.com'
          };
          component = instanceRender(<ChatEmailTranscriptPopup emailTranscript={emailTranscript} />);
          response = component.renderLoadingScreen();
        });

        it('renders loading screen', () => {
          expect(response)
            .toBeDefined();
        });
      });

      describe('when email transcript status is not EMAIL_TRANSCRIPT_LOADING_SCREEN', () => {
        beforeEach(() => {
          emailTranscript = {
            screen: 'y0lo',
            email: 'yolo@yolo.com'
          };
          component = instanceRender(<ChatEmailTranscriptPopup emailTranscript={emailTranscript} />);
          response = component.renderLoadingScreen();
        });

        it('does not render loading screen', () => {
          expect(response)
            .toEqual(null);
        });
      });
    });

    describe('renderFormScreen', () => {
      let response;

      describe('when email transcript status is EMAIL_TRANSCRIPT_SCREEN', () => {
        beforeEach(() => {
          emailTranscript = {
            screen: EMAIL_TRANSCRIPT_SCREEN,
            email: 'yolo@yolo.com'
          };
          component = instanceRender(<ChatEmailTranscriptPopup emailTranscript={emailTranscript} />);
          response = component.renderFormScreen();
        });

        it('renders form screen', () => {
          expect(response.type)
            .toEqual('form');
        });
      });

      describe('when email transcript status is not EMAIL_TRANSCRIPT_SCREEN', () => {
        beforeEach(() => {
          emailTranscript = {
            screen: 'y0lo',
            email: 'yolo@yolo.com'
          };
          component = instanceRender(<ChatEmailTranscriptPopup emailTranscript={emailTranscript} />);
          response = component.renderFormScreen();
        });

        it('does not render form screen', () => {
          expect(response)
            .toEqual(null);
        });
      });
    });

    describe('renderEmailField', () => {
      let result,
        component;

      beforeEach(() => {
        component = instanceRender(<ChatEmailTranscriptPopup />);

        result = component.renderEmailField();
      });

      it('renders a TextField component', () => {
        expect(TestUtils.isElementOfType(result, TextField))
          .toEqual(true);
      });

      describe('when invalid', () => {
        beforeAll(() => {
          mockShouldRenderErrorMessage = true;
        });

        it('renders field in an error state', () => {
          expect(result.props.children[1].props.validation)
            .toEqual('error');
        });
      });
    });
  });
});
