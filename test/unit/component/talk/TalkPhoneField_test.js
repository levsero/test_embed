describe('Render phone field', () => {
  let TalkPhoneField;

  const phoneFieldPath = buildSrcPath('component/talk/TalkPhoneField');

  class MockField extends Component {
    onBlur() {
      this.blurred = true;
    }
    validate() {
      this.validated = true;
    }
    render() {
      return <div className='field'/>;
    }
  }

  class MockDropdown extends Component {
    render() {
      return <div className='dropdown'/>;
    }
  }

  beforeEach(() => {
    resetDOM();
    mockery.enable();
    initMockRegistry({
      'React': React,
      'component/field/Field': { Field: MockField },
      'component/field/Dropdown': { Dropdown: MockDropdown },
      'component/Flag': { Flag: noopReactComponent },
      'utility/devices': {
        isMobileBrowser: () => { return false; }
      },
      './TalkPhoneField.sass': {
        locals: {
          field: 'field-class',
          hover: 'hover-class',
          focus: 'focus-class',
          dropdown: 'dropdown-class',
          dropdownMobile: 'dropdownMobile-class',
          dropdownInput: 'dropdownInput-class',
          menuContainer: 'menuContainer-class'
        }
      }
    });
    mockery.registerAllowable(phoneFieldPath);
    TalkPhoneField = requireUncached(phoneFieldPath).TalkPhoneField;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
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
          { name:'United States', value: 'US', default: false }
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
      it('sets state on focus', () => {
        phoneField.handleFocus();

        expect(phoneField.state.focus)
          .toEqual(true);
      });

      it('triggers validate on field after setting props', () => {
        phoneField.componentWillReceiveProps({ value: '+61422' });

        expect(field.validated)
          .toBe(true);
      });

      it('sets state on blur', () => {
        phoneField.handleBlur();

        expect(phoneField.state.focus)
          .toEqual(false);
        expect(phoneField.state.hover)
          .toEqual(false);
      });

      it('calls blur on input when dropdown blur is triggered', () => {
        jasmine.clock().install();
        field.blurred = false;
        phoneField.handleDropdownBlur();
        jasmine.clock().tick(0);

        expect(field.blurred)
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
