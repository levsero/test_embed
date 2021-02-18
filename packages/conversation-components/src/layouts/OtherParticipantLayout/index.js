import PropTypes from 'prop-types'
import Receipt from 'src/receipts/OtherParticipantReceipt'
import Avatar from 'src/Avatar'
import Label from 'src/Label'

import { LayoutContainer, VerticalContainer } from './styles'

const OtherParticipantLayout = ({
  label = '',
  avatar,
  isReceiptVisible = true,
  timeReceived,
  isFreshMessage,
  children,
  isFirstInGroup = true,
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
  label: PropTypes.string,
  avatar: PropTypes.string,
  isReceiptVisible: PropTypes.bool,
  timeReceived: PropTypes.number,
  isFreshMessage: PropTypes.bool,
  children: PropTypes.node,
  isFirstInGroup: PropTypes.bool,
}

export default OtherParticipantLayout
