import { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import { restoreHostPageScrollPositionIfSafari } from 'src/utils/hostPageWindow'
import Message from 'src/messages/FormMessage/FormField/Message'
import { Input, Label, Field } from './styles'

const EmailField = ({ field, value = '', onChange, error, lastSubmittedTimestamp }) => {
  const inputRef = useRef(null)

  useEffect(() => {
    restoreHostPageScrollPositionIfSafari(() => {
      inputRef.current?.focus()
    })
  }, [])

  return (
    <Field>
      <Label data-label-id={field._id}>{field.label}</Label>
      <Input
        type="email"
        data-id={field._id}
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
