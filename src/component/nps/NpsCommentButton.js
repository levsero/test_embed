import React, { Component, PropTypes } from 'react';

export class NpsCommentButton extends Component {
  render = () => {
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
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  placeholder: PropTypes.string
};

NpsCommentButton.defaultProps = {
  onClick: () => {},
  placeholder: ''
};
