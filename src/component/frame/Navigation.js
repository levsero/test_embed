import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { locals as styles } from './Navigation.scss';
import { ButtonNav } from 'component/button/ButtonNav';
import { i18n } from 'service/i18n';
import { Icon } from 'component/Icon';
import { ICONS } from 'constants/shared';

import {
  getMenuVisible as getChatMenuVisible,
  getShowMenu as getShowChatMenu
} from 'src/redux/modules/chat/chat-selectors';
import { updateMenuVisibility as updateChatMenuVisibility } from 'src/redux/modules/chat/chat-actions';

const mapStateToProps = (state) => {
  return {
    backButtonVisible: state.base.backButtonVisible,
    menuVisible: getChatMenuVisible(state),
    useMenu: getShowChatMenu(state)
  };
};

class Navigation extends Component {
  static propTypes = {
    fullscreen: PropTypes.bool,
    handleBackClick: PropTypes.func,
    handleCloseClick: PropTypes.func,
    hideCloseButton: PropTypes.bool,
    backButtonVisible: PropTypes.bool,
    useBackButton: PropTypes.bool,
    useMenu: PropTypes.bool,
    menuVisible: PropTypes.bool,
    updateMenuVisibility: PropTypes.func
  };

  static defaultProps = {
    fullscreen: false,
    handleBackClick: () => {},
    handleCloseClick: () => {},
    hideCloseButton: false,
    backButtonVisible: false,
    useBackButton: false,
    updateMenuVisibility: () => {},
    menuVisible: false,
    useMenu: false
  };

  renderNavButton = (options = {}) => {
    if (!options.isVisible) return;

    return (
      <ButtonNav
        onClick={options.onClick}
        label={
          <Icon
            type={options.icon}
            className={styles.icon}
            isMobile={this.props.fullscreen} />
        }
        rtl={i18n.isRTL()}
        className={options.className}
        position={options.position}
        fullscreen={this.props.fullscreen} />
    );
  }

  handleMenuClick = () => {
    this.props.updateMenuVisibility(!this.props.menuVisible);
  }

  renderLeftNavButton = () => {
    const {
      fullscreen, useMenu, backButtonVisible, useBackButton, handleBackClick
    } = this.props;

    if (fullscreen && useMenu) {
      return (
        this.renderNavButton({
          onClick: this.handleMenuClick,
          icon: ICONS.MENU,
          position: 'left',
          isVisible: true
        })
      );
    } else {
      return (
        this.renderNavButton({
          onClick: handleBackClick,
          icon: ICONS.BACK,
          position: 'left',
          isVisible: backButtonVisible && useBackButton
        })
      );
    }
  }

  render = () => {
    return (
      <div>
        {this.renderLeftNavButton()}
        {this.renderNavButton({
          onClick: this.props.handleCloseClick,
          icon: ICONS.DASH,
          position: 'right',
          isVisible: !this.props.hideCloseButton
        })}
      </div>
    );
  }
}

const actionCreators = {
  updateMenuVisibility: updateChatMenuVisibility
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(Navigation);
