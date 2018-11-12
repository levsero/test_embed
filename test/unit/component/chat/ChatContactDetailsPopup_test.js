describe('ChatContactDetailsPopup component', () => {
  let ChatContactDetailsPopup,
    mockForm,
    mockFormValidity,
    mockNameValid,
    mockEmailValid,
    mockShouldRenderErrorMessage,
    mockIsDefaultNickname,
    ICONS,
    updateFnSpy,
    EDIT_CONTACT_DETAILS_SCREEN,
    EDIT_CONTACT_DETAILS_LOADING_SCREEN,
    EDIT_CONTACT_DETAILS_ERROR_SCREEN;
  const ChatContactDetailsPopupPath = buildSrcPath('component/chat/ChatContactDetailsPopup');

  const LoadingSpinner = noopReactComponent();
  const Message = noopReactComponent();
  const TextField = noopReactComponent();

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
        ICONS,
        NAME_PATTERN: /.+/,
        EMAIL_PATTERN: /.+/
      },
      'constants/chat': {
        EDIT_CONTACT_DETAILS_SCREEN,
        EDIT_CONTACT_DETAILS_LOADING_SCREEN,
        EDIT_CONTACT_DETAILS_ERROR_SCREEN
      },
      'component/chat/ChatPopup': { ChatPopup },
      'component/loading/LoadingSpinner': { LoadingSpinner },
      'component/Icon': noopReactComponent(),
      '@zendeskgarden/react-textfields': {
        TextField,
        Label: noopReactComponent(),
        Input: noopReactComponent(),
        Message
      },
      'service/i18n': {
        i18n: {
          t: noop
        }
      },
      'src/util/utils': {
        nameValid: () => mockNameValid,
        emailValid: () => mockEmailValid
      },
      'src/util/fields': {
        shouldRenderErrorMessage: () => mockShouldRenderErrorMessage,
        renderLabel: () => 'someLabel'
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
      mockProps,
      rightCtaFnSpy;

    beforeEach(() => {
      rightCtaFnSpy = jasmine.createSpy('rightCtaFn');

      component = instanceRender(<ChatContactDetailsPopup rightCtaFn={rightCtaFnSpy} />);

      spyOn(component, 'setState');
      component.props = {...component.props, ...mockProps};
      component.handleSave();
    });

    describe('when name in form is invalid', () => {
      beforeAll(() => {
        mockNameValid = false;
        mockEmailValid = true;
      });

      it('shows error', () => {
        expect(component.setState)
          .toHaveBeenCalledWith({
            showNameError: true,
            showEmailError: false
          });
      });
    });

    describe('when email in form is invalid', () => {
      beforeAll(() => {
        mockNameValid = true;
        mockEmailValid = false;
      });

      it('shows error', () => {
        expect(component.setState)
          .toHaveBeenCalledWith({
            showNameError: false,
            showEmailError: true
          });
      });
    });

    describe('when form is valid', () => {
      beforeAll(() => {
        mockProps = { contactDetails: {display_name: 'bob', email: 'bob@zd.com' }};
        mockEmailValid = true;
      });

      it('calls props.rightCtaFn with form state name and email', () => {
        expect(rightCtaFnSpy)
          .toHaveBeenCalledWith('bob', 'bob@zd.com');
      });

      describe('when there exists an activeElement', () => {
        beforeEach(() => {
          const mockActiveElement = domRender(<div />);

          spyOnProperty(document, 'activeElement').and.returnValue(mockActiveElement);

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
  });

  describe('handleKeyPress', () => {
    const keyCodes = { enter: 13, a: 65 };
    let component;
    let event = { charCode: keyCodes.enter, preventDefault: () => false };

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
    let component,
      mockProps;

    beforeEach(() => {
      updateFnSpy = jasmine.createSpy('updateFn');

      component = instanceRender(<ChatContactDetailsPopup updateFn = {updateFnSpy} contactDetails={mockProps} />);
      component.form = mockForm;
    });

    afterEach(() => {
      updateFnSpy.calls.reset();
    });

    describe('when form is valid', () => {
      beforeEach(() => {
        mockProps = {
          display_name: 'Joey',
          email: 'hello@world.com'
        };

        component.state.showEmailError = true;

        component.handleFormChange({
          target: {
            name: 'display_name',
            value: 'bob'
          }
        });
      });

      it('updates state.showEmailError as false via emailValid', () => {
        expect(component.state.showEmailError)
          .toBe(false);
      });

      it('attempt to update redux with new target name field', () => {
        expect(updateFnSpy)
          .toHaveBeenCalledWith('bob', 'hello@world.com');
      });
    });

    describe('when form is invalid', () => {
      beforeEach(() =>{
        mockProps = {
          display_name: 'Joey',
          email: 'blarg'
        };
        component.state.showEmailError = true;
        component.handleFormChange({
          target: {
            name: 'email',
            value: 'bob'
          }
        });
      });

      it('leaves state.showEmailError as true via emailValid', () => {
        expect(component.state.showEmailError)
          .toBe(false);
      });

      it('attempt to update redux with new target email field', () => {
        expect(updateFnSpy)
          .toHaveBeenCalledWith('Joey', 'bob');
      });
    });
  });

  describe('componentWillReceiveProps', () => {
    let component,
      mockContactDetails;

    afterEach(() => {
      updateFnSpy.calls.reset();
    });

    describe('when contact details have been entered into the popup before', () => {
      beforeEach(() => {
        updateFnSpy = jasmine.createSpy('updateFn');
        mockContactDetails = { display_name: 'guy', email: 'guy@guys.com' };

        component = instanceRender(<ChatContactDetailsPopup contactDetails={mockContactDetails} updateFn={updateFnSpy} />);

        component.componentWillReceiveProps({
          visitor: { display_name: 'bob', email: 'bob@bob.com' },
          contactDetails: mockContactDetails
        });
      });

      it('attempts to update the contactDetails redux with the input values', () => {
        expect(updateFnSpy)
          .toHaveBeenCalledWith('guy', 'guy@guys.com');
      });
    });

    describe('when contact details have not been entered into the popup before', () => {
      beforeEach(() => {
        updateFnSpy = jasmine.createSpy('updateFn');
        mockContactDetails = { display_name: null, email: null };

        component = instanceRender(<ChatContactDetailsPopup contactDetails={mockContactDetails} updateFn={updateFnSpy} />);

        component.componentWillReceiveProps({
          visitor: { display_name: 'bob', email: 'bob@bob.com' },
          contactDetails: mockContactDetails
        });
      });

      describe('when the name is not the default chat name', () => {
        it('attempts to update the contactDetails with the visitor prop', () => {
          expect(updateFnSpy)
            .toHaveBeenCalledWith('bob', 'bob@bob.com');
        });
      });

      describe('when the name is the default chat name', () => {
        beforeEach(() => {
          mockIsDefaultNickname = true;
          component = instanceRender(<ChatContactDetailsPopup contactDetails={{}} />);

          component.componentWillReceiveProps({ visitor: { display_name: 'Visitor 12345' }, contactDetails: {} });
        });

        it('sets name in contactDetails redux to an empty string', () => {
          expect(updateFnSpy)
            .toHaveBeenCalledWith('', '');
        });
      });

      it('attempts to update the contactDetails to the visitor prop passed in', () => {
        expect(updateFnSpy)
          .toHaveBeenCalledWith('bob', 'bob@bob.com');
      });
    });
  });

  describe('render', () => {
    let component,
      renderedComponent;

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

  describe('renderEmailField', () => {
    let result,
      component;

    beforeEach(() => {
      component = instanceRender(<ChatContactDetailsPopup />);
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

  describe('renderNameField', () => {
    let result,
      component;

    beforeEach(() => {
      component = instanceRender(<ChatContactDetailsPopup />);
      result = component.renderNameField();
    });

    it('renders a TextField component', () => {
      expect(TestUtils.isElementOfType(result, TextField))
        .toEqual(true);
    });
  });
});
