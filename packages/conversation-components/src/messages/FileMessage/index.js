import PropTypes from 'prop-types'
import MessageBubble from 'src/MessageBubble'
import { MESSAGE_BUBBLE_SHAPES, MESSAGE_STATUS } from 'src/constants'
import useLabels from 'src/hooks/useLabels'
import OtherParticipantLayout from 'src/layouts/OtherParticipantLayout'
import PrimaryParticipantLayout from 'src/layouts/PrimaryParticipantLayout'
import { Container, Icon, Name, Size, Content } from './styles'

const parseFileNameFromUrl = (url) => {
  const splitUrl = url.split('/')

  const params = splitUrl[splitUrl.length - 1]
  const queryParamPair = params.split('=')
  const queryParamValue = queryParamPair[queryParamPair.length - 1]

  return queryParamValue ?? url
}

const abbreviateFileName = (fileName) => {
  if (fileName.length <= 24) return fileName

  return `${fileName.slice(0, 11)}...${fileName.slice(-12)}`
}

const calculateMediaSize = (bytes, labels) => {
  const minFileSize = 1000
  const size = isNaN(bytes) || bytes < minFileSize ? minFileSize : bytes

  return size >= 1000000
    ? labels.sizeInMB(Math.floor(size / 1000000))
    : labels.sizeInKB(Math.floor(size / 1000))
}

const FileMessage = ({
  avatar,
  label,
  altText,
  mediaUrl,
  mediaSize,
  timeReceived,
  shape = 'standalone',
  status,
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
  const parsedFilename = parseFileNameFromUrl(mediaUrl)
  const abbreviatedName = abbreviateFileName(parsedFilename)
  const size = calculateMediaSize(mediaSize, labels)

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
              href={mediaUrl}
              target="_blank"
              isPill={false}
              isPrimaryParticipant={isPrimaryParticipant}
              status={status}
            >
              {altText || abbreviatedName}
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
  errorReason: PropTypes.string,
  isRetryable: PropTypes.bool,
}

export default FileMessage
