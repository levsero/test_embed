import React from 'react'
import PropTypes from 'prop-types'

import { LayoutContainer } from './styles'

const PrimaryParticipantLayout = ({ children, isFirstInGroup }) => {
  return <LayoutContainer isFirstInGroup={isFirstInGroup}>{children}</LayoutContainer>
}

PrimaryParticipantLayout.propTypes = {
  children: PropTypes.node,
  isFirstInGroup: PropTypes.bool
}

export default PrimaryParticipantLayout
