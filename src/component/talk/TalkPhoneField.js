import _ from 'lodash';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Label } from '@zendeskgarden/react-select';
import { Message, FauxInput, Input } from '@zendeskgarden/react-textfields';
import { FieldContainer, composeEventHandlers, ControlledComponent } from '@zendeskgarden/react-selection';
import { ThemeProvider } from '@zendeskgarden/react-theming';
import styled from 'styled-components';

import { FONT_SIZE } from 'constants/shared';
import { countriesByIso } from './talkCountries';
import { TalkCountryDropdown } from 'component/talk/TalkCountryDropdown';
import { talkDropdownOverrides } from 'component/frame/gardenOverrides';
import { i18n } from 'service/i18n';

const StyledFauxInput = styled(FauxInput)`
  padding: 0 !important;
`;

const StyledInput = styled(Input)`
  padding: ${10/FONT_SIZE}rem !important;
  align-self: center !important;
`;

const StyledContainer = styled.div`
 margin-bottom: ${20/FONT_SIZE}rem !important;
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
    onCountrySelect: PropTypes.func,
    showError: PropTypes.bool,
    validate: PropTypes.func
  };

  static defaultProps = {
    rtl: false,
    label: '',
    required: false,
    country: '',
    value: '',
    onCountrySelect: () => {},
    showError: false,
    validate: () => {}
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
      valid: false
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

  isValid = (phoneValue, selectedKey) => {
    const { libphonenumber } = this.props;

    // setCustomValidity sets the validity state of the html element.
    // The validate prop is a custom validator function that let external components
    // know the validity state of TalkPhoneField.js
    if (libphonenumber.isValidNumber(phoneValue, selectedKey)) {
      this.phoneInput.setCustomValidity('');
      this.setState({ valid: true });
      this.props.validate(true);
    } else {
      this.setState({ valid: false });
      this.phoneInput.setCustomValidity('Error');
      this.props.validate(false);
    }
  }

  getPhoneValue = (inputValue, selectedKey) => {
    const { code } = this.getCountryByIso(selectedKey);

    return !_.startsWith(inputValue, code) ? code : this.formatPhoneNumber(selectedKey, inputValue);
  }

  onInputChange = (e) => {
    const phoneValue = this.getPhoneValue(e.target.value, this.state.selectedKey);

    this.isValid(phoneValue, this.state.selectedKey);
    this.setState({ inputValue: phoneValue });
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

  renderErrorMessage = () => {
    if (this.props.showError && !this.state.valid) {
      return <Message validation='error'>{i18n.t('embeddable_framework.validation.error.phone')}</Message>;
    }
    return null;
  }

  componentDidMount = () => {
    this.isValid(this.state.inputValue, this.state.selectedKey);
  }

  render() {
    // prop is applied this way as we only want to control it
    // when the select is focused. Otherwise omit and let the component
    // control its focus state
    const focused = (this.countryDropdown && this.countryDropdown.selectFocused())
      ? { focused: true }
      : {};
    const error = this.renderErrorMessage();

    return (
      <StyledContainer>
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
                    validation={error ? 'error' : 'none'}
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
        {error}
      </StyledContainer>
    );
  }
}
