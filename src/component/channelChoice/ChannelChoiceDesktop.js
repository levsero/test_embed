import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as commonStyles } from './ChannelChoice.sass';
import { locals as styles } from './ChannelChoiceDesktop.sass';

import { ButtonIcon } from 'component/button/ButtonIcon';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';

export class ChannelChoiceDesktop extends Component {
  static propTypes = {
    chatOnline: PropTypes.bool.isRequired,
    formTitleKey: PropTypes.string.isRequired,
    handleNextClick: PropTypes.func.isRequired,
    hideZendeskLogo: PropTypes.bool,
    newDesign: PropTypes.bool
  };

  static defaultProps = {
    hideZendeskLogo: false,
    newDesign: false
  };

  handleChatClick = () => {
    if (this.props.chatOnline) {
      return this.handleNextClick('chat');
    }

    return () => {};
  }

  handleNextClick = (embed) => {
    return () => this.props.handleNextClick(embed);
  }

  renderZendeskLogo = () => {
    if (this.props.hideZendeskLogo) return null;

    return <ZendeskLogo rtl={i18n.isRTL()} fullscreen={false} />;
  }

  renderBody = () => {
    const { hideZendeskLogo, chatOnline } = this.props;
    const divider = !hideZendeskLogo ? <hr className={styles.hr} /> : null;
    const containerStyle = !hideZendeskLogo ? styles.inner : '';
    const chatBtnStyle = !chatOnline ? commonStyles.chatBtnDisabled : '';
    const chatLabel = (chatOnline)
                    ? i18n.t('embeddable_framework.channelChoice.button.label.chat')
                    : i18n.t('embeddable_framework.channelChoice.button.label.chat_offline');

    return (
      <div className={containerStyle}>
        <ButtonIcon
          className={chatBtnStyle}
          actionable={chatOnline}
          icon='Icon--chat'
          label={chatLabel}
          onClick={this.handleChatClick()} />
        <ButtonIcon
          icon='Icon--channelChoice-contactForm'
          label={i18n.t('embeddable_framework.channelChoice.button.label.submitTicket')}
          onClick={this.handleNextClick('ticketSubmissionForm')} />
        {divider}
      </div>
    );
  }

  render = () => {
    const { formTitleKey, hideZendeskLogo } = this.props;
    const footerClasses = hideZendeskLogo ? styles.footerNoLogo : '';

    return (
      <div>
        <ScrollContainer
          ref='scrollContainer'
          containerClasses={styles.container}
          footerContent={this.renderZendeskLogo()}
          footerClasses={footerClasses}
          hideZendeskLogo={hideZendeskLogo}
          newDesign={this.props.newDesign}
          title={i18n.t(`embeddable_framework.launcher.label.${formTitleKey}`)}>
          {this.renderBody()}
        </ScrollContainer>
      </div>
    );
  }
}
