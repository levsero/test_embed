describe('SubmitTicketForm component', function() {
  let SubmitTicketForm,
    onSubmit,
    onCancel,
    mockRegistry,
    mockAttachmentsReadyValue,
    mockAttachmentsListClear,
    scrollToBottomSpy,
    mockFormState;
  const submitTicketFormPath = buildSrcPath('component/submitTicket/SubmitTicketForm');
  const buttonPath = buildSrcPath('component/button/Button');
  const formParams = {
    'name': 'jabbathehutt',
    'email': 'mock@email.com',
    'description': 'Mock Description'
  };
  const mockSetFormState = (state) => {
    mockFormState = state;
  };

  beforeEach(function() {
    onSubmit = jasmine.createSpy();
    onCancel = jasmine.createSpy();

    resetDOM();

    mockery.enable({
      warnOnReplace: false
    });

    mockAttachmentsReadyValue = true;
    mockAttachmentsListClear = jasmine.createSpy('attachmentsListClear');
    scrollToBottomSpy = jasmine.createSpy();

    mockRegistry = initMockRegistry({
      'React': React,
      './SubmitTicketForm.sass': {
        locals: ''
      },
      'component/button/Button': {
        Button: class extends Component {
          render() {
            return <input type='submit' disabled={this.props.disabled} />;
          }
        }
      },
      'component/button/ButtonSecondary': {
        ButtonSecondary: class extends Component {
          render() {
            return (
              <div
                className='c-btn--secondary'
                label='Cancel'
                onClick={onCancel} />
            );
          }
        }
      },
      'component/button/ButtonGroup': {
        ButtonGroup: class extends Component {
          render() {
            return <div>{this.props.children}</div>;
          }
        }
      },
      'component/button/ButtonDropzone': {
        ButtonDropzone: noopReactComponent()
      },
      'component/field/Field': {
        Field: class extends Component {
          render() {
            return <input name={this.props.name}>{this.props.children}</input>;
          }
        }
      },
      'component/container/ScrollContainer': {
        ScrollContainer: class extends Component {
          constructor() {
            super();
            this.scrollToBottom = scrollToBottomSpy;
          }
          setScrollShadowVisible() {}
          render() {
            return (
              <div>
                <h1 id='formTitle'>{this.props.title}</h1>
                {this.props.children}
                <div>{this.props.footerContent}</div>
              </div>
            );
          }
        }
      },
      'component/attachment/AttachmentList': {
        AttachmentList: class extends Component {
          constructor() {
            super();
            this.clear = mockAttachmentsListClear;
          }
          attachmentsReady() {
            return mockAttachmentsReadyValue;
          }
          render() {
            return <div ref="attachments" />;
          }
        }
      },
      'service/i18n': {
        i18n: {
          init: noop,
          setLocale: noop,
          getLocale: () => 'en-GB',
          isRTL: noop,
          t: _.identity
        }
      },
      'utility/fields': {
        getCustomFields: (fields) => {
          const generateField = (field) => {
            switch (field.type) {
              case 'checkbox':
                return <input type='checkbox' name={field.id} />;
              case 'tagger':
                return <select type='tagger' name={field.id} />;
              case 'description':
              case 'textarea':
                return <textarea rows='5' type={field.type} name={field.id} />;
              case 'integer':
              case 'decimal':
                return <input type='number' name={field.id} />;
              case 'text':
              case 'subject':
              default:
                return <input type='text' name={field.id} />;
            }
          };

          return {
            fields: [],
            allFields: _.map(fields, (f) => generateField(f))
          };
        }
      },
      'utility/globals': {
        win: window
      },
      'lodash': _
    });

    mockery.registerAllowable('utility/globals');
    mockery.registerAllowable(submitTicketFormPath);
    mockery.registerAllowable(buttonPath);

    SubmitTicketForm = requireUncached(submitTicketFormPath).SubmitTicketForm;
  });

  afterEach(function() {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should display form title', function() {
    domRender(<SubmitTicketForm formTitleKey='testTitle' />);

    expect(document.getElementById('formTitle').innerHTML)
      .toEqual('embeddable_framework.submitTicket.form.title.testTitle');
  });

  it('should call i18n.t with the right parameter to set the form title', function() {
    const titleKey = 'foo bar';

    spyOn(mockRegistry['service/i18n'].i18n, 't').and.callThrough();

    domRender(<SubmitTicketForm formTitleKey={titleKey} />);

    expect(mockRegistry['service/i18n'].i18n.t)
      .toHaveBeenCalledWith(`embeddable_framework.submitTicket.form.title.${titleKey}`);
  });

  it('should correctly render form with noValidate attribute', function() {
    const submitTicketForm = domRender(<SubmitTicketForm />);

    expect(ReactDOM.findDOMNode(submitTicketForm).getAttribute('novalidate'))
      .toEqual('');
  });

  it('should change state and alter submit button on valid submit', function() {
    const submitTicketForm = domRender(<SubmitTicketForm submit={onSubmit} />);
    const submitTicketFormNode = ReactDOM.findDOMNode(submitTicketForm);
    const submitElem = submitTicketFormNode.querySelector('input[type="submit"]');

    expect(submitElem.disabled)
      .toEqual(true);

    submitTicketForm.setState({isValid: true});

    expect(submitElem.disabled)
      .toEqual(false);

    expect(submitTicketForm.state.isSubmitting)
      .toEqual(false);

    submitTicketForm.handleSubmit();

    expect(submitTicketForm.state.isSubmitting)
      .toEqual(true);

    expect(submitElem.disabled)
      .toEqual(true);
  });

  describe('on a valid submission', () => {
    let submitTicketForm;
    const expectedFormState = {
      name: formParams.name,
      email: formParams.email
    };

    it('should clear all fields other then name and email', () => {
      mockFormState = _.clone(formParams);
      submitTicketForm = domRender(
        <SubmitTicketForm
          submit={onSubmit}
          setFormState={mockSetFormState}
          formState={mockFormState} />
      );

      submitTicketForm.clear();

      expect(mockFormState)
        .toEqual(expectedFormState);
    });

    it("should reset the button to it's initial state", () => {
      submitTicketForm = domRender(<SubmitTicketForm submit={onSubmit} />);

      submitTicketForm.setState({
        buttonMessage: 'embeddable_framework.submitTicket.form.submitButton.label.sending'
      });

      submitTicketForm.clear();

      expect(submitTicketForm.state.buttonMessage)
        .toEqual('embeddable_framework.submitTicket.form.submitButton.label.send');
    });

    describe('when attachments are enabled', () => {
      beforeEach(() => {
        mockFormState = _.clone(formParams);
        submitTicketForm = domRender(
          <SubmitTicketForm
            submit={onSubmit}
            setFormState={mockSetFormState}
            formState={mockFormState}
            attachmentsEnabled={true} />);

        submitTicketForm.clear();
      });

      it('should clear all fields other then name and email', () => {
        expect(mockFormState)
          .toEqual(expectedFormState);
      });

      it('should clear the attachments list', () => {
        expect(mockAttachmentsListClear)
          .toHaveBeenCalled();
      });
    });
  });

  it('should disable submit button when attachments not ready', function() {
    const submitTicketForm = domRender(<SubmitTicketForm submit={onSubmit} attachmentsEnabled={true} />);
    const submitTicketFormNode = ReactDOM.findDOMNode(submitTicketForm);
    const submitElem = submitTicketFormNode.querySelector('input[type="submit"]');

    submitTicketForm.refs.form.checkValidity = () => true;
    mockAttachmentsReadyValue = false;

    submitTicketForm.updateForm();

    expect(submitElem.disabled)
      .toEqual(true);
  });

  describe('ButtonSecondary', function() {
    it('should be rendered in the form when fullscreen is false', function() {
      const submitTicketForm = domRender(<SubmitTicketForm fullscreen={false} />);

      expect(function() {
        TestUtils.findRenderedDOMComponentWithClass(submitTicketForm, 'c-btn--secondary');
      }).not.toThrow();
    });

    it('should not be rendered in the form when fullscreen is true', function() {
      const submitTicketForm = domRender(<SubmitTicketForm fullscreen={true} />);

      expect(function() {
        TestUtils.findRenderedDOMComponentWithClass(submitTicketForm, 'c-btn--secondary');
      }).toThrow();
    });
  });

  describe('#renderSubjectField', () => {
    let submitTicketForm;

    describe('when the subject field is enabled', () => {
      beforeEach(() => {
        submitTicketForm = domRender(
          <SubmitTicketForm subjectEnabled={true} />
        );
      });

      it('should render the subject field', () => {
        expect(submitTicketForm.renderSubjectField())
          .toBeDefined();

        expect(submitTicketForm.renderSubjectField().props.name)
          .toBe('subject');
      });
    });

    describe('when the subject field is disabled', () => {
      beforeEach(() => {
        submitTicketForm = domRender(<SubmitTicketForm />);
      });

      it('should not render the subject field', () => {
        expect(submitTicketForm.renderSubjectField())
          .toBeNull();
      });
    });
  });

  describe('When a Ticket Form is passed in', () => {
    let component,
      formElements;

    beforeEach(() => {
      /* eslint-disable camelcase */
      const mockTicketForm = {
        id: 1,
        raw_name: 'Ticket Formz',
        display_name: 'Ticket Forms',
        ticket_field_ids: [1, 2, 4]
      };
      const mockTicketFields = [
        { id: 1, raw_title: 'Description' },
        { id: 2, raw_title: 'Subject' },
        { id: 4, raw_title: 'Favorite Burger' },
        { id: 5, raw_title: 'Favorite Pizza' }
      ];
      /* eslint-enable camelcase */

      component = domRender(<SubmitTicketForm />);
      component.updateTicketForm(mockTicketForm, mockTicketFields);

      formElements = component.refs.formWrapper.children;
    });

    it('should render the name field', () => {
      const nameField = formElements[1]; // first field in form

      expect(nameField.getAttribute('name'))
        .toBe('name');
    });

    it('should render the email field', () => {
      const emailField = formElements[2]; // second field in form

      expect(emailField.getAttribute('name'))
        .toBe('email');
    });

    it('should render the extra fields defined in the ticket form', () => {
      expect(formElements[3].getAttribute('name'))
        .toBe('1');
      expect(formElements[4].getAttribute('name'))
        .toBe('2');
      expect(formElements[5].getAttribute('name'))
        .toBe('4');
    });

    it('should not render any fields not defined in the ticket form', () => {
      expect(formElements.length)
        .not.toBe(4);
    });
  });

  describe('#handleAttachmentsError', () => {
    let component;

    beforeEach(() => {
      jasmine.clock().install();

      component = domRender(<SubmitTicketForm />);
      component.handleAttachmentsError();

      jasmine.clock().tick(1);
    });

    it('calls ScrollContainer.scrollToBottom', () => {
      expect(scrollToBottomSpy)
        .toHaveBeenCalled();
    });
  });

  describe('when the preview is enabled', () => {
    let submitTicketForm;

    beforeEach(() => {
      submitTicketForm = domRender(<SubmitTicketForm submit={onSubmit} previewEnabled={true} />);
    });

    describe('when submit button is clicked', () => {
      let mockPreventDefault;

      beforeEach(() => {
        mockPreventDefault = jasmine.createSpy('preventDefault');

        submitTicketForm.setState({ isValid: true });
        submitTicketForm.handleSubmit({ preventDefault: mockPreventDefault });
      });

      it('should call preventDefault', () => {
        expect(mockPreventDefault)
          .toHaveBeenCalled();
      });

      it('should not change the button label', () => {
        expect(submitTicketForm.state.buttonMessage)
          .toBe('embeddable_framework.submitTicket.form.submitButton.label.send');

        expect(submitTicketForm.state.isSubmitting)
          .toBe(false);
      });

      it('should not call props.submit', () => {
        expect(onSubmit)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('prefillFormState', () => {
    let submitTicketForm,
      mockSetFormState;

    const mockTicketForm = {
      id: 1,
      ticket_field_ids: ['name', 'email', 2387462, 9465549, 1872364, 1238743, 3287425] // eslint-disable-line camelcase
    };
    const mockTicketFields = [
      { id: 'name', type: 'name' },
      { id: 'email', type: 'email' },
      { id: 2387462, type: 'checkbox' },
      { id: 9465549, type: 'tagger' },
      { id: 1872364, type: 'integer' },
      { id: 1238743, type: 'decimal' },
      { id: 3287425, type: 'text' }
    ];

    beforeEach(() => {
      mockSetFormState = jasmine.createSpy('mockSetFormState');

      submitTicketForm = domRender(
        <SubmitTicketForm
          setFormState={mockSetFormState}
          formState={mockFormState} />
      );
      submitTicketForm.updateTicketForm(mockTicketForm, mockTicketFields);
    });

    describe('when given an empty pre-fill data', () => {
      it('should not pre-fill any ticket fields', () => {
        submitTicketForm.prefillFormState(mockTicketFields);

        expect(mockSetFormState.calls.mostRecent())
          .toBeFalsy();
      });
    });

    describe('when given an unexpected pre-fill data', () => {
      const mockPrefillList = [
        'Denam Pavel',
        9001,
        new Date(),
        { 'Terence': 1234 },
        { id: 1234, 'Ezel': 'Berbier' },
        { 'Ramza': 'Beoulve', prefill: { '*': 'foo', 'en-GB': 'bar' } }
      ];

      it('should not pre-fill any ticket fields', () => {
        mockPrefillList.forEach((prefill) => {
          submitTicketForm.prefillFormState(mockTicketFields, prefill);

          expect(mockSetFormState.calls.mostRecent())
            .toBeFalsy();
        });
      });
    });

    describe('when pre-fill contains disallowed field types', () => {
      const mockPrefill = {
        fields: [
          { id: 'name', prefill: { '*': 'abc', 'en-GB': 'Arycelle Dania' } },
          { id: 'email', prefill: { '*': 'def', 'en-GB': 'arycelle@dania.com' } },
          { id: 2387462, prefill: { '*': 'ghi', 'en-GB': 'Boco' } },
          { id: 9465549, prefill: { '*': 'jkl', 'en-GB': 'Luso' } }
        ]
      };

      it('should not pre-fill the ticket fields', () => {
        submitTicketForm.prefillFormState(mockTicketFields, mockPrefill);

        expect(mockSetFormState.calls.mostRecent())
          .toBeFalsy();
      });
    });

    describe('when pre-fill contains allowed field types', () => {
      const mockPrefill = {
        fields: [
          { id: 1872364, prefill: { '*': 123, 'en-GB': 1337 } },
          { id: 3287425, prefill: { '*': 324, 'en-GB': 10101001 } }
        ]
      };

      describe(`when current locale is 'en-GB'`, () => {
        const expectation = [{
          '1238743': '',
          '1872364': 1337,
          '2387462': 0,
          '3287425': 10101001,
          '9465549': '',
          name: '',
          email: ''
        }];

        it('should pre-fill ticket fields in the ticket form', () => {
          submitTicketForm.prefillFormState(mockTicketFields, mockPrefill);

          expect(mockSetFormState.calls.mostRecent().args)
            .toEqual(expectation);
        });
      });

      describe(`when current locale is '*' (fallback locale)`, () => {
        const expectation = [{
          '1238743': '',
          '1872364': 123,
          '2387462': 0,
          '3287425': 324,
          '9465549': '',
          name: '',
          email: ''
        }];

        it('should pre-fill ticket fields in the ticket form', () => {
          mockRegistry['service/i18n'].i18n.getLocale = () => '*';

          submitTicketForm.prefillFormState(mockTicketFields, mockPrefill);

          expect(mockSetFormState.calls.mostRecent().args)
            .toEqual(expectation);
        });
      });
    })
  });
});
