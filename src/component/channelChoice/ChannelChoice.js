import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChannelChoice.sass';

import { ButtonIcon } from 'component/button/ButtonIcon';
import { ChannelChoiceMobile } from 'component/channelChoice/ChannelChoiceMobile';
import { Container } from 'component/container/Container';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';

export class ChannelChoice extends Component {
  static propTypes = {
    showCloseButton: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    formTitleKey: PropTypes.string,
    hideZendeskLogo: PropTypes.bool,
    onNextClick: PropTypes.func,
    style: PropTypes.object,
    isMobile: PropTypes.bool,
    updateFrameSize: PropTypes.func
  };

  static defaultProps = {
    formTitleKey: 'help',
    hideZendeskLogo: false,
    onNextClick: () => {},
    style: {},
    isMobile: false,
    updateFrameSize: () => {}
  };

  handleNextClick = (embed) => {
    return () => {
      this.props.onNextClick(embed);
      this.props.showCloseButton();
    };
  }

  renderZendeskLogo = () => {
    return !this.props.hideZendeskLogo
      ? <ZendeskLogo rtl={i18n.isRTL()} fullscreen={false} />
      : null;
  }

  renderBody = () => {
    const { hideZendeskLogo } = this.props;
    const divider = !hideZendeskLogo ? <hr className={styles.hr} /> : null;
    const containerStyle = !hideZendeskLogo ? styles.inner : '';

    return (
      <div className={containerStyle}>
        <ButtonIcon
          icon='Icon--channelChoice-chat'
          label={i18n.t('embeddable_framework.channelChoice.button.label.chat')}
          onClick={this.handleNextClick('chat')} />
        <ButtonIcon
          icon='Icon--channelChoice-contactForm'
          label={i18n.t('embeddable_framework.channelChoice.button.label.submitTicket')}
          onClick={this.handleNextClick('ticketSubmissionForm')} />
          {divider}
      </div>
    );
  }

  renderMobile = () => {
    return (
      <ChannelChoiceMobile
        containerStyle={this.props.style}
        handleNextClick={this.handleNextClick}
        handleCancelClick={this.props.onCancelClick}
        showCloseButton={this.props.showCloseButton}
        renderZendeskLogo={this.renderZendeskLogo} />
    );
  }

  renderDesktop = (hideZendeskLogo, formTitleKey) => {
    const footerClasses = hideZendeskLogo ? styles.footerNoLogo : '';

    return (
      <Container style={this.props.style}>
        <ScrollContainer
          ref='scrollContainer'
          containerClasses={styles.container}
          footerClasses={footerClasses}
          hideZendeskLogo={hideZendeskLogo}
          title={i18n.t(`embeddable_framework.launcher.label.${formTitleKey}`)}>
          {this.renderBody()}
        </ScrollContainer>
        {this.renderZendeskLogo()}
      </Container>
    );
  }

  render = () => {
    const { isMobile, hideZendeskLogo, formTitleKey } = this.props;

    setTimeout(() => this.props.updateFrameSize(), 0);

    return isMobile
         ? this.renderMobile()
         : this.renderDesktop(hideZendeskLogo, formTitleKey);
  }
}
