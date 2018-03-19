import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChatFooter.scss';

import { Icon } from 'component/Icon';
import { Dropzone } from 'component/Dropzone';

export class ChatFooter extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    endChat: PropTypes.func,
    handleAttachmentDrop: PropTypes.func,
    isChatting: PropTypes.bool,
    toggleMenu: PropTypes.func,
    attachmentsEnabled: PropTypes.bool.isRequired
  }

  static defaultProps = {
    endChat: () => {},
    handleAttachmentDrop: () => {},
    isChatting: false,
    toggleMenu: () => {}
  }

  menuIconClick = (e) => {
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
        className={`${styles.iconChatMenuOption} ${endChatDisabledClasses}`}
        onClick={this.handleEndChatClick} />
    );
  }

  renderAttachmentOption = () => {
    if (!this.props.attachmentsEnabled) return null;

    return (
      <Dropzone
        onDrop={this.props.handleAttachmentDrop}>
        <Icon
          type='Icon--paperclip-small'
          className={styles.iconAttachment} />
      </Dropzone>
    );
  }

  render() {
    return (
      <div>
        {this.props.children}
        <div className={styles.iconContainer}>
          {this.renderEndChatOption()}
          {this.renderAttachmentOption()}
          <Icon type='Icon--ellipsis' onClick={this.menuIconClick} />
        </div>
      </div>
    );
  }
}
