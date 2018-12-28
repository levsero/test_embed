import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import { i18n } from 'service/i18n';
import { Avatar } from 'component/Avatar';
import { RatingGroup } from 'component/chat/rating/RatingGroup';
import { FONT_SIZE } from 'constants/shared';

import { locals as styles } from './ChatHeader.scss';

export class ChatHeader extends Component {
  static propTypes = {
    concierges: PropTypes.array,
    updateRating: PropTypes.func,
    rating: PropTypes.string,
    showRating: PropTypes.bool,
    showAvatar: PropTypes.bool,
    showTitle: PropTypes.bool,
    onAgentDetailsClick: PropTypes.func
  };

  static defaultProps = {
    updateRating: () => {},
    rating: null,
    concierges: [{}],
    showRating: false,
    showAvatar: true,
    showTitle: true
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
    const avatarSize = concierges.length;
    const overflowCount = avatarSize > 3 ? Math.min(avatarSize - 2, 99) : 0;
    const avatars = concierges.slice(0, overflowCount ? 2 : 3);

    return (
      <div className={styles.avatarContainer}>
        {this.renderAvatars(avatars)}
        {this.renderOverflow(overflowCount)}
      </div>
    );
  }

  renderRatingButtons = () => {
    return (
      <RatingGroup
        className={styles.ratingGroup}
        updateRating={this.props.updateRating}
        rtl={i18n.isRTL()}
        rating={this.props.rating} />
    );
  }

  textContainerStyle = () => {
    const { concierges, showAvatar, showTitle } = this.props;

    if (!showTitle) {
      return { visibility: 'hidden' };
    }

    if (!showAvatar) {
      return null;
    }

    const basePadding = 22;
    const paddingAvatarModifier = 20;
    const numAvatars = Math.min(concierges.length, 3);
    const paddingAdjustment = basePadding + (numAvatars * paddingAvatarModifier);

    return (i18n.isRTL())
      ? { paddingRight: `${paddingAdjustment/FONT_SIZE}rem` }
      : { paddingLeft: `${paddingAdjustment/FONT_SIZE}rem` };
  }

  renderTextContainer = () => {
    const { concierges } = this.props;
    const defaultTitleText = i18n.t('embeddable_framework.chat.header.default.title');
    const titleText = _.get(concierges[0], 'display_name') || defaultTitleText;

    return (
      <div data-testid="header-text-container" className={styles.textContainer} style={this.textContainerStyle()}>
        <h2 className={styles.title}>{titleText}</h2>
        {this.renderSubText()}
      </div>
    );
  }

  renderSubText = () => {
    const { concierges } = this.props;
    const defaultSubText = i18n.t('embeddable_framework.chat.header.by_line');
    const subText = _.get(concierges[0], 'title') || defaultSubText;

    return (
      <div className={styles.subTextContainer}>{subText}</div>
    );
  }

  render = () => {
    const { showTitle, showAvatar, showRating, onAgentDetailsClick } = this.props;
    const ratingButtons = showRating ? this.renderRatingButtons() : null;
    const avatar = showAvatar ? this.renderAvatarContainer() : null;
    const textContainer = this.renderTextContainer();
    const agentDetailsClasses = classNames(styles.agentDetails, styles.button, {
      [styles.clickable]: !!onAgentDetailsClick
    });

    if (!showAvatar && !showTitle && !showRating) {
      return null;
    }

    return (
      <div className={styles.container}>
        <button className={agentDetailsClasses} onClick={onAgentDetailsClick}>
          {avatar}
          {textContainer}
        </button>
        {ratingButtons}
      </div>
    );
  }
}
