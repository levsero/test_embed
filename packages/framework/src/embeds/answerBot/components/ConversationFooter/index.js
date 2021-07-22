import _ from 'lodash'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'
import ZendeskLogo from 'components/ZendeskLogo'
import { i18n } from 'src/apps/webWidget/services/i18n'
import {
  questionSubmitted,
  questionValueChanged,
  getInTouchClicked,
} from 'src/embeds/answerBot/actions/conversation'
import { botUserMessage, botChannelChoice } from 'src/embeds/answerBot/actions/root/bot'
import GetInTouch from 'src/embeds/answerBot/components/GetInTouch'
import InputBox from 'src/embeds/answerBot/components/InputBox'
import MobileInputBox from 'src/embeds/answerBot/components/MobileInputBox'
import { getContactButtonVisible, getCurrentMessage } from 'src/embeds/answerBot/selectors/root'
import { getLocale } from 'src/redux/modules/base/base-selectors'
import { Footer, LogoContainer, SlideAppear } from './styles'

class ConversationFooter extends Component {
  static propTypes = {
    hideZendeskLogo: PropTypes.bool,
    currentMessage: PropTypes.string.isRequired,
    questionSubmitted: PropTypes.func.isRequired,
    getInTouchClicked: PropTypes.func.isRequired,
    scrollToBottom: PropTypes.func,
    questionValueChanged: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    showGetInTouch: PropTypes.bool.isRequired,
    botUserMessage: PropTypes.func.isRequired,
    botChannelChoice: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
  }

  static defaultProps = {
    scrollToBottom: () => {},
    isMobile: false,
    hideZendeskLogo: false,
  }

  handleQuestionSubmitted = (...args) => {
    this.props.questionSubmitted(...args)
    this.props.scrollToBottom() // Scroll to visitor's question
  }

  renderDesktop = () => {
    const { currentMessage, questionValueChanged } = this.props
    const placeholder = i18n.t('embeddable_framework.answerBot.inputBox.placeholder')

    return (
      <Footer>
        {this.renderGetInTouch()}
        <InputBox
          inputValue={currentMessage}
          name="answerBotInputValue"
          placeholder={placeholder}
          updateInputValue={questionValueChanged}
          handleSendInputValue={this.handleSendInputValue}
        />
        {this.renderZendeskLogo()}
      </Footer>
    )
  }

  handleSendInputValue = () => {
    const { currentMessage } = this.props

    if (_.isEmpty(currentMessage)) return

    this.handleQuestionSubmitted(currentMessage)
    this.props.questionValueChanged('')
  }

  renderZendeskLogo = () => {
    return this.props.hideZendeskLogo ? null : (
      <LogoContainer>
        <ZendeskLogo />
      </LogoContainer>
    )
  }

  renderMobile = () => {
    const { currentMessage, questionValueChanged } = this.props
    const placeholder = i18n.t('embeddable_framework.answerBot.inputBox.placeholder')

    return (
      <Footer size="minimal">
        {this.renderGetInTouch()}
        {this.renderZendeskLogo()}
        <MobileInputBox
          inputValue={currentMessage}
          name="answerBotInputValue"
          placeholder={placeholder}
          updateInputValue={questionValueChanged}
          handleSendInputValue={this.handleSendInputValue}
        />
      </Footer>
    )
  }

  renderGetInTouch = () => {
    return (
      <SlideAppear
        trigger={this.props.showGetInTouch}
        duration={200}
        transitionOnMount={true}
        startPosHeight={'-10px'}
        endPosHeight={'0px'}
      >
        <GetInTouch onClick={this.handleGetInTouchClicked} />
      </SlideAppear>
    )
  }

  handleGetInTouchClicked = () => {
    this.props.getInTouchClicked()
    this.props.botUserMessage('embeddable_framework.answerBot.button.get_in_touch')
    this.props.botChannelChoice('embeddable_framework.answerBot.msg.channel_choice.get_in_touch')
  }

  render = () => {
    return this.props.isMobile ? this.renderMobile() : this.renderDesktop()
  }
}

const mapStateToProps = (state) => {
  return {
    currentMessage: getCurrentMessage(state),
    showGetInTouch: getContactButtonVisible(state),
    locale: getLocale(state),
  }
}

const actionCreators = {
  questionSubmitted,
  questionValueChanged,
  getInTouchClicked,
  botUserMessage,
  botChannelChoice,
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  // pure needs to be false to avoid a bug where the cursor jumps to end of input box on every update
  { forwardRef: true, pure: false }
)(ConversationFooter)

export { connectedComponent as default, ConversationFooter as Component }
