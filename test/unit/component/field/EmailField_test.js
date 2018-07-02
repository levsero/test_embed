describe('Render email field', () => {
  let EmailField;

  const emailFieldPath = buildSrcPath('component/field/EmailField');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './EmailField.scss': {
        locals: {}
      }
    });

    mockery.registerAllowable(emailFieldPath);
    EmailField = requireUncached(emailFieldPath).EmailField;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let emailField,
      field;

    beforeEach(() => {
      emailField = domRender(
        <EmailField
          label='Email'
          required={true}
          name='email'
          value='hello@hello.com'
          placeholder='Please enter your email here...' />
      );
      field = emailField.render();
    });

    it('returns an email field component with a pattern prop', () => {
      expect(field.props.children[1].props.pattern)
        .toBeDefined();
    });

    it('returns an email field component with a name prop', () => {
      expect(field.props.children[1].props.name)
        .toEqual('email');
    });
  });
});
