import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { snapcallAPI } from 'snapcall'

import useTranslate from 'src/hooks/useTranslate'
import { Widget, Header, Main, Footer } from 'src/components/Widget'

import AverageWaitTime from 'src/embeds/talk/components/AverageWaitTime'
import { getAverageWaitTimeString } from 'src/redux/modules/talk/talk-selectors'
import { getSnapcallButtonId } from 'src/embeds/talk/selectors'
import useSnapcallCallStartingEvent from 'src/embeds/talk/hooks/useSnapcallCallStartingEvent'

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
    return
  }
}

const ClickToCallPage = ({ averageWaitTime, buttonId }) => {
  useSnapcallCallStartingEvent()
  const translate = useTranslate()

  return (
    <Widget>
      <Header title={translate('embeddable_framework.talk.clickToCall.header.title')} />
      <Main>
        <Container>
          <FlexContainer>
            <PageContents>
              <ClickToCallIcon />
              <Message>{translate('embeddable_framework.talk.clickToCall.message')}</Message>
              {averageWaitTime && <AverageWaitTime>{averageWaitTime}</AverageWaitTime>}
            </PageContents>
          </FlexContainer>
          <CallButton onClick={() => handleOnClick(buttonId)} primary={true}>
            {translate('embeddable_framework.talk.clickToCall.button.startCall')}
          </CallButton>
        </Container>
      </Main>
      <Footer />
    </Widget>
  )
}

ClickToCallPage.propTypes = {
  averageWaitTime: PropTypes.string,
  buttonId: PropTypes.string
}

const mapStateToProps = state => ({
  averageWaitTime: getAverageWaitTimeString(state),
  buttonId: getSnapcallButtonId(state)
})

const connectedComponent = connect(mapStateToProps)(ClickToCallPage)

export { connectedComponent as default, ClickToCallPage as Component }
