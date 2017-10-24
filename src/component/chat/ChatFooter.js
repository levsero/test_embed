import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChatFooter.sass';

import { Icon } from 'component/Icon';

export class ChatFooter extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    toggleMenu: PropTypes.func,
    endChat: PropTypes.func
  }

  static defaultProps = {
    toggleMenu: () => {},
    endChat: () => {}
  }

  menuIconClick = (e) => {
    e.stopPropagation();
    this.props.toggleMenu();
  }

  render() {
    return (
      <div>
        {this.props.children}
        <div className={styles.icons}>
          <Icon type='Icon--endChat' className={styles.iconEndChat} onClick={this.props.endChat} />
          <Icon type='Icon--ellipsis' onClick={this.menuIconClick} />
        </div>
      </div>
    );
  }
}
