import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChannelChoiceMobile.sass';

import { Button } from 'component/button/Button';
import { ChannelChoicePopupMobile } from 'component/channelChoice/ChannelChoicePopupMobile';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { i18n } from 'service/i18n';

export class ChannelChoiceMobile extends Component {
  static propTypes = {
    handleNextClick: PropTypes.func.isRequired,
    handleCancelClick: PropTypes.func.isRequired,
    formTitleKey: PropTypes.string.isRequired,
    showCloseButton: PropTypes.func.isRequired,
    chatOnline: PropTypes.bool.isRequired,
    callbackEnabled: PropTypes.bool.isRequired,
    talkAvailable: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    chatAvailable: PropTypes.bool
  };

  static defaultProps = {
    talkAvailable: false,
    submitTicketAvailable: true,
    chatAvailable: false
  };

  renderCancelButton = () => {
    return (
      <Button
        fullscreen={true}
        label={i18n.t('embeddable_framework.submitTicket.form.cancelButton.label.cancel')}
        onTouchStartDisabled={true}
        onClick={this.props.handleCancelClick} />
    );
  }

  render = () => {
    const {
      handleNextClick,
      handleCancelClick,
      chatOnline,
      formTitleKey,
      talkAvailable,
      callbackEnabled
    } = this.props;

    return (
      <ScrollContainer
        hideZendeskLogo={true}
        fullscreen={true}
        containerClasses={styles.container}
        footerContent={this.renderCancelButton()}
        title={i18n.t(`embeddable_framework.launcher.label.${formTitleKey}`)}>
        <ChannelChoicePopupMobile
          submitTicketAvailable={this.props.submitTicketAvailable}
          chatAvailable={this.props.chatAvailable}
          chatOnline={chatOnline}
          onNextClick={handleNextClick}
          onCancelClick={handleCancelClick}
          className={styles.container}
          callbackEnabled={callbackEnabled}
          talkAvailable={talkAvailable}
          showCancelButton={false} />
      </ScrollContainer>
    );
  }
}
