import React from 'react'
import PropTypes from 'prop-types'
import { Field, Checkbox as GardenCheckbox, Message, Hint } from '@zendeskgarden/react-forms'
import ContactFormLabel from 'src/components/DynamicForm/FormField/ContactFormLabel'
import { TEST_IDS } from 'constants/shared'

const Checkbox = ({ field, value, onChange, errorMessage, errorMessageKey }) => {
  return (
    <div data-testid={TEST_IDS.CHECKBOX_FIELD}>
      <Field>
        <GardenCheckbox
          name={field.id}
          checked={value === 1}
          required={Boolean(field.required)}
          onChange={e => {
            onChange(e.target.checked ? 1 : 0)
          }}
          validation={errorMessage ? 'error' : undefined}
        >
          {field.title && (
            <ContactFormLabel value={field.title} required={field.required} fieldId={field.id} />
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
    title: PropTypes.string,
    description: PropTypes.string,
    required: PropTypes.bool
  }),
  value: PropTypes.oneOf([0, 1]),
  onChange: PropTypes.func,
  errorMessage: PropTypes.string,
  errorMessageKey: PropTypes.number
}

export default Checkbox