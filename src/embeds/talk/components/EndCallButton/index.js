import React from 'react'
import PropTypes from 'prop-types'

import useTranslate from 'src/hooks/useTranslate'
import { TEST_IDS } from 'src/embeds/talk/constants'

import { Button } from './styles'

const EndCallButton = ({ onClick }) => {
  const translate = useTranslate()
  return (
    <Button data-testid={TEST_IDS.BUTTON_HANG_UP} onClick={onClick}>
      {translate('embeddable_framework.talk.clickToCall.callInProgress.button.endCall')}
    </Button>
  )
}

EndCallButton.propTypes = {
  onClick: PropTypes.func
}

export default EndCallButton
