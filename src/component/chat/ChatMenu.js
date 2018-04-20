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
    isMobile: PropTypes.bool,
    loginEnabled: PropTypes.bool
  };

  static defaultProps = {
    endChatOnClick: () => {},
    onGoBackClick: () => {},
    onSendFileClick: () => {},
    contactDetailsOnClick: () => {},
    show: false,
    emailTranscriptOnClick: () => {},
    isChatting: false,
    isMobile: false,
    loginEnabled: false
  };

  constructor(props) {
    super(props);

    this.state = {
      soundButtonClicked: false,
      soundButtonHovered: false
    };
  }

  handleSoundClick = (e) => {
    e.stopPropagation();
    this.props.onSoundClick();
    this.setState({
      soundButtonClicked: true
    });
  }

  handleSoundMouseOver = () => {
    this.setState({
      soundButtonHovered: true
    });
  }

  handleSoundMouseOut = () => {
    this.setState({
      soundButtonHovered: false
    });
  }

  preventContainerClick = (e) => {
    // This is needed to keep the menu being opened
    e.stopPropagation();
  }

  renderButton = (onClick, children, disabled = false) => {
    const classes = this.getItemClasses(disabled);

    return (
      <button className={classes} onClick={onClick} disabled={disabled}>
        {children}
      </button>
    );
  }

  renderDivider = () => <div className={styles.itemLine} />;

  getItemClasses = (disabled = false) => (
    classNames(
      this.props.isMobile ? styles.itemMobile : styles.item,
      { [styles.disabled]: disabled }
    )
  );

  renderSoundButton = () => {
    const iconType = this.props.playSound ? 'Icon--sound-on' : 'Icon--sound-off';
    const classes = classNames(
      { [styles.soundButtonReset]: this.state.soundButtonClicked && !this.state.soundButtonHovered }
    );
    const children = [
      i18n.t('embeddable_framework.chat.options.sound'),
      <Icon key='icon' className={styles.soundIcon} type={iconType} />
    ];

    return (
      <button
        className={`${this.getItemClasses()} ${classes}`}
        onClick={this.handleSoundClick}
        onMouseOver={this.handleSoundMouseOver}
        onMouseOut={this.handleSoundMouseOut}
        onFocus={this.handleSoundMouseOver}
        onBlur={this.handleSoundMouseOut}>
        {children}
      </button>
    );
  }

  renderEmailTranscriptButton = () => {
    const { emailTranscriptOnClick, isChatting } = this.props;
    const label = i18n.t('embeddable_framework.chat.options.emailTranscript');

    return this.renderButton(emailTranscriptOnClick, label, !isChatting);
  }

  renderContactDetailsButton = () => {
    const { loginEnabled, contactDetailsOnClick } = this.props;
    const label = i18n.t('embeddable_framework.chat.options.editContactDetails');

    return loginEnabled ? this.renderButton(contactDetailsOnClick, label) : null;
  }

  renderEndChatButton = () => {
    const { isMobile, disableEndChat, endChatOnClick } = this.props;
    const label = i18n.t('embeddable_framework.chat.options.endChat');
    const containerClasses = this.getItemClasses(disableEndChat);

    return (isMobile
      ? <div className={containerClasses} onClick={this.preventContainerClick}>
        <Button
          onTouchStartDisabled={true}
          onClick={endChatOnClick}
          label={label}
          type={'button'}
          className={styles.endChatMobileButton}
          primary={true}
          disabled={disableEndChat} />
      </div>
      : this.renderButton(endChatOnClick, label, disableEndChat)
    );
  }

  renderGoBackButton = () => {
    const { onGoBackClick } = this.props;
    const label = i18n.t('embeddable_framework.chat.options.goBack');

    return this.renderButton(onGoBackClick, label);
  }

  renderSendFileButton = () => {
    if (!this.props.attachmentsEnabled) return null;

    return (
      <div onClick={this.preventContainerClick}>
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
        endPosHeight={'30px'}
        className={styles.container}
        trigger={this.props.show}>
        {this.renderSoundButton()}
        {this.renderDivider()}
        {this.renderEmailTranscriptButton()}
        {this.renderContactDetailsButton()}
        {this.renderDivider()}
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
