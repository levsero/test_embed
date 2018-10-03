import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ButtonList.scss';

export class ButtonList extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <ul className={styles.buttonList}>
        {this.props.children.map((child, idx) => {
          return (
            <li key={idx} className={styles.buttonItem}>
              {child}
            </li>
          );
        })}
      </ul>
    );
  }
}
