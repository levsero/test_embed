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
  className: React.PropTypes.string
};

class LoadingEllipses extends React.Component {
  static defaultProps = {
    className: ''
  };
  
  static propTypes = {
    className: React.PropTypes.string
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