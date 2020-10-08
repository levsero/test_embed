import React from 'react'
import PropTypes from 'prop-types'
import MessageBubble from 'src/apps/messenger/features/sunco-components/MessageBubble'

import { Container, Icon, Name, Size, Content } from './styles'

const parseFileNameFromUrl = url => {
  const split = url.split('/')

  return split[split.length - 1] ?? 'unable to parse name'
}

const abbreviateFileName = fileName => {
  if (fileName.length <= 20) return fileName

  return `${fileName.slice(0, 9)}...${fileName.slice(-10)}`
}

const calculateMediaSize = bytes => {
  const minFileSize = 1000
  const size = isNaN(bytes) || bytes < minFileSize ? minFileSize : bytes

  return size >= 1000000 ? `${Math.floor(size / 1000000)}mb` : `${Math.floor(size / 1000)}kb`
}

const File = ({ isPrimaryParticipant, mediaSize, mediaUrl, shape }) => {
  const fileName = parseFileNameFromUrl(mediaUrl)
  const abbreviatedName = abbreviateFileName(fileName)
  const size = calculateMediaSize(mediaSize)

  return (
    <MessageBubble isPrimaryParticipant={isPrimaryParticipant} shape={shape}>
      <Container>
        <Icon />
        <Content>
          <Name href={mediaUrl} target="_blank">
            {abbreviatedName}
          </Name>
          <Size href={mediaUrl} target="_blank">
            {size}
          </Size>
        </Content>
      </Container>
    </MessageBubble>
  )
}

File.propTypes = {
  isPrimaryParticipant: PropTypes.bool,
  mediaSize: PropTypes.number,
  mediaUrl: PropTypes.string,
  shape: PropTypes.string
}

export default File