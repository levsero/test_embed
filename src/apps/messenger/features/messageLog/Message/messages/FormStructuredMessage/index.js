import React from 'react'
import PropTypes from 'prop-types'
import Form from 'src/apps/messenger/features/sunco-components/Form'
import useForm from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/useForm'

const FormStructuredMessage = ({
  message: { _id, isFirstInGroup, isLastInGroup, fields, avatarUrl, name },
  scrollToBottomIfNeeded
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

  return (
    <Form
      fields={fields}
      values={values}
      onSubmit={onSubmit}
      onStep={() => {
        onStep()
        scrollToBottomIfNeeded()
      }}
      onChange={(fieldId, newValue) => {
        onChange({
          [fieldId]: newValue
        })
      }}
      avatar={isLastInGroup ? avatarUrl : undefined}
      label={isFirstInGroup ? name : undefined}
      isFirstInGroup={isFirstInGroup}
      status={status}
      step={step}
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
