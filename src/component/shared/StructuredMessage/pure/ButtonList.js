import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { isMobileBrowser } from 'utility/devices';

import { locals as styles } from './ButtonList.scss';

const isMobile = isMobileBrowser();

export class ButtonList extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    const buttonItemStyles = classNames(styles.buttonItem, {
      [styles.overwriteState]: isMobile
    });

    return (
      <ul className={styles.buttonList}>
        {this.props.children.map((child, idx) => {
          return (
            <li key={idx} className={buttonItemStyles}>
              {child}
            </li>
          );
        })}
      </ul>
    );
  }
}
