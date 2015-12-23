import React from 'react/addons';

import { Icon }            from 'component/Icon';
import { isMobileBrowser } from 'utility/devices';

const classSet = React.addons.classSet;

export const Launcher = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func,
    updateFrameSize: React.PropTypes.func,
    position: React.PropTypes.string,
    label: React.PropTypes.string,
    icon: React.PropTypes.string
  },

  getInitialState() {
    return {
      icon: this.props.icon,
      label: this.props.label,
      hasUnreadMessages: false
    };
  },

  setLabel(label) {
    this.setState({
      label: label
    });
  },

  setIcon(icon) {
    this.setState({
      icon: icon
    });
  },

  render() {
    const buttonClasses = classSet({
      'Button Button--launcher Button--cta': true,
      'u-userBackgroundColor Arrange Arrange--middle': true,
      'u-isActionable u-textLeft u-inlineBlock u-textNoWrap': true,
      'is-mobile': isMobileBrowser()
    });
    const iconClasses = classSet({
      // spaces needed for class concatenation
      'Arrange-sizeFit Icon--launcher u-textInheritColor u-inlineBlock ': true,
      'u-paddingHN ': isMobileBrowser() && !this.state.hasUnreadMessages
    });
    const labelClasses = classSet({
      'Arrange-sizeFit u-textInheritColor u-inlineBlock': true,
      'u-isHidden': isMobileBrowser() && !this.state.hasUnreadMessages
    });

    if (this.props.updateFrameSize) {
      setTimeout( () => this.props.updateFrameSize(5, 0), 0);
    }

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
});
