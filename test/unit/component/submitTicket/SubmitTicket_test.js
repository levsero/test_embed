describe('Submit ticket component', () => {
  let SubmitTicket,
    mockIsIEValue,
    mockIsMobileBrowserValue;

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
  const MockAttachmentList = React.createClass({
    getAttachmentTokens: () => ['12345'],
    numUploadedAttachments: () => 2,
    uploadedAttachments: () => {
      return [
        { file: { type: 'image/png' } },
        { file: { type: '' } } // Unrecognised MIME type
      ];
    },
    render: () => <div />
  });
  const submitTicketPath = buildSrcPath('component/submitTicket/SubmitTicket');

  beforeEach(() => {
    resetDOM();

    mockIsMobileBrowserValue = false;
    mockIsIEValue = false;

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
      './SubmitTicket.sass': {
        locals: {
          loadingSpinnerIE: 'loadingSpinnerIEClasses',
          loadingSpinner: 'loadingSpinnerClasses'
        }
      },
      'component/submitTicket/SubmitTicketForm': {
        SubmitTicketForm: React.createClass({
          getInitialState: function() {
            return {
              formState: {}
            };
          },
          clear: noop,
          updateTicketForm: noop,
          render: function() {
            return (
              <form ref='submitTicketForm'>
                <MockAttachmentList ref='attachments' />
              </form>
            );
          }
        }),
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
      'component/Container': {
        Container: React.createClass({
          render: function() {
            return <div>{this.props.children}</div>;
          }
        })
      },
      'component/ScrollContainer': {
        ScrollContainer: React.createClass({
          render: function() {
            return <div>{this.props.children}</div>;
          }
        })
      },
      'component/attachment/AttachmentBox': {
        AttachmentBox: React.createClass({
          render: function() {
            return <div className='attachment_box' />;
          }
        })
      },
      'service/i18n': {
        i18n: {
          init: noop,
          setLocale: noop,
          getLocaleId : () => 'fr',
          isRTL: noop,
          t: _.identity
        }
      },
      'service/settings': {
        settings: {
          get: () => 48
        }
      },
      'component/Icon': {
        Icon: noopReactComponent()
      },
      'utility/utils': {
        bindMethods: mockBindMethods
      },
      'lodash': _
    });

    mockery.registerAllowable(submitTicketPath);

    SubmitTicket = requireUncached(submitTicketPath).SubmitTicket;
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
            updateFrameSize={noop} />
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
          searchTerm: 'a search',
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

      it('adds submitted from to the description', () => {
        const label = 'embeddable_framework.submitTicket.form.submittedFrom.label';

        expect(params.request.comment.body)
          .toBe(`${payload.params.description}\n\n------------------\n${label}`);
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

          submitTicket = instanceRender(<SubmitTicket customFields={mockCustomField} />);
          params = submitTicket.formatTicketFieldData(mockValues);
        });

        it('should correctly format custom fields', () => {
          expect(params.fields['22660514'])
            .toBe('mockCustomField');
        });
      });

      describe('when the form is a user ticket form', () => {
        beforeEach(() => {
          const mockTicketFormParams = {
            ticket_forms: [
              {
                id: 50,
                ticket_field_ids: [ 1, 2, 4 ]
              }
            ],
            ticket_fields: [
              {
                id: 1,
                raw_title: 'Description',
                removable: false
              },
              {
                id: 2,
                raw_title: 'Subject',
                removable: false
              },
              {
                id: 4,
                raw_title: 'Favorite Burger',
                removable: true
              }
            ]
          };

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

          submitTicket = domRender(<SubmitTicket />);

          submitTicket.updateTicketForms(mockTicketFormParams);
          submitTicket.setState({ selectedTicketForm: mockTicketFormParams.ticket_forms[0].id });
          params = submitTicket.formatRequestTicketData(mockValues);
        });

        it('should correctly format custom fields', () => {
          expect(params.request.fields[4])
            .toBe('Cheeseburger');
        });

        it('should correctly format the subject field', () => {
          expect(params.request.fields[2])
            .not.toBe('Hello');

          expect(params.request.subject)
            .toBe('Hello');
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
          .toEqual(['web_widget']);
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

    beforeEach(() => {
      submitTicket = domRender(<SubmitTicket />);
    });

    it('should not be rendered by default', () => {
      expect(submitTicket.refs.ticketFormSelector)
        .toBeUndefined();
    });

    it('should not be rendered if the form is loading', () => {
      submitTicket.setState({ loading: true });
      submitTicket.updateTicketForms({ ticket_forms: [{ id: 1 }], ticket_fields: [] });

      expect(submitTicket.refs.ticketFormSelector)
        .toBeUndefined();
    });

    it('should not be rendered when there is only one ticket form', () => {
      submitTicket.updateTicketForms({ ticket_forms: [{ id: 1 }], ticket_fields: [] });

      expect(submitTicket.refs.ticketFormSelector)
        .toBeUndefined();
    });

    it('should be rendered when there is more then one ticket form', () => {
      submitTicket.updateTicketForms({ ticket_forms: [1, 2], ticket_fields: [] });

      expect(submitTicket.refs.ticketFormSelector)
        .toBeDefined();
    });

    it('should render the correct number of list options', () => {
      const ticketForms = { ticket_forms: [{ id: 1 }, { id: 2 }, { id: 3 }], ticket_fields: [] };

      submitTicket.updateTicketForms(ticketForms);

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

    it('should not be rendered by default', () => {
      expect(submitTicketNode.querySelectorAll('.loadingSpinnerClasses').length)
        .toEqual(0);
    });

    it('should be rendered when loading state is true', () => {
      submitTicket.setState({ loading: true });

      expect(submitTicketNode.querySelectorAll('.loadingSpinnerClasses').length)
        .toEqual(1);
    });

    it('should not have extra padding by default', () => {
      submitTicket.setState({ loading: true });

      expect(submitTicketNode.querySelectorAll('.loadingSpinnerIEClasses').length)
        .toEqual(0);
    });

    it('should have extra padding on IE', () => {
      mockIsIEValue = true;
      submitTicket = domRender(<SubmitTicket />);
      submitTicketNode = ReactDOM.findDOMNode(submitTicket);
      submitTicket.setState({ loading: true });

      expect(submitTicketNode.querySelectorAll('.loadingSpinnerIEClasses').length)
        .toEqual(1);
    });
  });

  describe('fullscreen state', () => {
    it('should be true if isMobileBrowser() is true', () => {
      mockIsMobileBrowserValue = true;

      const submitTicket = instanceRender(<SubmitTicket />);

      expect(submitTicket.state.fullscreen)
        .toEqual(true);
    });

    it('should be false if isMobileBrowser() is false', () => {
      mockIsMobileBrowserValue = false;

      const submitTicket = instanceRender(<SubmitTicket />);

      expect(submitTicket.state.fullscreen)
        .toEqual(false);
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
      const submitTicket = domRender(<SubmitTicket attachmentsEnabled={true} />);

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
});
