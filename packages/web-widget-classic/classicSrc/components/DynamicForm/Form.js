import FormField from 'classicSrc/components/DynamicForm/FormField'
import useFormBackup from 'classicSrc/components/DynamicForm/hooks/useFormBackup'
import { Main } from 'classicSrc/components/Widget'
import { TEST_IDS } from 'classicSrc/constants/shared'
import { Title } from 'classicSrc/embeds/support/components/Notifications'
import SupportPropTypes from 'classicSrc/embeds/support/utils/SupportPropTypes'
import { convertFieldValue } from 'classicSrc/embeds/support/utils/fieldConversion'
import useOnClear from 'classicSrc/embeds/webWidget/hooks/useOnClear'
import useTranslate from 'classicSrc/hooks/useTranslate'
import { FORM_ERROR } from 'final-form'
import PropTypes from 'prop-types'
import { useCallback } from 'react'
import { Field, useForm, useFormState } from 'react-final-form'
import { Alert, Fields, FormContainer } from './styles'

const Form = ({
  isSubmitting,
  onSubmit,
  formId,
  showErrors,
  fields,
  readOnlyValues,
  submitErrorMessage,
  children,
  errorMessageKey,
  isPreview,
  footer: FooterComponent,
  controls = null,
  extraFieldOptions,
}) => {
  const translate = useTranslate()
  const form = useForm()
  const { values } = useFormState()
  useFormBackup(formId)

  const onClear = useCallback(() => {
    form.reset({})
  }, [form])
  useOnClear(onClear)

  return (
    <FormContainer
      onSubmit={onSubmit}
      noValidate={true}
      data-testid={TEST_IDS.SUPPORT_TICKET_FORM}
      aria-labelledby={'widgetHeaderTitle'}
    >
      <Main>
        {children}

        <Fields>
          {fields.map((field) => (
            <div key={field.id}>
              <Field
                name={field.id}
                render={({ input, meta }) => (
                  <FormField
                    extraFieldOptions={extraFieldOptions}
                    field={field}
                    errorMessage={showErrors && meta.error ? translate(meta.error) : ''}
                    value={convertFieldValue(field.type, input.value)}
                    onChange={(value) => input.onChange(value)}
                    isReadOnly={isPreview || readOnlyValues[field.id]}
                    isPreview={isPreview}
                    errorMessageKey={errorMessageKey}
                  />
                )}
              />
            </div>
          ))}
        </Fields>
        <div data-fieldid={FORM_ERROR}>
          {submitErrorMessage && (
            <Alert type="error" role="alert" key={errorMessageKey}>
              <Title>{translate(submitErrorMessage)}</Title>
            </Alert>
          )}
        </div>
        {controls}
      </Main>
      {FooterComponent && (
        <FooterComponent isSubmitting={isSubmitting} formValues={values} fields={fields} />
      )}
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
  children: PropTypes.node,
  controls: PropTypes.node,
}

export default Form
