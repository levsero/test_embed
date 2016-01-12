describe('SubmitTicketForm component', function() {
  let SubmitTicketForm,
    onSubmit,
    onCancel,
    mockRegistry;
  const submitTicketFormPath = buildSrcPath('component/SubmitTicketForm');
  const buttonPath = buildSrcPath('component/Button');

  beforeEach(function() {
    onSubmit = jasmine.createSpy();
    onCancel = jasmine.createSpy();

    resetDOM();

    mockery.enable({
      warnOnReplace: false
    });

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
        })
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
          render: function() {
            return (
              <div>
                <h1 id='formTitle'>{this.props.title}</h1>
                <div>{this.props.footerContent}</div>
              </div>
            );
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
    ReactDOM.render(
      <SubmitTicketForm formTitleKey='testTitle' />,
      global.document.body
    );

    expect(document.getElementById('formTitle').innerHTML)
      .toEqual('embeddable_framework.submitTicket.form.title.testTitle');
  });

  it('should call i18n.t with the right parameter to set the form title', function() {
    const titleKey = 'foo bar';

    spyOn(mockRegistry['service/i18n'].i18n, 't').and.callThrough();

    ReactDOM.render(
      <SubmitTicketForm formTitleKey={titleKey} />,
      global.document.body
    );

    expect(mockRegistry['service/i18n'].i18n.t)
      .toHaveBeenCalledWith(`embeddable_framework.submitTicket.form.title.${titleKey}`);
  });

  it('should correctly render form with noValidate attribute', function() {
    const submitTicketForm = ReactDOM.render(<SubmitTicketForm />, global.document.body);

    expect(ReactDOM.findDOMNode(submitTicketForm).getAttribute('novalidate'))
      .toEqual('');
  });

  it('should change state and alter submit button on valid submit', function() {
    const submitTicketForm = ReactDOM.render(<SubmitTicketForm submit={onSubmit} />, global.document.body);
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

  describe('ButtonSecondary', function() {
    it('should be rendered in the form when fullscreen is false', function() {
      const submitTicketForm = ReactDOM.render(<SubmitTicketForm fullscreen={false} />, global.document.body);

      expect(function() {
        TestUtils.findRenderedDOMComponentWithClass(submitTicketForm, 'c-btn--secondary');
      }).not.toThrow();
    });

    it('should not be rendered in the form when fullscreen is true', function() {
      const submitTicketForm = ReactDOM.render(<SubmitTicketForm fullscreen={true} />, global.document.body);

      expect(function() {
        TestUtils.findRenderedDOMComponentWithClass(submitTicketForm, 'c-btn--secondary');
      }).toThrow();
    });
  });
});
