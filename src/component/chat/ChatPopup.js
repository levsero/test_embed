import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { i18n } from 'service/i18n';
import { Avatar } from 'component/Avatar';
import { Button } from 'component/button/Button';

import { locals as styles } from './ChatPopup.sass';

export class ChatPopup extends Component {
  static propTypes = {
    className: PropTypes.string,
    agentName: PropTypes.string,
    avatarPath: PropTypes.string,
    message: PropTypes.string,
    showCta: PropTypes.bool,
    dismissFn: PropTypes.func,
    respondFn: PropTypes.func
  };

  static defaultProps = {
    className: '',
    showCta: false,
    agentName: '',
    avatarPath: '',
    message: '',
    dismissFn: () => {},
    respondFn: () => {}
  };

  renderCta = () => {
    const { showCta, dismissFn, respondFn } = this.props;

    return showCta
      ? <div className={styles.ctaContainer}>
          <Button
            label={i18n.t('embeddable_framework.chat.popup.button.dismiss')}
            className={styles.dismissBtn}
            primary={false}
            onClick={dismissFn} />
          <Button
            label={i18n.t('embeddable_framework.chat.popup.button.reply')}
            className={styles.viewBtn}
            onClick={respondFn} />
        </div>
      : null;
  }

  renderAgentName = () => {
    const { showCta, agentName } = this.props;

    return showCta && agentName !== ''
      ? <strong>{agentName}</strong>
      : null;
  }

  renderEllipses = (el) => {
    // If overflow height is greater than visible height
    if (el.scrollHeight > el.clientHeight) {
      el.className += ` ${styles.agentMessageOverflow}`;
    }
  }

  render = () => {
    const topContainerClickHandler = !this.props.showCta
      ? this.props.respondFn
      : null;

    return (
      <div className={styles.containerWrapper}>
        <div className={styles.container}>
          <div className={styles.topContainer} onClick={topContainerClickHandler}>
            <Avatar src={this.props.avatarPath} className={styles.avatar} />
            <div className={styles.agentContainer}>
              {this.renderAgentName()}
              <div ref={this.renderEllipses} className={styles.agentMessage}>{this.props.message}</div>
            </div>
          </div>
          {this.renderCta()}
        </div>
      </div>
    );
  }
}

