import PropTypes from 'prop-types'

import useParseTime from 'src/receipts/hooks/useParseTime'
import AnimatedReceipt from 'src/receipts/AnimatedReceipt'
import { Layout, Tail, Time } from './styles'

const OtherParticipantReceipt = ({
  timeReceived,
  isReceiptVisible = true,
  isFreshMessage = true,
}) => {
  const parsedTime = useParseTime(timeReceived)

  return (
    <AnimatedReceipt isFreshMessage={isReceiptVisible} isReceiptVisible={isReceiptVisible}>
      <Layout>
        <Tail isFreshMessage={isFreshMessage} />
        <Time isFreshMessage={isFreshMessage}>{parsedTime}</Time>
      </Layout>
    </AnimatedReceipt>
  )
}

OtherParticipantReceipt.propTypes = {
  timeReceived: PropTypes.number,
  isReceiptVisible: PropTypes.bool,
  isFreshMessage: PropTypes.bool,
}

export default OtherParticipantReceipt
