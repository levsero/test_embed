import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Footer } from 'src/components/Widget'
import { Button } from '@zendeskgarden/react-buttons'
import { TEST_IDS } from 'constants/shared'
import FormField from 'src/embeds/support/components/FormField'
import { convertFieldValue, mapKeyFields } from 'src/embeds/support/utils/fieldConversion'
import { getValidate } from 'src/embeds/support/utils/formFieldRules'
import FormStateRetriever from 'src/embeds/support/components/TicketForm/FormStateRetriever'
import { Form as ReactFinalForm } from 'react-final-form'
import { Form as StyledForm, Main, FieldWrapper } from './styles'
import { Field } from 'react-final-form'
import { useTranslate } from 'src/hooks/useTranslation'
import { useSubmit } from 'src/hooks/useSubmit'

const TicketForm = ({ formName, formState, readOnlyState, submitForm, ticketFields }) => {
  const mappedTicketFields = mapKeyFields(ticketFields)
  const translate = useTranslate()
  const [showErrors, setShowFormErrors] = useState(false)

  const validate = getValidate(mappedTicketFields, translate)

  const onSubmit = useSubmit(submitForm, validate, setShowFormErrors, mappedTicketFields)

  return (
    <ReactFinalForm
      validate={values => validate(values, showErrors)}
      onSubmit={onSubmit}
      initialValues={formState}
      render={({ handleSubmit, submitting }) => (
        <StyledForm
          onSubmit={handleSubmit}
          noValidate={true}
          data-testid={TEST_IDS.SUPPORT_TICKET_FORM}
        >
          <FormStateRetriever formName={formName} />
          <Main>
            {mappedTicketFields.map(field => (
              <FieldWrapper key={field.id}>
                <Field
                  name={field.keyID || field.title_in_portal}
                  key={field.id}
                  render={({ input, meta }) => (
                    <FormField
                      key={input}
                      field={field}
                      errorMessage={showErrors ? meta.error : ''}
                      value={convertFieldValue(field.type, input.value)}
                      onChange={value => input.onChange(value)}
                      readOnly={readOnlyState[field.keyID]}
                    />
                  )}
                />
              </FieldWrapper>
            ))}
          </Main>
          <Footer>
            <Button primary={true} type="submit" disabled={submitting} data-testid={'submitButton'}>
              {translate(
                submitting
                  ? 'embeddable_framework.submitTicket.form.submitButton.label.sending'
                  : 'embeddable_framework.submitTicket.form.submitButton.label.send'
              )}
            </Button>
          </Footer>
        </StyledForm>
      )}
    />
  )
}

TicketForm.propTypes = {
  formName: PropTypes.string.isRequired,
  formState: PropTypes.object,
  readOnlyState: PropTypes.objectOf(PropTypes.bool).isRequired,
  submitForm: PropTypes.func.isRequired,
  ticketFields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      keyID: PropTypes.string,
      title_in_portal: PropTypes.string,
      type: PropTypes.string
    })
  ).isRequired
}

export default TicketForm
