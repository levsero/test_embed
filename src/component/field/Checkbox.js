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

    this.field = null;
  }

  onFocus = () => {
    this.setState({ focused: true });
  }

  onBlur = () => {
    const result = ReactDOM.findDOMNode(this.input);

    this.setState({
      focused: false,
      blurred: true,
      hasError: !result.validity.valid
    });
  }

  onChange = () => {
    const result = ReactDOM.findDOMNode(this.input);
    const value = this.state.value === 1 ? 0 : 1;

    this.setState({
      value,
      hasError: !result.validity.valid
    });
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
    const { focused, hasError, blurred, value } = this.state;
    const focusedClasses = focused ? styles.focused : '';
    const errorClasses = hasError && blurred ? styles.invalid : '';
    const checkedClasses = value ? '' : styles.checkmark;

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
