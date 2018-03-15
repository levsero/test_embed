import React, { Component } from 'react';
import PropTypes from 'prop-types';
import chatPropTypes from 'types/chat';

import _ from 'lodash';

import { Avatar } from 'component/Avatar';
import { MessageBubble } from 'component/shared/MessageBubble';
import { ImageMessage } from 'component/chat/ImageMessage';
import { Attachment } from 'component/attachment/Attachment';
import { ICONS, FILETYPE_ICONS } from 'constants/shared';

import { locals as styles } from './ChatGroup.scss';
import classNames from 'classnames';

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
    isAgent: false
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

    const messageBubbleClasses = classNames({
      [styles.messageBubble]: showAvatar,
      [styles.userBackground]: !isAgent,
      [styles.agentBackground]: isAgent
    });

    return messages.map((chat) => {
      let message;

      if (chat.msg) {
        message = (
          <MessageBubble
            className={messageBubbleClasses}
            message={chat.msg}
            options={chat.options}
            handleSendMsg={this.props.handleSendMsg}
          />
        );
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

  renderInlineAttachment = (isAgent, chat) => {
    let inlineAttachment;
    const file = isAgent ? chat.attachment : chat.file;
    const extension = file.name.split('.').pop().toUpperCase();
    const icon = FILETYPE_ICONS[extension] || ICONS.PREVIEW_DEFAULT;
    const isImage = /(gif|jpe?g|png)$/i.test(extension);

    inlineAttachment = (
      <Attachment
        className={styles.attachment}
        downloading={!file.error && !file.uploading && isImage}
        file={file}
        filenameMaxLength={20}
        icon={icon}
        isDownloadable={isAgent}
        uploading={!file.error && file.uploading}
      />
    );

    if (!file.uploading && isImage) {
      const placeholderEl = !isAgent ? inlineAttachment : null;

      inlineAttachment = (
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
