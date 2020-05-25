import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { TEST_IDS } from 'constants/shared'
import { Main } from 'components/Widget'
import useTranslate from 'src/hooks/useTranslate'
import { Field, useForm } from 'react-final-form'
import { convertFieldValue } from 'embeds/support/utils/fieldConversion'
import SupportPropTypes from 'embeds/support/utils/SupportPropTypes'
import { FORM_ERROR } from 'final-form'
import { Alert, Title } from 'src/embeds/support/components/Notifications'
import { Fields, FormContainer } from './styles'
import useFormBackup from 'components/DynamicForm/hooks/useFormBackup'
import FormField from 'components/DynamicForm/FormField'
import useOnClear from 'embeds/webWidget/hooks/useOnClear'

const Form = ({
  isSubmitting,
  onSubmit,
  formId,
  showErrors,
  fields,
  readOnlyValues,
  submitErrorMessage,
  errorMessageKey,
  isPreview,
  footer: FooterComponent,
  children,
  extraFieldOptions
}) => {
  const translate = useTranslate()
  const form = useForm()
  useFormBackup(formId)

  const onClear = useCallback(() => {
    form.reset({})
  }, [form])
  useOnClear(onClear)

  return (
    <FormContainer onSubmit={onSubmit} noValidate={true} data-testid={TEST_IDS.SUPPORT_TICKET_FORM}>
      <Main>
        {children}

        <Fields>
          {fields.map(field => (
            <div key={field.id}>
              <Field
                name={field.id}
                render={({ input, meta }) => (
                  <FormField
                    extraFieldOptions={extraFieldOptions}
                    field={field}
                    errorMessage={showErrors && meta.error ? translate(meta.error) : ''}
                    value={convertFieldValue(field.type, input.value)}
                    onChange={value => input.onChange(value)}
                    isReadOnly={isPreview || readOnlyValues[field.id]}
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
      {FooterComponent && <FooterComponent isSubmitting={isSubmitting} />}
    </FormContainer>
  )
}

Form.propTypes = {
  isSubmitting: PropTypes.bool,
  onSubmit: PropTypes.func,
  formId: PropTypes.string,
  showErrors: PropTypes.bool,
  fields: PropTypes.arrayOf(SupportPropTypes.ticketField),
  readOnlyValues: PropTypes.objectOf(PropTypes.bool),
  submitErrorMessage: PropTypes.string,
  errorMessageKey: PropTypes.number,
  isPreview: PropTypes.bool,
  footer: PropTypes.elementType,
  extraFieldOptions: PropTypes.objectOf(PropTypes.elementType),
  children: PropTypes.node
}

export default Form