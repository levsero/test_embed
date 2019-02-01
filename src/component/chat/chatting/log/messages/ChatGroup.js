import React, { Component } from 'react';
import PropTypes from 'prop-types';
import chatPropTypes from 'types/chat';
import classNames from 'classnames';
import _ from 'lodash';

import { Avatar } from 'component/Avatar';
import { ChatGroupAvatar } from 'component/chat/chatting/ChatGroupAvatar';
import { MessageBubble } from 'component/shared/MessageBubble';
import { Attachment } from 'component/attachment/Attachment';
import { MessageError } from 'component/chat/chatting/MessageError';
import { ImageMessage } from 'component/chat/chatting/ImageMessage';
import { ICONS, FILETYPE_ICONS } from 'constants/shared';
import { ATTACHMENT_ERROR_TYPES,
  CHAT_MESSAGE_TYPES, CHAT_STRUCTURED_CONTENT_TYPE } from 'constants/chat';
import { i18n } from 'service/i18n';
import { locals as styles } from './ChatGroup.scss';
import { Icon } from 'component/Icon';
import StructuredMessage from 'component/chat/chatting/StructuredMessage';
import Carousel from 'component/chat/chatting/Carousel';

const structuredMessageTypes = _.values(CHAT_STRUCTURED_CONTENT_TYPE.CHAT_STRUCTURED_MESSAGE_TYPE);

export default class ChatGroup extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(chatPropTypes.chatMessage),
    isAgent: PropTypes.bool.isRequired,
    showAvatar: PropTypes.bool.isRequired,
    handleSendMsg: PropTypes.func,
    onImageLoad: PropTypes.func,
    chatLogCreatedAt: PropTypes.number,
    children: PropTypes.object,
    isMobile: PropTypes.bool.isRequired
  };

  static defaultProps = {
    messages: [],
    isAgent: false,
    handleSendMsg: () => {},
    onImageLoad: () => {},
    chatLogCreatedAt: 0,
    socialLogin: {}
  };

  constructor(props) {
    super(props);

    this.container = null;
    this.avatar = new ChatGroupAvatar(props);
  }

  componentWillReceiveProps(props) {
    this.avatar.updateProps(props);
  }

  renderName = (isAgent, showAvatar, messages) => {
    const name = _.get(messages, '0.display_name');
    const shouldAnimate = _.get(messages, '0.timestamp') > this.props.chatLogCreatedAt;
    const nameClasses = classNames({
      [styles.nameAvatar]: showAvatar,
      [styles.nameNoAvatar]: !showAvatar,
      [styles.fadeIn]: shouldAnimate
    });

    return isAgent && name ?
      <div className={nameClasses}>{name}</div> : null;
  }

  renderChatMessages = (isAgent, showAvatar, messages) => {
    let messageClasses = classNames(
      styles.message,
      {
        [styles.messageUser]: !isAgent,
        [styles.messageAgent]: isAgent
      }
    );

    return messages.map((chat) => {
      let message;

      if (chat.msg) {
        if (chat.structured_msg && _.includes(structuredMessageTypes, chat.structured_msg.type)) {
          messageClasses = classNames(
            messageClasses,
            styles.structuredMessageContainer
          );

          message = this.renderStructuredMessage(chat.structured_msg);
        } else if (chat.structured_msg && _.includes(CHAT_STRUCTURED_CONTENT_TYPE.CAROUSEL, chat.structured_msg.type)) {
          messageClasses = classNames(
            messageClasses,
            {
              [styles.carouselContainer]: !this.props.isMobile,
              [styles.carouselMobileContainer]: this.props.isMobile
            }
          );

          message = this.renderCarousel(chat.structured_msg.items);
        } else {
          message = this.renderPrintedMessage(chat, isAgent, showAvatar);
        }
      } else if (chat.file || chat.attachment) {
        message = this.renderInlineAttachment(isAgent, chat);
      }

      const shouldAnimate = chat.timestamp > this.props.chatLogCreatedAt;
      const wrapperClasses = classNames(
        styles.wrapper,
        {
          [styles.avatarAgentWrapper]: this.avatar.shouldDisplay() && this.avatar.isAgent,
          [styles.avatarEndUserWrapper]: this.avatar.shouldDisplay() && this.avatar.isEndUser,
          [styles.fadeUp]: shouldAnimate
        }
      );

      return (
        <div key={chat.timestamp} className={wrapperClasses}>
          <div className={messageClasses}>
            {message}
          </div>
        </div>
      );
    });
  }

  renderMessageBubble = (chat, isAgent, showAvatar) => {
    const { msg, options, translation } = chat;
    const messageBubbleClasses = classNames({
      [styles.messageBubble]: showAvatar,
      [styles.userBackground]: !isAgent,
      [styles.agentBackground]: isAgent
    });

    return (
      <MessageBubble
        className={messageBubbleClasses}
        message={msg}
        options={options}
        translatedMessage={translation ? translation.msg : ''}
        handleSendMsg={this.props.handleSendMsg}
      />
    );
  }

  renderErrorMessage = (chat, isAgent, showAvatar) => {
    const { numFailedTries, msg, timestamp } = chat;
    const messageError = (numFailedTries === 1)
      ? (<MessageError
        errorMessage={i18n.t('embeddable_framework.chat.messagefailed.resend')}
        handleError={() => this.props.handleSendMsg(msg, timestamp)} />)
      : <MessageError errorMessage={i18n.t('embeddable_framework.chat.messagefailed.failed_twice')} />;

    return (
      <div>
        {this.renderMessageBubble(chat, isAgent, showAvatar)}
        <div className={styles.messageErrorContainer}>
          {messageError}
        </div>
      </div>
    );
  }

  renderDefaultMessage = (chat, isAgent, showAvatar) => {
    const sentIndicator = (chat.status === CHAT_MESSAGE_TYPES.CHAT_MESSAGE_SUCCESS)
      ? <Icon className={styles.sentIndicator} type='Icon--mini-tick' />
      : null;

    return (
      <div className={styles.defaultMessageContainer}>
        {sentIndicator}
        {this.renderMessageBubble(chat, isAgent, showAvatar)}
      </div>
    );
  }

  renderPrintedMessage = (chat, isAgent, showAvatar) => {
    return (chat.status === CHAT_MESSAGE_TYPES.CHAT_MESSAGE_FAILURE)
      ? this.renderErrorMessage(chat, isAgent, showAvatar)
      : this.renderDefaultMessage(chat, isAgent, showAvatar);
  }

  renderInlineAttachment = (isAgent, chat) => {
    let inlineAttachment;

    const file = chat.file
      ? chat.file
      : { ...chat.attachment, type: chat.attachment.mime_type };
    const extension = file.name.split('.').pop().toUpperCase();
    const icon = FILETYPE_ICONS[extension] || ICONS.PREVIEW_DEFAULT;
    const isImage = /(gif|jpe?g|png)$/i.test(extension);

    const attachmentClasses = classNames(
      styles.attachment,
      { [styles.attachmentError]: !!file.error }
    );

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
    );

    if (file.error) {
      const errorType = ATTACHMENT_ERROR_TYPES[file.error.message];
      const errorMessage = i18n.t(`embeddable_framework.chat.attachments.error.${errorType}`);

      return (
        <div>
          {inlineAttachment}
          <div className={styles.messageErrorContainer}>
            <MessageError
              className={styles.attachmentErrorMessageContainer}
              messageErrorClasses={styles.attachmentMessageError}
              errorMessage={errorMessage} />
          </div>
        </div>
      );
    }

    if (!file.uploading && isImage) {
      const placeholderEl = !isAgent ? inlineAttachment : null;

      return (
        <ImageMessage
          file={file}
          placeholderEl={placeholderEl}
          onImageLoad={this.props.onImageLoad}
        />
      );
    }

    return inlineAttachment;
  }

  renderAvatar = (messages) => {
    if (!this.avatar.shouldDisplay()) return;

    const shouldAnimate = _.get(messages, '0.timestamp') > this.props.chatLogCreatedAt;
    const avatarClasses = classNames({
      [styles.avatar]: true,
      [styles.agentAvatar]: this.avatar.isAgent,
      [styles.endUserAvatar]: this.avatar.isEndUser,
      [styles.fadeIn]: shouldAnimate
    });

    return (<Avatar
      className={avatarClasses}
      src={this.avatar.path()}
      fallbackIcon='Icon--agent-avatar'
    />);
  }

  renderStructuredMessage = (schema) => {
    return (<StructuredMessage schema={schema} isMobile={this.props.isMobile}/>);
  }

  renderCarousel = (items) => {
    return (<Carousel items={items} isMobile={this.props.isMobile}/>);
  }

  render() {
    const { isAgent, messages, showAvatar } = this.props;

    return (
      <div
        ref={(el) => { this.container = el; }}
        className={styles.container}
      >
        {this.renderName(isAgent, showAvatar, messages)}
        {this.renderChatMessages(isAgent, showAvatar, messages)}
        {this.renderAvatar(messages)}
        {this.props.children}
      </div>
    );
  }
}