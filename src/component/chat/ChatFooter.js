import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChatFooter.sass';

import { Icon } from 'component/Icon';

export class ChatFooter extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    toggleMenu: PropTypes.func
  }

  static defaultProps = {
    toggleMenu: () => {}
  }

  menuIconClick = (e) => {
    e.stopPropagation();
    this.props.toggleMenu();
  }

  render() {
    return (
      <div className={styles.container}>
        {this.props.children}
        <div className={styles.icons}>
          <Icon type='Icon--ellipsis' onClick={this.menuIconClick} />
        </div>
      </div>
    );
  }
}
