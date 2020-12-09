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
  onRetry
}) => {
  return (
    <VerticalLayout>
      <LayoutContainer isFirstInGroup={isFirstInGroup}>{children}</LayoutContainer>

      {isReceiptVisible && (
        <Receipt timeReceived={timeReceived} status={status} onRetry={onRetry} />
      )}
    </VerticalLayout>
  )
}

PrimaryParticipantLayout.propTypes = {
  children: PropTypes.node,
  isFirstInGroup: PropTypes.bool,
  isReceiptVisible: PropTypes.bool,
  timeReceived: PropTypes.number,
  status: PropTypes.oneOf(Object.values(MESSAGE_STATUS)),
  onRetry: PropTypes.func
}

export default PrimaryParticipantLayout
