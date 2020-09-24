import React from 'react'
import PropTypes from 'prop-types'
import { Label, Value } from '../styles'

const TextResult = ({ field }) => {
  return (
    <>
      <Label>{field.label}</Label>
      <Value>{field.text}</Value>
    </>
  )
}

TextResult.propTypes = {
  field: PropTypes.shape({
    label: PropTypes.string,
    text: PropTypes.string
  })
}

export default TextResult
