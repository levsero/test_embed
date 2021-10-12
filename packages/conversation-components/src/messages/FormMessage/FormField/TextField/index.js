import PropTypes from 'prop-types'
import { useRef, useEffect } from 'react'
import Message from 'src/messages/FormMessage/FormField/Message'
import { Input, Label, Field } from './styles'

const TextField = ({ field, value = '', onChange, error, lastSubmittedTimestamp, canFocus }) => {
  const inputRef = useRef(null)

  useEffect(() => {
    if (canFocus) {
      inputRef.current?.focus()
    }
  }, [canFocus])

  return (
    <Field>
      <Label data-label-id={field._id}>{field.label}</Label>
      <Input
        name={field.name}
        data-id={field._id}
        ref={inputRef}
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => {
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

TextField.propTypes = {
  field: PropTypes.shape({
    label: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
  }),
  value: PropTypes.string,
  onChange: PropTypes.func,
  lastSubmittedTimestamp: PropTypes.number,
  error: PropTypes.string,
  canFocus: PropTypes.bool,
}

export default TextField
