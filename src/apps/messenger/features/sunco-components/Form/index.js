import React, { useState } from 'react'
import PropTypes from 'prop-types'

import OtherParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/OtherParticipantLayout'
import FormButton from './FormButton'

import { FormContainer, Form, FormFooter, TextContainer, Steps } from './styles'
import SubmissionError from './SubmissionError'
import FormField from 'src/apps/messenger/features/sunco-components/Form/FormField'

const SuncoFormMessage = ({
  fields,
  values,
  handleSubmit,
  onChange,
  avatar,
  label,
  isFirstInGroup,
  status,
  formStatus,
  onStep
}) => {
  const [activeStep, setActiveStep] = useState(1)
  const visibleFields = fields.slice(0, activeStep)
  const numberOfFields = fields.length

  const onSubmit = e => {
    e.preventDefault()

    if (activeStep !== numberOfFields) {
      onStep()
      return setActiveStep(activeStep + 1)
    } else {
      return handleSubmit()
    }
  }

  return (
    <>
      <OtherParticipantLayout isFirstInGroup={isFirstInGroup} avatar={avatar} label={label}>
        <FormContainer>
          <Form onSubmit={onSubmit}>
            {visibleFields.map(field => {
              return (
                <FormField
                  key={field._id}
                  value={values[field._id]}
                  onChange={value => onChange(field._id, value)}
                  field={field}
                  error={undefined}
                  lastSubmittedTimestamp={undefined}
                />
              )
            })}

            <FormFooter>
              <TextContainer>
                <Steps>
                  {activeStep} of {numberOfFields}
                </Steps>
              </TextContainer>

              <FormButton
                submitting={status === formStatus.pending}
                label={activeStep === numberOfFields ? 'Submit' : 'Next'}
              />
            </FormFooter>
          </Form>
        </FormContainer>
      </OtherParticipantLayout>
      {status === formStatus.failure && (
        <SubmissionError message={'Error submitting form. Try again.'} />
      )}
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
  handleSubmit: PropTypes.func,
  onChange: PropTypes.func,
  avatar: PropTypes.string,
  label: PropTypes.string,
  status: PropTypes.string,
  isFirstInGroup: PropTypes.bool,
  formStatus: PropTypes.shape({
    failure: PropTypes.string,
    success: PropTypes.string,
    pending: PropTypes.string
  }),
  onStep: PropTypes.func
}

export default SuncoFormMessage
