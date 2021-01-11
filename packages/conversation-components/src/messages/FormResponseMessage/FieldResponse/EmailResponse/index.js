import PropTypes from 'prop-types'
import { Label, Value } from '../styles'

const EmailResponse = ({ field }) => {
  return (
    <>
      <Label>{field.label}</Label>
      <Value>{field.email}</Value>
    </>
  )
}

EmailResponse.propTypes = {
  field: PropTypes.shape({
    label: PropTypes.string,
    email: PropTypes.string
  })
}

export default EmailResponse
