import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import useTranslate from 'src/hooks/useTranslate'
import { snapcallAPI } from 'snapcall'

import AverageWaitTime from 'src/embeds/talk/components/AverageWaitTime'
import CallEndedNotification from 'src/embeds/talk/components/CallEndedNotification'
import CallFailedNotification from 'src/embeds/talk/components/CallFailedNotification'
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
  previousCall,
  callStatus,
  callDuration,
  snapcallCallStarted,
  snapcallCallFailed
}) => {
  if (callStatus === 'failed') return <CallFailedNotification />

  return previousCall ? (
    <CallEndedNotification callDuration={callDuration} />
  ) : (
    <StartCallButton
      clickHandler={startCallClickHandler(snapcallCallStarted, snapcallCallFailed, callStatus)}
      contents={buttonContents(translate, callStatus)}
    />
  )
}

const ClickToCallIntro = ({
  averageWaitTime,
  previousCall,
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
        previousCall={previousCall}
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
  previousCall: PropTypes.bool,
  callDuration: PropTypes.string,
  callStatus: PropTypes.string,
  snapcallCallStarted: PropTypes.func,
  snapcallCallFailed: PropTypes.func
}

IntroFooter.propTypes = {
  previousCall: PropTypes.bool,
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
