import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChatFooter.sass';

import { Icon } from 'component/Icon';
import { Dropzone } from 'component/Dropzone';

export class ChatFooter extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    endChat: PropTypes.func,
    handleAttachments: PropTypes.func,
    isChatting: PropTypes.bool,
    toggleMenu: PropTypes.func
  }

  static defaultProps = {
    endChat: () => {},
    handleAttachments: () => {},
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
    const attachmentsDisabledClasses = this.props.isChatting ? '' : styles.iconAttachmentDisabled;

    return (
      <div>
        {this.props.children}
        <div className={styles.icons}>
          <Icon
            type='Icon--endChat'
            className={`${styles.icon} ${endChatDisabledClasses}`}
            onClick={this.handleEndChatClick} />
          <Dropzone
            disableClick={!this.props.isChatting}
            onDrop={this.props.handleAttachments}>
            <Icon
              type='Icon--paperclip-small'
              className={`${styles.iconAttachment} ${attachmentsDisabledClasses}`} />
          </Dropzone>
          <Icon type='Icon--ellipsis' onClick={this.menuIconClick} />
        </div>
      </div>
    );
  }
}
