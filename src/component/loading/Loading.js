import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { isDevice } from 'utility/devices';

export class LoadingEllipses extends Component {
  static propTypes = {
    className: PropTypes.string
  };

  static defaultProps = {
    className: ''
  };

  render = () => {
    // On IOS8 iphone the scale animation crashes the webpage so
    // we need to animation differently.
    const isIos8 = isDevice('iPhone', 'OS 8');
    const loadingEllipsesItemClasses = classNames({
      'LoadingEllipses-item--bounce': !isIos8,
      'LoadingEllipses-item--fade': isIos8,
      'LoadingEllipses-item u-userBackgroundColor u-inlineBlock': true
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
