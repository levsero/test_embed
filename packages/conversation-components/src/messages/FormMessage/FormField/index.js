import PropTypes from 'prop-types'
import EmailField from './EmailField'
import SelectField from './SelectField'
import TextField from './TextField'

const fields = {
  text: TextField,
  email: EmailField,
  select: SelectField,
}

const FormField = ({ field, onChange, value, error, lastSubmittedTimestamp, canFocus }) => {
  const FieldComponent = fields[field.type]

  if (!FieldComponent) {
    return null
  }

  return (
    <FieldComponent
      field={field}
      value={value}
      onChange={onChange}
      error={error}
      lastSubmittedTimestamp={lastSubmittedTimestamp}
      canFocus={canFocus}
    />
  )
}

FormField.propTypes = {
  field: PropTypes.shape({
    type: PropTypes.oneOf(Object.keys(fields)),
  }),
  onChange: PropTypes.func,
  value: PropTypes.any,
  error: PropTypes.string,
  lastSubmittedTimestamp: PropTypes.number,
  canFocus: PropTypes.bool,
}

export default FormField
