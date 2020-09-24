import React from 'react'
import PropTypes from 'prop-types'

import OtherParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/OtherParticipantLayout'
import FormField from 'src/apps/messenger/features/sunco-components/Form/FormField'

import FormButton from './FormButton'
import SubmissionError from './SubmissionError'
import { FormContainer, Form, FormFooter, TextContainer, Steps, Fields, Field } from './styles'

const SuncoFormMessage = ({
  fields,
  values,
  onSubmit,
  onStep,
  onChange,
  avatar,
  label,
  isFirstInGroup,
  status,
  step,
  errors,
  lastSubmittedTimestamp
}) => {
  const visibleFields = fields.slice(0, step)

  return (
    <>
      <OtherParticipantLayout isFirstInGroup={isFirstInGroup} avatar={avatar} label={label}>
        <FormContainer>
          <Form
            onSubmit={e => {
              e.preventDefault()

              if (step < fields.length) {
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
                  {step} of {fields.length}
                </Steps>
              </TextContainer>

              <FormButton
                submitting={status === 'pending'}
                label={step === fields.length ? 'Submit' : 'Next'}
              />
            </FormFooter>
          </Form>
        </FormContainer>
      </OtherParticipantLayout>
      {status === 'failed' && <SubmissionError message={'Error submitting form. Try again.'} />}
    </>
  )
}

SuncoFormMessage.propTypes = {
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
  status: PropTypes.oneOf(['not submitted', 'pending', 'success', 'failed']),
  isFirstInGroup: PropTypes.bool,

  step: PropTypes.number,
  errors: PropTypes.objectOf(PropTypes.string),
  lastSubmittedTimestamp: PropTypes.number
}

export default SuncoFormMessage
