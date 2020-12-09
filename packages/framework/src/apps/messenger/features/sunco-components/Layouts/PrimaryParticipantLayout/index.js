import React from 'react'
import PropTypes from 'prop-types'

import Receipt from 'src/apps/messenger/features/sunco-components/Receipts/PrimaryParticipantReceipt'

import { LayoutContainer, VerticalLayout } from './styles'
import { MESSAGE_STATUS } from 'src/apps/messenger/features/sunco-components/constants'

const PrimaryParticipantLayout = ({
  children,
  isFirstInGroup,
  timeReceived,
  status = MESSAGE_STATUS.sent,
  isReceiptVisible,
  onRetry,
  isFreshMessage
}) => {
  return (
    <VerticalLayout>
      <LayoutContainer isFirstInGroup={isFirstInGroup}>{children}</LayoutContainer>

      <Receipt
        timeReceived={timeReceived}
        status={status}
        onRetry={onRetry}
        isReceiptVisible={isReceiptVisible}
        isFreshMessage={isFreshMessage}
      />
    </VerticalLayout>
  )
}

PrimaryParticipantLayout.propTypes = {
  children: PropTypes.node,
  isFirstInGroup: PropTypes.bool,
  isReceiptVisible: PropTypes.bool,
  timeReceived: PropTypes.number,
  status: PropTypes.oneOf(Object.values(MESSAGE_STATUS)),
  onRetry: PropTypes.func,
  isFreshMessage: PropTypes.bool
}

export default PrimaryParticipantLayout
