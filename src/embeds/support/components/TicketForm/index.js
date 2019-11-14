import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Footer } from 'src/components/Widget'
import { Button } from '@zendeskgarden/react-buttons'
import FormField from 'src/embeds/support/components/FormField'
import {
  convertFieldValue,
  getParsedValues,
  mapKeyFields
} from 'src/embeds/support/utils/fieldConversion'
import { getValidate } from 'src/embeds/support/utils/formFieldRules'
import FormStateRetriever from 'src/embeds/support/components/TicketForm/FormStateRetriever'
import { Form as ReactFinalForm } from 'react-final-form'
import { Form as StyledForm, Main, FieldWrapper } from './styles'
import { Field } from 'react-final-form'
import _ from 'lodash'
import { useTranslate } from 'src/hooks/useTranslation'

const TicketForm = ({ formName, formState, readOnlyState, submitForm, ticketFields }) => {
  const mappedTicketFields = mapKeyFields(ticketFields)
  const translate = useTranslate()
  const sendString = translate('embeddable_framework.submitTicket.form.submitButton.label.send')
  const sendingString = translate(
    'embeddable_framework.submitTicket.form.submitButton.label.sending'
  )

  const [showErrors, setShowFormErrors] = useState(false)

  const validate = getValidate(mappedTicketFields, translate)

  const onSubmit = async (values, _form, callback) => {
    const errors = validate(values, true)
    const parsedValues = getParsedValues(values, mappedTicketFields)

    if (_.isEmpty(errors)) {
      submitForm(parsedValues)
      callback(true)
    } else {
      setShowFormErrors(true)
      callback(false)
    }
  }

  return (
    <ReactFinalForm
      validate={values => validate(values, showErrors)}
      onSubmit={onSubmit}
      initialValues={formState}
      render={({ handleSubmit, submitting }) => (
        <StyledForm onSubmit={handleSubmit} noValidate={true}>
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
              {submitting ? sendingString : sendString}
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
  readOnlyState: PropTypes.object.isRequired,
  submitForm: PropTypes.func.isRequired,
  ticketFields: PropTypes.array.isRequired
}

export default TicketForm
