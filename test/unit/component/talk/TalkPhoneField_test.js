describe('Render phone field', () => {
  let TalkPhoneField,
    mockIsMobileBrowserValue,
    mockIsLandscapeValue,
    mockSupportedCountries;

  const phoneFieldPath = buildSrcPath('component/talk/TalkPhoneField');

  class MockField extends Component {
    onBlur() {
      this.blurred = true;
    }
    validate() {
      this.validated = true;
    }
    render() {
      return <div className='field' />;
    }
  }

  class MockDropdown extends Component {
    render() {
      return <div className='dropdown'/>;
    }
  }

  mockIsMobileBrowserValue = false;
  mockIsLandscapeValue = false;
  mockSupportedCountries = ['AU', 'US', 'ZM'];

  beforeEach(() => {
    mockery.enable();
    initMockRegistry({
      'React': React,
      'component/field/Field': { Field: MockField },
      'component/field/Dropdown': { Dropdown: MockDropdown },
      'component/Flag': { Flag: noopReactComponent },
      'utility/devices': {
        isMobileBrowser: () => mockIsMobileBrowserValue,
        isLandscape: () => mockIsLandscapeValue
      },
      './TalkPhoneField.scss': {
        locals: {
          field: 'field-class',
          hover: 'hover-class',
          focus: 'focus-class',
          dropdown: 'dropdown-class',
          dropdownMobile: 'dropdownMobile-class',
          dropdownInput: 'dropdownInput-class',
          menuContainer: 'menuContainer-class',
          arrowMobile: 'arrow-mobile',
          label: 'field-label',
          labelPortrait: 'label-portrait',
          labelLandscape: 'label-landscape',
          fieldInputMobile: 'field-input-mobile'
        }
      },
      'translation/ze_countries': {
        'AU': { code: '61', name: 'Australia' },
        'US': { code: '1', name: 'United States' },
        'ZM': { code: '260', name: 'Zambia' }
      }
    });
    mockery.registerAllowable(phoneFieldPath);
    TalkPhoneField = requireUncached(phoneFieldPath).TalkPhoneField;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('constructor', () => {
    let phoneField;

    describe('when the form has no previous country and phone value', () => {
      beforeEach(() => {
        phoneField = domRender(<TalkPhoneField supportedCountries={mockSupportedCountries} />);
      });

      it('sets the first country via alphabetical sort to the default country', () => {
        const supportedCountries = [
          { name: 'Australia', value: 'AU', default: true },
          { name: 'United States', value: 'US', default: false },
          { name: 'Zambia', value: 'ZM', default: false }
        ];
        const expected = {
          supportedCountries,
          country: 'AU',
          value: '+61',
          focus: false
        };

        expect(phoneField.state)
          .toEqual(jasmine.objectContaining(expected));
      });
    });

    describe('when the form has a previous country and phone value', () => {
      beforeEach(() => {
        phoneField = domRender(
          <TalkPhoneField
            supportedCountries={mockSupportedCountries}
            country='ZM'
            value='+260123654247' />
        );
      });

      it('sets the first country via alphabetical sort to the default country', () => {
        const supportedCountries = [
          { name: 'Australia', value: 'AU', default: false },
          { name: 'United States', value: 'US', default: false },
          { name: 'Zambia', value: 'ZM', default: true }
        ];
        const expected = {
          supportedCountries,
          country: 'ZM',
          value: '+260123654247',
          focus: false
        };

        expect(phoneField.state)
          .toEqual(jasmine.objectContaining(expected));
      });
    });
  });

  describe('componentDidMount', () => {
    let phoneField;

    describe('if a country value exists in state', () => {
      beforeEach(() => {
        phoneField = domRender(
          <TalkPhoneField
            supportedCountries={mockSupportedCountries}
            country='US' />
        );

        spyOn(phoneField, 'triggerCountryChange');
      });

      it('calls triggerCountryChange with the country', () => {
        expect(phoneField.triggerCountryChange)
          .not.toHaveBeenCalled();

        phoneField.componentDidMount();

        expect(phoneField.triggerCountryChange)
          .toHaveBeenCalledWith('US');
      });
    });

    describe('if a value provided is not equal to the country code', () => {
      beforeEach(() => {
        phoneField = domRender(
          <TalkPhoneField
            supportedCountries={mockSupportedCountries}
            value='+61403354742'
            country='AU' />
        );

        spyOn(phoneField.input, 'validate');
        spyOn(phoneField.input, 'onBlur');

        phoneField.componentDidMount();
      });

      it('calls validate', () => {
        expect(phoneField.input.validate)
          .toHaveBeenCalled();
      });

      it('calls onBlur with an event object with a formatted phone number', () => {
        const expected = {
          target: {
            value: '+61 403 354 742'
          }
        };

        expect(phoneField.input.onBlur)
          .toHaveBeenCalledWith(jasmine.objectContaining(expected));
      });
    });
  });

  it('handles empty values', () => {
    const phoneField = domRender(<TalkPhoneField />);

    phoneField.componentWillReceiveProps({ value: '' });

    expect(phoneField.state.value)
      .toEqual('');
  });

  it('fires field events on initial render', () => {
    const phoneField = domRender(<TalkPhoneField country='AU' value='61422222222' />);
    const field = TestUtils.findRenderedComponentWithType(phoneField, MockField);

    expect(field.blurred)
      .toBe(true);

    expect(field.validated)
      .toBe(true);
  });

  it('triggers onCountryChange on country select', () => {
    const selectSpy = jasmine.createSpy('onSelect');
    const phoneField = domRender(<TalkPhoneField
      onCountrySelect={selectSpy} />);

    phoneField.handleCountrySelected('US');

    expect(selectSpy)
      .toHaveBeenCalledWith('US', '+1');
  });

  describe('mobile', () => {
    let phoneField;

    beforeEach(() => {
      mockIsMobileBrowserValue = true;

      phoneField = domRender(<TalkPhoneField />);
    });

    it('has the default mobile classes when isMobileBrowser is true', () => {
      expect(TestUtils.findRenderedDOMComponentWithClass(phoneField, 'label-portrait'))
        .toBeTruthy();

      expect(() => TestUtils.findRenderedDOMComponentWithClass(phoneField, 'label-landscape'))
        .toThrow();
    });

    it('passes mobile-specific props to components when isMobileBrowser is true', () => {
      const dropdown = TestUtils.findRenderedComponentWithType(phoneField, MockDropdown);
      const field = TestUtils.findRenderedComponentWithType(phoneField, MockField);

      expect(dropdown.props.inputClassName).toMatch('dropdownMobile-class');
      expect(dropdown.props.arrowClassName).toMatch('arrow-mobile');
      expect(field.props.inputClasses).toMatch('field-input-mobile');
    });
  });

  describe('rendering', () => {
    let phoneField,
      field;

    beforeEach(() => {
      phoneField = domRender(
        <TalkPhoneField
          label='Phone'
          required={true}
          supportedCountries={['US', 'AU']}
          country='AU'
          value='+61430999721' />
      );
      field = TestUtils.findRenderedComponentWithType(phoneField, MockField);
    });

    it('sets country state from prop', () => {
      expect(phoneField.state.country)
        .toEqual('AU');
    });

    it('formats the value into an international phone number', () => {
      expect(phoneField.state.value)
        .toEqual('+61 430 999 721');
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

    it('formats the supported countries to the expected format', () => {
      expect(phoneField.state.supportedCountries)
        .toEqual([
          { name: 'Australia', value: 'AU', default: true },
          { name: 'United States', value: 'US', default: false }
        ]);
    });

    it('formats the phone number', () => {
      expect(phoneField.formatPhoneNumber('+61430999721', 'AU'))
        .toEqual('+61 430 999 721');
    });

    it('disallows editing values that do not start with proper prefix', () => {
      phoneField.componentWillReceiveProps({ value: '404' });

      expect(phoneField.state.value)
        .toEqual('+61');
    });

    it('allows editing values that conform to format', () => {
      phoneField.componentWillReceiveProps({ value: '+61422133422' });

      expect(phoneField.state.value)
        .toEqual('+61 422 133 422');
    });

    it('updates state on country select', () => {
      phoneField.handleCountrySelected('US');

      expect(phoneField.state.country)
        .toEqual('US');

      expect(phoneField.state.value)
        .toEqual('+1');

      expect(field.validated)
        .toBe(true);
    });

    it('sets state on mouse enter', () => {
      phoneField.handleMouseEnter();

      expect(phoneField.state.hover)
        .toEqual(true);
    });

    it('does not reset value if country selected is the same as previous', () => {
      phoneField.handleCountrySelected('AU');

      expect(phoneField.state.value)
        .toEqual('+61 430 999 721');
    });

    describe('event handling', () => {
      describe('when focus is triggered', () => {
        beforeEach(() => {
          spyOn(phoneField, 'handleContainerFocus');

          phoneField.handleFocus();
        });

        it('sets state on focus', () => {
          expect(phoneField.state.focus)
            .toEqual(true);
        });

        it('calls handleContainerFocus', () => {
          expect(phoneField.handleContainerFocus)
            .toHaveBeenCalled();
        });
      });

      describe('when blur is triggered', () => {
        describe('when menu is not open and container is not focused', () => {
          beforeEach(() => {
            phoneField.menuOpen = false;
            phoneField.containerFocused = false;

            phoneField.handleBlur();
          });

          it('sets state on blur', () => {
            expect(phoneField.state.focus)
              .toEqual(false);
            expect(phoneField.state.hover)
              .toEqual(false);
          });
        });

        describe('when either menu is opened or container is focused', () => {
          beforeEach(() => {
            phoneField.menuOpen = true;
            phoneField.containerFocused = true;

            phoneField.setState({ focus: true, hover: true });
            phoneField.handleBlur();
          });

          it('does not change the current state on blur', () => {
            expect(phoneField.state.focus)
              .toEqual(true);
            expect(phoneField.state.hover)
              .toEqual(true);
          });
        });
      });

      describe('when handleDropdownBlur is triggered', () => {
        describe('when container is focused', () => {
          beforeEach(() => {
            phoneField.containerFocused = true;
            field.blurred = false;

            spyOn(phoneField, 'handleBlur');

            jasmine.clock().install();
            phoneField.handleDropdownBlur();
            jasmine.clock().tick(0);
          });

          it('does not call blur on input', () => {
            expect(field.blurred)
              .toBe(false);
          });
        });

        describe('when container is not focused', () => {
          beforeEach(() => {
            phoneField.containerFocused = false;
            field.blurred = false;

            spyOn(phoneField, 'handleBlur');

            jasmine.clock().install();
            phoneField.handleDropdownBlur();
            jasmine.clock().tick(0);
          });

          it('calls blur on input', () => {
            expect(field.blurred)
              .toBe(true);
          });
        });
      });

      it('triggers validate on field after setting props', () => {
        phoneField.componentWillReceiveProps({ value: '+61422' });

        expect(field.validated)
          .toBe(true);
      });

      it('sets state on mouse enter', () => {
        phoneField.handleMouseEnter();

        expect(phoneField.state.hover)
          .toEqual(true);
      });

      it('sets state on mouse leave', () => {
        phoneField.handleMouseLeave();

        expect(phoneField.state.hover)
          .toEqual(false);
      });

      it('does not remove focus when menu is open', () => {
        phoneField.menuOpen = true;
        phoneField.setState({ focus: true, hover: true });
        phoneField.handleBlur();

        expect(phoneField.state.focus)
          .toEqual(true);

        expect(phoneField.state.hover)
          .toEqual(true);
      });

      it('sets menuOpen to value from handleMenuChange', () => {
        expect(phoneField.menuOpen)
          .toEqual(false);

        phoneField.handleMenuChange(true);

        expect(phoneField.menuOpen)
          .toEqual(true);

        phoneField.handleMenuChange(false);

        expect(phoneField.menuOpen)
          .toEqual(false);
      });
    });
  });
});
