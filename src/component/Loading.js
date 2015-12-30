import React from 'react/addons';

export const LoadingSpinner = React.createClass({
  propTypes: {
    className: React.addons.classSet
  },

  getDefaultProps() {
    return {
      className: ''
    };
  },

  render() {
    return (
      <div
        className={`LoadingSpinner u-userTextColorConstrast ${this.props.className}`}>
      </div>
    );
  }
});

export const LoadingEllipses = React.createClass({
  propTypes: {
    className: React.addons.classSet
  },

  getDefaultProps() {
    return {
      className: ''
    };
  },

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
});
