import React from 'react'
import PropTypes from 'prop-types'

import useParseTime from 'src/apps/messenger/features/sunco-components/shared/Receipt/hooks/useParseTime'

import { Layout, Tail, Time } from './styles'

const Receipt = ({ timeReceived, status = 'Delivered' }) => {
  const parsedTime = useParseTime(timeReceived)
  return (
    <Layout>
      <Time>
        {status} · {parsedTime}
      </Time>
      <Tail />
    </Layout>
  )
}

Receipt.propTypes = {
  timeReceived: PropTypes.number,
  status: PropTypes.string
}

export default Receipt
