import { TEST_IDS } from 'classicSrc/constants/shared'
import PropTypes from 'prop-types'
import { Container, ErrorIcon } from './styles'

const ErrorNotification = ({ message }) => (
  <Container data-testid={TEST_IDS.ERROR_MSG}>
    <ErrorIcon />
    {message}
  </Container>
)

ErrorNotification.propTypes = {
  message: PropTypes.string,
}

export default ErrorNotification
