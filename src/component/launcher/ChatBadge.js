import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import _ from 'lodash';

import { keyCodes } from 'utility/keyboard';
import { PRECHAT_SCREEN, CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types';
import {
  sendMsg,
  resetCurrentMessage,
  handleChatBadgeMessageChange,
  updateChatScreen } from 'src/redux/modules/chat';
import { handleChatBadgeMinimize, chatBadgeClicked } from 'src/redux/modules/base';
import {
  getCurrentMessage,
  getLauncherBadgeSettings,
  getPrechatFormRequired } from 'src/redux/modules/chat/chat-selectors';
import { getChatBadgeColor } from 'src/redux/modules/selectors';
import { Input } from '@zendeskgarden/react-textfields';
import { Icon } from 'component/Icon';
import { ICONS } from 'constants/shared';
import { i18n } from 'service/i18n';
import { locals as styles } from './ChatBadge.scss';

const mapStateToProps = (state) => {
  return {
    currentMessage: getCurrentMessage(state),
    prechatFormRequired: getPrechatFormRequired(state),
    chatBadgeColor: getChatBadgeColor(state),
    bannerSettings: getLauncherBadgeSettings(state)
  };
};

class ChatBadge extends Component {
  static propTypes = {
    onSend: PropTypes.func.isRequired,
    handleChatBadgeMessageChange: PropTypes.func.isRequired,
    currentMessage: PropTypes.string,
    resetCurrentMessage: PropTypes.func.isRequired,
    sendMsg: PropTypes.func.isRequired,
    handleChatBadgeMinimize: PropTypes.func.isRequired,
    updateChatScreen: PropTypes.func.isRequired,
    bannerSettings: PropTypes.object.isRequired,
    chatBadgeClicked: PropTypes.func.isRequired,
    chatBadgeColor: PropTypes.object,
    prechatFormRequired: PropTypes.bool,
    hideBranding: PropTypes.bool
  };

  static defaultProps = {
    currentMessage: '',
    bannerSettings: {},
    chatBadgeColor: {
      text: '',
      base: ''
    },
    prechatFormRequired: false,
    hideBranding: false
  };

  constructor(props, context) {
    super(props, context);
    this.input = null;
  }

  renderMinimizeButton = () => {
    return (
      <Icon
        className={styles.minimizeButton}
        type={ICONS.DASH}
        onClick={this.props.handleChatBadgeMinimize} />
    );
  }

  renderTitle = () => {
    if (this.props.hideBranding) return;

    // Zendesk branding doesn't need to be translated.
    return <div className={styles.title}>zendesk chat</div>;
  }

  renderLabel = () => {
    const labelClasses = classNames(styles.textContainer, {
      [styles.textOnLeft]: this.props.bannerSettings.layout === 'image_right',
      [styles.textOnRight]: this.props.bannerSettings.layout === 'image_left',
      [styles.textOnly]: this.props.bannerSettings.layout === 'text_only'
    });

    return (
      <td key={'label'} className={labelClasses}>
        {this.props.bannerSettings.label}
      </td>
    );
  }

  renderImage = () => {
    let img = <Icon className={styles.chatIcon} type='Icon--channelChoice-chat' />;

    if (this.props.bannerSettings.image) {
      const imageClasses = classNames({
        [styles.customImg]: this.props.bannerSettings.layout !== 'image_only',
        [styles.customImgOnly]: this.props.bannerSettings.layout === 'image_only'
      });

      img = <img src={this.props.bannerSettings.image} className={imageClasses} />;
    }

    return (
      <td key={'image'} className={styles.imageContainer}>
        {img}
      </td>
    );
  }

  renderContent = () => {
    const content = [];

    switch (this.props.bannerSettings.layout) {
      case 'text_only':
        content.push(this.renderLabel());
        break;
      case 'image_only':
        content.push(this.renderImage());
        break;
      case 'image_left':
        content.push(this.renderImage());
        content.push(this.renderLabel());
        break;
      default:
        content.push(this.renderLabel());
        content.push(this.renderImage());
    }

    return content;
  }

  renderSplashDisplay = () => {
    const displayClasses = classNames(styles.splashDisplayContainer, {
      [styles.splashPadding]: this.props.bannerSettings.layout !== 'image_only'
    });

    return (
      <div onClick={this.props.chatBadgeClicked} className={displayClasses}>
        <table className={styles.splashTable}>
          <tbody>
            <tr>
              {this.renderContent()}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  renderInputContainer = () => {
    const generateCSSColor = (color) => {
      return `
        .sendButtonColor svg path {
          fill: ${color.base} !important;
        }

        .sendButtonColor svg {
          fill: ${color.base} !important;
        }
      `;
    };
    const css = <style dangerouslySetInnerHTML={{ __html: generateCSSColor(this.props.chatBadgeColor) }} />;

    return (
      <div className={styles.inputContainer}>
        {css}
        <Input
          ref={(el) => { this.input = el; }}
          className={styles.input}
          placeholder={i18n.t('embeddable_framework.chat.chatBox.placeholder.type_your_message')}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          value={this.props.currentMessage} />
        <Icon
          onClick={this.sendChatMsg}
          className={styles.sendButton}
          type={ICONS.SEND_CHAT}/>
      </div>
    );
  }

  sendChatMsg = (e) => {
    if (_.isEmpty(this.props.currentMessage)) return;

    const nextScreen = this.props.prechatFormRequired ? PRECHAT_SCREEN : CHATTING_SCREEN;

    this.props.updateChatScreen(nextScreen);

    if (!this.props.prechatFormRequired) {
      this.props.sendMsg(this.props.currentMessage);
      this.props.resetCurrentMessage();
    }

    this.props.onSend(e);
  }

  handleKeyDown = (e) => {
    if (e.keyCode === keyCodes.ENTER && !e.shiftKey) {
      this.sendChatMsg(e);
      e.preventDefault();
    }
  }

  handleChange = (e) => {
    this.props.handleChatBadgeMessageChange(e.target.value);
  }

  render = () => {
    return (
      <div className={styles.container}>
        {this.renderSplashDisplay()}
        {this.renderInputContainer()}
        {this.renderMinimizeButton()}
        {this.renderTitle()}
      </div>
    );
  }
}

const actionCreators = {
  resetCurrentMessage,
  sendMsg,
  handleChatBadgeMessageChange,
  handleChatBadgeMinimize,
  updateChatScreen,
  chatBadgeClicked
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(ChatBadge);
