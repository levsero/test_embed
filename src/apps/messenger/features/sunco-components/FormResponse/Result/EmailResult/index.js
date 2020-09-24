import React from 'react'
import PropTypes from 'prop-types'
import { Label, Value } from '../styles'

const EmailResult = ({ field }) => {
  return (
    <>
      <Label>{field.label}</Label>
      <Value>{field.email}</Value>
    </>
  )
}

EmailResult.propTypes = {
  field: PropTypes.shape({
    label: PropTypes.string,
    email: PropTypes.string
  })
}

export default EmailResult
