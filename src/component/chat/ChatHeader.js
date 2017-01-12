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
    // TODO: Handle multiple agents in chats.
    const { agents } = this.props;
    const avatars = _.chain(agents)
                     .map((agent) => agent.avatar_path || null)
                     .compact()
                     .value();
    const firstAgent = agents[_.keys(agents)[0]];
    const title = firstAgent && firstAgent.display_name
                ? firstAgent.display_name
                : i18n.t('embeddable_framework.chat.header.title');
    const subText = firstAgent && firstAgent.title
                  ? firstAgent.title
                  : i18n.t('embeddable_framework.chat.header.subText');

    return (
      <div className={styles.container}>
        <Avatar className={styles.avatar} src={avatars[0]} />
        <div className={styles.textContainer}>
          <div className={styles.title}>{title}</div>
          <div>{subText}</div>
        </div>
      </div>
    );
  }
}
