import PropTypes from 'prop-types'
import { ErrorIcon, Alert } from './styles'

const SubmissionError = ({ message }) => {
  return (
    <Alert role="alert">
      <ErrorIcon />
      {message}
    </Alert>
  )
}

SubmissionError.propTypes = {
  message: PropTypes.string.isRequired,
}

export default SubmissionError
