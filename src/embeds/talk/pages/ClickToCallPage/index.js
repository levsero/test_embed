import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { snapcallAPI } from 'snapcall'

import AverageWaitTime from 'src/embeds/talk/components/AverageWaitTime'
import { getAverageWaitTimeString } from 'src/redux/modules/talk/talk-selectors'
import { Widget, Header, Main, Footer } from 'src/components/Widget'
import { getTitle, getSnapcallButtonId } from 'src/embeds/talk/selectors'

import {
  Container,
  ClickToCallIcon,
  Message,
  CallButton,
  FlexContainer,
  PageContents
} from './styles'

const handleOnClick = buttonId => {
  const callStarted = snapcallAPI.startCall(buttonId)

  if (!callStarted) {
    alert('Something went wrong when trying to start a call')
    return
  }
}

const ClickToCallPage = ({ title, averageWaitTime, buttonId }) => {
  return (
    <Widget>
      <Header title={title} />
      <Main>
        <Container>
          <FlexContainer>
            <PageContents>
              <ClickToCallIcon />
              <Message>
                Call Customer Support directy from your browser. You'll need to allow microphone
                access on your device when prompted.
              </Message>
              {averageWaitTime && <AverageWaitTime>{averageWaitTime}</AverageWaitTime>}
            </PageContents>
          </FlexContainer>
          <CallButton onClick={() => handleOnClick(buttonId)} primary={true}>
            Start Call
          </CallButton>
        </Container>
      </Main>
      <Footer />
    </Widget>
  )
}

ClickToCallPage.propTypes = {
  averageWaitTime: PropTypes.string,
  title: PropTypes.string.isRequired,
  buttonId: PropTypes.string
}

const mapStateToProps = state => ({
  title: getTitle(state, 'embeddable_framework.talk.form.title'),
  averageWaitTime: getAverageWaitTimeString(state),
  buttonId: getSnapcallButtonId(state)
})

const connectedComponent = connect(mapStateToProps)(ClickToCallPage)

export { connectedComponent as default, ClickToCallPage as Component }
