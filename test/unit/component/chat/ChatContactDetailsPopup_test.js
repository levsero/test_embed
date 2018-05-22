describe('ChatContactDetailsPopup component', () => {
  let ChatContactDetailsPopup,
    mockForm,
    mockFormValidity,
    mockEmailValid,
    mockIsDefaultNickname,
    ICONS,
    EDIT_CONTACT_DETAILS_SCREEN,
    EDIT_CONTACT_DETAILS_LOADING_SCREEN,
    EDIT_CONTACT_DETAILS_ERROR_SCREEN;
  const ChatContactDetailsPopupPath = buildSrcPath('component/chat/ChatContactDetailsPopup');

  const LoadingSpinner = noopReactComponent();

  class ChatPopup extends Component {
    render() {
      const { className, rightCtaDisabled } = this.props;

      return <div className={className} rightCtaDisabled={rightCtaDisabled} /> ;
    }
  }

  beforeEach(() => {
    mockery.enable();

    const chatConstantsPath = basePath('src/constants/chat');
    const sharedConstantsPath = basePath('src/constants/shared');

    ICONS = requireUncached(sharedConstantsPath).ICONS;
    EDIT_CONTACT_DETAILS_SCREEN = requireUncached(chatConstantsPath).EDIT_CONTACT_DETAILS_SCREEN;
    EDIT_CONTACT_DETAILS_LOADING_SCREEN = requireUncached(chatConstantsPath).EDIT_CONTACT_DETAILS_LOADING_SCREEN;
    EDIT_CONTACT_DETAILS_ERROR_SCREEN = requireUncached(chatConstantsPath).EDIT_CONTACT_DETAILS_ERROR_SCREEN;

    mockFormValidity = false;
    mockEmailValid = true;
    mockIsDefaultNickname = false;

    initMockRegistry({
      'component/chat/ChatContactDetailsPopup.scss': {
        locals: {
          popupChildrenContainerLoading: 'popupChildrenContainerLoadingClass',
          field: 'field',
          fieldAuthDisabled: 'fieldAuthDisabled',
          fieldInputMobile: 'fieldInputMobile',
          fieldInputAuthDisabled: 'fieldInputAuthDisabled'
        }
      },
      'constants/shared': {
        ICONS
      },
      'constants/chat': {
        EDIT_CONTACT_DETAILS_SCREEN,
        EDIT_CONTACT_DETAILS_LOADING_SCREEN,
        EDIT_CONTACT_DETAILS_ERROR_SCREEN
      },
      'component/chat/ChatPopup': { ChatPopup },
      'component/loading/LoadingSpinner': { LoadingSpinner },
      'component/Icon': noopReactComponent(),
      'component/field/EmailField': noopReactComponent(),
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
      'src/util/utils': {
        emailValid: () => mockEmailValid
      },
      'src/util/chat': {
        isDefaultNickname: () => mockIsDefaultNickname
      },
      'utility/globals': {
        document: document
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

    mockery.registerAllowable(ChatContactDetailsPopupPath);
    ChatContactDetailsPopup = requireUncached(ChatContactDetailsPopupPath).ChatContactDetailsPopup;
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

      component = instanceRender(<ChatContactDetailsPopup rightCtaFn={rightCtaFnSpy} />);

      component.setState({ formState: { name: 'bob', email: 'bob@zd.com' } });
      component.handleSave();
    });

    it('calls props.rightCtaFn with form state name and email', () => {
      expect(rightCtaFnSpy)
        .toHaveBeenCalledWith('bob', 'bob@zd.com');
    });

    describe('when there exists an activeElement', () => {
      beforeEach(() => {
        const mockActiveElement = domRender(<div />);

        document.activeElement = mockActiveElement;

        spyOn(document.activeElement, 'blur');

        component = instanceRender(<ChatContactDetailsPopup rightCtaFn={rightCtaFnSpy} />);
        component.handleSave();
      });

      it('calls blur on the activeElement', () => {
        expect(document.activeElement.blur)
          .toHaveBeenCalled();
      });
    });
  });

  describe('handleKeyPress', () => {
    const keyCodes = { enter: 13, a: 65 };
    let component;
    let event = { keyCode: keyCodes.enter, preventDefault: () => false };

    beforeEach(() => {
      component = instanceRender(<ChatContactDetailsPopup />);
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
      component = instanceRender(<ChatContactDetailsPopup />);
      mockFormValidity = true;
      component.form = mockForm;

      component.handleFormChange({ target: { name: 'name', value: 'bob' } });
    });

    it('sets state.valid using form.checkValidity()', () => {
      expect(component.state.valid)
        .toBe(true);
    });

    it('sets state.formState for target field', () => {
      expect(component.state.formState)
        .toEqual({ name: 'bob', email: '' });
    });
  });

  describe('componentWillReceiveProps', () => {
    let component,
      mockContactDetails;

    describe('when contact details have been entered into the popup before', () => {
      beforeEach(() => {
        mockContactDetails = { display_name: 'guy', email: 'guy@guys.com' };

        component = instanceRender(<ChatContactDetailsPopup contactDetails={mockContactDetails} />);

        component.componentWillReceiveProps({
          visitor: { display_name: 'bob', email: 'bob@bob.com' },
          contactDetails: mockContactDetails
        });
      });

      it('sets name form state to the display_name passed in via the contactDetails prop', () => {
        expect(component.state.formState.name)
          .toEqual('guy');
      });

      it('sets name form state to the email passed in via the contactDetails prop', () => {
        expect(component.state.formState.email)
          .toEqual('guy@guys.com');
      });
    });

    describe('when contact details have not been entered into the popup before', () => {
      beforeEach(() => {
        mockContactDetails = {};

        component = instanceRender(<ChatContactDetailsPopup contactDetails={mockContactDetails} />);

        component.componentWillReceiveProps({
          visitor: { display_name: 'bob', email: 'bob@bob.com' },
          contactDetails: mockContactDetails
        });
      });

      describe('when the name is not the default chat name', () => {
        it('sets name form state to the display_name visitor prop passed in', () => {
          expect(component.state.formState.name)
            .toEqual('bob');
        });
      });

      describe('when the name is the default chat name', () => {
        beforeEach(() => {
          mockIsDefaultNickname = true;
          component = instanceRender(<ChatContactDetailsPopup contactDetails={{}} />);

          component.componentWillReceiveProps({ visitor: { display_name: 'Visitor 12345' }, contactDetails: {} });
        });

        it('sets name form state to an empty string', () => {
          expect(component.state.formState.name)
            .toEqual('');
        });
      });

      it('sets email form state to the email visitor prop passed in', () => {
        expect(component.state.formState.email)
          .toEqual('bob@bob.com');
      });
    });

    describe('when user is still entering contact details', () => {
      beforeEach(() => {
        mockContactDetails = { display_name: 'guy', email: 'guy@guys.com' };

        component = instanceRender(<ChatContactDetailsPopup contactDetails={mockContactDetails} />);

        component.state = {
          formState: {
            name: 'I am not done yet',
            email: 'still@notdone.yet'
          }
        };

        component.componentWillReceiveProps({
          visitor: { display_name: 'bob', email: 'bob@bob.com' },
          contactDetails: mockContactDetails
        });
      });

      it('uses component state for the email field', () => {
        expect(component.state.formState.email)
          .toEqual('still@notdone.yet');
      });

      it('uses component state for the name field', () => {
        expect(component.state.formState.name)
          .toEqual('I am not done yet');
      });
    });
  });

  describe('render', () => {
    let component,
      renderedComponent,
      popupComponent;

    describe('when method is called', () => {
      beforeEach(() => {
        component = instanceRender(<ChatContactDetailsPopup contactDetails={{}} />);

        spyOn(component, 'renderForm');
        spyOn(component, 'renderLoadingSpinner');

        component.render();
      });

      it('calls renderForm', () => {
        expect(component.renderForm)
          .toHaveBeenCalled();
      });

      it('calls renderLoadingSpinner', () => {
        expect(component.renderLoadingSpinner)
          .toHaveBeenCalled();
      });
    });

    describe('when the state is a loading screen', () => {
      beforeEach(() => {
        const mockScreen = EDIT_CONTACT_DETAILS_LOADING_SCREEN;
        const component = instanceRender(<ChatContactDetailsPopup screen={mockScreen} />);

        renderedComponent = component.render();
      });

      it('has false in props.showCta', () => {
        expect(renderedComponent.props.showCta)
          .toEqual(false);
      });

      it('has the appropriate class in props.containerClasses', () => {
        expect(renderedComponent.props.containerClasses)
          .toEqual('popupChildrenContainerLoadingClass');
      });
    });

    describe('when the state is not in a loading screen', () => {
      beforeEach(() => {
        const mockScreen = EDIT_CONTACT_DETAILS_SCREEN;
        const component = instanceRender(<ChatContactDetailsPopup screen={mockScreen} />);

        renderedComponent = component.render();
      });

      it('has true in props.showCta', () => {
        expect(renderedComponent.props.showCta)
          .toEqual(true);
      });

      it('has an empty style in props.containerClasses', () => {
        expect(renderedComponent.props.containerClasses)
          .toEqual('');
      });
    });

    describe('when the form is valid', () => {
      beforeEach(() => {
        component = domRender(<ChatContactDetailsPopup />);
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
        component = domRender(<ChatContactDetailsPopup />);
        component.setState({ valid: false });

        popupComponent = TestUtils.findRenderedComponentWithType(component, ChatPopup);
      });

      it('renders ChatPopup with rightCtaDisabled prop as true', () => {
        expect(popupComponent.props.rightCtaDisabled)
          .toBe(true);
      });
    });
  });

  describe('renderFailureScreen', () => {
    let errorMessage;

    describe('when the state is not in an error screen', () => {
      beforeEach(() => {
        const mockScreen = EDIT_CONTACT_DETAILS_SCREEN;
        const component = instanceRender(<ChatContactDetailsPopup screen={mockScreen} />);

        errorMessage = component.renderFailureScreen();
      });

      it('does not render an error message component', () => {
        expect(errorMessage)
          .toEqual(null);
      });
    });

    describe('when the state is an error screen', () => {
      beforeEach(() => {
        const mockScreen = EDIT_CONTACT_DETAILS_ERROR_SCREEN;
        const component = instanceRender(<ChatContactDetailsPopup screen={mockScreen} />);

        errorMessage = component.renderFailureScreen();
      });

      it('renders an error message component', () => {
        expect(errorMessage)
          .not.toEqual(null);
      });
    });
  });

  describe('renderForm', () => {
    let form;

    describe('when the state is an edit contact details screen', () => {
      beforeEach(() => {
        const mockScreen = EDIT_CONTACT_DETAILS_SCREEN;
        const component = instanceRender(<ChatContactDetailsPopup screen={mockScreen} />);

        form = component.renderForm();
      });

      it('renders a form component', () => {
        expect(form)
          .not.toEqual(null);
      });
    });

    describe('when the state is not an edit contact details screen', () => {
      beforeEach(() => {
        const mockScreen = EDIT_CONTACT_DETAILS_LOADING_SCREEN;
        const component = instanceRender(<ChatContactDetailsPopup screen={mockScreen} />);

        form = component.renderForm();
      });

      it('does not render a form component', () => {
        expect(form)
          .toEqual(null);
      });
    });
  });

  describe('renderNameField', () => {
    let form,
      component;

    beforeEach(() => {
      component = instanceRender(<ChatContactDetailsPopup />);
      spyOn(component, 'generateFieldClasses');
      spyOn(component, 'generateInputClasses');
      form = component.renderNameField();
    });

    it('calls generateInputClasses', () => {
      expect(component.generateInputClasses)
        .toHaveBeenCalled();
    });

    it('calls generateFieldClasses', () => {
      expect(component.generateFieldClasses)
        .toHaveBeenCalled();
    });
  });

  describe('renderEmailField', () => {
    let form,
      component;

    beforeEach(() => {
      component = instanceRender(<ChatContactDetailsPopup />);
      spyOn(component, 'generateFieldClasses');
      spyOn(component, 'generateInputClasses');
      form = component.renderEmailField();
    });

    it('calls generateInputClasses', () => {
      expect(component.generateInputClasses)
        .toHaveBeenCalled();
    });

    it('calls generateFieldClasses', () => {
      expect(component.generateFieldClasses)
        .toHaveBeenCalled();
    });
  });

  describe('generateFieldClasses', () => {
    let result,
      component,
      mockIsAuthenticated;

    beforeEach(() => {
      component = instanceRender(<ChatContactDetailsPopup isAuthenticated={mockIsAuthenticated} />);
      result = component.generateFieldClasses();
    });

    it('renders field class', () => {
      expect(result)
        .toContain('field');
    });

    describe('when authenticated', () => {
      beforeAll(() => {
        mockIsAuthenticated = true;
      });

      it('renders fieldAuthDisabled class', () => {
        expect(result)
          .toContain('fieldAuthDisabled');
      });
    });

    describe('when not authenticated', () => {
      beforeAll(() => {
        mockIsAuthenticated = false;
      });

      it('does not render fieldAuthDisabled class', () => {
        expect(result)
          .not
          .toContain('fieldAuthDisabled');
      });
    });
  });

   describe('generateInputClasses', () => {
    let result,
      component,
      mockIsAuthenticated,
      mockIsMobile;

    beforeEach(() => {
      component = instanceRender(<ChatContactDetailsPopup isAuthenticated={mockIsAuthenticated} isMobile={mockIsMobile} />);
      result = component.generateInputClasses();
    });

    describe('when authenticated', () => {
      beforeAll(() => {
        mockIsAuthenticated = true;
      });

      it('renders fieldInputAuthDisabled', () => {
        expect(result)
          .toContain('fieldInputAuthDisabled');
      });

      describe('when inputMobile is true', () => {
        beforeAll(() => {
          mockIsMobile = true;
        });

        it('renders fieldInputMobile', () => {
          expect(result)
            .toContain('fieldInputMobile');
        });
      });

      describe('when inputMobile is false', () => {
        beforeAll(() => {
          mockIsMobile = false;
        });

        it('does not render fieldInputMobile', () => {
          expect(result)
            .not
            .toContain('fieldInputMobile');
        });
      });
    });

    describe('when not authenticated', () => {
      beforeAll(() => {
        mockIsAuthenticated = false;
      });

      it('does not render fieldInputAuthDisabled', () => {
        expect(result)
          .not
          .toContain('fieldInputAuthDisabled');
      });

      describe('when inputMobile is true', () => {
        beforeAll(() => {
          mockIsMobile = true;
        });

        it('renders fieldInputMobile', () => {
          expect(result)
            .toContain('fieldInputMobile');
        });
      });

      describe('when inputMobile is false', () => {
        beforeAll(() => {
          mockIsMobile = false;
        });

        it('does not render fieldInputMobile', () => {
          expect(result)
            .not
            .toContain('fieldInputMobile');
        });
      });
    });
  });

  describe('renderLoadingSpinner', () => {
    let loadingSpinner;

    describe('when the state is not in a loading screen', () => {
      beforeEach(() => {
        const mockScreen = EDIT_CONTACT_DETAILS_SCREEN;
        const component = instanceRender(<ChatContactDetailsPopup screen={mockScreen} />);

        loadingSpinner = component.renderLoadingSpinner();
      });

      it('does not render a loading spinner component', () => {
        expect(loadingSpinner)
          .toEqual(null);
      });
    });

    describe('when the state is a loading screen', () => {
      beforeEach(() => {
        const mockScreen = EDIT_CONTACT_DETAILS_LOADING_SCREEN;
        const component = instanceRender(<ChatContactDetailsPopup screen={mockScreen} />);

        loadingSpinner = component.renderLoadingSpinner();
      });

      it('renders a loading spinner component', () => {
        expect(TestUtils.isElementOfType(loadingSpinner, LoadingSpinner))
          .toEqual(true);
      });

      it('passes the right width prop', () => {
        expect(loadingSpinner.props.width)
          .toEqual(32);
      });

      it('passes the right height prop', () => {
        expect(loadingSpinner.props.height)
          .toEqual(32);
      });
    });
  });
});
