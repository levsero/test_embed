describe('ChatEmailTranscriptPopup component', () => {
  let ChatEmailTranscriptPopup,
    mockForm,
    mockFormValidity,
    ICONS;

  const EMAIL_TRANSCRIPT_LOADING_SCREEN = 'widget/chat/EMAIL_TRANSCRIPT_LOADING_SCREEN';
  const EMAIL_TRANSCRIPT_SUCCESS_SCREEN = 'widget/chat/EMAIL_TRANSCRIPT_SUCCESS_SCREEN';
  const EMAIL_TRANSCRIPT_FAILURE_SCREEN = 'widget/chat/EMAIL_TRANSCRIPT_FAILURE_SCREEN';
  const EMAIL_TRANSCRIPT_SCREEN = 'widget/chat/EMAIL_TRANSCRIPT_SCREEN';

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
      'component/field/EmailField': {
        EmailField: class extends Component {
          render() {
            return this.props.input;
          }
        }
      },
      'constants/shared': {
        ICONS
      },
      'service/i18n': {
        i18n: {
          t: noop
        }
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
      'src/component/Icon': {
        Icon: noop
      },
      'component/loading/LoadingSpinner': noopReactComponent,
      'utility/devices': {
        isIE: () => false
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
      rightCtaFnSpy;

    beforeEach(() => {
      rightCtaFnSpy = jasmine.createSpy('rightCtaFn');

      component = instanceRender(<ChatEmailTranscriptPopup rightCtaFn={rightCtaFnSpy} />);

      component.setState({ formState: { email: 'bob@zd.com' } });
      component.handleSave({
        preventDefault: () => {}
      });
    });

    it('calls props.rightCtaFn with form state name and email', () => {
      expect(rightCtaFnSpy)
        .toHaveBeenCalledWith('bob@zd.com');
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

      component.componentWillReceiveProps({ visitor: { display_name: 'bob', email: 'bob@bob.com' } });
    });

    it('sets email form state to the email visitor prop passed in', () => {
      expect(component.state.formState.email)
        .toEqual('bob@bob.com');
    });
  });

  describe('render', () => {
    let component,
      popupComponent,
      emailTranscript;

    describe('when the form is valid', () => {
      beforeEach(() => {
        component = domRender(<ChatEmailTranscriptPopup />);
        component.setState({ valid: true });

        popupComponent = TestUtils.findRenderedComponentWithType(component, ChatPopup);
      });

      it('renders ChatPopup with rightCtaDisabled prop as false', () => {
        expect(popupComponent.props.rightCtaDisabled)
          .toBe(false);
      });
    });

    describe('when the form is invalid', () => {
      beforeEach(() => {
        component = domRender(<ChatEmailTranscriptPopup />);
        component.setState({ valid: false });

        popupComponent = TestUtils.findRenderedComponentWithType(component, ChatPopup);
      });

      it('renders ChatPopup with rightCtaDisabled prop as true', () => {
        expect(popupComponent.props.rightCtaDisabled)
          .toBe(true);
      });
    });

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
  });
});
