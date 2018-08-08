describe('SubmitTicketForm component', () => {
  let SubmitTicketForm,
    onSubmit,
    onCancel,
    mockRegistry,
    mockAttachmentsReadyValue,
    mockAttachmentsListClear,
    scrollToBottomSpy,
    mockFormState,
    mockShouldRenderErrorMessage;
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
  const Message = noopReactComponent();

  beforeEach(() => {
    onSubmit = jasmine.createSpy();
    onCancel = jasmine.createSpy();

    mockery.enable({
      warnOnReplace: false
    });

    mockAttachmentsReadyValue = true;
    mockAttachmentsListClear = jasmine.createSpy('attachmentsListClear');
    scrollToBottomSpy = jasmine.createSpy();

    mockRegistry = initMockRegistry({
      'React': React,
      './SubmitTicketForm.scss': {
        locals: ''
      },
      '@zendeskgarden/react-buttons': {
        Button: class extends Component {
          render() {
            return <button {...this.props}>{this.props.children}</button>;
          }
        }
      },
      '@zendeskgarden/react-textfields': {
        TextField: noopReactComponent(),
        Textarea: noopReactComponent(),
        Label: noopReactComponent(),
        Input: noopReactComponent(),
        Message
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
      'constants/shared': {
        EMAIL_PATTERN: ''
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
        renderLabelText: (string) => string,
        shouldRenderErrorMessage: () => mockShouldRenderErrorMessage,
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

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  it('displays form title', () => {
    domRender(<SubmitTicketForm formTitleKey='testTitle' />);

    expect(document.getElementById('formTitle').innerHTML)
      .toEqual('embeddable_framework.submitTicket.form.title.testTitle');
  });

  it('calls i18n.t with the right parameter to set the form title', () => {
    const titleKey = 'foo bar';

    spyOn(mockRegistry['service/i18n'].i18n, 't').and.callThrough();

    domRender(<SubmitTicketForm formTitleKey={titleKey} />);

    expect(mockRegistry['service/i18n'].i18n.t)
      .toHaveBeenCalledWith(`embeddable_framework.submitTicket.form.title.${titleKey}`);
  });

  it('correctly renders form with noValidate attribute', () => {
    const submitTicketForm = domRender(<SubmitTicketForm />);

    expect(ReactDOM.findDOMNode(submitTicketForm).getAttribute('novalidate'))
      .toEqual('');
  });

  describe('submit button', () => {
    let submitTicketForm, submitElem;

    beforeEach(() => {
      submitTicketForm = domRender(<SubmitTicketForm submit={onSubmit} attachmentsEnabled={true} />);

      const submitTicketFormNode = ReactDOM.findDOMNode(submitTicketForm);

      submitElem = submitTicketFormNode.querySelector('button[type="submit"]');

      submitTicketForm.refs.form.checkValidity = () => true;
    });

    it('is not disabled by default', () => {
      expect(submitElem.disabled)
        .toEqual(false);
    });

    describe('when canSubmit is false', () => {
      beforeEach(() => {
        mockAttachmentsReadyValue = false;
        submitTicketForm.setState({ canSubmit: false });
      });

      it('is disabled', () => {
        expect(submitElem.disabled)
          .toEqual(true);
      });
    });

    describe('when isSubmitting is true', () => {
      beforeEach(() => {
        submitTicketForm.setState({ isSubmitting: true });
      });

      it('is disabled', () => {
        expect(submitElem.disabled)
          .toEqual(true);
      });
    });
  });

  describe('on a valid submission', () => {
    let submitTicketForm;
    const expectedFormState = {
      name: formParams.name,
      email: formParams.email
    };

    beforeEach(() => {
      mockFormState = _.clone(formParams);
      submitTicketForm = domRender(
        <SubmitTicketForm
          submit={onSubmit}
          setFormState={mockSetFormState}
          formState={mockFormState} />
      );

      submitTicketForm.refs.form.checkValidity = () => true;

      spyOn(submitTicketForm, 'prefillFormState');

      submitTicketForm.clear();
    });

    it('clears all fields other then name and email', () => {
      expect(mockFormState)
        .toEqual(expectedFormState);
    });

    it('calls prefillFormState', () => {
      expect(submitTicketForm.prefillFormState)
        .toHaveBeenCalled();
    });

    it("resets the button to it's initial state", () => {
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

      it('clears all fields other then name and email', () => {
        expect(mockFormState)
          .toEqual(expectedFormState);
      });

      it('clears the attachments list', () => {
        expect(mockAttachmentsListClear)
          .toHaveBeenCalled();
      });
    });
  });

  describe('#renderSubjectField', () => {
    let result;

    describe('when the subject field is enabled', () => {
      beforeEach(() => {
        const submitTicketForm = instanceRender(
          <SubmitTicketForm subjectEnabled={true} />
        );

        result = submitTicketForm.renderSubjectField();
      });

      it('renders the subject field', () => {
        const labelElement = result.props.children[0];

        expect(labelElement.props.children)
          .toBe('embeddable_framework.submitTicket.field.subject.label');
      });
    });

    describe('when the subject field is disabled', () => {
      beforeEach(() => {
        const submitTicketForm = instanceRender(<SubmitTicketForm />);

        result = submitTicketForm.renderSubjectField();
      });

      it('does not render the subject field', () => {
        expect(result)
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

      component = domRender(<SubmitTicketForm activeTicketForm={mockTicketForm} ticketFields={mockTicketFields} />);

      formElements = component.refs.formWrapper.children;
    });

    it('renders the name field', () => {
      const nameField = formElements[1].firstChild; // first field in form

      expect(nameField.innerHTML)
        .toBe('embeddable_framework.submitTicket.field.name.label');
    });

    it('renders the email field', () => {
      const emailField = formElements[2].firstChild; // second field in form

      expect(emailField.innerHTML)
        .toBe('embeddable_framework.form.field.email.label');
    });

    it('renders the extra fields defined in the ticket form', () => {
      expect(formElements[3].getAttribute('name'))
        .toBe('1');
      expect(formElements[4].getAttribute('name'))
        .toBe('2');
      expect(formElements[5].getAttribute('name'))
        .toBe('4');
    });

    it('does not render any fields not defined in the ticket form', () => {
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

  describe('handleSubmit', () => {
    let mockPreventDefault, mockPreviewEnabled, submitTicketForm;

    beforeEach(() => {
      submitTicketForm = domRender(<SubmitTicketForm submit={onSubmit} previewEnabled={mockPreviewEnabled} />);

      mockPreventDefault = jasmine.createSpy('preventDefault');
    });

    describe('when the preview is enabled', () => {
      beforeAll(() => {
        mockPreviewEnabled = true;
      });

      beforeEach(() => {
        submitTicketForm.refs.form.checkValidity = () => true;

        submitTicketForm.setState({ isValid: true });
        submitTicketForm.handleSubmit({ preventDefault: mockPreventDefault });
      });

      it('calls preventDefault', () => {
        expect(mockPreventDefault)
          .toHaveBeenCalled();
      });

      it('does not change the button label', () => {
        expect(submitTicketForm.state.buttonMessage)
          .toBe('embeddable_framework.submitTicket.form.submitButton.label.send');

        expect(submitTicketForm.state.isSubmitting)
          .toBe(false);
      });

      it('does not call props.submit', () => {
        expect(onSubmit)
          .not.toHaveBeenCalled();
      });
    });

    describe('when the form is invalid', () => {
      beforeAll(() => {
        mockPreviewEnabled = false;
      });

      beforeEach(() => {
        submitTicketForm.setState({ isValid: false });
        submitTicketForm.handleSubmit({ preventDefault: mockPreventDefault });
      });

      it('calls preventDefault', () => {
        expect(mockPreventDefault)
          .toHaveBeenCalled();
      });

      it('does not call props.submit', () => {
        expect(onSubmit)
          .not.toHaveBeenCalled();
      });

      it('sets showErrors to true', () => {
        expect(submitTicketForm.state.showErrors)
          .toEqual(true);
      });
    });
  });

  describe('renderErrorMessage', () => {
    let submitTicketForm, error;

    beforeEach(() => {
      submitTicketForm = instanceRender(<SubmitTicketForm />);
    });

    describe('when shouldRenderErrorMessages is true', () => {
      beforeEach(() => {
        mockShouldRenderErrorMessage = true;
        error = submitTicketForm.renderErrorMessage();
      });

      it('returns the garden error message component', () => {
        expect(TestUtils.isElementOfType(error, Message))
          .toEqual(true);
      });
    });

    describe('when shouldRenderErrorMessages is false', () => {
      beforeEach(() => {
        mockShouldRenderErrorMessage = false;
        error = submitTicketForm.renderErrorMessage();
      });

      it('returns null', () => {
        expect(error)
          .toEqual(null);
      });
    });
  });

  describe('isPrefillValid', () => {
    let submitTicketForm;

    beforeEach(() => {
      submitTicketForm = domRender(<SubmitTicketForm />);
    });

    describe('when given a value that is not an array of items', () => {
      it('returns false', () => {
        const subjects = [false, 1, 'Brenda', new Date(), { id: 123, prefill: '' }, []];

        subjects.forEach((subject) => {
          expect(submitTicketForm.isPrefillValid(subject))
            .toEqual(false);
        });
      });
    });

    describe('when given an array of items', () => {
      it('returns true', () => {
        expect(submitTicketForm.isPrefillValid([1,2,3]))
          .toEqual(true);
      });
    });
  });

  describe('mergePrefill', () => {
    let submitTicketForm;

    const mockPrefillTicketForm = [
      { id: 'name', prefill: { 'en-GB': 'Lanselot' } },
      { id: 'subject', prefill: { 'en-GB': 'Nybeth' } },
      { id: 9465549, prefill: { 'en-GB': 'Versalia' } },
      { id: 1238743, prefill: { 'en-GB': 'Canopus' } },
      { id: '3287425', prefill: { 'en-GB': 'Mannaflora' } },
      { id: '1872364', prefill: { 'en-GB': 'Voltare' } }
    ];
    const mockPrefillFields = [
      { id: 'email', prefill: { 'en-GB': 'Cressidia' } },
      { id: '2387462', prefill: { 'en-GB': 'Ravness' } },
      { id: '1872364', prefill: { 'en-GB': 'Andoras' } },
      { id: 3287425, prefill: { 'en-GB': 'Catiua' } }
    ];

    beforeEach(() => {
      submitTicketForm = domRender(<SubmitTicketForm />);
    });

    describe('when both pre-fill form and field is given', () => {
      const mockPrefillTicketForm = [
        { id: 123, prefill: { '*': 'Adrian' } },
        { id: '456', prefill: { '*': 'Anthony' } },
        { id: 789, prefill: { '*': 'Dan' } }
      ];

      describe('with existing ids in both data sets', () => {
        it('does not overwrite pre-fill field data', () => {
          const mockPrefillFields = [
            { id: 123, prefill: { '*': 'Bobdrian' } },
            { id: '456', prefill: { '*': 'Anthony the artist' } }
          ];
          const result = submitTicketForm.mergePrefill(mockPrefillTicketForm, mockPrefillFields);

          expect(result)
            .toEqual(mockPrefillTicketForm);
        });
      });

      describe('with non-existing ids in both data sets', () => {
        it('merges pre-fill field data that is missing', () => {
          const mockPrefillFields = [
            { id: 123, prefill: { '*': 'Terence' } },
            { id: '2983745', prefill: { '*': 'Mike' } },
            { id: 5873874, prefill: { '*': 'Brieannah' } }
          ];
          const expectation = [
            { id: 123, prefill: { '*': 'Adrian' } },
            { id: '456', prefill: { '*': 'Anthony' } },
            { id: 789, prefill: { '*': 'Dan' } },
            { id: '2983745', prefill: { '*': 'Mike' } },
            { id: 5873874, prefill: { '*': 'Brieannah' } }
          ];
          const result = submitTicketForm.mergePrefill(mockPrefillTicketForm, mockPrefillFields);

          expect(result)
            .toEqual(expectation);
        });
      });
    });

    describe('when only pre-fill form data is given', () => {
      it('returns pre-fill form data', () => {
        const result = submitTicketForm.mergePrefill(mockPrefillTicketForm);

        expect(result)
          .toEqual(mockPrefillTicketForm);
      });
    });

    describe('when only pre-fill field data is given', () => {
      it('returns pre-fill field data', () => {
        const result = submitTicketForm.mergePrefill([], mockPrefillFields);

        expect(result)
          .toEqual(mockPrefillFields);
      });
    });

    describe('when no pre-fill data is given', () => {
      it('returns an empty array', () => {
        const result = submitTicketForm.mergePrefill();

        expect(result)
          .toEqual([]);
      });
    });
  });

  describe('filterPrefillFields', () => {
    let submitTicketForm;
    const mockTicketFields = [
      { id: 1111111, type: 'name' },
      { id: '2222222', type: 'email' },
      { id: 3333333, type: 'subject' },
      { id: '4444444', type: 'checkbox' },
      { id: 5555555, type: 'tagger' },
      { id: '6666666', type: 'integer' },
      { id: 7777777, type: 'decimal' },
      { id: '8888888', type: 'text' }
    ];

    beforeEach(() => {
      submitTicketForm = domRender(<SubmitTicketForm />);
    });

    describe('when given an empty pre-fill data', () => {
      it('returns an empty array', () => {
        const result = submitTicketForm.filterPrefillFields(mockTicketFields);

        expect(result)
          .toEqual([]);
      });
    });

    describe('when given an unexpected pre-fill field data', () => {
      const mockPrefillList = [
        'Denam Pavel',
        9001,
        new Date(),
        { 'Terence': 1234 },
        { id: 1234, 'Ezel': 'Berbier' },
        { 'Ramza': 'Beoulve', prefill: { '*': 'foo', 'en-GB': 'bar' } }
      ];

      it('returns an empty array', () => {
        mockPrefillList.forEach((prefill) => {
          const result = submitTicketForm.filterPrefillFields(mockTicketFields, prefill);
          const result2 = submitTicketForm.filterPrefillFields(mockTicketFields, [], prefill);

          expect(result)
            .toEqual([]);

          expect(result2)
            .toEqual([]);
        });
      });
    });

    describe('when pre-fill contains disallowed field types', () => {
      const mockPrefillTicketForm = {
        fields: [
          { id: 'name', prefill: { '*': 'abc', 'en-GB': 'Arycelle Dania' } },
          { id: 'email', prefill: { '*': 'def', 'en-GB': 'arycelle@dania.com' } },
          { id: '4444444', prefill: { '*': 'ghi', 'en-GB': 'Boco' } },
          { id: 5555555, prefill: { '*': 'jkl', 'en-GB': 'Luso' } },
          { id: 1234567, prefill: { '*': 'field should not', 'en-GB': 'exist' } }
        ]
      };

      it('does not pre-fill the ticket fields', () => {
        const result = submitTicketForm.filterPrefillFields(mockTicketFields, mockPrefillTicketForm);

        expect(result)
          .toEqual([]);
      });
    });

    describe('when pre-fill contains allowed field types', () => {
      const mockPrefillTicketForm = [
        { id: 'subject', prefill: { '*': 'elmo', 'en-GB': 'cookie monster' } },
        { id: '6666666', prefill: { '*': 123, 'en-GB': 1337 } },
        { id: 7777777, prefill: { '*': 324, 'en-GB': 10101001 } }
      ];

      it('returns an array of valid pre-fill objects', () => {
        const result = submitTicketForm.filterPrefillFields(mockTicketFields, mockPrefillTicketForm);

        expect(result)
          .toEqual(mockPrefillTicketForm);
      });
    });
  });

  describe('prefillFormState', () => {
    let submitTicketForm,
      mockSetFormState;

    const mockTicketForm = {
      id: 1,
      ticket_field_ids: [1111111, '2222222', 3333333, '4444444', 5555555, '6666666', 7777777, '8888888'] // eslint-disable-line camelcase
    };
    const mockTicketFields = {
      '1111111': { id: '1111111', type: 'name' },
      '2222222': { id: '2222222', type: 'email' },
      '3333333': { id: '3333333', type: 'subject' },
      '4444444': { id: '4444444', type: 'checkbox' },
      '5555555': { id: '5555555', type: 'tagger' },
      '6666666': { id: '6666666', type: 'integer' },
      '7777777': { id: '7777777', type: 'decimal' },
      '8888888': { id: '8888888', type: 'text' }
    };

    beforeEach(() => {
      mockSetFormState = jasmine.createSpy('mockSetFormState');

      submitTicketForm = domRender(
        <SubmitTicketForm
          setFormState={mockSetFormState}
          activeTicketForm={mockTicketForm}
          ticketFields={mockTicketFields} />
      );
    });

    describe('when pre-fill contains allowed field types', () => {
      const mockPrefillTicketForm = [
        { id: 'subject', prefill: { '*': 'elmo', 'en-GB': 'cookie monster' } },
        { id: 7777777, prefill: { '*': 123, 'en-GB': 1337 } },
        { id: '8888888', prefill: { '*': 324, 'en-GB': 10101001 } }
      ];

      describe('when current locale is \'en-GB\'', () => {
        const expectation = [{
          1111111: '',
          '2222222': '',
          3333333: 'cookie monster',
          '4444444': 0,
          5555555: '',
          '6666666': '',
          7777777: 1337,
          '8888888': 10101001
        }];

        it('pre-fills ticket fields in the ticket form', () => {
          submitTicketForm.prefillFormState(mockTicketFields, mockPrefillTicketForm);

          expect(mockSetFormState.calls.mostRecent().args)
            .toEqual(expectation);
        });
      });

      describe('when current locale is \'*\' (fallback locale)', () => {
        const expectation = [{
          1111111: '',
          '2222222': '',
          3333333: 'elmo',
          '4444444': 0,
          5555555: '',
          '6666666': '',
          7777777: 123,
          '8888888': 324
        }];

        it('pre-fills ticket fields in the ticket form', () => {
          mockRegistry['service/i18n'].i18n.getLocale = () => '*';

          submitTicketForm.prefillFormState(mockTicketFields, mockPrefillTicketForm);

          expect(mockSetFormState.calls.mostRecent().args)
            .toEqual(expectation);
        });
      });

      describe('when the fields do not contain description', () => {
        const mockPrefill = [
          { id: 7777777, prefill: { '*': 123, 'en-GB': 1337 } },
          { id: 'description', prefill: { '*': 'my prefill' } }
        ];

        it('still pre-fills description if it is passed in', () => {
          submitTicketForm.prefillFormState(mockTicketFields, [], mockPrefill);

          expect(mockSetFormState.calls.mostRecent().args[0])
            .toEqual(jasmine.objectContaining({ description: 'my prefill' }));
        });
      });
    });
  });
});
