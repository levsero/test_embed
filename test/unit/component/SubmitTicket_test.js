describe('Submit ticket component', function() {
  let SubmitTicket,
    mockIsMobileBrowserValue;

  const formParams = {
    'set_tags': 'web_widget',
    'via_id': 48,
    'submitted_from': global.window.location.href,
    'email': 'mock@email.com',
    'description': 'Mock Description'
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
  const submitTicketPath = buildSrcPath('component/SubmitTicket');

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
      'component/SubmitTicketForm': {
        SubmitTicketForm: React.createClass({
          getInitialState: function() {
            return {
              formState: {}
            };
          },
          clear: noop,
          render: function() {
            return <form onSubmit={this.props.handleSubmit} />;
          }
        }),
        MessageFieldset: noop,
        EmailField: noop
      },
      'component/ZendeskLogo': {
        ZendeskLogo: noopReactComponent()
      },
      'component/Button': {
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
      'component/AttachmentBox': {
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
          getLocaleId : noop,
          isRTL: noop,
          t: _.identity
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
          description: formParams.description
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

      expect(params)
        .toBeJSONEqual(payload.params);

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
        },
        name: 'mockName',
        description: 'mockDescription'
      };

      const submitTicket = instanceRender(<SubmitTicket customFields={mockCustomField} />);
      const payload = submitTicket.formatTicketSubmission(mockValues);

      expect(payload)
        .toBeJSONEqual(expectedPayload);
    });

    it('adds submitted from to the description when attachments are enabled', function() {
      const label = 'embeddable_framework.submitTicket.form.submittedFrom.label';

      submitTicket = domRender(
        <SubmitTicket
          submitTicketSender={mockSubmitTicketSender}
          attachmentsEnabled={true}
          updateFrameSize={noop} />
      );

      submitTicket.handleSubmit({ preventDefault: noop }, mockValues);

      const params = mockSubmitTicketSender.calls.mostRecent().args[0];

      expect(params)
        .not.toBeJSONEqual(payload.params);

      expect(params.description)
        .toBe(`${payload.params.description}\n\n------------------\n${label}`);
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
