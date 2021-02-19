import { Component } from 'react'
import PropTypes from 'prop-types'
import chatPropTypes from 'types/chat'
import classNames from 'classnames'
import _ from 'lodash'

import { Avatar } from 'component/Avatar'
import { Attachment } from 'component/chat/attachment/Attachment'
import MessageError from 'src/embeds/chat/components/MessageError'
import ImageMessage from 'embeds/chat/components/ImageMessage'
import { ICONS, FILETYPE_ICONS } from 'src/constants/shared'
import {
  ATTACHMENT_ERROR_TYPES,
  CHAT_MESSAGE_TYPES,
  CHAT_STRUCTURED_CONTENT_TYPE,
} from 'constants/chat'
import { i18n } from 'src/apps/webWidget/services/i18n'
import { locals as styles } from './ChatGroup.scss'
import { Icon } from 'component/Icon'
import StructuredMessage from 'component/chat/chatting/StructuredMessage'
import Carousel from 'component/chat/chatting/Carousel'
import MessageBubble from 'src/embeds/chat/components/MessageBubble'

const structuredMessageTypes = _.values(CHAT_STRUCTURED_CONTENT_TYPE.CHAT_STRUCTURED_MESSAGE_TYPE)

export default class ChatGroup extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(chatPropTypes.chatMessage),
    isAgent: PropTypes.bool.isRequired,
    showAvatar: PropTypes.bool.isRequired,
    handleSendMsg: PropTypes.func,
    onImageLoad: PropTypes.func,
    chatLogCreatedAt: PropTypes.number,
    socialLogin: PropTypes.object,
    avatarPath: PropTypes.string,
    children: PropTypes.object,
    isMobile: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    messages: [],
    isAgent: false,
    handleSendMsg: () => {},
    onImageLoad: () => {},
    chatLogCreatedAt: 0,
    socialLogin: {},
    avatarPath: '',
  }

  constructor(props) {
    super(props)

    this.container = null
  }

  state = {
    shouldShowAvatar: false,
  }

  static getDerivedStateFromProps(props, state) {
    const hasSocialLoginAvatar =
      !!props.socialLogin.avatarPath && props.socialLogin.avatarPath !== ''
    const shouldShowAvatar = props.showAvatar && (props.isAgent || hasSocialLoginAvatar)

    if (shouldShowAvatar !== state.shouldShowAvatar) {
      return { shouldShowAvatar }
    }

    return null
  }

  renderName = (isAgent, showAvatar, messages) => {
    const name = _.get(messages, '0.display_name')
    const shouldAnimate = _.get(messages, '0.timestamp') > this.props.chatLogCreatedAt
    const nameClasses = classNames({
      [styles.nameAvatar]: showAvatar,
      [styles.nameNoAvatar]: !showAvatar,
      [styles.fadeIn]: shouldAnimate,
    })

    return isAgent && name ? <div className={nameClasses}>{name}</div> : null
  }

  renderChatMessages = (isAgent, showAvatar, messages) => {
    let messageClasses = classNames(styles.message, {
      [styles.messageUser]: !isAgent,
      [styles.messageAgent]: isAgent,
    })

    return messages.map((chat) => {
      let message

      if (chat.msg) {
        if (chat.structured_msg && _.includes(structuredMessageTypes, chat.structured_msg.type)) {
          messageClasses = classNames(messageClasses, styles.structuredMessageContainer)

          message = this.renderStructuredMessage(chat.structured_msg)
        } else if (
          chat.structured_msg &&
          _.includes(CHAT_STRUCTURED_CONTENT_TYPE.CAROUSEL, chat.structured_msg.type)
        ) {
          messageClasses = classNames(messageClasses, {
            [styles.carouselContainer]: !this.props.isMobile,
            [styles.carouselMobileContainer]: this.props.isMobile,
          })

          message = this.renderCarousel(chat.structured_msg.items)
        } else if (
          chat.structured_msg &&
          chat.structured_msg.type === CHAT_STRUCTURED_CONTENT_TYPE.QUICK_REPLIES
        ) {
          // For quick replies, render the message in `structured_msg` property instead of
          // the fallback message and options (`msg` and `options` of the `chat` object)
          const newChat = {
            ...chat,
            msg: chat.structured_msg.msg,
            options: [],
          }

          message = this.renderPrintedMessage(newChat, isAgent, showAvatar)
        } else {
          message = this.renderPrintedMessage(chat, isAgent, showAvatar)
        }
      } else if (chat.file || chat.attachment) {
        message = this.renderInlineAttachment(isAgent, chat)
      }

      const shouldAnimate = chat.timestamp > this.props.chatLogCreatedAt
      const wrapperClasses = classNames(styles.wrapper, {
        [styles.avatarAgentWrapper]: this.state.shouldShowAvatar && this.props.isAgent,
        [styles.avatarEndUserWrapper]: this.state.shouldShowAvatar && !this.props.isAgent,
        [styles.fadeUp]: shouldAnimate,
      })

      return (
        <div key={chat.timestamp} className={wrapperClasses}>
          <div className={messageClasses}>{message}</div>
        </div>
      )
    })
  }

  renderMessageBubble = (chat, isAgent) => {
    const { msg, options, translation } = chat

    return (
      <MessageBubble
        isAgent={isAgent}
        message={msg}
        options={options}
        translatedMessage={translation?.msg}
        onOptionSelect={this.props.handleSendMsg}
      />
    )
  }

  renderErrorMessage = (chat, isAgent) => {
    const { numFailedTries, msg, timestamp } = chat
    const messageError =
      numFailedTries === 1 ? (
        <MessageError
          errorMessage={i18n.t('embeddable_framework.chat.messagefailed.resend')}
          onClick={() => this.props.handleSendMsg(msg, timestamp)}
        />
      ) : (
        <MessageError
          errorMessage={i18n.t('embeddable_framework.chat.messagefailed.failed_twice')}
        />
      )

    return (
      <div>
        {this.renderMessageBubble(chat, isAgent)}
        {messageError}
      </div>
    )
  }

  renderDefaultMessage = (chat, isAgent) => {
    const sentIndicator =
      chat.status === CHAT_MESSAGE_TYPES.CHAT_MESSAGE_SUCCESS ? (
        <Icon className={styles.sentIndicator} type="Icon--mini-tick" />
      ) : null

    return (
      <div className={styles.defaultMessageContainer}>
        {sentIndicator}
        {this.renderMessageBubble(chat, isAgent)}
      </div>
    )
  }

  renderPrintedMessage = (chat, isAgent, showAvatar) => {
    return chat.status === CHAT_MESSAGE_TYPES.CHAT_MESSAGE_FAILURE
      ? this.renderErrorMessage(chat, isAgent, showAvatar)
      : this.renderDefaultMessage(chat, isAgent, showAvatar)
  }

  renderInlineAttachment = (isAgent, chat) => {
    let inlineAttachment

    const file = chat.file ? chat.file : { ...chat.attachment, type: chat.attachment.mime_type }
    const extension = file.name.split('.').pop().toUpperCase()
    const icon = FILETYPE_ICONS[extension] || ICONS.PREVIEW_DEFAULT
    const isImage = /(gif|jpe?g|png)$/i.test(extension)

    const attachmentClasses = classNames(styles.attachment, {
      [styles.attachmentError]: !!file.error,
    })

    inlineAttachment = (
      <Attachment
        className={attachmentClasses}
        downloading={!file.error && !file.uploading && isImage}
        fakeProgress={true}
        file={file}
        filenameMaxLength={20}
        icon={icon}
        isDownloadable={!file.error && !file.uploading}
        uploading={!file.error && file.uploading}
      />
    )

    if (file.error && file.error.message) {
      const errorType =
        ATTACHMENT_ERROR_TYPES[file.error.message] || ATTACHMENT_ERROR_TYPES.UNKNOWN_ERROR
      const errorMessage = i18n.t(`embeddable_framework.chat.attachments.error.${errorType}`)

      return (
        <div>
          {inlineAttachment}
          <MessageError errorMessage={errorMessage} />
        </div>
      )
    }

    if (!file.uploading && isImage) {
      const placeholderEl = !isAgent ? inlineAttachment : null

      return (
        <ImageMessage
          file={file}
          placeholderEl={placeholderEl}
          onImageLoad={this.props.onImageLoad}
        />
      )
    }

    return inlineAttachment
  }

  renderAvatar = (messages) => {
    if (!this.state.shouldShowAvatar) return

    const shouldAnimate = _.get(messages, '0.timestamp') > this.props.chatLogCreatedAt
    const avatarPath = this.props.isAgent
      ? this.props.avatarPath
      : this.props.socialLogin.avatarPath
    const avatarClasses = classNames({
      [styles.avatar]: true,
      [styles.agentAvatar]: this.props.isAgent,
      [styles.endUserAvatar]: !this.props.isAgent,
      [styles.fadeIn]: shouldAnimate,
    })

    return <Avatar className={avatarClasses} src={avatarPath} fallbackIcon="Icon--agent-avatar" />
  }

  renderStructuredMessage = (schema) => {
    return <StructuredMessage schema={schema} isMobile={this.props.isMobile} />
  }

  renderCarousel = (items) => {
    return <Carousel items={items} isMobile={this.props.isMobile} />
  }

  render() {
    const { isAgent, messages, showAvatar } = this.props

    return (
      <div
        ref={(el) => {
          this.container = el
        }}
        className={styles.container}
      >
        {this.renderName(isAgent, showAvatar, messages)}
        {this.renderChatMessages(isAgent, showAvatar, messages)}
        {this.renderAvatar(messages)}
        {this.props.children}
      </div>
    )
  }
}
