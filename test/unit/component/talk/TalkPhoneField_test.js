describe('Render phone field', () => {
  let phoneField,
    field,
    TalkPhoneField;

  const phoneFieldPath = buildSrcPath('component/talk/TalkPhoneField');

  class MockField extends Component {
    render() {
      return <div />;
    }
  }

  beforeEach(() => {
    resetDOM();
    mockery.enable();
    initMockRegistry({
      'React': React,
      'component/field/Field': { Field: MockField }
    });
    mockery.registerAllowable(phoneFieldPath);
    TalkPhoneField = requireUncached(phoneFieldPath).TalkPhoneField;
    phoneField = domRender(
        <TalkPhoneField
          label='Phone'
          required={true}
          value='+61430999721' />
      );
    field = TestUtils.findRenderedComponentWithType(phoneField, MockField);
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('returns an internal field of talk phone number field component with a validator function prop', () => {
    expect(field.props.validateInput)
      .toEqual(jasmine.any(Function));
  });

  it('returns an internal field of talk phone field component with a name prop', () => {
    expect(field.props.name)
      .toEqual('phone');
  });

  it('returns a talk phone field component with the correct props', () => {
    const expectedProps = {
      label: 'Phone',
      value: '+61430999721',
      required: true
    };

    expect(phoneField.props)
      .toEqual(jasmine.objectContaining(expectedProps));
  });
});
