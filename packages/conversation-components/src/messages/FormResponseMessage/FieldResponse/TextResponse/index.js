import PropTypes from 'prop-types'
import { Label, Value } from '../styles'

const TextResponse = ({ field }) => {
  return (
    <>
      <Label>{field.label}</Label>
      <Value>{field.text}</Value>
    </>
  )
}

TextResponse.propTypes = {
  field: PropTypes.shape({
    label: PropTypes.string,
    text: PropTypes.string,
  }),
}

export default TextResponse
