import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChatFooter.sass';

import { Icon } from 'component/Icon';

export class ChatFooter extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    endChat: PropTypes.func,
    isChatting: PropTypes.bool,
    toggleMenu: PropTypes.func
  }

  static defaultProps = {
    endChat: () => {},
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
            className={`${styles.iconEndChat} ${endChatDisabledClasses}`}
            onClick={this.handleEndChatClick} />
          <Icon type='Icon--ellipsis' onClick={this.menuIconClick} />
        </div>
      </div>
    );
  }
}
