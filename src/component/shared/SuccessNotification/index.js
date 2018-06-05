import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from 'component/button/Button';
import { Icon } from 'component/Icon';

import { i18n } from 'service/i18n';
import { locals as styles } from './SuccessNotification.scss';
import classNames from 'classnames';

export class SuccessNotification extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    icon: PropTypes.string,
    onDoneClick: PropTypes.func
  };

  static defaultProps = {
    onDoneClick: () => {},
    isMobile: false,
    icon: ''
  };

  render() {
    const contentClasses = classNames(
      styles.content,
      { [styles.contentMobile]: this.props.isMobile }
    );
    const firstMessageClasses = classNames(
      styles.firstMessage,
      {
        [styles.firstMessageMobile]: this.props.isMobile,
        [styles.firstMessageDesktop]: !this.props.isMobile
      }
    );

    return (
      <div className={styles.container}>
        <div className={contentClasses}>
          <Icon
            className={styles.icon}
            type={this.props.icon}
            isMobile={this.props.isMobile}
          />
          <div className={styles.messages}>
            <p className={firstMessageClasses}>
              {i18n.t('embeddable_framework.common.notify.message.thanks_for_reaching_out')}
            </p>
            <p>
              {i18n.t('embeddable_framework.common.notify.message.get_back')}
            </p>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Button
            onTouchStartDisabled={true}
            label={i18n.t('embeddable_framework.common.button.done')}
            className={styles.button}
            primary={false}
            onClick={this.props.onDoneClick}
            type='button'
            fullscreen={this.props.isMobile}
          />
        </div>
      </div>
    );
  }
}
