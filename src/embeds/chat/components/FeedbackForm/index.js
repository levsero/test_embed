import React from 'react'
import PropTypes from 'prop-types'
import { TEST_IDS } from 'constants/shared'
import { Field } from '@zendeskgarden/react-forms'
import { Field as FinalFormField, Form as ReactFinalForm } from 'react-final-form'

import useTranslate from 'src/hooks/useTranslate'
import { ratings } from 'embeds/chat/components/RatingGroup'

import { SecondaryButton, SubmitButton, ButtonGroup, Label, Textarea, RatingGroup } from './styles'

const FeedbackForm = ({
  feedbackMessage = '',
  rating = {
    value: ratings.NOT_SET,
    comment: ''
  },
  secondaryButtonText,
  handleSecondaryButtonClick,
  submitForm
}) => {
  const translate = useTranslate()

  const onFormSubmission = values => {
    submitForm(values.rating, values.comment)
  }

  return (
    <ReactFinalForm
      onSubmit={onFormSubmission}
      initialValues={{ comment: rating.comment, rating: rating.value }}
      render={({ handleSubmit, values }) => (
        <form onSubmit={handleSubmit} noValidate={true}>
          <FinalFormField
            name={'rating'}
            render={({ input }) => (
              <Field>
                <Label data-testid={TEST_IDS.FORM_GREETING_MSG}>
                  {feedbackMessage ||
                    translate('embeddable_framework.chat.postChat.rating.new_title')}
                </Label>

                <RatingGroup
                  rating={input.value}
                  updateRating={rating => {
                    input.onChange(rating)
                  }}
                />
              </Field>
            )}
          />

          <FinalFormField
            name={'comment'}
            render={({ input }) => (
              <Field>
                <Label>
                  {translate('embeddable_framework.chat.postChat.rating.plainDescription')}
                </Label>

                <Textarea
                  rows={6}
                  data-testid={TEST_IDS.MESSAGE_FIELD}
                  value={input.value}
                  onChange={e => {
                    input.onChange(e.target.value)
                  }}
                />
              </Field>
            )}
          />

          <ButtonGroup>
            <SecondaryButton
              onClick={handleSecondaryButtonClick}
              data-testid={TEST_IDS.BUTTON_CANCEL}
            >
              {secondaryButtonText}
            </SecondaryButton>

            <SubmitButton
              primary={true}
              type="submit"
              disabled={!values.comment && values.rating === ratings.NOT_SET}
              data-testid={TEST_IDS.BUTTON_OK}
            >
              {translate('embeddable_framework.common.button.send')}
            </SubmitButton>
          </ButtonGroup>
        </form>
      )}
    />
  )
}

FeedbackForm.propTypes = {
  feedbackMessage: PropTypes.string,
  rating: PropTypes.object.isRequired,
  secondaryButtonText: PropTypes.string.isRequired,
  handleSecondaryButtonClick: PropTypes.func,
  submitForm: PropTypes.func
}

export default FeedbackForm
