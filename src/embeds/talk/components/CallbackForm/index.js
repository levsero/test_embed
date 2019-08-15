import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form } from 'component/form/Form'
import { i18n } from 'service/i18n'
import ErrorNotification from 'src/embeds/talk/components/ErrorNotification'
import classNames from 'classnames'
import AverageWaitTime from 'src/embeds/talk/components/AverageWaitTime'
import PhoneField from 'src/embeds/talk/components/PhoneField'
import NameField from 'src/embeds/talk/components/NameField'
import DescriptionField from 'src/embeds/talk/components/DescriptionField'
import {
  getAverageWaitTimeString,
  getCallback,
  getEmbeddableConfig,
  getFormState
} from 'src/redux/modules/talk/talk-selectors'
import { submitTalkCallbackForm, updateTalkCallbackForm } from 'src/redux/modules/talk'
import {
  getTalkDescriptionLabel,
  getTalkNameLabel,
  getTalkNickname,
  getTalkServiceUrl,
  getHideZendeskLogo
} from 'src/redux/modules/selectors'
import { isMobileBrowser } from 'utility/devices'
import { locals as styles } from './styles.scss'
import _ from 'lodash'
import { getLocale } from 'src/redux/modules/base/base-selectors'
import WidgetMain from 'src/components/WidgetMain'
import WidgetFooter from 'src/components/WidgetFooter'
import { Button } from '@zendeskgarden/react-buttons'
import ZendeskLogo from 'src/components/ZendeskLogo'
import CallbackPhone from 'src/embeds/talk/components/CallbackPhone'
import { Redirect } from 'react-router-dom'

const errorCodes = ['invalid_phone_number', 'phone_number_already_in_queue']

class CallbackForm extends Component {
  static propTypes = {
    supportedCountries: PropTypes.arrayOf(PropTypes.string),
    formState: PropTypes.object.isRequired,
    callback: PropTypes.shape({
      error: PropTypes.shape({
        message: PropTypes.striing
      })
    }),
    averageWaitTime: PropTypes.string,
    updateTalkCallbackForm: PropTypes.func.isRequired,
    submitTalkCallbackForm: PropTypes.func.isRequired,
    nickname: PropTypes.string.isRequired,
    serviceUrl: PropTypes.string.isRequired,
    nameLabelText: PropTypes.string.isRequired,
    descriptionLabelText: PropTypes.string.isRequired,
    submitButtonLabel: PropTypes.string.isRequired,
    headerMessage: PropTypes.string.isRequired,
    isMobile: PropTypes.bool.isRequired,
    hideZendeskLogo: PropTypes.bool.isRequired,

    // used to force the component to re-render when locale changes
    // eslint-disable-next-line react/no-unused-prop-types
    locale: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      showErrors: false
    }
  }

  handleFormCompleted = () => {
    if (!this.form.state.valid) {
      this.setState({ showErrors: true })
      return
    }

    const { serviceUrl, nickname, submitTalkCallbackForm } = this.props

    this.setState({ showErrors: false })
    submitTalkCallbackForm(serviceUrl, nickname)
  }

  handleFormChange = formState => {
    this.props.updateTalkCallbackForm(formState)
  }

  handleCountrySelect = country => {
    this.props.updateTalkCallbackForm({ country })
    if (this.form) {
      this.form.validate()
    }
  }

  getErrorMessage() {
    const { callback } = this.props

    if (!callback.error.message) {
      return null
    }

    return _.includes(errorCodes, callback.error.message)
      ? i18n.t(`embeddable_framework.talk.notify.error.${callback.error.message}`)
      : i18n.t('embeddable_framework.common.notify.error.generic')
  }

  render() {
    const {
      callback,
      isMobile,
      formState,
      submitButtonLabel,
      headerMessage,
      averageWaitTime,
      supportedCountries,
      nameLabelText,
      descriptionLabelText,
      hideZendeskLogo
    } = this.props

    if (callback.success) {
      return <Redirect to="/talk/success" />
    }

    const submitButtonStyles = classNames(styles.submitButton, {
      [styles.submitBtnMobile]: isMobile
    })

    const errorMessage = this.getErrorMessage()
    const footerClasses = classNames(styles.footer, {
      [styles.multipleItems]: !hideZendeskLogo,
      [styles.singleItem]: hideZendeskLogo
    })

    return (
      <Form
        ref={el => (this.form = el)}
        className={styles.form}
        formState={formState}
        onCompleted={this.handleFormCompleted}
        onChange={this.handleFormChange}
        testId="talk--callbackForm"
      >
        <WidgetMain>
          <CallbackPhone />
          <div>
            <p className={styles.formHeaderMessage}>{headerMessage}</p>
            {averageWaitTime && <AverageWaitTime message={averageWaitTime} />}
          </div>
          <div className={styles.formDivider} />
          <PhoneField
            validate={val => this.form && this.form.validate(val)}
            required={true}
            onCountrySelect={this.handleCountrySelect}
            supportedCountries={supportedCountries}
            country={formState.country}
            value={formState.phone}
            showError={this.state.showErrors}
          />
          <NameField label={nameLabelText} defaultValue={formState.name} />
          <DescriptionField label={descriptionLabelText} defaultValue={formState.description} />
          {errorMessage && <ErrorNotification message={errorMessage} />}
        </WidgetMain>
        <WidgetFooter scrollShadowVisible={true}>
          <div className={footerClasses}>
            {hideZendeskLogo ? null : <ZendeskLogo />}

            <Button primary={true} className={submitButtonStyles} type="submit">
              {submitButtonLabel}
            </Button>
          </div>
        </WidgetFooter>
      </Form>
    )
  }
}

const mapStateToProps = state => {
  return {
    supportedCountries: getEmbeddableConfig(state).supportedCountries,
    headerMessage: i18n.t('embeddable_framework.talk.form.headerMessage_new'),
    phoneLabel: i18n.t('embeddable_framework.common.textLabel.phone_number'),
    submitButtonLabel: i18n.t('embeddable_framework.common.button.send'),
    nickname: getTalkNickname(state),
    serviceUrl: getTalkServiceUrl(state),
    nameLabelText: getTalkNameLabel(state),
    descriptionLabelText: getTalkDescriptionLabel(state),
    averageWaitTime: getAverageWaitTimeString(state),
    formState: getFormState(state),
    callback: getCallback(state),
    isRTL: i18n.isRTL(),
    isMobile: isMobileBrowser(),
    locale: getLocale(state),
    hideZendeskLogo: getHideZendeskLogo(state)
  }
}

const actionCreators = {
  updateTalkCallbackForm,
  submitTalkCallbackForm
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators
)(CallbackForm)

export { connectedComponent as default, CallbackForm as Component }
