import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChannelChoiceMobile.scss';

import { Button } from 'component/button/Button';
import { ChannelChoicePopupMobile } from 'component/channelChoice/ChannelChoicePopupMobile';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { i18n } from 'service/i18n';

export class ChannelChoiceMobile extends Component {
  static propTypes = {
    handleNextClick: PropTypes.func.isRequired,
    handleCancelClick: PropTypes.func.isRequired,
    formTitleKey: PropTypes.string.isRequired,
    chatAvailable: PropTypes.bool.isRequired,
    callbackEnabled: PropTypes.bool.isRequired,
    talkAvailable: PropTypes.bool,
    talkEnabled: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    chatEnabled: PropTypes.bool,
    newHeight: PropTypes.bool.isRequired
  };

  static defaultProps = {
    talkAvailable: false,
    talkEnabled: false,
    submitTicketAvailable: true,
    chatEnabled: false
  };

  renderCancelButton = () => {
    return (
      <Button
        fullscreen={true}
        label={i18n.t('embeddable_framework.common.button.cancel')}
        onTouchStartDisabled={true}
        onClick={this.props.handleCancelClick} />
    );
  }

  render = () => {
    const {
      handleNextClick,
      handleCancelClick,
      chatAvailable,
      formTitleKey,
      talkAvailable,
      talkEnabled,
      callbackEnabled,
      newHeight
    } = this.props;

    return (
      <ScrollContainer
        hideZendeskLogo={true}
        fullscreen={true}
        containerClasses={styles.container}
        footerContent={this.renderCancelButton()}
        title={i18n.t(`embeddable_framework.launcher.label.${formTitleKey}`)}
        newHeight={newHeight}>
        <ChannelChoicePopupMobile
          submitTicketAvailable={this.props.submitTicketAvailable}
          chatEnabled={this.props.chatEnabled}
          chatAvailable={chatAvailable}
          onNextClick={handleNextClick}
          onCancelClick={handleCancelClick}
          className={styles.container}
          callbackEnabled={callbackEnabled}
          talkAvailable={talkAvailable}
          talkEnabled={talkEnabled}
          showCancelButton={false} />
      </ScrollContainer>
    );
  }
}
