import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form as ReactFinalForm } from 'react-final-form'
import useTranslate from 'src/hooks/useTranslate'
import validateTicketForm from 'src/embeds/support/utils/validateTicketForm'
import Form from 'embeds/support/components/TicketForm/Form'
import _ from 'lodash'
import SupportPropTypes from 'embeds/support/utils/SupportPropTypes'
import getFields from 'embeds/support/utils/getFields'
import { FORM_ERROR } from 'final-form'

const TicketFormProvider = ({
  formName,
  formState,
  readOnlyState,
  submitForm,
  ticketFields,
  ticketFormTitle,
  conditions = [],
  attachments
}) => {
  const translate = useTranslate()
  const [showErrors, setShowFormErrors] = useState(false)

  const handleSubmit = (values, _form, callback) => {
    setShowFormErrors(true)
    const fields = getFields(values, conditions, ticketFields)

    const errors = validateTicketForm(fields, translate, values, attachments)

    if (_.isEmpty(errors)) {
      const valuesToSubmit = {}

      fields.forEach(field => {
        valuesToSubmit[field.id] = values[field.keyID]
      })

      Promise.resolve(submitForm(valuesToSubmit))
        .then(() => {
          callback()
        })
        .catch(() => {
          callback({ [FORM_ERROR]: '' })
        })
    } else {
      callback(errors)
    }
  }

  return (
    <ReactFinalForm
      validate={values => {
        if (!showErrors) {
          return null
        }

        return validateTicketForm(ticketFields, translate, values, attachments)
      }}
      onSubmit={handleSubmit}
      initialValues={formState}
      render={({ handleSubmit, submitting }) => (
        <>
          <Form
            ticketFormTitle={ticketFormTitle}
            isSubmitting={submitting}
            onSubmit={handleSubmit}
            formName={formName}
            showErrors={showErrors}
            fields={ticketFields}
            readOnlyState={readOnlyState}
            conditions={conditions}
          />
        </>
      )}
    />
  )
}

TicketFormProvider.propTypes = {
  formName: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  formState: PropTypes.object,
  readOnlyState: SupportPropTypes.readOnlyState.isRequired,
  submitForm: PropTypes.func.isRequired,
  ticketFields: PropTypes.arrayOf(SupportPropTypes.ticketField).isRequired,
  ticketFormTitle: PropTypes.string,
  conditions: SupportPropTypes.conditions,
  attachments: PropTypes.array
}

export default TicketFormProvider
