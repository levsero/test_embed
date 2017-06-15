import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChannelChoiceMobile.sass';

import { ChannelChoicePopupMobile } from 'component/channelChoice/ChannelChoicePopupMobile';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { i18n } from 'service/i18n';
import { Button } from 'component/button/Button';

export class ChannelChoiceMobile extends Component {
  static propTypes = {
    handleNextClick: PropTypes.func.isRequired,
    handleCancelClick: PropTypes.func.isRequired,
    formTitleKey: PropTypes.string.isRequired,
    showCloseButton: PropTypes.func.isRequired,
    chatOnline: PropTypes.bool.isRequired
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
    const { handleNextClick, handleCancelClick, chatOnline, formTitleKey } = this.props;

    return (
      <ScrollContainer
        hideZendeskLogo={true}
        fullscreen={true}
        containerClasses={styles.container}
        footerContent={this.renderCancelButton()}
        footerClasses={styles.footer}
        title={i18n.t(`embeddable_framework.launcher.label.${formTitleKey}`)}>
        <ChannelChoicePopupMobile
          chatOnline={chatOnline}
          onNextClick={handleNextClick}
          onCancelClick={handleCancelClick}
          classes={styles.container}
          showCancelButton={false} />
      </ScrollContainer>
    );
  }
}
