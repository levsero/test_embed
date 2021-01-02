import PropTypes from 'prop-types'
import Linkify from 'react-linkify'

import { MESSAGE_BUBBLE_SHAPES, MESSAGE_STATUS } from 'src/constants'
import MessageBubble from 'src/MessageBubble'
import PrimaryParticipantLayout from 'src/layouts/PrimaryParticipantLayout'
import OtherParticipantLayout from 'src/layouts/OtherParticipantLayout'
import { Text, Content } from './styles'

const TextMessage = ({
  avatar,
  label,
  text,
  timeReceived,
  shape = 'standalone',
  status = 'sent',
  isPrimaryParticipant = false,
  isFirstInGroup = true,
  isReceiptVisible = true,
  isFreshMessage = true,
  onRetry = () => {}
}) => {
  const Layout = isPrimaryParticipant ? PrimaryParticipantLayout : OtherParticipantLayout

  return (
    <Layout
      isFirstInGroup={isFirstInGroup}
      avatar={avatar}
      label={label}
      onRetry={onRetry}
      timeReceived={timeReceived}
      isReceiptVisible={isReceiptVisible}
      status={status}
      isFreshMessage={isFreshMessage}
    >
      <MessageBubble
        shape={shape}
        isPrimaryParticipant={isPrimaryParticipant}
        status={status}
        isFreshMessage={isFreshMessage}
      >
        <Content>
          <Linkify properties={{ target: '_blank' }}>
            <Text isPrimaryParticipant={isPrimaryParticipant}>{text}</Text>
          </Linkify>
        </Content>
      </MessageBubble>
    </Layout>
  )
}

TextMessage.propTypes = {
  avatar: PropTypes.string,
  label: PropTypes.string,
  isPrimaryParticipant: PropTypes.bool,
  text: PropTypes.string,
  timeReceived: PropTypes.number,
  shape: PropTypes.oneOf(Object.values(MESSAGE_BUBBLE_SHAPES)),
  status: PropTypes.oneOf(Object.values(MESSAGE_STATUS)),
  isFirstInGroup: PropTypes.bool,
  isReceiptVisible: PropTypes.bool,
  isFreshMessage: PropTypes.bool,
  onRetry: PropTypes.func
}

export default TextMessage
