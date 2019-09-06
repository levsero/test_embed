import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { IconButton } from '@zendeskgarden/react-buttons'
import { ThemeProvider } from '@zendeskgarden/react-theming'
import { Icon } from 'component/Icon'
import classNames from 'classnames'
import { TEST_IDS } from 'src/constants/shared'

import { locals as styles } from './RatingGroup.scss'

import { i18n } from 'service/i18n'

export const ratings = {
  GOOD: 'good',
  BAD: 'bad',
  NOT_SET: null
}

export class RatingGroup extends Component {
  static propTypes = {
    updateRating: PropTypes.func.isRequired,
    rating: PropTypes.string,
    className: PropTypes.string
  }

  static defaultProps = {
    rating: ratings.NOT_SET,
    className: ''
  }

  ratingClickedHandler = value => {
    const rating = this.props.rating === value ? ratings.NOT_SET : value

    this.props.updateRating(rating)
  }

  renderThumbsUpButton = () => {
    const { rating } = this.props
    const thumbUpActiveStyle = rating === ratings.GOOD ? styles.ratingIconActive : ''

    return (
      <IconButton
        size="small"
        className={classNames(styles.ratingIcon, thumbUpActiveStyle, styles.icon)}
        aria-label={i18n.t('embeddable_framework.chat.chatLog.rating.title.good')}
        onClick={() => this.ratingClickedHandler(ratings.GOOD)}
      >
        <Icon type="Icon--thumbUp" />
      </IconButton>
    )
  }

  renderThumbsDownButton = () => {
    const { rating } = this.props
    const thumbDownActiveStyle = rating === ratings.BAD ? styles.ratingIconActive : ''
    const iconStyles = `${styles.ratingIcon} ${styles.thumbDownIcon}`

    return (
      <IconButton
        size="small"
        className={classNames(iconStyles, thumbDownActiveStyle, styles.icon)}
        aria-label={i18n.t('embeddable_framework.chat.chatLog.rating.title.bad')}
        onClick={() => this.ratingClickedHandler(ratings.BAD)}
      >
        <Icon type="Icon--thumbDown" />
      </IconButton>
    )
  }

  render = () => {
    return (
      <ThemeProvider>
        <div className={this.props.className} data-testid={TEST_IDS.CHAT_HEADER_RATING_GROUP}>
          {this.renderThumbsUpButton()}
          {this.renderThumbsDownButton()}
        </div>
      </ThemeProvider>
    )
  }
}
