import React from 'react'

import { TEST_IDS } from 'src/embeds/talk/constants'

import { Avatar } from './styles'

const ClickToCallInProgressPage = () => {
  return <Avatar data-testid={TEST_IDS.ICON_AVATAR} />
}

export default ClickToCallInProgressPage
