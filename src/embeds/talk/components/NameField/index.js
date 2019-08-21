import React from 'react'
import PropTypes from 'prop-types'
import { Input, Label } from '@zendeskgarden/react-textfields'
import { TextField } from './styles'

const NameField = ({ label, defaultValue }) => {
  return (
    <TextField>
      <Label dangerouslySetInnerHTML={{ __html: label }} />
      <Input defaultValue={defaultValue} name="name" />
    </TextField>
  )
}

NameField.propTypes = {
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.string
}

export default NameField
