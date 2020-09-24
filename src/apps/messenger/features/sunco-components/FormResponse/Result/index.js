import React from 'react'
import PropTypes from 'prop-types'
import TextResult from './TextResult'
import EmailResult from './EmailResult'
import SelectResult from './SelectResult'

const fields = {
  text: TextResult,
  email: EmailResult,
  select: SelectResult
}

const Field = ({ field }) => {
  const FieldComponent = fields[field.type]

  if (!FieldComponent) {
    return null
  }

  return <FieldComponent field={field} />
}

Field.propTypes = {
  field: PropTypes.shape({
    type: PropTypes.oneOf(Object.keys(fields))
  })
}

export default Field
