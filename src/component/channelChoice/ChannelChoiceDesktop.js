import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locals as styles } from './ChannelChoiceDesktop.sass';

import { ButtonIcon } from 'component/button/ButtonIcon';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { i18n } from 'service/i18n';

export class ChannelChoiceDesktop extends Component {
  static propTypes = {
    formTitleKey: PropTypes.string.isRequired,
    handleNextClick: PropTypes.func.isRequired,
    renderZendeskLogo: PropTypes.func.isRequired,
    hideZendeskLogo: PropTypes.bool
  };

  static defaultProps = {
    hideZendeskLogo: false
  };

  handleNextClick = (embed) => {
    return () => this.props.handleNextClick(embed);
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

  render = () => {
    const { formTitleKey, hideZendeskLogo, renderZendeskLogo } = this.props;
    const footerClasses = hideZendeskLogo ? styles.footerNoLogo : '';

    return (
      <div>
        <ScrollContainer
          ref='scrollContainer'
          containerClasses={styles.container}
          footerClasses={footerClasses}
          hideZendeskLogo={hideZendeskLogo}
          title={i18n.t(`embeddable_framework.launcher.label.${formTitleKey}`)}>
          {this.renderBody()}
        </ScrollContainer>
        {renderZendeskLogo(false)}
      </div>
    );
  }
}
