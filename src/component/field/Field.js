import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';

import { isMobileBrowser,
         isLandscape,
         isIos } from 'utility/devices';
import { Icon } from 'component/Icon';

export class Field extends Component {
  static propTypes = {
    label: (props, propName, componentName) => {
      if (props.type === 'checkbox' && !props[propName]) {
        return new Error(`${componentName} must have a label prop if type is set to "checkbox"`);
      }
    },
    name: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired,
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    disableAutoComplete: PropTypes.bool,
    disabled: PropTypes.bool,
    hasSearched: PropTypes.bool,
    input: PropTypes.element,
    labelClasses: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    options: PropTypes.array,
    pattern: PropTypes.string,
    placeholder: PropTypes.string,
    required: PropTypes.bool,
    step: PropTypes.string,
    type: PropTypes.string
  };

  static defaultProps = {
    disableAutoComplete: false,
    disabled: false,
    hasSearched: false,
    input: null,
    labelClasses: '',
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    options: [],
    pattern: '',
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
    const isCheckbox = (this.props.type === 'checkbox');
    const fieldInputClasses = classNames({
      'Form-checkboxInput u-isHiddenVisually': isCheckbox,
      'Form-checkboxInput--focused': this.state.focused && isCheckbox,
      'Form-checkboxInput--invalid': this.state.hasError && this.state.blurred && isCheckbox,
      'u-textSizeBaseMobile': isMobileBrowser()
    });
    let fieldProps = {
      name: this.props.name,
      value: this.props.value,
      required: this.props.required,
      label: this.props.label,
      type: this.props.type,
      step: this.props.step,
      disabled: this.props.disabled
    };

    if (isIos()) {
      fieldProps = _.extend(fieldProps, {
        autoCorrect: 'off',
        autoComplete: 'off',
        spellCheck: 'false'
      });
    }

    if (this.props.disableAutoComplete) {
      fieldProps = _.extend(fieldProps, {
        autoComplete: 'off'
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

  render = () => {
    const landscape = (isMobileBrowser() && isLandscape());
    const portrait = (isMobileBrowser() && !isLandscape());
    const isCheckbox = (this.props.type === 'checkbox');
    const isDropdown = this.props.options.length > 0;
    const fieldClasses = classNames({
      'Form-field u-isSelectable u-posRelative': true,
      'Form-field--invalid': this.state.hasError && this.state.blurred && !isCheckbox,
      'Form-field--focused': this.state.focused && !isCheckbox,
      'Form-field--dropdown': isDropdown,
      'Form-field--clean': isCheckbox,
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

    return (
      <label className='Form-fieldContainer u-block'>
        <div className={fieldLabelClasses}>
          {isCheckbox ? '' : this.props.placeholder}
          {this.props.required && !isCheckbox ? '*' : ''}
        </div>
        <div className={fieldClasses}>
          {this.renderInput()}
          {
            (isCheckbox)
              ? <div className='Form-checkbox u-pullLeft u-posRelative u-isActionable'>
                  <Icon type='Icon--check' />
                </div>
              : null
          }
          {
            (this.props.label)
              ? <span className='Form-checkboxCaption u-nbfc u-isActionable u-block'>
                {this.props.label}{isCheckbox && this.props.required ? '*' : ''}
                </span>
              : null
          }
          {dropdownArrow}
        </div>
      </label>
    );
  }
}
