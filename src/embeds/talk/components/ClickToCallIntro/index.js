import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import useTranslate from 'src/hooks/useTranslate'
import { snapcallAPI } from 'snapcall'

import AverageWaitTime from 'src/embeds/talk/components/AverageWaitTime'
import CallEndedNotification from 'src/embeds/talk/components/CallEndedNotification'
import StartCallButton from 'src/embeds/talk/components/StartCallButton'
import { snapcallCallStarted } from 'src/embeds/talk/actions'

import { Container, ClickToCallIcon, Message, FlexContainer, PageContents, Dots } from './styles'

const startCallClickHandler = (snapcallCallStarted, callStatus) => () => {
  if (callStatus === 'connecting') return

  snapcallCallStarted()
  const callStarted = snapcallAPI.startCall()

  if (!callStarted) {
    alert('call failed to start')
  }
}

const buttonContents = (translate, callStatus) => {
  return callStatus === 'connecting' ? (
    <Dots />
  ) : (
    <>{translate('embeddable_framework.talk.clickToCall.button.startCall')}</>
  )
}

const ClickToCallIntro = ({
  averageWaitTime,
  previousCall,
  callDuration,
  callStatus,
  snapcallCallStarted
}) => {
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

      {previousCall ? (
        <CallEndedNotification callDuration={callDuration} />
      ) : (
        <StartCallButton
          clickHandler={startCallClickHandler(snapcallCallStarted, callStatus)}
          contents={buttonContents(translate, callStatus)}
        />
      )}
    </Container>
  )
}

ClickToCallIntro.propTypes = {
  averageWaitTime: PropTypes.string,
  previousCall: PropTypes.bool,
  callDuration: PropTypes.string,
  callStatus: PropTypes.string,
  snapcallCallStarted: PropTypes.func
}

const mapDispatchToProps = {
  snapcallCallStarted
}

const connectedComponent = connect(
  null,
  mapDispatchToProps
)(ClickToCallIntro)

export { connectedComponent as default, ClickToCallIntro as Component }
