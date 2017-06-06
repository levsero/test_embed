import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChannelChoiceMobile.sass';

import { Button } from 'component/button/Button';
import { ButtonGroup } from 'component/button/ButtonGroup';
import { ButtonIcon } from 'component/button/ButtonIcon';
import { Container } from 'component/container/Container';
import { i18n } from 'service/i18n';

export class ChannelChoiceMobile extends Component {
  static propTypes = {
    containerStyle: PropTypes.object.isRequired,
    handleNextClick: PropTypes.func.isRequired,
    handleCancelClick: PropTypes.func.isRequired,
    showCloseButton: PropTypes.func.isRequired,
    renderZendeskLogo: PropTypes.func.isRequired
  };

  componentDidMount = () => {
    this.props.showCloseButton(false);
  }

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
    const { containerStyle, renderZendeskLogo } = this.props;

    return (
      <Container style={containerStyle}>
        {this.renderBody()}
        {this.renderCancelButton()}
        {renderZendeskLogo()}
      </Container>
    );
  }
}
