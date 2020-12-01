import React from 'react'

import { Widget, Header, Main } from 'src/components/Widget'
import { Button, Container, Dot, DotContainer, Heading, Message, SectionContainer } from './styles'

const MicrophonePermissionsPage = () => {
  return (
    <Widget>
      <Header title={'Help'} showBackButton={false} />
      <Main>
        <Container>
          <SectionContainer>
            <Heading>Allow microphone</Heading>
            <Message>
              This app needs permission to use your microphone before you can start a call.
            </Message>
          </SectionContainer>
          <SectionContainer>
            <Button isPrimary={true}>Start Call</Button>
            <DotContainer>
              <Dot isActive={true} />
              <Dot />
            </DotContainer>
          </SectionContainer>
        </Container>
      </Main>
    </Widget>
  )
}

MicrophonePermissionsPage.propTypes = {}

export default MicrophonePermissionsPage
