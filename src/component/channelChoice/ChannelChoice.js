import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChannelChoice.sass';

import { ButtonIcon } from 'component/button/ButtonIcon';
import { Container } from 'component/container/Container';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';

export class ChannelChoice extends Component {
  static propTypes = {
    formTitleKey: PropTypes.string,
    hideZendeskLogo: PropTypes.bool,
    onNextClick: PropTypes.func,
    style: PropTypes.object,
    updateFrameSize: PropTypes.func
  };

  static defaultProps = {
    formTitleKey: 'help',
    hideZendeskLogo: false,
    onNextClick: () => {},
    style: {},
    updateFrameSize: () => {}
  };

  handleClick = (embed) => {
    return () => this.props.onNextClick(embed);
  }

  renderZendeskLogo = () => {
    return !this.props.hideZendeskLogo
      ? <ZendeskLogo rtl={i18n.isRTL()} fullscreen={false} />
      : null;
  }

  expand = () => {}

  renderBody = () => {
    const { hideZendeskLogo } = this.props;
    const divider = !hideZendeskLogo ? <hr className={styles.hr} /> : null;
    const containerStyle = !hideZendeskLogo ? styles.inner : '';

    return (
      <div className={containerStyle}>
        <ButtonIcon
          icon='Icon--channelChoice-chat'
          label={i18n.t('embeddable_framework.channelChoice.button.label.chat')}
          onClick={this.handleClick('chat')} />
        <ButtonIcon
          icon='Icon--channelChoice-contactForm'
          label={i18n.t('embeddable_framework.channelChoice.button.label.submitTicket')}
          onClick={this.handleClick('ticketSubmissionForm')} />
          {divider}
      </div>
    );
  }

  render = () => {
    const footerClasses = this.props.hideZendeskLogo ? styles.footerNoLogo : '';

    setTimeout(() => this.props.updateFrameSize(), 0);

    return (
      <Container style={this.props.style}>
        <ScrollContainer
          ref='scrollContainer'
          containerClasses={styles.container}
          footerClasses={footerClasses}
          hideZendeskLogo={this.props.hideZendeskLogo}
          title={i18n.t(`embeddable_framework.launcher.label.${this.props.formTitleKey}`)}>
          {this.renderBody()}
        </ScrollContainer>
        {this.renderZendeskLogo()}
      </Container>
    );
  }
}
