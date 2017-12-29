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
    toggleMenu: PropTypes.func
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

  handleEndChatClick = () => {
    if (this.props.isChatting) {
      this.props.endChat();
    }
  }

  render() {
    const endChatDisabledClasses = this.props.isChatting ? '' : styles.iconDisabled;

    return (
      <div>
        {this.props.children}
        <div className={styles.icons}>
          <Icon
            type='Icon--endChat'
            className={`${styles.icon} ${endChatDisabledClasses}`}
            onClick={this.handleEndChatClick} />
          <Dropzone
            onDrop={this.props.handleAttachmentDrop}>
            <Icon
              type='Icon--paperclip-small'
              className={styles.iconAttachment} />
          </Dropzone>
          <Icon type='Icon--ellipsis' onClick={this.menuIconClick} />
        </div>
      </div>
    );
  }
}
