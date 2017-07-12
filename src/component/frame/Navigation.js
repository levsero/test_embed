import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ButtonNav } from 'component/button/ButtonNav';
import { i18n } from 'service/i18n';
import { Icon } from 'component/Icon';

const mapStateToProps = (state) => {
  return {
    activeEmbed: state.base.activeEmbed
  };
};

class Navigation extends Component {
  static propTypes = {
    fullscreen: PropTypes.bool,
    handleBackClick: PropTypes.func,
    handleCloseClick: PropTypes.func,
    hideCloseButton: PropTypes.bool
  };

  static defaultProps = {
    fullscreen: false,
    handleBackClick: () => {},
    handleCloseClick: () => {},
    hideCloseButton: false
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      showBackButton: false,
      showCloseButton: !props.hideCloseButton
    };

    this.embed = null;
  }

  // For backwards compatibility
  showBackButton = (show = true) => {
    this.setState({ showBackButton: show });
  }

  showCloseButton = (show = true) => {
    this.setState({ showCloseButton: show });
  }

  renderNavButton = (options = {}) => {
    if (options.isHidden) return;

    return (
      <ButtonNav
        onClick={options.onClick}
        label={
          <Icon
            type={options.icon}
            className='u-textInheritColor'
            isMobile={this.props.fullscreen} />
        }
        rtl={i18n.isRTL()}
        position={options.position}
        className={options.className}
        fullscreen={this.props.fullscreen} />
    );
  }

  render = () => {
    return (
      <div>
        <div>
          {this.renderNavButton({
            onClick: this.props.handleBackClick,
            icon: 'Icon--back',
            position: 'left',
            isHidden: !this.state.showBackButton
          })}
        </div>
        <div>
          {this.renderNavButton({
            onClick: this.props.handleCloseClick,
            icon: 'Icon--close',
            position: 'right',
            isHidden: !this.state.showCloseButton
          })}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, {}, null, { withRef: true })(Navigation);
