import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Dropdown } from 'component/field/Dropdown';
import { Field } from 'component/field/Field';
import { Flag } from 'component/Flag';
import { isMobileBrowser,
  isLandscape } from 'utility/devices';

import { countriesByIso, countriesByName } from './talkCountries';
import { locals as styles } from './TalkPhoneField.scss';

const libphonenumber = (() => { try { return require('libphonenumber-js'); } catch (_) {} })();

export class TalkPhoneField extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    label: PropTypes.string,
    required: PropTypes.bool,
    getFrameDimensions: PropTypes.func.isRequired,
    country: PropTypes.string,
    onCountrySelect: PropTypes.func,
    supportedCountries: PropTypes.array.isRequired
  };

  static defaultProps = {
    label: '',
    required: false,
    value: '',
    country: '',
    getFrameDimensions: () => {},
    onCountrySelect: () => {},
    supportedCountries: []
  };

  constructor(props) {
    super(props);

    const { value, supportedCountries, country } = props;
    const countryValue = country || _.get(supportedCountries, 0, '');
    const countryIso = countriesByIso[countryValue];
    const phoneNumber = (!value)
      ? this.formatPhoneCountryCode(countryIso)
      : this.formatPhoneNumber(value, countryValue);

    this.menuOpen = false;
    this.containerFocused = false;

    this.state = {
      supportedCountries: this.formatCountries(supportedCountries, countryValue),
      country: countryValue,
      value: phoneNumber,
      focus: false
    };
  }

  componentDidMount() {
    const { country, value } = this.state;

    if (country) {
      this.triggerCountryChange(country);
    }

    if (value) {
      const countryCode = this.formatPhoneCountryCode(countriesByIso[country]);

      if (value !== countryCode) {
        this.input.validate();
        // onBlur forces the red border to appear when there's an error
        this.input.onBlur({ target: { value }});
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const country = countriesByIso[this.state.country];
    const phoneCountryCode = this.formatPhoneCountryCode(country);
    const value = !_.startsWith(nextProps.value, phoneCountryCode)
      ? phoneCountryCode
      : this.formatPhoneNumber(nextProps.value, this.state.country);

    this.setState({ value });
  }

  validate = (value) => {
    return libphonenumber.isValidNumber(value, this.state.country);
  }

  formatCountries(countries, selected) {
    return _.map(countries, (iso) => {
      const country = countriesByIso[iso];

      return {
        name: country.name,
        value: iso,
        default: iso === selected
      };
    }).sort((a, b) => {
      return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
    });
  }

  formatPhoneCountryCode(config) {
    return config ? `+${config.code}` : '';
  }

  formatPhoneNumber(text, country) {
    return country ? new libphonenumber.asYouType(country).input(text) : '';
  }

  triggerCountryChange(value) {
    this.props.onCountrySelect(value, this.state.value);
  }

  handleCountrySelected = (iso) => {
    if (this.state.country !== iso) {
      const country = countriesByIso[iso];
      const value = this.formatPhoneCountryCode(country);

      this.setState({
        country: iso,
        focus: true,
        value
      });
      this.input.validate();
      this.triggerCountryChange(iso);
    } else {
      this.setState({ focus: true });
    }
  }

  handleFocus = () => {
    this.handleContainerFocus();
    this.setState({ focus: true });
  }

  handleBlur = () => {
    if (!this.menuOpen && !this.containerFocused) {
      this.setState({ focus: false, hover: false });
    }
  }

  handleDropdownBlur = (e) => {
    if (!this.containerFocused) {
      setTimeout(() => {
        this.handleBlur();
        this.input.onBlur(e);
      }, 0);
    }
  }

  handleMouseEnter = () => {
    this.setState({ hover: true });
  }

  handleMouseLeave = () => {
    this.setState({ hover: false });
  }

  handleMenuChange = (opened) => {
    this.menuOpen = opened;
  }

  handleContainerFocus() {
    this.containerFocused = true;
    setTimeout(() => {
      this.containerFocused = false;
    }, 0);
  }

  renderFlag = (country, className) => {
    return country ? <Flag className={className} country={country.iso.toLowerCase()} /> : '';
  }

  renderDropdownOption = (name) => {
    const country = countriesByName[name];
    const nameDeviceStyle = isMobileBrowser() ? styles.dropdownNameMobile : '';
    const nameStyles = `${styles.dropdownName} ${nameDeviceStyle}`;

    return (
      <div className={styles.dropdownOption}>
        {this.renderFlag(country, styles.dropdownFlag)}
        <span className={nameStyles}>{name}</span>
      </div>
    );
  }

  renderSelectionText = (text) => {
    const country = countriesByName[text];
    const flagDeviceStyle = isMobileBrowser() ? styles.selectedFlagMobile : '';
    const flagClasses = `${styles.selectedFlag} ${flagDeviceStyle}`;

    return <span className={styles.selectedFlagContainer}>{this.renderFlag(country, flagClasses)}</span>;
  }

  renderLabel() {
    const landscape = (isMobileBrowser() && isLandscape());
    const portrait = (isMobileBrowser() && !isLandscape());
    let labelOrientationStyle = landscape ? styles.labelLandscape : '';

    labelOrientationStyle = portrait ? styles.labelPortrait : '';

    const fieldLabelClasses = `
      ${styles.label}
      ${labelOrientationStyle}
    `;

    return (
      <div className={fieldLabelClasses}>
        {this.props.label}
        {this.props.required ? '*' : ''}
      </div>
    );
  }

  renderCountryDropdown() {
    const { focus, hover, supportedCountries } = this.state;
    const arrowDeviceStyle = isMobileBrowser() ? styles.arrowMobile : '';
    const arrowStyle = `${styles.arrow} ${arrowDeviceStyle}`;
    const dropdownDeviceStyle = isMobileBrowser() ? styles.dropdownMobile : '';
    const dropdownAttentionStyle = (hover || focus) ? styles.dropdownAttention : '';
    const dropdownInputClasses = `
      ${styles.dropdownInput}
      ${dropdownDeviceStyle}
      ${dropdownAttentionStyle}
    `;

    return (
      <Dropdown
        className={styles.dropdown}
        name='countries'
        fullscreen={isMobileBrowser()}
        options={supportedCountries}
        optionFormat={this.renderDropdownOption}
        selectionFormat={this.renderSelectionText}
        onChange={this.handleCountrySelected}
        containerClassName={styles.dropdownContainer}
        menuContainerClassName={styles.menuContainer}
        arrowClassName={arrowStyle}
        inputClassName={dropdownInputClasses}
        onFocus={this.handleFocus}
        onBlur={this.handleDropdownBlur}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onMenuChange={this.handleMenuChange}
        getFrameDimensions={this.props.getFrameDimensions}
      />
    );
  }

  renderStaticCountry(country) {
    const { hover, focus } = this.state;
    const countryData = { iso: _.get(country, 'value', '') };
    const containerStyles = (hover || focus)
      ? styles.staticCountryContainerActive
      : styles.staticCountryContainer;

    return (
      <div className={containerStyles}>
        {this.renderFlag(countryData, styles.staticCountryImage)}
      </div>
    );
  }

  renderCountryOption() {
    const { supportedCountries } = this.state;
    const singleSupportedCountry = (supportedCountries.length === 1);

    return (singleSupportedCountry)
      ? this.renderStaticCountry(supportedCountries[0])
      : this.renderCountryDropdown();
  }

  render() {
    const { hover, focus, value } = this.state;
    const attentionStyle = (hover || focus) ? styles.attention : '';
    const fieldClasses = `${styles.field} ${attentionStyle}`;
    const focusStyle = focus ? styles.controlsFocus : '';
    const hoverStyle = hover ? styles.controlsHover : '';
    const containerStyle = `${styles.controls} ${focusStyle} ${hoverStyle}`;
    const fieldInputDeviceStyle = isMobileBrowser() ? styles.fieldInputMobile : '';
    const fieldInputStyle = `${styles.fieldInput} ${fieldInputDeviceStyle}`;

    return (
      <div className={styles.container}>
        {this.renderLabel()}
        <div className={containerStyle}>
          {this.renderCountryOption()}
          <Field
            ref={(input) => this.input = input}
            label={this.props.label}
            required={this.props.required}
            value={value}
            type='tel'
            name='phone'
            fieldContainerClasses={styles.fieldContainer}
            fieldClasses={fieldClasses}
            inputClasses={fieldInputStyle}
            labelClasses={styles.fieldLabel}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            validateInput={this.validate} />
        </div>
      </div>
    );
  }
}
