import PropTypes from 'prop-types'
import Linkify from 'react-linkify'

import { MESSAGE_BUBBLE_SHAPES, MESSAGE_STATUS } from 'src/constants'
import PrimaryParticipantLayout from 'src/layouts/PrimaryParticipantLayout'
import OtherParticipantLayout from 'src/layouts/OtherParticipantLayout'
import MessageBubble from 'src/MessageBubble'
import { OtherParticipantImage, PrimaryParticipantImage, Text } from './styles'

const ImageMessage = ({
  avatar,
  label,
  text,
  mediaUrl,
  timeReceived,
  shape = 'standalone',
  status = 'sent',
  isPrimaryParticipant = true,
  isFirstInGroup = true,
  isReceiptVisible = true,
  isFreshMessage = true,
  onRetry = () => {}
}) => {
  const Layout = isPrimaryParticipant ? PrimaryParticipantLayout : OtherParticipantLayout
  const ParticipantImage = isPrimaryParticipant ? PrimaryParticipantImage : OtherParticipantImage
  const hasText = text && text.trim().length > 0

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
      <MessageBubble shape={shape} isPrimaryParticipant={isPrimaryParticipant}>
        <a href={mediaUrl} target="_blank">
          <ParticipantImage
            src={mediaUrl}
            alt={mediaUrl}
            shape={shape}
            isPrimaryParticipant={isPrimaryParticipant}
            hasText={hasText}
          />
        </a>
        {hasText && (
          <Linkify properties={{ target: '_blank' }}>
            <Text isPrimaryParticipant={isPrimaryParticipant}>{text}</Text>
          </Linkify>
        )}
      </MessageBubble>
    </Layout>
  )
}

ImageMessage.propTypes = {
  avatar: PropTypes.string,
  label: PropTypes.string,
  isPrimaryParticipant: PropTypes.bool,
  text: PropTypes.string,
  mediaUrl: PropTypes.string,
  timeReceived: PropTypes.number,
  shape: PropTypes.oneOf(Object.values(MESSAGE_BUBBLE_SHAPES)),
  status: PropTypes.oneOf(Object.values(MESSAGE_STATUS)),
  isFirstInGroup: PropTypes.bool,
  isReceiptVisible: PropTypes.bool,
  isFreshMessage: PropTypes.bool,
  onRetry: PropTypes.func
}

// {
//   avatar: PropTypes.string,
//     label: PropTypes.string,
//   isPrimaryParticipant: PropTypes.bool,
//   text: PropTypes.string,
//   timeReceived: PropTypes.number,
//   shape: PropTypes.oneOf(Object.values(MESSAGE_BUBBLE_SHAPES)),
//   status: PropTypes.oneOf(Object.values(MESSAGE_STATUS)),
//   isFirstInGroup: PropTypes.bool,
//   isReceiptVisible: PropTypes.bool,
//   isFreshMessage: PropTypes.bool,
//   onRetry: PropTypes.func
// }

export default ImageMessage
