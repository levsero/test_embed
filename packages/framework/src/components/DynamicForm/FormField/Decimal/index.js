import PropTypes from 'prop-types'
import { Field, Hint, Input, Message } from '@zendeskgarden/react-forms'
import ContactFormLabel from 'src/components/DynamicForm/FormField/ContactFormLabel'

const Decimal = ({
  field,
  value,
  errorMessage,
  errorMessageKey,
  onChange,
  isReadOnly,
  isPreview,
}) => {
  return (
    <Field>
      {field.title && (
        <ContactFormLabel
          value={field.title}
          required={field.required}
          fieldId={field.id}
          isReadOnly={isReadOnly}
          isPreview={isPreview}
        />
      )}

      {field.description && <Hint>{field.description}</Hint>}

      <Input
        name={field.id}
        value={value || ''}
        readOnly={isReadOnly}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        type="number"
        step="any"
        required={field.required}
        validation={errorMessage ? 'error' : undefined}
      />

      {errorMessage && (
        <Message validation="error" key={errorMessageKey}>
          {errorMessage}
        </Message>
      )}
    </Field>
  )
}

Decimal.propTypes = {
  field: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    description: PropTypes.string,
    required: PropTypes.bool,
  }),
  value: PropTypes.string,
  onChange: PropTypes.func,
  errorMessage: PropTypes.string,
  isReadOnly: PropTypes.bool,
  isPreview: PropTypes.bool,
  errorMessageKey: PropTypes.number,
}

export default Decimal
