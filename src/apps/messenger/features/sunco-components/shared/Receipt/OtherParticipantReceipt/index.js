import React from 'react'
import PropTypes from 'prop-types'
import useParseTime from 'src/apps/messenger/features/sunco-components/shared/Receipt/hooks/useParseTime'

import { Layout, Tail, Time } from './styles'

const OtherParticipantReceipt = ({ timeReceived }) => {
  const parsedTime = useParseTime(timeReceived)

  return (
    <Layout>
      <Tail />
      <Time>{parsedTime}</Time>
    </Layout>
  )
}

OtherParticipantReceipt.propTypes = {
  timeReceived: PropTypes.number
}

export default OtherParticipantReceipt
