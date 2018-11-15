describe('Submit ticket component', () => {
  let SubmitTicket,
    mockStoreValue,
    mockIsIEValue,
    mockIsMobileBrowserValue,
    SuccessNotification =  noopReactComponent();

  const formParams = {
    'name': 'bob',
    'email': 'mock@email.com',
    'description': 'Mock Description',
    'subject': 'Mock Subject',
    'set_tags': 'web_widget',
    'via_id': 48,
    'locale_id': 'fr',
    'submitted_from': global.window.location.href
  };
  const submitTicketPath = buildSrcPath('component/submitTicket/SubmitTicket');
  const Alert = noopReactComponent();

  class MockAttachmentList extends Component {
    getAttachmentTokens() {
      return ['12345'];
    }
    numUploadedAttachments() {
      return 2;
    }
    uploadedAttachments() {
      return [
        { file: { type: 'image/png' } },
        { file: { type: '' } } // Unrecognised MIME type
      ];
    }
    render() {
      return <div />;
    }
  }

  beforeEach(() => {
    mockIsMobileBrowserValue = false;
    mockIsIEValue = false;
    mockStoreValue = false;

    mockery.enable();

    initMockRegistry({
      'React': React,
      'utility/globals': {
        win: window,
        location: location
      },
      'utility/devices': {
        isIE: () => mockIsIEValue,
        isMobileBrowser: () => mockIsMobileBrowserValue
      },
      './SubmitTicket.scss': {
        locals: {
          loadingSpinnerIE: 'loadingSpinnerIEClasses',
          loadingSpinner: 'loadingSpinnerClasses',
          noZendeskLogoButton: 'noZendeskLogoButton',
          zendeskLogoButton: 'zendeskLogoButton'
        }
      },
      '@zendeskgarden/react-buttons': {
        Button: noopReactComponent()
      },
      '@zendeskgarden/react-notifications': {
        Alert: Alert
      },
      'component/submitTicket/SubmitTicketForm': {
        SubmitTicketForm: class extends Component {
          constructor() {
            super();
            this.state = {
              formState: {}
            };
          }
          clear() {}
          updateTicketForm() {}
          render() {
            return (
              <form ref='submitTicketForm'>
                <MockAttachmentList ref='attachments' />
              </form>
            );
          }
        },
        MessageFieldset: noop
      },
      'component/field/SelectField': {
        SelectField: noopReactComponent()
      },
      'component/ZendeskLogo': {
        ZendeskLogo: noopReactComponent()
      },
      'component/loading/LoadingSpinner': {
        LoadingSpinner: noopReactComponent()
      },
      'component/container/ScrollContainer': {
        ScrollContainer: class extends Component {
          render() {
            return <div>{this.props.children}</div>;
          }
        }
      },
      'component/attachment/AttachmentBox': {
        AttachmentBox: class extends Component {
          render() {
            return <div className='attachment_box' />;
          }
        }
      },
      'component/shared/SuccessNotification': {
        SuccessNotification
      },
      'service/i18n': {
        i18n: {
          init: noop,
          setLocale: noop,
          getLocaleId: () => 'fr',
          isRTL: noop,
          t: _.identity,
          getLocale: () => 'en-US'
        }
      },
      'service/settings': {
        settings: {
          get: () => 48
        }
      },
      'service/persistence': {
        store: {
          get: () => mockStoreValue
        }
      },
      'src/constants/shared': {
        ICONS: {
          SUCCESS_CONTACT_FORM: 'icon'
        }
      },
      'src/redux/modules/submitTicket': {},
      'src/redux/modules/submitTicket/submitTicket-selectors': {},
      'component/Icon': {
        Icon: noopReactComponent()
      },
      'lodash': _,
      'src/redux/modules/helpCenter/helpCenter-selectors': {
        getSearchTerm: () => 'a search.'
      }
    });

    mockery.registerAllowable(submitTicketPath);

    SubmitTicket = requireUncached(submitTicketPath).default.WrappedComponent;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('renderForm', () => {
    let result;
    const mockActiveTicketFormFields = [{ id: 111 }, { id: 222 }];
    const mockTicketFields = {
      123: { id: 123 },
      456: { id: 456 }
    };

    describe('when there is an active ticket form', () => {
      beforeEach(() => {
        const activeTicketForm = { id: 3984 };
        const submitTicket = instanceRender(
          <SubmitTicket
            activeTicketForm={activeTicketForm}
            activeTicketFormFields={mockActiveTicketFormFields}
            ticketFields={mockTicketFields} />
        );

        result = submitTicket.renderForm();
      });

      it('passes down active ticket form fields', () => {
        expect(result.props.ticketFields)
          .toEqual(mockActiveTicketFormFields);
      });

      it('the passed fields do not match ticket fields from config', () => {
        expect(result.props.ticketFields)
          .not.toEqual(mockTicketFields);
      });
    });

    describe('when an active form does not exist', () => {
      beforeEach(() => {
        const submitTicket = instanceRender(
          <SubmitTicket
            activeTicketForm={null}
            activeTicketFormFields={mockActiveTicketFormFields}
            ticketFields={mockTicketFields} />
        );

        result = submitTicket.renderForm();
      });

      it('passes down ticket fields from config', () => {
        expect(result.props.ticketFields)
          .toEqual(mockTicketFields);
      });

      it('the passed fields do not match active ticket fields for a form', () => {
        expect(result.props.ticketFields)
          .not.toEqual(mockActiveTicketFormFields);
      });
    });
  });

  describe('#renderErrorMessage', () => {
    let component,
      result,
      errorMessage;

    beforeEach(() => {
      component = instanceRender(
        <SubmitTicket
          errorMsg={errorMessage}
        />
      );

      result = component.renderErrorMessage();
    });

    describe('when there is an error message', () => {
      beforeAll(() => {
        errorMessage = 'Whoops! Something went totes wrong! <wink, wink>';
      });

      it('returns a garden <Alert> component', () => {
        expect(TestUtils.isElementOfType(result, Alert)).toEqual(true);
      });
    });

    describe('when there is no error', () => {
      beforeAll(() => {
        errorMessage = '';
      });

      it('returns undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('#handleSubmit', () => {
    let submitTicket,
      mockHandleTicketSubmission,
      mockOnSubmitted,
      mockValues;

    beforeEach(() => {
      mockHandleTicketSubmission = jasmine.createSpy('handleTicketSubmission');
      mockOnSubmitted = jasmine.createSpy('onSubmitted');
      mockValues = {
        isFormValid: true,
        value: {
          email: formParams.email,
          description: formParams.description,
          name: formParams.name,
          subject: formParams.subject
        }
      };

      submitTicket = domRender(
        <SubmitTicket
          handleTicketSubmission={mockHandleTicketSubmission}
          onSubmitted={mockOnSubmitted}
          searchTerm={'a search'}
          attachmentsEnabled={true} />
      );
      spyOn(submitTicket, 'clearForm');
    });

    describe('when the form is invalid', () => {
      beforeEach(() => {
        mockValues.isFormValid = false;
        submitTicket.handleSubmit({ preventDefault: noop }, mockValues);
      });

      it('does not call props.handleTicketSubmission', () => {
        expect(mockHandleTicketSubmission)
          .not.toHaveBeenCalled();
      });
    });

    describe('when the form is valid', () => {
      let params;

      beforeEach(() => {
        submitTicket.handleSubmit({ preventDefault: noop }, mockValues);

        params = mockHandleTicketSubmission.calls.mostRecent().args;
      });

      it('gets the attachments from AttachmentList', () => {
        expect(params[0])
          .toEqual(['12345']);
      });

      describe('when there is a successful response', () => {
        beforeEach(() => {
          submitTicket.handleSubmit({ preventDefault: noop }, mockValues);
          mockHandleTicketSubmission.calls.mostRecent().args[1]({});
        });

        it('clears the form', () => {
          expect(submitTicket.clearForm)
            .toHaveBeenCalled();
        });

        it('calls onSubmitted', () => {
          expect(mockOnSubmitted)
            .toHaveBeenCalled();
        });

        it('calls onSubmitted with given last search', () => {
          expect(mockOnSubmitted.calls.mostRecent().args[0].searchTerm)
            .toEqual('a search');

          expect(mockOnSubmitted.calls.mostRecent().args[0].searchLocale)
            .toEqual('en-US');
        });

        it('calls onSubmitted with the attachments list state', () => {
          expect(mockOnSubmitted.calls.mostRecent().args[0].attachmentsCount)
            .toEqual(2);

          expect(mockOnSubmitted.calls.mostRecent().args[0].attachmentTypes)
            .toEqual(['image/png', 'application/octet-stream']);
        });
      });
    });
  });

  describe('renderNotification', () => {
    let notification,
      mockHideZendeskLogo,
      mockFullScreen;

    beforeEach(() => {
      const submitTicket = domRender(<SubmitTicket
        showNotification={true}
        hideZendeskLogo={mockHideZendeskLogo}
        fullscreen={mockFullScreen} />);

      notification = submitTicket.renderNotification();
    });

    it('should render SuccessNotification', () => {
      expect(TestUtils.isElementOfType(notification.props.children, SuccessNotification))
        .toEqual(true);
    });

    describe('when hideZendeskLogo is true', () => {
      beforeAll(() => {
        mockHideZendeskLogo = true;
      });

      it('renders noZendeskLogoButton', () => {
        expect(notification.props.footerContent.props.className)
          .toContain('noZendeskLogoButton');
      });

      it('does not renders zendeskLogoButton', () => {
        expect(notification.props.footerContent.props.className)
          .not
          .toContain('zendeskLogoButton');
      });
    });

    describe('when zendesk logo required', () => {
      beforeAll(() => {
        mockHideZendeskLogo = false;
        mockFullScreen = false;
      });

      it('renders zendeskLogoButton', () => {
        expect(notification.props.footerContent.props.className)
          .toContain('zendeskLogoButton');
      });

      it('does not render noZendeskLogoButton', () => {
        expect(notification.props.footerContent.props.className)
          .not
          .toContain('noZendeskLogoButton');
      });
    });

    describe('when props.showNotification is true', () => {
      beforeEach(() => {
        const submitTicket = domRender(<SubmitTicket showNotification={true} />);

        notification = submitTicket.renderNotification();
      });

      it('returns an element', () => {
        expect(notification)
          .toBeTruthy();
      });
    });

    describe('when props.showNotification is false', () => {
      beforeEach(() => {
        const submitTicket = domRender(<SubmitTicket showNotification={false} />);

        notification = submitTicket.renderNotification();
      });

      it('does not return an element', () => {
        expect(notification)
          .toBeFalsy();
      });
    });
  });

  describe('ticket forms list', () => {
    let submitTicket;

    it('is rendered by default', () => {
      submitTicket = domRender(<SubmitTicket />);

      expect(submitTicket.refs.ticketFormSelector)
        .toBeUndefined();
    });

    it('is rendered if the form is loading', () => {
      const ticketForms = [{ id: 1 }];

      submitTicket = domRender(<SubmitTicket ticketForms={ticketForms} loading={true} />);

      expect(submitTicket.refs.ticketFormSelector)
        .toBeUndefined();
    });

    it('is rendered when there is more then one ticket form', () => {
      const ticketForms = [{ id: 1 }, { id: 2 }];

      submitTicket = domRender(<SubmitTicket ticketForms={ticketForms} />);

      expect(submitTicket.refs.ticketFormSelector)
        .toBeDefined();
    });

    it('renders the correct number of list options', () => {
      const ticketForms = [{ id: 1 }, { id: 2 }, { id: 3 }];

      submitTicket = domRender(<SubmitTicket ticketForms={ticketForms} />);

      expect(submitTicket.renderTicketFormOptions().length)
        .toBe(3);
    });

    it('renders a semantically appropriate un-numbered list', () => {
      const ticketForms = [{ id: 1 }, { id: 2 }, { id: 3 }];

      submitTicket = domRender(<SubmitTicket ticketForms={ticketForms} />);

      expect(submitTicket.renderTicketFormOptions()
        .map((el) => el.type))
        .toEqual(['li', 'li', 'li']);
    });
  });

  describe('loading spinner', () => {
    let submitTicket, submitTicketNode;

    beforeEach(() => {
      submitTicket = domRender(<SubmitTicket />);
      submitTicketNode = ReactDOM.findDOMNode(submitTicket);
    });

    describe('when loading is false', () => {
      beforeEach(() => {
        submitTicket = domRender(<SubmitTicket />);
        submitTicketNode = ReactDOM.findDOMNode(submitTicket);
      });

      it('does not render', () => {
        expect(submitTicketNode.querySelectorAll('.loadingSpinnerClasses').length)
          .toEqual(0);
      });
    });

    describe('when loading is true', () => {
      beforeEach(() => {
        submitTicket = domRender(<SubmitTicket loading={true} />);
        submitTicketNode = ReactDOM.findDOMNode(submitTicket);
      });

      it('renders', () => {
        expect(submitTicketNode.querySelectorAll('.loadingSpinnerClasses').length)
          .toEqual(1);
      });

      it('does not have extra padding by default', () => {
        expect(submitTicketNode.querySelectorAll('.loadingSpinnerIEClasses').length)
          .toEqual(0);
      });

      describe('when on IE', () => {
        beforeEach(() => {
          mockIsIEValue = true;
          submitTicket = domRender(<SubmitTicket loading={true} />);
          submitTicketNode = ReactDOM.findDOMNode(submitTicket);
        });

        it('has extra padding', () => {
          expect(submitTicketNode.querySelectorAll('.loadingSpinnerIEClasses').length)
            .toEqual(1);
        });
      });
    });
  });

  it('should pass on fullscreen to submitTicketForm', () => {
    const submitTicket = instanceRender(<SubmitTicket />);

    submitTicket.setState({fullscreen: 'VALUE'});

    expect(submitTicket.state.fullscreen)
      .toEqual('VALUE');
  });

  describe('attachmentBox', () => {
    it('should display the attachment box when isDragActive and attachmentsEnabled are true', () => {
      const submitTicket = domRender(
        <SubmitTicket attachmentsEnabled={true} />
      );

      submitTicket.handleDragEnter();

      expect(submitTicket.state.isDragActive)
        .toEqual(true);

      expect(document.querySelectorAll('.attachment_box').length)
        .toEqual(1);
    });

    it('should not display the attachment box if attachmentsEnabled is false', () => {
      const submitTicket = domRender(<SubmitTicket attachmentsEnabled={false} />);

      submitTicket.handleDragEnter();

      expect(submitTicket.state.isDragActive)
        .toEqual(true);

      expect(document.querySelectorAll('.attachment_box').length)
        .toEqual(0);
    });
  });

  describe('clearForm', () => {
    let submitTicket;
    const mockClear = jasmine.createSpy('clear');
    const handleTicketFormClickSpy = jasmine.createSpy('handleTicketFormClick');

    beforeEach(() => {
      mockClear.calls.reset();
      handleTicketFormClickSpy.calls.reset();
    });

    describe('when there is more than 1 ticket form', () => {
      const mockTicketForms = [{ id: 123 }, { id: 456 }];

      beforeEach(() => {
        submitTicket = domRender(
          <SubmitTicket
            ticketForms={mockTicketForms}
            ticketFormsAvailable={true}
            handleTicketFormClick={handleTicketFormClickSpy} />
        );

        submitTicket.refs.submitTicketForm = { clear: mockClear };
        submitTicket.clearForm();
      });

      it('calls clear on submitTicketForm', () => {
        expect(mockClear)
          .toHaveBeenCalled();
      });

      it('calls handleTicketFormClick with null', () => {
        expect(handleTicketFormClickSpy)
          .toHaveBeenCalledWith(null);
      });
    });

    describe('when there is 1 ticket form', () => {
      const mockTicketForms = [{ id: 123 }];

      beforeEach(() => {
        submitTicket = domRender(
          <SubmitTicket
            ticketForms={mockTicketForms}
            ticketFormsAvailable={true}
            handleTicketFormClick={handleTicketFormClickSpy} />
        );

        submitTicket.refs.submitTicketForm = { clear: mockClear };
        submitTicket.clearForm();
      });

      it('should call clear on submitTicketForm', () => {
        expect(mockClear)
          .toHaveBeenCalled();
      });

      it('does not call handleTicketFormClick', () => {
        expect(handleTicketFormClickSpy)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('setTicketForm', () => {
    let submitTicket,
      mockShowBackButton;

    describe('when there are no ticket forms', () => {
      const subjects = ['Kuroi Uta', 123, [], { id: 456 }];

      beforeEach(() => {
        mockShowBackButton = jasmine.createSpy('showBackButton');
        submitTicket = domRender(<SubmitTicket showBackButton={mockShowBackButton} ticketForms={[]} />);
      });

      describe('when it is passed any data type representing a ticketFormId', () => {
        it('does not call showBackButton', () => {
          subjects.forEach((subject) => {
            submitTicket.setTicketForm(subject);
          });

          expect(mockShowBackButton)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('when there are ticket forms', () => {
      const ticketForms = [{ id: 123 }, { id: 456 }];

      beforeEach(() => {
        mockShowBackButton = jasmine.createSpy('showBackButton');
        submitTicket = domRender(
          <SubmitTicket
            showBackButton={mockShowBackButton}
            ticketFormsAvailable={true}
            ticketForms={ticketForms} />
        );
      });

      it('calls showBackButton', () => {
        submitTicket.setTicketForm(123);

        expect(mockShowBackButton)
          .toHaveBeenCalled();
      });
    });
  });
});
