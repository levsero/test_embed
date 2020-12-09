import React from 'react'
import PropTypes from 'prop-types'
import { Field, Label } from '@zendeskgarden/react-forms'
import { Textarea } from './styles'

const DescriptionField = ({ label, defaultValue }) => {
  return (
    <Field>
      <Label dangerouslySetInnerHTML={{ __html: label }} />
      <Textarea defaultValue={defaultValue} rows="4" name="description" />
    </Field>
  )
}

DescriptionField.propTypes = {
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.string
}

export default DescriptionField
