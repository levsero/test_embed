import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, Label, Textarea } from '@zendeskgarden/react-forms'
import { TEST_IDS } from 'src/constants/shared'
import { keyCodes } from 'utility/keyboard'

import { locals as styles } from './InputBox.scss'
import classNames from 'classnames'

export class InputBox extends Component {
  static propTypes = {
    inputValue: PropTypes.string,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired,
    handleSendInputValue: PropTypes.func.isRequired,
    updateInputValue: PropTypes.func,
    disabled: PropTypes.bool,
    isMobile: PropTypes.bool
  }

  static defaultProps = {
    inputValue: '',
    disabled: false,
    updateInputValue: () => {},
    isMobile: false
  }

  handleKeyDown = e => {
    if (e.keyCode === keyCodes.ENTER && !e.shiftKey) {
      e.preventDefault()
      this.props.handleSendInputValue()
    }
  }

  handleInputValueChanged = e => {
    const { value } = e.target

    this.props.updateInputValue(value)
  }

  render = () => {
    const { placeholder, name, inputValue, disabled, isMobile } = this.props
    const inputClasses = classNames(styles.textField, styles.input, {
      [styles.inputMobile]: this.props.isMobile,
      [styles.fieldMobile]: this.props.isMobile,
      [styles.fieldDisabled]: disabled
    })

    return (
      <Field>
        <Label className={styles.label}>{placeholder}</Label>
        <Textarea
          value={inputValue}
          disabled={disabled}
          onChange={this.handleInputValueChanged}
          onKeyDown={this.handleKeyDown}
          className={inputClasses}
          placeholder={placeholder}
          name={name}
          rows={isMobile ? 1 : 3}
          data-testid={TEST_IDS.MESSAGE_FIELD}
        />
      </Field>
    )
  }
}
