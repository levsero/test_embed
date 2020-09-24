import React from 'react'
import PropTypes from 'prop-types'
import Avatar from 'src/apps/messenger/features/sunco-components/Avatar'
import Label from 'src/apps/messenger/features/sunco-components/Label'
import Receipt from 'src/apps/messenger/features/sunco-components/Receipts/OtherParticipantReceipt'

import { LayoutContainer, VerticalContainer } from './styles'

const OtherParticipantLayout = ({
  children,
  isFirstInGroup,
  isLastInLog,
  timeReceived,
  label,
  avatar
}) => {
  return (
    <VerticalContainer isFirstInGroup={isFirstInGroup}>
      {label && <Label>{label}</Label>}
      <LayoutContainer>
        <Avatar src={avatar} />
        {children}
      </LayoutContainer>
      {isLastInLog && <Receipt timeReceived={timeReceived} />}
    </VerticalContainer>
  )
}

OtherParticipantLayout.propTypes = {
  children: PropTypes.node,
  isFirstInGroup: PropTypes.bool,
  label: PropTypes.string,
  avatar: PropTypes.string,
  isLastInLog: PropTypes.bool,
  timeReceived: PropTypes.number
}

export default OtherParticipantLayout
