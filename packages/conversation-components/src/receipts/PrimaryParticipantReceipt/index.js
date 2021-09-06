import PropTypes from 'prop-types'
import { useRef } from 'react'
import { MESSAGE_STATUS } from 'src/constants'
import useLabels from 'src/hooks/useLabels'
import AnimatedReceipt from 'src/receipts/AnimatedReceipt'
import useParseTime from 'src/receipts/hooks/useParseTime'
import { triggerOnEnter } from 'src/utils/keyboard'
import { Layout, Tail, Time, FailedMessage, AlertIcon, TailContainer } from './styles'

const Receipt = ({
  timeReceived,
  status = MESSAGE_STATUS.sent,
  isReceiptVisible = true,
  isFreshMessage = true,
  errorReason = 'unknown',
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

  const errorMessage = {
    'file-size': 'Files must be 50 MB or less',
    'too-many': 'Limit of 25 files per upload. Tap to retry.',
    unknown: 'Tap to retry',
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
        {status === MESSAGE_STATUS.failed && (
          <FailedMessage onClick={onRetry} tabIndex="0" onKeyDown={triggerOnEnter(onRetry)}>
            {errorMessage[errorReason]}
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
  onRetry: PropTypes.func,
  errorReason: PropTypes.string,
}

export default Receipt
