import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { i18n } from 'service/i18n';
import { locals as styles } from './ChatHeader.sass';

import { Avatar } from 'component/Avatar';

export class ChatHeader extends Component {
  static propTypes = {
    agents: PropTypes.object
  };

  static defaultProps = {
    agents: {}
  };

  render = () => {
    const { agents } = this.props;
    const firstAgent = agents[_.keys(agents)[0]];
    const avatar = firstAgent && firstAgent.avatar_path ? firstAgent.avatar_path : '';
    const title = firstAgent && firstAgent.display_name
                ? firstAgent.display_name
                : i18n.t('embeddable_framework.chat.header.title');
    const subText = firstAgent && firstAgent.title
                  ? firstAgent.title
                  : i18n.t('embeddable_framework.chat.header.subText');

    return (
      <div className={styles.container}>
        <Avatar className={styles.avatar} src={avatar} />
        <div className={styles.textContainer}>
          <div className={styles.title}>{title}</div>
          <div>{subText}</div>
        </div>
      </div>
    );
  }
}
