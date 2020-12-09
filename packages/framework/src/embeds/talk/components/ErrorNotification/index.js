import React from 'react'
import PropTypes from 'prop-types'
import { Container, ErrorIcon } from './styles'
import { TEST_IDS } from 'src/constants/shared'

const ErrorNotification = ({ message }) => (
  <Container data-testid={TEST_IDS.ERROR_MSG}>
    <ErrorIcon />
    {message}
  </Container>
)

ErrorNotification.propTypes = {
  message: PropTypes.string
}

export default ErrorNotification
