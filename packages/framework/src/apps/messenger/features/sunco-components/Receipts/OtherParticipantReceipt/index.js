import React from 'react'
import PropTypes from 'prop-types'
import useParseTime from 'src/apps/messenger/features/sunco-components/Receipts/hooks/useParseTime'

import { Layout, Tail, Time } from './styles'
import AnimatedReceipt from 'src/apps/messenger/features/sunco-components/Receipts/AnimatedReceipt'

const OtherParticipantReceipt = ({ timeReceived, isReceiptVisible, isFreshMessage }) => {
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
  isFreshMessage: PropTypes.bool
}

export default OtherParticipantReceipt
