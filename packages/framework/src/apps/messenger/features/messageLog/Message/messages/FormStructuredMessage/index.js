import PropTypes from 'prop-types'
import { useContext } from 'react'
import { FormMessage, MESSAGE_STATUS } from '@zendesk/conversation-components'
import useTranslate from 'src/apps/messenger/features/i18n/useTranslate'
import useForm from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/useForm'
import { AnimationContext } from 'src/apps/messenger/features/widget/components/WidgetFrame/FrameAnimation'

const FormStructuredMessage = ({
  message: {
    _id,
    avatarUrl,
    fields,
    status,
    isFirstInGroup,
    isLastMessageInAuthorGroup,
    isFirstMessageInAuthorGroup,
    name,
  },
}) => {
  const isAnimationComplete = useContext(AnimationContext)
  const messageStatus = status ?? MESSAGE_STATUS.sent
  const { onChange, onSubmit, values, formSubmissionStatus, step, onStepChange } = useForm({
    formId: _id,
    fields,
  })
  const translate = useTranslate()

  const errorLabels = {
    requiredField: translate('embeddable_framework.messenger.message.form.field_is_required'),
    invalidEmail: translate('embeddable_framework.messenger.message.form.invalid_email'),
    fieldMinSize: (min) =>
      translate('embeddable_framework.messenger.message.form.invalid_min_characters', {
        count: min,
      }),
    fieldMaxSize: (max) => {
      return max === 1
        ? translate('embeddable_framework.messenger.message.form.invalid_max_characters.one', {
            count: max,
          })
        : translate('embeddable_framework.messenger.message.form.invalid_max_characters.other', {
            count: max,
          })
    },
  }

  return (
    <FormMessage
      avatar={isLastMessageInAuthorGroup ? avatarUrl : undefined}
      label={isFirstMessageInAuthorGroup ? name : undefined}
      fields={fields}
      initialStep={step}
      initialValues={values}
      errorLabels={errorLabels}
      stepStatusLabel={(step, totalSteps) =>
        translate('embeddable_framework.messenger.message.form.step_status', { step, totalSteps })
      }
      nextStepLabel={translate('embeddable_framework.messenger.message.form.next_step')}
      sendLabel={translate('embeddable_framework.messenger.message.form.submit')}
      submittingLabel={translate('embeddable_framework.messenger.message.form.submitting')}
      submissionErrorLabel={translate(
        'embeddable_framework.messenger.message.form.failed_to_submit'
      )}
      status={messageStatus}
      formSubmissionStatus={formSubmissionStatus}
      isFirstInGroup={isFirstInGroup}
      isReceiptVisible={false}
      onStepChange={onStepChange}
      onSubmit={onSubmit}
      onChange={(fieldId, newValue) => {
        onChange({
          [fieldId]: newValue,
        })
      }}
      canFocus={isAnimationComplete}
    />
  )
}

FormStructuredMessage.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.string,
    text: PropTypes.string,
    isFirstInGroup: PropTypes.bool,
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        type: PropTypes.string,
        name: PropTypes.string,
        label: PropTypes.string,
      })
    ),
    avatarUrl: PropTypes.string,
    name: PropTypes.string,
  }),
}

export default FormStructuredMessage
