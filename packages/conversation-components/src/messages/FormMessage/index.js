import { useLayoutEffect, useState } from 'react'
import PropTypes from 'prop-types'

import { FORM_MESSAGE_STATUS, MESSAGE_STATUS } from 'src/constants'
import PrimaryParticipantLayout from 'src/layouts/PrimaryParticipantLayout'
import OtherParticipantLayout from 'src/layouts/OtherParticipantLayout'
import FormField from './FormField'
import FormButton from './FormButton'
import SubmissionError from './SubmissionError'
import validateFields from './validateFields'
import { useScroll } from 'src/hooks/useScrollBehaviour'
import { FormContainer, Form, FormFooter, TextContainer, Steps, Fields, Field } from './styles'

const FormMessage = ({
  label,
  avatar,
  fields = [],
  values = {},
  initialStep = 1,
  formSubmissionStatus = 'unsubmitted',
  status = 'sent',
  timeReceived,
  isPrimaryParticipant = false,
  isFirstInGroup = true,
  isReceiptVisible = false,
  isFreshMessage = true,
  onValidate = undefined,
  onStepChange = (_oldStep, _newStep) => {},
  onChange = (_fieldId, _value) => {},
  onSubmit = _formValues => {},
  onRetry = () => {}
}) => {
  const Layout = isPrimaryParticipant ? PrimaryParticipantLayout : OtherParticipantLayout
  const [activeStep, setActiveStep] = useState(initialStep)
  const totalSteps = fields.length
  const visibleFields = fields.slice(0, activeStep)
  const [formValues, setFormValues] = useState(values)
  // The purpose of lastSubmittedTimestamp is to have some kind of trigger to get error messages
  // to be read out loud by screen readers when the user attempts to submit a form
  // but the error strings remain the same.
  // The role="alert" will only read out the message if its new, or if the text changes
  // so by passing key={lastSubmittedTimestamp} to error messages, new elements are created
  // when the key changes.
  const [lastSubmittedTimestamp, setLastSubmittedTimestamp] = useState(Date.now())
  const validate = onValidate || validateFields
  const [validationStep, setValidationStep] = useState(activeStep === 1 ? 0 : activeStep)
  const [validationErrors, setValidationErrors] = useState({})
  const fieldsToValidate = () => {
    if (validationStep === 0) return []
    return fields.slice(0, validationStep)
  }
  const { scrollToBottomIfNeeded } = useScroll()

  useLayoutEffect(() => {
    scrollToBottomIfNeeded()
  })

  const incrementActiveStep = () => {
    if (activeStep < totalSteps) {
      setActiveStep(activeStep + 1)
      onStepChange(activeStep, activeStep + 1)
    }
  }

  const handleOnChange = (fieldId, newValue) => {
    const newFormValues = { ...formValues }
    newFormValues[fieldId] = newValue
    setFormValues(newFormValues)
    setValidationErrors(validate(fieldsToValidate(), newFormValues))
    onChange(fieldId, newValue)
  }

  const handleOnSubmit = event => {
    event.preventDefault()
    setValidationStep(activeStep)
    setLastSubmittedTimestamp(Date.now())
    const errors = validate(visibleFields, formValues)
    const isValid = Object.keys(errors).length === 0
    setValidationErrors(errors)
    if (isValid) {
      if (activeStep < totalSteps) {
        incrementActiveStep()
      } else {
        onSubmit(formValues)
      }
    }
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
          <Form onSubmit={handleOnSubmit} noValidate={true}>
            <Fields>
              {visibleFields.map(field => {
                return (
                  <Field key={field._id}>
                    <FormField
                      field={field}
                      value={formValues[field._id]}
                      error={validationErrors[field._id]}
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
                  {activeStep} of {totalSteps}
                </Steps>
              </TextContainer>

              <FormButton
                submitting={formSubmissionStatus === FORM_MESSAGE_STATUS.pending}
                label={activeStep === totalSteps ? 'Send' : 'Next'}
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
  initialStep: PropTypes.number,
  values: PropTypes.object,
  formSubmissionStatus: PropTypes.oneOf(Object.values(FORM_MESSAGE_STATUS)),
  status: PropTypes.oneOf(Object.values(MESSAGE_STATUS)),
  timeReceived: PropTypes.number,
  isFirstInGroup: PropTypes.bool,
  isReceiptVisible: PropTypes.bool,
  isFreshMessage: PropTypes.bool,
  onStepChange: PropTypes.func,
  onChange: PropTypes.func,
  onValidate: PropTypes.func,
  onSubmit: PropTypes.func,
  onRetry: PropTypes.func
}

export default FormMessage
