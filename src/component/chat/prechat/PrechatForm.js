import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import classNames from 'classnames'
import { Field, Label, Input, Textarea, Message } from '@zendeskgarden/react-forms'
import {
  Dropdown,
  Menu,
  Field as DropdownField,
  Select,
  Label as DropdownLabel,
  Message as DropdownMessage,
  Item
} from '@zendeskgarden/react-dropdowns'
import Linkify from 'react-linkify'

import { UserProfile } from 'component/chat/UserProfile'
import { Widget, Header, Main } from 'src/components/Widget'
import ChatFooter from 'src/embeds/chat/components/Footer'

import { i18n } from 'service/i18n'

import { locals as styles } from './PrechatForm.scss'
import { shouldRenderErrorMessage, renderLabel } from 'src/util/fields'
import { FONT_SIZE, NAME_PATTERN, EMAIL_PATTERN, PHONE_PATTERN } from 'src/constants/shared'
import ChatHistoryLink from '../ChatHistoryLink'
import { onNextTick } from 'src/util/utils'
import { TEST_IDS } from 'src/constants/shared'
import { CurrentFrameConsumer } from 'components/Frame'

export class PrechatForm extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    form: PropTypes.object,
    settingsDepartmentsEnabled: PropTypes.array,
    formState: PropTypes.object,
    readOnlyState: PropTypes.object.isRequired,
    onPrechatFormChange: PropTypes.func,
    greetingMessage: PropTypes.string,
    visitor: PropTypes.object.isRequired,
    onFormCompleted: PropTypes.func,
    loginEnabled: PropTypes.bool,
    phoneEnabled: PropTypes.bool,
    hasChatHistory: PropTypes.bool.isRequired,
    authUrls: PropTypes.object.isRequired,
    socialLogin: PropTypes.object.isRequired,
    initiateSocialLogout: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    hideZendeskLogo: PropTypes.bool,
    openedChatHistory: PropTypes.func.isRequired,
    chatHistoryLabel: PropTypes.string.isRequired,
    defaultDepartment: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      status: PropTypes.string,
      required: PropTypes.bool,
      disabled: PropTypes.bool
    }),
    selectedDepartment: PropTypes.shape({
      id: PropTypes.number,
      status: PropTypes.string
    })
  }

  static defaultProps = {
    defaultDepartment: {},
    form: {},
    settingsDepartmentsEnabled: [],
    formState: {},
    readOnlyState: {},
    onPrechatFormChange: () => {},
    greetingMessage: '',
    visitor: {},
    onFormCompleted: () => {},
    loginEnabled: true,
    phoneEnabled: true,
    authUrls: {},
    socialLogin: {},
    hideZendeskLogo: false,
    chatId: '',
    fullscreen: false
  }

  constructor() {
    super()

    this.state = {
      valid: false,
      showErrors: false
    }

    this.form = null
  }

  componentDidMount = () => {
    this.handleFormChange()
  }

  isDepartmentOffline = (departments, departmentId) => {
    const department = this.findDepartment(departments, departmentId)

    return !department ? true : _.get(department, 'status') === 'offline'
  }

  findDepartment = (departments, departmentId) => {
    const { defaultDepartment } = this.props
    const deptArray = [
      ...(!departments ? [] : departments),
      _.get(defaultDepartment, 'status') === 'online' ? defaultDepartment : {}
    ]

    return _.find(deptArray, d => parseInt(d.id, 10) === parseInt(departmentId, 10)) || {} // eslint-disable-line eqeqeq
  }

  shouldHideDepartments = departments => {
    return (
      _.size(departments) === 0 ||
      (_.size(departments) === 1 &&
        departments[0].isDefault &&
        _.size(this.props.settingsDepartmentsEnabled) === 0)
    )
  }

  isFieldRequired = (required = false) => {
    const { form, formState } = this.props
    const isDepartmentSelected = formState.department !== ''

    if (isDepartmentSelected) {
      return this.isDepartmentOffline(form.departments, formState.department) ? true : required
    } else {
      return required
    }
  }

  handleFormSubmit = e => {
    e.preventDefault()

    if (!this.state.valid) {
      this.setState({ showErrors: true })
      return
    }
    this.setState({ showErrors: false })

    const { authenticated: isSociallyAuthenticated } = this.props.socialLogin
    const { visitor, isAuthenticated } = this.props
    const formData =
      isSociallyAuthenticated || isAuthenticated
        ? {
            ...this.props.formState,
            name: visitor.display_name,
            email: visitor.email
          }
        : this.props.formState

    this.props.onFormCompleted(formData)
  }

  handleFormChange = () => {
    const values = _.reduce(
      this.form.elements,
      (result, field) => {
        if (field.type !== 'submit') {
          result[field.name] = field.value
        }
        return result
      },
      {}
    )

    this.props.onPrechatFormChange(values)

    onNextTick(() => {
      if (!this.form) {
        return
      }

      const valid = !!this.form.checkValidity()

      // FIXME: This is not tested due to timing pollution on our specs
      this.setState({ valid: valid && this.isDepartmentFieldValid() })
    })
  }

  handleSelectChange = value => {
    this.props.onPrechatFormChange({ department: value })

    this.handleFormChange()
  }

  isDepartmentFieldValid = () => {
    const { form, formState } = this.props

    return _.get(form, 'department.required') && _.size(form.departments) > 0
      ? formState.department
      : true
  }

  renderErrorMessage(Component, value, required, errorString, pattern) {
    if (shouldRenderErrorMessage(value, required, this.state.showErrors, pattern)) {
      return <Component validation="error">{i18n.t(errorString)}</Component>
    }
    return null
  }

  renderGreetingMessage = () => {
    const { greetingMessage } = this.props

    if (!greetingMessage) return null

    return (
      <Linkify properties={{ target: '_blank' }}>
        <span className={styles.greetingMessage} data-testid={TEST_IDS.FORM_GREETING_MSG}>
          {greetingMessage}
        </span>
      </Linkify>
    )
  }

  renderNameField = () => {
    const { loginEnabled, form, formState, authUrls, readOnlyState } = this.props

    if (!loginEnabled) return null

    const nameData = form.name
    const value = formState.name
    const required = this.isFieldRequired(nameData.required)
    const fieldContainerStyle = classNames({
      [styles.nameFieldWithSocialLogin]: _.size(authUrls) > 0,
      [styles.textField]: _.size(authUrls) === 0
    })

    const error = this.renderErrorMessage(
      Message,
      value,
      required,
      'embeddable_framework.validation.error.name',
      NAME_PATTERN
    )

    return (
      <div className={fieldContainerStyle}>
        <Field>
          {renderLabel(
            Label,
            i18n.t('embeddable_framework.common.textLabel.name'),
            required || !!readOnlyState.name
          )}
          <Input
            autoComplete="off"
            aria-required={required}
            required={required}
            readOnly={readOnlyState.name}
            defaultValue={value}
            onChange={() => {}}
            name={nameData.name}
            pattern={NAME_PATTERN.source}
            validation={error ? 'error' : undefined}
            data-testid={TEST_IDS.NAME_FIELD}
          />
          {error}
        </Field>
      </div>
    )
  }

  renderEmailField = () => {
    if (!this.props.loginEnabled) return null

    const emailData = this.props.form.email
    const required = this.isFieldRequired(emailData.required)
    const value = this.props.formState.email

    const error = this.renderErrorMessage(
      Message,
      value,
      required,
      'embeddable_framework.validation.error.email',
      EMAIL_PATTERN
    )

    /* eslint-disable max-len */
    return (
      <Field>
        {renderLabel(
          Label,
          i18n.t('embeddable_framework.common.textLabel.email'),
          required || !!this.props.readOnlyState.email
        )}
        <Input
          required={required}
          aria-required={required}
          defaultValue={value}
          readOnly={this.props.readOnlyState.email}
          onChange={() => {}}
          name={emailData.name}
          validation={error ? 'error' : undefined}
          pattern="[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~\-`']+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?"
          data-testid={TEST_IDS.EMAIL_FIELD}
        />
        {error}
      </Field>
    )
    /* eslint-enable max-len */
  }

  renderPhoneField = () => {
    if (!this.props.loginEnabled || !this.props.phoneEnabled || this.props.isAuthenticated)
      return null

    const phoneData = this.props.form.phone
    const value = this.props.formState.phone
    const required = phoneData.required
    const error = this.renderErrorMessage(
      Message,
      value,
      required,
      'embeddable_framework.validation.error.phone',
      PHONE_PATTERN
    )

    return (
      <div className={styles.field}>
        <Field>
          {renderLabel(
            Label,
            i18n.t('embeddable_framework.common.textLabel.phone_number'),
            required || !!this.props.readOnlyState.phone
          )}
          <Input
            required={required}
            aria-required={required}
            defaultValue={value}
            readOnly={this.props.readOnlyState.phone}
            onChange={() => {}}
            type="tel"
            name={phoneData.name}
            pattern={PHONE_PATTERN.source}
            validation={error ? 'error' : undefined}
            data-testid={TEST_IDS.PHONE_FIELD}
          />
          {error}
        </Field>
      </div>
    )
  }

  renderMessageField = () => {
    const messageData = this.props.form.message
    const required = this.isFieldRequired(messageData.required)
    const value = this.props.formState.message
    const error = this.renderErrorMessage(
      Message,
      value,
      required,
      'embeddable_framework.validation.error.message'
    )

    return (
      <div className={styles.textAreaMarginBtn}>
        <Field>
          {renderLabel(Label, i18n.t('embeddable_framework.common.textLabel.message'), required)}
          <Textarea
            required={required}
            aria-required={required}
            defaultValue={value}
            onChange={() => {}}
            rows="4"
            name={messageData.name}
            validation={error ? 'error' : undefined}
            data-testid={TEST_IDS.MESSAGE_FIELD}
          />
          {error}
        </Field>
      </div>
    )
  }

  renderDepartmentsField = () => {
    const { department: departmentSettings, departments } = this.props.form

    if (this.shouldHideDepartments(departments)) return null

    const options = _.map(departments, dept => {
      return (
        <Item disabled={dept.disabled} key={dept.id} value={dept.id}>
          {dept.name}
        </Item>
      )
    })
    const selectedDepartment = this.findDepartment(departments, this.props.formState.department)
    const required = departmentSettings.required
    const value = selectedDepartment.id ? selectedDepartment.id.toString() : null
    const error = this.renderErrorMessage(
      DropdownMessage,
      value,
      required,
      'embeddable_framework.validation.error.department'
    )
    const departmentLabel = departmentSettings.label

    return (
      <CurrentFrameConsumer>
        {frame => (
          <Dropdown
            required={required}
            aria-required={required}
            name="department"
            selectedItem={value}
            onSelect={this.handleSelectChange}
            downshiftProps={{
              environment: frame.window
            }}
            validation={error ? 'error' : undefined}
          >
            <DropdownField className={styles.dropdown}>
              {renderLabel(DropdownLabel, departmentLabel, required)}
              <Select
                placeholder={i18n.t(
                  'embeddable_framework.chat.form.common.dropdown.chooseDepartment'
                )}
                className={styles.dropdownSelect}
              >
                {selectedDepartment.name}
              </Select>
              {error}
            </DropdownField>
            <Menu
              maxHeight={`${140 / FONT_SIZE}rem`}
              popperModifiers={{
                flip: { enabled: false },
                preventOverflow: { escapeWithReference: true }
              }}
            >
              {options}
            </Menu>
          </Dropdown>
        )}
      </CurrentFrameConsumer>
    )
  }

  renderUserProfile() {
    const {
      authUrls,
      socialLogin,
      visitor,
      initiateSocialLogout,
      isAuthenticated,
      loginEnabled
    } = this.props

    if (!loginEnabled) return

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

  render = () => {
    const { form, formState } = this.props

    const buttonLabel = this.isDepartmentOffline(form.departments, formState.department)
      ? i18n.t('embeddable_framework.chat.preChat.offline.button.sendMessage')
      : i18n.t('embeddable_framework.chat.preChat.online.button.startChat')
    return (
      <Widget>
        <Header title={this.props.title} />
        <Main>
          <form
            noValidate={true}
            onSubmit={this.handleFormSubmit}
            onChange={this.handleFormChange}
            ref={el => {
              if (!el) {
                return
              }
              this.form = el
            }}
            className={`${styles.form}`}
            data-testid={TEST_IDS.CHAT_PRECHAT_FORM}
          >
            <ChatHistoryLink
              isAuthenticated={this.props.isAuthenticated}
              hasChatHistory={this.props.hasChatHistory}
              openedChatHistory={this.props.openedChatHistory}
              label={this.props.chatHistoryLabel}
            />
            {this.renderGreetingMessage()}
            {this.renderUserProfile()}
            {this.renderDepartmentsField()}
            {this.renderPhoneField()}
            {this.renderMessageField()}
            <input type="submit" hidden={true} />
          </form>
        </Main>
        <ChatFooter
          hideZendeskLogo={this.props.hideZendeskLogo}
          label={buttonLabel}
          onClick={this.handleFormSubmit}
        />
      </Widget>
    )
  }
}
