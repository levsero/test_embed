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
    newHeight: PropTypes.bool.isRequired,
    newChannelChoice: PropTypes.bool.isRequired
  };

  static defaultProps = {
    talkAvailable: false,
    talkEnabled: false,
    submitTicketAvailable: true,
    chatEnabled: false,
    newChannelChoice: false
  };

  renderCancelButton = () => {
    if (this.props.newChannelChoice) return null;

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
      newHeight,
      newChannelChoice
    } = this.props;
    const containerStyle = (newHeight)
      ? styles.newContainer
      : styles.container;

    return (
      <ScrollContainer
        hideZendeskLogo={true}
        fullscreen={true}
        containerClasses={containerStyle}
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
          showCancelButton={false}
          newChannelChoice={newChannelChoice} />
      </ScrollContainer>
    );
  }
}
