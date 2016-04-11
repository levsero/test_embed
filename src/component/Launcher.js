import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Icon } from 'component/Icon';
import { isMobileBrowser } from 'utility/devices';

const offsetHorizontal = 20;
const offsetVertical = 10;

export class Launcher extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      icon: props.icon,
      label: props.label,
      hasUnreadMessages: false
    };
  }

  componentDidUpdate() {
    this.props.setOffsetHorizontal(offsetHorizontal);
    this.props.setOffsetVertical(offsetVertical);
  }

  setLabel(label) {
    this.setState({
      label: label
    });
  }

  setIcon(icon) {
    this.setState({
      icon: icon
    });
  }

  render() {
    const buttonClasses = classNames({
      'Button Button--launcher Button--cta': true,
      'u-userBackgroundColor Arrange Arrange--middle': true,
      'u-isActionable u-textLeft u-inlineBlock u-textNoWrap': true,
      'is-mobile': isMobileBrowser()
    });
    const iconClasses = classNames({
      // spaces needed for class concatenation
      'Arrange-sizeFit Icon--launcher u-textInheritColor u-inlineBlock ': true,
      'u-paddingHN ': isMobileBrowser() && !this.state.hasUnreadMessages
    });
    const labelClasses = classNames({
      'Arrange-sizeFit u-textInheritColor u-inlineBlock': true,
      'u-isHidden': isMobileBrowser() && !this.state.hasUnreadMessages
    });

    setTimeout( () => this.props.updateFrameSize(5, 0), 0);

    return (
      <div className={buttonClasses}
        onClick={this.props.onClick}
        onTouchEnd={this.props.onClick}>
        <Icon
          type={this.state.icon}
          className={iconClasses} />
        <span className={labelClasses}>{this.state.label}</span>
      </div>
    );
  }
}

Launcher.propTypes = {
  onClick: PropTypes.func.isRequired,
  updateFrameSize: PropTypes.func,
  setOffsetHorizontal: PropTypes.func,
  setOffsetVertical: PropTypes.func,
  position: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired
};

Launcher.defaultProps = {
  updateFrameSize: () => {},
  setOffsetHorizontal: () => {},
  setOffsetVertical: () => {}
};
