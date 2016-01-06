import React, { Component, PropTypes } from 'react';

class NpsCommentButton extends React.Component {
  render() {
    const classes = `
      Form-fieldLabel
      u-textXHeight
      NpsComment-label
      u-marginBN
      u-textCenter
      u-borderNone
      is-mobile
    `;

    return (
      <div>
        <div className={classes}>
          <span>
            {this.props.label}
          </span>
        </div>
        <div
          onClick={this.props.onClick}
          onTouch={this.props.onClick}
          className='NpsComment-comment-button u-textSizeBaseMobile'>
          {this.props.placeholder}
        </div>
      </div>
    );
  }
}

NpsCommentButton.propTypes = {
  label: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func,
  placeholder: React.PropTypes.string
};

NpsCommentButton.defaultProps = {
  onClick: () => {},
  placeholder: ''
};

export { NpsCommentButton };