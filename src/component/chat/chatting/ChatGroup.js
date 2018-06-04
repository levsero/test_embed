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
  CHAT_MESSAGE_TYPES } from 'constants/chat';
import { i18n } from 'service/i18n';
import { locals as styles } from './ChatGroup.scss';
import { Icon } from 'component/Icon';

export class ChatGroup extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(chatPropTypes.chatMessage),
    isAgent: PropTypes.bool.isRequired,
    avatarPath: PropTypes.string,
    showAvatar: PropTypes.bool.isRequired,
    handleSendMsg: PropTypes.func,
    onImageLoad: PropTypes.func,
    chatLogCreatedAt: PropTypes.number,
    children: PropTypes.object,
    socialLogin: PropTypes.object
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
    const messageClasses = classNames(
      styles.message,
      {
        [styles.messageUser]: !isAgent,
        [styles.messageAgent]: isAgent
      }
    );

    return messages.map((chat) => {
      let message;

      if (chat.msg) {
        message = this.renderPrintedMessage(chat, isAgent, showAvatar);
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
    const { msg, options } = chat;
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
        handleSendMsg={this.props.handleSendMsg}
      />
    );
  }

  renderErrorMessage = (chat, isAgent, showAvatar) => {
    const { numFailedTries, msg, timestamp, options } = chat;
    const messageError = (numFailedTries === 1)
      ? <MessageError
        errorMessage={i18n.t('embeddable_framework.chat.messagefailed.resend')}
        handleError={() => this.props.handleSendMsg(msg, timestamp)} />
      : <MessageError errorMessage={i18n.t('embeddable_framework.chat.messagefailed.failed_twice')} />;

    return (
      <div>
        {this.renderMessageBubble(msg, options, isAgent, showAvatar)}
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

    const file = chat.file;
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
          imgSrc={file.url}
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
