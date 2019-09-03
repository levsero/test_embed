import React from 'react'
import PropTypes from 'prop-types'
import { Container, ErrorIcon } from './styles'

const ErrorNotification = ({ message }) => {
  return (
    <Container data-testid="talk--errorNotification">
      <ErrorIcon />
      {message}
    </Container>
  )
}

ErrorNotification.propTypes = {
  message: PropTypes.string
}

export default ErrorNotification
