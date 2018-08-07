describe('Render phone field', () => {
  let TalkPhoneField,
    libphonenumber,
    mockCountries;

  const SelectField = noopReactComponent();
  const Item = noopReactComponent();
  const Label = noopReactComponent();
  const SelectContainer = noopReactComponent();
  const SelectView = noopReactComponent();
  const Dropdown = noopReactComponent();

  mockCountries = ['US', 'AU', 'ZM', 'BB'];

  const phoneFieldPath = buildSrcPath('component/talk/TalkPhoneField');

  beforeEach(() => {
    libphonenumber = require('libphonenumber-js');

    mockery.enable();
    initMockRegistry({
      'React': React,
      '@zendeskgarden/react-select': {
        SelectField,
        Label,
        Item,
        SelectView,
        SelectContainer,
        Dropdown
      },
      'component/Flag': { Flag: noopReactComponent() },
      'component/frame/gardenOverrides': { talkDropdownOverrides: {} },
      'component/talk/TalkCountryDropdown': { TalkCountryDropdown: noopReactComponent() },
      './talkCountries': {
        countriesByIso: {
          'US': { code: '1', name: 'United States' },
          'AU': { code: '61', name: 'Australia' },
          'ZM': { code: '260', name: 'Zambia' },
          'BB': { code: '1-246', name: 'Barbados' }
        }
      }
    });
    mockery.registerAllowable(phoneFieldPath);
    TalkPhoneField = requireUncached(phoneFieldPath).TalkPhoneField;

    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('constructor', () => {
    let phoneField;

    const expectedCountries = [
      { name: 'Australia', iso: 'AU', code: '+61' },
      { name: 'Barbados', iso: 'BB', code: '+1 246' },
      { name: 'United States', iso: 'US', code: '+1' },
      { name: 'Zambia', iso: 'ZM', code: '+260' }
    ];

    describe('when the form has no previous country and phone value', () => {
      beforeEach(() => {
        phoneField = instanceRender(
          <TalkPhoneField
            getFrameContentDocument={() => document}
            supportedCountries={mockCountries}
            libphonenumber={libphonenumber} />
        );
      });

      it('sets the first country via alphabetical sort to the default country', () => {
        const expected = {
          countries: expectedCountries,
          selectedKey: 'US',
          inputValue: '+1'
        };

        expect(phoneField.state)
          .toEqual(jasmine.objectContaining(expected));
      });
    });

    describe('when the form has a previous country and phone value', () => {
      beforeEach(() => {
        phoneField = instanceRender(
          <TalkPhoneField
            getFrameContentDocument={() => document}
            supportedCountries={mockCountries}
            country='AU'
            value='+61434032660'
            libphonenumber={libphonenumber} />
        );
      });

      it('sets the first country via alphabetical sort to the default country', () => {
        const expected = {
          countries: expectedCountries,
          selectedKey: 'AU',
          inputValue: '+61 434 032 660'
        };

        expect(phoneField.state)
          .toEqual(jasmine.objectContaining(expected));
      });
    });
  });

  describe('onInputChange', () => {
    let phoneField,
      mockSetCustomValidity;

    beforeEach(() => {
      mockSetCustomValidity = jasmine.createSpy('setCustomValidity');

      phoneField = instanceRender(
        <TalkPhoneField
          getFrameContentDocument={() => document}
          supportedCountries={mockCountries}
          country='AU'
          libphonenumber={libphonenumber} />
      );

      phoneField.phoneInput = { setCustomValidity: mockSetCustomValidity };
    });

    describe('when the input value does not start with the country code', () => {
      beforeEach(() => {
        phoneField.onInputChange({ target: { value: '' }});
      });

      it('sets state.inputValue to the country code', () => {
        expect(phoneField.state.inputValue)
          .toBe('+61');
      });

      it('sets state.inputChangeTriggered to true', () => {
        expect(phoneField.state.inputChangeTriggered)
          .toBe(true);
      });
    });

    describe('when the input value does start with the country code', () => {
      beforeEach(() => {
        phoneField.onInputChange({ target: { value: '+61432067819' }});
      });

      it('sets state.inputValue to the formatted phone number', () => {
        expect(phoneField.state.inputValue)
          .toBe('+61 432 067 819');
      });

      it('sets state.inputChangeTriggered to true', () => {
        expect(phoneField.state.inputChangeTriggered)
          .toBe(true);
      });
    });

    describe('when the input value is a valid phone number', () => {
      beforeEach(() => {
        phoneField.onInputChange({ target: { value: '+61432067819' }});
      });

      it('calls phoneInput.setCustomValidity with an empty string', () => {
        expect(mockSetCustomValidity)
          .toHaveBeenCalledWith('');
      });
    });

    describe('when the input value is not a valid phone number', () => {
      beforeEach(() => {
        phoneField.onInputChange({ target: { value: '+6143206' }});
      });

      it('calls phoneInput.setCustomValidity with an "Error" string', () => {
        expect(mockSetCustomValidity)
          .toHaveBeenCalledWith('Error');
      });
    });
  });

  describe('onFlagChange', () => {
    let phoneField,
      mockOnCountrySelect;

    beforeEach(() => {
      mockOnCountrySelect = jasmine.createSpy('onCountrySelect');
      phoneField = instanceRender(
        <TalkPhoneField
          getFrameContentDocument={() => document}
          supportedCountries={mockCountries}
          country='AU'
          value='+61432098745'
          onCountrySelect={mockOnCountrySelect}
          libphonenumber={libphonenumber} />
      );

      phoneField.phoneInput = { focus: jasmine.createSpy('focus') };
    });

    describe('when the flag is already selected', () => {
      beforeEach(() => {
        phoneField.onFlagChange('AU');
      });

      it('does not set state.inputValue to new flag code', () => {
        expect(phoneField.state.inputValue)
          .toBe('+61 432 098 745');
      });

      it('does not call phoneInput.focus on the next tick', () => {
        jasmine.clock().tick(1);

        expect(phoneField.phoneInput.focus)
          .not.toHaveBeenCalled();
      });

      it('does not call props.onCountrySelect', () => {
        expect(mockOnCountrySelect)
          .not.toHaveBeenCalled();
      });
    });

    describe('when the flag is not already selected', () => {
      beforeEach(() => {
        phoneField.onFlagChange('US');
      });

      it('sets state.selectedKey to the new flag iso', () => {
        expect(phoneField.state.selectedKey)
          .toBe('US');
      });

      it('sets state.inputValue to new flag code', () => {
        expect(phoneField.state.inputValue)
          .toBe('+1');
      });

      it('calls phoneInput.focus on the next tick', () => {
        jasmine.clock().tick(1);

        expect(phoneField.phoneInput.focus)
          .toHaveBeenCalled();
      });

      it('calls props.onCountrySelect with the new flag and input', () => {
        expect(mockOnCountrySelect)
          .toHaveBeenCalledWith('US', '+1');
      });
    });
  });

  describe('validate', () => {
    let phoneField;

    beforeEach(() => {
      phoneField = instanceRender(
        <TalkPhoneField
          getFrameContentDocument={() => document}
          supportedCountries={mockCountries}
          country='AU'
          libphonenumber={libphonenumber} />
      );

      phoneField.phoneInput = { setCustomValidity: _.noop };
    });

    describe('when state.inputChangeTriggered is true', () => {
      beforeEach(() => {
        phoneField.setState({ inputChangeTriggered: true });
      });

      describe('when the phone number is valid', () => {
        beforeEach(() => {
          phoneField.onInputChange({ target: { value: '+61423098756' }});
        });

        it('returns undefined', () => {
          expect(phoneField.validate())
            .toBe(undefined);
        });
      });

      describe('when the phone number is not valid', () => {
        beforeEach(() => {
          phoneField.onInputChange({ target: { value: '+6142309' }});
        });

        it('returns "error"', () => {
          expect(phoneField.validate())
            .toBe('error');
        });
      });
    });

    describe('when state.inputChangeTriggered is false', () => {
      beforeEach(() => {
        phoneField.setState({ inputChangeTriggered: false });
      });

      it('returns undefined', () => {
        expect(phoneField.validate())
          .toBe(undefined);
      });
    });
  });

  describe('rendering', () => {
    let phoneField,
      countryDropdown,
      field;

    const expectedCountries = [
      { name: 'Australia', iso: 'AU', code: '+61' },
      { name: 'United States', iso: 'US', code: '+1' }
    ];

    beforeEach(() => {
      phoneField = domRender(
        <TalkPhoneField
          getFrameContentDocument={() => document}
          label='Phone'
          supportedCountries={['US', 'AU']}
          country='AU'
          value='+61430999721'
          required={true}
          libphonenumber={libphonenumber} />
      );
      countryDropdown = phoneField.countryDropdown;
      field = phoneField.phoneInput;
    });

    it('sets country state from prop', () => {
      expect(phoneField.state.selectedKey)
        .toEqual('AU');
    });

    it('returns an internal field of talk phone field component with a name prop', () => {
      expect(field.name)
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

    it('renders a TalkCountyDropdown with correct props', () => {
      expect(countryDropdown.props)
        .toEqual(jasmine.objectContaining({
          document,
          selectedKey: 'AU',
          countries: expectedCountries
        }));
    });

    it('formats the supported countries to the expected format', () => {
      expect(phoneField.state.countries)
        .toEqual(expectedCountries);
    });
  });
});
