import React from 'react/addons';

export const LoadingSpinner = React.createClass({
  render() {
    return (
      <div
        className={`LoadingSpinner u-inlineBlock ${this.props.className}`}
        style={{ borderColor: this.props.generateHighlightColor(this.props.highlightColor) }}>
      </div>
    );
  }
});

export const LoadingEllipses = React.createClass({
  render() {
    const LoadingEllipsesItemClasses = `LoadingEllipses-item
    u-userBackgroundColor
    u-inlineBlock`;

    return (
      <div className={`LoadingEllipses u-textCenter ${this.props.className}`}>
        <div className={LoadingEllipsesItemClasses}/>
        <div className={LoadingEllipsesItemClasses}/>
        <div className={LoadingEllipsesItemClasses}/>
      </div>
    );
  }
});
