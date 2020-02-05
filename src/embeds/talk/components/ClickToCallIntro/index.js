import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import useTranslate from 'src/hooks/useTranslate'
import AverageWaitTime from 'src/embeds/talk/components/AverageWaitTime'
import StartCallButton from 'src/embeds/talk/components/StartCallButton'
import { getAverageWaitTimeString } from 'src/redux/modules/talk/talk-selectors'

import { Container, ClickToCallIcon, Message, FlexContainer, PageContents } from './styles'

const ClickToCallIntro = ({ averageWaitTime }) => {
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

ClickToCallIntro.propTypes = {
  averageWaitTime: PropTypes.string
}

const mapStateToProps = state => ({
  averageWaitTime: getAverageWaitTimeString(state)
})

const connectedComponent = connect(mapStateToProps)(ClickToCallIntro)

export { connectedComponent as default, ClickToCallIntro as Component }
