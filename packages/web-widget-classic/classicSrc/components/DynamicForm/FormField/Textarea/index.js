import ContactFormLabel from 'classicSrc/components/DynamicForm/FormField/ContactFormLabel'
import PropTypes from 'prop-types'
import { Field, Hint, Message, Textarea as GardenTextarea } from '@zendeskgarden/react-forms'

const Textarea = ({
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
      <GardenTextarea
        name={field.id}
        value={value || ''}
        readOnly={isReadOnly}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        rows={5}
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

Textarea.propTypes = {
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

export default Textarea
