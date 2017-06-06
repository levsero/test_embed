import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChannelChoiceMobile.sass';

import { Button } from 'component/button/Button';
import { ButtonGroup } from 'component/button/ButtonGroup';
import { ButtonIcon } from 'component/button/ButtonIcon';
import { i18n } from 'service/i18n';

export class ChannelChoicePopupMobile extends Component {
  static propTypes = {
    handleNextClick: PropTypes.func.isRequired,
    handleCancelClick: PropTypes.func.isRequired
  };

  renderBody = () => {
    const { handleNextClick } = this.props;

    return (
      <div className={styles.inner}>
        <ButtonIcon
          className={styles.innerItem}
          icon='Icon--channelChoice-chat'
          label={i18n.t('embeddable_framework.channelChoice.button.label.chat')}
          onClick={handleNextClick('chat')} />
        <ButtonIcon
          className={styles.innerItem}
          icon='Icon--channelChoice-contactForm'
          label={i18n.t('embeddable_framework.channelChoice.button.label.submitTicket')}
          onClick={handleNextClick('ticketSubmissionForm')} />
      </div>
    );
  }

  renderCancelButton = () => {
    return (
      <div className={styles.buttonContainer}>
        <ButtonGroup rtl={i18n.isRTL()}>
          <Button
            className={styles.cancelButton}
            fullscreen={true}
            label={'Cancel'}
            onClick={this.props.handleCancelClick} />
        </ButtonGroup>
      </div>
    );
  }

  render = () => {
    return (
      <div>
        {this.renderBody()}
        {this.renderCancelButton()}
      </div>
    );
  }
}
