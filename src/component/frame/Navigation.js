import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ButtonNav } from 'component/button/ButtonNav';
import { i18n } from 'service/i18n';
import { Icon } from 'component/Icon';

const mapStateToProps = (state) => {
  return {
    backButtonVisible: state.base.backButton.visible
  };
};

class Navigation extends Component {
  static propTypes = {
    fullscreen: PropTypes.bool,
    handleBackClick: PropTypes.func,
    handleCloseClick: PropTypes.func,
    hideCloseButton: PropTypes.bool,
    backButtonVisible: PropTypes.bool,
    useBackButton: PropTypes.bool
  };

  static defaultProps = {
    fullscreen: false,
    handleBackClick: () => {},
    handleCloseClick: () => {},
    hideCloseButton: false,
    backButtonVisible: false,
    useBackButton: false
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      showCloseButton: !props.hideCloseButton
    };

    this.embed = null;
  }

  showCloseButton = (show = true) => {
    this.setState({ showCloseButton: show });
  }

  renderNavButton = (options = {}) => {
    if (!options.isVisible) return;

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
        {this.renderNavButton({
          onClick: this.props.handleBackClick,
          icon: 'Icon--back',
          position: 'left',
          isVisible: this.props.backButtonVisible && this.props.useBackButton
        })}
        {this.renderNavButton({
          onClick: this.props.handleCloseClick,
          icon: 'Icon--close',
          position: 'right',
          isVisible: this.state.showCloseButton
        })}
      </div>
    );
  }
}

export default connect(mapStateToProps, {}, null, { withRef: true })(Navigation);
