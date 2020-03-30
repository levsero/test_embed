import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { i18n } from 'service/i18n'
import classNames from 'classnames'
import Linkify from 'react-linkify'
import { Message, Field, Label, Input, Textarea } from '@zendeskgarden/react-forms'

import { LoadingSpinner } from 'component/loading/LoadingSpinner'
import { ChatOperatingHours } from 'component/chat/ChatOperatingHours'
import { OFFLINE_FORM_SCREENS } from 'constants/chat'
import { UserProfile } from 'component/chat/UserProfile'
import ChatMessagingChannels from 'component/chat/ChatMessagingChannels'
import SuccessNotification from 'src/components/SuccessNotification'
import { NAME_PATTERN, EMAIL_PATTERN, PHONE_PATTERN, TEST_IDS } from 'src/constants/shared'
import { shouldRenderErrorMessage, renderLabel } from 'src/util/fields'
import ChatHistoryLink from './ChatHistoryLink'
import ChatFooter from 'src/embeds/chat/components/Footer/index'
import { Widget, Header, Main } from 'src/components/Widget'
import SuccessIcon from 'icons/widget-icon_success_contactForm.svg'
import { locals as styles } from './ChatOfflineForm.scss'

export class ChatOfflineForm extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    chatOfflineFormChanged: PropTypes.func.isRequired,
    initiateSocialLogout: PropTypes.func.isRequired,
    operatingHours: PropTypes.object,
    sendOfflineMessage: PropTypes.func.isRequired,
    handleOfflineFormBack: PropTypes.func.isRequired,
    handleOperatingHoursClick: PropTypes.func.isRequired,
    offlineMessage: PropTypes.object.isRequired,
    readOnlyState: PropTypes.object.isRequired,
    formState: PropTypes.object.isRequired,
    formFields: PropTypes.object.isRequired,
    phoneEnabled: PropTypes.bool,
    greeting: PropTypes.string.isRequired,
    isMobile: PropTypes.bool,
    socialLogin: PropTypes.object.isRequired,
    authUrls: PropTypes.object.isRequired,
    visitor: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    hideZendeskLogo: PropTypes.bool,
    widgetShown: PropTypes.bool.isRequired,
    channels: PropTypes.object,
    hasChatHistory: PropTypes.bool.isRequired,
    openedChatHistory: PropTypes.func.isRequired,
    chatHistoryLabel: PropTypes.string.isRequired
  }

  static defaultProps = {
    operatingHours: { enabled: false },
    isMobile: false,
    fullscreen: false,
    phoneEnabled: true,
    offlineMessage: {},
    initiateSocialLogout: () => {},
    socialLogin: {},
    authUrls: {},
    hideZendeskLogo: false,
    chatId: '',
    formState: {},
    readOnlyState: {},
    channels: {}
  }

  constructor(props) {
    super(props)

    this.offlineForm = null

    this.state = {
      valid: false,
      showErrors: false
    }
  }

  componentDidMount() {
    if (this.props.offlineMessage.screen === OFFLINE_FORM_SCREENS.MAIN) {
      this.validate()
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.widgetShown && this.props.widgetShown) {
      this.validate()
    }
  }

  getScrollContainerClasses() {
    return classNames(styles.scrollContainer, {
      [styles.mobileContainer]: this.props.isMobile
    })
  }

  renderErrorMessage(value, required, errorString, pattern) {
    if (shouldRenderErrorMessage(value, required, this.state.showErrors, pattern)) {
      return <Message validation="error">{i18n.t(errorString)}</Message>
    }
    return null
  }

  renderNameField() {
    const { formFields, formState, authUrls, readOnlyState } = this.props
    const isRequired = !!_.get(formFields, 'name.required')
    const value = formState.name
    const fieldContainerStyle = classNames({
      [styles.nameFieldWithSocialLogin]: _.size(authUrls) > 0,
      [styles.textField]: _.size(authUrls) === 0
    })
    const error = this.renderErrorMessage(
      value,
      isRequired,
      'embeddable_framework.validation.error.name',
      NAME_PATTERN
    )

    return (
      <Field>
        {renderLabel(
          Label,
          i18n.t('embeddable_framework.common.textLabel.name'),
          isRequired || !!readOnlyState.name
        )}
        <Input
          required={isRequired}
          aria-required={isRequired}
          defaultValue={value}
          autoComplete="off"
          onChange={() => {}}
          name="name"
          validation={error ? 'error' : undefined}
          pattern={NAME_PATTERN.source}
          readOnly={readOnlyState.name}
          className={fieldContainerStyle}
        />
        {error}
      </Field>
    )
  }

  renderEmailField() {
    const isRequired = !!_.get(this.props.formFields, 'email.required')
    const value = this.props.formState.email
    const error = this.renderErrorMessage(
      value,
      isRequired,
      'embeddable_framework.validation.error.email',
      EMAIL_PATTERN
    )

    /* eslint-disable max-len */
    return (
      <Field>
        {renderLabel(
          Label,
          i18n.t('embeddable_framework.common.textLabel.email'),
          isRequired || !!this.props.readOnlyState.email
        )}
        <Input
          required={isRequired}
          aria-required={isRequired}
          defaultValue={value}
          onChange={() => {}}
          name="email"
          validation={error ? 'error' : undefined}
          readOnly={this.props.readOnlyState.email}
          pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?"
        />
        {error}
      </Field>
    )
    /* eslint-enable max-len */
  }

  renderPhoneNumberField() {
    if (!this.props.phoneEnabled) return null

    const isRequired = !!_.get(this.props.formFields, 'phone.required')
    const value = this.props.formState.phone
    const error = this.renderErrorMessage(
      value,
      isRequired,
      'embeddable_framework.validation.error.phone',
      PHONE_PATTERN
    )

    return (
      <Field>
        {renderLabel(
          Label,
          i18n.t('embeddable_framework.common.textLabel.phone_number'),
          isRequired || !!this.props.readOnlyState.phone
        )}
        <Input
          required={isRequired}
          aria-required={isRequired}
          defaultValue={value}
          onChange={() => {}}
          type="tel"
          name="phone"
          readOnly={this.props.readOnlyState.phone}
          pattern={PHONE_PATTERN.source}
          validation={error ? 'error' : undefined}
          className={styles.textField}
        />
        {error}
      </Field>
    )
  }

  renderMessageField() {
    const isRequired = !!_.get(this.props.formFields, 'message.required')
    const value = this.props.formState.message
    const error = this.renderErrorMessage(
      value,
      isRequired,
      'embeddable_framework.validation.error.message',
      null
    )

    return (
      <Field>
        {renderLabel(Label, i18n.t('embeddable_framework.common.textLabel.message'), isRequired)}
        <Textarea
          required={isRequired}
          aria-required={isRequired}
          defaultValue={value}
          onChange={() => {}}
          rows="5"
          name="message"
          validation={error ? 'error' : undefined}
        />
        {error}
      </Field>
    )
  }

  renderSuccess() {
    if (this.props.offlineMessage.screen !== OFFLINE_FORM_SCREENS.SUCCESS) return

    return (
      <Widget>
        <Header title={this.props.title} />
        <Main>
          <SuccessNotification
            icon={<SuccessIcon />}
            isMobile={this.props.isMobile}
            doneText={i18n.t('embeddable_framework.common.button.goBack')}
            onClick={this.props.handleOfflineFormBack}
          />
        </Main>
        <ChatFooter
          hideZendeskLogo={this.props.hideZendeskLogo}
          isMobile={this.props.isMobile}
          hideButton={true}
          scrollShadowVisible={false}
        />
      </Widget>
    )
  }

  renderLoading() {
    if (this.props.offlineMessage.screen !== OFFLINE_FORM_SCREENS.LOADING) return

    return (
      <Widget>
        <Header title={this.props.title} />
        <Main>
          <div className={styles.loadingSpinner}>
            <LoadingSpinner />
          </div>
        </Main>
        <ChatFooter
          hideZendeskLogo={this.props.hideZendeskLogo}
          isMobile={this.props.isMobile}
          hideButton={true}
          scrollShadowVisible={false}
        />
      </Widget>
    )
  }

  renderOfflineGreeting() {
    const { greeting } = this.props

    return (
      <Linkify properties={{ target: '_blank' }} className={styles.offlineGreeting}>
        <span data-testid={TEST_IDS.FORM_GREETING_MSG}>{greeting}</span>
      </Linkify>
    )
  }

  renderOperatingHoursLink() {
    const { operatingHours } = this.props

    if (!operatingHours.enabled) return

    const operatingHoursAnchor = i18n.t('embeddable_framework.chat.operatingHours.label.anchor')

    return (
      <p className={styles.operatingHoursContainer}>
        <button
          className={styles.operatingHoursLink}
          onClick={this.props.handleOperatingHoursClick}
        >
          {operatingHoursAnchor}
        </button>
      </p>
    )
  }

  renderUserProfile() {
    return (
      <UserProfile
        authUrls={this.props.authUrls}
        socialLogin={this.props.socialLogin}
        visitor={this.props.visitor}
        initiateSocialLogout={this.props.initiateSocialLogout}
        isAuthenticated={this.props.isAuthenticated}
        nameField={this.renderNameField()}
        emailField={this.renderEmailField()}
      />
    )
  }

  renderMessagingChannels() {
    if (_.isEmpty(this.props.channels)) {
      return null
    }

    return <ChatMessagingChannels isMobile={this.props.isMobile} channels={this.props.channels} />
  }

  handleFormSubmit = e => {
    e.preventDefault()

    if (!this.state.valid) {
      this.setState({ showErrors: true })
      return
    }
    this.setState({ showErrors: false })

    const { authenticated: isSociallyAuthenticated } = this.props.socialLogin
    const { visitor, formState, isAuthenticated } = this.props
    const formData =
      isSociallyAuthenticated || isAuthenticated
        ? { ...formState, name: visitor.display_name, email: visitor.email }
        : this.props.formState

    this.props.sendOfflineMessage(formData)
  }

  validate() {
    if (!this.offlineForm) return

    const isFormValid = this.offlineForm.checkValidity()
    const isFormStateEmpty = _.isEmpty(this.props.formState)

    this.setState({ valid: isFormValid && !isFormStateEmpty })
  }

  handleFormChanged = e => {
    if (!this.offlineForm) return

    const { name, value } = e.target
    const fieldState = { [name]: value }
    const formState = { ...this.props.formState, ...fieldState }

    this.validate()
    this.props.chatOfflineFormChanged(formState)
  }

  renderForm() {
    if (this.props.offlineMessage.screen !== OFFLINE_FORM_SCREENS.MAIN) return null

    return (
      <Widget>
        <Header title={this.props.title} />
        <Main>
          <form
            noValidate={true}
            ref={el => {
              this.offlineForm = el
            }}
            onSubmit={this.handleFormSubmit}
            onChange={this.handleFormChanged}
            data-testid={TEST_IDS.CHAT_OFFLINE_FORM}
          >
            <ChatHistoryLink
              isAuthenticated={this.props.isAuthenticated}
              hasChatHistory={this.props.hasChatHistory}
              openedChatHistory={this.props.openedChatHistory}
              label={this.props.chatHistoryLabel}
            />
            {this.renderOfflineGreeting()}
            {this.renderOperatingHoursLink()}
            {this.renderMessagingChannels()}
            {this.renderUserProfile()}
            {this.renderPhoneNumberField()}
            {this.renderMessageField()}
            <input type="submit" hidden={true} />
          </form>
        </Main>
        <ChatFooter
          hideZendeskLogo={this.props.hideZendeskLogo}
          isMobile={this.props.isMobile}
          onClick={this.handleFormSubmit}
          label={i18n.t('embeddable_framework.chat.preChat.offline.button.sendMessage')}
        />
      </Widget>
    )
  }

  renderOperatingHours() {
    if (this.props.offlineMessage.screen !== OFFLINE_FORM_SCREENS.OPERATING_HOURS) return null

    const { operatingHours, handleOfflineFormBack } = this.props

    if (!operatingHours.enabled) return null

    return (
      <Widget>
        <Header title={this.props.title} />
        <Main>
          <ChatOperatingHours
            handleOfflineFormBack={handleOfflineFormBack}
            operatingHours={operatingHours}
          />
        </Main>
      </Widget>
    )
  }

  render() {
    return (
      <div>
        {this.renderForm()}
        {this.renderLoading()}
        {this.renderSuccess()}
        {this.renderOperatingHours()}
      </div>
    )
  }
}
