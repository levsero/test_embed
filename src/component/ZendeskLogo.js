import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locals as styles } from './ZendeskLogo.scss';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { getZendeskHost } from 'utility/globals';

export class ZendeskLogo extends Component {
  static propTypes = {
    className: PropTypes.string,
    formSuccess: PropTypes.bool,
    fullscreen: PropTypes.bool,
    logoLink: PropTypes.string,
    rtl: PropTypes.bool,
    chatId: PropTypes.string
  };

  static defaultProps = {
    className: '',
    formSuccess: false,
    fullscreen: false,
    logoLink: 'embeddables',
    rtl: false,
    chatId: ''
  };

  generateLogoUrl = () => {
    const { logoLink } = this.props;

    const query = (logoLink === 'chat')
      ? ['?utm_source=webwidgetchat',
        '&utm_medium=poweredbyzendeskchat',
        '&utm_campaign=poweredbyzendesk',
        `&utm_term=${this.props.chatId}`,
        `&utm_content=${getZendeskHost(document)}`,
        `&iref=${this.props.chatId}`,
        `&lang=${i18n.getLocale()}`].join('')
      : '?utm_source=webwidget&utm_medium=poweredbyzendesk&utm_campaign=image';

    return [
      i18n.t(`embeddable_framework.zendeskLogo.powered_by_url.${logoLink}`),
      query
    ].join('');
  };

  render = () => {
    const { fullscreen, rtl, formSuccess, className } = this.props;
    const screenPosition = (!fullscreen || formSuccess) ? styles.formSuccess : '';
    const position = (fullscreen) ? styles.fullscreen : '';
    const direction = (rtl) ? styles.rtl : styles.ltr;
    const logoClasses = `
      ${styles.logo}
      ${screenPosition}
      ${position}
      ${direction}
      ${className}
    `;

    return (
      <a href={this.generateLogoUrl()} target='_blank' className={logoClasses} tabIndex='-1'>
        <Icon type='Icon--zendesk' className={styles.icon} />
        <span className={styles.hidden}>zendesk</span>
      </a>
    );
  }
}
