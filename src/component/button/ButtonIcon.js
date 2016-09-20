import React, { Component, PropTypes } from 'react';

import { Icon } from 'component/Icon';

export class ButtonIcon extends Component {
  render() {
    return (
      <div
        onClick={this.props.onClick}
        onTouchStart={this.props.onClick}
        className='Button--icon u-userFillColor u-isActionable'>
        <Icon
          className='Icon--form Arrange-sizeFit u-pullLeft u-paddingRM'
          type={this.props.icon} />
        <span className='u-pullLeft u-textSizeNml'>
          {this.props.label}
        </span>
      </div>
    );
  }
}

ButtonIcon.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.string,
  className: PropTypes.string
};

ButtonIcon.defaultProps = {
  onClick: () => {},
  label: '',
  icon: '',
  className: ''
};

