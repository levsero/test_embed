import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { keyCodes } from 'utility/keyboard'
import { shouldRenderErrorMessage, renderLabel } from 'src/util/fields'
import { i18n } from 'service/i18n'
import {
  EMAIL_TRANSCRIPT_SUCCESS_SCREEN,
  EMAIL_TRANSCRIPT_FAILURE_SCREEN,
  EMAIL_TRANSCRIPT_SCREEN,
  EMAIL_TRANSCRIPT_LOADING_SCREEN
} from 'src/redux/modules/chat/chat-screen-types'
import { ICONS, EMAIL_PATTERN } from 'constants/shared'
import { locals as styles } from 'component/chat/ChatEmailTranscriptPopup.scss'
import { emailValid } from 'src/util/utils'
import { LoadingSpinner } from 'component/loading/LoadingSpinner'
import { Field, Label, Input, Message } from '@zendeskgarden/react-forms'
import { Icon } from 'src/component/Icon'
import _ from 'lodash'
import ChatModal, { ModalActions } from 'embeds/chat/components/ChatModal'
import { Button } from '@zendeskgarden/react-buttons'

export class ChatEmailTranscriptPopup extends Component {
  static propTypes = {
    leftCtaFn: PropTypes.func,
    rightCtaFn: PropTypes.func,
    visitor: PropTypes.object,
    emailTranscript: PropTypes.object,
    tryEmailTranscriptAgain: PropTypes.func,
    resetEmailTranscript: PropTypes.func
  }

  static defaultProps = {
    className: '',
    leftCtaFn: () => {},
    rightCtaFn: () => {},
    visitor: {},
    emailTranscript: {},
    tryEmailTranscriptAgain: () => {},
    show: false,
    isMobile: false,
    resetEmailTranscript: () => {}
  }

  constructor(props) {
    super(props)

    const email = props.emailTranscript.email || _.get(props.visitor, 'email', '')

    this.state = {
      valid: emailValid(email),
      formState: { email },
      showErrors: false
    }

    this.form = null

    this.emailInput = React.createRef()
  }

  componentDidMount() {
    if (this.props.emailTranscript.screen === EMAIL_TRANSCRIPT_SCREEN) {
      this.focusInput()
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.emailTranscript.screen !== EMAIL_TRANSCRIPT_SCREEN &&
      this.props.emailTranscript.screen === EMAIL_TRANSCRIPT_SCREEN
    ) {
      this.focusInput()
    }
  }

  focusInput() {
    if (this.emailInput.current) {
      this.emailInput.current.focus()
    }
  }

  handleSave = e => {
    const email = this.props.emailTranscript.email || _.get(this.props.visitor, 'email', '')

    e.preventDefault()

    if (!this.state.valid) {
      this.setState({ showErrors: true })
      return
    }

    this.props.rightCtaFn(this.state.formState.email)

    this.setState({
      valid: emailValid(email),
      formState: { email },
      showErrors: false
    })
  }

  handleKeyPress = e => {
    if (e.charCode === keyCodes.ENTER && !e.shiftKey) {
      e.preventDefault()
      this.handleSave(e)
    }
  }

  handleFormChange = e => {
    const { name, value } = e.target
    const fieldState = { [name]: value }

    this.setState({
      valid: emailValid(fieldState.email),
      formState: { ...this.state.formState, ...fieldState }
    })
  }

  renderEmailField = () => {
    const value = this.state.formState.email
    const error = shouldRenderErrorMessage(value, true, this.state.showErrors, EMAIL_PATTERN) ? (
      <Message validation="error">{i18n.t('embeddable_framework.validation.error.email')}</Message>
    ) : null

    /* eslint-disable max-len */
    return (
      <div className={styles.field}>
        <Field>
          {renderLabel(Label, i18n.t('embeddable_framework.common.textLabel.email'), true)}
          <Input
            required={true}
            defaultValue={this.state.formState.email}
            onKeyPress={this.handleKeyPress}
            name="email"
            validation={error ? 'error' : undefined}
            pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?"
            ref={this.emailInput}
          />
          {error}
        </Field>
      </div>
    )
    /* eslint-enable max-len */
  }

  renderFormScreen = () => {
    if (this.props.emailTranscript.screen !== EMAIL_TRANSCRIPT_SCREEN) return null

    return (
      <form
        ref={element => (this.form = element)}
        className={styles.form}
        noValidate={true}
        onChange={this.handleFormChange}
        onSubmit={e => {
          e.preventDefault()
        }}
      >
        {this.renderEmailField()}

        <ModalActions>
          <Button onClick={this.props.leftCtaFn}>
            {i18n.t('embeddable_framework.common.button.cancel')}
          </Button>
          <Button onClick={this.handleSave} primary={true}>
            {i18n.t('embeddable_framework.common.button.send')}
          </Button>
        </ModalActions>
      </form>
    )
  }

  renderResultScreen = (resultContent, iconType = 'Icon--checkmark-fill') => {
    return (
      <div className={styles.resultScreen}>
        <div className={styles.resultIcon}>
          <Icon type={iconType} />
        </div>
        {resultContent}
      </div>
    )
  }

  renderSuccessScreen = () => {
    if (this.props.emailTranscript.screen !== EMAIL_TRANSCRIPT_SUCCESS_SCREEN) return null

    const successLabel = i18n.t('embeddable_framework.chat.emailtranscript.success_message', {
      email: `<strong>${this.props.emailTranscript.email}</strong>`
    })
    const message = (
      <div className={styles.resultMessage} dangerouslySetInnerHTML={{ __html: successLabel }} />
    )

    return this.renderResultScreen(message)
  }

  renderFailureScreen = () => {
    if (this.props.emailTranscript.screen !== EMAIL_TRANSCRIPT_FAILURE_SCREEN) return null

    const failureMessageLabel = i18n.t('embeddable_framework.chat.emailtranscript.failure_message')
    const tryAgainLabel = i18n.t('embeddable_framework.chat.emailtranscript.try_again')
    const message = (
      <div className={styles.resultMessage}>
        {failureMessageLabel}
        <br />
        <button className={styles.tryAgain} onClick={this.props.tryEmailTranscriptAgain}>
          {tryAgainLabel}
        </button>
      </div>
    )

    return this.renderResultScreen(message, ICONS.ERROR_FILL)
  }

  renderLoadingScreen = () => {
    if (this.props.emailTranscript.screen !== EMAIL_TRANSCRIPT_LOADING_SCREEN) return null

    return (
      <div className={styles.loadingSpinner}>
        <LoadingSpinner />
      </div>
    )
  }

  render() {
    return (
      <ChatModal
        onClose={() => {
          this.props.leftCtaFn()

          if (this.props.emailTranscript.screen === EMAIL_TRANSCRIPT_SUCCESS_SCREEN) {
            this.props.resetEmailTranscript()
          }
        }}
        title={
          this.props.emailTranscript.screen === EMAIL_TRANSCRIPT_SCREEN
            ? i18n.t('embeddable_framework.chat.emailtranscript.title')
            : undefined
        }
        focusOnMount={
          this.props.emailTranscript.screen === EMAIL_TRANSCRIPT_SUCCESS_SCREEN ||
          this.props.emailTranscript.screen === EMAIL_TRANSCRIPT_FAILURE_SCREEN
        }
      >
        {this.renderFormScreen()}
        {this.renderSuccessScreen()}
        {this.renderLoadingScreen()}
        {this.renderFailureScreen()}
      </ChatModal>
    )
  }
}
