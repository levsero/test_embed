import React, { useState } from 'react'
import PropTypes from 'prop-types'

import useTranslate from 'src/hooks/useTranslate'
import LoadingButton from 'embeds/talk/components/LoadingButton'

import { Container, Heading, Message, SectionContainer } from './styles'

const NetworkError = ({ onClick }) => {
  const translate = useTranslate()
  const [isEstablishingCall, setIsEstablishingCall] = useState(false)

  return (
    <Container>
      <SectionContainer>
        <Heading>{translate('embeddable_framework.talk.embeddedVoice.networkError.title')}</Heading>
        <Message>
          {translate('embeddable_framework.talk.embeddedVoice.networkError.message')}
        </Message>
      </SectionContainer>
      <SectionContainer>
        <LoadingButton
          onClick={() => {
            onClick()
            setIsEstablishingCall(true)
          }}
          isLoading={isEstablishingCall}
          isPrimary={true}
          label={translate('embeddable_framework.talk.embeddedVoice.networkError.button.reconnect')}
        />
      </SectionContainer>
    </Container>
  )
}

NetworkError.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default NetworkError
