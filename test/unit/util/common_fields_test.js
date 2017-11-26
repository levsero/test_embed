describe('common_fields', () => {
  let renderTextField,
    renderTextAreaField,
    renderPhoneField,
    renderEmailField;

  const commonFieldsPath = buildSrcPath('util/common_fields');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/field/Field': noopReactComponent
    });

    mockery.registerAllowable(commonFieldsPath);
    renderTextField = requireUncached(commonFieldsPath).renderTextField;
    renderTextAreaField = requireUncached(commonFieldsPath).renderTextAreaField;
    renderPhoneField = requireUncached(commonFieldsPath).renderPhoneField;
    renderEmailField = requireUncached(commonFieldsPath).renderEmailField;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('renderTextField', () => {
    let field;

    beforeEach(() => {
      field = renderTextField('name', 'Name', 'hello', true);
    });

    it('returns a text field component with the correct props', () => {
      const expectedProps = {
        name: 'name',
        label: 'Name',
        value: 'hello',
        required: true
      };

      expect(field.props)
        .toEqual(expectedProps);
    });
  });

  describe('renderTextAreaField', () => {
    let field;

    beforeEach(() => {
      field = renderTextAreaField('description', 'Description', 'hello', true);
    });

    it('returns a textarea field component with an input prop', () => {
      expect(field.props.input)
        .toEqual(<textarea rows="3" />);
    });

    it('returns a textarea field component with the correct props', () => {
      const expectedProps = {
        name: 'description',
        label: 'Description',
        value: 'hello',
        required: true
      };

      expect(field.props)
        .toEqual(jasmine.objectContaining(expectedProps));
    });
  });

  describe('renderEmailField', () => {
    let field;

    beforeEach(() => {
      field = renderEmailField('email', 'Email', 'hello@hello.com', true);
    });

    it('returns an email field component with a pattern prop', () => {
      expect(field.props.pattern)
        .toBeDefined();
    });

    it('returns a email field component with the correct props', () => {
      const expectedProps = {
        name: 'email',
        label: 'Email',
        value: 'hello@hello.com',
        required: true
      };

      expect(field.props)
        .toEqual(jasmine.objectContaining(expectedProps));
    });
  });

  describe('renderPhoneField', () => {
    let field;

    beforeEach(() => {
      field = renderPhoneField('phone', 'Phone', '+61430999721', true);
    });

    it('returns a phone field component with the correct props', () => {
      const expectedProps = {
        name: 'phone',
        label: 'Phone',
        value: '+61430999721',
        required: true
      };

      expect(field.props)
        .toEqual(expectedProps);
    });
  });
});
