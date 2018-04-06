import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChatFooter.scss';
import classNames from 'classnames';

import { i18n } from 'service/i18n';
import { IconButton } from 'component/Icon';
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
    const disabled = !this.props.isChatting;
    const endChatClasses = classNames(
      styles.iconEndChat,
      { [styles.iconDisabled]: disabled }
    );

    return (
      <IconButton
        type={ICONS.END_CHAT}
        buttonClassName={endChatClasses}
        disabled={disabled}
        altText={i18n.t('embeddable_framework.chat.icon.endChat.hover.label')}
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
        <Dropzone onDrop={this.props.handleAttachmentDrop}>
          <IconButton
            buttonClassName={attachmentClasses}
            altText={i18n.t('embeddable_framework.chat.icon.attachments.hover.label')}
            disableTooltip={this.props.isMobile}
            type={ICONS.PAPERCLIP_SMALL} />
        </Dropzone>
    );
  }

  renderMenuOption = () => {
    const menuClasses = classNames(
      styles.iconMenu,
      { [styles.iconActive]: this.props.menuIconActive }
    );

    return (
      <IconButton
        type={ICONS.ELLIPSIS}
        buttonClassName={menuClasses}
        altText={i18n.t('embeddable_framework.chat.icon.menu.hover.label')}
        onClick={this.handleMenuClick} />
    );
  }

  renderSendChatOption = () => {
    return (
      <IconButton
        type={ICONS.SEND_CHAT}
        disableTooltip={this.props.isMobile}
        altText={i18n.t('embeddable_framework.submitTicket.form.submitButton.label.send')}
        className={styles.iconSendChatMobile}
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
