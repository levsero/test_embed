import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class NpsCommentButton extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    placeholder: PropTypes.string
  };

  static defaultProps = {
    onClick: () => {},
    placeholder: ''
  };

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
