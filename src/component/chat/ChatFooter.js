import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChatFooter.scss';
import classNames from 'classnames';

import { Icon } from 'component/Icon';
import { Dropzone } from 'component/Dropzone';

export class ChatFooter extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    endChat: PropTypes.func,
    sendChat: PropTypes.func,
    handleAttachmentDrop: PropTypes.func,
    isChatting: PropTypes.bool,
    toggleMenu: PropTypes.func,
    attachmentsEnabled: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired
  }

  static defaultProps = {
    endChat: () => {},
    sendChat: () => {},
    handleAttachmentDrop: () => {},
    isChatting: false,
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
    const endChatDisabledClasses = this.props.isChatting ? '' : styles.iconDisabled;

    return (
      <Icon
        type='Icon--endChat'
        className={`${styles.iconEndChat} ${endChatDisabledClasses}`}
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
          <Icon type='Icon--paperclip-small' />
        </Dropzone>
      </div>
    );
  }

  renderMenuOption = () => {
    return (
      <Icon
        type='Icon--ellipsis'
        className={styles.iconMenu}
        onClick={this.handleMenuClick} />
    );
  }

  renderSendChatOption = () => {
    return (
      <Icon
        type='Icon--sendChat'
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
