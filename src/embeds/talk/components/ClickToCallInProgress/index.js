import React from 'react'
import PropTypes from 'prop-types'
import EndCallButton from 'src/embeds/talk/components/EndCallButton'
import Avatar from 'src/embeds/talk/components/ClickToCallAgentAvatar'
import Timer from 'src/embeds/talk/components/ClickToCallTimer'

import { Container, FlexContainer, PageContents } from './styles'

const ClickToCallInProgress = ({ callDuration }) => {
  return (
    <Container>
      <FlexContainer>
        <PageContents>
          <Avatar />
          <Timer callDuration={callDuration} />
        </PageContents>
      </FlexContainer>
      <EndCallButton />
    </Container>
  )
}

ClickToCallInProgress.propTypes = {
  callDuration: PropTypes.string
}

export default ClickToCallInProgress
