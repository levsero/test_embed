import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form as ReactFinalForm } from 'react-final-form'
import validateTicketForm from 'src/embeds/support/utils/validateTicketForm'
import Form from 'embeds/support/components/TicketForm/Form'
import SupportPropTypes from 'embeds/support/utils/SupportPropTypes'
import getFields from 'embeds/support/utils/getFields'
import { FORM_ERROR } from 'final-form'
import useScrollToFirstError from 'embeds/support/hooks/useScrollToFirstError'

const TicketFormProvider = ({
  formId,
  formState,
  readOnlyState,
  submitForm,
  ticketFields,
  ticketFormTitle,
  conditions = [],
  attachments,
  isPreview
}) => {
  const [showErrors, setShowFormErrors] = useState(false)
  const scrollToFirstError = useScrollToFirstError()

  // We want screen readers to read out the error message every time the user tries to submit the form.
  // Since in some cases, the error element might already be there, we need a way to get the element to be recreated
  // so that the role="alert" can re-fire and the screen reader reads out the error again,
  // To solve this, we can use React's "key" property to tell React a new element needs to be created
  // whenever the key changes.
  const [errorMessageKey, setErrorMessageKey] = useState(Date.now())

  const onSubmit = (values, _form, callback) => {
    setShowFormErrors(true)
    const fields = getFields(values, conditions, ticketFields)

    const errors = validateTicketForm(fields, values, attachments, conditions)

    if (Object.keys(errors).length === 0) {
      const valuesToSubmit = {}

      fields.forEach(field => {
        valuesToSubmit[field.id] = values[field.keyID]
      })

      Promise.resolve(submitForm(valuesToSubmit))
        .then(() => {
          callback()
        })
        .catch(() => {
          const newErrors = {
            [FORM_ERROR]: 'embeddable_framework.submitTicket.notify.message.error'
          }
          callback(newErrors)
          scrollToFirstError(getFields(values, conditions, ticketFields), newErrors)
        })
    } else {
      callback(errors)

      scrollToFirstError(getFields(values, conditions, ticketFields), errors)
      setErrorMessageKey(Date.now())
    }
  }

  return (
    <ReactFinalForm
      validate={values => {
        if (!showErrors) {
          return null
        }

        return validateTicketForm(ticketFields, values, attachments, conditions)
      }}
      onSubmit={onSubmit}
      initialValues={formState}
      render={({ handleSubmit, submitting, submitError, errors, values }) => (
        <>
          <Form
            ticketFormTitle={ticketFormTitle}
            isSubmitting={submitting}
            isPreview={isPreview}
            onSubmit={e => {
              e.preventDefault()
              if (isPreview) {
                return
              }

              // Since final form won't re-submit when errors exist, we will handle scrolling to the errors here
              // so that the form will re-scroll to the first error every time the user tries to submit
              // the form.
              if (errors) {
                setErrorMessageKey(Date.now())
                scrollToFirstError(getFields(values, conditions, ticketFields), errors)
              }

              handleSubmit()
            }}
            formId={formId}
            showErrors={showErrors}
            fields={ticketFields}
            readOnlyState={readOnlyState}
            conditions={conditions}
            submitErrorMessage={submitError}
            errorMessageKey={errorMessageKey}
          />
        </>
      )}
    />
  )
}

TicketFormProvider.propTypes = {
  formId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  formState: PropTypes.object,
  readOnlyState: SupportPropTypes.readOnlyState.isRequired,
  submitForm: PropTypes.func.isRequired,
  ticketFields: PropTypes.arrayOf(SupportPropTypes.ticketField).isRequired,
  ticketFormTitle: PropTypes.string,
  conditions: SupportPropTypes.conditions,
  attachments: PropTypes.array,
  isPreview: PropTypes.bool
}

export default TicketFormProvider
