describe('ChatEmailTranscriptPopup component', () => {
  let ChatEmailTranscriptPopup,
    mockForm,
    mockFormValidity,
    resultGridMinHeight;

  const EMAIL_TRANSCRIPT_REQUEST_SENT = 'widget/chat/EMAIL_TRANSCRIPT_REQUEST_SENT';
  const EMAIL_TRANSCRIPT_SUCCESS = 'widget/chat/EMAIL_TRANSCRIPT_SUCCESS';
  const EMAIL_TRANSCRIPT_FAILURE = 'widget/chat/EMAIL_TRANSCRIPT_FAILURE';
  const EMAIL_TRANSCRIPT_IDLE = 'widget/chat/EMAIL_TRANSCRIPT_IDLE';

  const ChatEmailTranscriptPopupPath = buildSrcPath('component/chat/ChatEmailTranscriptPopup');

  class ChatPopup extends Component {
    render() {
      const { className, rightCtaDisabled } = this.props;

      return <div className={className} rightCtaDisabled={rightCtaDisabled} /> ;
    }
  }

  beforeEach(() => {
    mockery.enable();
    mockFormValidity = false;
    resultGridMinHeight = 20;

    initMockRegistry({
      'component/chat/ChatEmailTranscriptPopup.scss': {
        locals: {
          resultGridMinHeight
        }
      },
      'component/chat/ChatPopup': { ChatPopup },
      'component/field/Field': {
        Field: class extends Component {
          render() {
            return this.props.input
                 ? React.cloneElement(this.props.input, _.extend({}, this.props))
                 : <input
                    name={this.props.name}
                    required={this.props.required}
                    pattern={this.props.pattern}
                    type={this.props.type} />;
          }
        }
      },
      'service/i18n': {
        i18n: {
          t: noop
        }
      },
      'src/redux/modules/chat/chat-action-types': {
        EMAIL_TRANSCRIPT_REQUEST_SENT: EMAIL_TRANSCRIPT_REQUEST_SENT,
        EMAIL_TRANSCRIPT_SUCCESS: EMAIL_TRANSCRIPT_SUCCESS,
        EMAIL_TRANSCRIPT_FAILURE: EMAIL_TRANSCRIPT_FAILURE,
        EMAIL_TRANSCRIPT_IDLE: EMAIL_TRANSCRIPT_IDLE
      },
      'src/util/utils': {
        emailValid: () => true
      },
      'src/component/Icon': {
        Icon: noop
      },
      'component/loading/LoadingSpinner': noopReactComponent,
      'lodash': _,
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

    mockery.registerAllowable(ChatEmailTranscriptPopupPath);
    ChatEmailTranscriptPopup = requireUncached(ChatEmailTranscriptPopupPath).ChatEmailTranscriptPopup;
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

      describe('when email transcript status is EMAIL_TRANSCRIPT_SUCCESS', () => {
        beforeEach(() => {
          emailTranscript = {
            status: EMAIL_TRANSCRIPT_SUCCESS,
            email: 'yolo@yolo.com'
          };
          component = instanceRender(<ChatEmailTranscriptPopup emailTranscript={emailTranscript} />);
          response = component.renderSuccessScreen();
        });

        it('should render success screen', () => {
          expect(response.props.children[0].props.children.props.type)
            .toEqual('Icon--checkmark-fill');
        });
      });

      describe('when email transcript status is not EMAIL_TRANSCRIPT_SUCCESS', () => {
        beforeEach(() => {
          emailTranscript = {
            status: 'y0lo',
            email: 'yolo@yolo.com'
          };
          component = instanceRender(<ChatEmailTranscriptPopup emailTranscript={emailTranscript} />);
          response = component.renderSuccessScreen();
        });

        it('should not render success screen', () => {
          expect(response)
            .toEqual(null);
        });
      });
    });

    describe('renderFailureScreen', () => {
      let response;

      describe('when email transcript status is EMAIL_TRANSCRIPT_FAILURE', () => {
        beforeEach(() => {
          emailTranscript = {
            status: EMAIL_TRANSCRIPT_FAILURE,
            email: 'yolo@yolo.com'
          };
          component = instanceRender(<ChatEmailTranscriptPopup emailTranscript={emailTranscript} />);
          response = component.renderFailureScreen();
        });

        it('should render failure screen', () => {
          expect(response.props.children[0].props.children.props.type)
            .toEqual('Icon--error-fill');
        });
      });

      describe('when email transcript status is not EMAIL_TRANSCRIPT_FAILURE', () => {
        beforeEach(() => {
          emailTranscript = {
            status: 'y0lo',
            email: 'yolo@yolo.com'
          };
          component = instanceRender(<ChatEmailTranscriptPopup emailTranscript={emailTranscript} />);
          response = component.renderFailureScreen();
        });

        it('should not render failure screen', () => {
          expect(response)
            .toEqual(null);
        });
      });
    });

    describe('renderLoadingScreen', () => {
      let response;

      describe('when email transcript status is EMAIL_TRANSCRIPT_REQUEST_SENT', () => {
        beforeEach(() => {
          emailTranscript = {
            status: EMAIL_TRANSCRIPT_REQUEST_SENT,
            email: 'yolo@yolo.com'
          };
          component = instanceRender(<ChatEmailTranscriptPopup emailTranscript={emailTranscript} />);
          response = component.renderLoadingScreen();
        });

        it('should render loading screen', () => {
          expect(response)
            .toBeDefined();
        });
      });

      describe('when email transcript status is not EMAIL_TRANSCRIPT_REQUEST_SENT', () => {
        beforeEach(() => {
          emailTranscript = {
            status: 'y0lo',
            email: 'yolo@yolo.com'
          };
          component = instanceRender(<ChatEmailTranscriptPopup emailTranscript={emailTranscript} />);
          response = component.renderLoadingScreen();
        });

        it('should not render loading screen', () => {
          expect(response)
            .toEqual(null);
        });
      });
    });

    describe('renderFormScreen', () => {
      let response;

      describe('when email transcript status is EMAIL_TRANSCRIPT_IDLE', () => {
        beforeEach(() => {
          emailTranscript = {
            status: EMAIL_TRANSCRIPT_IDLE,
            email: 'yolo@yolo.com'
          };
          component = instanceRender(<ChatEmailTranscriptPopup emailTranscript={emailTranscript} />);
          response = component.renderFormScreen();
        });

        it('should render form screen', () => {
          expect(response.type)
            .toEqual('form');
        });
      });

      describe('when email transcript status is not EMAIL_TRANSCRIPT_IDLE', () => {
        beforeEach(() => {
          emailTranscript = {
            status: 'y0lo',
            email: 'yolo@yolo.com'
          };
          component = instanceRender(<ChatEmailTranscriptPopup emailTranscript={emailTranscript} />);
          response = component.renderFormScreen();
        });

        it('should not render form screen', () => {
          expect(response)
            .toEqual(null);
        });
      });
    });

    describe('componentDidUpdate', () => {
      beforeEach(() => {
        component = instanceRender(<ChatEmailTranscriptPopup />);
      });

      describe('when resultContainer is null', () => {
        beforeEach(() => {
          component.resultContainer = null;
          component.state = {
            isResultTextMultiLine: false
          };
          component.componentDidUpdate(null, component.state);
        });

        it('should not change component state', () => {
          expect(component.state)
            .toEqual({
              isResultTextMultiLine: false
            });
        });
      });

      describe('when resultContainer is not null', () => {
        describe('when text is multiline', () => {
          beforeEach(() => {
            component.resultContainer = {
              clientHeight: 21
            };
          });

          describe('when text was originally single line', () => {
            beforeEach(() => {
              component.state = {
                isResultTextMultiLine: false
              };
              component.componentDidUpdate(null, component.state);
            });

            it('should update isResultTextMultiLine state correctly', () => {
              expect(component.state.isResultTextMultiLine)
                .toEqual(true);
            });
          });

          describe('when text was originally multiline', () => {
            beforeEach(() => {
              component.state = {
                isResultTextMultiLine: true
              };
              component.componentDidUpdate(null, component.state);
            });

            it('should not change state', () => {
              expect(component.state.isResultTextMultiLine)
                .toEqual(true);
            });
          });
        });

        describe('when text is singleline', () => {
          beforeEach(() => {
            component.resultContainer = {
              clientHeight: 19
            };
          });

          describe('when text was originally single line', () => {
            beforeEach(() => {
              component.state = {
                isResultTextMultiLine: false
              };
              component.componentDidUpdate(null, component.state);
            });

            it('should not change state', () => {
              expect(component.state.isResultTextMultiLine)
                .toEqual(false);
            });
          });

          describe('when text was originally multiline', () => {
            beforeEach(() => {
              component.state = {
                isResultTextMultiLine: true
              };
              component.componentDidUpdate(null, component.state);
            });

            it('should update isResultTextMultiLine state correctly', () => {
              expect(component.state.isResultTextMultiLine)
                .toEqual(false);
            });
          });
        });
      });
    });
  });
});
