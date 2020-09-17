import React from 'react'
import PropTypes from 'prop-types'
import Avatar from 'src/apps/messenger/features/sunco-components/shared/Avatar'
import Label from 'src/apps/messenger/features/sunco-components/Label'
import { LayoutContainer, VerticalContainer } from './styles'

const OtherParticipantLayout = ({ children, isFirstInGroup, avatar }) => {
  return (
    <VerticalContainer isFirstInGroup={isFirstInGroup}>
      {isFirstInGroup && <Label>OtherParticipantName</Label>}
      <LayoutContainer>
        <Avatar src={avatar} />
        {children}
      </LayoutContainer>
    </VerticalContainer>
  )
}

OtherParticipantLayout.propTypes = {
  children: PropTypes.node,
  isFirstInGroup: PropTypes.bool,
  avatar: PropTypes.string
}

export default OtherParticipantLayout
