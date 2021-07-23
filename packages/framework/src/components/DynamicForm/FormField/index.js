import PropTypes from 'prop-types'
import SupportPropTypes from 'src/embeds/support/utils/SupportPropTypes'
import getField from './fields'

const FormField = ({
  field,
  value,
  onChange,
  errorMessage,
  isReadOnly,
  isPreview,
  errorMessageKey,
  extraFieldOptions,
}) => {
  const Field = getField(field.type, extraFieldOptions)

  return (
    <Field
      field={field}
      value={value}
      onChange={onChange}
      errorMessage={errorMessage}
      isReadOnly={isReadOnly}
      isPreview={isPreview}
      errorMessageKey={errorMessageKey}
    />
  )
}

FormField.propTypes = {
  field: SupportPropTypes.ticketField,
  value: PropTypes.any,
  onChange: PropTypes.func,
  errorMessage: PropTypes.string,
  isReadOnly: PropTypes.bool,
  isPreview: PropTypes.bool,
  errorMessageKey: PropTypes.number,
  extraFieldOptions: PropTypes.objectOf(PropTypes.elementType),
}

FormField.defaultProps = {
  isReadOnly: false,
}

export default FormField
