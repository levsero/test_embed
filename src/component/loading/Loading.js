import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

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
    const loadingEllipsesItemClasses = classNames({
      'LoadingEllipses-item--bounce': !isIos8,
      'LoadingEllipses-item--fade': isIos8,
      [this.props.itemClassName]: true,
      'u-userBackgroundColor': this.props.useUserColor,
      'LoadingEllipses-item u-inlineBlock': true
    });

    return (
      <div className={`LoadingEllipses u-textCenter ${this.props.className}`}>
        <div className={loadingEllipsesItemClasses} />
        <div className={loadingEllipsesItemClasses} />
        <div className={loadingEllipsesItemClasses} />
      </div>
    );
  }
}
