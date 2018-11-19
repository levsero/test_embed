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
import { handleChatBadgeMinimize } from 'src/redux/modules/base';
import {
  getCurrentMessage,
  getBannerSettings,
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
    bannerSettings: getBannerSettings(state),
    prechatFormRequired: getPrechatFormRequired(state),
    chatBadgeColor: getChatBadgeColor(state)
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
    bannerSettings: PropTypes.object,
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

    return <div className={styles.title}>zendesk chat</div>;
  }

  renderText = () => {
    let text = i18n.t('embeddable_framework.helpCenter.label.link.chat');

    if (this.props.bannerSettings.text) {
      text = this.props.bannerSettings.text;
    }

    const textClasses = classNames(styles.textContainer, {
      [styles.textOnLeft]: this.props.bannerSettings.layout === 'image_right',
      [styles.textOnRight]: this.props.bannerSettings.layout === 'image_left',
      [styles.textOnly]: this.props.bannerSettings.layout === 'text_only'
    });

    return (
      <td key={'text'} className={textClasses}>{text}</td>
    );
  }

  renderImage = () => {
    let img = <Icon className={styles.chatIcon} type='Icon--channelChoice-chat' />;

    if (this.props.bannerSettings.img) {
      const imageClasses = classNames({
        [styles.customImg]: this.props.bannerSettings.layout !== 'image_only',
        [styles.customImgOnly]: this.props.bannerSettings.layout === 'image_only'
      });

      img = <img src={this.props.bannerSettings.img} className={imageClasses} />;
    }

    return (
      <td key={'image'} className={styles.imageContainer}>
        {img}
      </td>
    );
  }

  renderContent = () => {
    let content = [];

    if (this.props.bannerSettings.layout === 'text_only') {
      content.push(this.renderText());
    } else if (this.props.bannerSettings.layout === 'image_only') {
      content.push(this.renderImage());
    } else if (this.props.bannerSettings.layout === 'image_left') {
      content.push(this.renderImage());
      content.push(this.renderText());
    } else {
      content.push(this.renderText());
      content.push(this.renderImage());
    }

    return content;
  }

  renderSplashDisplay = () => {
    const displayClasses = classNames(styles.splashDisplayContainer, {
      [styles.splashPadding]: this.props.bannerSettings.layout !== 'image_only'
    });

    return (
      <div className={displayClasses}>
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
      <div>
        <div className={styles.container}>
          {this.renderSplashDisplay()}
          {this.renderInputContainer()}
          {this.renderMinimizeButton()}
          {this.renderTitle()}
        </div>
      </div>
    );
  }
}

const actionCreators = {
  resetCurrentMessage,
  sendMsg,
  handleChatBadgeMessageChange,
  handleChatBadgeMinimize,
  updateChatScreen
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(ChatBadge);
