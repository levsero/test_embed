import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { locals as styles } from './Navigation.scss';
import { ButtonNav } from 'component/button/ButtonNav';
import { i18n } from 'service/i18n';
import { Icon } from 'component/Icon';
import { ICONS } from 'constants/shared';
import { clickBusterRegister } from 'utility/devices';
import { getSettingsChatPopout } from 'src/redux/modules/settings/settings-selectors';
import {
  getZChatVendor,
  getMenuVisible as getChatMenuVisible,
  getStandaloneMobileNotificationVisible
} from 'src/redux/modules/chat/chat-selectors';
import {
  getShowMenu as getShowChatMenu,
  getIsPopoutButtonVisible,
  getShowBackButton
} from 'src/redux/modules/selectors';
import { updateMenuVisibility as updateChatMenuVisibility } from 'src/redux/modules/chat';
import { handleCloseButtonClicked, handlePopoutButtonClicked } from 'src/redux/modules/base/base-actions';
import { createChatPopoutWindow } from 'src/util/chat';
import { getIsChatPreviewEnabled } from 'src/redux/modules/preview/preview-selectors';

const mapStateToProps = (state) => {
  return {
    backButtonVisible: getShowBackButton(state),
    menuVisible: getChatMenuVisible(state),
    useMenu: getShowChatMenu(state),
    standaloneMobileNotificationVisible: getStandaloneMobileNotificationVisible(state),
    chatPopoutSettings: getSettingsChatPopout(state),
    zChat: getZChatVendor(state),
    popoutButtonVisible: getIsPopoutButtonVisible(state),
    locale: i18n.getLocale(),
    isChatPreview: getIsChatPreviewEnabled(state)
  };
};

export class Navigation extends Component {
  static propTypes = {
    fullscreen: PropTypes.bool,
    handleBackClick: PropTypes.func,
    handleCloseButtonClicked: PropTypes.func.isRequired,
    handleOnCloseFocusChange: PropTypes.func.isRequired,
    hideNavigationButtons: PropTypes.bool,
    backButtonVisible: PropTypes.bool,
    preventClose: PropTypes.bool,
    useBackButton: PropTypes.bool,
    useMenu: PropTypes.bool,
    menuVisible: PropTypes.bool,
    updateMenuVisibility: PropTypes.func,
    handlePopoutButtonClicked: PropTypes.func.isRequired,
    standaloneMobileNotificationVisible: PropTypes.bool.isRequired,
    zChat: PropTypes.object,
    isMobile: PropTypes.bool.isRequired,
    chatPopoutSettings: PropTypes.shape({
      webWidget: PropTypes.shape({
        chat:  PropTypes.shape({
          title: PropTypes.object,
          departments: PropTypes.shape({
            enabled: PropTypes.array
          }),
          prechatForm: PropTypes.shape({
            greeting: PropTypes.string
          }),
          offlineForm: PropTypes.shape({
            greeting: PropTypes.string,
            departmentLabel: PropTypes.string
          }),
          concierge: PropTypes.shape({
            avatarPath: PropTypes.string,
            name: PropTypes.string,
            title: PropTypes.string
          })
        }),
        color: PropTypes.shape({
          articleLinks: PropTypes.string,
          button: PropTypes.string,
          header: PropTypes.string,
          launcher: PropTypes.string,
          launcherText: PropTypes.string,
          resultLists: PropTypes.string,
          theme: PropTypes.string,
        })
      })
    }),
    locale: PropTypes.string.isRequired,
    popoutButtonVisible: PropTypes.bool.isRequired,
    isChatPreview: PropTypes.bool
  };

  static defaultProps = {
    fullscreen: false,
    handleBackClick: () => {},
    hideNavigationButtons: false,
    backButtonVisible: false,
    preventClose: false,
    useBackButton: false,
    updateMenuVisibility: () => {},
    menuVisible: false,
    useMenu: false,
    zChat: {},
    isChatPreview: false
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

  handlePopoutClick = () => {
    const {
      chatPopoutSettings,
      zChat,
      isChatPreview,
      locale
    } = this.props;

    if (isChatPreview) return;

    this.props.handlePopoutButtonClicked();

    createChatPopoutWindow(
      chatPopoutSettings,
      zChat.getMachineId(),
      locale
    );
  }

  handleMenuClick = () => {
    this.props.updateMenuVisibility(!this.props.menuVisible);
  }

  handleCloseClick = (e) => {
    if (this.props.preventClose) return;

    e.stopPropagation();

    this.props.handleCloseButtonClicked();
    this.props.handleOnCloseFocusChange();

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
    const {
      fullscreen,
      isMobile,
      popoutButtonVisible,
      hideNavigationButtons,
      isChatPreview
    } = this.props;

    const popoutStyle = (isMobile) ? styles.popoutMobile : styles.popoutDesktop;

    return (!this.props.standaloneMobileNotificationVisible)
      ? <div>
        {this.renderLeftNavButton()}
        {this.renderNavButton({
          onClick: this.handlePopoutClick,
          'aria-label': 'Popout',
          icon: ICONS.POPOUT,
          className: popoutStyle,
          isVisible: isChatPreview || (popoutButtonVisible && !hideNavigationButtons),
          position: 'right'
        })}
        {this.renderNavButton({
          onClick: this.handleCloseClick,
          'aria-label': i18n.t('embeddable_framework.navigation.close'),
          icon: ICONS.DASH,
          position: 'right',
          isVisible: !hideNavigationButtons && (!fullscreen || isMobile)
        })}
      </div> : null;
  }
}

const actionCreators = {
  updateMenuVisibility: updateChatMenuVisibility,
  handleCloseButtonClicked: handleCloseButtonClicked,
  handlePopoutButtonClicked
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(Navigation);
