import PropTypes from 'prop-types'
import TextField from './TextField'
import EmailField from './EmailField'
import SelectField from './SelectField'

const fields = {
  text: TextField,
  email: EmailField,
  select: SelectField,
}

const FormField = ({ field, onChange, value, error, lastSubmittedTimestamp }) => {
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
}

export default FormField
