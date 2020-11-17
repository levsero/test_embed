import React, { useRef } from 'react'
import PropTypes from 'prop-types'

import useParseTime from 'src/apps/messenger/features/sunco-components/Receipts/hooks/useParseTime'

import { Layout, Tail, Time, FailedMessage, AlertIcon } from './styles'
import { MESSAGE_STATUS } from 'src/apps/messenger/features/sunco-components/constants'
import { triggerOnEnter } from 'utility/keyboard'
import { TailContainer } from 'src/apps/messenger/features/sunco-components/Receipts/PrimaryParticipantReceipt/styles'
import AnimatedReceipt from 'src/apps/messenger/features/sunco-components/Receipts/AnimatedReceipt'

const statusLabels = {
  sending: 'Sending',
  sent: 'Delivered',
  failed: 'Tap to retry'
}

const Receipt = ({ timeReceived, status, onRetry, isReceiptVisible, isFreshMessage }) => {
  const parsedTime = useParseTime(timeReceived)
  const previousStatus = useRef(null)
  const currentStatus = useRef(status)

  if (status !== currentStatus.current) {
    previousStatus.current = currentStatus.current
    currentStatus.current = status
  }

  return (
    <AnimatedReceipt isFreshMessage={isReceiptVisible} isReceiptVisible={isReceiptVisible}>
      <Layout isVisible={isReceiptVisible}>
        {status !== MESSAGE_STATUS.failed && (
          <>
            <Time isFreshMessage={isFreshMessage}>
              {statusLabels[status]}
              {status !== MESSAGE_STATUS.sending && ` · ${parsedTime}`}
            </Time>
            <TailContainer>
              <Tail
                previousStatus={previousStatus.current}
                status={status}
                isFreshMessage={isFreshMessage}
              />
            </TailContainer>
          </>
        )}
        {status === MESSAGE_STATUS.failed && (
          <FailedMessage onClick={onRetry} tabIndex="0" onKeyDown={triggerOnEnter(onRetry)}>
            {statusLabels.failed}
            {` `}
            <AlertIcon />
          </FailedMessage>
        )}
      </Layout>
    </AnimatedReceipt>
  )
}

Receipt.propTypes = {
  timeReceived: PropTypes.number,
  status: PropTypes.oneOf(Object.values(MESSAGE_STATUS)),
  onRetry: PropTypes.func,
  isReceiptVisible: PropTypes.bool,
  isFreshMessage: PropTypes.bool
}

export default Receipt
