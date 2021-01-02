import { useState } from 'react'
import PropTypes from 'prop-types'

import { FORM_MESSAGE_STATUS, MESSAGE_STATUS } from 'src/constants'
import PrimaryParticipantLayout from 'src/layouts/PrimaryParticipantLayout'
import OtherParticipantLayout from 'src/layouts/OtherParticipantLayout'
import FormField from './FormField'
import FormButton from './FormButton'
import SubmissionError from './SubmissionError'
import { FormContainer, Form, FormFooter, TextContainer, Steps, Fields, Field } from './styles'

const FormMessage = ({
  label,
  avatar,
  fields = [],
  values = {},
  formSubmissionStatus = 'unsubmitted',
  status = 'sent',
  activeStep = 1,
  errors = {},
  timeReceived,
  lastSubmittedTimestamp,
  isPrimaryParticipant = false,
  isFirstInGroup = true,
  isReceiptVisible = false,
  isFreshMessage = true,
  onStep = _currentStep => {},
  onChange = (_fieldId, _value) => {},
  onSubmit = _formValues => {},
  onRetry = () => {}
}) => {
  const Layout = isPrimaryParticipant ? PrimaryParticipantLayout : OtherParticipantLayout
  const [currentStep, setCurrentStep] = useState(activeStep)
  const [formValues, setFormValues] = useState(values)
  const totalSteps = fields.length
  const visibleFields = fields.slice(0, currentStep)

  const incrementCurrentStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1)
  }

  const handleOnChange = (fieldId, newValue) => {
    const newFormValues = { ...formValues }
    newFormValues[fieldId] = newValue
    setFormValues(newFormValues)
    onChange(fieldId, newValue)
  }

  return (
    <>
      <Layout
        isFirstInGroup={isFirstInGroup}
        avatar={avatar}
        label={label}
        onRetry={onRetry}
        timeReceived={timeReceived}
        isReceiptVisible={isReceiptVisible}
        status={status}
        isFreshMessage={isFreshMessage}
      >
        <FormContainer>
          <Form
            onSubmit={e => {
              e.preventDefault()
              if (currentStep < totalSteps) {
                incrementCurrentStep()
                onStep(currentStep)
              } else {
                onSubmit(formValues)
              }
            }}
            noValidate={true}
          >
            <Fields>
              {visibleFields.map(field => {
                return (
                  <Field key={field._id}>
                    <FormField
                      field={field}
                      value={formValues[field._id]}
                      error={errors[field._id]}
                      onChange={newValue => handleOnChange(field._id, newValue)}
                      lastSubmittedTimestamp={lastSubmittedTimestamp}
                    />
                  </Field>
                )
              })}
            </Fields>

            <FormFooter>
              <TextContainer>
                <Steps>
                  {currentStep} of {totalSteps}
                </Steps>
              </TextContainer>

              <FormButton
                submitting={formSubmissionStatus === FORM_MESSAGE_STATUS.pending}
                label={currentStep === totalSteps ? 'Send' : 'Next'}
              />
            </FormFooter>
          </Form>
        </FormContainer>
      </Layout>
      {formSubmissionStatus === FORM_MESSAGE_STATUS.failed && (
        <SubmissionError message={'Error submitting form. Try again.'} />
      )}
    </>
  )
}

FormMessage.propTypes = {
  isPrimaryParticipant: PropTypes.bool,
  avatar: PropTypes.string,
  label: PropTypes.string,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      label: PropTypes.string,
      type: PropTypes.string
    })
  ),
  values: PropTypes.object,
  formSubmissionStatus: PropTypes.oneOf(Object.values(FORM_MESSAGE_STATUS)),
  status: PropTypes.oneOf(Object.values(MESSAGE_STATUS)),
  timeReceived: PropTypes.number,
  activeStep: PropTypes.number,
  errors: PropTypes.objectOf(PropTypes.string),

  // The purpose of this prop is to have some kind of trigger to get error messages
  // to be read out loud by screen readers when the user attempts to submit a form
  // but the error strings remain the same.
  // The role="alert" will only read out the message if its new, or if the text changes
  // so by passing key={lastSubmittedTimestamp} to error messages, new elements are created
  // when the key changes.
  lastSubmittedTimestamp: PropTypes.number,
  isFirstInGroup: PropTypes.bool,
  isReceiptVisible: PropTypes.bool,
  isFreshMessage: PropTypes.bool,
  onChange: PropTypes.func,
  onStep: PropTypes.func,
  onSubmit: PropTypes.func,
  onRetry: PropTypes.func
}

export default FormMessage
