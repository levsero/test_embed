import React from 'react'
import PropTypes from 'prop-types'

import { Icon, SpaceFiller } from './styles'

const Avatar = ({ isLastInGroup }) => {
  return isLastInGroup ? <Icon /> : <SpaceFiller />
}

Avatar.propTypes = {
  isLastInGroup: PropTypes.bool
}

export default Avatar
