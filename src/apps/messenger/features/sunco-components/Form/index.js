import React, { useState } from 'react'
import PropTypes from 'prop-types'

import OtherParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/OtherParticipantLayout'
import TextField from 'src/apps/messenger/features/sunco-components/Form/TextField'
import FormButton from './FormButton'

import { FormContainer, Form, FormFooter, TextContainer, Steps } from './styles'
import SubmissionError from './SubmissionError'

const SuncoFormMessage = ({
  fields,
  values,
  handleSubmit,
  onChange,
  avatar,
  label,
  isFirstInGroup,
  status,
  formStatus
}) => {
  const [activeStep, setActiveStep] = useState(1)
  const visibleFields = fields.slice(0, activeStep)
  const numberOfFields = fields.length

  const onSubmit = e => {
    e.preventDefault()

    if (activeStep !== numberOfFields) {
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
                <TextField
                  label={field.label}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={values[field._id] || ''}
                  onChange={e => onChange(field._id, e.target.value)}
                  key={field._id}
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
  })
}

export default SuncoFormMessage
