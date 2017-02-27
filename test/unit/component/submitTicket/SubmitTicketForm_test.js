describe('SubmitTicketForm component', () => {
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

  beforeEach(() => {
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

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should display form title', () => {
    domRender(<SubmitTicketForm formTitleKey='testTitle' />);

    expect(document.getElementById('formTitle').innerHTML)
      .toEqual('embeddable_framework.submitTicket.form.title.testTitle');
  });

  it('should call i18n.t with the right parameter to set the form title', () => {
    const titleKey = 'foo bar';

    spyOn(mockRegistry['service/i18n'].i18n, 't').and.callThrough();

    domRender(<SubmitTicketForm formTitleKey={titleKey} />);

    expect(mockRegistry['service/i18n'].i18n.t)
      .toHaveBeenCalledWith(`embeddable_framework.submitTicket.form.title.${titleKey}`);
  });

  it('should correctly render form with noValidate attribute', () => {
    const submitTicketForm = domRender(<SubmitTicketForm />);

    expect(ReactDOM.findDOMNode(submitTicketForm).getAttribute('novalidate'))
      .toEqual('');
  });

  it('should change state and alter submit button on valid submit', () => {
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

  it('should disable submit button when attachments not ready', () => {
    const submitTicketForm = domRender(<SubmitTicketForm submit={onSubmit} attachmentsEnabled={true} />);
    const submitTicketFormNode = ReactDOM.findDOMNode(submitTicketForm);
    const submitElem = submitTicketFormNode.querySelector('input[type="submit"]');

    submitTicketForm.refs.form.checkValidity = () => true;
    mockAttachmentsReadyValue = false;

    submitTicketForm.updateForm();

    expect(submitElem.disabled)
      .toEqual(true);
  });

  describe('ButtonSecondary', () => {
    it('should be rendered in the form when fullscreen is false', () => {
      const submitTicketForm = domRender(<SubmitTicketForm fullscreen={false} />);

      expect(() => {
        TestUtils.findRenderedDOMComponentWithClass(submitTicketForm, 'c-btn--secondary');
      }).not.toThrow();
    });

    it('should not be rendered in the form when fullscreen is true', () => {
      const submitTicketForm = domRender(<SubmitTicketForm fullscreen={true} />);

      expect(() => {
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

  describe('isPrefillValid', () => {
    let submitTicketForm;

    beforeEach(() => {
      submitTicketForm = domRender(<SubmitTicketForm />);
    });

    describe('when given a value that is not an array of items', () => {
      it('should return false', () => {
        const subjects = [false, 1, 'Brenda', new Date(), { id: 123, prefill: '' }, []];

        subjects.forEach((subject) => {
          expect(submitTicketForm.isPrefillValid(subject))
            .toEqual(false);
        });
      });
    });

    describe('when given an array of items', () => {
      it('should return true', () => {
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
        it('should not overwrite pre-fill field data', () => {
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
        it('should merge pre-fill field data that is missing', () => {
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
      it('should return an empty array', () => {
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

      it('should return an empty array', () => {
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

      it('should not pre-fill the ticket fields', () => {
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

      it('should return an array of valid pre-fill objects', () => {
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
      mockSetFormState = jasmine.createSpy('mockSetFormState');

      submitTicketForm = domRender(
        <SubmitTicketForm
          setFormState={mockSetFormState}
          formState={mockFormState} />
      );
      submitTicketForm.updateTicketForm(mockTicketForm, mockTicketFields);
    });

    describe('when pre-fill contains allowed field types', () => {
      const mockPrefillTicketForm = [
        { id: 'subject', prefill: { '*': 'elmo', 'en-GB': 'cookie monster' } },
        { id: 7777777, prefill: { '*': 123, 'en-GB': 1337 } },
        { id: '8888888', prefill: { '*': 324, 'en-GB': 10101001 } }
      ];

      describe(`when current locale is 'en-GB'`, () => {
        const expectation = [{
          1111111: '',
          '2222222': '',
          3333333: 'cookie monster',
          '4444444': 0,
          5555555: '',
          '6666666': '',
          7777777: 1337,
          '8888888': 10101001,
          name: '',
          email: ''
        }];

        it('should pre-fill ticket fields in the ticket form', () => {
          submitTicketForm.prefillFormState(mockTicketFields, mockPrefillTicketForm);

          expect(mockSetFormState.calls.mostRecent().args)
            .toEqual(expectation);
        });
      });

      describe(`when current locale is '*' (fallback locale)`, () => {
        const expectation = [{
          1111111: '',
          '2222222': '',
          3333333: 'elmo',
          '4444444': 0,
          5555555: '',
          '6666666': '',
          7777777: 123,
          '8888888': 324,
          name: '',
          email: ''
        }];

        it('should pre-fill ticket fields in the ticket form', () => {
          mockRegistry['service/i18n'].i18n.getLocale = () => '*';

          submitTicketForm.prefillFormState(mockTicketFields, mockPrefillTicketForm);

          expect(mockSetFormState.calls.mostRecent().args)
            .toEqual(expectation);
        });
      });
    });
  });
});
