import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Icon } from 'component/Icon';

export class IconFieldButton extends Component {
  static propTypes = {
    className: PropTypes.string,
    focused: PropTypes.bool,
    fullscreen: PropTypes.bool,
    icon: PropTypes.string,
    onClick: PropTypes.func
  };

  static defaultProps = {
    className: '',
    focused: false,
    fullscreen: false,
    icon: '',
    onClick: () => {}
  };

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
