import React from 'react'
import PropTypes from 'prop-types'
import getField from './fields'

const FormField = ({ field, value, onChange, errorMessage }) => {
  const Field = getField(field.type)

  return <Field field={field} value={value} onChange={onChange} errorMessage={errorMessage} />
}

FormField.propTypes = {
  field: PropTypes.shape({
    type: PropTypes.string
  }),
  value: PropTypes.any,
  onChange: PropTypes.func,
  errorMessage: PropTypes.string
}

export default FormField
