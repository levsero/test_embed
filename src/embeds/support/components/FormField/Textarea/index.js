import React from 'react'
import { Field, Hint, Message, Textarea as GardenTextarea } from '@zendeskgarden/react-forms'
import ContactFormLabel from 'src/embeds/support/components/FormField/ContactFormLabel'
import PropTypes from 'prop-types'

const Textarea = ({ field, value, errorMessage, onChange }) => {
  return (
    <Field>
      {field.title_in_portal && (
        <ContactFormLabel value={field.title_in_portal} required={field.required_in_portal} />
      )}
      {field.description && <Hint>{field.description}</Hint>}
      <GardenTextarea
        name={field.id}
        value={value || ''}
        onChange={e => {
          onChange(e.target.value)
        }}
        rows={5}
        required={field.required_in_portal}
        validation={errorMessage ? 'error' : undefined}
      />
      {errorMessage && <Message validation="error">{errorMessage}</Message>}
    </Field>
  )
}

Textarea.propTypes = {
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

export default Textarea
