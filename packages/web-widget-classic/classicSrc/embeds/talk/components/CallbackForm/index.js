import { Main, Footer } from 'classicSrc/components/Widget'
import { submitTalkCallbackForm, updateTalkCallbackForm } from 'classicSrc/embeds/talk/actions'
import AverageWaitTime from 'classicSrc/embeds/talk/components/AverageWaitTime'
import CallbackPhone from 'classicSrc/embeds/talk/components/CallbackPhone'
import DescriptionField from 'classicSrc/embeds/talk/components/DescriptionField'
import ErrorNotification from 'classicSrc/embeds/talk/components/ErrorNotification'
import NameField from 'classicSrc/embeds/talk/components/NameField'
import PhoneField from 'classicSrc/embeds/talk/components/PhoneField'
import routes from 'classicSrc/embeds/talk/routes'
import {
  getAverageWaitTimeString,
  getCallback,
  getTalkEmbeddableConfig,
  getFormState,
} from 'classicSrc/embeds/talk/selectors'
import useTranslate from 'classicSrc/hooks/useTranslate'
import {
  getTalkDescriptionLabel,
  getTalkNameLabel,
  getTalkNickname,
  getTalkServiceUrl,
} from 'classicSrc/redux/modules/selectors'
import PropTypes from 'prop-types'
import { useState, useRef } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { SubmitButton, Form, Header, FormDivider } from './styles'

const errorCodes = ['invalid_phone_number', 'phone_number_already_in_queue']

const CallbackForm = ({
  averageWaitTime,
  callback,
  descriptionLabelText,
  formState,
  nameLabelText,
  nickname,
  serviceUrl,
  showCallbackNumber = false,
  submitTalkCallbackForm,
  supportedCountries,
  updateTalkCallbackForm,
}) => {
  const translate = useTranslate()
  const [showErrors, setShowErrors] = useState(false)
  const formRef = useRef(null)

  const handleFormCompleted = () => {
    if (!formRef.current.state.valid) {
      setShowErrors(true)
      return
    }

    setShowErrors(false)
    submitTalkCallbackForm(serviceUrl, nickname)
  }

  const getErrorMessage = () => {
    if (!callback.error.message) {
      return null
    }

    return errorCodes.includes(callback.error.message)
      ? translate(`embeddable_framework.talk.notify.error.${callback.error.message}`)
      : translate('embeddable_framework.common.notify.error.generic')
  }

  if (callback.success) {
    return <Redirect to={routes.successNotification()} />
  }

  return (
    <Form
      ref={formRef}
      formState={formState}
      onCompleted={handleFormCompleted}
      onChange={updateTalkCallbackForm}
    >
      <Main>
        {showCallbackNumber && <CallbackPhone />}
        <div>
          <Header>{translate('embeddable_framework.talk.form.headerMessage_new')}</Header>
          {averageWaitTime && <AverageWaitTime>{averageWaitTime}</AverageWaitTime>}
        </div>
        <FormDivider />
        <PhoneField
          validate={(val) => formRef.current?.validate(val)}
          required={true}
          onCountrySelect={(country) => {
            updateTalkCallbackForm({ country })
            formRef.current?.validate()
          }}
          supportedCountries={supportedCountries}
          country={formState.country}
          value={formState.phone}
          showError={showErrors}
        />
        <NameField label={nameLabelText} defaultValue={formState.name} />
        <DescriptionField label={descriptionLabelText} defaultValue={formState.description} />
        {getErrorMessage() && <ErrorNotification message={getErrorMessage()} />}
      </Main>
      <Footer>
        <SubmitButton>{translate('embeddable_framework.common.button.send')}</SubmitButton>
      </Footer>
    </Form>
  )
}

CallbackForm.propTypes = {
  showCallbackNumber: PropTypes.bool.isRequired,
  supportedCountries: PropTypes.arrayOf(PropTypes.string),
  formState: PropTypes.object.isRequired,
  callback: PropTypes.shape({
    error: PropTypes.shape({
      message: PropTypes.striing,
    }),
    success: PropTypes.bool,
  }),
  averageWaitTime: PropTypes.string,
  updateTalkCallbackForm: PropTypes.func.isRequired,
  submitTalkCallbackForm: PropTypes.func.isRequired,
  nickname: PropTypes.string.isRequired,
  serviceUrl: PropTypes.string.isRequired,
  nameLabelText: PropTypes.string.isRequired,
  descriptionLabelText: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => {
  return {
    averageWaitTime: getAverageWaitTimeString(state),
    callback: getCallback(state),
    descriptionLabelText: getTalkDescriptionLabel(state),
    formState: getFormState(state),
    nameLabelText: getTalkNameLabel(state),
    nickname: getTalkNickname(state),
    serviceUrl: getTalkServiceUrl(state),
    supportedCountries: getTalkEmbeddableConfig(state).supportedCountries,
  }
}

const actionCreators = {
  updateTalkCallbackForm,
  submitTalkCallbackForm,
}

const connectedComponent = connect(mapStateToProps, actionCreators)(CallbackForm)

export { connectedComponent as default, CallbackForm as Component }
