import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { locals as styles } from './Checkbox.sass';
import { Icon } from 'component/Icon';

export class Checkbox extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]).isRequired,
    description: PropTypes.string,
    disabled: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    required: PropTypes.bool,
    type: PropTypes.string
  };

  static defaultProps = {
    description: '',
    disabled: false,
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    required: false,
    type: ''
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      blurred: false,
      checked: false,
      focused: false,
      hasError: false,
      value: 0
    };
  }

  onFocus = () => {
    this.setState({ focused: true });
  }

  onBlur = () => {
    const result = ReactDOM.findDOMNode(this.refs.field);

    this.setState({
      focused: false,
      blurred: true,
      hasError: !result.validity.valid
    });
  }

  onChange = () => {
    const result = ReactDOM.findDOMNode(this.refs.field);
    const value = this.state.value === 1 ? 0 : 1;

    this.setState({
      value,
      hasError: !result.validity.valid
    });
  }

  renderInput = () => {
    let fieldProps = {
      name: this.props.name,
      value: this.state.value,
      required: this.props.required,
      label: this.props.label,
      type: this.props.type,
      disabled: this.props.disabled,
      onChange: this.onChange,
      onBlur: this.onBlur,
      onFocus: this.onFocus,
      ref: 'field'
    };

    return <input {...fieldProps} className={styles.input} />;
  }

  renderCheckbox = () => {
    const focusedClasses = this.state.focused ? styles.focused : '';
    const errorClasses = this.state.hasError && this.state.blurred ? styles.invalid : '';
    const checkedClasses = this.state.value ? '' : 'u-isHiddenVisually';

    return (
      <div className={`${styles.checkboxContainer}`}>
        <div className={`${styles.checkbox} ${focusedClasses} ${errorClasses}`}>
          <Icon type='Icon--check' className={`${checkedClasses}`} />
        </div>
        {this.renderCheckboxLabel()}
      </div>
    );
  }

  renderCheckboxLabel = () => {
    const { label, required } = this.props;
    const requiredLabel = required ? '*' : '';

    return (
      <div className={styles.checkboxCaption}>
        {label}
        {requiredLabel}
      </div>
    );
  }

  render = () => {
    return (
      <div className={styles.container}>
        <label>
          <div className={styles.field}>
            {this.renderInput()}
            {this.renderCheckbox()}
          </div>
          <div className={styles.description}>{this.props.description}</div>
        </label>
      </div>
    );
  }
}
