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

export const LoadingElipses = React.createClass({
  render() {
    const loadingElipsesItemClasses = classSet({
      'LoadingElipses-item': true,
      'u-userBackgroundColor': true,
      'u-inlineBlock': true
    });
    const loadingElipsesClasses = `LoadingElipses u-textCenter ${this.props.className}`;

    return (
      <div className={loadingElipsesClasses}>
        <div className={loadingElipsesItemClasses}/>
        <div className={loadingElipsesItemClasses}/>
        <div className={loadingElipsesItemClasses}/>
      </div>
    );
  }
});
