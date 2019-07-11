import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Icon } from 'component/Icon'

import { i18n } from 'service/i18n'
import { locals as styles } from './SuccessNotification.scss'
import classNames from 'classnames'

export class SuccessNotification extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    icon: PropTypes.string
  }

  static defaultProps = {
    isMobile: false,
    icon: ''
  }

  render() {
    const contentClasses = classNames(styles.content, {
      [styles.contentMobile]: this.props.isMobile
    })
    const firstMessageClasses = classNames(styles.firstMessage, {
      [styles.firstMessageMobile]: this.props.isMobile,
      [styles.firstMessageDesktop]: !this.props.isMobile
    })
    const messageClasses = classNames({
      [styles.mobileMessages]: this.props.isMobile,
      [styles.desktopMessages]: !this.props.isMobile
    })

    return (
      <div className={contentClasses}>
        <Icon className={styles.icon} type={this.props.icon} isMobile={this.props.isMobile} />
        <div className={messageClasses}>
          <h2 className={firstMessageClasses}>
            {i18n.t('embeddable_framework.common.notify.message.thanks_for_reaching_out')}
          </h2>
          <p>{i18n.t('embeddable_framework.common.notify.message.get_back')}</p>
        </div>
      </div>
    )
  }
}
