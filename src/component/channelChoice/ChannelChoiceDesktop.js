import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChannelChoiceDesktop.sass';

import { ChannelChoiceMenu } from 'component/channelChoice/ChannelChoiceMenu';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';

export class ChannelChoiceDesktop extends Component {
  static propTypes = {
    chatOnline: PropTypes.bool.isRequired,
    formTitleKey: PropTypes.string.isRequired,
    handleNextClick: PropTypes.func.isRequired,
    hideZendeskLogo: PropTypes.bool,
    getFrameDimensions: PropTypes.func.isRequired,
    callbackEnabled: PropTypes.bool.isRequired,
    talkAvailable: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    chatAvailable: PropTypes.bool
  };

  static defaultProps = {
    hideZendeskLogo: false,
    talkAvailable: false,
    submitTicketAvailable: true,
    chatAvailable: false
  };

  renderZendeskLogo = () => {
    if (this.props.hideZendeskLogo) return null;

    return <ZendeskLogo rtl={i18n.isRTL()} fullscreen={false} />;
  }

  renderBody = () => {
    const { hideZendeskLogo, chatOnline, handleNextClick, talkAvailable, callbackEnabled } = this.props;
    const divider = !hideZendeskLogo ? <hr className={styles.hr} /> : null;
    const containerStyle = !hideZendeskLogo ? styles.inner : '';

    return (
      <div className={containerStyle}>
        <ChannelChoiceMenu
          submitTicketAvailable={this.props.submitTicketAvailable}
          chatAvailable={this.props.chatAvailable}
          callbackEnabled={callbackEnabled}
          talkAvailable={talkAvailable}
          onNextClick={handleNextClick}
          chatOnline={chatOnline} />
        {divider}
      </div>
    );
  }

  render = () => {
    const { formTitleKey, hideZendeskLogo, getFrameDimensions } = this.props;
    const footerClasses = hideZendeskLogo ? styles.footerNoLogo : '';

    return (
      <div>
        <ScrollContainer
          ref='scrollContainer'
          getFrameDimensions={getFrameDimensions}
          containerClasses={styles.container}
          footerContent={this.renderZendeskLogo()}
          footerClasses={footerClasses}
          hideZendeskLogo={hideZendeskLogo}
          title={i18n.t(`embeddable_framework.launcher.label.${formTitleKey}`)}>
          {this.renderBody()}
        </ScrollContainer>
      </div>
    );
  }
}
