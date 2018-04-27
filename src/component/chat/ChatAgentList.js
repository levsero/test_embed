import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locals as styles } from './ChatAgentList.scss';
import _ from 'lodash';
import { Avatar } from 'component/Avatar';

export class ChatAgentList extends Component {
  static propTypes = {
    agents: PropTypes.object.isRequired
  };

  static defaultProps = {
    agents: {}
  };

  render() {
    const { agents } = this.props;

    return (
      _.map(agents, (agent, agentId) => (
        <div key={agentId} className={styles.container}>
          <Avatar className={styles.avatar} src={agent.avatar_path} fallbackIcon="Icon--agent-avatar" />
          <div className={styles.textContainer}>
            <div className={styles.name}>{agent.display_name}</div>
            <div className={styles.title}>{agent.title}</div>
          </div>
        </div>
      ))
    );
  }
}
