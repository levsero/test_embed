import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import { Input, Label, Field } from './styles'
import Message from 'src/apps/messenger/features/sunco-components/Form/FormField/Message'

const EmailField = ({ field, value = '', onChange, error, lastSubmittedTimestamp }) => {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <Field>
      <Label>{field.label}</Label>
      <Input
        type="email"
        name={field.name}
        ref={inputRef}
        placeholder={field.placeholder}
        value={value}
        onChange={e => {
          onChange(e.target.value)
        }}
        validation={error ? 'error' : undefined}
      />
      {error && (
        <Message validation="error" key={lastSubmittedTimestamp}>
          {error}
        </Message>
      )}
    </Field>
  )
}

EmailField.propTypes = {
  field: PropTypes.shape({
    label: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string
  }),
  value: PropTypes.string,
  onChange: PropTypes.func,
  lastSubmittedTimestamp: PropTypes.number,
  error: PropTypes.string
}

export default EmailField
