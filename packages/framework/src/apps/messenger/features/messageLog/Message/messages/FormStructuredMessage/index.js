import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Form from 'src/apps/messenger/features/sunco-components/Form'
import useForm from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/useForm'
import { useScroll } from 'src/apps/messenger/features/messageLog/hooks/useScrollBehaviour'
import { FORM_MESSAGE_STATUS } from 'src/apps/messenger/features/sunco-components/constants'

const FormStructuredMessage = ({
  message: {
    _id,
    avatarUrl,
    fields,
    isFirstInGroup,
    isLastMessageInAuthorGroup,
    isFirstMessageInAuthorGroup,
    name
  }
}) => {
  const {
    onChange,
    onSubmit,
    onStep,
    values,
    status,
    step,
    errors,
    lastSubmittedTimestamp
  } = useForm({
    formId: _id,
    fields
  })
  const { scrollToBottomIfNeeded } = useScroll()
  const previousStep = useRef(step)

  useEffect(() => {
    if (previousStep.current !== step) {
      scrollToBottomIfNeeded()
    }

    previousStep.current = step
  }, [step, scrollToBottomIfNeeded, previousStep])

  useEffect(() => {
    if (Object.keys(errors).length > 0 || status === FORM_MESSAGE_STATUS.failed) {
      scrollToBottomIfNeeded()
    }
  }, [errors, status])

  return (
    <Form
      fields={fields}
      values={values}
      onSubmit={onSubmit}
      onStep={onStep}
      onChange={(fieldId, newValue) => {
        onChange({
          [fieldId]: newValue
        })
      }}
      avatar={isLastMessageInAuthorGroup ? avatarUrl : undefined}
      label={isFirstMessageInAuthorGroup ? name : undefined}
      isFirstInGroup={isFirstInGroup}
      status={status}
      activeStep={step}
      errors={errors}
      lastSubmittedTimestamp={lastSubmittedTimestamp}
    />
  )
}

FormStructuredMessage.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.string,
    text: PropTypes.string,
    isFirstInGroup: PropTypes.bool,
    isLastInGroup: PropTypes.bool,
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        type: PropTypes.string,
        name: PropTypes.string,
        label: PropTypes.string
      })
    ),
    avatarUrl: PropTypes.string,
    name: PropTypes.string
  })
}

export default FormStructuredMessage
