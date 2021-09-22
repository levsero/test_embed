import PropTypes from 'prop-types'
import Linkify from 'react-linkify'
import NewWindowIcon from '@zendeskgarden/svg-icons/src/12/new-window-stroke.svg'
import MessageBubble from 'src/MessageBubble'
import { MESSAGE_BUBBLE_SHAPES, MESSAGE_STATUS, FILE_UPLOAD_ERROR_TYPES } from 'src/constants'
import useLabels from 'src/hooks/useLabels'
import OtherParticipantLayout from 'src/layouts/OtherParticipantLayout'
import PrimaryParticipantLayout from 'src/layouts/PrimaryParticipantLayout'
import {
  OtherParticipantImage,
  PrimaryParticipantImage,
  Text,
  OpenImageText,
  ImageContainerLink,
} from './styles'

const ImageMessage = ({
  avatar,
  label,
  text,
  mediaUrl,
  alt,
  timeReceived,
  shape = 'standalone',
  status,
  errorReason,
  type,
  isPrimaryParticipant = false,
  isFirstInGroup = true,
  isReceiptVisible = true,
  isFreshMessage = true,
  isRetryable,
  onRetry = () => {},
}) => {
  const Layout = isPrimaryParticipant ? PrimaryParticipantLayout : OtherParticipantLayout
  const ParticipantImage = isPrimaryParticipant ? PrimaryParticipantImage : OtherParticipantImage
  const hasText = text && text.trim().length > 0
  const labels = useLabels().imageMessage

  return (
    <Layout
      isFirstInGroup={isFirstInGroup}
      avatar={avatar}
      label={label}
      onRetry={onRetry}
      timeReceived={timeReceived}
      isReceiptVisible={isReceiptVisible}
      status={status}
      errorReason={errorReason}
      isFreshMessage={isFreshMessage}
      isRetryable={isRetryable}
    >
      <MessageBubble
        shape={shape}
        isPrimaryParticipant={isPrimaryParticipant}
        type={type}
        status={status}
      >
        <ImageContainerLink
          href={mediaUrl}
          target="_blank"
          isPrimaryParticipant={isPrimaryParticipant}
        >
          <ParticipantImage
            src={mediaUrl}
            alt={alt}
            isPrimaryParticipant={isPrimaryParticipant}
            status={status}
          />
          <OpenImageText>
            <span>
              {labels.openImage}&nbsp;
              <NewWindowIcon />
            </span>
          </OpenImageText>
        </ImageContainerLink>
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
  alt: PropTypes.string,
  timeReceived: PropTypes.number,
  shape: PropTypes.oneOf(Object.values(MESSAGE_BUBBLE_SHAPES)),
  status: PropTypes.oneOf(Object.values(MESSAGE_STATUS)),
  type: PropTypes.string,
  isFirstInGroup: PropTypes.bool,
  isReceiptVisible: PropTypes.bool,
  isFreshMessage: PropTypes.bool,
  onRetry: PropTypes.func,
  errorReason: PropTypes.oneOf(Object.values(FILE_UPLOAD_ERROR_TYPES)),
  isRetryable: PropTypes.bool,
}

export default ImageMessage
