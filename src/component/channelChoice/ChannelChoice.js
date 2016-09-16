import React, { Component, PropTypes } from 'react';

export class ChannelChoice extends Component {
  render() {
    setTimeout( () => this.props.updateFrameSize(), 0);

    return (
      <div className='ChannelChoice'>
        <p>Select a channel</p>
      </div>
    );
  }
}

ChannelChoice.propTypes = {
  updateFrameSize: PropTypes.func
};

ChannelChoice.defaultProps = {
  updateFrameSize: () => {}
};

