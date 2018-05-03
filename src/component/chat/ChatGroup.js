import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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

const moment = (() => { try { return require('moment'); } catch (_) {} })();

export class ChatGroup extends Component {
  static propTypes = {
    messages: PropTypes.arrayOf(chatPropTypes.chatMessage),
    isAgent: PropTypes.bool.isRequired,
    avatarPath: PropTypes.string,
    showAvatar: PropTypes.bool.isRequired,
    handleSendMsg: PropTypes.func,
    onImageLoad: PropTypes.func,
    chatLogCreatedAt: PropTypes.number,
    handleImageLoad: PropTypes.func,
    children: PropTypes.object
  };

  static defaultProps = {
    messages: [],
    isAgent: false,
    handleSendMsg: () => {},
    onImageLoad: () => {},
    chatLogCreatedAt: 0
  };

  constructor(props) {
    super(props);

    this.container = null;
    this.avatar = null;
  }

  componentDidMount() {
    this.updateAvatarPosition();
  }

  componentDidUpdate() {
    this.updateAvatarPosition();
  }

  updateAvatarPosition = () => {
    if (!this.container || !this.avatar) return;

    const containerHeight = this.container.getBoundingClientRect().height;
    const avatarHeight = this.avatar.getBoundingClientRect().height;
    const newTopPosition = containerHeight - avatarHeight;

    if (this.avatar.style.top !== newTopPosition) {
      this.avatar.style.top = newTopPosition;
    }
  }

  handleImageLoad = () => {
    this.props.onImageLoad();
    setTimeout(() => {
      this.updateAvatarPosition();
    }, 0);
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
        message = this.renderMessage(isAgent, chat, showAvatar);
      } else if (chat.file || chat.attachment) {
        message = this.renderInlineAttachment(isAgent, chat);
      }

      const shouldAnimate = chat.timestamp > this.props.chatLogCreatedAt;
      const wrapperClasses = classNames(
        styles.wrapper,
        {
          [styles.avatarWrapper]: isAgent && showAvatar,
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
          onImageLoad={this.handleImageLoad}
        />
      );
    }

    return inlineAttachment;
  }

  renderAvatar = (showAvatarAsAgent, avatarPath = '', messages) => {
    const shouldAnimate = _.get(messages, '0.timestamp') > this.props.chatLogCreatedAt;
    const avatarClasses = classNames({
      [styles.avatarWithSrc]: avatarPath,
      [styles.avatarDefault]: !avatarPath,
      [styles.fadeIn]: shouldAnimate
    });

    return showAvatarAsAgent ?
      <Avatar
        ref={(el) => { this.avatar = ReactDOM.findDOMNode(el); }}
        className={avatarClasses}
        src={avatarPath}
        fallbackIcon='Icon--agent-avatar'
      /> : null;
  }

  getDateTime = (timestamp) => {
    const ts = moment(timestamp);

    ts.locale(i18n.getLocale());
    return ts.format('lll');
  }

  renderDivider = (messages) => {
    const isFirstGroup = _.get(messages, '0.first');
    const timestamp = _.get(messages, '0.timestamp');

    return isFirstGroup ? <div className={styles.divider}>{this.getDateTime(timestamp)}</div> : null;
  }

  render() {
    const { isAgent, messages, avatarPath, showAvatar } = this.props;
    const showAvatarAsAgent = isAgent && showAvatar;

    return (
      <div
        ref={(el) => { this.container = el; }}
        className={styles.container}
      >
        {this.renderDivider(messages)}
        {this.renderName(isAgent, showAvatar, messages)}
        {this.renderChatMessages(isAgent, showAvatar, messages)}
        {this.renderAvatar(showAvatarAsAgent, avatarPath, messages)}
        {this.props.children}
      </div>
    );
  }
}
