import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { locals as styles } from './Field.scss';
import { isMobileBrowser,
         isLandscape,
         isIos } from 'utility/devices';

export class Field extends Component {
  static propTypes = {
    name: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired,
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    description: PropTypes.string,
    disabled: PropTypes.bool,
    hasSearched: PropTypes.bool,
    input: PropTypes.element,
    fieldContainerClasses: PropTypes.string,
    labelClasses: PropTypes.string,
    fieldClasses: PropTypes.string,
    inputClasses: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    pattern: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    step: PropTypes.string,
    type: PropTypes.string,
    validateInput: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func
  };

  static defaultProps = {
    description: '',
    disabled: false,
    hasSearched: false,
    input: null,
    fieldContainerClasses: '',
    labelClasses: '',
    fieldClasses: '',
    inputClasses: '',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    pattern: '',
    label: '',
    placeholder: '',
    required: false,
    step: '',
    type: '',
    value: '',
    validateInput: () => true,
    onMouseEnter: () => {},
    onMouseLeave: () => {}
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      blurred: false,
      dirty: false,
      focused: false,
      hasError: false,
      value: props.value
    };

    this.input = null;
  }

  onFocus = (e) => {
    this.setState({ focused: true });

    this.props.onFocus(e);
  }

  onBlur = (e) => {
    const result = this.input;

    this.setState({
      focused: false,
      blurred: true,
      hasError: !result.validity.valid,
      dirty: !this.state.value
    });

    this.props.onBlur(e);
  }

  onMouseEnter = (e) => {
    this.props.onMouseEnter(e);
  }

  onMouseLeave = (e) => {
    this.props.onMouseLeave(e);
  }

  onChange = (e) => {
    this.validate(e.target.value);

    if (this.props.onChange) {
      e.persist();
      this.props.onChange(e);
    }
  }

  validate = (val) => {
    const result = this.input;
    const value = val || this.input.value;
    const validator = this.props.validateInput;

    // Setting custom validity to empty string when input is valid allows the input field to be set to valid.
    // Source: https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/setCustomValidity
    if (validator(value)) {
      result.setCustomValidity('');
      this.setState({
        value: value,
        hasError: false
      });
    } else {
      result.setCustomValidity('Error'); // TODO: Customize error.
      this.setState({
        value: value,
        hasError: true
      });
    }
  }

  renderInput = () => {
    const sharedProps = {
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      ref: (element) => this.input = element,
      value: this.props.value
    };
    const fieldInputDeviceClasses = isMobileBrowser() ? styles.fieldInputMobile : '';
    const fieldInputClasses = `
      ${fieldInputDeviceClasses}
      ${this.props.inputClasses}
    `;
    let fieldProps = {
      name: this.props.name,
      value: this.props.value,
      required: this.props.required,
      type: this.props.type,
      step: this.props.step,
      disabled: this.props.disabled,
      placeholder: this.props.placeholder,
      autoComplete: 'off'
    };

    if (isIos()) {
      fieldProps = _.extend(fieldProps, {
        autoCorrect: 'off',
        spellCheck: 'false'
      });
    }

    if (this.props.pattern !== '') {
      fieldProps = _.extend(fieldProps, {
        pattern: this.props.pattern
      });
    }

    return (this.props.input)
         ? React.cloneElement(
             this.props.input,
             _.extend({}, sharedProps, fieldProps, { className: fieldInputClasses })
           )
         : <input {...sharedProps} {...fieldProps} className={fieldInputClasses} />;
  }

  renderDescription = () => {
    return (this.props.description !== '')
         ? <div className={styles.description}>{this.props.description}</div>
         : null;
  }

  render = () => {
    const landscape = (isMobileBrowser() && isLandscape());
    const portrait = (isMobileBrowser() && !isLandscape());
    const isInvalid = this.state.hasError && this.state.blurred;
    const orientationStyle = landscape ? styles.landscape : '';
    const invalidStyle = isInvalid ? styles.invalid : '';
    const focusedStyle = this.state.focused ? styles.focused : '';
    const invalidFocusedStyle = isInvalid && this.state.focused ? styles.invalidFocused : '';
    const deviceStyle = isMobileBrowser() ? styles.mobile : '';
    const fieldClasses = `
      ${styles.field}
      ${invalidStyle}
      ${focusedStyle}
      ${invalidFocusedStyle}
      ${deviceStyle}
      ${orientationStyle}
    `;
    let labelOrientationStyle = landscape ? styles.labelLandscape : '';

    labelOrientationStyle = portrait ? styles.labelPortrait : '';

    const fieldLabelClasses = `
      ${styles.label}
      ${labelOrientationStyle}
      ${this.props.labelClasses}
    `;

    const showRequiredLabel = this.props.required && !_.isEmpty(this.props.label);

    return (
      <div
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        className={`${styles.container} ${this.props.fieldContainerClasses}`}>
        <label className={styles.labelContainer}>
          <div className={fieldLabelClasses}>
            {this.props.label}
            {showRequiredLabel ? '*' : ''}
          </div>
          <div className={`${fieldClasses} ${this.props.fieldClasses}`}>
            {this.renderInput()}
          </div>
        </label>
        {this.renderDescription()}
      </div>
    );
  }
}
