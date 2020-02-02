import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import useTranslate from 'src/hooks/useTranslate'
import { Widget, Header, Main, Footer } from 'src/components/Widget'
import AverageWaitTime from 'src/embeds/talk/components/AverageWaitTime'
import StartCallButton from 'src/embeds/talk/components/StartCallButton'
import EndCallButton from 'src/embeds/talk/components/EndCallButton'
import Avatar from 'src/embeds/talk/components/ClickToCallAgentAvatar'
import Timer from 'src/embeds/talk/components/ClickToCallTimer'
import { getAverageWaitTimeString } from 'src/redux/modules/talk/talk-selectors'
import { getSnapcallCallStatus } from 'src/embeds/talk/selectors'
import useSnapcallCallStartingEvent from 'src/embeds/talk/hooks/useSnapcallCallStartingEvent'
import useSnapcallCallEndedEvent from 'src/embeds/talk/hooks/useSnapcallCallEndedEvent'
import useInitSnapcall from 'src/embeds/talk/hooks/useInitSnapcall'

import { Container, ClickToCallIcon, Message, FlexContainer, PageContents } from './styles'

const Intro = ({ averageWaitTime }) => {
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
      <StartCallButton />
    </Container>
  )
}

const InProgress = () => {
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

const ClickToCallPage = ({ callStatus, averageWaitTime }) => {
  useInitSnapcall()
  useSnapcallCallStartingEvent()
  useSnapcallCallEndedEvent()

  const translate = useTranslate()

  return (
    <Widget>
      <Header title={translate('embeddable_framework.talk.clickToCall.header.title')} />
      <Main>
        {callStatus === 'active' ? <InProgress /> : <Intro averageWaitTime={averageWaitTime} />}
      </Main>
      <Footer />
    </Widget>
  )
}

ClickToCallPage.propTypes = {
  callStatus: PropTypes.string,
  averageWaitTime: PropTypes.string
}

Intro.propTypes = {
  averageWaitTime: PropTypes.string
}

const mapStateToProps = state => ({
  averageWaitTime: getAverageWaitTimeString(state),
  callStatus: getSnapcallCallStatus(state)
})

const connectedComponent = connect(mapStateToProps)(ClickToCallPage)

export { connectedComponent as default, ClickToCallPage as Component }
