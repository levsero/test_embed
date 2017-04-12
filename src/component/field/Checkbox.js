import React, { Component, PropTypes } from 'react';

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
    type: PropTypes.string,
    unchecked: PropTypes.bool
  };

  static defaultProps = {
    description: '',
    disabled: false,
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {},
    required: false,
    type: '',
    unchecked: false
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      hasBlurred: false,
      focused: false,
      hasError: false,
      value: 0
    };

    this.input = null;
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextProps.unchecked && nextState.value === 1) return false;

    return true;
  }

  onFocus = () => {
    this.setState({ focused: true });
  }

  onBlur = () => {
    this.setState({
      focused: false,
      hasBlurred: true,
      hasError: !this.input.validity.valid
    });
  }

  onChange = () => {
    const value = this.isChecked() ? 0 : 1;

    this.setState({
      value,
      hasError: !this.input.validity.valid
    });
  }

  isChecked = () => {
    return this.state.value === 1 && !this.props.unchecked;
  }

  renderInput = () => {
    return (
      <input
        ref={(el) => this.input = el}
        name={this.props.name}
        value={this.state.value}
        required={this.props.required}
        label={this.props.label}
        type={this.props.type}
        disabled={this.props.disabled}
        onChange={this.onChange}
        onBlur={this.onBlur}
        onFocus={this.onFocus}
        className={styles.input} />
    );
  }

  renderCheckbox = () => {
    const { focused, hasError, hasBlurred } = this.state;
    const focusedClasses = focused ? styles.focused : '';
    const errorClasses = hasError && hasBlurred ? styles.invalid : '';
    const checkedClasses = this.isChecked() ? '' : styles.checkmarkUnchecked;

    return (
      <div className={`${styles.checkboxContainer}`}>
        <div className={`${styles.checkbox} ${focusedClasses} ${errorClasses}`}>
          <Icon type='Icon--check' className={checkedClasses} />
        </div>
        {this.renderLabel()}
      </div>
    );
  }

  renderLabel = () => {
    const { label, required } = this.props;
    const requiredLabel = required ? '*' : '';

    return (
      <div className={styles.label}>
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
