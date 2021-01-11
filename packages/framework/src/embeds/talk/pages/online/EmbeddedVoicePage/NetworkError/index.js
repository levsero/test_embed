import React from 'react'
import PropTypes from 'prop-types'

import { Button, Container, Heading, Message, SectionContainer } from './styles'

const NetworkError = ({ onClick }) => {
  return (
    <Container>
      <SectionContainer>
        <Heading>Call couldn't be connected</Heading>
        <Message>Check your internet connection and try again.</Message>
      </SectionContainer>
      <SectionContainer>
        <Button onClick={onClick} isPrimary={true}>
          Reconnect
        </Button>
      </SectionContainer>
    </Container>
  )
}

NetworkError.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default NetworkError
