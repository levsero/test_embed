import React from 'react'
import EndCallButton from 'src/embeds/talk/components/EndCallButton'
import Avatar from 'src/embeds/talk/components/ClickToCallAgentAvatar'
import Timer from 'src/embeds/talk/components/ClickToCallTimer'

import { Container, FlexContainer, PageContents } from './styles'

const ClickToCallInProgress = () => {
  return (
    <Container>
      <FlexContainer>
        <PageContents>
          <Avatar />
          <Timer />
        </PageContents>
      </FlexContainer>
      <EndCallButton />
    </Container>
  )
}

export default ClickToCallInProgress
