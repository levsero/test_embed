import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import useTranslate from 'src/hooks/useTranslate'
import { snapcallAPI } from 'snapcall'

import AverageWaitTime from 'src/embeds/talk/components/AverageWaitTime'
import CallEndedNotification from 'src/embeds/talk/components/CallEndedNotification'
import CallFailedNotification from 'src/embeds/talk/components/CallFailedNotification'
import CallDisconnectedNotification from 'src/embeds/talk/components/CallDisconnectedNotification'
import StartCallButton from 'src/embeds/talk/components/StartCallButton'
import { snapcallCallStarted, snapcallCallFailed } from 'src/embeds/talk/actions'

import { Container, ClickToCallIcon, Message, FlexContainer, PageContents, Dots } from './styles'

const startCallClickHandler = (snapcallCallStarted, snapcallCallFailed, callStatus) => () => {
  if (callStatus === 'connecting') return

  snapcallCallStarted()
  const callStarted = snapcallAPI.startCall()

  if (!callStarted) {
    snapcallCallFailed()
  }
}

const buttonContents = (translate, callStatus) => {
  return callStatus === 'connecting' ? (
    <Dots />
  ) : (
    <>{translate('embeddable_framework.talk.clickToCall.button.startCall')}</>
  )
}

const IntroFooter = ({
  translate,
  callStatus,
  callDuration,
  snapcallCallStarted,
  snapcallCallFailed
}) => {
  switch (callStatus) {
    case 'ended':
      return <CallEndedNotification callDuration={callDuration} />
    case 'disconnected':
      return <CallDisconnectedNotification callDuration={callDuration} />
    case 'failed':
      return <CallFailedNotification />
    case 'connecting':
    case 'inactive':
      return (
        <StartCallButton
          clickHandler={startCallClickHandler(snapcallCallStarted, snapcallCallFailed, callStatus)}
          contents={buttonContents(translate, callStatus)}
        />
      )
    default:
      return null
  }
}

const ClickToCallIntro = ({
  averageWaitTime,
  callDuration,
  callStatus,
  snapcallCallStarted,
  snapcallCallFailed
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
      <IntroFooter
        translate={translate}
        callStatus={callStatus}
        callDuration={callDuration}
        snapcallCallStarted={snapcallCallStarted}
        snapcallCallFailed={snapcallCallFailed}
      />
    </Container>
  )
}

ClickToCallIntro.propTypes = {
  averageWaitTime: PropTypes.string,
  callDuration: PropTypes.string,
  callStatus: PropTypes.string,
  snapcallCallStarted: PropTypes.func,
  snapcallCallFailed: PropTypes.func
}

IntroFooter.propTypes = {
  callDuration: PropTypes.string,
  callStatus: PropTypes.string,
  snapcallCallStarted: PropTypes.func,
  snapcallCallFailed: PropTypes.func,
  translate: PropTypes.func
}

const mapDispatchToProps = {
  snapcallCallStarted,
  snapcallCallFailed
}

const connectedComponent = connect(
  null,
  mapDispatchToProps
)(ClickToCallIntro)

export { connectedComponent as default, ClickToCallIntro as Component }
