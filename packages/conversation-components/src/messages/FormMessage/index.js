import PropTypes from 'prop-types'

import { FORM_MESSAGE_STATUS } from 'src/constants'
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
  isFirstInGroup,
  status,
  activeStep,
  errors,
  lastSubmittedTimestamp,
  onStep = () => {},
  onChange = () => {},
  onSubmit = () => {}
}) => {
  const visibleFields = fields.slice(0, activeStep)

  return (
    <>
      <OtherParticipantLayout isFirstInGroup={isFirstInGroup} avatar={avatar} label={label}>
        <FormContainer>
          <Form
            onSubmit={e => {
              e.preventDefault()
              if (activeStep < fields.length) {
                onStep()
              } else {
                onSubmit()
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
                      value={values[field._id]}
                      error={errors[field._id]}
                      onChange={value => onChange(field._id, value)}
                      lastSubmittedTimestamp={lastSubmittedTimestamp}
                    />
                  </Field>
                )
              })}
            </Fields>

            <FormFooter>
              <TextContainer>
                <Steps>
                  {activeStep} of {fields.length}
                </Steps>
              </TextContainer>

              <FormButton
                submitting={status === FORM_MESSAGE_STATUS.pending}
                label={activeStep === fields.length ? 'Send' : 'Next'}
              />
            </FormFooter>
          </Form>
        </FormContainer>
      </OtherParticipantLayout>
      {status === FORM_MESSAGE_STATUS.failed && (
        <SubmissionError message={'Error submitting form. Try again.'} />
      )}
    </>
  )
}

FormMessage.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      label: PropTypes.string,
      type: PropTypes.string
    })
  ),
  values: PropTypes.object,
  onSubmit: PropTypes.func,
  onStep: PropTypes.func,
  onChange: PropTypes.func,
  avatar: PropTypes.string,
  label: PropTypes.string,
  status: PropTypes.oneOf(Object.values(FORM_MESSAGE_STATUS)),
  isFirstInGroup: PropTypes.bool,

  activeStep: PropTypes.number,
  errors: PropTypes.objectOf(PropTypes.string),

  // The purpose of this prop is to have some kind of trigger to get error messages
  // to be read out loud by screen readers when the user attempts to submit a form
  // but the error strings remain the same.
  // The role="alert" will only read out the message if its new, or if the text changes
  // so by passing key={lastSubmittedTimestamp} to error messages, new elements are created
  // when the key changes.
  lastSubmittedTimestamp: PropTypes.number
}

export default FormMessage
