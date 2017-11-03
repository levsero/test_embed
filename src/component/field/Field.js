import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import { locals as styles } from './Field.sass';
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
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    options: PropTypes.array,
    pattern: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    step: PropTypes.string,
    type: PropTypes.string
  };

  static defaultProps = {
    description: '',
    disabled: false,
    hasSearched: false,
    input: null,
    fieldContainerClasses: '',
    labelClasses: '',
    fieldClasses: '',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    options: [],
    pattern: '',
    label: '',
    placeholder: '',
    required: false,
    step: '',
    type: '',
    value: ''
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
  }

  onFocus = (e) => {
    this.setState({ focused: true });

    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  onBlur = (e) => {
    const result = ReactDOM.findDOMNode(this.refs.field);

    this.setState({
      focused: false,
      blurred: true,
      hasError: !result.validity.valid,
      dirty: !this.state.value
    });

    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  onChange = (e) => {
    const value = e.target.value;
    const result = ReactDOM.findDOMNode(this.refs.field);

    this.setState({
      value: value,
      hasError: !result.validity.valid
    });

    if (this.props.onChange) {
      e.persist();
      this.props.onChange(e);
    }
  }

  renderInput = () => {
    const sharedProps = {
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      ref: 'field',
      value: this.props.value
    };
    const deviceStyle = isMobileBrowser() ? styles.fieldInputMobile : '';
    const fieldInputClasses = deviceStyle;
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
         ? <div className='Form-description u-textAluminum'>{this.props.description}</div>
         : null;
  }

  render = () => {
    const landscape = (isMobileBrowser() && isLandscape());
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
    const labelOrientationStyle = landscape ? styles.labelLandscape : styles.labelPortrait;
    const fieldLabelClasses = `
      ${styles.label}
      ${labelOrientationStyle}
      ${this.props.labelClasses}
    `;

    const showRequiredLabel = this.props.required && !_.isEmpty(this.props.label);

    return (
      <div className={`${styles.container} ${this.props.fieldContainerClasses}`}>
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
