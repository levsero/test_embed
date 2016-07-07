import React, { Component, PropTypes } from 'react';

import { Icon } from 'component/Icon';

export class IconFieldButton extends Component {
  render() {
    return (
      <div
        onClick={this.props.onClick}
        onTouchStart={this.props.onClick}
        className='Button--fieldEnd Anim-color u-borderTransparent u-marginLS'>
        <Icon type={this.props.icon} className='u-paddingLN u-fillBase' />
      </div>
    );
  }
}

IconFieldButton.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.string,
  className: PropTypes.string
};

IconFieldButton.defaultProps = {
  onClick: () => {},
  icon: '',
  className: ''
};

