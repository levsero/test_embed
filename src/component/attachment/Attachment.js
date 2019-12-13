import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { Icon } from 'component/Icon'
import { ProgressBar } from 'component/attachment/ProgressBar'
import { Alert, Title, Close } from '@zendeskgarden/react-notifications'
import { i18n } from 'service/i18n'
import { locals as styles } from './Attachment.scss'
import classNames from 'classnames'
import { TEST_IDS } from 'src/constants/shared'

export class Attachment extends Component {
  static propTypes = {
    attachment: PropTypes.shape({
      id: PropTypes.string.isRequired,
      fileName: PropTypes.string.isRequired,
      fileSize: PropTypes.number.isRequired,
      fileType: PropTypes.string.isRequired,
      errorMessage: PropTypes.string,
      fileUrl: PropTypes.string,
      uploading: PropTypes.bool.isRequired,
      uploadProgress: PropTypes.number.isRequired,
      uploadToken: PropTypes.string
    }),
    className: PropTypes.string,
    fakeProgress: PropTypes.bool,
    filenameMaxLength: PropTypes.number,
    handleRemoveAttachment: PropTypes.func,
    isDownloadable: PropTypes.bool.isRequired,
    isRemovable: PropTypes.bool.isRequired,
    icon: PropTypes.string
  }

  static defaultProps = {
    fakeProgress: false,
    icon: '',
    isDownloadable: false,
    isRemovable: false,
    uploadRequestSender: {}
  }

  handleIconClick = () => {
    this.props.handleRemoveAttachment(this.props.attachment.id)
  }

  formatAttachmentSize = bytes => {
    // if the size of the file is less than 1KB, just round it up
    const size = _.max([bytes, 1000])

    return size >= 1000000
      ? i18n.t('embeddable_framework.submitTicket.attachments.size_megabyte', {
          size: _.floor(size / 1000000, 1)
        })
      : i18n.t('embeddable_framework.submitTicket.attachments.size_kilobyte', {
          size: _.floor(size / 1000)
        })
  }

  truncateFilename = (fileName, fileNameMaxLength, trailingCharsLength) => {
    if (fileName.length <= fileNameMaxLength) return fileName

    const nameStart = fileName.slice(0, fileNameMaxLength - trailingCharsLength - 1)
    const nameEnd = fileName.slice(-trailingCharsLength)

    return `${nameStart}…${nameEnd}`
  }

  renderLinkedEl = (el, url) => {
    return (
      <a className={styles.link} target="_blank" href={url}>
        {el}
      </a>
    )
  }

  renderSecondaryText(isDownloadable, downloading) {
    const { attachment } = this.props
    const { fileSize, fileUrl, uploading } = attachment
    const attachmentSize = this.formatAttachmentSize(fileSize)
    const downloadLink = (
      <div>
        <span className={styles.downloadSize}>{attachmentSize}</span>
        <span className={styles.downloadText}>
          {i18n.t('embeddable_framework.chat.chatLog.attachmentDownload')}
        </span>
      </div>
    )
    let secondaryText

    if (uploading) {
      secondaryText = i18n.t('embeddable_framework.chat.chatLog.uploading')
    } else if (downloading) {
      secondaryText = i18n.t('embeddable_framework.chat.chatLog.loadingImage', {
        attachmentSize
      })
    } else if (isDownloadable) {
      secondaryText = this.renderLinkedEl(downloadLink, fileUrl)
    } else {
      secondaryText = attachmentSize
    }

    return secondaryText
  }

  previewNameString = () => {
    const { attachment, filenameMaxLength } = this.props
    const { fileName } = attachment

    return filenameMaxLength ? this.truncateFilename(fileName, filenameMaxLength, 7) : fileName
  }

  renderPreviewIcon = () => {
    if (!this.props.icon) return null

    const { isDownloadable, attachment } = this.props
    const previewIcon = <Icon type={this.props.icon} className={styles.iconPreview} />

    return isDownloadable ? this.renderLinkedEl(previewIcon, attachment.fileUrl) : previewIcon
  }

  renderAttachmentBox() {
    const { attachment, isDownloadable } = this.props
    const { downloading, uploading, fileUrl, uploadProgress, errorMessage } = attachment

    if (errorMessage) return

    const previewName = <div className={styles.previewName}>{this.previewNameString()}</div>

    const removeIcon = (
      <Icon onClick={this.handleIconClick} className={styles.icon} type="Icon--close" />
    )

    const containerClasses = classNames(styles.container, this.props.className)

    const progressBar = (
      <ProgressBar percentLoaded={uploadProgress} fakeProgress={this.props.fakeProgress} />
    )

    return (
      <div
        className={containerClasses}
        data-testid={`${TEST_IDS.FILE_NAME}-${this.props.attachment.id || 'attachment'}`}
      >
        <div className={styles.preview}>
          {this.renderPreviewIcon()}
          <div className={styles.description} data-testid={TEST_IDS.DESCRIPTION}>
            {isDownloadable ? this.renderLinkedEl(previewName, fileUrl) : previewName}
            <div className={styles.secondaryText}>
              {this.renderSecondaryText(isDownloadable, downloading)}
            </div>
          </div>
          {this.props.isRemovable && removeIcon}
        </div>
        {uploading && progressBar}
      </div>
    )
  }

  renderAttachmentError() {
    const { errorMessage } = this.props.attachment

    if (!errorMessage) return

    return (
      <Alert
        type="error"
        role="alert"
        className={styles.containerError}
        data-testid={TEST_IDS.ERROR_MSG}
      >
        <Title className={styles.previewError}>{this.previewNameString()}</Title>
        <div className={styles.secondaryTextError}>{errorMessage}</div>
        <Close onClick={this.handleIconClick} />
      </Alert>
    )
  }

  render() {
    return (
      <div>
        {this.renderAttachmentBox()}
        {this.renderAttachmentError()}
      </div>
    )
  }
}
