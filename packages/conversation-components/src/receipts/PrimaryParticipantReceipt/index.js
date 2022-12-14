import PropTypes from 'prop-types'
import { useRef } from 'react'
import { MESSAGE_STATUS, FILE_UPLOAD_ERROR_TYPES } from 'src/constants'
import useLabels from 'src/hooks/useLabels'
import AnimatedReceipt from 'src/receipts/AnimatedReceipt'
import useParseTime from 'src/receipts/hooks/useParseTime'
import { triggerOnEnter } from 'src/utils/keyboard'
import {
  Layout,
  Tail,
  Time,
  RetryableFailedMessage,
  NonRetryableFailedMessage,
  AlertIcon,
  TailContainer,
} from './styles'

const Receipt = ({
  timeReceived,
  status = MESSAGE_STATUS.sent,
  isReceiptVisible = true,
  isFreshMessage = true,
  errorReason = 'unknown',
  isRetryable = true,
  onRetry = () => {},
}) => {
  const parsedTime = useParseTime(timeReceived)
  const previousStatus = useRef(null)
  const currentStatus = useRef(status)
  const labels = useLabels().receipts
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
              {labels.status[status]}
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
        {status === MESSAGE_STATUS.failed && isRetryable && (
          <RetryableFailedMessage
            onClick={onRetry}
            tabIndex="0"
            onKeyDown={triggerOnEnter(onRetry)}
            isLink={true}
          >
            {labels.errors[errorReason]}
            <AlertIcon role="presentation" />
          </RetryableFailedMessage>
        )}
        {status === MESSAGE_STATUS.failed && !isRetryable && (
          <NonRetryableFailedMessage tabIndex="0">
            {labels.errors[errorReason]}
            <AlertIcon role="presentation" />
          </NonRetryableFailedMessage>
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
  onRetry: PropTypes.func,
  errorReason: PropTypes.oneOf(Object.values(FILE_UPLOAD_ERROR_TYPES)),
  isRetryable: PropTypes.bool,
}

export default Receipt
