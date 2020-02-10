import React from 'react'
import PropTypes from 'prop-types'

import useTranslate from 'src/hooks/useTranslate'
import AverageWaitTime from 'src/embeds/talk/components/AverageWaitTime'
import CallEndedNotification from 'src/embeds/talk/components/CallEndedNotification'
import StartCallButton from 'src/embeds/talk/components/StartCallButton'

import { Container, ClickToCallIcon, Message, FlexContainer, PageContents } from './styles'

const ClickToCallIntro = ({ averageWaitTime, previousCall, callDuration }) => {
  const translate = useTranslate()

  return (
    <Container>
      <FlexContainer>
        <PageContents>
          <ClickToCallIcon />
          <Message>{translate('embeddable_framework.talk.clickToCall.message')}</Message>
          {averageWaitTime && <AverageWaitTime>{averageWaitTime}</AverageWaitTime>}
        </PageContents>
      </FlexContainer>

      {previousCall ? <CallEndedNotification callDuration={callDuration} /> : <StartCallButton />}
    </Container>
  )
}

ClickToCallIntro.propTypes = {
  averageWaitTime: PropTypes.string,
  previousCall: PropTypes.bool,
  callDuration: PropTypes.string
}

export default ClickToCallIntro
