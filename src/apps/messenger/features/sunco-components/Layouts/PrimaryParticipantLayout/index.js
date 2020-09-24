import React from 'react'
import PropTypes from 'prop-types'

import Receipt from 'src/apps/messenger/features/sunco-components/Receipts/PrimaryParticipantReceipt'

import { LayoutContainer, VerticalLayout } from './styles'

const PrimaryParticipantLayout = ({ children, isFirstInGroup, isLastInLog, timeReceived }) => {
  return (
    <VerticalLayout>
      <LayoutContainer isFirstInGroup={isFirstInGroup}>{children}</LayoutContainer>
      {isLastInLog && <Receipt timeReceived={timeReceived} />}
    </VerticalLayout>
  )
}

PrimaryParticipantLayout.propTypes = {
  children: PropTypes.node,
  isFirstInGroup: PropTypes.bool,
  isLastInLog: PropTypes.bool,
  timeReceived: PropTypes.number
}

export default PrimaryParticipantLayout
