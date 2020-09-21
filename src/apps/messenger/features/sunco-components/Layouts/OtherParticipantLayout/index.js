import React from 'react'
import PropTypes from 'prop-types'
import Avatar from 'src/apps/messenger/features/sunco-components/Avatar'
import Label from 'src/apps/messenger/features/sunco-components/Label'
import { LayoutContainer, VerticalContainer } from './styles'

const OtherParticipantLayout = ({ children, isFirstInGroup, avatar, label }) => {
  return (
    <VerticalContainer isFirstInGroup={isFirstInGroup}>
      {label && <Label>{label}</Label>}
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
  label: PropTypes.string,
  avatar: PropTypes.string
}

export default OtherParticipantLayout
