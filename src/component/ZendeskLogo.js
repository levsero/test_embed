import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locals as styles } from './ZendeskLogo.scss';

import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';

export class ZendeskLogo extends Component {
  static propTypes = {
    className: PropTypes.string,
    formSuccess: PropTypes.bool,
    fullscreen: PropTypes.bool,
    logoLink: PropTypes.string,
    rtl: PropTypes.bool,
    utm: PropTypes.string
  };

  static defaultProps = {
    className: '',
    formSuccess: false,
    fullscreen: false,
    logoLink: 'embeddables',
    rtl: false,
    utm: 'webwidget'
  };

  render = () => {
    const { fullscreen, rtl, formSuccess, className, logoLink, utm } = this.props;
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

    const logoUrl = [
      i18n.t(
        `embeddable_framework.zendeskLogo.powered_by_url.${logoLink}`,
        { fallback: `https://www.zendesk.com/${logoLink}/` }
      ),
      `?utm_source=${utm}&utm_medium=poweredbyzendesk&utm_campaign=image`
    ].join('');

    return (
      <a href={logoUrl} target='_blank' className={logoClasses}>
        <Icon type='Icon--zendesk' className={styles.icon} />
        <span className={styles.hidden}>zendesk</span>
      </a>
    );
  }
}
