import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChannelChoiceDesktop.scss';

import ChannelChoiceMenu from 'component/channelChoice/ChannelChoiceMenu';
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
    talkOnline: PropTypes.bool.isRequired,
    submitTicketAvailable: PropTypes.bool,
    chatEnabled: PropTypes.bool,
    chatOfflineAvailable: PropTypes.bool
  };

  static defaultProps = {
    hideZendeskLogo: false,
    talkOnline: false,
    submitTicketAvailable: true,
    chatEnabled: false
  };

  renderZendeskLogo = () => {
    if (this.props.hideZendeskLogo) return null;

    return <ZendeskLogo fullscreen={false} />;
  }

  renderBody = () => {
    const {
      hideZendeskLogo,
      chatAvailable,
      handleNextClick,
      talkOnline,
      callbackEnabled,
      chatOfflineAvailable } = this.props;
    const containerStyle = !hideZendeskLogo ? styles.inner : '';

    return (
      <div className={containerStyle}>
        <ChannelChoiceMenu
          submitTicketAvailable={this.props.submitTicketAvailable}
          chatEnabled={this.props.chatEnabled}
          callbackEnabled={callbackEnabled}
          talkOnline={talkOnline}
          onNextClick={handleNextClick}
          chatOfflineAvailable={chatOfflineAvailable}
          chatAvailable={chatAvailable} />
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
          containerClasses={styles.newChannelChoiceContainer}
          footerClasses={footerClasses}
          hideZendeskLogo={hideZendeskLogo}
          title={i18n.t(`embeddable_framework.helpCenter.form.title.${formTitleKey}`)}>
          {this.renderBody()}
        </ScrollContainer>
        {this.renderZendeskLogo()}
      </div>
    );
  }
}
