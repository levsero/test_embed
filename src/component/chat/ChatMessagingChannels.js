import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Label } from '@zendeskgarden/react-textfields';
import { _ } from 'lodash';

import { i18n } from 'service/i18n';
import { Icon } from 'component/Icon';

import { renderLabel } from 'src/util/fields';
import { locals as styles } from './ChatMessagingChannels.scss';

const URL_PREFIXES = {
  messenger: 'https://m.me/',
  twitter: 'https://twitter.com/messages/compose?recipient_id='
};

export class ChatMessagingChannels extends Component {
  static propTypes = {
    channels: PropTypes.object
  };

  static defaultProps = {
    channels: {}
  };

  renderChannelIcon = (type, pageId) => {
    return (
      <a
        className={styles.channelIcon}
        href={`${URL_PREFIXES[type]}${pageId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon type={`Icon--${type}`} />
      </a>
    );
  };

  render = () => {
    const { channels } = this.props;
    const { facebook, twitter } = channels;

    if (_.isEmpty(channels)) return null;

    const { allowed: messengerAllowed, page_id: messengerPageId } = facebook;
    const { allowed: twitterAllowed, page_id: twitterPageId } = twitter;

    if (!messengerAllowed && !twitterAllowed) return null;

    return (
      <div className={styles.container}>
        {renderLabel(Label, i18n.t('embeddable_framework.chat.messagingChannels.title'), true)}
        <div>
          {messengerAllowed && this.renderChannelIcon('messenger', messengerPageId)}
          {twitterAllowed && this.renderChannelIcon('twitter', twitterPageId)}
        </div>
      </div>
    );
  };
}
