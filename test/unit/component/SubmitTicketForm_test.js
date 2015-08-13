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
      warnOnReplace:false,
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
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
              return <div>{this.props.footerContent}</div>;
            }
          }),
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['t', 'setLocale', 'init', 'isRTL'])
      },
      'lodash': _
    });

    mockery.registerAllowable('utility/globals');
    mockery.registerAllowable(submitTicketFormPath);
    mockery.registerAllowable(buttonPath);

    SubmitTicketForm = require(submitTicketFormPath).SubmitTicketForm;
  });

  afterEach(function() {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should correctly render form with noValidate attribute', function() {
    const submitTicketForm = React.render(
      <SubmitTicketForm />,
      global.document.body
    );

    expect(submitTicketForm.getDOMNode().getAttribute('novalidate'))
      .toEqual('');
  });

  it('should call parent component submit when form is submitted', function() {
    const submitTicketForm = React.render(
      <SubmitTicketForm submit={onSubmit} />,
      global.document.body
    );

    ReactTestUtils.Simulate.submit(submitTicketForm.getDOMNode());

    expect(onSubmit)
      .toHaveBeenCalled();
  });

  it('should change state and alter submit button on valid submit', function() {
    const submitTicketForm = React.render(
      <SubmitTicketForm submit={onSubmit} />,
      global.document.body
    );
    const submitTicketFormNode = submitTicketForm.getDOMNode();
    const submitElem = submitTicketFormNode.querySelector('input[type="submit"]');
    const i18n = mockRegistry['service/i18n'].i18n;

    i18n.t.and.returnValue('Foobar...');

    expect(submitElem.disabled)
      .toEqual(true);

    submitTicketForm.setState({isValid: true});

    expect(submitElem.disabled)
      .toEqual(false);

    expect(submitTicketForm.state.isSubmitting)
      .toEqual(false);

    ReactTestUtils.Simulate.submit(submitTicketForm.getDOMNode());

    expect(submitTicketForm.state.isSubmitting)
      .toEqual(true);

    expect(submitElem.disabled)
      .toEqual(true);
  });

  describe('ButtonSecondary', function() {
    it('should be rendered in the form when fullscreen is false', function() {
      const submitTicketForm = React.render(
        <SubmitTicketForm fullscreen={false} />,
        global.document.body
      );

      expect(function() {
        ReactTestUtils.findRenderedDOMComponentWithClass(submitTicketForm, 'c-btn--secondary');
      }).not.toThrow();
    });

    it('should not be rendered in the form when fullscreen is true', function() {
      const submitTicketForm = React.render(
        <SubmitTicketForm fullscreen={true} />,
        global.document.body
      );

      expect(function() {
        ReactTestUtils.findRenderedDOMComponentWithClass(submitTicketForm, 'c-btn--secondary');
      }).toThrow();
    });

    it('should call the mediator to switch the embed state', function() {
      const submitTicketForm = React.render(
        <SubmitTicketForm />,
        global.document.body
      );

      ReactTestUtils.Simulate.click(
        ReactTestUtils.findRenderedDOMComponentWithClass(submitTicketForm, 'c-btn--secondary')
      );
      jasmine.clock().install();

      // State might not change, setTimeout to allow the change to register
      jasmine.clock().tick(0);
      expect(onCancel)
        .toHaveBeenCalled();
    });
  });
});
