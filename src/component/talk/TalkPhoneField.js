import _ from 'lodash';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Label } from '@zendeskgarden/react-select';
import { FauxInput, Input } from '@zendeskgarden/react-textfields';
import { FieldContainer, composeEventHandlers, ControlledComponent } from '@zendeskgarden/react-selection';
import { ThemeProvider } from '@zendeskgarden/react-theming';
import styled from 'styled-components';

import { FONT_SIZE } from 'constants/shared';
import { countriesByIso } from './talkCountries';
import { TalkCountryDropdown } from 'component/talk/TalkCountryDropdown';
import { talkDropdownOverrides } from 'component/frame/gardenOverrides';

const StyledFauxInput = styled(FauxInput)`
  padding: 0 !important;
`;

const StyledInput = styled(Input)`
  padding: ${10/FONT_SIZE}rem !important;
  align-self: center !important;
`;

export class TalkPhoneField extends ControlledComponent {
  static propTypes = {
    supportedCountries: PropTypes.array.isRequired,
    libphonenumber: PropTypes.object.isRequired,
    getFrameContentDocument: PropTypes.func.isRequired,
    rtl: PropTypes.bool,
    label: PropTypes.string,
    required: PropTypes.bool,
    country: PropTypes.string,
    value: PropTypes.string,
    onCountrySelect: PropTypes.func
  };

  static defaultProps = {
    rtl: false,
    label: '',
    required: false,
    country: '',
    value: '',
    onCountrySelect: () => {}
  }

  constructor(props) {
    super(props);

    const selectedKey = props.country || props.supportedCountries[0];
    const inputValue = props.value
      ? this.formatPhoneNumber(selectedKey, props.value)
      : this.getCountryByIso(selectedKey).code;

    this.state = {
      selectedKey,
      inputValue,
      countries: this.formatCountries(props.supportedCountries),
      inputChangeTriggered: false
    };

    this.countryDropdown = undefined;
    this.phoneInput = undefined;
  }

  onFlagChange = (selectedKey) => {
    if (selectedKey === this.state.selectedKey) return;

    const { code } = this.getCountryByIso(selectedKey);

    this.setState({ selectedKey, inputValue: code });

    // Input won't focus until nextTick
    setTimeout(() => this.phoneInput.focus(), 0);

    this.props.onCountrySelect(selectedKey, this.state.inputValue);
  }

  formatCountries(supportedCountries) {
    return supportedCountries
      .map((iso) => this.getCountryByIso(iso))
      .sort((a, b) => {
        return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
      });
  }

  formatPhoneNumber(country, phoneNumber) {
    const { libphonenumber } = this.props;

    return new libphonenumber.AsYouType(country).input(phoneNumber);
  }

  getLabelProps = ({ onClick, ...other }) => {
    return {
      onClick: composeEventHandlers(onClick, () => {
        this.selectRef && this.selectRef.focus();
      }),
      ...other
    };
  };

  getInputProps = ({ selectRef, ...other }) => {
    return {
      selectRef: (ref) => {
        selectRef && selectRef(ref);
        this.selectRef = ref;
      },
      ...other
    };
  };

  onInputChange = (e) => {
    const { libphonenumber } = this.props;
    const { selectedKey } = this.state;
    const { value } = e.target;

    const { code } = this.getCountryByIso(selectedKey);
    const inputValue = !_.startsWith(value, code) ? code : this.formatPhoneNumber(selectedKey, value);

    if (libphonenumber.isValidNumber(inputValue, selectedKey)) {
      this.phoneInput.setCustomValidity('');
    } else {
      this.phoneInput.setCustomValidity('Error');
    }

    this.setState({ inputValue, inputChangeTriggered: true });
  }

  validate = () => {
    const { selectedKey, inputValue } = this.getControlledState();
    const { libphonenumber } = this.props;
    const { inputChangeTriggered } = this.state;

    if (inputChangeTriggered && !libphonenumber.isValidNumber(inputValue, selectedKey)) {
      return 'error';
    }
  }

  getCountryByIso(iso) {
    const { name, code } = countriesByIso[iso];

    return {
      name,
      iso,
      // We format the number as the user types which removes any dashes from the input.
      // When storing the dialing code we need to replace the dash with a space so we can match it.
      code: `+${code}`.replace('-', ' ')
    };
  }

  render() {
    // prop is applied this way as we only want to control it
    // when the select is focused. Otherwise omit and let the component
    // control its focus state
    const focused = (this.countryDropdown && this.countryDropdown.selectFocused())
      ? { focused: true }
      : {};

    return (
      <ThemeProvider
        rtl={this.props.rtl}
        document={this.props.getFrameContentDocument()}
        theme={talkDropdownOverrides}>
        <FieldContainer>
          {({getLabelProps: getFieldLabelProps, getInputProps: getFieldInputProps}) => {
            return (
              <Fragment>
                <Label {...this.getLabelProps(getFieldLabelProps())}>{this.props.label}</Label>
                <StyledFauxInput
                  {...focused}
                  validation={this.validate()}
                  mediaLayout={true}
                  inputRef={container => this.containerRef = container}>
                  <TalkCountryDropdown
                    ref={node => this.countryDropdown = node}
                    document={this.props.getFrameContentDocument()}
                    getContainerRef={() => this.containerRef}
                    selectedKey={this.state.selectedKey}
                    countries={this.state.countries}
                    onChange={this.onFlagChange} />
                  <StyledInput
                    {...getFieldInputProps()}
                    value={this.state.inputValue}
                    onChange={this.onInputChange}
                    type='tel'
                    name='phone'
                    autoComplete='off'
                    innerRef={node => this.phoneInput = node}
                    required={this.props.required}
                    bare={true} />
                </StyledFauxInput>
              </Fragment>
            ); }}
        </FieldContainer>
      </ThemeProvider>
    );
  }
}
