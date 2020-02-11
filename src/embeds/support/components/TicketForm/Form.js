import React from 'react'
import PropTypes from 'prop-types'
import { TEST_IDS } from 'constants/shared'
import { Footer } from 'components/Widget'
import { Button } from '@zendeskgarden/react-buttons'
import useTranslate from 'src/hooks/useTranslate'
import { Field } from 'react-final-form'
import FormField from 'embeds/support/components/FormField'
import { convertFieldValue } from 'embeds/support/utils/fieldConversion'
import useFormBackup from 'embeds/support/hooks/useFormBackup'
import useUpdateOnPrefill from 'embeds/support/hooks/useUpdateOnPrefill'
import SupportPropTypes from 'embeds/support/utils/SupportPropTypes'
import useConditionalFields from 'embeds/support/hooks/useConditionalFields'
import { FORM_ERROR } from 'final-form'
import { Alert, Title } from 'src/embeds/support/components/Alert'
import { Fields, FormContainer, Main, TicketFormTitle } from './styles'

const Form = ({
  isSubmitting,
  onSubmit,
  formName,
  showErrors,
  fields,
  readOnlyState,
  conditions,
  ticketFormTitle,
  submitErrorMessage,
  errorMessageKey
}) => {
  const translate = useTranslate()
  useFormBackup(formName)
  useUpdateOnPrefill()
  const filteredFields = useConditionalFields(fields, conditions)

  return (
    <FormContainer onSubmit={onSubmit} noValidate={true} data-testid={TEST_IDS.SUPPORT_TICKET_FORM}>
      <Main>
        {ticketFormTitle && <TicketFormTitle>{ticketFormTitle}</TicketFormTitle>}
        <Fields>
          {filteredFields.map(field => (
            <div key={field.keyID}>
              <Field
                name={field.keyID}
                render={({ input, meta }) => (
                  <FormField
                    field={field}
                    errorMessage={showErrors ? meta.error : ''}
                    value={convertFieldValue(field.type, input.value)}
                    onChange={value => input.onChange(value)}
                    isReadOnly={readOnlyState[field.keyID]}
                    errorMessageKey={errorMessageKey}
                  />
                )}
              />
            </div>
          ))}
        </Fields>
        <div data-keyid={FORM_ERROR}>
          {submitErrorMessage && (
            <Alert type="error" role="alert" key={errorMessageKey}>
              <Title>{translate(submitErrorMessage)}</Title>
            </Alert>
          )}
        </div>
      </Main>
      <Footer>
        <Button
          primary={true}
          type="submit"
          disabled={isSubmitting}
          data-testid={TEST_IDS.SUPPORT_SUBMIT_BUTTON}
        >
          {translate(
            isSubmitting
              ? 'embeddable_framework.submitTicket.form.submitButton.label.sending'
              : 'embeddable_framework.submitTicket.form.submitButton.label.send'
          )}
        </Button>
      </Footer>
    </FormContainer>
  )
}

Form.propTypes = {
  isSubmitting: PropTypes.bool,
  onSubmit: PropTypes.func,
  formName: PropTypes.string,
  ticketFormTitle: PropTypes.string,
  showErrors: PropTypes.bool,
  fields: PropTypes.arrayOf(SupportPropTypes.ticketField),
  readOnlyState: SupportPropTypes.readOnlyState,
  conditions: SupportPropTypes.conditions,
  submitErrorMessage: PropTypes.string,
  errorMessageKey: PropTypes.number
}

export default Form
