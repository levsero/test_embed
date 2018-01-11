describe('Render email field', () => {
  let emailField,
    field,
    EmailField;

  const emailFieldPath = buildSrcPath('component/field/EmailField');

  class MockField extends Component {
    render() {
      return <div />;
    }
  }

  beforeEach(() => {
    mockery.enable();
    initMockRegistry({
      'React': React,
      './Field': { Field: MockField }
    });
    mockery.registerAllowable(emailFieldPath);
    EmailField = requireUncached(emailFieldPath).EmailField;
    emailField = domRender(
        <EmailField
          label='Email'
          required={true}
          value='hello@hello.com' />
      );
    field = TestUtils.findRenderedComponentWithType(emailField, MockField);
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('returns an email field component with a pattern prop', () => {
    expect(field.props.pattern)
      .toBeDefined();
  });

  it('returns an email field component with a name prop', () => {
    expect(field.props.name)
      .toEqual('email');
  });

  it('returns a email field component with the correct props', () => {
    const expectedProps = {
      label: 'Email',
      value: 'hello@hello.com',
      required: true
    };

    expect(emailField.props)
      .toEqual(jasmine.objectContaining(expectedProps));
  });
});
