import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Linkify from 'react-linkify'

import { MessageOptions } from 'component/shared/MessageOptions'
import { i18n } from 'src/apps/webWidget/services/i18n'
import { TEST_IDS } from 'src/constants/shared'

import { locals as styles } from './MessageBubble.scss'

export class MessageBubble extends Component {
  static propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
    translatedMessage: PropTypes.string,
    options: PropTypes.array,
    handleSendMsg: PropTypes.func,
    'data-testid': PropTypes.string.isRequired
  }

  static defaultProps = {
    options: [],
    handleSendMsg: () => {},
    translatedMessage: ''
  }

  constructor(props) {
    super(props)

    this.state = {
      userWantOriginalMessage: undefined
    }
  }

  renderOptions = () => {
    const { handleSendMsg, options } = this.props

    return options.length ? (
      <MessageOptions
        isMessageBubbleLinked={true}
        onOptionClick={handleSendMsg}
        optionItems={options}
      />
    ) : null
  }

  showTranslation = () => {
    return (
      (this.props.translatedMessage && this.state.userWantOriginalMessage === undefined) ||
      this.state.userWantOriginalMessage
    )
  }

  renderTranslateLink = () => {
    if (!this.props.translatedMessage) return null

    const showTranslationText = this.showTranslation()
    const translateText = showTranslationText
      ? i18n.t('embeddable_framework.chat.show_original')
      : i18n.t('embeddable_framework.chat.show_translated')
    const onTranslatedMessageClick = () => {
      this.setState({
        userWantOriginalMessage: !showTranslationText
      })
    }

    return (
      <button
        data-testid={TEST_IDS.TRANSLATE_LINK}
        className={styles.translateLink}
        onClick={onTranslatedMessageClick}
      >
        {translateText}
      </button>
    )
  }

  renderMessage = () => {
    if (!this.showTranslation()) {
      return this.props.message
    }
    return this.props.translatedMessage
  }

  render() {
    const messageBubbleClasses = this.props.options.length
      ? styles.messageBubbleWithOptions
      : styles.messageBubble

    return (
      <div data-testid={this.props['data-testid']}>
        <div className={`${messageBubbleClasses} ${this.props.className}`}>
          <Linkify properties={{ className: styles.link, target: '_blank' }}>
            {this.renderMessage()}
          </Linkify>
          {this.renderTranslateLink()}
        </div>
        {this.renderOptions()}
      </div>
    )
  }
}
