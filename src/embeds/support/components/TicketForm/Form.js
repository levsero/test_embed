import React from 'react'
import PropTypes from 'prop-types'
import { TEST_IDS } from 'constants/shared'
import { Main, Footer } from 'components/Widget'
import { Button } from '@zendeskgarden/react-buttons'
import useTranslate from 'src/hooks/useTranslate'
import { Field } from 'react-final-form'
import FormField from 'embeds/support/components/FormField'
import { convertFieldValue } from 'embeds/support/utils/fieldConversion'
import useFormBackup from 'embeds/support/hooks/useFormBackup'
import useWidgetFormApis from 'embeds/support/hooks/useWidgetFormApis'
import SupportPropTypes from 'embeds/support/utils/SupportPropTypes'
import useConditionalFields from 'embeds/support/hooks/useConditionalFields'
import { FORM_ERROR } from 'final-form'
import { Alert, Title } from 'src/embeds/support/components/Alert'
import { Fields, FormContainer, TicketFormTitle } from './styles'

const Form = ({
  isSubmitting,
  onSubmit,
  formId,
  showErrors,
  fields,
  readOnlyState,
  conditions,
  ticketFormTitle,
  submitErrorMessage,
  errorMessageKey,
  isPreview
}) => {
  const translate = useTranslate()
  useFormBackup(formId)
  useWidgetFormApis(formId)

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
                    errorMessage={showErrors && meta.error ? translate(meta.error) : ''}
                    value={convertFieldValue(field.type, input.value)}
                    onChange={value => input.onChange(value)}
                    isReadOnly={isPreview || readOnlyState[field.keyID]}
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
  formId: PropTypes.string,
  ticketFormTitle: PropTypes.string,
  showErrors: PropTypes.bool,
  fields: PropTypes.arrayOf(SupportPropTypes.ticketField),
  readOnlyState: SupportPropTypes.readOnlyState,
  conditions: SupportPropTypes.conditions,
  submitErrorMessage: PropTypes.string,
  errorMessageKey: PropTypes.number,
  isPreview: PropTypes.bool
}

export default Form
