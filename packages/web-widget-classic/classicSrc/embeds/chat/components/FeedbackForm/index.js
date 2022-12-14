import { Alert, Title } from 'classicSrc/components/Alert'
import { TEST_IDS } from 'classicSrc/constants/shared'
import { ratings } from 'classicSrc/embeds/chat/components/RatingGroup'
import ChatPropTypes from 'classicSrc/embeds/chat/utils/ChatPropTypes'
import useTranslate from 'classicSrc/hooks/useTranslate'
import { FORM_ERROR } from 'final-form'
import PropTypes from 'prop-types'
import { Field as FinalFormField, Form as ReactFinalForm } from 'react-final-form'
import { Field } from '@zendeskgarden/react-forms'
import { SecondaryButton, SubmitButton, ButtonGroup, Label, Textarea, RatingGroup } from './styles'

const FeedbackForm = ({
  rating = {
    value: ratings.NOT_SET,
    comment: '',
  },
  secondaryButtonText,
  handleSecondaryButtonClick,
  submitForm,
}) => {
  const translate = useTranslate()

  const onFormSubmission = (values, _form, callback) => {
    const validationError = !values.rating && !values.comment

    if (validationError) {
      callback({
        [FORM_ERROR]: 'embeddable_framework.validation.error.feedback_form',
      })
      return
    }

    submitForm(values.rating, values.comment)
  }

  return (
    <ReactFinalForm
      onSubmit={onFormSubmission}
      initialValues={{ comment: rating.comment, rating: rating.value }}
      render={({ handleSubmit, submitError }) => (
        <form onSubmit={handleSubmit} noValidate={true}>
          <FinalFormField
            name={'rating'}
            render={({ input }) => (
              <Field>
                <Label data-testid={TEST_IDS.FORM_GREETING_MSG}>
                  {translate('embeddable_framework.chat.postChat.rating.new_title')}
                </Label>

                <RatingGroup
                  rating={input.value}
                  updateRating={(rating) => {
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
                  onChange={(e) => {
                    input.onChange(e.target.value)
                  }}
                />
              </Field>
            )}
          />

          {submitError && (
            <Alert type="error" role="alert">
              <Title>{translate(submitError)}</Title>
            </Alert>
          )}

          <ButtonGroup>
            <SecondaryButton
              onClick={handleSecondaryButtonClick}
              data-testid={TEST_IDS.BUTTON_CANCEL}
              aria-label={secondaryButtonText}
            >
              {secondaryButtonText}
            </SecondaryButton>

            <SubmitButton
              isPrimary={true}
              type="submit"
              data-testid={TEST_IDS.BUTTON_OK}
              aria-label={translate('embeddable_framework.common.button.send')}
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
  rating: ChatPropTypes.chatRating.isRequired,
  secondaryButtonText: PropTypes.string.isRequired,
  handleSecondaryButtonClick: PropTypes.func,
  submitForm: PropTypes.func.isRequired,
}

export default FeedbackForm
