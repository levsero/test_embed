import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';

import { isMobileBrowser,
         isLandscape,
         isIos } from 'utility/devices';
import { Icon } from 'component/Icon';

export class Field extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      focused: false,
      blurred: false,
      hasError: false,
      dirty: false,
      value: props.value
    };
  }

  onFocus = (e) => {
    const { onFocus } = this.props;

    this.setState({ focused: true });

    if (onFocus) onFocus(e);
  }

  onBlur = (e) => {
    const { onBlur } = this.props;
    const result = ReactDOM.findDOMNode(this.refs.field);

    this.setState({
      focused: false,
      blurred: true,
      hasError: !result.validity.valid,
      dirty: !this.state.value
    });

    if (onBlur) onBlur(e);
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

Field.propTypes = {
  name: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  input: PropTypes.element,
  required: PropTypes.bool,
  label: (props, propName, componentName) => {
    if (props.type === 'checkbox' && !props[propName]) {
      return new Error(`${componentName} must have a label prop if type is set to "checkbox"`);
    }
  },
  type: PropTypes.string,
  options: PropTypes.array,
  hasSearched: PropTypes.bool,
  labelClasses: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  step: PropTypes.string,
  pattern: PropTypes.string,
  disabled: PropTypes.bool
};

Field.defaultProps = {
  placeholder: '',
  value: '',
  input: null,
  required: false,
  type: '',
  options: [],
  hasSearched: false,
  labelClasses: '',
  onFocus: () => {},
  onBlur: () => {},
  onChange: () => {},
  step: '',
  pattern: '',
  disabled: false
};
