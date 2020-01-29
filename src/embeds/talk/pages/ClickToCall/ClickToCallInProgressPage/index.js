import React from 'react'

import useSnapcallUpdateTime from 'src/embeds/talk/hooks/useSnapcallUpdateTime'
import useInitSnapcall from 'src/embeds/talk/hooks/useInitSnapcall'
import { snapcallAPI } from 'snapcall'
import useTranslate from 'src/hooks/useTranslate'
import useSnapcallCallEndedEvent from 'src/embeds/talk/hooks/useSnapcallCallEndedEvent'

import { Header, Footer, Main, Widget } from 'src/components/Widget'
import { TEST_IDS } from 'src/embeds/talk/constants'

import { Avatar, ComponentContainer, FlexContainer, HangUpButton, Timer } from './styles'

const ClickToCallInProgressPage = () => {
  const translate = useTranslate()
  const callTime = useSnapcallUpdateTime()
  useInitSnapcall()
  useSnapcallCallEndedEvent()

  const onClick = () => {
    snapcallAPI.endCall()
  }

  return (
    <Widget>
      <Header title={translate('embeddable_framework.talk.clickToCall.header.title')} />
      <Main>
        <ComponentContainer>
          <FlexContainer>
            <Avatar data-testid={TEST_IDS.ICON_AVATAR} />
            <Timer>{callTime}</Timer>
          </FlexContainer>

          <HangUpButton data-testid={TEST_IDS.BUTTON_HANG_UP} onClick={onClick}>
            {translate('embeddable_framework.talk.clickToCall.callInProgress.button.endCall')}
          </HangUpButton>
        </ComponentContainer>
      </Main>
      <Footer />
    </Widget>
  )
}

export default ClickToCallInProgressPage
