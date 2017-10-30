import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locals as styles } from './LoadingEllipses.sass';

import { isDevice } from 'utility/devices';

export class LoadingEllipses extends Component {
  static propTypes = {
    className: PropTypes.string,
    itemClassName: PropTypes.string,
    useUserColor: PropTypes.bool
  };

  static defaultProps = {
    className: '',
    itemClassName: '',
    useUserColor: true
  };

  render = () => {
    // On IOS8 iphone the scale animation crashes the webpage so
    // we need to animation differently.
    const isIos8 = isDevice('iPhone', 'OS 8');
    const { className, useUserColor, itemClassName } = this.props;
    const containerClass = `${styles.container} ${className}`;
    let itemClasses = `${styles.circle} ${itemClassName}`;

    itemClasses += ` ${isIos8 ? styles.fade : styles.bounce}`;
    if (useUserColor) {
      itemClasses += ' u-userBackgroundColor';
    }

    return (
      <div className={containerClass}>
        <div className={itemClasses} />
        <div className={itemClasses} />
        <div className={itemClasses} />
      </div>
    );
  }
}
