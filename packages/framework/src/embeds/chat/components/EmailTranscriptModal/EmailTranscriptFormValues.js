import PropTypes from 'prop-types'
import { Field, Input, Label, Message } from '@zendeskgarden/react-forms'
import useTranslate from 'src/hooks/useTranslate'
import { useForm, Field as ReactFinalFormField } from 'react-final-form'
import useOnClear from 'embeds/webWidget/hooks/useOnClear'

const EmailTranscriptFormValues = ({ showErrors }) => {
  const translate = useTranslate()
  const form = useForm()

  useOnClear(() => {
    form.reset({})
  })

  return (
    <ReactFinalFormField
      name="email"
      render={({ input, meta }) => (
        <Field>
          <Label>{translate('embeddable_framework.common.textLabel.email')}</Label>
          <Input
            onChange={(e) => {
              input.onChange(e.target.value)
            }}
            ref={(ref) => {
              setTimeout(() => {
                ref?.focus()
              }, 0)
            }}
            value={input.value}
            name="email"
          />
          {meta.error && showErrors && (
            <Message validation="error">
              {translate('embeddable_framework.validation.error.email')}
            </Message>
          )}
        </Field>
      )}
    />
  )
}

EmailTranscriptFormValues.propTypes = {
  showErrors: PropTypes.bool,
}

export default EmailTranscriptFormValues
