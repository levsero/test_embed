import React from 'react'
import PropTypes from 'prop-types'
import Linkify from 'react-linkify'
import { TEST_IDS } from 'constants/shared'
import { Container } from './styles'

const GreetingMessage = ({ message }) => {
  return (
    <Container data-testid={TEST_IDS.FORM_GREETING_MSG}>
      <Linkify properties={{ target: '_blank' }}>{message}</Linkify>
    </Container>
  )
}

GreetingMessage.propTypes = {
  message: PropTypes.string,
}

export default GreetingMessage
