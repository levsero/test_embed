import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';

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

  renderDropdownArrow = () => {
    const landscape = (isMobileBrowser() && isLandscape());
    const dropdownClasses = classNames({
      'Form-fieldArrows': true,
      'Form-fieldArrows--small': landscape
    });

    return (
      <div className={dropdownClasses}>
        <i className='Icon--dropdownArrow' />
        <i className='Icon--dropdownArrow Icon--dropdownArrowBottom' />
      </div>
    );
  }

  renderInput = () => {
    const sharedProps = {
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      ref: 'field',
      value: this.props.value
    };
    const fieldInputClasses = classNames({
      'u-textSizeBaseMobile': isMobileBrowser()
    });
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
    const portrait = (isMobileBrowser() && !isLandscape());
    const isDropdown = this.props.options.length > 0;
    const isInvalid = this.state.hasError && this.state.blurred;
    const fieldClasses = classNames({
      'Form-field u-isSelectable u-posRelative': true,
      'Form-field--invalid': isInvalid,
      'Form-field--focused': this.state.focused,
      'Form-field--invalidFocused': isInvalid && this.state.focused,
      'Form-field--dropdown': isDropdown,
      'is-mobile': isMobileBrowser(),
      'Form-field--small': landscape
    });
    const fieldLabelClasses = classNames({
      'Form-fieldLabel u-textXHeight': true,
      'u-textSize15': portrait,
      'u-textSizeSml': landscape,
      [this.props.labelClasses]: true
    });

    const dropdownArrow = isDropdown ? this.renderDropdownArrow() : null;
    const showRequiredLabel = this.props.required && !_.isEmpty(this.props.label);

    return (
      <div className={`Form-fieldContainer ${this.props.fieldContainerClasses}`}>
        <label className='Form-fieldContainer u-block'>
          <div className={fieldLabelClasses}>
            {this.props.label}
            {showRequiredLabel ? '*' : ''}
          </div>
          <div className={`${fieldClasses} ${this.props.fieldClasses}`}>
            {this.renderInput()}
            {dropdownArrow}
          </div>
        </label>
        {this.renderDescription()}
      </div>
    );
  }
}
