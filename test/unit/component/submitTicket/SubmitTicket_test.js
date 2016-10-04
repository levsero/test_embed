describe('Submit ticket component', function() {
  let SubmitTicket,
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

  beforeEach(function() {
    resetDOM();

    mockIsMobileBrowserValue = false;

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
        getZoomSizingRatio: function() {
          return 1;
        },
        isMobileBrowser: function() {
          return mockIsMobileBrowserValue;
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
      'component/ZendeskLogo': {
        ZendeskLogo: noopReactComponent()
      },
      'component/button/Button': {
        Button: noopReactComponent()
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

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should correctly set the initial states when created', function() {
    const submitTicket = instanceRender(<SubmitTicket />);

    expect(submitTicket.state.showNotification)
      .toEqual(false);

    expect(submitTicket.state.message)
      .toEqual('');
  });

  describe('submitTicketSender', function() {
    let submitTicket,
      mockSubmitTicketSender,
      mockOnSubmitted,
      mockValues;

    beforeEach(function() {
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

    it('should not send the form when invalid', function() {
      submitTicket.handleSubmit({ preventDefault: noop }, { isFormValid: false });

      expect(mockSubmitTicketSender)
        .not.toHaveBeenCalled();
    });

    it('should send the form when valid', function() {
      submitTicket.handleSubmit({ preventDefault: noop }, mockValues);

      expect(mockSubmitTicketSender)
        .toHaveBeenCalled();

      const params = mockSubmitTicketSender.calls.mostRecent().args[0];
      const expected = _.omit(payload.params, 'subject');

      expect(params)
        .toBeJSONEqual(expected);

      mockSubmitTicketSender.calls.mostRecent().args[1]({});

      expect(mockOnSubmitted)
        .toHaveBeenCalled();
    });

    it('should clear the form on a valid submit', function() {
      spyOn(submitTicket, 'clearForm');

      submitTicket.handleSubmit({ preventDefault: noop }, mockValues);

      mockSubmitTicketSender.calls.mostRecent().args[1]({});

      expect(submitTicket.clearForm)
        .toHaveBeenCalled();
    });

    it('should call onSubmitted with given last search state', function() {
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

    it('should correctly format custom fields', function() {
      const mockCustomField = [
        {
          id: '22660514',
          type: 'text',
          title: 'Text',
          required: true
        }
      ];
      const mockValues = {
        value: {
          22660514: 'mockCustomField',
          name: 'mockName',
          description: 'mockDescription'
        }
      };
      const expectedPayload = {
        fields: {
          22660514: 'mockCustomField'
        }
      };

      const submitTicket = instanceRender(<SubmitTicket customFields={mockCustomField} />);
      const payload = submitTicket.formatTicketFieldData(mockValues);

      expect(payload)
        .toBeJSONEqual(expectedPayload);
    });

    describe('when attachments are enabled', function() {
      let params,
        mockOnSubmitted;

      beforeEach(function() {
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

      it('wraps the data in a request object', function() {
        expect(params.request)
          .toBeTruthy();
      });

      it('formats the requester correctly', function() {
        expect(params.request.requester)
          .toBeJSONEqual({
            'name': formParams.name,
            'email': formParams.email,
            'locale_id': formParams.locale_id
          });
      });

      it('uses the description as the subject', function() {
        expect(params.request.subject)
          .toEqual(formParams.description);
      });

      it('trims the subject if it is too long', function() {
        mockValues.value.description = 'this text is longer then 50 characters xxxxxxxxxxxx';
        submitTicket.handleSubmit({ preventDefault: noop }, mockValues);

        params = mockSubmitTicketSender.calls.mostRecent().args[0];

        expect(params.request.subject)
          .toEqual('this text is longer then 50 characters xxxxxxxxxxx...');
      });

      it('adds submitted from to the description', function() {
        const label = 'embeddable_framework.submitTicket.form.submittedFrom.label';

        expect(params.request.comment.body)
          .toBe(`${payload.params.description}\n\n------------------\n${label}`);
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

      it('gets the attachments from AttachmentList', function() {
        expect(params.request.comment.uploads)
          .toEqual(['12345']);
      });

      it('Adds the correct tag', function() {
        expect(params.request.tags)
          .toEqual(['web_widget']);
      });

      it('Adds the correct via_id', function() {
        /* eslint camelcase:0 */
        expect(params.request.via_id)
          .toEqual(48);
      });

      describe('when there is a successful response', () => {
        beforeEach(() => {
          spyOn(submitTicket, 'clearForm');
          submitTicket.setState({
            searchTerm: 'a search',
            searchLocale: 'en-US'
          });

          submitTicket.handleSubmit({ preventDefault: noop }, mockValues);
          mockSubmitTicketSender.calls.mostRecent().args[1]({});

          expect(mockOnSubmitted)
            .toHaveBeenCalled();
        });

        it('should call onSubmitted with given last search', function() {
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

  it('should unhide notification element on state change', function() {
    const submitTicket = domRender(<SubmitTicket />);
    const notificationElem = submitTicket.refs.notification;

    expect(notificationElem.props.className)
      .toContain('u-isHidden');

    submitTicket.setState({showNotification: true});

    expect(notificationElem.props.className)
      .not.toContain('u-isHidden');
  });

  describe('fullscreen state', function() {
    it('should be true if isMobileBrowser() is true', function() {
      mockIsMobileBrowserValue = true;

      const submitTicket = instanceRender(<SubmitTicket />);

      expect(submitTicket.state.fullscreen)
        .toEqual(true);
    });

    it('should be false if isMobileBrowser() is false', function() {
      mockIsMobileBrowserValue = false;

      const submitTicket = instanceRender(<SubmitTicket />);

      expect(submitTicket.state.fullscreen)
        .toEqual(false);
    });
  });

  it('should pass on fullscreen to submitTicketForm', function() {
    const submitTicket = instanceRender(<SubmitTicket />);

    submitTicket.setState({fullscreen: 'VALUE'});

    expect(submitTicket.state.fullscreen)
      .toEqual('VALUE');
  });

  describe('attachmentBox', function() {
    it('should display the attachment box when isDragActive and attachmentsEnabled are true', function() {
      const submitTicket = domRender(<SubmitTicket attachmentsEnabled={true} />);

      submitTicket.handleDragEnter();

      expect(submitTicket.state.isDragActive)
        .toEqual(true);

      expect(document.querySelectorAll('.attachment_box').length)
        .toEqual(1);
    });

    it('should not display the attachment box if attachmentsEnabled is false', function() {
      const submitTicket = domRender(<SubmitTicket attachmentsEnabled={false} />);

      submitTicket.handleDragEnter();

      expect(submitTicket.state.isDragActive)
        .toEqual(true);

      expect(document.querySelectorAll('.attachment_box').length)
        .toEqual(0);
    });
  });
});
