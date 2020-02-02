import React from 'react'

import useSnapcallUpdateTime from 'src/embeds/talk/hooks/useSnapcallUpdateTime'

import { Timer } from './styles'

const ClickToCallTimer = () => {
  const callTime = useSnapcallUpdateTime()

  return <Timer>{callTime}</Timer>
}

export default ClickToCallTimer
