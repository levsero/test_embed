import React from 'react'
import PropTypes from 'prop-types'
import { Textarea, Label } from '@zendeskgarden/react-textfields'

import { TextField } from './styles'

const DescriptionField = ({ label, defaultValue }) => {
  return (
    <TextField>
      <Label dangerouslySetInnerHTML={{ __html: label }} />
      <Textarea defaultValue={defaultValue} rows="4" name="description" />
    </TextField>
  )
}

DescriptionField.propTypes = {
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.string
}

export default DescriptionField
