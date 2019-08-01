import React from 'react'
import { locals as styles } from './styles/index.scss'
import PropTypes from 'prop-types'
import { TextField, Input, Label } from '@zendeskgarden/react-textfields'

const NameField = ({ label, defaultValue }) => {
  return (
    <TextField className={styles.textField}>
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
