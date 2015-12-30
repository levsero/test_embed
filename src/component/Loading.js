import React, { Component, PropTypes } from 'react';

class LoadingSpinner extends React.Component {
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
  className: React.PropTypes.string
};

class LoadingEllipses extends React.Component {
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

LoadingEllipses.defaultProps = {
  className: ''
};

LoadingEllipses.propTypes = {
  className: React.PropTypes.string
};

export { LoadingSpinner, LoadingEllipses };