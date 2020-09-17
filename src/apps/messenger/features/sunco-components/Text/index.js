import React from 'react'
import PropTypes from 'prop-types'
import PrimaryParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/PrimaryParticipantLayout'
import OtherParticipantLayout from 'src/apps/messenger/features/sunco-components/Layouts/OtherParticipantLayout'
import MessageBubble from 'src/apps/messenger/features/sunco-components/Text/MessageBubble'

import { Text, Padding } from './styles'

const SuncoTextMessage = ({ role, text, isFirstInGroup, isLastInGroup, avatar }) => {
  const appUser = role === 'appUser'

  const Layout = appUser ? PrimaryParticipantLayout : OtherParticipantLayout

  return (
    <Layout isFirstInGroup={isFirstInGroup} avatar={avatar}>
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
  role: PropTypes.string,
  text: PropTypes.string,
  avatar: PropTypes.string,
  isFirstInGroup: PropTypes.bool,
  isLastInGroup: PropTypes.bool
}

export default SuncoTextMessage
