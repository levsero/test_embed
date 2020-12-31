import PropTypes from 'prop-types'

import { MESSAGE_STATUS } from 'src/constants'
import Receipt from 'src/Receipts/PrimaryParticipantReceipt'
import { LayoutContainer, VerticalLayout } from './styles'

const PrimaryParticipantLayout = ({
  isReceiptVisible,
  timeReceived,
  status = MESSAGE_STATUS.sent,
  isFirstInGroup,
  isFreshMessage,
  children,
  onRetry
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
  isReceiptVisible: PropTypes.bool,
  timeReceived: PropTypes.number,
  status: PropTypes.oneOf(Object.values(MESSAGE_STATUS)),
  isFirstInGroup: PropTypes.bool,
  isFreshMessage: PropTypes.bool,
  children: PropTypes.node,
  onRetry: PropTypes.func
}

export default PrimaryParticipantLayout
