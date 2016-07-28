describe('SubmitTicketForm component', function() {
  let SubmitTicketForm,
    onSubmit,
    onCancel,
    mockRegistry,
    mockAttachmentsReadyValue,
    scrollToBottomSpy;
  const submitTicketFormPath = buildSrcPath('component/SubmitTicketForm');
  const buttonPath = buildSrcPath('component/Button');
  const formParams = {
    'name': 'jabbathehutt',
    'email': 'mock@email.com',
    'description': 'Mock Description'
  };

  beforeEach(function() {
    onSubmit = jasmine.createSpy();
    onCancel = jasmine.createSpy();

    resetDOM();

    mockery.enable({
      warnOnReplace: false
    });

    mockAttachmentsReadyValue = true;
    scrollToBottomSpy = jasmine.createSpy();

    mockRegistry = initMockRegistry({
      'React': React,
      'component/Button': {
        Button: React.createClass({
          render: function() {
            return <input type='submit' disabled={this.props.disabled} />;
          }
        }),
        ButtonSecondary: React.createClass({
          render: function() {
            return (
              <div
                className='c-btn--secondary'
                label='Cancel'
                onClick={onCancel} />
            );
          }
        }),
        ButtonGroup: React.createClass({
          render: function() {
            return <div>{this.props.children}</div>;
          }
        }),
        ButtonDropzone: noopReactComponent()
      },
      'component/FormField': {
        Field: noopReactComponent(),
        getCustomFields: function() {
          return {
            fields: []
          };
        }
      },
      'component/ScrollContainer': {
        ScrollContainer: React.createClass({
          setScrollShadowVisible: noop,
          scrollToBottom: scrollToBottomSpy,
          render: function() {
            return (
              <div>
                <h1 id='formTitle'>{this.props.title}</h1>
                {this.props.children}
                <div>{this.props.footerContent}</div>
              </div>
            );
          }
        })
      },
      'component/AttachmentList': {
        AttachmentList: React.createClass({
          attachmentsReady: () => mockAttachmentsReadyValue,
          render: function() {
            return <div ref="attachments" />;
          }
        })
      },
      'service/i18n': {
        i18n: {
          init: noop,
          setLocale: noop,
          isRTL: noop,
          t: _.identity
        }
      },
      'utility/utils': {
        bindMethods: mockBindMethods
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

  it('should clear all fields other then name and email on valid submit', function() {
    const submitTicketForm = domRender(<SubmitTicketForm submit={onSubmit} />);

    submitTicketForm.state.formState = _.clone(formParams);
    submitTicketForm.clear();

    expect(submitTicketForm.state.formState)
      .toEqual({
        name: formParams.name,
        email: formParams.email
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
});
