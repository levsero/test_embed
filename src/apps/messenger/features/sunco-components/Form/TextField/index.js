import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import { Input, Label, Field } from './styles'

const TextField = ({ value, label, name, placeholder, onChange }) => {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <Field>
      <Label>{label}</Label>
      <Input
        name={name}
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </Field>
  )
}

TextField.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func
}

export default TextField
