import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { isDevice } from 'utility/devices';

class LoadingSpinner extends Component {
  render() {
    return (
      <div
        className={`LoadingSpinner u-userTextColorConstrast ${this.props.className}`}>
      </div>
    );
  }
}

LoadingSpinner.defaultProps = {
  className: ''
};

LoadingSpinner.propTypes = {
  className: PropTypes.string
};

class LoadingEllipses extends Component {
  render() {
    // On IOS8 iphone the scale animation crashes the webpage so
    // we need to animation differently.
    const ios8 = isDevice(['iPhone', 'OS 8']);
    const loadingEllipsesItemClasses = classNames({
      'LoadingEllipses-item--bounce': !ios8,
      'LoadingEllipses-item--fade': ios8,
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

LoadingEllipses.propTypes = {
  className: PropTypes.string
};

LoadingEllipses.defaultProps = {
  className: ''
};

export { LoadingSpinner, LoadingEllipses };
