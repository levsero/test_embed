import React, { Component, PropTypes } from 'react';

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
  static propTypes = {
    className: PropTypes.string
  };

  static defaultProps = {
    className: ''
  };

  render() {
    const loadingEllipsesItemClasses = `
      LoadingEllipses-item
      u-userBackgroundColor
      u-inlineBlock
    `;

    return (
      <div className={`LoadingEllipses u-textCenter ${this.props.className}`}>
        <div className={loadingEllipsesItemClasses} />
        <div className={loadingEllipsesItemClasses} />
        <div className={loadingEllipsesItemClasses} />
      </div>
    );
  }
}

export { LoadingSpinner, LoadingEllipses };
