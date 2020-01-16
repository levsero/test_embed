import React from 'react'
import PropTypes from 'prop-types'
import { TEST_IDS } from 'constants/shared'
import { Footer } from 'components/Widget'
import { Button } from '@zendeskgarden/react-buttons'
import { useTranslate } from 'src/hooks/useTranslation'
import { Field } from 'react-final-form'
import FormField from 'embeds/support/components/FormField'
import { convertFieldValue } from 'embeds/support/utils/fieldConversion'
import useFormBackup from 'embeds/support/hooks/useFormBackup'
import useUpdateOnPrefill from 'embeds/support/hooks/useUpdateOnPrefill'
import SupportPropTypes from 'embeds/support/utils/SupportPropTypes'
import { FieldWrapper, FormContainer, Main } from './styles'

const Form = ({ isSubmitting, onSubmit, formName, showErrors, fields, readOnlyState }) => {
  const translate = useTranslate()
  useFormBackup(formName)
  useUpdateOnPrefill()

  return (
    <FormContainer onSubmit={onSubmit} noValidate={true} data-testid={TEST_IDS.SUPPORT_TICKET_FORM}>
      <Main>
        {fields.map(field => (
          <FieldWrapper key={field.id}>
            <Field
              name={field.keyID}
              key={field.id}
              render={({ input, meta }) => (
                <FormField
                  key={input}
                  field={field}
                  errorMessage={showErrors ? meta.error : ''}
                  value={convertFieldValue(field.type, input.value)}
                  onChange={value => input.onChange(value)}
                  isReadOnly={readOnlyState[field.keyID]}
                />
              )}
            />
          </FieldWrapper>
        ))}
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
  showErrors: PropTypes.bool,
  fields: PropTypes.arrayOf(SupportPropTypes.ticketField),
  readOnlyState: SupportPropTypes.readOnlyState
}

export default Form
