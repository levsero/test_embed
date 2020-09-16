import React from 'react'
import PropTypes from 'prop-types'
import PrimaryParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/PrimaryParticipantLayout'
import OtherParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/OtherParticipantLayout'
import MessageBubble from 'src/apps/messenger/features/sunco-components/Text/MessageBubble'

import { Text, Padding } from './styles'

const SuncoTextMessage = ({
  avatar,
  isFirstInGroup,
  isLastInGroup,
  isLastInLog,
  label,
  role,
  text,
  timeReceived
}) => {
  const appUser = role === 'appUser'

  const Layout = appUser ? PrimaryParticipantLayout : OtherParticipantLayout

  return (
    <Layout
      avatar={avatar}
      label={label}
      isFirstInGroup={isFirstInGroup}
      isLastInLog={isLastInLog}
      timeReceived={timeReceived}
    >
      <MessageBubble
        isFirstInGroup={isFirstInGroup}
        isLastInGroup={isLastInGroup}
        appUser={appUser}
      >
        <Padding>
          <Text>{text}</Text>
        </Padding>
      </MessageBubble>
    </Layout>
  )
}

SuncoTextMessage.propTypes = {
  avatar: PropTypes.string,
  isFirstInGroup: PropTypes.bool,
  isLastInGroup: PropTypes.bool,
  isLastInLog: PropTypes.bool,
  label: PropTypes.string,
  role: PropTypes.string,
  text: PropTypes.string,
  timeReceived: PropTypes.number
}

export default SuncoTextMessage
