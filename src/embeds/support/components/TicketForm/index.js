import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form as ReactFinalForm } from 'react-final-form'
import { TicketFormTitle } from './styles'
import useTranslate from 'src/hooks/useTranslate'
import validateTicketForm from 'src/embeds/support/utils/validateTicketForm'
import Form from 'embeds/support/components/TicketForm/Form'
import { getParsedValues } from 'embeds/support/utils/fieldConversion'
import _ from 'lodash'
import SupportPropTypes from 'embeds/support/utils/SupportPropTypes'

const TicketFormProvider = ({
  formName,
  formState,
  readOnlyState,
  submitForm,
  ticketFields,
  ticketFormTitle
}) => {
  const translate = useTranslate()
  const [showErrors, setShowFormErrors] = useState(false)

  const handleSubmit = (values, _form, callback) => {
    setShowFormErrors(true)

    const errors = validateTicketForm(ticketFields, translate, values)

    const parsedValues = getParsedValues(values, ticketFields)

    if (_.isEmpty(errors)) {
      Promise.resolve(submitForm(parsedValues))
        .then(() => {
          callback(true)
        })
        .catch(() => {
          callback(false)
        })
    } else {
      callback(false)
    }
  }

  return (
    <ReactFinalForm
      validate={values => {
        if (!showErrors) {
          return null
        }

        return validateTicketForm(ticketFields, translate, values)
      }}
      onSubmit={handleSubmit}
      initialValues={formState}
      render={({ handleSubmit, submitting }) => (
        <>
          {ticketFormTitle && <TicketFormTitle>{ticketFormTitle}</TicketFormTitle>}
          <Form
            isSubmitting={submitting}
            onSubmit={handleSubmit}
            formName={formName}
            showErrors={showErrors}
            fields={ticketFields}
            readOnlyState={readOnlyState}
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
  ticketFormTitle: PropTypes.string
}

export default TicketFormProvider
