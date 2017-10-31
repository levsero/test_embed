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
    const itemClasses = `${styles.circle} ${itemClassName}`;
    const animationStyle = (isIos8) ? styles.fade : styles.bounce;
    const userColorStyle = (useUserColor) ? 'u-userBackgroundColor' : '';
    const ellipsesItemClasses = `
      ${itemClasses}
      ${animationStyle}
      ${userColorStyle}
    `;

    return (
      <div className={containerClass}>
        <div className={ellipsesItemClasses} />
        <div className={ellipsesItemClasses} />
        <div className={ellipsesItemClasses} />
      </div>
    );
  }
}
