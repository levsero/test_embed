import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, Label, Textarea } from '@zendeskgarden/react-forms'

import { i18n } from 'service/i18n'
import { keyCodes } from 'utility/keyboard'
import { isIos } from 'utility/devices'
import { TEST_IDS } from 'src/constants/shared'

import { locals as styles } from './ChatBox.scss'
import classNames from 'classnames'

export class ChatBox extends Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    currentMessage: PropTypes.string,
    sendChat: PropTypes.func.isRequired,
    handleChatBoxChange: PropTypes.func.isRequired
  }

  static defaultProps = {
    currentMessage: ''
  }

  constructor(props) {
    super(props)
    this.isIos = isIos()
  }

  handleKeyDown = e => {
    if (e.keyCode === keyCodes.ENTER && !e.shiftKey) {
      e.preventDefault()
      this.props.sendChat()
    }
  }

  handleChange = e => {
    const { value } = e.target

    this.props.handleChatBoxChange(value)
  }

  handleInput = () => {
    const locale = i18n.getLocale()

    if (this.isIos && /^ja/.test(locale) && this.textArea.scrollIntoViewIfNeeded) {
      this.textArea.scrollIntoViewIfNeeded()
    }
  }

  render = () => {
    const placeholder = i18n.t('embeddable_framework.chat.chatBox.placeholder.typeMessageHere_v2')
    const inputClasses = classNames(styles.input, {
      [styles.inputMobile]: this.props.isMobile,
      [styles.fieldMobile]: this.props.isMobile
    })

    return (
      <div className={styles.container}>
        <Field>
          <Label className={styles.label}>{placeholder}</Label>
          <Textarea
            ref={el => (this.textArea = el)}
            value={this.props.currentMessage}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            onInput={this.handleInput}
            className={inputClasses}
            placeholder={placeholder}
            name="chatBox"
            rows={this.props.isMobile ? 1 : 3}
            data-testid={TEST_IDS.MESSAGE_FIELD}
          />
        </Field>
      </div>
    )
  }
}
