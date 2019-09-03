import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, Label, Textarea } from '@zendeskgarden/react-forms'

import { i18n } from 'service/i18n'
import { RatingGroup, ratings } from 'component/chat/rating/RatingGroup'
import { Button } from '@zendeskgarden/react-buttons'
import { TEST_IDS } from 'src/constants/shared'

import { locals as styles } from './FeedbackForm.scss'

export class FeedbackForm extends Component {
  static propTypes = {
    skipClickFn: PropTypes.func.isRequired,
    sendClickFn: PropTypes.func.isRequired,
    feedbackMessage: PropTypes.string,
    rating: PropTypes.object.isRequired,
    cancelButtonText: PropTypes.string.isRequired
  }

  static defaultProps = {
    feedbackMessage: '',
    rating: {
      value: ratings.NOT_SET
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      selectedRating: props.rating.value
    }
    this.textarea = null
  }

  renderActionButtons = () => {
    const { cancelButtonText } = this.props
    const disabled = this.state.selectedRating === ratings.NOT_SET

    return (
      <div className={styles.buttonGroup}>
        <Button
          className={styles.button}
          onClick={this.props.skipClickFn}
          data-testid={TEST_IDS.BUTTON_CANCEL}
        >
          {cancelButtonText}
        </Button>
        <Button
          primary={true}
          className={styles.rightButton}
          disabled={disabled}
          onClick={() => this.props.sendClickFn(this.state.selectedRating, this.textarea.value)}
          data-testid={TEST_IDS.BUTTON_OK}
        >
          {i18n.t('embeddable_framework.common.button.send')}
        </Button>
      </div>
    )
  }

  render() {
    const { rating, feedbackMessage } = this.props

    return (
      <div>
        <label className={styles.feedbackMessage} data-testid={TEST_IDS.FORM_GREETING_MSG}>
          {feedbackMessage || i18n.t('embeddable_framework.chat.postChat.rating.new_title')}
        </label>
        <RatingGroup
          className={styles.ratingGroup}
          rating={this.state.selectedRating}
          updateRating={rating => this.setState({ selectedRating: rating })}
        />
        <Field>
          <Label>{i18n.t('embeddable_framework.chat.postChat.rating.plainDescription')}</Label>
          <Textarea
            ref={el => {
              this.textarea = el
            }}
            className={styles.textarea}
            rows={6}
            defaultValue={rating.comment}
            data-testid={TEST_IDS.MESSAGE_FIELD}
          />
        </Field>
        {this.renderActionButtons()}
      </div>
    )
  }
}
