import React from 'react'
import PropTypes from 'prop-types'
import { Field, Checkbox as GardenCheckbox, Message, Hint } from '@zendeskgarden/react-forms'
import ContactFormLabel from 'embeds/support/components/FormField/ContactFormLabel'
import { TEST_IDS } from 'constants/shared'

const Checkbox = ({ field, value, onChange, errorMessage, errorMessageKey }) => {
  return (
    <div data-testid={TEST_IDS.CHECKBOX_FIELD}>
      <Field>
        <GardenCheckbox
          name={field.keyID}
          checked={value === 1}
          required={Boolean(field.required_in_portal)}
          onChange={e => {
            onChange(e.target.checked ? 1 : 0)
          }}
          validation={errorMessage ? 'error' : undefined}
        >
          {field.title_in_portal && (
            <ContactFormLabel
              value={field.title_in_portal}
              required={field.required_in_portal}
              keyID={field.keyID}
            />
          )}
          {field.description && <Hint>{field.description}</Hint>}

          {errorMessage && (
            <Message validation="error" key={errorMessageKey}>
              {errorMessage}
            </Message>
          )}
        </GardenCheckbox>
      </Field>
    </div>
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
  errorMessage: PropTypes.string,
  errorMessageKey: PropTypes.number
}

export default Checkbox
