import React from 'react'
import { snapcallAPI } from 'snapcall'

import useTranslate from 'src/hooks/useTranslate'
import { TEST_IDS } from 'src/embeds/talk/constants'

import { Button } from './styles'

const handleOnClick = () => {
  snapcallAPI.endCall()
}

const EndCallButton = () => {
  const translate = useTranslate()
  return (
    <Button data-testid={TEST_IDS.BUTTON_HANG_UP} onClick={handleOnClick}>
      {translate('embeddable_framework.talk.clickToCall.callInProgress.button.endCall')}
    </Button>
  )
}

export default EndCallButton
