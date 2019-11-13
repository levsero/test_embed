import React from 'react'
import PropTypes from 'prop-types'
import { Field, Hint, Input, Message } from '@zendeskgarden/react-forms'
import ContactFormLabel from 'src/embeds/support/components/FormField/ContactFormLabel'

const Text = ({ field, value, errorMessage, onChange }) => {
  return (
    <Field>
      {field.title_in_portal && (
        <ContactFormLabel value={field.title_in_portal} required={field.required_in_portal} />
      )}

      {field.description && <Hint>{field.description}</Hint>}

      <Input
        name={field.id}
        value={value || ''}
        required={Boolean(field.required_in_portal)}
        onChange={e => {
          onChange(e.target.value)
        }}
        validation={errorMessage ? 'error' : undefined}
      />
      {errorMessage && <Message validation="error">{errorMessage}</Message>}
    </Field>
  )
}

Text.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title_in_portal: PropTypes.string,
    description: PropTypes.string,
    required_in_portal: PropTypes.bool
  }),
  value: PropTypes.string,
  onChange: PropTypes.func,
  errorMessage: PropTypes.string
}

export default Text
