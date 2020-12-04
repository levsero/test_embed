import React from 'react'
import PropTypes from 'prop-types'
import EndCallButton from 'src/embeds/talk/components/EndCallButton'
import Avatar from 'src/embeds/talk/components/ClickToCallAgentAvatar'
import Timer from 'src/embeds/talk/components/ClickToCallTimer'

import { Container, FlexContainer, PageContents } from './styles'

const ClickToCallInProgress = ({ onEndCallClicked, callDuration }) => {
  return (
    <Container>
      <FlexContainer>
        <PageContents>
          <Avatar />
          <Timer callDuration={callDuration} />
        </PageContents>
      </FlexContainer>
      <EndCallButton onClick={onEndCallClicked} />
    </Container>
  )
}

ClickToCallInProgress.propTypes = {
  callDuration: PropTypes.string,
  onEndCallClicked: PropTypes.func
}

export default ClickToCallInProgress
