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
  initialValues = {},
  initialStep = 1,
  formSubmissionStatus = 'unsubmitted',
  nextStepLabel = 'next',
  sendLabel = 'send',
  submittingLabel = 'Sending form',
  submissionErrorLabel = 'Error submitting form. Try again.',
  stepStatusLabel = (activeStep, totalSteps) => `${activeStep} of ${totalSteps}`,
  errorLabels = {
    requiredField: 'This field is required',
    invalidEmail: 'Enter a valid email address',
    fieldMinSize: min => `Must be more than ${min} character${min === 1 ? '' : 's'}`,
    fieldMaxSize: max => `Must be less than ${max} character${max === 1 ? '' : 's'}`
  },
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
  const [formValues, setFormValues] = useState(initialValues)
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
  const { scrollToBottomIfNeeded, scrollToFirstError } = useScroll()

  useLayoutEffect(() => {
    if (totalSteps == activeStep && validationErrors) return
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
    setValidationErrors(validate(fieldsToValidate(), newFormValues, errorLabels))
    onChange(fieldId, newValue)
  }

  const handleOnSubmit = event => {
    event.preventDefault()
    setValidationStep(activeStep)
    setLastSubmittedTimestamp(Date.now())
    const errors = validate(visibleFields, formValues, errorLabels)
    const isValid = Object.keys(errors).length === 0
    setValidationErrors(errors)
    if (isValid) {
      if (activeStep < totalSteps) {
        incrementActiveStep()
      } else {
        onSubmit(formValues)
      }
    } else {
      if (activeStep === totalSteps) {
        scrollToFirstError(visibleFields, errors)
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
                <Steps>{stepStatusLabel(activeStep, totalSteps)}</Steps>
              </TextContainer>

              <FormButton
                isSubmitting={formSubmissionStatus === FORM_MESSAGE_STATUS.pending}
                label={
                  formSubmissionStatus === FORM_MESSAGE_STATUS.pending
                    ? submittingLabel
                    : activeStep === totalSteps
                    ? sendLabel
                    : nextStepLabel
                }
              />
            </FormFooter>
          </Form>
        </FormContainer>
      </Layout>
      {formSubmissionStatus === FORM_MESSAGE_STATUS.failed && (
        <SubmissionError message={submissionErrorLabel} />
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
  stepStatusLabel: PropTypes.func,
  nextStepLabel: PropTypes.string,
  sendLabel: PropTypes.string,
  submittingLabel: PropTypes.string,
  submissionErrorLabel: PropTypes.string,
  errorLabels: PropTypes.object,
  initialStep: PropTypes.number,
  initialValues: PropTypes.object,
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
