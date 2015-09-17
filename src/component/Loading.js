import React from 'react/addons';

const classSet = React.addons.classSet;

export const LoadingSpinner = React.createClass({
  render() {
    return (
      <div
        className='Loadingspinner'
        style={{ borderColor: this.props.generateHighlightColor(this.props.highlightColor) }}>
      </div>
    );
  }
});

export const LoadingEllipses = React.createClass({
  render() {
    const LoadingEllipsesItemClasses = classSet({
      'LoadingEllipses-item': true,
      'u-userBackgroundColor': true,
      'u-inlineBlock': true
    });
    const LoadingEllipsesClasses = `LoadingEllipses u-textCenter ${this.props.className}`;

    return (
      <div className={LoadingEllipsesClasses}>
        <div className={LoadingEllipsesItemClasses}/>
        <div className={LoadingEllipsesItemClasses}/>
        <div className={LoadingEllipsesItemClasses}/>
      </div>
    );
  }
});
