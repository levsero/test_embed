import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Dropdown } from 'component/field/Dropdown';
import { Field } from 'component/field/Field';
import { Flag } from 'component/Flag';
import { isMobileBrowser,
         isLandscape } from 'utility/devices';

import { countriesByIso, countriesByName } from './talkCountries';
import { locals as styles } from './TalkPhoneField.sass';

const libphonenumber = require('libphonenumber-js');

export class TalkPhoneField extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    label: PropTypes.string,
    required: PropTypes.bool,
    getFrameDimensions: PropTypes.func,
    supportedCountries: PropTypes.array.isRequired
  };

  static defaultProps = {
    label: '',
    required: false,
    value: '',
    getFrameDimensions: () => {}
  };

  constructor(props) {
    super(props);
    const { value, supportedCountries } = props;
    const { country } = libphonenumber.parse(value);

    this.state = {
      country: country,
      disabled: _.isEmpty(value),
      value: this.formatPhoneNumber(value, country),
      focus: false,
      supportedCountries: this.formatCountries(supportedCountries, country)
    };
  }

  componentWillReceiveProps(nextProps) {
    const country = countriesByIso[this.state.country];
    const phoneCountryCode = this.formatPhoneCountryCode(country);

    const value = !_.startsWith(nextProps.value, phoneCountryCode)
      ? phoneCountryCode
      : this.formatPhoneNumber(nextProps.value, this.state.country);

    this.setState({ value });
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
    return `+${config.code}`;
  }

  formatPhoneNumber(text, country) {
    return new libphonenumber.asYouType(country).input(text);
  }

  renderFlag(country, className) {
    return country ? <Flag className={className} country={country.iso.toLowerCase()} /> : '';
  }

  renderDropdownOption = (name) => {
    const country = countriesByName[name];

    return (
      <div className={styles.dropdownOption}>
        {this.renderFlag(country, styles.dropdownFlag)}
        <span className={styles.dropdownName}>{name}</span>
      </div>
    );
  }

  renderSelectionText = (text) => {
    const country = countriesByName[text];

    return <span>&nbsp;{this.renderFlag(country, styles.selectedFlag)}</span>;
  }

  handleCountrySelected = (iso) => {
    if (this.state.country !== iso) {
      const country = countriesByIso[iso];

      this.setState({
        disabled: false,
        country: iso,
        focus: true,
        value: this.formatPhoneCountryCode(country)
      });
    } else {
      this.setState({ focus: true });
    }
  }

  handleFocus = () => {
    this.setState({ focus: true });
  }

  handleBlur = () => {
    this.setState({ focus: false, hover: false });
  }

  handleMouseEnter = () => {
    this.setState({ hover: true });
  }

  handleMouseLeave = () => {
    this.setState({ hover: false });
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

  render() {
    const { hover, focus, supportedCountries, value, disabled } = this.state;
    const dropdownDeviceStyle = isMobileBrowser() ? styles.dropdownMobile : '';
    const dropdownAttentionStyle = (hover || focus) ? styles.dropdownAttention : '';
    const attentionStyle = (hover || focus) ? styles.attention : '';
    const dropdownInputClasses = `
      ${styles.dropdownInput}
      ${dropdownDeviceStyle}
      ${dropdownAttentionStyle}
    `;
    const fieldClasses = `
      ${styles.field}
      ${attentionStyle}
    `;
    const focusStyle = focus ? styles.controlsFocus : '';
    const hoverStyle = hover ? styles.controlsHover : '';
    const containerStyle = `${focusStyle} ${hoverStyle}`;

    return (
      <div className={styles.container}>
        {this.renderLabel()}
        <div className={containerStyle}>
          <Dropdown
            className={styles.dropdown}
            name='countries'
            options={supportedCountries}
            optionFormat={this.renderDropdownOption}
            selectionTextFormat={this.renderSelectionText}
            onChange={this.handleCountrySelected}
            containerClassName={styles.dropdownContainer}
            menuContainerClassName={styles.menuContainer}
            inputClassName={dropdownInputClasses}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            getFrameDimensions={this.props.getFrameDimensions}
          />
          <Field
            label={this.props.label}
            required={this.props.required}
            value={value}
            type='tel'
            name='phone'
            disabled={disabled}
            fieldContainerClasses={styles.fieldContainer}
            fieldClasses={fieldClasses}
            labelClasses={styles.fieldLabel}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
            validateInput={libphonenumber.isValidNumber} />
        </div>
      </div>
    );
  }
}
