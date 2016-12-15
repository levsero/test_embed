import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { i18n } from 'service/i18n';
import { locals as styles } from './ChatHeader.sass';
import classNames from 'classnames';

import { Avatar } from 'component/Avatar';

// TODO: Notify Avatar to change profile picture
export class ChatHeader extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Avatar />
        <div className={styles.textContainer}>
          <div className={styles.title}>{_.capitalize(this.props.title)}</div>
          <div>{_.capitalize(this.props.subText)}</div>
        </div>
      </div>
    );
  }
}

ChatHeader.propTypes = {
  title: PropTypes.string,
  subText: PropTypes.string
};

ChatHeader.defaultProps = {
  title: i18n.t('embeddable_framework.chat.header.title', { fallback: 'Welcome' }),
  subText: i18n.t('embeddable_framework.chat.header.subText', { fallback: 'Ask us anything' })
};
