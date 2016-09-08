describe('Field component', () => {
  let Field,
    mockIsLandscapeValue,
    mockIsMobileBrowserValue;
  const fieldPath = buildSrcPath('component/field/Field');

  beforeEach(() => {
    resetDOM();

    mockery.enable({
      warnOnReplace: false
    });

    mockIsMobileBrowserValue = false;
    mockIsLandscapeValue = false;

    initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: React.createClass({
          render: function() {
            return (
              <span>
                <svg />
              </span>
            );
          }
        })
      },
      'utility/devices': {
        isMobileBrowser: function() {
          return mockIsMobileBrowserValue;
        },
        isIos: noop,
        isLandscape: function() {
          return mockIsLandscapeValue;
        }
      },
      'utility/utils': {
        bindMethods: mockBindMethods
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', [
          'init',
          'setLocale',
          'getLocale',
          't',
          'isRTL',
          'getLocaleId'
        ])
      }
    });

    mockery.registerAllowable(fieldPath);

    Field = requireUncached(fieldPath).Field;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should render field DOM with a label wrapping two child divs', () => {
    const field = domRender(<Field name='alice' />);
    const fieldNode = ReactDOM.findDOMNode(field);

    expect(fieldNode.nodeName)
      .toEqual('LABEL');

    expect(fieldNode.children.length)
      .toEqual(2);

    expect(fieldNode.children[0].nodeName)
      .toEqual('DIV');

    expect(fieldNode.children[1].nodeName)
      .toEqual('DIV');
  });

  it('should pass along all props to underlying input', () => {
    const field = domRender(<Field type='email' name='alice' disabled={true} />);
    const fieldNode = ReactDOM.findDOMNode(field);

    expect(fieldNode.querySelector('input').name)
      .toEqual('alice');

    expect(fieldNode.querySelector('input').type)
      .toEqual('email');

    expect(fieldNode.querySelector('input').disabled)
      .toEqual(true);
  });

  it('should render input prop component instead of default input', () => {
    const field = domRender(<Field input={<textarea />} name='alice' />);
    const fieldNode = ReactDOM.findDOMNode(field);

    expect(fieldNode.querySelector('input'))
      .toBeFalsy();

    expect(fieldNode.querySelector('textarea'))
      .toBeTruthy();

    expect(fieldNode.querySelector('textarea').name)
      .toEqual('alice');
  });

  it('should render checkbox with label instead of default input', () => {
    const field = domRender(<Field label='Agree?' type='checkbox' name='alice' />);
    const fieldNode = ReactDOM.findDOMNode(field);

    expect(fieldNode.querySelector('input').type)
      .toEqual('checkbox');

    expect(TestUtils.findRenderedDOMComponentWithClass(field, 'Form-checkboxCaption'))
      .toBeTruthy();
  });

  it('should set focused state on field focus', () => {
    const field = domRender(<Field name='alice' />);

    expect(field.state.focused)
      .toBe(false);

    field.onFocus();

    expect(field.state.focused)
      .toBe(true);

    expect(TestUtils.findRenderedDOMComponentWithClass(field, 'Form-field--focused'))
      .toBeTruthy();
  });

  it('should only set invalid class after focus and blur events', () => {
    const field = domRender(<Field name='alice' />);
    const fieldNode = ReactDOM.findDOMNode(field);

    // jsdom doesn't seem to support html5 validation api
    // shim it for this test
    fieldNode.querySelector('input').validity = {
      valid: false
    };

    expect(field.state.hasError)
      .toBe(false);

    expect(() => TestUtils.findRenderedDOMComponentWithClass(field, 'Form-field--invalid'))
      .toThrow();

    field.onFocus();
    field.onBlur();

    expect(field.state.hasError)
      .toBe(true);

    expect(field.state.focused)
      .toBe(false);

    expect(field.state.blurred)
      .toBe(true);

    expect(TestUtils.findRenderedDOMComponentWithClass(field, 'Form-field--invalid'))
      .toBeTruthy();
  });

  describe('mobile', () => {
    it('should have default mobile classes when isMobileBrowser is true', () => {
      mockIsMobileBrowserValue = true;

      const field = domRender(<Field />);

      expect(TestUtils.findRenderedDOMComponentWithClass(field, 'u-textSize15'))
        .toBeTruthy();

      expect(() => TestUtils.findRenderedDOMComponentWithClass(field, 'u-textSizeSml'))
        .toThrow();
    });

    it('should have extra landscape classes when isLandscape is true', () => {
      mockIsMobileBrowserValue = true;
      mockIsLandscapeValue = true;

      const field = domRender(<Field />);

      expect(TestUtils.findRenderedDOMComponentWithClass(field, 'u-textSizeSml'))
        .toBeTruthy();

      expect(() => TestUtils.findRenderedDOMComponentWithClass(field, 'u-textSize15'))
        .toThrow();
    });

    it('should not have mobile classes when isMobileBrowser is false', () => {
      const field = domRender(<Field />);

      expect(() => TestUtils.findRenderedDOMComponentWithClass(field, 'u-textSize15'))
        .toThrow();
    });
  });

  describe('pattern attr', () => {
    it('should be used if it is passed in', () => {
      const field = domRender(<Field pattern='[a-zA-Z]' />);
      const fieldNode = ReactDOM.findDOMNode(field);

      expect(fieldNode.querySelector('input').props.pattern)
        .toEqual('[a-zA-Z]');
    });

    it('should not use one if it is not passed in', () => {
      const field = domRender(<Field />);
      const fieldNode = ReactDOM.findDOMNode(field);

      expect(fieldNode.querySelector('input').props.pattern)
        .toBeFalsy();
    });
  });
});
