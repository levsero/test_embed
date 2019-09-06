import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import { getLocale } from 'src/redux/modules/base/base-selectors'
import { InputBox } from 'component/shared/InputBox'
import { i18n } from 'service/i18n'
import {
  questionSubmitted,
  questionValueChanged,
  getInTouchClicked
} from 'src/redux/modules/answerBot/conversation/actions'
import { getCurrentMessage } from 'src/redux/modules/answerBot/root/selectors'
import { PillButton } from 'src/component/shared/PillButton'
import { getContactButtonVisible } from 'src/redux/modules/answerBot/root/selectors'
import { SlideAppear } from 'component/transition/SlideAppear'
import { botUserMessage, botChannelChoice } from 'src/redux/modules/answerBot/root/actions/bot'
import { ThemeProvider } from '@zendeskgarden/react-theming'
import { Icon } from 'component/Icon'
import { IconButton } from '@zendeskgarden/react-buttons'
import { ICONS } from 'constants/shared'

import { locals as styles } from './Footer.scss'
import classNames from 'classnames'

class Footer extends Component {
  static propTypes = {
    currentMessage: PropTypes.string.isRequired,
    questionSubmitted: PropTypes.func.isRequired,
    getInTouchClicked: PropTypes.func.isRequired,
    scrollToBottom: PropTypes.func,
    questionValueChanged: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    showGetInTouch: PropTypes.bool.isRequired,
    botUserMessage: PropTypes.func.isRequired,
    botChannelChoice: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired // eslint-disable-line react/no-unused-prop-types
  }

  static defaultProps = {
    scrollToBottom: () => {},
    isMobile: false
  }

  handleQuestionSubmitted = (...args) => {
    this.props.questionSubmitted(...args)
    this.props.scrollToBottom() // Scroll to visitor's question
  }

  renderDesktop = () => {
    const { currentMessage, questionValueChanged } = this.props
    const placeholder = i18n.t('embeddable_framework.answerBot.inputBox.placeholder')

    return (
      <div>
        {this.renderGetInTouch()}
        <InputBox
          inputValue={currentMessage}
          name="answerBotInputValue"
          placeholder={placeholder}
          updateInputValue={questionValueChanged}
          handleSendInputValue={this.handleSendInputValue}
        />
      </div>
    )
  }

  handleSendInputValue = () => {
    const { currentMessage } = this.props

    if (_.isEmpty(currentMessage)) return

    this.handleQuestionSubmitted(currentMessage)
    this.props.questionValueChanged('')
  }

  renderMobile = () => {
    const { currentMessage, questionValueChanged } = this.props
    const placeholder = i18n.t('embeddable_framework.answerBot.inputBox.placeholder')

    return (
      <div>
        {this.renderGetInTouch()}
        <div className={styles.containerMobile}>
          <div className={styles.inputContainerMobile}>
            <InputBox
              inputValue={currentMessage}
              name="answerBotInputValue"
              placeholder={placeholder}
              updateInputValue={questionValueChanged}
              handleSendInputValue={this.handleSendInputValue}
              isMobile={true}
            />
          </div>
          {this.renderSend()}
        </div>
      </div>
    )
  }

  renderGetInTouch = () => {
    const containerClasses = classNames(styles.slideAppear, {
      [styles.slideAppearMobile]: this.props.isMobile
    })

    return (
      <SlideAppear
        trigger={this.props.showGetInTouch}
        duration={200}
        transitionOnMount={true}
        startPosHeight={'-10px'}
        endPosHeight={'0px'}
        className={containerClasses}
      >
        <div className={styles.quickReplyContainer}>
          <PillButton
            className={styles.getInTouch}
            label={i18n.t('embeddable_framework.answerBot.button.get_in_touch')}
            onClick={this.handleGetInTouchClicked}
          />
        </div>
      </SlideAppear>
    )
  }

  handleGetInTouchClicked = () => {
    this.props.getInTouchClicked()
    this.props.botUserMessage('embeddable_framework.answerBot.button.get_in_touch')
    this.props.botChannelChoice('embeddable_framework.answerBot.msg.channel_choice.get_in_touch')
  }

  renderSend = () => {
    const containerClasses = classNames(styles.button, styles.iconSendAnswerBotMobile)

    return (
      <ThemeProvider>
        <IconButton
          size="large"
          aria-label={i18n.t('embeddable_framework.submitTicket.form.submitButton.label.send')}
          className={containerClasses}
          onClick={this.handleSendInputValue}
        >
          <Icon type={ICONS.SEND_CHAT} />
        </IconButton>
      </ThemeProvider>
    )
  }

  render = () => {
    return this.props.isMobile ? this.renderMobile() : this.renderDesktop()
  }
}

const mapStateToProps = state => {
  return {
    currentMessage: getCurrentMessage(state),
    showGetInTouch: getContactButtonVisible(state),
    locale: getLocale(state)
  }
}

const actionCreators = {
  questionSubmitted,
  questionValueChanged,
  getInTouchClicked,
  botUserMessage,
  botChannelChoice
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  // pure needs to be false to avoid a bug where the cursor jumps to end of input box on every update
  { forwardRef: true, pure: false }
)(Footer)

export { connectedComponent as default, Footer as Component }
