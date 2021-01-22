import React, { useState } from 'react'
import PropTypes from 'prop-types'

import LoadingButton from 'embeds/talk/components/LoadingButton'

import { Container, Heading, Message, SectionContainer } from './styles'

const NetworkError = ({ onClick }) => {
  const [isEstablishingCall, setIsEstablishingCall] = useState(false)

  return (
    <Container>
      <SectionContainer>
        <Heading>Call couldn't be connected</Heading>
        <Message>Check your internet connection and try again.</Message>
      </SectionContainer>
      <SectionContainer>
        <LoadingButton
          onClick={() => {
            onClick()
            setIsEstablishingCall(true)
          }}
          isLoading={isEstablishingCall}
          isPrimary={true}
          label="Reconnect"
        />
      </SectionContainer>
    </Container>
  )
}

NetworkError.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default NetworkError
