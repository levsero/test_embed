import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { locals as styles } from './Navigation.scss';
import { ButtonNav } from 'component/button/ButtonNav';
import { i18n } from 'service/i18n';
import { Icon } from 'component/Icon';
import { ICONS } from 'constants/shared';
import { clickBusterRegister } from 'utility/devices';
import { createChatPopoutWindow } from 'src/util/chat';
import { getSettingsChatPopout } from 'src/redux/modules/settings/settings-selectors';
import {
  getIsPopoutAvailable,
  getZChatVendor,
  getMenuVisible as getChatMenuVisible,
  getShowMenu as getShowChatMenu,
  getStandaloneMobileNotificationVisible
} from 'src/redux/modules/chat/chat-selectors';
import { updateMenuVisibility as updateChatMenuVisibility } from 'src/redux/modules/chat/chat-actions';
import { handleCloseButtonClicked } from 'src/redux/modules/base/base-actions';

const mapStateToProps = (state) => {
  return {
    backButtonVisible: state.base.backButtonVisible,
    popoutButtonVisible: getIsPopoutAvailable(state),
    menuVisible: getChatMenuVisible(state),
    useMenu: getShowChatMenu(state),
    standaloneMobileNotificationVisible: getStandaloneMobileNotificationVisible(state),
    chatPopoutSettings: getSettingsChatPopout(state),
    zChat: getZChatVendor(state)
  };
};

class Navigation extends Component {
  static propTypes = {
    fullscreen: PropTypes.bool,
    handleBackClick: PropTypes.func,
    handleCloseClick: PropTypes.func,
    handleCloseButtonClicked: PropTypes.func,
    hideNavigationButtons: PropTypes.bool,
    backButtonVisible: PropTypes.bool,
    popoutButtonVisible: PropTypes.bool,
    preventClose: PropTypes.bool,
    useBackButton: PropTypes.bool,
    useMenu: PropTypes.bool,
    menuVisible: PropTypes.bool,
    updateMenuVisibility: PropTypes.func,
    standaloneMobileNotificationVisible: PropTypes.bool.isRequired,
    chatPopoutSettings: PropTypes.object,
    zChat: PropTypes.object,
    isMobile: PropTypes.bool.isRequired
  };

  static defaultProps = {
    fullscreen: false,
    handleBackClick: () => {},
    handleCloseClick: () => {},
    handleCloseButtonClicked: () => {},
    hideNavigationButtons: false,
    backButtonVisible: false,
    popoutButtonVisible: false,
    preventClose: false,
    useBackButton: false,
    updateMenuVisibility: () => {},
    menuVisible: false,
    useMenu: false,
    zChat: {}
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
            isMobile={this.props.isMobile} />
        }
        rtl={i18n.isRTL()}
        className={options.className}
        aria-label={options['aria-label']}
        position={options.position}
        fullscreen={this.props.fullscreen}
        isMobile={this.props.isMobile} />
    );
  }

  handleMenuClick = () => {
    this.props.updateMenuVisibility(!this.props.menuVisible);
  }

  handleCloseClick = (e) => {
    if (this.props.preventClose) return;

    e.stopPropagation();

    this.props.handleCloseButtonClicked();

    // e.touches added for automation testing mobile browsers
    // which is firing 'click' event on iframe close
    if (this.props.isMobile && e.touches) {
      clickBusterRegister(e.touches[0].clientX, e.touches[0].clientY);
    }
  }

  renderLeftNavButton = () => {
    const {
      useMenu,
      backButtonVisible,
      useBackButton,
      handleBackClick,
      isMobile
    } = this.props;

    if (isMobile && useMenu) {
      return (
        this.renderNavButton({
          onClick: this.handleMenuClick,
          icon: ICONS.MENU,
          position: 'left',
          'aria-label': i18n.t('embeddable_framework.navigation.menu'),
          isVisible: !this.props.hideNavigationButtons
        })
      );
    } else {
      return (
        this.renderNavButton({
          onClick: handleBackClick,
          icon: ICONS.BACK,
          position: 'left',
          'aria-label': i18n.t('embeddable_framework.navigation.back'),
          isVisible: backButtonVisible && useBackButton
        })
      );
    }
  }

  render = () => {
    const { fullscreen, isMobile } = this.props;

    return (!this.props.standaloneMobileNotificationVisible)
      ? <div>
        {this.renderLeftNavButton()}
        {this.renderNavButton({
          onClick: () => createChatPopoutWindow(this.props.chatPopoutSettings, this.props.zChat.getMachineId()),
          'aria-label': 'Popout',
          icon: ICONS.POPOUT,
          className: styles.popout,
          isVisible: this.props.popoutButtonVisible && !this.props.hideNavigationButtons,
          position: 'right'
        })}
        {this.renderNavButton({
          onClick: this.handleCloseClick,
          'aria-label': i18n.t('embeddable_framework.navigation.close'),
          icon: ICONS.DASH,
          position: 'right',
          isVisible: !this.props.hideNavigationButtons && (!fullscreen || isMobile)
        })}
      </div> : null;
  }
}

const actionCreators = {
  updateMenuVisibility: updateChatMenuVisibility,
  handleCloseButtonClicked: handleCloseButtonClicked
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(Navigation);
