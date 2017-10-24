import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChatFooter.sass';

import { Icon } from 'component/Icon';

export class ChatFooter extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    endChat: PropTypes.func,
    toggleMenu: PropTypes.func,
    showIcons: PropTypes.bool
  }

  static defaultProps = {
    endChat: () => {},
    toggleMenu: () => {},
    showIcons: false
  }

  menuIconClick = (e) => {
    e.stopPropagation();
    this.props.toggleMenu();
  }

  renderIcons = () => {
    if (!this.props.showIcons) return null;

    return (
      <div className={styles.icons}>
        <Icon type='Icon--endChat' className={styles.iconEndChat} onClick={this.props.endChat} />
        <Icon type='Icon--ellipsis' onClick={this.menuIconClick} />
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.props.children}
        {this.renderIcons()}
      </div>
    );
  }
}
