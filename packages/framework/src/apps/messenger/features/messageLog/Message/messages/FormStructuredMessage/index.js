import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { FormMessage, FORM_MESSAGE_STATUS, MESSAGE_STATUS } from '@zendesk/conversation-components'
import useForm from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/useForm'
import { useScroll } from 'src/apps/messenger/features/messageLog/hooks/useScrollBehaviour'

const FormStructuredMessage = ({
  message: {
    _id,
    avatarUrl,
    fields,
    status,
    isFirstInGroup,
    isLastMessageInAuthorGroup,
    isFirstMessageInAuthorGroup,
    name
  }
}) => {
  const messageStatus = status ?? MESSAGE_STATUS.sent
  const {
    onChange,
    onSubmit,
    onStep,
    values,
    formSubmissionStatus,
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
    if (Object.keys(errors).length > 0 || formSubmissionStatus === FORM_MESSAGE_STATUS.failed) {
      scrollToBottomIfNeeded()
    }
  }, [errors, formSubmissionStatus])

  return (
    <FormMessage
      avatar={isLastMessageInAuthorGroup ? avatarUrl : undefined}
      label={isFirstMessageInAuthorGroup ? name : undefined}
      activeStep={step}
      fields={fields}
      values={values}
      errors={errors}
      status={messageStatus}
      formSubmissionStatus={formSubmissionStatus}
      isFirstInGroup={isFirstInGroup}
      isReceiptVisible={false}
      lastSubmittedTimestamp={lastSubmittedTimestamp}
      onSubmit={onSubmit}
      onStep={onStep}
      onChange={(fieldId, newValue) => {
        onChange({
          [fieldId]: newValue
        })
      }}
    />
  )
}

FormStructuredMessage.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.string,
    text: PropTypes.string,
    isFirstInGroup: PropTypes.bool,
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
