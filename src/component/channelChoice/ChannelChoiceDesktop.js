import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChannelChoiceDesktop.scss';

import { ChannelChoiceMenu } from 'component/channelChoice/ChannelChoiceMenu';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';

export class ChannelChoiceDesktop extends Component {
  static propTypes = {
    chatAvailable: PropTypes.bool.isRequired,
    formTitleKey: PropTypes.string.isRequired,
    handleNextClick: PropTypes.func.isRequired,
    hideZendeskLogo: PropTypes.bool,
    callbackEnabled: PropTypes.bool.isRequired,
    talkAvailable: PropTypes.bool,
    talkEnabled: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    chatEnabled: PropTypes.bool,
    newHeight: PropTypes.bool.isRequired
  };

  static defaultProps = {
    hideZendeskLogo: false,
    talkAvailable: false,
    talkEnabled: false,
    submitTicketAvailable: true,
    chatEnabled: false
  };

  renderZendeskLogo = () => {
    if (this.props.hideZendeskLogo) return null;

    return <ZendeskLogo rtl={i18n.isRTL()} fullscreen={false} />;
  }

  renderBody = () => {
    const {
      hideZendeskLogo,
      chatAvailable,
      handleNextClick,
      talkAvailable,
      talkEnabled,
      callbackEnabled } = this.props;
    const divider = !hideZendeskLogo ? <hr className={styles.hr} /> : null;
    const containerStyle = !hideZendeskLogo ? styles.inner : '';

    return (
      <div className={containerStyle}>
        <ChannelChoiceMenu
          submitTicketAvailable={this.props.submitTicketAvailable}
          chatEnabled={this.props.chatEnabled}
          callbackEnabled={callbackEnabled}
          talkAvailable={talkAvailable}
          talkEnabled={talkEnabled}
          onNextClick={handleNextClick}
          chatAvailable={chatAvailable} />
        {divider}
      </div>
    );
  }

  render = () => {
    const { formTitleKey, hideZendeskLogo, newHeight } = this.props;
    const footerClasses = hideZendeskLogo ? styles.footerNoLogo : '';

    return (
      <div>
        <ScrollContainer
          ref='scrollContainer'
          containerClasses={styles.container}
          footerContent={this.renderZendeskLogo()}
          footerClasses={footerClasses}
          hideZendeskLogo={hideZendeskLogo}
          title={i18n.t(`embeddable_framework.launcher.label.${formTitleKey}`)}
          newHeight={newHeight}>
          {this.renderBody()}
        </ScrollContainer>
      </div>
    );
  }
}
