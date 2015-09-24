import React from 'react/addons';

export const NpsCommentButton = React.createClass({

  render() {
    const classes = `
    Form-field
    Label
    u-textXHeight
    u-textSize15
    NpsComment-label
    u-marginBN
    u-textCenter`;

    return (
      <div>
        <div className={classes}>
          <span>
            {this.props.commentsQuestion}
          </span>
        </div>
        <div
          onClick={this.props.onClick}
          onTouch={this.props.onClick}
          className='NpsComment-comment-button' >
          {this.props.text}
        </div>
      </div>
    );
  }
});
