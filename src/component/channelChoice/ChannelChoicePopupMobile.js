import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChannelChoicePopupMobile.sass';

import { ChannelChoiceMenu } from 'component/channelChoice/ChannelChoiceMenu';
import { Button } from 'component/button/Button';
import { ButtonGroup } from 'component/button/ButtonGroup';
import { i18n } from 'service/i18n';

export class ChannelChoicePopupMobile extends Component {
  static propTypes = {
    onNextClick: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    chatOnline: PropTypes.bool.isRequired,
    showCancelButton: PropTypes.bool,
    className: PropTypes.string
  };

  static defaultProps = {
    showCancelButton: true,
    className: ''
  };

  handleContainerClick = (e) => e.stopPropagation();

  renderCancelButton = () => {
    if (!this.props.showCancelButton) return null;

    return (
      <div className={styles.buttonContainer}>
        <ButtonGroup rtl={i18n.isRTL()}>
          <Button
            className={styles.cancelButton}
            fullscreen={true}
            label={i18n.t('embeddable_framework.submitTicket.form.cancelButton.label.cancel')}
            onTouchStartDisabled={true}
            onClick={this.props.onCancelClick} />
        </ButtonGroup>
      </div>
    );
  }

  render = () => {
    const { chatOnline, className, onNextClick } = this.props;

    return (
      <div onClick={this.handleContainerClick}>
        <div className={`${styles.inner} ${className}`}>
          <ChannelChoiceMenu
            onNextClick={onNextClick}
            chatOnline={chatOnline}
            buttonClasses={styles.innerItem}
            labelClasses={styles.innerItemLabel} />
        </div>
        {this.renderCancelButton()}
      </div>
    );
  }
}
