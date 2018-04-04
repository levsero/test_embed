import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChatFooter.scss';
import classNames from 'classnames';

import { Icon } from 'component/Icon';
import { Dropzone } from 'component/Dropzone';

import { ICONS } from 'constants/shared';

export class ChatFooter extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    endChat: PropTypes.func,
    sendChat: PropTypes.func,
    handleAttachmentDrop: PropTypes.func,
    isChatting: PropTypes.bool,
    menuIconActive: PropTypes.bool,
    toggleMenu: PropTypes.func,
    attachmentsEnabled: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired
  }

  static defaultProps = {
    endChat: () => {},
    sendChat: () => {},
    handleAttachmentDrop: () => {},
    isChatting: false,
    menuIconActive: false,
    toggleMenu: () => {}
  }

  handleMenuClick = (e) => {
    e.stopPropagation();
    this.props.toggleMenu();
  }

  handleEndChatClick = (e) => {
    if (this.props.isChatting) {
      this.props.endChat(e);
    }
  }

  renderEndChatOption = () => {
    const endChatClasses = classNames(
      styles.iconEndChat,
      { [styles.iconDisabled]: !this.props.isChatting }
    );

    return (
      <Icon
        type={ICONS.END_CHAT}
        className={endChatClasses}
        onClick={this.handleEndChatClick} />
    );
  }

  renderAttachmentOption = () => {
    if (!this.props.attachmentsEnabled) return null;

    const attachmentClasses = classNames(
      styles.iconAttachment,
      { [styles.iconAttachmentMobile]: this.props.isMobile }
    );

    return (
      <div className={attachmentClasses}>
        <Dropzone onDrop={this.props.handleAttachmentDrop}>
          <Icon type={ICONS.PAPERCLIP_SMALL} />
        </Dropzone>
      </div>
    );
  }

  renderMenuOption = () => {
    const menuClasses = classNames(
      styles.iconMenu,
      { [styles.iconActive]: this.props.menuIconActive }
    );

    return (
      <Icon
        type={ICONS.ELLIPSIS}
        className={menuClasses}
        onClick={this.handleMenuClick} />
    );
  }

  renderSendChatOption = () => {
    return (
      <Icon
        type={ICONS.SEND_CHAT}
        className={`${styles.iconSendChat} ${styles.iconSendChatMobile}`}
        onClick={this.props.sendChat} />
    );
  }

  renderDesktop = () => {
    return (
      <div>
        {this.props.children}
        <div className={styles.iconContainer}>
          {this.renderEndChatOption()}
          {this.renderAttachmentOption()}
          {this.renderMenuOption()}
        </div>
      </div>
    );
  }

  renderMobile = () => {
    return (
      <div className={styles.containerMobile}>
        {this.renderAttachmentOption()}
        <div className={styles.inputContainerMobile}>
          {this.props.children}
        </div>
        {this.renderSendChatOption()}
      </div>
    );
  }

  render() {
    return this.props.isMobile ? this.renderMobile() : this.renderDesktop();
  }
}
