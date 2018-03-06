import React, { Component } from 'react';
import PropTypes from 'prop-types';
import chatPropTypes from 'types/chat';
import _ from 'lodash';

import { Avatar } from 'component/Avatar';
import { MessageBubble } from 'component/chat/MessageBubble';
import { ImageMessage } from 'component/chat/ImageMessage';
import { Attachment } from 'component/attachment/Attachment';
import { ICONS, FILETYPE_ICONS } from 'constants/shared';
import { locals as styles } from './ChatGroup.scss';

export class ChatGroup extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(chatPropTypes.chatMessage),
    isAgent: PropTypes.bool,
    avatarPath: PropTypes.string
  };

  static defaultProps = {
    messages: [],
    isAgent: false,
    avatarPath: ''
  };

  renderName = (isAgent, messages) => {
    const name = _.get(messages, '0.display_name');

    return isAgent && name ?
      <div className={styles.name}>{name}</div> : null;
  }

  renderChatMessages = (isAgent, messages) => {
    const userClasses = isAgent ? styles.messageAgent : styles.messageUser;
    const userBackgroundStyle = isAgent ? styles.agentBackground : styles.userBackground;

    return messages.map((chat) => {
      let message;

      if (chat.msg) {
        message = (
          <MessageBubble
            className={userBackgroundStyle}
            message={chat.msg}
          />
        );
      } else if (chat.file || chat.attachment) {
        message = this.renderInlineAttachment(isAgent, chat);
      }

      return (
        <div key={chat.timestamp} className={styles.wrapper}>
          <div className={`${styles.message} ${userClasses}`}>
            {message}
          </div>
        </div>
      );
    });
  }

  renderInlineAttachment = (isAgent, chat) => {
    let inlineAttachment;
    const file = isAgent ? chat.attachment : chat.file;
    const extension = file.name.split('.').pop().toUpperCase();
    const icon = FILETYPE_ICONS[extension] || ICONS.PREVIEW_DEFAULT;
    const isImage = /(gif|jpe?g|png)$/i.test(extension);

    // chat.uploading is never truthy on an incoming message, therefore the assignment below
    // never occurs if the message group is from an agent AND it is an image
    inlineAttachment = (
      <Attachment
        className={styles.attachment}
        downloading={!chat.uploading && isImage}
        file={file}
        filenameMaxLength={20}
        icon={icon}
        isDownloadable={isAgent}
        uploading={chat.uploading}
      />
    );

    if (!chat.uploading && isImage) {
      const imgSrc = _.isObject(chat.attachment) ? chat.attachment.url : chat.attachment;
      const placeholderEl = !isAgent && inlineAttachment;

      inlineAttachment = (
        <ImageMessage
          imgSrc={imgSrc}
          placeholderEl={placeholderEl}
        />
      );
    }

    return inlineAttachment;
  }

  renderAvatar = (isAgent, avatarPath = '') => {
    const avatarStyles = avatarPath ? styles.avatarWithSrc : styles.avatarDefault;

    return isAgent ?
      <Avatar className={avatarStyles} src={avatarPath} /> : null;
  }

  render() {
    const { isAgent, messages, avatarPath } = this.props;

    return (
      <div className={styles.container}>
        {this.renderName(isAgent, messages)}
        {this.renderChatMessages(isAgent, messages)}
        {this.renderAvatar(isAgent, avatarPath)}
      </div>
    );
  }
}
