describe('Submit ticket component', () => {
  let SubmitTicket,
    mockStoreValue,
    mockIsIEValue,
    mockIsMobileBrowserValue,
    mockUpdateContactForm;

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
  const payload = {
    method: 'post',
    path: '/requests/embedded/create',
    params: formParams,
    callbacks: {
      done: noop,
      fail: noop
    }
  };
  const submitTicketPath = buildSrcPath('component/submitTicket/SubmitTicket');

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

    jasmine.addMatchers({
      toBeJSONEqual: function(util, customEqualityTesters) {
        return {
          compare: function(actual, expected) {
            const result = {};

            result.pass = util.equals(
              JSON.stringify(actual),
              JSON.stringify(expected),
              customEqualityTesters
            );
            return result;
          }
        };
      }
    });

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
          loadingSpinner: 'loadingSpinnerClasses'
        }
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
          updateContactForm = mockUpdateContactForm
          updateTicketForm() {}
          render() {
            return (
              <form ref='submitTicketForm'>
                <MockAttachmentList ref='attachments' />
              </form>
            );
          }
        },
        MessageFieldset: noop,
        EmailField: noop
      },
      'component/field/SelectField': {
        SelectField: noopReactComponent()
      },
      'component/ZendeskLogo': {
        ZendeskLogo: noopReactComponent()
      },
      'component/button/Button': {
        Button: noopReactComponent()
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

  it('should correctly set the initial states when created', () => {
    const submitTicket = instanceRender(<SubmitTicket />);

    expect(submitTicket.state.showNotification)
      .toEqual(false);

    expect(submitTicket.state.message)
      .toEqual('');
  });

  describe('submitTicketSender', () => {
    let submitTicket,
      mockSubmitTicketSender,
      mockOnSubmitted,
      mockValues;

    beforeEach(() => {
      mockSubmitTicketSender = jasmine.createSpy('mockSubmitTicketSender');
      mockOnSubmitted = jasmine.createSpy('mockOnSubmitted');
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
          submitTicketSender={mockSubmitTicketSender}
          onSubmitted={mockOnSubmitted}
          updateFrameSize={noop} />
      );
    });

    describe('when the form is invalid', () => {
      beforeEach(() => {
        mockValues.isFormValid = false;
        submitTicket.handleSubmit({ preventDefault: noop }, mockValues);
      });

      it('should not send the form', () => {
        expect(mockSubmitTicketSender)
          .not.toHaveBeenCalled();
      });
    });

    describe('when the form is valid', () => {
      let params,
        mockOnSubmitted;

      beforeEach(() => {
        spyOn(submitTicket, 'clearForm');

        mockOnSubmitted = jasmine.createSpy('mockOnSubmitted');

        submitTicket = domRender(
          <SubmitTicket
            submitTicketSender={mockSubmitTicketSender}
            attachmentsEnabled={true}
            onSubmitted={mockOnSubmitted}
            updateFrameSize={noop}
            tags={['extra_tag']}
            viaId={48}
            searchTerm='a search' />
        );

        submitTicket.handleSubmit({ preventDefault: noop }, mockValues);

        params = mockSubmitTicketSender.calls.mostRecent().args[0];
      });

      it('should clear the form on a valid submit', () => {
        mockSubmitTicketSender.calls.mostRecent().args[1]({});

        expect(submitTicket.clearForm)
          .toHaveBeenCalled();
      });

      it('should call onSubmitted with given last search state', () => {
        submitTicket.setState({
          searchLocale: 'en-US'
        });

        submitTicket.handleSubmit({ preventDefault: noop }, mockValues);

        mockSubmitTicketSender.calls.mostRecent().args[1]({});

        expect(mockOnSubmitted)
          .toHaveBeenCalled();

        expect(mockOnSubmitted.calls.mostRecent().args[0].searchTerm)
          .toEqual('a search');

        expect(mockOnSubmitted.calls.mostRecent().args[0].searchLocale)
          .toEqual('en-US');
      });

      it('wraps the data in a request object', () => {
        expect(params.request)
          .toBeTruthy();
      });

      it('formats the requester correctly', () => {
        expect(params.request.requester)
          .toBeJSONEqual({
            'name': formParams.name,
            'email': formParams.email,
            'locale_id': formParams.locale_id
          });
      });

      describe('when name field is empty', () => {
        const values = [
          {
            email: 'harry.j.potter@hogwarts.com',
            expected: 'Harry J Potter'
          },
          {
            email: 'ron_b.weasley@hogwarts.com',
            expected: 'Ron B Weasley'
          },
          {
            email: 'hermione_granger@hogwarts.com',
            expected: 'Hermione Granger'
          },
          {
            email: 'dracomalfoy@hogwarts.com',
            expected: 'Dracomalfoy'
          }
        ];

        const testNames = (email, expected) => {
          it(`formats the name correct based on the email ${email}`, () => {
            mockValues.value.name = '';
            mockValues.value.email = email;
            submitTicket.handleSubmit({ preventDefault: noop }, mockValues);
            params = mockSubmitTicketSender.calls.mostRecent().args[0];

            expect(params.request.requester.name)
              .toEqual(expected);
          });
        };

        _.forEach(values, (value) => {
          testNames(value.email, value.expected);
        });
      });

      it('uses the description as the subject', () => {
        expect(params.request.subject)
          .toEqual(formParams.description);
      });

      it('trims the subject if it is too long', () => {
        mockValues.value.description = 'this text is longer then 50 characters xxxxxxxxxxxx';
        submitTicket.handleSubmit({ preventDefault: noop }, mockValues);

        params = mockSubmitTicketSender.calls.mostRecent().args[0];

        expect(params.request.subject)
          .toEqual('this text is longer then 50 characters xxxxxxxxxxx...');
      });

      describe('when stores referrerPolicy is false', () => {
        it('adds submitted from to the description', () => {
          const label = 'embeddable_framework.submitTicket.form.submittedFrom.label';

          expect(params.request.comment.body)
            .toBe(`${payload.params.description}\n\n------------------\n${label}`);
        });
      });

      describe('when stores referrerPolicy is true', () => {
        it('adds submitted from to the description', () => {
          mockStoreValue = true;

          submitTicket.handleSubmit({ preventDefault: noop }, mockValues);

          params = mockSubmitTicketSender.calls.mostRecent().args[0];

          expect(params.request.comment.body)
            .toBe(payload.params.description);
        });
      });

      describe('when the form has custom ticket fields', () => {
        beforeEach(() => {
          const mockCustomField = [
            {
              id: '22660514',
              type: 'text',
              title: 'Text',
              required: true
            }
          ];

          mockValues.value['22660514'] = 'mockCustomField';

          submitTicket = instanceRender(<SubmitTicket ticketFields={mockCustomField} />);
          params = submitTicket.formatTicketFieldData(mockValues);
        });

        it('should correctly format custom fields', () => {
          expect(params.fields['22660514'])
            .toBe('mockCustomField');
        });
      });

      describe('when the form is a user ticket form', () => {
        let mockTicketForm,
          ticketFields;

        beforeEach(() => {
          ticketFields = [
            {
              id: 1,
              type: 'description',
              removable: false
            },
            {
              id: 4,
              type: 'text',
              removable: true
            }
          ];
          mockTicketForm = [
            {
              id: 50,
              ticket_field_ids: [ 1, 2, 4 ]
            }
          ];

          mockValues = {
            isFormValid: true,
            value: {
              email: formParams.email,
              name: formParams.name,
              1: 'Just saying Hi',
              2: 'Hello',
              4: 'Cheeseburger'
            }
          };

          submitTicket = domRender(
            <SubmitTicket
              ticketFields={ticketFields}
              ticketForms={mockTicketForm}
              activeTicketForm={mockTicketForm[0]} />
          );

          params = submitTicket.formatRequestTicketData(mockValues);
        });

        it('should correctly format custom fields', () => {
          expect(params.request.fields[4])
            .toBe('Cheeseburger');
        });

        describe('when subject field is not available', () => {
          it('uses the description as the subject', () => {
            expect(params.request.subject)
              .toBe('Just saying Hi');
          });
        });

        describe('when the subject field is available', () => {
          beforeEach(() => {
            ticketFields.push({ id: 2, type: 'subject', removable: false });

            submitTicket = domRender(
              <SubmitTicket
                ticketFields={ticketFields}
                ticketForms={mockTicketForm}
                activeTicketForm={mockTicketForm[0]} />
            );
            params = submitTicket.formatRequestTicketData(mockValues);
          });

          it('should correctly format the subject field', () => {
            expect(params.request.fields[2])
              .not.toBe('Hello');

            expect(params.request.subject)
              .toBe('Hello');
          });
        });

        it('should correctly format the description field', () => {
          expect(params.request.fields[1])
            .not.toBe('Just saying Hi');

          expect(params.request.comment.body)
            .toContain('Just saying Hi');
        });

        it('should send through the ticket_form_id', () => {
          expect(params.request.ticket_form_id)
            .toBe(50);
        });
      });

      describe('when the subject field is available', () => {
        beforeEach(() => {
          submitTicket = domRender(
            <SubmitTicket
              submitTicketSender={mockSubmitTicketSender}
              attachmentsEnabled={true}
              subjectEnabled={true} />
          );

          submitTicket.handleSubmit({ preventDefault: noop }, mockValues);
          params = mockSubmitTicketSender.calls.mostRecent().args[0];
        });

        describe('when the field is empty', () => {
          it('uses the description as the subject', () => {
            mockValues.value.subject = '';

            submitTicket.handleSubmit({ preventDefault: noop }, mockValues);
            params = mockSubmitTicketSender.calls.mostRecent().args[0];

            expect(params.request.subject)
              .toEqual(formParams.description);
          });
        });

        describe('when the field is not empty', () => {
          it('uses the subject fields value', () => {
            expect(params.request.subject)
              .toEqual(formParams.subject);
          });
        });
      });

      it('gets the attachments from AttachmentList', () => {
        expect(params.request.comment.uploads)
          .toEqual(['12345']);
      });

      it('Adds the correct tag', () => {
        expect(params.request.tags)
          .toContain('web_widget');
      });

      it('adds any extra tags', () => {
        expect(params.request.tags)
          .toContain('extra_tag');
      });

      it('Adds the correct via_id', () => {
        /* eslint camelcase:0 */
        expect(params.request.via_id)
          .toEqual(48);
      });

      describe('when there is a successful response', () => {
        beforeEach(() => {
          submitTicket.setState({
            searchTerm: 'a search',
            searchLocale: 'en-US'
          });

          submitTicket.handleSubmit({ preventDefault: noop }, mockValues);
          mockSubmitTicketSender.calls.mostRecent().args[1]({});

          expect(mockOnSubmitted)
            .toHaveBeenCalled();
        });

        it('should call onSubmitted with given last search', () => {
          expect(mockOnSubmitted.calls.mostRecent().args[0].searchTerm)
            .toEqual('a search');

          expect(mockOnSubmitted.calls.mostRecent().args[0].searchLocale)
            .toEqual('en-US');
        });

        it('should call onSubmitted with the attachments list state', () => {
          expect(mockOnSubmitted.calls.mostRecent().args[0].attachmentsCount)
            .toEqual(2);

          expect(mockOnSubmitted.calls.mostRecent().args[0].attachmentTypes)
            .toEqual(['image/png', 'application/octet-stream']);
        });

        it('should call clearForm', () => {
          expect(submitTicket.clearForm)
            .toHaveBeenCalled();
        });
      });
    });
  });

  it('should unhide notification element on state change', () => {
    const submitTicket = domRender(<SubmitTicket />);

    expect(submitTicket.refs.notification)
      .toBeFalsy();

    submitTicket.setState({ showNotification: true });

    expect(submitTicket.refs.notification)
      .toBeTruthy();
  });

  describe('ticket forms list', () => {
    let submitTicket;

    it('should not be rendered by default', () => {
      submitTicket = domRender(<SubmitTicket />);

      expect(submitTicket.refs.ticketFormSelector)
        .toBeUndefined();
    });

    it('should not be rendered if the form is loading', () => {
      const ticketForms = [{ id: 1 }];

      submitTicket = domRender(<SubmitTicket ticketForms={ticketForms} loading={true} />);

      expect(submitTicket.refs.ticketFormSelector)
        .toBeUndefined();
    });

    it('should be rendered when there is more then one ticket form', () => {
      const ticketForms = [{ id: 1 }, { id: 2 }];

      submitTicket = domRender(<SubmitTicket ticketForms={ticketForms} />);

      expect(submitTicket.refs.ticketFormSelector)
        .toBeDefined();
    });

    it('should render the correct number of list options', () => {
      const ticketForms = [{ id: 1 }, { id: 2 }, { id: 3 }];

      submitTicket = domRender(<SubmitTicket ticketForms={ticketForms} />);

      expect(submitTicket.renderTicketFormOptions().length)
        .toBe(3);
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
      const getFrameDimensions = () => { return { height: 500, width: 250 };};
      const submitTicket = domRender(
        <SubmitTicket attachmentsEnabled={true} getFrameDimensions={getFrameDimensions} />
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

  describe('updateContactForm', () => {
    let submitTicket;
    const ticketFieldSettings = [
      { id: 'description', prefill: { '*': 'Yukihira Souma' } },
      { id: 12345678, prefill: { '*': 'Nakiri Erina' } }
    ];

    beforeEach(() => {
      mockUpdateContactForm = jasmine.createSpy('updateContactForm');
      submitTicket = domRender(<SubmitTicket ticketFieldSettings={ticketFieldSettings} />);
    });

    it('should invoke updateContactForm with ticket field settings', () => {
      submitTicket.updateContactForm();

      expect(mockUpdateContactForm.calls.mostRecent().args[0])
        .toEqual(ticketFieldSettings);
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
          <SubmitTicket ticketForms={mockTicketForms} handleTicketFormClick={handleTicketFormClickSpy} />
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
        submitTicket = domRender(<SubmitTicket ticketForms={mockTicketForms} handleTicketFormClick={handleTicketFormClickSpy} />);

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
        submitTicket = domRender(<SubmitTicket showBackButton={mockShowBackButton} ticketForms={ticketForms} />);
      });

      it('calls showBackButton', () => {
        submitTicket.setTicketForm(123);

        expect(mockShowBackButton)
          .toHaveBeenCalled();
      });
    });
  });

  describe('updateTicketFields', () => {
    let submitTicket;

    beforeEach(() => {
      submitTicket = domRender(<SubmitTicket />);
      spyOn(submitTicket, 'updateContactForm');
      submitTicket.updateTicketFields({});
    });

    it('should call updateContactForm', () => {
      expect(submitTicket.updateContactForm)
        .toHaveBeenCalled();
    });
  });
});
