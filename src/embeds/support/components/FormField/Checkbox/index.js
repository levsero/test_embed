import React from 'react'
import PropTypes from 'prop-types'
import { Field, Checkbox as GardenCheckbox, Message, Hint } from '@zendeskgarden/react-forms'
import ContactFormLabel from 'embeds/support/components/FormField/ContactFormLabel'

const Checkbox = ({ field, value, onChange, errorMessage }) => {
  return (
    <Field>
      <GardenCheckbox
        name={field.id}
        checked={value === 1}
        required={Boolean(field.required_in_portal)}
        onChange={e => {
          onChange(e.target.checked ? 1 : 0)
        }}
        validation={errorMessage ? 'error' : undefined}
      >
        {field.title_in_portal && (
          <ContactFormLabel value={field.title_in_portal} required={field.required_in_portal} />
        )}
        {field.description && <Hint>{field.description}</Hint>}
      </GardenCheckbox>
      {errorMessage && <Message validation="error">{errorMessage}</Message>}
    </Field>
  )
}

Checkbox.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title_in_portal: PropTypes.string,
    description: PropTypes.string,
    required_in_portal: PropTypes.bool
  }),
  value: PropTypes.oneOf([0, 1]),
  onChange: PropTypes.func,
  errorMessage: PropTypes.string
}

export default Checkbox
