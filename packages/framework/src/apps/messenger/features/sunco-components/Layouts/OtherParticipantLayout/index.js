import React from 'react'
import PropTypes from 'prop-types'
import Receipt from 'src/apps/messenger/features/sunco-components/Receipts/OtherParticipantReceipt'
import { Avatar, Label } from '@zendesk/conversation-components'

import { LayoutContainer, VerticalContainer } from './styles'

const OtherParticipantLayout = ({
  children,
  isFirstInGroup,
  isReceiptVisible,
  timeReceived,
  label,
  avatar,
  isFreshMessage
}) => {
  return (
    <VerticalContainer isFirstInGroup={isFirstInGroup}>
      {label && <Label>{label}</Label>}
      <LayoutContainer>
        <Avatar src={avatar} />
        {children}
      </LayoutContainer>
      <Receipt
        timeReceived={timeReceived}
        isReceiptVisible={isReceiptVisible}
        isFreshMessage={isFreshMessage}
      />
    </VerticalContainer>
  )
}

OtherParticipantLayout.propTypes = {
  children: PropTypes.node,
  isFirstInGroup: PropTypes.bool,
  label: PropTypes.string,
  avatar: PropTypes.string,
  isReceiptVisible: PropTypes.bool,
  timeReceived: PropTypes.number,
  isFreshMessage: PropTypes.bool
}

export default OtherParticipantLayout
