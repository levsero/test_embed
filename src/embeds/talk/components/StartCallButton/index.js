import React from 'react'
import { snapcallAPI } from 'snapcall'

import useTranslate from 'src/hooks/useTranslate'

import { Button } from './styles'

const handleOnClick = () => {
  const callStarted = snapcallAPI.startCall()

  if (!callStarted) {
    alert('call failed to start')
  }
}

const StartCallButton = () => {
  const translate = useTranslate()

  return (
    <Button onClick={handleOnClick} primary={true}>
      {translate('embeddable_framework.talk.clickToCall.button.startCall')}
    </Button>
  )
}

export default StartCallButton
