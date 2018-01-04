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
      'utility/devices': {
        isMobileBrowser: function() {
          return mockIsMobileBrowserValue;
        },
        isIos: noop,
        isLandscape: function() {
          return mockIsLandscapeValue;
        }
      },
      './Field.scss': {
        locals: {
          focused: 'field-focused',
          landscape: 'landscape',
          mobile: 'mobie',
          invalid: 'field-invalid',
          label: 'field-label',
          labelPortrait: 'label-portrait',
          labelLandscape: 'label-landscape',
          fieldInputMobile: 'field-input-mobile'
        }
      }
    });

    mockery.registerAllowable(fieldPath);

    Field = requireUncached(fieldPath).Field;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('renders field DOM with a label wrapping two child divs', () => {
    const field = domRender(<Field name='alice' />);
    const fieldNode = ReactDOM.findDOMNode(field).children[0];

    expect(fieldNode.nodeName)
      .toEqual('LABEL');

    expect(fieldNode.children.length)
      .toEqual(2);

    expect(fieldNode.children[0].nodeName)
      .toEqual('DIV');

    expect(fieldNode.children[1].nodeName)
      .toEqual('DIV');
  });

  it('passes along all props to underlying input', () => {
    const field = domRender(<Field type='email' name='alice' disabled={true} />);
    const fieldNode = ReactDOM.findDOMNode(field);

    expect(fieldNode.querySelector('input').name)
      .toEqual('alice');

    expect(fieldNode.querySelector('input').type)
      .toEqual('email');

    expect(fieldNode.querySelector('input').disabled)
      .toEqual(true);
  });

  it('renders input prop component instead of default input', () => {
    const field = domRender(<Field input={<textarea />} name='alice' />);
    const fieldNode = ReactDOM.findDOMNode(field);

    expect(fieldNode.querySelector('input'))
      .toBeFalsy();

    expect(fieldNode.querySelector('textarea'))
      .toBeTruthy();

    expect(fieldNode.querySelector('textarea').name)
      .toEqual('alice');
  });

  it('sets focused state on field focus', () => {
    const field = domRender(<Field name='alice' />);

    expect(field.state.focused)
      .toBe(false);

    field.onFocus();

    expect(field.state.focused)
      .toBe(true);

    expect(TestUtils.findRenderedDOMComponentWithClass(field, 'field-focused'))
      .toBeTruthy();
  });

  it('sets invalid class after focus and blur events', () => {
    const field = domRender(<Field name='alice' />);
    const fieldNode = ReactDOM.findDOMNode(field);

    // jsdom doesn't seem to support html5 validation api
    // shim it for this test
    fieldNode.querySelector('input').validity = {
      valid: false
    };

    expect(field.state.hasError)
      .toBe(false);

    expect(() => TestUtils.findRenderedDOMComponentWithClass(field, 'field-invalid'))
      .toThrow();

    field.onFocus();
    field.onBlur();

    expect(field.state.hasError)
      .toBe(true);

    expect(field.state.focused)
      .toBe(false);

    expect(field.state.blurred)
      .toBe(true);

    expect(TestUtils.findRenderedDOMComponentWithClass(field, 'field-invalid'))
      .toBeTruthy();
  });

  it('allows customization of the input class name', () => {
    const field = domRender(<Field inputClasses='testing' />);

    expect(TestUtils.findRenderedDOMComponentWithClass(field, 'testing'))
      .toBeTruthy();
  });

  describe('mobile', () => {
    it('has the default mobile classes when isMobileBrowser is true', () => {
      mockIsMobileBrowserValue = true;

      const field = domRender(<Field />);

      expect(TestUtils.findRenderedDOMComponentWithClass(field, 'label-portrait'))
        .toBeTruthy();

      expect(() => TestUtils.findRenderedDOMComponentWithClass(field, 'label-landscape'))
        .toThrow();

      expect(TestUtils.findRenderedDOMComponentWithClass(field, 'field-input-mobile'))
        .toBeTruthy();
    });

    it('has the extra landscape classes when isLandscape is true', () => {
      mockIsMobileBrowserValue = true;
      mockIsLandscapeValue = true;

      const field = domRender(<Field />);

      expect(TestUtils.findRenderedDOMComponentWithClass(field, 'landscape'))
        .toBeTruthy();

      expect(() => TestUtils.findRenderedDOMComponentWithClass(field, 'mobile'))
        .toThrow();
    });

    it('does not have mobile classes when isMobileBrowser is false', () => {
      const field = domRender(<Field />);

      expect(() => TestUtils.findRenderedDOMComponentWithClass(field, 'mobile'))
        .toThrow();

      expect(() => TestUtils.findRenderedDOMComponentWithClass(field, 'field-input-mobile'))
        .toThrow();
    });
  });

  describe('pattern attr', () => {
    it('is used if it is passed in', () => {
      const field = domRender(<Field pattern='[a-zA-Z]' />);
      const fieldNode = ReactDOM.findDOMNode(field);

      expect(fieldNode.querySelector('input').getAttribute('pattern'))
        .toEqual('[a-zA-Z]');
    });

    it('does not use one if it is not passed in', () => {
      const field = domRender(<Field />);
      const fieldNode = ReactDOM.findDOMNode(field);

      expect(fieldNode.querySelector('input').getAttribute('pattern'))
        .toBeFalsy();
    });
  });

  describe('validator', () => {
    let field,
      eventSpy,
      setCustomValiditySpy;

    beforeEach(() => {
      setCustomValiditySpy = jasmine.createSpy('setCustomValidity');
    });

    describe('when a validateInput prop is provided', () => {
      let validateInputSpy;

      describe('when the validateInput function returns true', () => {
        beforeEach(() => {
          validateInputSpy = jasmine.createSpy('validateInput').and.returnValue(true);
          eventSpy = {
            target: {
              value: '+61430999721'
            },
            persist: () => null
          };

          field = domRender(<Field validateInput={validateInputSpy} />);
          field.input = {
            setCustomValidity: setCustomValiditySpy,
            validity: {
              valid: true
            }
          };
          field.onChange(eventSpy);
        });

        it('calls input.setCustomValidity with an empty string', () => {
          expect(setCustomValiditySpy)
            .toHaveBeenCalledWith('');
        });
      });

      describe('when the validateInput function returns false', () => {
        beforeEach(() => {
          validateInputSpy = jasmine.createSpy('validateInput').and.returnValue(false);
          eventSpy = {
            target: {
              value: 'wrongNumber1430999721'
            },
            persist: () => null
          };

          field = domRender(<Field validateInput={validateInputSpy} />);
          field.input = {
            setCustomValidity: setCustomValiditySpy,
            validity: {
              valid: false
            }
          };
          field.onChange(eventSpy);
        });

        it('calls input.setCustomValidity with an error string', () => {
          expect(setCustomValiditySpy)
            .toHaveBeenCalledWith('Error');
        });
      });
    });

    describe('when a validateInput prop is not provided', () => {
      beforeEach(() => {
        field = domRender(<Field />);
        field.input = {
          setCustomValidity: setCustomValiditySpy,
          validity: {
            valid: true
          }
        };
        eventSpy = {
          target: {
            value: '+61430999721withwrongnumber'
          },
          persist: () => null
        };

        field.onChange(eventSpy);
      });

      it('calls input.setCustomValidity with an empty string', () => {
        expect(setCustomValiditySpy)
          .toHaveBeenCalledWith('');
      });
    });
  });

  it('has autoComplete attribute set to false', () => {
    const field = domRender(<Field />);
    const fieldNode = ReactDOM.findDOMNode(field);

    expect(fieldNode.querySelector('input').getAttribute('autoComplete'))
      .toEqual('off');
  });

  describe('description', () => {
    it('is added if it is true', () => {
      const field = domRender(<Field description='hello' />);
      const fieldNode = ReactDOM.findDOMNode(field);

      expect(fieldNode.children[1].innerHTML)
        .toEqual('hello');
    });

    it('is not rendered if description is not provided', () => {
      const field = domRender(<Field />);
      const fieldNode = ReactDOM.findDOMNode(field);

      expect(fieldNode.children[1])
        .toBeFalsy();
    });
  });

  describe('required label', () => {
    let field,
      label;

    describe('when the field has a label', () => {
      describe('when the field is required', () => {
        beforeEach(() => {
          field = domRender(<Field label={'name'} required={true} />);
          label = TestUtils.findRenderedDOMComponentWithClass(field, 'field-label');
        });

        it('renders a required `*` next to the label', () => {
          expect(label.textContent)
            .toBe('name*');
        });
      });

      describe('when the field is not required', () => {
        beforeEach(() => {
          field = domRender(<Field label={'name'} required={false} />);
          label = TestUtils.findRenderedDOMComponentWithClass(field, 'field-label');
        });

        it('does not render a required `*` next to the label', () => {
          expect(label.textContent)
            .toBe('name');
        });
      });
    });

    describe('when the field does not have a label', () => {
      describe('when the field is required', () => {
        beforeEach(() => {
          field = domRender(<Field required={true} />);
          label = TestUtils.findRenderedDOMComponentWithClass(field, 'field-label');
        });

        it('does not render a required `*` next to the label', () => {
          expect(label.textContent)
            .toBe('');
        });
      });

      describe('when the field is not required', () => {
        beforeEach(() => {
          field = domRender(<Field required={false} />);
          label = TestUtils.findRenderedDOMComponentWithClass(field, 'field-label');
        });

        it('does not render a required `*` next to the label', () => {
          expect(label.textContent)
            .toBe('');
        });
      });
    });
  });
});
