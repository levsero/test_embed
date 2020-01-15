import React from 'react'
import PropTypes from 'prop-types'
import SupportPropTypes from 'embeds/support/utils/SupportPropTypes'
import getField from './fields'

const FormField = ({ field, value, onChange, errorMessage, isReadOnly }) => {
  const Field = getField(field.type)

  return (
    <Field
      field={field}
      value={value}
      onChange={onChange}
      errorMessage={errorMessage}
      isReadOnly={isReadOnly}
    />
  )
}

FormField.propTypes = {
  field: SupportPropTypes.ticketField,
  value: PropTypes.any,
  onChange: PropTypes.func,
  errorMessage: PropTypes.string,
  isReadOnly: PropTypes.bool
}

FormField.defaultProps = {
  isReadOnly: false
}

export default FormField
