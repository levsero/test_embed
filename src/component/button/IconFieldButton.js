import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Icon } from 'component/Icon';

export class IconFieldButton extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { hovering: false };
  }

  handleMouseEnter = () => {
    this.setState({ hovering: true });
  }

  handleMouseLeave = () => {
    this.setState({ hovering: false });
  }

  render = () => {
    const { fullscreen, focused } = this.props;
    const buttonClasses = classNames({
      'Button--field u-borderTransparent u-marginLS': true,
      'u-userFillColor': this.state.hovering && !fullscreen,
      'u-fillAluminum': focused && !fullscreen,
      'u-fillGainsboro': !focused && !fullscreen,
      'Button--fieldMobile Anim-color': fullscreen,
      [`${this.props.className}`]: true
    });

    return (
      <div
        onClick={this.props.onClick}
        onTouchStart={this.props.onClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        className={buttonClasses}>
        <Icon type={this.props.icon} className='u-paddingLN' />
      </div>
    );
  }
}

IconFieldButton.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.string,
  className: PropTypes.string,
  fullscreen: PropTypes.bool,
  focused: PropTypes.bool
};

IconFieldButton.defaultProps = {
  onClick: () => {},
  icon: '',
  className: '',
  fullscreen: false,
  focused: false
};
