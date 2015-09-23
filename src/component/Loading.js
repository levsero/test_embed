import React from 'react/addons';

export const LoadingSpinner = React.createClass({
  getDefaultProps() {
    return {
      className: ''
    };
  },

  render() {
    return (
      <div
        className={`LoadingSpinner u-inlineBlock ${this.props.className}`}
        style={{ borderColor: this.props.highlightColor }}>
      </div>
    );
  }
});

export const LoadingEllipses = React.createClass({
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
        <div className={loadingEllipsesItemClasses}/>
        <div className={loadingEllipsesItemClasses}/>
        <div className={loadingEllipsesItemClasses}/>
      </div>
    );
  }
});
