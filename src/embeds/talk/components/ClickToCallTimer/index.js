import React from 'react'
import PropTypes from 'prop-types'

import { Timer } from './styles'

const ClickToCallTimer = ({ callDuration }) => {
  return <Timer>{callDuration}</Timer>
}

ClickToCallTimer.propTypes = {
  callDuration: PropTypes.string
}

export default ClickToCallTimer
