//To use this, just replace <SubmitTicket /> in the WebWidget component
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TicketForm from 'src/embeds/support/components/TicketForm'
import { submitForm } from 'src/embeds/support/actions'
import { Widget, Header } from 'src/components/Widget'
import {
  getConfigNameFieldEnabled,
  getConfigNameFieldRequired
} from 'src/redux/modules/base/base-selectors'
import { getTicketFieldsResponse } from 'src/redux/modules/submitTicket/submitTicket-selectors'
import { getFormState } from 'src/embeds/support/selectors'
import { getCheckboxFields, getNonCheckboxFields } from 'src/embeds/support/utils/fieldConversion'
import { getContactFormTitle } from 'src/redux/modules/selectors'
import { useTranslate } from 'src/hooks/useTranslation'

const ContactForm = ({
  formState,
  formName,
  formTitle,
  nameFieldEnabled,
  nameFieldRequired,
  readOnlyState,
  submitForm,
  ticketFields
}) => {
  const translate = useTranslate()
  const nameString = translate('embeddable_framework.submitTicket.field.name.label')
  const descriptionString = translate('embeddable_framework.submitTicket.field.description.label')
  const emailString = translate('embeddable_framework.form.field.email.label')
  const nameField = {
    id: 'name',
    title_in_portal: nameString,
    required_in_portal: nameFieldRequired,
    type: 'text',
    keyID: 'name'
  }
  const emailField = {
    id: 'email',
    title_in_portal: emailString,
    required_in_portal: true,
    type: 'text',
    validation: 'email',
    keyID: 'email'
  }
  const descriptionField = {
    id: 'description',
    title_in_portal: descriptionString,
    required_in_portal: true,
    type: 'textarea',
    keyID: 'description'
  }

  const contactFormFields = [emailField]
  if (nameFieldEnabled) {
    contactFormFields.unshift(nameField)
  }

  const checkBoxFields = useMemo(() => getCheckboxFields(ticketFields), [ticketFields])
  const nonCheckBoxFields = useMemo(() => getNonCheckboxFields(ticketFields), [ticketFields])
  const concatFields = useMemo(
    () => contactFormFields.concat(nonCheckBoxFields, descriptionField, checkBoxFields),
    [contactFormFields, checkBoxFields, nonCheckBoxFields, descriptionField]
  )

  return (
    <Widget>
      <Header title={formTitle} />
      <TicketForm
        formName={formName}
        formState={formState}
        readOnlyState={readOnlyState}
        submitForm={submitForm}
        ticketFields={concatFields}
      />
    </Widget>
  )
}

ContactForm.propTypes = {
  formState: PropTypes.object,
  formName: PropTypes.string,
  formTitle: PropTypes.string,
  nameFieldEnabled: PropTypes.bool,
  nameFieldRequired: PropTypes.bool,
  readOnlyState: PropTypes.object,
  submitForm: PropTypes.func,
  ticketFields: PropTypes.array
}

ContactForm.defaultProps = {
  formName: 'contactForm',
  readOnlyState: {}
}

const mapStateToProps = state => {
  const formName = 'contactForm'
  return {
    formName,
    formState: getFormState(state, formName),
    formTitle: getContactFormTitle(state),
    nameFieldEnabled: getConfigNameFieldEnabled(state),
    nameFieldRequired: getConfigNameFieldRequired(state),
    ticketFields: getTicketFieldsResponse(state)
  }
}

const actionCreators = {
  submitForm
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators
)(ContactForm)

export { connectedComponent as default, ContactForm as Component }
