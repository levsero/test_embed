import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Field, Label, Input, Message } from '@zendeskgarden/react-forms'
import { keyCodes } from 'utility/keyboard'
import { document as doc } from 'utility/globals'
import { i18n } from 'service/i18n'
import { nameValid, emailValid } from 'src/util/utils'
import { isDefaultNickname } from 'src/util/chat'
import { Icon } from 'component/Icon'
import { LoadingSpinner } from 'component/loading/LoadingSpinner'
import { UserProfile } from 'component/chat/UserProfile'
import { ICONS, NAME_PATTERN, EMAIL_PATTERN, TEST_IDS } from 'constants/shared'
import { shouldRenderErrorMessage, renderLabel } from 'src/util/fields'
import {
  EDIT_CONTACT_DETAILS_SCREEN,
  EDIT_CONTACT_DETAILS_LOADING_SCREEN,
  EDIT_CONTACT_DETAILS_ERROR_SCREEN
} from 'constants/chat'
import ChatModal, { ModalActions } from 'embeds/chat/components/ChatModal'
import { Button } from '@zendeskgarden/react-buttons'

import { locals as styles } from 'component/chat/ChatContactDetailsPopup.scss'

export class ChatContactDetailsPopup extends Component {
  static propTypes = {
    authUrls: PropTypes.object.isRequired,
    socialLogin: PropTypes.object.isRequired,
    screen: PropTypes.string.isRequired,
    visitor: PropTypes.object.isRequired,
    initiateSocialLogout: PropTypes.func.isRequired,
    contactDetails: PropTypes.object,
    leftCtaFn: PropTypes.func,
    rightCtaFn: PropTypes.func,
    updateFn: PropTypes.func,
    isAuthenticated: PropTypes.bool,
    requiredFormData: PropTypes.shape({
      name: PropTypes.shape({
        enabled: PropTypes.bool
      }),
      email: PropTypes.shape({
        enabled: PropTypes.bool
      })
    })
  }

  static defaultProps = {
    className: '',
    contactDetails: {},
    leftCtaFn: () => {},
    rightCtaFn: () => {},
    updateFn: () => {},
    isMobile: false,
    isAuthenticated: false,
    requiredFormData: { name: { required: false }, email: { required: false } }
  }

  constructor(props) {
    super(props)
    const email = props.contactDetails.email || _.get(props.visitor, 'email', '')
    const name = props.contactDetails.display_name || _.get(props.visitor, 'display_name', '')
    const { name: nameRules, email: emailRules } = this.props.requiredFormData

    this.props.updateFn(isDefaultNickname(name) ? '' : name, email)

    this.state = {
      showNameError: !nameValid(name, {
        allowEmpty: !nameRules.required
      }),
      showEmailError: !emailValid(email, {
        allowEmpty: !emailRules.required
      })
    }

    this.form = null
    this.nameInput = React.createRef()
  }

  componentDidMount() {
    if (this.props.screen === EDIT_CONTACT_DETAILS_SCREEN) {
      this.focusNameInput()
    }
  }

  componentWillReceiveProps(nextProps) {
    // Check if the ContactDetails values are null, if so, use the stored Visitor info instead
    const { display_name: nextName, email: nextEmail } = nextProps.contactDetails
    const visitorName = _.get(nextProps.visitor, 'display_name', '')
    const visitorEmail = _.get(nextProps.visitor, 'email', '')

    if (_.isNil(nextName) && _.isNil(nextEmail)) {
      this.props.updateFn(visitorName, visitorEmail)
    } else if (isDefaultNickname(nextName)) {
      this.props.updateFn('', nextEmail)
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.screen !== EDIT_CONTACT_DETAILS_SCREEN &&
      this.props.screen === EDIT_CONTACT_DETAILS_SCREEN
    ) {
      this.focusNameInput()
    }
  }

  focusNameInput() {
    if (this.nameInput.current) {
      this.nameInput.current.focus()
    }
  }

  handleSave = () => {
    const { name: nameRules, email: emailRules } = this.props.requiredFormData
    const { display_name: name, email } = this.props.contactDetails
    const isNameError = !nameValid(name, {
      allowEmpty: !nameRules.required
    })
    const isEmailError = !emailValid(email, {
      allowEmpty: !emailRules.required
    })

    if (isNameError || isEmailError) {
      this.setState({
        showNameError: isNameError,
        showEmailError: isEmailError
      })
      return
    }

    this.props.rightCtaFn(name, email)

    if (doc.activeElement) {
      doc.activeElement.blur()
    }
  }

  handleKeyPress = e => {
    if (e.charCode === keyCodes.ENTER && !e.shiftKey) {
      e.preventDefault()
      this.handleSave()
    }
  }

  handleFormChange = e => {
    const { name, value } = e.target
    const { name: nameRules, email: emailRules } = this.props.requiredFormData
    const newState = {
      ...this.props.contactDetails,
      [name]: value
    }

    // We only want this to clear an existing error
    if (this.state.showNameError) {
      this.setState({
        showNameError: !nameValid(newState.display_name, { allowEmpty: !nameRules.required })
      })
    }

    if (this.state.showEmailError) {
      this.setState({
        showEmailError: !emailValid(newState.email, { allowEmpty: !emailRules.required })
      })
    }

    this.props.updateFn(newState.display_name, newState.email)
  }

  renderErrorMessage(value, required, isError, errorString, pattern) {
    if (shouldRenderErrorMessage(value, required, isError, pattern)) {
      return <Message validation="error">{i18n.t(errorString)}</Message>
    }
    return null
  }

  renderNameField = () => {
    const value = _.isNil(this.props.contactDetails.display_name)
      ? ''
      : this.props.contactDetails.display_name
    const { name: nameRules } = this.props.requiredFormData

    const error = this.renderErrorMessage(
      value,
      nameRules.required,
      this.state.showNameError,
      'embeddable_framework.validation.error.name',
      NAME_PATTERN
    )

    return (
      <div className={styles.field}>
        <Field>
          {renderLabel(
            Label,
            i18n.t('embeddable_framework.common.textLabel.name'),
            nameRules.required
          )}
          <Input
            ref={this.nameInput}
            defaultValue={value}
            name="display_name"
            autoComplete="off"
            onKeyPress={this.handleKeyPress}
            validation={error ? 'error' : undefined}
            pattern={NAME_PATTERN.source}
            disabled={this.props.isAuthenticated}
            data-testid={TEST_IDS.NAME_FIELD}
          />
          {error}
        </Field>
      </div>
    )
  }

  renderEmailField = () => {
    const value = _.isNil(this.props.contactDetails.email) ? '' : this.props.contactDetails.email
    const { email: emailRules } = this.props.requiredFormData

    const error = this.renderErrorMessage(
      value,
      emailRules.required,
      this.state.showEmailError,
      'embeddable_framework.validation.error.email',
      EMAIL_PATTERN
    )

    /* eslint-disable max-len */
    return (
      <div className={styles.field}>
        <Field>
          {renderLabel(
            Label,
            i18n.t('embeddable_framework.common.textLabel.email'),
            emailRules.required
          )}
          <Input
            defaultValue={value}
            disabled={this.props.isAuthenticated}
            name="email"
            onKeyPress={this.handleKeyPress}
            validation={error ? 'error' : undefined}
            pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?"
            data-testid={TEST_IDS.EMAIL_FIELD}
          />
          {error}
        </Field>
      </div>
    )
    /* eslint-enable max-len */
  }

  renderUserProfile() {
    const { authUrls, socialLogin, visitor, initiateSocialLogout, isAuthenticated } = this.props

    return (
      <UserProfile
        authUrls={authUrls}
        socialLogin={socialLogin}
        visitor={visitor}
        initiateSocialLogout={initiateSocialLogout}
        isAuthenticated={isAuthenticated}
        nameField={this.renderNameField()}
        emailField={this.renderEmailField()}
      />
    )
  }

  renderFailureScreen = () => {
    if (this.props.screen !== EDIT_CONTACT_DETAILS_ERROR_SCREEN) return null

    const failureMessageLabel = i18n.t('embeddable_framework.common.notify.error.generic')

    return (
      <div className={styles.resultContainer}>
        <div className={styles.resultScreen}>
          <div className={styles.resultIcon}>
            <Icon type={ICONS.ERROR_FILL} />
          </div>
          <div className={styles.resultMessage}>{failureMessageLabel}</div>
        </div>
      </div>
    )
  }

  renderForm = () => {
    if (this.props.screen !== EDIT_CONTACT_DETAILS_SCREEN) return null

    return (
      <form
        ref={element => (this.form = element)}
        className={styles.form}
        noValidate={true}
        onChange={this.handleFormChange}
      >
        {this.renderUserProfile()}

        <ModalActions>
          <Button onClick={this.props.leftCtaFn} data-testid={TEST_IDS.BUTTON_CANCEL}>
            {i18n.t('embeddable_framework.common.button.cancel')}
          </Button>
          {!this.props.isAuthenticated && (
            <Button
              onClick={this.handleSave}
              primary={true}
              disabled={this.state.showEmailError || this.state.showNameError}
              data-testid={TEST_IDS.BUTTON_OK}
            >
              {i18n.t('embeddable_framework.common.button.save')}
            </Button>
          )}
        </ModalActions>
      </form>
    )
  }

  renderLoadingSpinner() {
    if (this.props.screen !== EDIT_CONTACT_DETAILS_LOADING_SCREEN) return null

    return <LoadingSpinner height={32} width={32} className={styles.loadingSpinner} />
  }

  render() {
    return (
      <ChatModal
        title={
          this.props.screen === EDIT_CONTACT_DETAILS_SCREEN
            ? i18n.t('embeddable_framework.chat.options.editContactDetails')
            : undefined
        }
        onClose={this.props.leftCtaFn}
        focusOnMount={this.props.screen === EDIT_CONTACT_DETAILS_ERROR_SCREEN}
      >
        {this.renderForm()}
        {this.renderFailureScreen()}
        {this.renderLoadingSpinner()}
      </ChatModal>
    )
  }
}
