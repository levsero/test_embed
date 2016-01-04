import React from 'react/addons';

export const NpsCommentButton = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func,
    placeholder: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      onClick: () => {},
      placeholder: ''
    };
  },

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
});
