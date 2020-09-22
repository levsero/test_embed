import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { getClient } from 'src/apps/messenger/suncoClient'
import Form from 'src/apps/messenger/features/sunco-components/Form'

const formStatus = { failure: 'failure', pending: 'pending', success: 'success' }

const FormMessage = ({
  message: { _id, isFirstInGroup, isLastInGroup, fields, avatarUrl, name }
}) => {
  const [values, setValues] = useState({})
  const [status, setStatus] = useState('')

  if (status === formStatus.success) return null

  const responseFields = fields.map(field => {
    return { type: field.type, name: field.name, label: field.label, text: values[field._id] }
  })

  const handleSubmit = () => {
    const client = getClient()

    setStatus(formStatus.pending)

    Promise.resolve(client.sendFormResponse(responseFields, _id))
      .then(() => {
        setStatus(formStatus.success)
      })
      .catch(() => {
        setStatus(formStatus.failure)
      })
  }

  const onChange = (fieldId, newValue) => {
    setValues({
      ...values,
      [fieldId]: newValue
    })
  }

  return (
    <Form
      fields={fields}
      values={values}
      handleSubmit={handleSubmit}
      onChange={onChange}
      avatar={isLastInGroup ? avatarUrl : undefined}
      label={isFirstInGroup ? name : undefined}
      isFirstInGroup={isFirstInGroup}
      status={status}
      formStatus={formStatus}
    />
  )
}

FormMessage.propTypes = {
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

export default FormMessage
