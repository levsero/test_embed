import PropTypes from 'prop-types'
import { Container, ErrorSpan, ErrorButton } from './styles'

const MessageError = ({ errorMessage, onClick }) => {
  return (
    <Container type="error" role="alert">
      {onClick ? (
        <ErrorButton onClick={onClick}>{errorMessage}</ErrorButton>
      ) : (
        <ErrorSpan>{errorMessage}</ErrorSpan>
      )}
    </Container>
  )
}

MessageError.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  onClick: PropTypes.func,
}

export default MessageError
