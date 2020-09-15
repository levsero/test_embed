import React from 'react'
import PropTypes from 'prop-types'
import Avatar from 'src/apps/messenger/features/sunco-components/shared/Avatar'

import { LayoutContainer, OtherParticipantName, VerticalContainer } from './styles'

const OtherParticipantLayout = ({ children, isFirstInGroup, isLastInGroup }) => {
  return (
    <VerticalContainer isFirstInGroup={isFirstInGroup}>
      {isFirstInGroup && <OtherParticipantName>OtherParticipantName</OtherParticipantName>}
      <LayoutContainer>
        {<Avatar isLastInGroup={isLastInGroup} />}
        {children}
      </LayoutContainer>
    </VerticalContainer>
  )
}

OtherParticipantLayout.propTypes = {
  children: PropTypes.node,
  isFirstInGroup: PropTypes.bool,
  isLastInGroup: PropTypes.bool
}

export default OtherParticipantLayout
