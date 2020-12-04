import _ from 'lodash'
const MAX_FILENAME_LENGTH = 30
const TRAILING_CHARS_LENGTH = 7

export const formatNameString = fileName => {
  if (fileName.length <= MAX_FILENAME_LENGTH) return fileName

  const nameStart = fileName.slice(0, MAX_FILENAME_LENGTH - TRAILING_CHARS_LENGTH - 1)
  const nameEnd = fileName.slice(-TRAILING_CHARS_LENGTH)

  return `${nameStart}…${nameEnd}`
}

export const formatAttachmentSize = (bytes, translate) => {
  // if the size of the file is less than 1KB, round it up
  const size = Math.max(bytes, 1000)

  return size >= 1000000
    ? translate('embeddable_framework.submitTicket.attachments.size_megabyte', {
        size: _.floor(size / 1000000, 1)
      })
    : translate('embeddable_framework.submitTicket.attachments.size_kilobyte', {
        size: _.floor(size / 1000)
      })
}

export const secondaryText = (fileSize, uploading, translate) => {
  const attachmentSize = formatAttachmentSize(fileSize, translate)

  return uploading ? translate('embeddable_framework.chat.chatLog.uploading') : attachmentSize
}
