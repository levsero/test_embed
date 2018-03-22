import React, { Component } from 'react';
import PropTypes from 'prop-types';
import chatPropTypes from 'types/chat';

import { Avatar } from 'component/Avatar';
import { MessageBubble } from 'component/shared/MessageBubble';
import { Attachment } from 'component/attachment/Attachment';
import { MessageError } from 'component/chat/MessageError';
import { ImageMessage } from 'component/chat/ImageMessage';
import { ICONS, FILETYPE_ICONS } from 'constants/shared';
import { ATTACHMENT_ERROR_TYPES,
         CHAT_MESSAGE_TYPES } from 'constants/chat';
import { i18n } from 'service/i18n';
import { locals as styles } from './ChatGroup.scss';
import classNames from 'classnames';
import _ from 'lodash';

export class ChatGroup extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(chatPropTypes.chatMessage),
    isAgent: PropTypes.bool.isRequired,
    avatarPath: PropTypes.string,
    showAvatar: PropTypes.bool.isRequired,
    handleSendMsg: PropTypes.func
  };

  static defaultProps = {
    messages: [],
    isAgent: false,
    handleSendMsg: () => {}
  };

  renderName = (isAgent, showAvatar, messages) => {
    const name = _.get(messages, '0.display_name');
    const nameClasses = showAvatar ? styles.nameAvatar : styles.nameNoAvatar;

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
        message = this.renderMessage(isAgent, chat, showAvatar);
      } else if (chat.file || chat.attachment) {
        message = this.renderInlineAttachment(isAgent, chat);
      }

      return (
        <div key={chat.timestamp} className={styles.wrapper}>
          <div className={messageClasses}>
            {message}
          </div>
        </div>
      );
    });
  }

  renderMessage = (isAgent, chat, showAvatar) => {
    const messageBubbleClasses = classNames({
      [styles.messageBubble]: showAvatar,
      [styles.userBackground]: !isAgent,
      [styles.agentBackground]: isAgent
    });

    const message = (
      <MessageBubble
        className={messageBubbleClasses}
        message={chat.msg}
        options={chat.options}
        handleSendMsg={this.props.handleSendMsg}
      />
    );

    if (chat.status === CHAT_MESSAGE_TYPES.CHAT_MESSAGE_FAILURE) {
      let messageError;

      if (chat.numFailedTries === 1) {
        messageError = (
          <MessageError
            errorMessage={i18n.t('embeddable_framework.chat.messagefailed.resend')}
            handleError={() => this.props.handleSendMsg(chat.msg, chat.timestamp)} />
        );
      } else {
        messageError = <MessageError errorMessage={i18n.t('embeddable_framework.chat.messagefailed.failed_twice')} />;
      }

      return (
        <div>
          {message}
          <div className={styles.messageErrorContainer}>
            {messageError}
          </div>
        </div>
      );
    }
    return message;
  }

  renderInlineAttachment = (isAgent, chat) => {
    let inlineAttachment;
    const file = isAgent ? chat.attachment : chat.file;
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
        isDownloadable={isAgent}
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
            <MessageError errorMessage={errorMessage} />
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
        />
      );
    }

    return inlineAttachment;
  }

  renderAvatar = (showAvatarAsAgent, avatarPath = '') => {
    const avatarClasses = avatarPath ? styles.avatarWithSrc : styles.avatarDefault;

    return showAvatarAsAgent ?
      <Avatar
        className={avatarClasses}
        src={avatarPath}
        fallbackIcon='Icon--agent-avatar'
      /> : null;
  }

  render() {
    const { isAgent, messages, avatarPath, showAvatar } = this.props;
    const showAvatarAsAgent = isAgent && showAvatar;

    return (
      <div className={styles.container}>
        {this.renderName(isAgent, showAvatar, messages)}
        {this.renderChatMessages(isAgent, showAvatar, messages)}
        {this.renderAvatar(showAvatarAsAgent, avatarPath)}
      </div>
    );
  }
}
