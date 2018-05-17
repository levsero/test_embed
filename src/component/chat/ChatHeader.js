import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import { i18n } from 'service/i18n';
import { Avatar } from 'component/Avatar';
import { ChatRatingGroup } from 'component/chat/ChatRatingGroup';
import { FONT_SIZE } from 'constants/shared';

import { locals as styles } from './ChatHeader.scss';

export class ChatHeader extends Component {
  static propTypes = {
    title: PropTypes.string,
    concierges: PropTypes.array,
    updateRating: PropTypes.func,
    rating: PropTypes.string,
    showRating: PropTypes.bool,
    onAgentDetailsClick: PropTypes.func
  };

  static defaultProps = {
    updateRating: () => {},
    rating: null,
    concierges: [{}],
    showRating: false
  };

  renderAvatars = (concierges) => {
    return concierges.map((details) => {
      const avatarPath = details.avatar_path ? details.avatar_path : '';

      return (
        <Avatar key={_.uniqueId()} className={styles.avatar} src={avatarPath} fallbackIcon="Icon--avatar" />
      );
    });
  }

  renderOverflow = (overflowCount) => {
    if (overflowCount <= 0) return;

    return (
      <div className={`${styles.avatarOverflow} ${styles.avatar}`}>
        <span className={styles.avatarOverflowText}>+{overflowCount}</span>
      </div>
    );
  }

  renderAvatarContainer = () => {
    const { concierges } = this.props;
    const avatarWidth = 32;
    const avatarSize = concierges.length;
    let multipleAvatarWidth = 0;

    if (avatarSize === 2) {
      multipleAvatarWidth = 20;
    } else if (avatarSize > 2) {
      multipleAvatarWidth = 40;
    }

    const overflowCount = avatarSize > 3 ? Math.min(avatarSize - 2, 99) : 0;
    const avatars = concierges.slice(0, overflowCount ? 2 : 3);
    const style = { width: `${(avatarWidth + multipleAvatarWidth)/FONT_SIZE}rem` };

    return (
      <div className={styles.avatarContainer} style={style} >
        {this.renderAvatars(avatars)}
        {this.renderOverflow(overflowCount)}
      </div>
    );
  }

  renderRatingButtons = () => {
    return (
      <ChatRatingGroup
        updateRating={this.props.updateRating}
        rtl={i18n.rtl}
        rating={this.props.rating} />
    );
  }

  render = () => {
    const { showRating, onAgentDetailsClick, concierges } = this.props;
    // Title in chat refers to the byline and display_name refers to the display title
    const { display_name: displayName, title } = concierges[0];
    const subText = title ? title : i18n.t('embeddable_framework.chat.header.by_line');
    const titleText = displayName ? displayName : i18n.t('embeddable_framework.chat.header.default.title');
    const ratingButtons = showRating ? this.renderRatingButtons() : null;
    const agentDetailsClasses = classNames(
      styles.agentDetails,
      { [styles.clickable]: !!onAgentDetailsClick }
    );

    return (
      <div className={styles.container}>
        <div className={agentDetailsClasses} onClick={onAgentDetailsClick}>
          {this.renderAvatarContainer()}
          <div className={styles.textContainer}>
            <div className={styles.title}>{titleText}</div>
            <div>{subText}</div>
          </div>
        </div>
        {ratingButtons}
      </div>
    );
  }
}
