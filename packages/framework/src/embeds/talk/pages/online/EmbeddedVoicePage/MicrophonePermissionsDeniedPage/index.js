import PropTypes from 'prop-types'
import React from 'react'
import useTranslate from 'src/hooks/useTranslate'
import { Button, Container, Heading, Message, SectionContainer } from './styles'

const MicrophonePermissionsDeniedPage = ({ onClick }) => {
  const translate = useTranslate()
  return (
    <Container>
      <SectionContainer>
        <Heading>
          {translate('embeddable_framework.talk.embeddedVoice.microphoneAccessDenied.title')}
        </Heading>
        <Message>
          {translate('embeddable_framework.talk.embeddedVoice.microphoneAccessDenied.description')}
        </Message>
      </SectionContainer>
      <SectionContainer>
        <Button onClick={onClick}>
          {translate('embeddable_framework.talk.embeddedVoice.button.tryAgain')}
        </Button>
      </SectionContainer>
    </Container>
  )
}

MicrophonePermissionsDeniedPage.propTypes = {
  onClick: PropTypes.func.isRequired,
}

export default MicrophonePermissionsDeniedPage
