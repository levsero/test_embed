import React from 'react'
import PropTypes from 'prop-types'
import { FormMessage, MESSAGE_STATUS } from '@zendesk/conversation-components'
import useForm from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/useForm'

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
  const { onChange, onSubmit, values, formSubmissionStatus, step, onStepChange } = useForm({
    formId: _id,
    fields
  })

  return (
    <FormMessage
      avatar={isLastMessageInAuthorGroup ? avatarUrl : undefined}
      label={isFirstMessageInAuthorGroup ? name : undefined}
      fields={fields}
      initialStep={step}
      initialValues={values}
      status={messageStatus}
      formSubmissionStatus={formSubmissionStatus}
      isFirstInGroup={isFirstInGroup}
      isReceiptVisible={false}
      onStepChange={onStepChange}
      onSubmit={onSubmit}
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
