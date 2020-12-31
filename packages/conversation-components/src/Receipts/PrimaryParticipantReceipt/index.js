import { useRef } from 'react'
import PropTypes from 'prop-types'

import useParseTime from 'src/Receipts/hooks/useParseTime'
import { MESSAGE_STATUS } from 'src/constants'
import { triggerOnEnter } from 'src/utils/keyboard'
import AnimatedReceipt from 'src/Receipts/AnimatedReceipt'
import { Layout, Tail, Time, FailedMessage, AlertIcon, TailContainer } from './styles'

const statusLabels = {
  [MESSAGE_STATUS.sending]: 'Sending',
  [MESSAGE_STATUS.sent]: 'Delivered',
  [MESSAGE_STATUS.failed]: 'Tap to retry'
}

const Receipt = ({
  timeReceived,
  status = MESSAGE_STATUS.sent,
  isReceiptVisible = true,
  isFreshMessage = true,
  onRetry = () => {}
}) => {
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
  isReceiptVisible: PropTypes.bool,
  isFreshMessage: PropTypes.bool,
  onRetry: PropTypes.func
}

export default Receipt
