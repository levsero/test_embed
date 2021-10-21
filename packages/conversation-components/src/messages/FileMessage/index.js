import PropTypes from 'prop-types'
import MessageBubble from 'src/MessageBubble'
import { MESSAGE_BUBBLE_SHAPES, MESSAGE_STATUS, FILE_UPLOAD_ERROR_TYPES } from 'src/constants'
import useLabels from 'src/hooks/useLabels'
import OtherParticipantLayout from 'src/layouts/OtherParticipantLayout'
import PrimaryParticipantLayout from 'src/layouts/PrimaryParticipantLayout'
import { Container, Icon, Name, Size, Content } from './styles'

const calculateMediaSize = (bytes, labels) => {
  const minFileSize = 1000
  const size = isNaN(bytes) || bytes < minFileSize ? minFileSize : bytes

  return size >= 1000000
    ? labels.sizeInMB(Math.floor(size / 1000000))
    : labels.sizeInKB(Math.floor(size / 1000))
}

const getFileNameToDisplay = (mediaUrl, isPrimaryParticipant) => {
  let fileName = mediaUrl

  try {
    isPrimaryParticipant
      ? (fileName = new URL(mediaUrl).pathname.split('/').pop())
      : (fileName = new URL(mediaUrl).search.split('=').pop())
  } catch (ignored) {
    // before file becomes a full url the above will fail (while uploading)
  }

  try {
    fileName = decodeURIComponent(fileName)
  } catch (e) {
    // do nothing, use fileName as-is
  }

  if (fileName.length > 24) {
    fileName = `${fileName.slice(0, 11)}...${fileName.slice(-12)}`
  }

  return fileName
}

const FileMessage = ({
  avatar,
  label,
  altText,
  mediaUrl,
  mediaSize,
  timeReceived,
  shape = 'standalone',
  status = MESSAGE_STATUS.sent,
  errorReason,
  isRetryable,
  isPrimaryParticipant = false,
  isFirstInGroup = true,
  isReceiptVisible = true,
  isFreshMessage = true,
  onRetry = () => {},
}) => {
  const labels = useLabels().fileMessage
  const Layout = isPrimaryParticipant ? PrimaryParticipantLayout : OtherParticipantLayout
  const fileName = altText || getFileNameToDisplay(mediaUrl, isPrimaryParticipant)
  const size = calculateMediaSize(mediaSize, labels)

  const linkAttributes = {
    as: 'a',
    href: mediaUrl,
    target: '_blank',
  }

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
      isRetryable={isRetryable}
      isFreshMessage={isFreshMessage}
    >
      <MessageBubble isPrimaryParticipant={isPrimaryParticipant} shape={shape} status={status}>
        <Container>
          <Icon />
          <Content>
            <Name
              aria-label={labels.downloadAriaLabel}
              title={altText}
              isPrimaryParticipant={isPrimaryParticipant}
              status={status}
              {...(status === 'sent' ? { ...linkAttributes } : {})}
            >
              {fileName}
            </Name>
            <Size>{size}</Size>
          </Content>
        </Container>
      </MessageBubble>
    </Layout>
  )
}

FileMessage.propTypes = {
  avatar: PropTypes.string,
  label: PropTypes.string,
  altText: PropTypes.string,
  isPrimaryParticipant: PropTypes.bool,
  mediaUrl: PropTypes.string,
  mediaSize: PropTypes.number,
  timeReceived: PropTypes.number,
  shape: PropTypes.oneOf(Object.values(MESSAGE_BUBBLE_SHAPES)),
  status: PropTypes.oneOf(Object.values(MESSAGE_STATUS)),
  isFirstInGroup: PropTypes.bool,
  isReceiptVisible: PropTypes.bool,
  isFreshMessage: PropTypes.bool,
  onRetry: PropTypes.func,
  errorReason: PropTypes.oneOf(Object.values(FILE_UPLOAD_ERROR_TYPES)),
  isRetryable: PropTypes.bool,
}

export default FileMessage
