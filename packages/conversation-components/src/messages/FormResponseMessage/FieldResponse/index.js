import PropTypes from 'prop-types'
import EmailResponse from './EmailResponse'
import SelectResponse from './SelectResponse'
import TextResponse from './TextResponse'

const fields = {
  text: TextResponse,
  email: EmailResponse,
  select: SelectResponse,
}

const FieldResponse = ({ field }) => {
  const FieldComponent = fields[field.type]

  if (!FieldComponent) {
    return null
  }

  return <FieldComponent field={field} />
}

FieldResponse.propTypes = {
  field: PropTypes.shape({
    type: PropTypes.oneOf(Object.keys(fields)),
  }),
}

export default FieldResponse
