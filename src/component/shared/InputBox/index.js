import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, Label, Textarea } from '@zendeskgarden/react-textfields';

import { keyCodes } from 'utility/keyboard';

import { locals as styles } from './InputBox.scss';
import classNames from 'classnames';

export class InputBox extends Component {
  static propTypes = {
    inputValue: PropTypes.string,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    handleSendInputValue: PropTypes.func.isRequired,
    updateInputValue: PropTypes.func,
    disabled: PropTypes.bool,
    isMobile: PropTypes.bool
  };

  static defaultProps = {
    inputValue: '',
    disabled: false,
    updateInputValue: () => {},
    isMobile: false
  };

  handleKeyDown = (e) => {
    if (e.keyCode === keyCodes.ENTER && !e.shiftKey) {
      e.preventDefault();
      this.props.handleSendInputValue();
    }
  }

  handleInputValueChanged = (e) => {
    const { value } = e.target;

    this.props.updateInputValue(value);
  }

  render = () => {
    const { placeholder, name, inputValue, disabled, isMobile } = this.props;
    const fieldClasses = classNames(styles.textField, {
      [styles.fieldDisabled]: disabled
    });
    const inputClasses = classNames(
      styles.input,
      {
        [styles.inputMobile]: this.props.isMobile,
        [styles.fieldMobile]: this.props.isMobile,
        [styles.inputDisabled]: disabled
      }
    );

    return (
      <TextField className={fieldClasses}>
        <Label className={styles.label}>
          {placeholder}
        </Label>
        <Textarea
          value={inputValue}
          disabled={disabled}
          onChange={this.handleInputValueChanged}
          onKeyDown={this.handleKeyDown}
          className={inputClasses}
          placeholder={placeholder}
          name={name}
          rows={isMobile ? 1 : 3} />
      </TextField>
    );
  };
}
