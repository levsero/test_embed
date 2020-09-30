import React from 'react'
import PropTypes from 'prop-types'

import useParseTime from 'src/apps/messenger/features/sunco-components/Receipts/hooks/useParseTime'

import { Layout, Tail, Time, FailedMessage, AlertIcon } from './styles'
import { MESSAGE_STATUS } from 'src/apps/messenger/features/sunco-components/constants'
import { triggerOnEnter } from 'utility/keyboard'

const statusLabels = {
  sending: 'Sending',
  sent: 'Delivered',
  failed: 'Tap to retry'
}

const Receipt = ({ timeReceived, status, onRetry }) => {
  const parsedTime = useParseTime(timeReceived)

  return (
    <Layout>
      {status !== MESSAGE_STATUS.failed && (
        <>
          <Time>
            {statusLabels[status]}
            {status !== MESSAGE_STATUS.sending && ` · ${parsedTime}`}
          </Time>
          <Tail status={status} />
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
  )
}

Receipt.propTypes = {
  timeReceived: PropTypes.number,
  status: PropTypes.oneOf(Object.values(MESSAGE_STATUS)),
  onRetry: PropTypes.func
}

export default Receipt
