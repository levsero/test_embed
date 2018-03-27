import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { i18n } from 'service/i18n';
import { Icon } from 'component/Icon';
import { Button } from 'component/button/Button';
import { Dropzone } from 'component/Dropzone';
import { SlideAppear } from 'component/transition/SlideAppear';

import { locals as styles } from './ChatMenu.scss';
import classNames from 'classnames';

export class ChatMenu extends Component {
  static propTypes = {
    disableEndChat: PropTypes.bool.isRequired,
    attachmentsEnabled: PropTypes.bool.isRequired,
    playSound: PropTypes.bool.isRequired,
    onGoBackClick: PropTypes.func,
    onSendFileClick: PropTypes.func,
    contactDetailsOnClick: PropTypes.func,
    onSoundClick: PropTypes.func.isRequired,
    endChatOnClick: PropTypes.func,
    show: PropTypes.bool,
    emailTranscriptOnClick: PropTypes.func,
    isChatting: PropTypes.bool,
    isMobile: PropTypes.bool
  };

  static defaultProps = {
    endChatOnClick: () => {},
    onGoBackClick: () => {},
    onSendFileClick: () => {},
    contactDetailsOnClick: () => {},
    show: false,
    emailTranscriptOnClick: () => {},
    isChatting: false,
    isMobile: false
  };

  handleSoundClick = (e) => {
    e.stopPropagation();
    this.props.onSoundClick();
  }

  handleSendFileClick = (e) => {
    // This is needed to keep the menu opened and allow file sending to work
    e.stopPropagation();
  }

  getItemClasses = () => {
    return this.props.isMobile ? styles.itemMobile : styles.item;
  }

  renderSoundButton = () => {
    const iconType = this.props.playSound ? 'Icon--sound-on' : 'Icon--sound-off';

    return (
      <button className={this.getItemClasses()} onClick={this.handleSoundClick}>
        {i18n.t('embeddable_framework.chat.options.sound')}
        <Icon className={styles.soundIcon} type={iconType} />
      </button>
    );
  }

  renderEmailTranscriptButton = () => {
    if (!this.props.isChatting) return null;

    return (
      <button className={this.getItemClasses()} onClick={this.props.emailTranscriptOnClick}>
        {i18n.t('embeddable_framework.chat.options.emailTranscript')}
      </button>
    );
  }

  renderContactDetailsButton = () => {
    return (
      <button className={this.getItemClasses()} onClick={this.props.contactDetailsOnClick}>
        {i18n.t('embeddable_framework.chat.options.editContactDetails')}
      </button>
    );
  }

  renderEndChatButton = () => {
    const { isMobile, disableEndChat, endChatOnClick } = this.props;
    const label = i18n.t('embeddable_framework.chat.options.endChat');

    return (
      <button className={this.getItemClasses()} onClick={endChatOnClick} disabled={disableEndChat}>
        {
          isMobile
          ? <Button
            onTouchStartDisabled={true}
            label={label}
            className={styles.endChatMobileButton}
            primary={true}
            disabled={disableEndChat} />
          : label
        }
      </button>
    );
  }

  renderGoBackButton = () => {
    return (
      <button className={this.getItemClasses()} onClick={this.props.onGoBackClick}>
        {i18n.t('embeddable_framework.chat.options.goBack')}
      </button>
    );
  }

  renderSendFileButton = () => {
    if (!this.props.attachmentsEnabled) return null;

    return (
      <div onClick={this.handleSendFileClick}>
        <Dropzone className={this.getItemClasses()} onDrop={this.props.onSendFileClick}>
          {i18n.t('embeddable_framework.chat.options.sendFile')}
        </Dropzone>
      </div>
    );
  }

  renderDesktop = () => {
    return (
      <SlideAppear
        startPosHeight={'10px'}
        endPosHeight={'20px'}
        className={styles.container}
        trigger={this.props.show}>
        {this.renderSoundButton()}
        <div className={styles.itemLine} />
        {this.renderEmailTranscriptButton()}
        {this.renderContactDetailsButton()}
        <div className={styles.itemLine} />
        {this.renderEndChatButton()}
      </SlideAppear>
    );
  }

  renderMobile = () => {
    const containerClasses = classNames(
      styles.containerMobile,
      { [styles.hidden]: !this.props.show }
    );

    return (
      <div className={containerClasses}>
        <div className={styles.overlayMobile} />
        <SlideAppear
          direction={'down'}
          duration={200}
          startPosHeight={'-10px'}
          endPosHeight={'0px'}
          className={styles.wrapperMobile}
          trigger={this.props.show}>
          {this.renderGoBackButton()}
          {this.renderContactDetailsButton()}
          {this.renderSendFileButton()}
          {this.renderEmailTranscriptButton()}
          {this.renderEndChatButton()}
        </SlideAppear>
      </div>
    );
  }

  render() {
    return this.props.isMobile ? this.renderMobile() : this.renderDesktop();
  }
}
